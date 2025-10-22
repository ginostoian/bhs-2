import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Contact from "@/models/Contact";
import { sendEmailWithRetry } from "@/libs/emailService";
import { rateLimitMiddleware } from "@/libs/rateLimiter";

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
    } = body;

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

    // Content validation - detect bot patterns
    const isBotName = (name) => {
      if (!name || typeof name !== "string") return false;
      const trimmed = name.trim();

      // Check for random character patterns (like the ones in your screenshot)
      // Pattern: long strings with mixed case, numbers, and special chars
      const randomPattern = /^[A-Za-z0-9]{20,}$/;
      const hasRandomPattern = randomPattern.test(trimmed);

      // Check for excessive length (normal names are shorter)
      const isTooLong = trimmed.length > 50;

      // Check for repeated characters
      const hasRepeatedChars = /(.)\1{3,}/.test(trimmed);

      // Check for no spaces in long names (real names usually have spaces)
      const noSpaces = trimmed.length > 15 && !trimmed.includes(" ");

      return hasRandomPattern || isTooLong || hasRepeatedChars || noSpaces;
    };

    // Validate names for bot patterns
    if (isBotName(firstName) || isBotName(lastName)) {
      console.warn("Bot detected: Suspicious name pattern", {
        firstName,
        lastName,
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

    if (!lastName?.trim()) {
      return NextResponse.json(
        { error: "Last name is required" },
        { status: 400 },
      );
    }

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 },
      );
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
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
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      topic,
      customTopic: customTopic?.trim(),
      message: message.trim(),
      ipAddress,
      userAgent,
    };

    const contact = await Contact.create(contactData);

    // Send confirmation email to customer (async)
    try {
      const confirmationEmail = generateConfirmationEmail(contact);
      await sendEmailWithRetry({
        to: contact.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
        text: confirmationEmail.text,
        metadata: {
          type: "contact_confirmation",
          contactId: contact._id.toString(),
        },
      });

      // Update contact record
      contact.confirmationEmailSent = true;
      await contact.save();
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin (async)
    try {
      const adminEmail = generateAdminNotificationEmail(contact);
      await sendEmailWithRetry({
        to: "contact@celli.co.uk",
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
        metadata: {
          type: "contact_admin_notification",
          contactId: contact._id.toString(),
        },
      });

      // Update contact record
      contact.adminNotificationSent = true;
      await contact.save();
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Contact form submitted successfully",
        contactId: contact._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return NextResponse.json(
      { error: "Failed to submit contact form" },
      { status: 500 },
    );
  }
}

// Export the rate-limited handler
export const POST = rateLimitMiddleware(handleContactSubmission);

/**
 * Generate confirmation email for customer
 */
function generateConfirmationEmail(contact) {
  const subject = "Thank you for contacting Better Homes Studio";

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
          <h1>Better Homes Studio</h1>
          <p>Thank you for reaching out!</p>
        </div>
        
        <div class="content">
          <h2>Hello ${contact.firstName},</h2>
          
          <p>Thank you for contacting Better Homes Studio. We&apos;ve received your message and will get back to you as soon as possible.</p>
          
          <div class="highlight">
            <strong>Your message details:</strong><br>
            <strong>Topic:</strong> ${contact.topic}${contact.customTopic ? ` - ${contact.customTopic}` : ""}<br>
            <strong>Submitted:</strong> ${new Date(contact.createdAt).toLocaleString("en-GB")}
          </div>
          
          <p>We typically respond within 24 hours during business days. If you have an urgent inquiry, please don&apos;t hesitate to call us directly.</p>
          
          <p>In the meantime, you might find answers to common questions on our <a href="https://bhstudio.co.uk/faq">FAQ page</a>.</p>
          
          <p>Best regards,<br>
          The Better Homes Studio Team</p>
        </div>
        
        <div class="footer">
          <p>Better Homes Studio<br>
          London, UK<br>
          <a href="https://bhstudio.co.uk">bhstudio.co.uk</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Thank you for contacting Better Homes Studio

Hello ${contact.firstName},

Thank you for contacting Better Homes Studio. We've received your message and will get back to you as soon as possible.

Your message details:
Topic: ${contact.topic}${contact.customTopic ? ` - ${contact.customTopic}` : ""}
Submitted: ${new Date(contact.createdAt).toLocaleString("en-GB")}

We typically respond within 24 hours during business days. If you have an urgent inquiry, please don't hesitate to call us directly.

In the meantime, you might find answers to common questions on our FAQ page: https://bhstudio.co.uk/faq

Best regards,
The Better Homes Studio Team

Better Homes Studio
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
