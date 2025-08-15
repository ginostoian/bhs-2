import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

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
    address: {
      type: String,
      trim: true,
    },

    // CRM Pipeline Information
    stage: {
      type: String,
      enum: [
        "Lead",
        "Never replied",
        "Qualified",
        "Proposal Sent",
        "Negotiations",
        "Won",
        "Lost",
      ],
      default: "Lead",
      index: true,
    },

    // Lead Value and Budget
    value: {
      type: Number,
      min: 0,
      default: 0,
    },
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

    // User Linking
    linkedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
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

    // Activity Tracking
    activities: [
      {
        type: {
          type: String,
          enum: [
            "email",
            "call",
            "site_visit",
            "meeting",
            "note",
            "attachment",
          ],
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        status: {
          type: String,
          enum: ["pending", "done"],
          default: "pending",
        },
        contactMade: {
          type: Boolean,
          default: false,
        },
        date: {
          type: Date,
          default: Date.now,
        },
        dueDate: {
          type: Date,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: false, // Allow null for system-generated activities
        },
        attachments: [
          {
            name: String,
            url: String,
            type: String,
            size: Number,
          },
        ],
        metadata: {
          type: mongoose.Schema.Types.Mixed,
          default: {},
        },
      },
    ],

    // Notes System
    notes: [
      {
        title: {
          type: String,
          trim: true,
        },
        content: {
          type: String,
          required: true,
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        isImportant: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Tasks System
    tasks: [
      {
        title: {
          type: String,
          required: true,
        },
        description: {
          type: String,
        },
        status: {
          type: String,
          enum: ["pending", "in_progress", "completed", "overdue"],
          default: "pending",
        },
        priority: {
          type: String,
          enum: ["low", "medium", "high", "urgent"],
          default: "medium",
        },
        dueDate: {
          type: Date,
        },
        assignedTo: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        createdBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        createdAt: {
          type: Date,
          default: Date.now,
        },
        completedAt: {
          type: Date,
        },
      },
    ],

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
          required: true,
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

// Virtual for full source (including custom source)
leadSchema.virtual("fullSource").get(function () {
  return this.source === "Other" && this.customSource
    ? this.customSource
    : this.source;
});

// Virtual for full project types (including custom)
leadSchema.virtual("fullProjectTypes").get(function () {
  const types = [...this.projectTypes];
  if (this.customProjectType) {
    types.push(this.customProjectType);
  }
  return types;
});

// Pre-save middleware to update aging days and auto-link users
leadSchema.pre("save", async function (next) {
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
  this.activities.push(activity);

  // Only update lastContactDate if contact was actually made
  // or if it's a contact-type activity (call, email, meeting, site_visit)
  const contactActivities = ["call", "email", "meeting", "site_visit"];
  if (activity.contactMade || contactActivities.includes(activity.type)) {
    this.lastContactDate = new Date();
  }

  return this.save();
};

// Instance method to add note
leadSchema.methods.addNote = function (note) {
  this.notes.push(note);
  this.lastContactDate = new Date();
  return this.save();
};

// Instance method to add task
leadSchema.methods.addTask = function (task) {
  this.tasks.push(task);
  this.lastContactDate = new Date();
  return this.save();
};

// Instance method to update stage with version history
leadSchema.methods.updateStage = function (newStage, userId, comment) {
  const oldStage = this.stage;
  this.stage = newStage;

  // Add to version history
  this.versionHistory.push({
    field: "stage",
    oldValue: oldStage,
    newValue: newStage,
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
