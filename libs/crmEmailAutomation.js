import connectMongo from "./mongoose";
import EmailAutomation from "@/models/EmailAutomation";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { sendEmailWithRetry } from "./emailService";
import {
  leadIntroEmailTemplate,
  leadFollowupEmailTemplate,
  qualifiedAdminNotificationTemplate,
  proposalFollowupEmailTemplate,
  negotiationsAdminNotificationTemplate,
} from "./crmEmailTemplates";
import config from "@/config";

/**
 * CRM Email Automation Service
 * Handles automated email sequences for CRM leads
 */

/**
 * Initialize email automation for a new lead
 */
export const initializeEmailAutomation = async (leadId, stage = "Lead") => {
  try {
    await connectMongo();

    // Check if automation already exists
    const existingAutomation = await EmailAutomation.findOne({ leadId });
    if (existingAutomation) {
      return existingAutomation;
    }

    // Create new automation
    const automation = await EmailAutomation.create({
      leadId,
      currentStage: stage,
      isActive: true,
      stageData: {
        lead: {
          emailsSent: 0,
          lastEmailSent: null,
          nextEmailDue: new Date(), // Set to current date so first email is sent immediately
          maxEmails: 5,
        },
        qualified: {
          adminNotificationsSent: 0,
          lastAdminNotification: null,
          nextAdminNotificationDue: null,
        },
        proposalSent: {
          emailsSent: 0,
          lastEmailSent: null,
          nextEmailDue: null,
        },
        negotiations: {
          adminNotificationsSent: 0,
          lastAdminNotification: null,
          nextAdminNotificationDue: null,
        },
      },
    });

    console.log(`✅ Email automation initialized for lead ${leadId}`);
    return automation;
  } catch (error) {
    console.error("Error initializing email automation:", error);
    throw error;
  }
};

/**
 * Resume email automation after lead reply
 */
export const resumeEmailAutomation = async (
  leadId,
  reason = "Manual resume",
) => {
  try {
    await connectMongo();

    const automation = await EmailAutomation.findOne({ leadId });
    if (!automation) {
      throw new Error("Email automation not found");
    }

    // Resume the automation
    automation.isActive = true;
    automation.leadReplied = false; // Reset reply status
    automation.pausedAt = null;
    automation.pausedReason = null;
    automation.resumedAt = new Date();
    automation.lastActivity = new Date();

    await automation.save();

    console.log(`✅ Email automation resumed for lead ${leadId}: ${reason}`);
    return automation;
  } catch (error) {
    console.error("Error resuming email automation:", error);
    throw error;
  }
};

/**
 * Update email automation when lead stage changes
 */
export const updateEmailAutomationStage = async (leadId, newStage, userId) => {
  try {
    await connectMongo();

    let automation = await EmailAutomation.findOne({ leadId });

    if (!automation) {
      // Create automation if it doesn't exist
      automation = await initializeEmailAutomation(leadId, newStage);
    } else {
      // Update existing automation
      await automation.updateStage(newStage);
    }

    // If moving to Won or Lost, pause automation
    if (newStage === "Won" || newStage === "Lost") {
      await automation.pause(`Lead moved to ${newStage} stage`);
    } else {
      // If moving to any other stage and automation was paused due to reply,
      // automatically resume it for the new stage
      if (
        automation.isActive === false &&
        automation.pausedReason?.includes("Lead replied")
      ) {
        automation.isActive = true;
        automation.leadReplied = false; // Reset reply status for new stage
        automation.pausedAt = null;
        automation.pausedReason = null;
        automation.resumedAt = new Date();
        automation.lastActivity = new Date();
        await automation.save();

        console.log(
          `🔄 Email automation auto-resumed for lead ${leadId} moving to ${newStage} stage`,
        );
      }
    }

    console.log(
      `✅ Email automation updated for lead ${leadId} to stage ${newStage}`,
    );
    return automation;
  } catch (error) {
    console.error("Error updating email automation stage:", error);
    throw error;
  }
};

/**
 * Pause email automation (e.g., when aging is paused)
 */
export const pauseEmailAutomation = async (leadId, reason) => {
  try {
    await connectMongo();

    const automation = await EmailAutomation.findOne({ leadId });
    if (automation) {
      await automation.pause(reason);
      console.log(`⏸️ Email automation paused for lead ${leadId}: ${reason}`);
    }
  } catch (error) {
    console.error("Error pausing email automation:", error);
    throw error;
  }
};

/**
 * Send lead introduction email
 */
