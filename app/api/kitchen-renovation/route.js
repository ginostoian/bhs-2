import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import KitchenRenovation from "@/models/KitchenRenovation";
import { sendEmailWithRetry } from "@/libs/emailService";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      isNewPurchase,
      propertyType,
      flatFloor,
      kitchenSize,
      kitchenSizeSqm,
      knockDownWall,
      rewiring,
      kitchenType,
      additionalRequests,
      source,
      customSource,
      hasDetailedInfo,
    } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
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

    if (!address?.trim()) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 },
      );
    }

    if (!isNewPurchase) {
      return NextResponse.json(
        { error: "Please select whether this is a new purchase" },
        { status: 400 },
      );
    }

    if (!propertyType) {
      return NextResponse.json(
        { error: "Please select the property type" },
        { status: 400 },
      );
    }

    if (propertyType === "Flat" && !flatFloor?.trim()) {
      return NextResponse.json(
        { error: "Please specify the floor number for your flat" },
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

    // Create kitchen renovation submission
    const renovationData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      phone: phone.trim(),
      address: address.trim(),
      isNewPurchase,
      propertyType,
      flatFloor: propertyType === "Flat" ? flatFloor?.trim() : undefined,
      kitchenSize: kitchenSize || kitchenSizeSqm,
      source: customSource || source,
      hasDetailedInfo: hasDetailedInfo || false,
      ipAddress,
      userAgent,
    };

    // Add detailed information only if provided and hasDetailedInfo is true
    if (hasDetailedInfo) {
      if (knockDownWall && knockDownWall.trim()) {
        renovationData.knockDownWall = knockDownWall.trim();
      }
      if (rewiring && rewiring.trim()) {
        renovationData.rewiring = rewiring.trim();
      }
      if (kitchenType && kitchenType.trim()) {
        renovationData.kitchenType = kitchenType.trim();
      }
      if (additionalRequests && additionalRequests.trim()) {
        renovationData.additionalRequests = additionalRequests.trim();
      }
    }

    const kitchenRenovation = await KitchenRenovation.create(renovationData);

    // Send confirmation email to customer (async)
    try {
      const confirmationEmail = generateConfirmationEmail(kitchenRenovation);
      const confirmationResult = await sendEmailWithRetry({
        to: kitchenRenovation.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
        text: confirmationEmail.text,
        metadata: {
          type: "kitchen_renovation_confirmation",
          submissionId: kitchenRenovation._id.toString(),
        },
      });

      if (confirmationResult?.success) {
        kitchenRenovation.confirmationEmailSent = true;
        await kitchenRenovation.save();
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
      const adminEmail = generateAdminNotificationEmail(kitchenRenovation);
      const adminResult = await sendEmailWithRetry({
        to: "contact@celli.co.uk",
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
        metadata: {
          type: "kitchen_renovation_admin_notification",
          submissionId: kitchenRenovation._id.toString(),
        },
      });

      if (adminResult?.success) {
        kitchenRenovation.adminNotificationSent = true;
        await kitchenRenovation.save();
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

    return NextResponse.json(
      {
        success: true,
        message: "Kitchen renovation form submitted successfully",
        submissionId: kitchenRenovation._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error submitting kitchen renovation enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 },
    );
  }
}

/**
 * Generate confirmation email for customer
 */
function generateConfirmationEmail(submission) {
  const subject = "Thank you for your kitchen renovation enquiry";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Kitchen Renovation Enquiry Confirmation</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #1f2937; color: white; padding: 30px; text-align: center; }
        .content { padding: 30px; background: #f9fafb; }
        .footer { padding: 20px; text-align: center; color: #6b7280; font-size: 14px; }
        .highlight { background: #dbeafe; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .details { background: #f3f4f6; padding: 15px; border-radius: 8px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>Thank you for your enquiry!</h2>
        </div>
        
        <div class="content">
          <p>Dear ${submission.name},</p>
          
          <p>Thank you for submitting your kitchen renovation enquiry. We have received your request and our team will review it carefully.</p>
          
          <div class="highlight">
            <h3>What happens next?</h3>
            <p>We will review your project requirements and get back to you within 24 hours with a detailed quote and next steps.</p>
          </div>
          
          <div class="details">
            <h3>Your Project Details</h3>
            <p><strong>Property Type:</strong> ${submission.propertyType}${submission.flatFloor ? ` (Floor: ${submission.flatFloor})` : ""}</p>
            <p><strong>Kitchen Size:</strong> ${submission.kitchenSize || "Not specified"}</p>
            <p><strong>New Purchase:</strong> ${submission.isNewPurchase}</p>
            ${
              submission.hasDetailedInfo
                ? `
            <p><strong>Detailed Estimate:</strong> Yes - we have additional information to provide a more accurate quote</p>
            `
                : `
            <p><strong>Detailed Estimate:</strong> No - we will contact you for more details</p>
            `
            }
          </div>
          
          <p>If you have any questions in the meantime, please don't hesitate to contact us at <a href="mailto:contact@celli.co.uk">contact@celli.co.uk</a> or call us directly.</p>
          
          <p>We look forward to helping you create your dream kitchen!</p>
          
          <p>Best regards,<br>
          The Better Homes Studio Team</p>
        </div>
        
        <div class="footer">
          <p>Better Homes Studio<br>
          Professional renovation and construction services</p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Thank you for your kitchen renovation enquiry!

Dear ${submission.name},

Thank you for submitting your kitchen renovation enquiry. We have received your request and our team will review it carefully.

What happens next?
We will review your project requirements and get back to you within 24 hours with a detailed quote and next steps.

Your Project Details:
- Property Type: ${submission.propertyType}${submission.flatFloor ? ` (Floor: ${submission.flatFloor})` : ""}
- Kitchen Size: ${submission.kitchenSize || "Not specified"}
- New Purchase: ${submission.isNewPurchase}
- Detailed Estimate: ${submission.hasDetailedInfo ? "Yes - we have additional information to provide a more accurate quote" : "No - we will contact you for more details"}

If you have any questions in the meantime, please don't hesitate to contact us at contact@celli.co.uk or call us directly.

We look forward to helping you create your dream kitchen!

Best regards,
The Better Homes Studio Team

Better Homes Studio
Professional renovation and construction services
  `;

  return { subject, html, text };
}

/**
 * Generate admin notification email
 */
function generateAdminNotificationEmail(submission) {
  const subject = "New Kitchen Renovation Enquiry";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Kitchen Renovation Enquiry</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc2626; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin: 15px 0; }
        .label { font-weight: bold; color: #374151; }
        .value { background: #f3f4f6; padding: 10px; border-radius: 4px; margin-top: 5px; }
        .section { background: #fef3c7; padding: 15px; border-radius: 8px; margin: 20px 0; }
        .checkbox-list { margin: 10px 0; }
        .checkbox-item { margin: 5px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Kitchen Renovation Enquiry</h2>
        </div>
        
        <div class="content">
          <div class="field">
            <div class="label">Name:</div>
            <div class="value">${submission.name}</div>
          </div>
          
          <div class="field">
            <div class="label">Email:</div>
            <div class="value">${submission.email}</div>
          </div>
          
          <div class="field">
            <div class="label">Phone:</div>
            <div class="value">${submission.phone}</div>
          </div>
          
          <div class="field">
            <div class="label">Address:</div>
            <div class="value">${submission.address}</div>
          </div>
          
          <div class="field">
            <div class="label">Property Type:</div>
            <div class="value">${submission.propertyType}${submission.flatFloor ? ` (Floor: ${submission.flatFloor})` : ""}</div>
          </div>
          
          <div class="field">
            <div class="label">Kitchen Size:</div>
            <div class="value">${submission.kitchenSize || "Not specified"}</div>
          </div>
          
          <div class="field">
            <div class="label">New Purchase:</div>
            <div class="value">${submission.isNewPurchase}</div>
          </div>
          
          <div class="field">
            <div class="label">Source:</div>
            <div class="value">${submission.source || "Not specified"}</div>
          </div>
          
          ${
            submission.hasDetailedInfo
              ? `
          <div class="section">
            <h3>Detailed Information</h3>
            
            ${
              submission.knockDownWall
                ? `
            <div class="field">
              <div class="label">Knock Down Wall:</div>
              <div class="value">${submission.knockDownWall}</div>
            </div>
            `
                : ""
            }
            
            ${
              submission.rewiring
                ? `
            <div class="field">
              <div class="label">Rewiring:</div>
              <div class="value">${submission.rewiring}</div>
            </div>
            `
                : ""
            }
            
            ${
              submission.kitchenType
                ? `
            <div class="field">
              <div class="label">Kitchen Type:</div>
              <div class="value">${submission.kitchenType}</div>
            </div>
            `
                : ""
            }
            
            ${
              submission.additionalRequests
                ? `
            <div class="field">
              <div class="label">Additional Requests:</div>
              <div class="value">${submission.additionalRequests}</div>
            </div>
            `
                : ""
            }
          </div>
          `
              : ""
          }
          
          <div class="field">
            <div class="label">Submission Time:</div>
            <div class="value">${new Date(submission.createdAt).toLocaleString("en-GB")}</div>
          </div>
          
          <div class="field">
            <div class="label">IP Address:</div>
            <div class="value">${submission.ipAddress}</div>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Kitchen Renovation Enquiry

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}
Address: ${submission.address}
Property Type: ${submission.propertyType}${submission.flatFloor ? ` (Floor: ${submission.flatFloor})` : ""}
Kitchen Size: ${submission.kitchenSize || "Not specified"}
New Purchase: ${submission.isNewPurchase}
Source: ${submission.source || "Not specified"}

${
  submission.hasDetailedInfo
    ? `
Detailed Information:
${submission.knockDownWall ? `Knock Down Wall: ${submission.knockDownWall}` : ""}
${submission.rewiring ? `Rewiring: ${submission.rewiring}` : ""}
${submission.kitchenType ? `Kitchen Type: ${submission.kitchenType}` : ""}
${submission.additionalRequests ? `Additional Requests: ${submission.additionalRequests}` : ""}
`
    : ""
}

Submission Time: ${new Date(submission.createdAt).toLocaleString("en-GB")}
IP Address: ${submission.ipAddress}
  `;

  return { subject, html, text };
}
