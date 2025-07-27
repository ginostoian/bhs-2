import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import BathroomRenovation from "@/models/BathroomRenovation";
import { sendEmailWithRetry } from "@/libs/emailService";

/**
 * POST /api/bathroom-renovation
 * Handle bathroom renovation form submissions
 */
export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      phone,
      email,
      address,
      budget,
      source,
      customSource,
      hasDetailedInfo,
      bathroomSize,
      designService,
      startDate,
      keepExisting,
      layout,
      layoutChanges,
      electrics,
      underfloorHeating,
      bathroomSuite,
      tiling,
      decorating,
      additionalInfo,
    } = body;

    // Validate required fields
    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!phone?.trim()) {
      return NextResponse.json(
        { error: "Phone number is required" },
        { status: 400 },
      );
    }

    if (!email?.trim() || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email address is required" },
        { status: 400 },
      );
    }

    if (!address?.trim()) {
      return NextResponse.json(
        { error: "Address is required" },
        { status: 400 },
      );
    }

    // Validate source if provided
    if (source === "Other" && !customSource?.trim()) {
      return NextResponse.json(
        { error: "Please specify how you found us" },
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

    // Create bathroom renovation submission
    const bathroomData = {
      name: name.trim(),
      phone: phone.trim(),
      email: email.trim().toLowerCase(),
      address: address.trim(),
      budget,
      source,
      customSource: customSource?.trim(),
      hasDetailedInfo: hasDetailedInfo || false,
      ipAddress,
      userAgent,
    };

    // Add detailed information if provided
    if (hasDetailedInfo) {
      Object.assign(bathroomData, {
        bathroomSize,
        designService,
        startDate: startDate?.trim(),
        keepExisting: keepExisting?.trim(),
        layout,
        layoutChanges: layoutChanges?.trim(),
        electrics: electrics || {},
        underfloorHeating,
        bathroomSuite: bathroomSuite || {},
        tiling: tiling || {},
        decorating: decorating || {},
        additionalInfo: additionalInfo?.trim(),
      });
    }

    const bathroomRenovation = await BathroomRenovation.create(bathroomData);

    // Send confirmation email to customer (async)
    try {
      const confirmationEmail = generateConfirmationEmail(bathroomRenovation);
      await sendEmailWithRetry({
        to: bathroomRenovation.email,
        subject: confirmationEmail.subject,
        html: confirmationEmail.html,
        text: confirmationEmail.text,
        metadata: {
          type: "bathroom_renovation_confirmation",
          submissionId: bathroomRenovation._id.toString(),
        },
      });

      // Update submission record
      bathroomRenovation.confirmationEmailSent = true;
      await bathroomRenovation.save();
    } catch (emailError) {
      console.error("Failed to send confirmation email:", emailError);
      // Don't fail the request if email fails
    }

    // Send notification email to admin (async)
    try {
      const adminEmail = generateAdminNotificationEmail(bathroomRenovation);
      await sendEmailWithRetry({
        to: "contact@celli.co.uk",
        subject: adminEmail.subject,
        html: adminEmail.html,
        text: adminEmail.text,
        metadata: {
          type: "bathroom_renovation_admin_notification",
          submissionId: bathroomRenovation._id.toString(),
        },
      });

      // Update submission record
      bathroomRenovation.adminNotificationSent = true;
      await bathroomRenovation.save();
    } catch (emailError) {
      console.error("Failed to send admin notification email:", emailError);
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        message: "Bathroom renovation form submitted successfully",
        submissionId: bathroomRenovation._id.toString(),
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error submitting bathroom renovation form:", error);
    return NextResponse.json(
      { error: "Failed to submit bathroom renovation form" },
      { status: 500 },
    );
  }
}

/**
 * Generate confirmation email for customer
 */
function generateConfirmationEmail(submission) {
  const subject = "Thank you for your bathroom renovation enquiry";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Bathroom Renovation Enquiry Confirmation</title>
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
          <h1>Better Homes Studio</h1>
          <p>Bathroom Renovation Enquiry</p>
        </div>
        
        <div class="content">
          <h2>Hello ${submission.name},</h2>
          
          <p>Thank you for your bathroom renovation enquiry with Better Homes Studio. We&apos;ve received your details and our team will be in touch within 24 hours to discuss your project.</p>
          
          <div class="highlight">
            <strong>Your enquiry details:</strong><br>
            <strong>Address:</strong> ${submission.address}<br>
            <strong>Budget:</strong> ${submission.budget || "Not specified"}<br>
            <strong>Submitted:</strong> ${new Date(submission.createdAt).toLocaleString("en-GB")}
          </div>
          
          ${
            submission.hasDetailedInfo
              ? `
          <div class="details">
            <strong>Detailed Information Provided:</strong><br>
            • Bathroom Size: ${submission.bathroomSize}<br>
            • Design Service: ${submission.designService}<br>
            • Start Date: ${submission.startDate || "Not specified"}<br>
            • Layout: ${submission.layout || "Not specified"}
          </div>
          `
              : ""
          }
          
          <p>We typically respond within 24 hours during business days. If you have an urgent enquiry, please don&apos;t hesitate to call us directly.</p>
          
          <p>If you have any supporting photos, documentation, or additional information, please send them to <strong>contact@celli.co.uk</strong> with the subject line containing your postcode: <strong>${submission.address.split(" ").pop()}</strong></p>
          
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
Bathroom Renovation Enquiry Confirmation

Hello ${submission.name},

Thank you for your bathroom renovation enquiry with Better Homes Studio. We've received your details and our team will be in touch within 24 hours to discuss your project.

Your enquiry details:
Address: ${submission.address}
Budget: ${submission.budget || "Not specified"}
Submitted: ${new Date(submission.createdAt).toLocaleString("en-GB")}

${
  submission.hasDetailedInfo
    ? `
Detailed Information Provided:
• Bathroom Size: ${submission.bathroomSize}
• Design Service: ${submission.designService}
• Start Date: ${submission.startDate || "Not specified"}
• Layout: ${submission.layout || "Not specified"}
`
    : ""
}

We typically respond within 24 hours during business days. If you have an urgent enquiry, please don't hesitate to call us directly.

If you have any supporting photos, documentation, or additional information, please send them to contact@celli.co.uk with the subject line containing your postcode: ${submission.address.split(" ").pop()}

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
function generateAdminNotificationEmail(submission) {
  const subject = `New Bathroom Renovation Enquiry - ${submission.address.split(" ").pop()}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>New Bathroom Renovation Enquiry</title>
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
          <h2>New Bathroom Renovation Enquiry</h2>
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
            <div class="label">Budget:</div>
            <div class="value">${submission.budget || "Not specified"}</div>
          </div>
          
          <div class="field">
            <div class="label">Source:</div>
            <div class="value">${submission.source}${submission.customSource ? ` - ${submission.customSource}` : ""}</div>
          </div>
          
          ${
            submission.hasDetailedInfo
              ? `
          <div class="section">
            <h3>Detailed Information</h3>
            
            <div class="field">
              <div class="label">Bathroom Size:</div>
              <div class="value">${submission.bathroomSize}</div>
            </div>
            
            <div class="field">
              <div class="label">Design Service:</div>
              <div class="value">${submission.designService}</div>
            </div>
            
            <div class="field">
              <div class="label">Start Date:</div>
              <div class="value">${submission.startDate || "Not specified"}</div>
            </div>
            
            <div class="field">
              <div class="label">Keep Existing:</div>
              <div class="value">${submission.keepExisting || "Not specified"}</div>
            </div>
            
            <div class="field">
              <div class="label">Layout:</div>
              <div class="value">${submission.layout || "Not specified"}</div>
            </div>
            
            ${
              submission.layoutChanges
                ? `
            <div class="field">
              <div class="label">Layout Changes:</div>
              <div class="value">${submission.layoutChanges}</div>
            </div>
            `
                : ""
            }
            
            <div class="field">
              <div class="label">Underfloor Heating:</div>
              <div class="value">${submission.underfloorHeating || "Not specified"}</div>
            </div>
            
            ${
              submission.additionalInfo
                ? `
            <div class="field">
              <div class="label">Additional Information:</div>
              <div class="value">${submission.additionalInfo}</div>
            </div>
            `
                : ""
            }
            
            <h4>Electrics:</h4>
            <div class="checkbox-list">
              ${Object.entries(submission.electrics || {})
                .map(
                  ([key, value]) =>
                    `<div class="checkbox-item">${value ? "✅" : "❌"} ${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</div>`,
                )
                .join("")}
            </div>
            
            <h4>Bathroom Suite:</h4>
            <div class="checkbox-list">
              ${Object.entries(submission.bathroomSuite || {})
                .map(
                  ([key, value]) =>
                    `<div class="checkbox-item">${value ? "✅" : "❌"} ${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</div>`,
                )
                .join("")}
            </div>
            
            <h4>Tiling:</h4>
            <div class="checkbox-list">
              ${Object.entries(submission.tiling || {})
                .map(
                  ([key, value]) =>
                    `<div class="checkbox-item">${value ? "✅" : "❌"} ${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</div>`,
                )
                .join("")}
            </div>
            
            <h4>Decorating:</h4>
            <div class="checkbox-list">
              ${Object.entries(submission.decorating || {})
                .map(
                  ([key, value]) =>
                    `<div class="checkbox-item">${value ? "✅" : "❌"} ${key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}</div>`,
                )
                .join("")}
            </div>
          </div>
          `
              : ""
          }
          
          <div class="field">
            <div class="label">Submitted:</div>
            <div class="value">${new Date(submission.createdAt).toLocaleString("en-GB")}</div>
          </div>
          
          <div class="field">
            <div class="label">Submission ID:</div>
            <div class="value">${submission._id}</div>
          </div>
          
          <p><a href="https://bhstudio.co.uk/admin/bathroom-renovations">View in Admin Panel</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
New Bathroom Renovation Enquiry

Name: ${submission.name}
Email: ${submission.email}
Phone: ${submission.phone}
Address: ${submission.address}
Budget: ${submission.budget || "Not specified"}
Source: ${submission.source}${submission.customSource ? ` - ${submission.customSource}` : ""}

${
  submission.hasDetailedInfo
    ? `
DETAILED INFORMATION:
Bathroom Size: ${submission.bathroomSize}
Design Service: ${submission.designService}
Start Date: ${submission.startDate || "Not specified"}
Keep Existing: ${submission.keepExisting || "Not specified"}
Layout: ${submission.layout || "Not specified"}
Layout Changes: ${submission.layoutChanges || "Not specified"}
Underfloor Heating: ${submission.underfloorHeating || "Not specified"}
Additional Info: ${submission.additionalInfo || "Not specified"}

Electrics: ${
        Object.entries(submission.electrics || {})
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(", ") || "None selected"
      }
Bathroom Suite: ${
        Object.entries(submission.bathroomSuite || {})
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(", ") || "None selected"
      }
Tiling: ${
        Object.entries(submission.tiling || {})
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(", ") || "None selected"
      }
Decorating: ${
        Object.entries(submission.decorating || {})
          .filter(([, value]) => value)
          .map(([key]) => key)
          .join(", ") || "None selected"
      }
`
    : ""
}

Submitted: ${new Date(submission.createdAt).toLocaleString("en-GB")}
Submission ID: ${submission._id}

View in Admin Panel: https://bhstudio.co.uk/admin/bathroom-renovations
  `;

  return { subject, html, text };
}
