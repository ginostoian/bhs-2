import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";
import EmailAutomation from "@/models/EmailAutomation";
import { handleLeadReply } from "@/libs/crmEmailAutomation";

/**
 * Resend Email Events Webhook
 * Handles email events like opens, clicks, bounces, etc.
 * We can use this to detect engagement and potential replies
 */
export async function POST(req) {
  try {
    console.log("📧 Resend email event webhook received");

    // Connect to MongoDB
    await connectMongoose();

    // Parse the webhook payload
    const body = await req.json();
    console.log("📧 Event payload:", JSON.stringify(body, null, 2));

    // Extract event details
    const {
      type,
      data: {
        email,
        message_id,
        created_at,
        // Additional fields based on event type
        reason,
        code,
        domain,
        url,
      },
    } = body;

    console.log(`📧 Processing ${type} event for email: ${email}`);

    // Find lead by email
    const lead = await Lead.findOne({
      email: email.toLowerCase().trim(),
      isActive: true,
      isArchived: false,
    });

    if (!lead) {
      console.log(`❌ No active lead found for email: ${email}`);
      return NextResponse.json({ message: "No active lead found" });
    }

    console.log(`✅ Found lead: ${lead.name} (${lead.email})`);

    // Check if this lead has an active email automation
    const automation = await EmailAutomation.findOne({
      leadId: lead._id,
      isActive: true,
    });

    if (!automation) {
      console.log(`❌ No active email automation found for lead: ${lead.name}`);
      return NextResponse.json({ message: "No active automation found" });
    }

    console.log(`✅ Found active automation for lead: ${lead.name}`);

    // Handle different event types
    let result = null;

    switch (type) {
      case "email.opened":
        result = await handleEmailOpened(lead._id, automation, email);
        break;

      case "email.clicked":
        result = await handleEmailClicked(lead._id, automation, email, url);
        break;

      case "email.bounced":
        result = await handleEmailBounced(lead._id, automation, email, reason);
        break;

      case "email.complained":
        result = await handleEmailComplained(lead._id, automation, email);
        break;

      case "email.failed":
        result = await handleEmailFailed(lead._id, automation, email, reason);
        break;

      default:
        console.log(`📧 Unhandled event type: ${type}`);
        return NextResponse.json({ message: "Event type not handled" });
    }

    console.log(`✅ Event processed:`, result);

    return NextResponse.json({
      success: true,
      message: `${type} event processed successfully`,
      leadId: lead._id,
      leadName: lead.name,
      result,
    });
  } catch (error) {
    console.error("❌ Error processing email event webhook:", error);
    return NextResponse.json(
      { error: "Failed to process email event" },
      { status: 500 },
    );
  }
}

/**
 * Handle email opened event
 */
async function handleEmailOpened(leadId, automation, email) {
  try {
    // Add activity to lead
    const lead = await Lead.findById(leadId);
    await lead.addActivity({
      type: "email",
      title: "Automated email opened",
      description: `Lead opened automated email: ${automation.currentStage}`,
      status: "done",
      contactMade: false, // Don't reset aging for opens
      createdBy: null,
      metadata: {
        emailType: "automated_email_opened",
        stage: automation.currentStage,
        automated: true,
      },
    });

    console.log(`✅ Email opened activity logged for ${lead.name}`);

    return {
      success: true,
      eventType: "email_opened",
      activityAdded: true,
    };
  } catch (error) {
    console.error("Error handling email opened:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle email clicked event
 */
async function handleEmailClicked(leadId, automation, email, url) {
  try {
    // Add activity to lead
    const lead = await Lead.findById(leadId);
    await lead.addActivity({
      type: "email",
      title: "Automated email link clicked",
      description: `Lead clicked link in automated email: ${url}`,
      status: "done",
      contactMade: true, // Reset aging for clicks (engagement)
      createdBy: null,
      metadata: {
        emailType: "automated_email_clicked",
        stage: automation.currentStage,
        url,
        automated: true,
      },
    });

    console.log(`✅ Email clicked activity logged for ${lead.name}`);

    return {
      success: true,
      eventType: "email_clicked",
      activityAdded: true,
      agingReset: true,
    };
  } catch (error) {
    console.error("Error handling email clicked:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle email bounced event
 */
async function handleEmailBounced(leadId, automation, email, reason) {
  try {
    // Pause automation due to bounce
    automation.isActive = false;
    automation.pausedAt = new Date();
    automation.pausedReason = `Email bounced: ${reason}`;
    await automation.save();

    // Add activity to lead
    const lead = await Lead.findById(leadId);
    await lead.addActivity({
      type: "email",
      title: "Email bounced",
      description: `Automated email bounced: ${reason}`,
      status: "done",
      contactMade: false,
      createdBy: null,
      metadata: {
        emailType: "email_bounced",
        reason,
        automated: true,
      },
    });

    console.log(`✅ Email bounce handled for ${lead.name}`);

    return {
      success: true,
      eventType: "email_bounced",
      automationPaused: true,
      activityAdded: true,
    };
  } catch (error) {
    console.error("Error handling email bounced:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle email complained event
 */
async function handleEmailComplained(leadId, automation, email) {
  try {
    // Pause automation due to complaint
    automation.isActive = false;
    automation.pausedAt = new Date();
    automation.pausedReason = "Lead marked email as spam";
    await automation.save();

    // Add activity to lead
    const lead = await Lead.findById(leadId);
    await lead.addActivity({
      type: "email",
      title: "Email marked as spam",
      description: "Lead complained about automated email",
      status: "done",
      contactMade: false,
      createdBy: null,
      metadata: {
        emailType: "email_complained",
        automated: true,
      },
    });

    console.log(`✅ Email complaint handled for ${lead.name}`);

    return {
      success: true,
      eventType: "email_complained",
      automationPaused: true,
      activityAdded: true,
    };
  } catch (error) {
    console.error("Error handling email complained:", error);
    return { success: false, error: error.message };
  }
}

/**
 * Handle email failed event
 */
async function handleEmailFailed(leadId, automation, email, reason) {
  try {
    // Add activity to lead
    const lead = await Lead.findById(leadId);
    await lead.addActivity({
      type: "email",
      title: "Email delivery failed",
      description: `Automated email failed to deliver: ${reason}`,
      status: "done",
      contactMade: false,
      createdBy: null,
      metadata: {
        emailType: "email_failed",
        reason,
        automated: true,
      },
    });

    console.log(`✅ Email failure logged for ${lead.name}`);

    return {
      success: true,
      eventType: "email_failed",
      activityAdded: true,
    };
  } catch (error) {
    console.error("Error handling email failed:", error);
    return { success: false, error: error.message };
  }
}
