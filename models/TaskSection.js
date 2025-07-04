import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Task Section Schema
 * Organizes tasks into dynamic sections within projects
 * Admins can create custom sections like "Bathroom Renovation", "Kitchen Renovation", etc.
 */
const taskSectionSchema = mongoose.Schema(
  {
    // Reference to the project this section belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    // Section name/title
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Section description
    description: {
      type: String,
      trim: true,
    },
    // Section color for visual distinction
    color: {
      type: String,
      trim: true,
      default: "#3B82F6", // Default blue
    },
    // Section icon (emoji or icon name)
    icon: {
      type: String,
      trim: true,
      default: "📋",
    },
    // Order/position of the section within the project
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // Whether the section is active
    isActive: {
      type: Boolean,
      default: true,
    },
    // Section notes
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
taskSectionSchema.plugin(toJSON);

// Virtual for getting tasks count in this section
taskSectionSchema.virtual("tasksCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "section",
  count: true,
});

// Virtual for getting completed tasks count in this section
taskSectionSchema.virtual("completedTasksCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "section",
  count: true,
  match: { status: "Done" },
});

// Compound index for project and order
taskSectionSchema.index({ project: 1, order: 1 });

// Static method to get sections for a project
taskSectionSchema.statics.getProjectSections = function (projectId) {
  return this.find({
    project: projectId,
    isActive: true,
  }).sort({ order: 1, name: 1 });
};

// Static method to get next order number for a project
taskSectionSchema.statics.getNextOrder = async function (projectId) {
  const lastSection = await this.findOne({ project: projectId })
    .sort({ order: -1 })
    .select("order");

  return (lastSection?.order || 0) + 1;
};

// Instance method to update section progress
taskSectionSchema.methods.updateProgress = async function () {
  const Task = mongoose.model("Task");
  const totalTasks = await Task.countDocuments({ section: this._id });
  const completedTasks = await Task.countDocuments({
    section: this._id,
    status: "Done",
  });

  return {
    total: totalTasks,
    completed: completedTasks,
    percentage:
      totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0,
  };
};

export default mongoose.models.TaskSection ||
  mongoose.model("TaskSection", taskSectionSchema);
