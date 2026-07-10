import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";
import {
  CRM_STAGES,
  LEGACY_STAGE_MAP,
  getStageProbability,
  normalizeCRMStage,
} from "../libs/crmStages.js";

/**
 * Enhanced Lead Schema for CRM System
 * Supports full lead lifecycle management with kanban board stages
 */
const leadSchema = mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    postcode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    address: {
      type: String,
      trim: true,
    },

    // CRM Pipeline Information
    stage: {
      type: String,
      // Legacy values remain valid until scripts/migrate-crm-architecture.js
      // has normalised existing production documents.
      enum: [...CRM_STAGES, ...Object.keys(LEGACY_STAGE_MAP)],
      default: "New Enquiry",
      index: true,
    },

    // Lead Value and Budget
    value: {
      type: Number,
      min: 0,
      default: 0,
    },
    estimatedValue: {
      type: Number,
      min: 0,
      default: 0,
    },
    probability: {
      type: Number,
      min: 0,
      max: 1,
      default: 0.1,
    },
    expectedCloseDate: Date,
    budget: {
      type: String,
      enum: ["£", "££", "£££", "££££"],
      default: "£",
    },

    // Lead Classification
    clientHealth: {
      type: String,
      enum: ["Excellent", "Good", "Fair", "Poor", "Unknown"],
      default: "Unknown",
    },
    source: {
      type: String,
      enum: [
        "Houzz",
        "MyBuilder",
        "Recommendation",
        "Google",
        "Meta Ads",
        "Google Ads",
        "Referral",
        "Other",
      ],
      default: "Other",
    },
    customSource: {
      type: String,
      trim: true,
    },

    // Project Information
    projectTypes: [
      {
        type: String,
        enum: [
          "Bathroom renovation",
          "Kitchen renovation",
          "Extension",
          "Home renovation",
          "Loft Conversion",
          "Commercial",
          "Custom",
        ],
      },
    ],
    customProjectType: {
      type: String,
      trim: true,
    },

    // Calculator lead metadata (kept flexible so calculators can evolve)
    calculatorData: {
      latestSubmission: {
        type: mongoose.Schema.Types.Mixed,
        default: null,
      },
      submissions: {
        type: [mongoose.Schema.Types.Mixed],
        default: [],
      },
    },

    // User Linking
    linkedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },
    referredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Partner",
      default: null,
      index: true,
    },
    referralSource: {
      type: String,
      enum: ["dashboard_form", "share_link", "admin_manual", "other"],
      default: undefined,
      set(value) {
        return value || undefined;
      },
    },

    // Assignment and Ownership
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // Aging and Follow-up
    lastContactDate: {
      type: Date,
      default: Date.now,
    },
    nextFollowUpDate: {
      type: Date,
    },
    agingDays: {
      type: Number,
      default: 0,
    },
    agingPaused: {
      type: Boolean,
      default: false,
    },
    agingPausedAt: {
      type: Date,
    },
    agingPausedReason: {
      type: String,
      trim: true,
    },

    // Denormalised projections of first-class CRM collections.
    lastActivityAt: Date,
    activityCount: { type: Number, default: 0 },
    overdueTaskCount: { type: Number, default: 0 },

    // Win/Loss Information
    winLossReason: {
      type: String,
      trim: true,
    },
    winLossDate: {
      type: Date,
    },

    // Version History
    versionHistory: [
      {
        field: {
          type: String,
          required: true,
        },
        oldValue: mongoose.Schema.Types.Mixed,
        newValue: mongoose.Schema.Types.Mixed,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false,
        },
        changedAt: {
          type: Date,
          default: Date.now,
        },
        comment: {
          type: String,
        },
      },
    ],

    // Tags for filtering
    tags: [
      {
        type: String,
        trim: true,
      },
    ],

    // Engagement, consent and attribution
    lifecycleStatus: {
      type: String,
      enum: ["Active", "Cold", "Unsubscribed", "Suppressed"],
      default: "Active",
      index: true,
    },
    leadScore: { type: Number, min: 0, max: 100, default: 0, index: true },
    marketingConsent: { type: Boolean, default: null },
    marketingConsentAt: Date,
    unsubscribedAt: Date,
    emailSuppressed: { type: Boolean, default: false, index: true },
    emailSuppressionReason: String,
    lastAutomatedEmailAt: Date,
    attribution: {
      utmSource: String,
      utmMedium: String,
      utmCampaign: String,
      utmTerm: String,
      utmContent: String,
      referrer: String,
      landingPage: String,
      acquisitionCost: { type: Number, min: 0, default: 0 },
    },

    // Status flags
    isActive: {
      type: Boolean,
      default: true,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    archivedAt: {
      type: Date,
      default: null,
    },
    archivedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    mergedInto: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
leadSchema.plugin(toJSON);

// Indexes for better query performance
leadSchema.index({ stage: 1, createdAt: -1 });
leadSchema.index({ assignedTo: 1, stage: 1 });
leadSchema.index({ email: 1, linkedUser: 1 });
leadSchema.index({ nextFollowUpDate: 1 });
leadSchema.index({ isActive: 1, isArchived: 1 });
leadSchema.index({ archivedAt: -1 });
leadSchema.index({ archivedBy: 1 });
leadSchema.index({ customSource: 1, updatedAt: -1 });
leadSchema.index({ referredBy: 1, stage: 1, updatedAt: -1 });
leadSchema.index(
  { email: 1 },
  {
    unique: true,
    partialFilterExpression: { isActive: true, isArchived: false },
    name: "unique_active_lead_email",
  },
);

// Virtual for full source (including custom source)
leadSchema.virtual("fullSource").get(function () {
  return this.source === "Other" && this.customSource
    ? this.customSource
    : this.source;
});

// Virtual for full project types (including custom)
leadSchema.virtual("fullProjectTypes").get(function () {
  const types = [...(this.projectTypes || [])];
  if (this.customProjectType) {
    types.push(this.customProjectType);
  }
  return types;
});

// Pre-save middleware to update aging days and auto-link users
leadSchema.pre("save", async function (next) {
  if (this.isModified("stage")) {
    this.stage = normalizeCRMStage(this.stage);
    this.probability = getStageProbability(this.stage);
  }

  if (this.isModified("estimatedValue") && !this.isModified("value")) {
    this.value = this.estimatedValue;
  } else if (this.isModified("value") && !this.isModified("estimatedValue")) {
    this.estimatedValue = this.value;
  }

  // Update aging days
  if (this.isModified("lastContactDate") || this.isNew) {
    // Don't update aging if it's paused
    if (!this.agingPaused) {
      const now = new Date();
      const lastContact = this.lastContactDate || this.createdAt;
      const diffTime = Math.abs(now - lastContact);
      this.agingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  // Auto-link to user if email matches and not already linked
  if (this.isModified("email") || (this.isNew && !this.linkedUser)) {
    try {
      const User = mongoose.model("User");
      const user = await User.findOne({ email: this.email });
      if (user) {
        this.linkedUser = user._id;
        console.log(
          `🔗 Auto-linked lead "${this.name}" to user "${user.name}"`,
        );
      }
    } catch (error) {
      console.error("Error auto-linking lead to user:", error);
    }
  }

  next();
});

// Static method to find leads by stage
leadSchema.statics.findByStage = function (stage) {
  return this.find({ stage, isActive: true, isArchived: false })
    .populate("assignedTo", "name email")
    .populate("linkedUser", "name email")
    .sort({ updatedAt: -1 });
};

// Static method to find aging leads
leadSchema.statics.findAgingLeads = function (days = 7) {
  return this.find({
    agingDays: { $gte: days },
    stage: { $nin: ["Won", "Lost"] },
    isActive: true,
    isArchived: false,
    $or: [{ agingPaused: false }, { agingPaused: { $exists: false } }],
  })
    .populate("assignedTo", "name email")
    .sort({ agingDays: -1 });
};

// Static method to find leads by assigned user
leadSchema.statics.findByAssignee = function (userId) {
  return this.find({ assignedTo: userId, isActive: true, isArchived: false })
    .populate("linkedUser", "name email")
    .sort({ updatedAt: -1 });
};

// Instance method to add activity
leadSchema.methods.addActivity = async function (activity) {
  const { default: LeadActivity } = await import("./LeadActivity.js");
  const occurredAt = activity.occurredAt || activity.date || new Date();
  const record = await LeadActivity.create({
    ...activity,
    occurredAt,
    leadId: this._id,
  });
  this.lastActivityAt = occurredAt;
  this.activityCount = (this.activityCount || 0) + 1;
  if (activity.contactMade) {
    this.lastContactDate = new Date();
  }
  await this.save();
  return record;
};

// Instance method to add note
leadSchema.methods.addNote = async function (note) {
  const { default: LeadNote } = await import("./LeadNote.js");
  const body = note.body || note.content;
  const record = await LeadNote.create({
    ...note,
    body,
    contentText: note.contentText || body,
    pinned: note.pinned ?? note.isImportant ?? false,
    leadId: this._id,
  });
  this.lastActivityAt = new Date();
  await this.save();
  return record;
};

// Instance method to add task
leadSchema.methods.addTask = async function (task) {
  const { default: LeadTask } = await import("./LeadTask.js");
  const record = await LeadTask.create({ ...task, leadId: this._id });
  this.lastActivityAt = new Date();
  if (record.dueDate && record.dueDate < new Date()) {
    this.overdueTaskCount = (this.overdueTaskCount || 0) + 1;
  }
  await this.save();
  return record;
};

// Instance method to update stage with version history
leadSchema.methods.updateStage = function (newStage, userId, comment) {
  const oldStage = this.stage;
  this.stage = normalizeCRMStage(newStage);

  // Add to version history
  this.versionHistory.push({
    field: "stage",
    oldValue: oldStage,
    newValue: this.stage,
    changedBy: userId,
    comment: comment,
  });

  // Update last contact date
  this.lastContactDate = new Date();

  return this.save();
};

// Instance method to link to user
leadSchema.methods.linkToUser = function (userId) {
  this.linkedUser = userId;
  return this.save();
};

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
