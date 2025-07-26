#!/usr/bin/env node

/**
 * Fix Email Automation Script
 * Fix existing automations that don't have nextEmailDue set
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

async function fixEmailAutomations() {
  try {
    console.log("🔧 Fixing email automations...");

    // Load environment variables
    require("dotenv").config({ path: ".env.local" });

    await connectMongo();

    // Find automations that don't have nextEmailDue set for Lead stage
    const automationsToFix = await EmailAutomation.find({
      currentStage: "Lead",
      isActive: true,
      $or: [
        { "stageData.lead.nextEmailDue": { $exists: false } },
        { "stageData.lead.nextEmailDue": null },
        { "stageData.lead.emailsSent": 0 },
      ],
    }).populate("leadId");

    console.log(`🔧 Found ${automationsToFix.length} automations to fix`);

    for (const automation of automationsToFix) {
      const leadData = automation.leadId;
      console.log(
        `🔧 Fixing automation for ${leadData?.name} (${leadData?.email})`,
      );

      // Set nextEmailDue to current date if it's not set or if no emails have been sent
      if (
        !automation.stageData.lead.nextEmailDue ||
        automation.stageData.lead.emailsSent === 0
      ) {
        automation.stageData.lead.nextEmailDue = new Date();
        automation.lastActivity = new Date();
        await automation.save();
        console.log(
          `   ✅ Fixed: Set nextEmailDue to ${automation.stageData.lead.nextEmailDue}`,
        );
      }
    }

    console.log("✅ Email automation fix completed");
  } catch (error) {
    console.error("❌ Error fixing email automations:", error);
  } finally {
    process.exit(0);
  }
}

// Run if called directly
if (require.main === module) {
  fixEmailAutomations();
}

module.exports = { fixEmailAutomations };