const sendLeadIntroEmail = async (automation, leadData) => {
  try {
    const template = leadIntroEmailTemplate(leadData);

    const emailResult = await sendEmailWithRetry({
      to: leadData.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      bcc: "contact@celli.co.uk",
      metadata: {
        type: "crm_lead_intro",
        leadId: leadData.id || leadData._id,
        automationId: automation.id || automation._id,
        stage: "Lead",
      },
    });

    // Record email sent
    await automation.recordEmailSent(
      "lead_intro",
      template.subject,
      leadData.email,
      emailResult.success,
      emailResult.error,
      { emailResult },
    );

    // Add activity to lead
    await addEmailActivityToLead(
      leadData.id || leadData._id,
      "lead_intro",
      template.subject,
      emailResult.success,
    );

    console.log(
      `📧 Lead intro email sent to ${leadData.email}: ${emailResult.success ? "SUCCESS" : "FAILED"}`,
    );
    return emailResult;
  } catch (error) {
    console.error("Error sending lead intro email:", error);
    throw error;
  }
};

/**
 * Send lead follow-up email
 */
const sendLeadFollowupEmail = async (automation, leadData) => {
  try {
    const followupNumber = automation.stageData.lead.emailsSent + 1;
    const template = leadFollowupEmailTemplate(leadData, followupNumber);

    const emailResult = await sendEmailWithRetry({
      to: leadData.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      bcc: "contact@celli.co.uk",
      metadata: {
        type: "crm_lead_followup",
        leadId: leadData.id || leadData._id,
        automationId: automation.id || automation._id,
        stage: "Lead",
        followupNumber,
      },
    });

    // Record email sent
    await automation.recordEmailSent(
      "lead_followup",
      template.subject,
      leadData.email,
      emailResult.success,
      emailResult.error,
      { emailResult, followupNumber },
    );

    // Add activity to lead
    await addEmailActivityToLead(
      leadData.id || leadData._id,
      "lead_followup",
      template.subject,
      emailResult.success,
    );

    console.log(
      `📧 Lead follow-up email #${followupNumber} sent to ${leadData.email}: ${emailResult.success ? "SUCCESS" : "FAILED"}`,
    );
    return emailResult;
  } catch (error) {
    console.error("Error sending lead follow-up email:", error);
    throw error;
  }
};

/**
 * Send qualified stage admin notification
 */
const sendQualifiedAdminNotification = async (automation, leadData) => {
  try {
    // Get assigned admin
    const assignedAdmin = leadData.assignedTo;
    if (!assignedAdmin || !assignedAdmin.email) {
      console.log(
        `⚠️ No assigned admin for lead ${leadData.id || leadData._id}`,
      );
      return null;
    }

    const template = qualifiedAdminNotificationTemplate(
      leadData,
      assignedAdmin,
    );

    const emailResult = await sendEmailWithRetry({
      to: assignedAdmin.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      bcc: "contact@celli.co.uk",
      metadata: {
        type: "crm_qualified_admin_notification",
        leadId: leadData.id || leadData._id,
        automationId: automation.id || automation._id,
        stage: "Qualified",
        adminId: assignedAdmin.id || assignedAdmin._id,
      },
    });

    // Record email sent
    await automation.recordEmailSent(
      "qualified_admin_notification",
      template.subject,
      assignedAdmin.email,
      emailResult.success,
      emailResult.error,
      { emailResult, adminId: assignedAdmin.id || assignedAdmin._id },
    );

    // Add activity to lead
    await addEmailActivityToLead(
      leadData.id || leadData._id,
      "qualified_admin_notification",
      template.subject,
      emailResult.success,
    );

    console.log(
      `📧 Qualified admin notification sent to ${assignedAdmin.email}: ${emailResult.success ? "SUCCESS" : "FAILED"}`,
    );
    return emailResult;
  } catch (error) {
    console.error("Error sending qualified admin notification:", error);
    throw error;
  }
};

/**
 * Send proposal follow-up email
 */
const sendProposalFollowupEmail = async (automation, leadData) => {
  try {
    const followupNumber = automation.stageData.proposalSent.emailsSent + 1;
    const template = proposalFollowupEmailTemplate(leadData, followupNumber);

    const emailResult = await sendEmailWithRetry({
      to: leadData.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      bcc: "contact@celli.co.uk",
      metadata: {
        type: "crm_proposal_followup",
        leadId: leadData.id || leadData._id,
        automationId: automation.id || automation._id,
        stage: "Proposal Sent",
        followupNumber,
      },
    });

    // Record email sent
    await automation.recordEmailSent(
      "proposal_followup",
      template.subject,
      leadData.email,
      emailResult.success,
      emailResult.error,
      { emailResult, followupNumber },
    );

    // Add activity to lead
    await addEmailActivityToLead(
      leadData.id || leadData._id,
      "proposal_followup",
      template.subject,
      emailResult.success,
    );

    console.log(
      `📧 Proposal follow-up email #${followupNumber} sent to ${leadData.email}: ${emailResult.success ? "SUCCESS" : "FAILED"}`,
    );
    return emailResult;
  } catch (error) {
    console.error("Error sending proposal follow-up email:", error);
    throw error;
  }
};

