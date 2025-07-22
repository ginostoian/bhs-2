import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * AdminTask Schema
 * Handles admin-only tasks within projects for office staff
 */
const adminTaskSchema = mongoose.Schema(
  {
    // Reference to the project this admin task belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    // Task name/title
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Task description/notes
    description: {
      type: String,
      trim: true,
    },
    // Admin user assigned to this task
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Task priority
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    // Due date for the task
    dueDate: {
      type: Date,
      required: true,
    },
    // Task status (Scheduled, In Progress, Done)
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Done"],
      default: "Scheduled",
    },
    // Task order for reordering
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // File attachments
    attachments: [
      {
        // File name
        name: {
          type: String,
          required: true,
        },
        // File URL
        url: {
          type: String,
          required: true,
        },
        // File type
        type: {
          type: String,
          required: true,
        },
        // File size in bytes
        size: {
          type: Number,
        },
        // Upload date
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
        // Uploaded by
        uploadedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    // Task notes
    notes: {
      type: String,
      trim: true,
    },
    // Task tags
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // Related documents (references to existing documents)
    relatedDocuments: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Document",
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
adminTaskSchema.plugin(toJSON);

// Compound index for project and order
adminTaskSchema.index({ project: 1, order: 1 });

// Pre-save middleware to set completion date
adminTaskSchema.pre("save", function (next) {
  // Set completion date when status changes to "Done"
  if (
    this.isModified("status") &&
    this.status === "Done" &&
    !this.completionDate
  ) {
    this.completionDate = new Date();
  }

  next();
});

// Static method to get admin tasks for a project
adminTaskSchema.statics.getProjectAdminTasks = function (projectId) {
  return this.find({ project: projectId })
    .populate("assignedTo", "name email role")
    .sort({ order: 1 });
};

// Static method to get admin tasks for an admin user
adminTaskSchema.statics.getAdminUserTasks = function (adminUserId) {
  return this.find({ assignedTo: adminUserId })
    .populate("project", "name type status")
    .sort({ dueDate: 1, priority: -1 });
};

// Static method to get admin tasks by status
adminTaskSchema.statics.getAdminTasksByStatus = function (status) {
  return this.find({ status })
    .populate("project", "name type")
    .populate("assignedTo", "name email")
    .sort({ dueDate: 1 });
};

// Static method to get next order number for a project
adminTaskSchema.statics.getNextOrder = async function (projectId) {
  const lastTask = await this.findOne({ project: projectId })
    .sort({ order: -1 })
    .select("order");

  return (lastTask?.order || 0) + 1;
};

// Instance method to add attachment
adminTaskSchema.methods.addAttachment = function (attachment) {
  this.attachments.push(attachment);
  return this.save();
};

// Instance method to remove attachment
adminTaskSchema.methods.removeAttachment = function (attachmentId) {
  this.attachments = this.attachments.filter(
    (attachment) => attachment._id.toString() !== attachmentId,
  );
  return this.save();
};

export default mongoose.models.AdminTask ||
  mongoose.model("AdminTask", adminTaskSchema);
