import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Project Schema
 * Stores project-specific data linked to users
 * Projects are essentially users with "On Going" or "Finished" status
 */
const projectSchema = mongoose.Schema(
  {
    // Reference to the user who owns this project
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Project name/title
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Project description
    description: {
      type: String,
      trim: true,
    },
    // Project type (bathroom, kitchen, extension, etc.)
    type: {
      type: String,
      trim: true,
      required: true,
    },
    // Project status (On Going, Finished)
    status: {
      type: String,
      enum: ["On Going", "Finished"],
      default: "On Going",
    },
    // Project start date
    startDate: {
      type: Date,
      default: Date.now,
    },
    // Project completion date (set when status changes to Finished)
    completionDate: {
      type: Date,
    },
    // Project location/address
    location: {
      type: String,
      trim: true,
    },
    // Project budget
    budget: {
      type: Number,
      min: 0,
    },
    // Project priority
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
    // Project manager (employee assigned to oversee the project)
    projectManager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    // Project notes
    notes: {
      type: String,
      trim: true,
    },
    // Project tags for categorization
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // Project progress percentage (0-100)
    progress: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
projectSchema.plugin(toJSON);

// Virtual for getting tasks count
projectSchema.virtual("tasksCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
  count: true,
});

// Virtual for getting completed tasks count
projectSchema.virtual("completedTasksCount", {
  ref: "Task",
  localField: "_id",
  foreignField: "project",
  count: true,
  match: { status: "Done" },
});

// Pre-save middleware to set completion date when status changes to Finished
projectSchema.pre("save", function (next) {
  if (
    this.isModified("status") &&
    this.status === "Finished" &&
    !this.completionDate
  ) {
    this.completionDate = new Date();
  }
  next();
});

// Static method to get ongoing projects
projectSchema.statics.getOngoingProjects = function () {
  return this.find({ status: "On Going" })
    .populate("user", "name email")
    .populate("projectManager", "name position")
    .sort({ priority: -1, startDate: -1 });
};

// Static method to get finished projects
projectSchema.statics.getFinishedProjects = function () {
  return this.find({ status: "Finished" })
    .populate("user", "name email")
    .populate("projectManager", "name position")
    .sort({ completionDate: -1 });
};

// Static method to get projects by type
projectSchema.statics.getProjectsByType = function (type) {
  return this.find({ type })
    .populate("user", "name email")
    .populate("projectManager", "name position")
    .sort({ startDate: -1 });
};

// Instance method to update progress based on tasks
projectSchema.methods.updateProgress = async function () {
  const Task = mongoose.model("Task");
  const totalTasks = await Task.countDocuments({ project: this._id });
  const completedTasks = await Task.countDocuments({
    project: this._id,
    status: "Done",
  });

  this.progress =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  return this.save();
};

export default mongoose.models.Project ||
  mongoose.model("Project", projectSchema);