/**
 * Send negotiations admin notification
 */
const sendNegotiationsAdminNotification = async (automation, leadData) => {
  try {
    // Get assigned admin
    const assignedAdmin = leadData.assignedTo;
    if (!assignedAdmin || !assignedAdmin.email) {
      console.log(
        `⚠️ No assigned admin for lead ${leadData.id || leadData._id}`,
      );
      return null;
    }

    const template = negotiationsAdminNotificationTemplate(
      leadData,
      assignedAdmin,
    );

    const emailResult = await sendEmailWithRetry({
      to: assignedAdmin.email,
      subject: template.subject,
      html: template.html,
      text: template.text,
      bcc: "contact@celli.co.uk",
      metadata: {
        type: "crm_negotiations_admin_notification",
        leadId: leadData.id || leadData._id,
        automationId: automation.id || automation._id,
        stage: "Negotiations",
        adminId: assignedAdmin.id || assignedAdmin._id,
      },
    });

    // Record email sent
    await automation.recordEmailSent(
      "negotiations_admin_notification",
      template.subject,
      assignedAdmin.email,
      emailResult.success,
      emailResult.error,
      { emailResult, adminId: assignedAdmin.id || assignedAdmin._id },
    );

    // Add activity to lead
    await addEmailActivityToLead(
      leadData.id || leadData._id,
      "negotiations_admin_notification",
      template.subject,
      emailResult.success,
    );

    console.log(
      `📧 Negotiations admin notification sent to ${assignedAdmin.email}: ${emailResult.success ? "SUCCESS" : "FAILED"}`,
    );
    return emailResult;
  } catch (error) {
    console.error("Error sending negotiations admin notification:", error);
    throw error;
  }
};

/**
 * Handle lead reply to automated email
 */
export const handleLeadReply = async (
  leadId,
  fromEmail,
  subject,
  content,
  automation,
) => {
  try {
    console.log(`📧 Processing lead reply from ${fromEmail}`);

    // Update the automation to mark that lead has replied
    automation.leadReplied = true;
    automation.lastReplyDate = new Date();
    automation.replySubject = subject;
    automation.replyContent = content;
    automation.lastActivity = new Date();

    // Pause the automation since lead has engaged
    automation.isActive = false;
    automation.pausedAt = new Date();
    automation.pausedReason = "Lead replied to automated email";

    await automation.save();

    // Find the lead and add a reply activity
    const lead = await Lead.findById(leadId);
    if (!lead) {
      console.error(`Lead not found: ${leadId}`);
      return { success: false, error: "Lead not found" };
    }

    // Add reply activity to lead
    await lead.addActivity({
      type: "email",
      title: "Lead replied to automated email",
      description: `Subject: ${subject}\n\nContent: ${content.substring(0, 200)}${content.length > 200 ? "..." : ""}`,
      status: "done",
      contactMade: true, // Reset aging timer since lead engaged
      createdBy: null, // System-generated activity
      metadata: {
        emailType: "lead_reply",
        subject,
        fromEmail,
        contentLength: content.length,
        automated: true,
      },
    });

    console.log(`✅ Lead reply processed successfully for ${lead.name}`);

    return {
      success: true,
      leadId: lead._id,
      leadName: lead.name,
      automationPaused: true,
      agingReset: true,
      activityAdded: true,
    };
  } catch (error) {
    console.error("Error handling lead reply:", error);
    return { success: false, error: error.message };
  }
};

/**
 * Add email activity to lead
 */
const addEmailActivityToLead = async (leadId, emailType, subject, success) => {
  try {
    const lead = await Lead.findById(leadId);
    if (!lead) {
      console.error(`Lead not found: ${leadId}`);
      return;
    }

    const activityType = emailType.includes("admin_notification")
      ? "email"
      : "email";
    const activityTitle = emailType.includes("admin_notification")
      ? `Admin notification sent: ${subject}`
      : `Automated email sent: ${subject}`;

    await lead.addActivity({
      type: activityType,
      title: activityTitle,
      description: `Automated ${emailType} email ${success ? "sent successfully" : "failed to send"}`,
      status: "done",
      contactMade: false, // Don't reset aging for automated emails
      createdBy: null, // System-generated activity
      metadata: {
        emailType,
        subject,
        success,
        automated: true,
      },
    });

    console.log(`📝 Email activity added to lead ${leadId}`);
  } catch (error) {
    console.error("Error adding email activity to lead:", error);
  }
};

/**
 * Process all due emails
 */
