import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Task Schema
 * Handles individual tasks within projects with file attachments and employee assignment
 */
const taskSchema = mongoose.Schema(
  {
    // Reference to the project this task belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    // Reference to the section this task belongs to
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskSection",
      required: true,
      index: true,
    },
    // Task name/title
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Task description
    description: {
      type: String,
      trim: true,
    },
    // Task status (Scheduled, Blocked, In Progress, Done)
    status: {
      type: String,
      enum: ["Scheduled", "Blocked", "In Progress", "Done"],
      default: "Scheduled",
    },
    // Employee assigned to this task
    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      index: true,
    },
    // Estimated duration in days
    estimatedDuration: {
      type: Number,
      min: 0,
      default: 1,
    },
    // Actual duration in days (calculated when task is completed)
    actualDuration: {
      type: Number,
      min: 0,
    },
    // Task start date
    startDate: {
      type: Date,
    },
    // Task completion date
    completionDate: {
      type: Date,
    },
    // Task due date
    dueDate: {
      type: Date,
    },
    // Task priority
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    // Task order within the section
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
taskSchema.plugin(toJSON);

// Compound index for section and order
taskSchema.index({ section: 1, order: 1 });

// Pre-save middleware to set start/completion dates
taskSchema.pre("save", function (next) {
  // Set start date when status changes to "In Progress"
  if (
    this.isModified("status") &&
    this.status === "In Progress" &&
    !this.startDate
  ) {
    this.startDate = new Date();
  }

  // Set completion date when status changes to "Done"
  if (
    this.isModified("status") &&
    this.status === "Done" &&
    !this.completionDate
  ) {
    this.completionDate = new Date();

    // Calculate actual duration if start date exists
    if (this.startDate) {
      const start = new Date(this.startDate);
      const completion = new Date(this.completionDate);
      const diffTime = Math.abs(completion - start);
      this.actualDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
  }

  next();
});

// Post-save middleware to update project progress
taskSchema.post("save", async function () {
  try {
    const Project = mongoose.model("Project");
    const project = await Project.findById(this.project);
    if (project) {
      await project.updateProgress();
    }
  } catch (error) {
    console.error("Error updating project progress:", error);
  }
});

// Static method to get tasks for a project
taskSchema.statics.getProjectTasks = function (projectId) {
  return this.find({ project: projectId })
    .populate("assignedTo", "name position")
    .populate("section", "name color icon")
    .sort({ "section.order": 1, order: 1 });
};

// Static method to get tasks for an employee
taskSchema.statics.getEmployeeTasks = function (employeeId) {
  return this.find({ assignedTo: employeeId })
    .populate("project", "name type status")
    .populate("section", "name color icon")
    .sort({ dueDate: 1, priority: -1 });
};

// Static method to get tasks by status
taskSchema.statics.getTasksByStatus = function (status) {
  return this.find({ status })
    .populate("project", "name type")
    .populate("assignedTo", "name")
    .populate("section", "name")
    .sort({ dueDate: 1 });
};

// Static method to get next order number for a section
taskSchema.statics.getNextOrder = async function (sectionId) {
  const lastTask = await this.findOne({ section: sectionId })
    .sort({ order: -1 })
    .select("order");

  return (lastTask?.order || 0) + 1;
};

// Instance method to add attachment
taskSchema.methods.addAttachment = function (attachment) {
  this.attachments.push(attachment);
  return this.save();
};

// Instance method to remove attachment
taskSchema.methods.removeAttachment = function (attachmentId) {
  this.attachments = this.attachments.filter(
    (attachment) => attachment._id.toString() !== attachmentId,
  );
  return this.save();
};

export default mongoose.models.Task || mongoose.model("Task", taskSchema);
