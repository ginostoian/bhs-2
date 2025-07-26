import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

/**
 * Email Automation Schema
 * Manages automated email sequences for CRM leads
 */
const emailAutomationSchema = mongoose.Schema(
  {
    // Lead reference
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      index: true,
    },

    // Current stage and automation status
    currentStage: {
      type: String,
      enum: [
        "Lead",
        "Never replied",
        "Qualified",
        "Proposal Sent",
        "Negotiations",
      ],
      required: true,
    },

    // Automation status
    isActive: {
      type: Boolean,
      default: true,
    },

    // Stage-specific tracking
    stageData: {
      // Lead stage tracking
      lead: {
        emailsSent: {
          type: Number,
          default: 0,
        },
        lastEmailSent: {
          type: Date,
        },
        nextEmailDue: {
          type: Date,
        },
        maxEmails: {
          type: Number,
          default: 5, // 1 intro + 4 follow-ups
        },
      },

      // Qualified stage tracking
      qualified: {
        adminNotificationsSent: {
          type: Number,
          default: 0,
        },
        lastAdminNotification: {
          type: Date,
        },
        nextAdminNotificationDue: {
          type: Date,
        },
      },

      // Proposal Sent stage tracking
      proposalSent: {
        emailsSent: {
          type: Number,
          default: 0,
        },
        lastEmailSent: {
          type: Date,
        },
        nextEmailDue: {
          type: Date,
        },
      },

      // Negotiations stage tracking
      negotiations: {
        adminNotificationsSent: {
          type: Number,
          default: 0,
        },
        lastAdminNotification: {
          type: Date,
        },
        nextAdminNotificationDue: {
          type: Date,
        },
      },
    },

    // Email history
    emailHistory: [
      {
        emailType: {
          type: String,
          enum: [
            "lead_intro",
            "lead_followup",
            "qualified_admin_notification",
            "proposal_followup",
            "negotiations_admin_notification",
          ],
          required: true,
        },
        sentAt: {
          type: Date,
          default: Date.now,
        },
        subject: {
          type: String,
          required: true,
        },
        recipient: {
          type: String,
          required: true,
        },
        success: {
          type: Boolean,
          default: true,
        },
        error: {
          type: String,
        },
        metadata: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
      },
    ],

    // Pause/resume tracking
    pausedAt: {
      type: Date,
    },
    pausedReason: {
      type: String,
    },
    resumedAt: {
      type: Date,
    },

    // Reply tracking
    leadReplied: {
      type: Boolean,
      default: false,
    },
    lastReplyDate: {
      type: Date,
    },
    replySubject: {
      type: String,
    },
    replyContent: {
      type: String,
    },

    // Last activity tracking
    lastActivity: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
emailAutomationSchema.plugin(toJSON);

// Indexes for performance
emailAutomationSchema.index({ leadId: 1, currentStage: 1 });
emailAutomationSchema.index({ isActive: 1, "stageData.lead.nextEmailDue": 1 });
emailAutomationSchema.index({
  isActive: 1,
  "stageData.qualified.nextAdminNotificationDue": 1,
});
emailAutomationSchema.index({
  isActive: 1,
  "stageData.proposalSent.nextEmailDue": 1,
});
emailAutomationSchema.index({
  isActive: 1,
  "stageData.negotiations.nextAdminNotificationDue": 1,
});

// Static method to find automations that need emails sent
emailAutomationSchema.statics.findDueEmails = function () {
  const now = new Date();

  return this.find({
    isActive: true,
    $or: [
      // Lead stage emails due
      {
        currentStage: "Lead",
        "stageData.lead.nextEmailDue": { $lte: now },
        "stageData.lead.emailsSent": { $lt: 5 },
      },
      // Qualified stage admin notifications due
      {
        currentStage: "Qualified",
        "stageData.qualified.nextAdminNotificationDue": { $lte: now },
      },
      // Proposal Sent stage emails due
      {
        currentStage: "Proposal Sent",
        "stageData.proposalSent.nextEmailDue": { $lte: now },
      },
      // Negotiations stage admin notifications due
      {
        currentStage: "Negotiations",
        "stageData.negotiations.nextAdminNotificationDue": { $lte: now },
      },
    ],
  }).populate("leadId");
};

// Instance method to update stage
emailAutomationSchema.methods.updateStage = function (newStage) {
  const oldStage = this.currentStage;
  this.currentStage = newStage;
  this.lastActivity = new Date();

  // Reset stage-specific data when moving to new stage
  if (newStage === "Lead") {
    this.stageData.lead.emailsSent = 0;
    this.stageData.lead.lastEmailSent = null;
    this.stageData.lead.nextEmailDue = new Date();
  } else if (newStage === "Qualified") {
    this.stageData.qualified.adminNotificationsSent = 0;
    this.stageData.qualified.lastAdminNotification = null;
    this.stageData.qualified.nextAdminNotificationDue = new Date();
  } else if (newStage === "Proposal Sent") {
    this.stageData.proposalSent.emailsSent = 0;
    this.stageData.proposalSent.lastEmailSent = null;
    this.stageData.proposalSent.nextEmailDue = new Date(
      Date.now() + 24 * 60 * 60 * 1000,
    ); // 1 day delay
  } else if (newStage === "Negotiations") {
    this.stageData.negotiations.adminNotificationsSent = 0;
    this.stageData.negotiations.lastAdminNotification = null;
    this.stageData.negotiations.nextAdminNotificationDue = new Date();
  }

  return this.save();
};

// Instance method to pause automation
emailAutomationSchema.methods.pause = function (reason) {
  this.isActive = false;
  this.pausedAt = new Date();
  this.pausedReason = reason;
  return this.save();
};

// Instance method to resume automation
emailAutomationSchema.methods.resume = function () {
  this.isActive = true;
  this.resumedAt = new Date();
  this.pausedAt = null;
  this.pausedReason = null;
  return this.save();
};

// Instance method to record email sent
emailAutomationSchema.methods.recordEmailSent = function (
  emailType,
  subject,
  recipient,
  success = true,
  error = null,
  metadata = {},
) {
  // Add to email history
  this.emailHistory.push({
    emailType,
    sentAt: new Date(),
    subject,
    recipient,
    success,
    error,
    metadata,
  });

  // Update stage-specific counters and next due dates
  if (emailType === "lead_intro" || emailType === "lead_followup") {
    this.stageData.lead.emailsSent += 1;
    this.stageData.lead.lastEmailSent = new Date();
    this.stageData.lead.nextEmailDue = new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000,
    ); // 2 days
  } else if (emailType === "qualified_admin_notification") {
    this.stageData.qualified.adminNotificationsSent += 1;
    this.stageData.qualified.lastAdminNotification = new Date();
    this.stageData.qualified.nextAdminNotificationDue = new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000,
    ); // 2 days
  } else if (emailType === "proposal_followup") {
    this.stageData.proposalSent.emailsSent += 1;
    this.stageData.proposalSent.lastEmailSent = new Date();
    this.stageData.proposalSent.nextEmailDue = new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000,
    ); // 2 days
  } else if (emailType === "negotiations_admin_notification") {
    this.stageData.negotiations.adminNotificationsSent += 1;
    this.stageData.negotiations.lastAdminNotification = new Date();
    this.stageData.negotiations.nextAdminNotificationDue = new Date(
      Date.now() + 2 * 24 * 60 * 60 * 1000,
    ); // 2 days
  }

  this.lastActivity = new Date();
  return this.save();
};

// Instance method to check if lead should be moved to "Never replied"
emailAutomationSchema.methods.shouldMoveToNeverReplied = function () {
  return (
    this.currentStage === "Lead" &&
    this.stageData.lead.emailsSent >= this.stageData.lead.maxEmails
  );
};

export default mongoose.models.EmailAutomation ||
  mongoose.model("EmailAutomation", emailAutomationSchema);
