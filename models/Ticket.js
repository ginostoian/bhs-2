import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Ticket Schema
 * Comprehensive ticketing system for warranty claims and support requests
 */
const ticketSchema = mongoose.Schema(
  {
    // Ticket Information
    ticketNumber: {
      type: String,
      unique: true,
      required: true,
      index: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    description: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
    },
    category: {
      type: String,
      enum: ["Warranty", "Support", "General", "Emergency"],
      required: true,
      default: "General",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High", "Critical"],
      required: true,
      default: "Medium",
    },
    status: {
      type: String,
      enum: [
        "New",
        "In Progress",
        "Waiting for Customer",
        "Scheduled",
        "Resolved",
        "Closed",
      ],
      required: true,
      default: "New",
      index: true,
    },

    // User Information
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    // Customer Contact Information (from form)
    customerPhone: {
      type: String,
      trim: true,
    },
    customerEmail: {
      type: String,
      trim: true,
    },

    // Project Link (optional)
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },

    // Assignment
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
    },

    // Scheduling
    scheduledDate: {
      type: Date,
      index: true,
    },
    scheduledTime: {
      type: String, // Format: "HH:MM"
    },
    estimatedDuration: {
      type: Number, // Duration in minutes
    },

    // Internal Notes (admin only)
    internalNotes: [
      {
        note: {
          type: String,
          trim: true,
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
      },
    ],

    // Customer Updates (visible to customer)
    customerUpdates: [
      {
        update: {
          type: String,
          trim: true,
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
      },
    ],

    // File Attachments
    attachments: [
      {
        fileName: {
          type: String,
          required: true,
        },
        filePath: {
          type: String,
          required: true,
        },
        fileUrl: {
          type: String,
          required: true,
        },
        fileSize: {
          type: Number,
          required: true,
        },
        contentType: {
          type: String,
          required: true,
        },
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        isCustomerSubmitted: {
          type: Boolean,
          default: false,
        },
      },
    ],

    // Resolution Information
    resolution: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    resolvedAt: {
      type: Date,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Email Notifications
    emailNotifications: {
      adminNotificationSent: {
        type: Boolean,
        default: false,
      },
      customerNotificationSent: {
        type: Boolean,
        default: false,
      },
      resolutionNotificationSent: {
        type: Boolean,
        default: false,
      },
    },

    // Metadata
    source: {
      type: String,
      enum: ["web-form", "admin-created", "api"],
      default: "web-form",
    },
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
ticketSchema.plugin(toJSON);

// Generate ticket number before saving
ticketSchema.pre("save", async function (next) {
  if (this.isNew) {
    const Ticket = mongoose.model("Ticket");
    const count = await Ticket.countDocuments();
    this.ticketNumber = `TKT-${String(count + 1).padStart(6, "0")}`;
  }
  next();
});

// Set resolvedAt when status changes to Resolved
ticketSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "Resolved" &&
    !this.resolvedAt
  ) {
    this.resolvedAt = new Date();
  }
  next();
});

// Virtual for full user name
ticketSchema.virtual("userFullName").get(function () {
  return this.user?.name || "Unknown User";
});

// Virtual for assigned employee name
ticketSchema.virtual("assignedEmployeeName").get(function () {
  return this.assignedTo?.name || "Unassigned";
});

// Virtual for project name
ticketSchema.virtual("projectName").get(function () {
  return this.project?.name || "No Project";
});

// Virtual for ticket age in days
ticketSchema.virtual("ageInDays").get(function () {
  const now = new Date();
  const created = new Date(this.createdAt);
  return Math.floor((now - created) / (1000 * 60 * 60 * 24));
});

// Virtual for is overdue (tickets older than 7 days in New status)
ticketSchema.virtual("isOverdue").get(function () {
  return this.status === "New" && this.ageInDays > 7;
});

// Static method to get tickets by status
ticketSchema.statics.getTicketsByStatus = function (status) {
  return this.find({ status })
    .populate("user", "name email")
    .populate("assignedTo", "name position")
    .populate("project", "name type")
    .sort({ createdAt: -1 });
};

// Static method to get tickets by user
ticketSchema.statics.getTicketsByUser = function (userId) {
  return this.find({ user: userId })
    .populate("assignedTo", "name position")
    .populate("project", "name type")
    .sort({ createdAt: -1 });
};

// Static method to get tickets by assigned employee
ticketSchema.statics.getTicketsByEmployee = function (employeeId) {
  return this.find({ assignedTo: employeeId })
    .populate("user", "name email")
    .populate("project", "name type")
    .sort({ priority: -1, createdAt: -1 });
};

// Static method to get overdue tickets
ticketSchema.statics.getOverdueTickets = function () {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  return this.find({
    status: "New",
    createdAt: { $lt: sevenDaysAgo },
  })
    .populate("user", "name email")
    .populate("assignedTo", "name position")
    .sort({ createdAt: 1 });
};

// Static method to get scheduled tickets for a date range
ticketSchema.statics.getScheduledTickets = function (startDate, endDate) {
  return this.find({
    scheduledDate: {
      $gte: startDate,
      $lte: endDate,
    },
  })
    .populate("user", "name email")
    .populate("assignedTo", "name position")
    .populate("project", "name type")
    .sort({ scheduledDate: 1, scheduledTime: 1 });
};

// Static method to get ticket statistics
ticketSchema.statics.getTicketStats = async function () {
  const stats = await this.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
  ]);

  const total = await this.countDocuments();
  const overdue = await this.getOverdueTickets().countDocuments();

  return {
    total,
    overdue,
    byStatus: stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {}),
  };
};

// Indexes for efficient queries
ticketSchema.index({ status: 1, createdAt: -1 });
ticketSchema.index({ user: 1, createdAt: -1 });
ticketSchema.index({ assignedTo: 1, status: 1 });
ticketSchema.index({ scheduledDate: 1 });
ticketSchema.index({ priority: 1, createdAt: -1 });
ticketSchema.index({ category: 1, status: 1 });

export default mongoose.models.Ticket || mongoose.model("Ticket", ticketSchema);
