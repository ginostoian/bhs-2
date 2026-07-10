import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";
import {
  CRM_STAGES,
  LEGACY_STAGE_MAP,
  normalizeCRMStage,
} from "../libs/crmStages.js";
import {
  CRM_SEQUENCES,
  getSequenceDueDate,
  getSequenceForStage,
  isSequenceComplete,
} from "../libs/crmSequences.js";

const emailHistorySchema = new mongoose.Schema(
  {
    emailType: { type: String, required: true },
    sequenceKey: String,
    sequenceStep: Number,
    sentAt: { type: Date, default: Date.now },
    subject: { type: String, required: true },
    recipient: { type: String, required: true },
    success: { type: Boolean, default: true },
    error: String,
    providerMessageId: String,
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { _id: true },
);

const emailAutomationSchema = mongoose.Schema(
  {
    leadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
      unique: true,
      index: true,
    },
    currentStage: {
      type: String,
      enum: [...CRM_STAGES, ...Object.keys(LEGACY_STAGE_MAP)],
      required: true,
      default: "New Enquiry",
    },
    isActive: { type: Boolean, default: true, index: true },
    sequenceKey: {
      type: String,
      enum: [...Object.keys(CRM_SEQUENCES), null],
      default: null,
    },
    sequenceStep: { type: Number, default: 0 },
    sequenceEnteredAt: { type: Date, default: Date.now },
    nextActionDue: { type: Date, index: true },
    lastEmailSentAt: Date,
    sequenceCompletedAt: Date,
    adminRemindersSent: { type: Number, default: 0 },
    maxAdminReminders: { type: Number, default: 3 },

    // Retained as Mixed only so the migration can read legacy documents safely.
    stageData: { type: mongoose.Schema.Types.Mixed, default: undefined },
    emailHistory: { type: [emailHistorySchema], default: [] },

    pausedAt: Date,
    pausedReason: String,
    resumedAt: Date,
    leadReplied: { type: Boolean, default: false },
    lastReplyDate: Date,
    replySubject: String,
    replyContent: String,
    openCount: { type: Number, default: 0 },
    clickCount: { type: Number, default: 0 },
    lastOpenedAt: Date,
    lastClickedAt: Date,
    lastClickedUrl: String,
    lastActivity: { type: Date, default: Date.now },
  },
  { timestamps: true, toJSON: { virtuals: true } },
);

emailAutomationSchema.plugin(toJSON);
emailAutomationSchema.index({ isActive: 1, nextActionDue: 1 });
emailAutomationSchema.index({ currentStage: 1, isActive: 1 });

emailAutomationSchema.statics.findDueEmails = function () {
  return this.find({
    isActive: true,
    nextActionDue: { $ne: null, $lte: new Date() },
  }).populate({
    path: "leadId",
    populate: { path: "assignedTo", select: "name email" },
  });
};

emailAutomationSchema.methods.configureForStage = function (
  stage,
  enteredAt = new Date(),
) {
  const normalizedStage = normalizeCRMStage(stage);
  const sequence = getSequenceForStage(normalizedStage);

  this.currentStage = normalizedStage;
  this.sequenceKey = sequence?.key || null;
  this.sequenceStep = 0;
  this.sequenceEnteredAt = enteredAt;
  this.sequenceCompletedAt = null;
  this.adminRemindersSent = 0;
  this.nextActionDue = sequence
    ? getSequenceDueDate(sequence.key, enteredAt, 0)
    : null;
  this.isActive = Boolean(sequence);
  this.pausedAt = null;
  this.pausedReason = sequence ? null : `No automation for ${normalizedStage}`;
  this.lastActivity = new Date();
  return this;
};

emailAutomationSchema.methods.updateStage = function (newStage) {
  this.configureForStage(newStage, new Date());
  return this.save();
};

emailAutomationSchema.methods.switchToColdSequence = function () {
  const now = new Date();
  this.sequenceKey = "cold";
  this.sequenceStep = 0;
  this.sequenceEnteredAt = now;
  this.sequenceCompletedAt = null;
  this.nextActionDue = getSequenceDueDate("cold", now, 0);
  this.isActive = true;
  this.pausedAt = null;
  this.pausedReason = null;
  this.lastActivity = now;
  return this.save();
};

emailAutomationSchema.methods.pause = function (reason) {
  this.isActive = false;
  this.pausedAt = new Date();
  this.pausedReason = reason;
  this.nextActionDue = null;
  this.lastActivity = new Date();
  return this.save();
};

emailAutomationSchema.methods.resume = function () {
  if (!this.sequenceKey) this.configureForStage(this.currentStage, new Date());
  this.isActive = Boolean(this.sequenceKey);
  this.resumedAt = new Date();
  this.pausedAt = null;
  this.pausedReason = null;
  if (this.sequenceKey && !this.nextActionDue) this.nextActionDue = new Date();
  this.lastActivity = new Date();
  return this.save();
};

emailAutomationSchema.methods.recordEmailSent = function (
  emailType,
  subject,
  recipient,
  success = true,
  error = null,
  metadata = {},
) {
  const sentAt = new Date();
  this.emailHistory.push({
    emailType,
    sequenceKey: this.sequenceKey,
    sequenceStep: this.sequenceStep + 1,
    sentAt,
    subject,
    recipient,
    success,
    error,
    providerMessageId:
      metadata?.emailResult?.id || metadata?.emailResult?.data?.id,
    metadata,
  });

  if (success) {
    this.sequenceStep += 1;
    this.lastEmailSentAt = sentAt;
    if (CRM_SEQUENCES[this.sequenceKey]?.recipient === "admin") {
      this.adminRemindersSent += 1;
    }
    this.nextActionDue = getSequenceDueDate(
      this.sequenceKey,
      this.sequenceEnteredAt,
      this.sequenceStep,
    );
    if (isSequenceComplete(this.sequenceKey, this.sequenceStep)) {
      this.sequenceCompletedAt = sentAt;
      this.nextActionDue = null;
    }
  } else {
    this.nextActionDue = new Date(Date.now() + 60 * 60 * 1000);
  }

  this.lastActivity = sentAt;
  return this.save();
};

emailAutomationSchema.methods.isSequenceExhausted = function () {
  return isSequenceComplete(this.sequenceKey, this.sequenceStep);
};

export default mongoose.models.EmailAutomation ||
  mongoose.model("EmailAutomation", emailAutomationSchema);
