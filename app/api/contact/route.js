import { withPublicForm } from "@/libs/publicForm";
import { sanitizeAttribution } from "@/libs/marketingAttribution";
import { sanitizeQualification } from "@/libs/enquiryFields";
import { persistContact, acceptedSubmission } from "@/libs/contactSubmission";
import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Contact from "@/models/Contact";
import Lead from "@/models/Lead";
import { sendEmailWithRetry } from "@/libs/emailService";
import { notifyAdminFormSubmission } from "@/libs/notificationService";
import {
  findPartnerByReferralCode,
  syncPartnerReferralFromLead,
} from "@/libs/referrals";

/**
 * POST /api/contact
 * Handle contact form submissions
 */
async function handleContactSubmission(request) {
  try {
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      phone,
      topic,
      customTopic,
      message,
      website,
      company,
      referralCode: referralCodeFromBody,
    } = body;

    if (
      [
        firstName,
        lastName,
        email,
        phone,
        topic,
        customTopic,
        message,
        website,
        company,
        referralCodeFromBody,
      ].some((value) => value != null && typeof value !== "string")
    ) {
      return NextResponse.json(
        { error: "Invalid field type" },
        { status: 400 },
      );
    }

    // Honeypot validation - reject if honeypot fields are filled
    if (website?.trim() || company?.trim()) {
      console.warn("Bot detected: Honeypot fields filled", {
        website,
        company,
      });
      return NextResponse.json(
        { error: "Invalid submission" },
        { status: 400 },
      );
    }

    // Validate required fields
    if (!firstName?.trim()) {
      return NextResponse.json(
        { error: "First name is required" },
        { status: 400 },
      );
    }

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 },
      );
    }

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 });
    }

    if (topic === "Other" && !customTopic?.trim()) {
      return NextResponse.json(
        { error: "Please specify your topic" },
        { status: 400 },
      );
    }

    if (!message?.trim()) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Connect to database
    await connectMongo();

    // Get client information
    const ipAddress =
      request.headers.get("x-forwarded-for") ||
      request.headers.get("x-real-ip") ||
      "unknown";
    const userAgent = request.headers.get("user-agent") || "unknown";

    // Create contact submission
    const contactData = {
      firstName: firstName.trim(),
      lastName: lastName?.trim() || "",
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || "",
      topic,
      customTopic: customTopic?.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
      attribution: sanitizeAttribution(body.attribution),
      qualification: sanitizeQualification(body.qualification),
      referralCode: (
        referralCodeFromBody ||
        request.cookies.get("bhs_referral_code")?.value ||
        ""
      )
        .trim()
        .toLowerCase()
        .slice(0, 100),
    };

    const { contact, duplicate } = await persistContact(
      Contact,
      contactData,
      body.submissionEventId,
    );
    if (duplicate) {
      await linkContactLead(contact);
      return NextResponse.json(acceptedSubmission(contact));
    }
    try {
      const topicLabel =
        topic === "Other" ? customTopic?.trim() || "Other" : topic;
      await notifyAdminFormSubmission({
        title: "New Contact Form Submission",
        message: `${contact.firstName} ${contact.lastName} submitted a contact enquiry about ${topicLabel}.`,
        metadata: {
          formType: "contact",
          contactId: contact._id.toString(),
          name: `${contact.firstName} ${contact.lastName}`,
          email: contact.email,
          phone: contact.phone,
          topic: topicLabel,
        },
      });
    } catch (notificationError) {
      console.error(
        "Failed to create internal notification for contact submission:",
        notificationError,
      );
    }

    // Send confirmation email to customer (async)
    try {
      const confirmationEmail = generateConfirmationEmail(contact);
      const confirmationResult = await sendEmailWithRetry({
        to: contact.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
        text: confirmationEmail.text,
        metadata: {
          type: "contact_confirmation",
          contactId: contact._id.toString(),
        },
      });

      if (confirmationResult?.success) {
        contact.confirmationEmailSent = true;
        await contact.save();
      } else {
        console.error(
          "Failed to send confirmation email:",
          confirmationResult?.error || "Unknown email error",
        );
      }
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin (async)
    try {
      const adminEmail = generateAdminNotificationEmail(contact);
      const adminResult = await sendEmailWithRetry({
        to: "contact@celli.co.uk",
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
        metadata: {
          type: "contact_admin_notification",
          contactId: contact._id.toString(),
        },
      });

      if (adminResult?.success) {
        contact.adminNotificationSent = true;
        await contact.save();
      } else {
        console.error(
          "Failed to send admin notification email:",
          adminResult?.error || "Unknown email error",
        );
      }
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the request if email fails
    }

    // Notify the team before CRM linking so a recoverable CRM failure cannot hide a saved enquiry.
    await linkContactLead(contact);
    return NextResponse.json(acceptedSubmission(contact));
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: error.status ? error.message : "Failed to submit contact form" },
      { status: error.status || 500 },
    );
  }
}