export const processDueEmails = async () => {
  try {
    await connectMongo();

    console.log("🔄 Processing due emails...");

    // Find all automations with due emails
    const dueAutomations = await EmailAutomation.findDueEmails();

    // Debug: Log all automations for troubleshooting
    const allAutomations = await EmailAutomation.find({
      isActive: true,
    }).populate("leadId");
    console.log(`🔍 Found ${allAutomations.length} total active automations`);

    allAutomations.forEach((automation) => {
      const leadData = automation.leadId;
      console.log(`🔍 Automation for ${leadData?.name} (${leadData?.email}):`);
      console.log(`   - Stage: ${automation.currentStage}`);
      console.log(
        `   - Lead emails sent: ${automation.stageData.lead.emailsSent}`,
      );
      console.log(
        `   - Next email due: ${automation.stageData.lead.nextEmailDue}`,
      );
      console.log(
        `   - Is due: ${automation.stageData.lead.nextEmailDue && automation.stageData.lead.nextEmailDue <= new Date()}`,
      );
    });

    if (dueAutomations.length === 0) {
      console.log("✅ No due emails found");
      return { processed: 0, results: [] };
    }

    console.log(
      `📧 Found ${dueAutomations.length} automations with due emails`,
    );

    const results = [];

    for (const automation of dueAutomations) {
      try {
        const leadData = automation.leadId;

        // Skip if lead is in Won/Lost stage or aging is paused
        if (
          leadData.stage === "Won" ||
          leadData.stage === "Lost" ||
          leadData.agingPaused
        ) {
          console.log(
            `⏭️ Skipping lead ${leadData.id || leadData._id} - Stage: ${leadData.stage}, Aging paused: ${leadData.agingPaused}`,
          );
          continue;
        }

        let emailResult = null;

        // Send appropriate email based on stage
        if (automation.currentStage === "Lead") {
          if (automation.stageData.lead.emailsSent === 0) {
            // First email - introduction
            emailResult = await sendLeadIntroEmail(automation, leadData);
          } else {
            // Follow-up emails
            emailResult = await sendLeadFollowupEmail(automation, leadData);
          }
        } else if (automation.currentStage === "Qualified") {
          emailResult = await sendQualifiedAdminNotification(
            automation,
            leadData,
          );
        } else if (automation.currentStage === "Proposal Sent") {
          emailResult = await sendProposalFollowupEmail(automation, leadData);
        } else if (automation.currentStage === "Negotiations") {
          emailResult = await sendNegotiationsAdminNotification(
            automation,
            leadData,
          );
        }

        results.push({
          leadId: leadData.id || leadData._id,
          leadName: leadData.name,
          stage: automation.currentStage,
          emailResult,
        });

        // Check if lead should be moved to "Never replied"
        if (automation.shouldMoveToNeverReplied()) {
          console.log(
            `🔄 Moving lead ${leadData.id || leadData._id} to "Never replied" stage`,
          );
          // Note: This should trigger a stage update in the main CRM system
        }
      } catch (error) {
        console.error(
          `Error processing automation for lead ${automation.leadId}:`,
          error,
        );
        results.push({
          leadId: automation.leadId,
          error: error.message,
        });
      }
    }

    console.log(`✅ Processed ${results.length} email automations`);
    return { processed: results.length, results };
  } catch (error) {
    console.error("Error processing due emails:", error);
    throw error;
  }
};

/**
 * Get email automation statistics
 */
export const getEmailAutomationStats = async () => {
  try {
    await connectMongo();

    const totalAutomations = await EmailAutomation.countDocuments();
    const activeAutomations = await EmailAutomation.countDocuments({
      isActive: true,
    });
    const pausedAutomations = await EmailAutomation.countDocuments({
      isActive: false,
    });

    const stageStats = await EmailAutomation.aggregate([
      {
        $group: {
          _id: "$currentStage",
          count: { $sum: 1 },
          active: {
            $sum: { $cond: ["$isActive", 1, 0] },
          },
        },
      },
    ]);

    const emailStats = await EmailAutomation.aggregate([
      {
        $unwind: "$emailHistory",
      },
      {
        $group: {
          _id: "$emailHistory.emailType",
          count: { $sum: 1 },
          success: {
            $sum: { $cond: ["$emailHistory.success", 1, 0] },
          },
        },
      },
    ]);

    return {
      totalAutomations,
      activeAutomations,
      pausedAutomations,
      stageStats,
      emailStats,
    };
  } catch (error) {
    console.error("Error getting email automation stats:", error);
    throw error;
  }
};

/**
 * Get automation details for a specific lead
 */
export const getLeadAutomationDetails = async (leadId) => {
  try {
    await connectMongo();

    const automation = await EmailAutomation.findOne({ leadId })
      .populate("leadId")
      .sort({ "emailHistory.sentAt": -1 });

    return automation;
  } catch (error) {
    console.error("Error getting lead automation details:", error);
    throw error;
  }
};
