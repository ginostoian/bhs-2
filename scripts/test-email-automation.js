#!/usr/bin/env node

/**
 * Test Email Automation Script
 * Manually trigger email automation for testing
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

const leadSchema = new mongoose.Schema({
  name: String,
  email: String,
  stage: String,
  agingPaused: Boolean,
});

const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

async function testEmailAutomation() {
  try {
    console.log("🧪 Testing email automation...");
    await connectMongo();

    // Find all automations
    const automations = await EmailAutomation.find({ isActive: true }).populate(
      "leadId",
    );
    console.log(`📊 Found ${automations.length} active automations`);

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
      const now = new Date();
      const isDue =
        automation.stageData.lead.nextEmailDue &&
        automation.stageData.lead.nextEmailDue <= now &&
        automation.stageData.lead.emailsSent < 5 &&
        leadData?.stage !== "Won" &&
        leadData?.stage !== "Lost" &&
        !leadData?.agingPaused;

      console.log(`   - Should be due: ${isDue}`);
    });

    // Test the findDueEmails query
    const now = new Date();
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
      console.log(`   - ${leadData?.name} (${leadData?.email})`);
    });
  } catch (error) {
    console.error("❌ Error testing email automation:", error);
  } finally {
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  testEmailAutomation();
}

module.exports = { testEmailAutomation };
