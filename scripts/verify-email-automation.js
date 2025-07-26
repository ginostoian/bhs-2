#!/usr/bin/env node

/**
 * Verify Email Automation Script
 * Check if email automation is properly configured
 */

const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

// Define schemas inline for the script
const emailAutomationSchema = new mongoose.Schema({
  leadId: { type: mongoose.Schema.Types.ObjectId, ref: "Lead", required: true },
  currentStage: { type: String, required: true },
  isActive: { type: Boolean, default: true },
  stageData: {
    lead: {
      emailsSent: { type: Number, default: 0 },
      lastEmailSent: Date,
      nextEmailDue: Date,
      maxEmails: { type: Number, default: 5 },
    },
    qualified: {
      adminNotificationsSent: { type: Number, default: 0 },
      lastAdminNotification: Date,
      nextAdminNotificationDue: Date,
    },
    proposalSent: {
      emailsSent: { type: Number, default: 0 },
      lastEmailSent: Date,
      nextEmailDue: Date,
    },
    negotiations: {
      adminNotificationsSent: { type: Number, default: 0 },
      lastAdminNotification: Date,
      nextAdminNotificationDue: Date,
    },
  },
  emailHistory: [
    {
      emailType: String,
      sentAt: { type: Date, default: Date.now },
      subject: String,
      recipient: String,
      success: { type: Boolean, default: true },
      error: String,
      metadata: mongoose.Schema.Types.Mixed,
    },
  ],
  lastActivity: { type: Date, default: Date.now },
});

const EmailAutomation =
  mongoose.models.EmailAutomation ||
  mongoose.model("EmailAutomation", emailAutomationSchema);

// Define Lead schema for population
const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  stage: String,
  agingPaused: Boolean,
});

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

async function verifyEmailAutomation() {
  try {
    console.log("🔍 Verifying email automation...");

    // Load environment variables
    require("dotenv").config({ path: ".env.local" });

    await connectMongo();

    // Find all active automations
    const automations = await EmailAutomation.find({ isActive: true }).populate(
      "leadId",
    );
    console.log(`📊 Found ${automations.length} active automations`);

    const now = new Date();

    automations.forEach((automation) => {
      const leadData = automation.leadId;
      console.log(
        `\n🔍 Automation for ${leadData?.name} (${leadData?.email}):`,
      );
      console.log(`   - Stage: ${automation.currentStage}`);
      console.log(
        `   - Lead emails sent: ${automation.stageData.lead.emailsSent}`,
      );
      console.log(
        `   - Next email due: ${automation.stageData.lead.nextEmailDue}`,
      );
      console.log(`   - Lead stage: ${leadData?.stage}`);
      console.log(`   - Aging paused: ${leadData?.agingPaused}`);

      // Check if this automation should be due
      const isDue =
        automation.stageData.lead.nextEmailDue &&
        automation.stageData.lead.nextEmailDue <= now &&
        automation.stageData.lead.emailsSent < 5 &&
        leadData?.stage !== "Won" &&
        leadData?.stage !== "Lost" &&
        !leadData?.agingPaused;

      console.log(`   - Should be due: ${isDue}`);

      if (isDue) {
        console.log(`   🎯 READY TO SEND EMAIL!`);
      }
    });

    // Test the findDueEmails query
    const dueAutomations = await EmailAutomation.find({
      isActive: true,
      $or: [
        {
          currentStage: "Lead",
          "stageData.lead.nextEmailDue": { $lte: now },
          "stageData.lead.emailsSent": { $lt: 5 },
        },
      ],
    }).populate("leadId");

    console.log(
      `\n📧 Found ${dueAutomations.length} automations with due emails`,
    );
    dueAutomations.forEach((automation) => {
      const leadData = automation.leadId;
      console.log(
        `   - ${leadData?.name} (${leadData?.email}) - Ready to send email #${automation.stageData.lead.emailsSent + 1}`,
      );
    });

    if (dueAutomations.length > 0) {
      console.log(
        `\n✅ Email automation is ready! You can now trigger the email processing through the admin interface.`,
      );
    } else {
      console.log(`\n⚠️ No emails are currently due to be sent.`);
    }
  } catch (error) {
    console.error("❌ Error verifying email automation:", error);
  } finally {
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  verifyEmailAutomation();
}

module.exports = { verifyEmailAutomation };
