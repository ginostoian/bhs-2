import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Milestone Schema
 * Handles project milestones with custom dates and descriptions
 */
const milestoneSchema = mongoose.Schema(
  {
    // Reference to the project this milestone belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    // Milestone name/title
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Milestone description
    description: {
      type: String,
      trim: true,
    },
    // Milestone date
    date: {
      type: Date,
      required: true,
    },
    // Milestone status (Scheduled, In Progress, Completed, Delayed)
    status: {
      type: String,
      enum: ["Scheduled", "In Progress", "Completed", "Delayed"],
      default: "Scheduled",
    },
    // Milestone type (Planning, Construction, Finishing, Custom)
    type: {
      type: String,
      enum: ["Planning", "Construction", "Finishing", "Custom"],
      default: "Custom",
    },
    // Milestone order for display
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // Milestone color for timeline display
    color: {
      type: String,
      default: "#3B82F6", // Blue
    },
    // Milestone icon
    icon: {
      type: String,
      default: "🎯",
    },
    // Additional notes
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
milestoneSchema.plugin(toJSON);

// Compound index for project and order
milestoneSchema.index({ project: 1, order: 1 });

// Pre-save middleware to auto-assign order
milestoneSchema.pre("save", function (next) {
  if (this.isNew && this.order === 0) {
    // Get the highest order for this project
    this.constructor
      .findOne({ project: this.project })
      .sort({ order: -1 })
      .select("order")
      .then((lastMilestone) => {
        this.order = (lastMilestone?.order || 0) + 1;
        next();
      })
      .catch(next);
  } else {
    next();
  }
});

// Static method to get milestones for a project
milestoneSchema.statics.getProjectMilestones = function (projectId) {
  return this.find({ project: projectId }).sort({ order: 1, date: 1 });
};

// Static method to get next order number for a project
milestoneSchema.statics.getNextOrder = async function (projectId) {
  const lastMilestone = await this.findOne({ project: projectId })
    .sort({ order: -1 })
    .select("order");

  return (lastMilestone?.order || 0) + 1;
};

export default mongoose.models.Milestone ||
  mongoose.model("Milestone", milestoneSchema);