async function linkContactLead(contact) {
  if (contact.leadId || contact.topic !== "New Project") return;
  const partner = contact.referralCode
    ? await findPartnerByReferralCode(contact.referralCode)
    : null;
  // Keep established CRM classification; marketing and partner attribution are separate.
  let lead = await Lead.findOne({ email: contact.email }).select("_id");
  if (!lead) {
    const projectTypes = {
      Extension: "Extension",
      "Loft conversion": "Loft Conversion",
      "Whole-home renovation": "Home renovation",
      "Kitchen renovation": "Kitchen renovation",
      "Bathroom renovation": "Bathroom renovation",
    };
    lead = await Lead.findOneAndUpdate(
      { _id: contact._id },
      {
        $setOnInsert: {
          name: `${contact.firstName} ${contact.lastName}`.trim(),
          email: contact.email,
          phone: contact.phone,
          source: partner
            ? "Referral"
            : contact.attribution?.medium === "organic" &&
                contact.attribution?.source === "google"
              ? "Google"
              : "Other",
          ...(partner
            ? { referredBy: partner._id, referralSource: "share_link" }
            : {}),
          attribution: contact.attribution,
          qualification: contact.qualification,
          projectTypes: projectTypes[contact.qualification?.service]
            ? [projectTypes[contact.qualification.service]]
            : [],
          stage: "New Enquiry",
        },
      },
      { upsert: true, new: true, runValidators: true },
    );
    if (partner) {
      await syncPartnerReferralFromLead(lead);
      try {
        const { initializeEmailAutomation } = await import(
          "@/libs/crmEmailAutomation"
        );
        await initializeEmailAutomation(lead._id, lead.stage);
      } catch (error) {
        console.error(
          "Failed to initialize existing referral automation",
          error.name,
        );
      }
    }
  }
  contact.leadId = lead._id;
  await contact.save();
}

// Export the rate-limited handler
export const POST = withPublicForm(handleContactSubmission, "contact");

/**
 * Generate confirmation email for customer
 */
function generateConfirmationEmail(contact) {
  const subject = "Thank you for contacting Better Homes";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Contact Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Better Homes</h1>
          <p>Thank you for reaching out!</p>
        </div>
        
        <div class="content">
          <h2>Hello ${contact.firstName},</h2>
          
          <p>Thank you for contacting Better Homes. We&apos;ve received your message and will get back to you as soon as possible.</p>
          
          <div class="highlight">
            <strong>Your message details:</strong><br>
            <strong>Topic:</strong> ${contact.topic}${contact.customTopic ? ` - ${contact.customTopic}` : ""}<br>
            <strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString("en-GB")}
          </div>
          
          <p>We typically respond within 24 hours during business days. If you have an urgent inquiry, please don&apos;t hesitate to call us directly.</p>
          
          <p>In the meantime, you might find answers to common questions on our <a href="https://bhstudio.co.uk/faq">FAQ page</a>.</p>
          
          <p>Best regards,<br>
          The Better Homes Team</p>
        </div>
        
        <div class="footer">
          <p>Better Homes<br>
          London, UK<br>
          <a href="https://bhstudio.co.uk">bhstudio.co.uk</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Thank you for contacting Better Homes

Hello ${contact.firstName},

Thank you for contacting Better Homes. We've received your message and will get back to you as soon as possible.

Your message details:
Topic: ${contact.topic}${contact.customTopic ? ` - ${contact.customTopic}` : ""}
Submitted: ${new Date(contact.createdAt).toLocaleString("en-GB")}

We typically respond within 24 hours during business days. If you have an urgent inquiry, please don't hesitate to call us directly.

In the meantime, you might find answers to common questions on our FAQ page: https://bhstudio.co.uk/faq

Best regards,
The Better Homes Team

Better Homes
London, UK
https://bhstudio.co.uk
  `;

  return { subject, html, text };
}

/**
 * Generate admin notification email
 */
function generateAdminNotificationEmail(contact) {
  const subject = `New Contact Form Submission - ${contact.topic}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Contact Form Submission</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin: 15px 0; }
        .label { font-weight: bold; color: #374151; }
        .value { background: #f3f4f6; padding: 10px; border-radius: 4px; margin-top: 5px; }
        .message { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Contact Form Submission</h2>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${contact.firstName} ${contact.lastName}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${contact.email}</div>
          </div>
          
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${contact.phone}</div>
          </div>
          
          <div class="field">
            <div class="label">Topic:</div>
            <div class="value">${contact.topic}${contact.customTopic ? ` - ${contact.customTopic}` : ""}</div>
          </div>
          
          <div class="field">
            <div class="label">Message:</div>
            <div class="message">${contact.message.replace(/\n/g, "<br>")}</div>
          </div>
          
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date(contact.createdAt).toLocaleString("en-GB")}</div>
          </div>
          
          <div class="field">
            <div class="label">Contact ID:</div>
            <div class="value">${contact._id}</div>
          </div>
          
          <p><a href="https://bhstudio.co.uk/admin/contact-submissions">View in Admin Panel</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Contact Form Submission

Name: ${contact.firstName} ${contact.lastName}
Email: ${contact.email}
Phone: ${contact.phone}
Topic: ${contact.topic}${contact.customTopic ? ` - ${contact.customTopic}` : ""}

Message:
${contact.message}

Submitted: ${new Date(contact.createdAt).toLocaleString("en-GB")}
Contact ID: ${contact._id}

View in Admin Panel: https://bhstudio.co.uk/admin/contact-submissions
  `;

  return { subject, html, text };
}
