import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Moodboard Schema
 * User-specific moodboards for product selection and approval
 */
const moodboardSchema = mongoose.Schema(
  {
    // Reference to the user who owns this moodboard
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Reference to the project this moodboard belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      index: true,
    },
    // Moodboard name/title
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Moodboard description
    description: {
      type: String,
      trim: true,
    },
    // Whether the moodboard is active
    isActive: {
      type: Boolean,
      default: true,
    },
    // Moodboard status (draft, shared, approved, completed)
    status: {
      type: String,
      enum: ["draft", "shared", "approved", "completed"],
      default: "draft",
    },
    // Project type this moodboard is for
    projectType: {
      type: String,
      trim: true,
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
moodboardSchema.plugin(toJSON);

// Indexes for efficient queries
moodboardSchema.index({ user: 1, status: 1 });
moodboardSchema.index({ user: 1, isActive: 1 });

// Virtual for getting sections count
moodboardSchema.virtual("sectionsCount", {
  ref: "MoodboardSection",
  localField: "_id",
  foreignField: "moodboard",
  count: true,
});

// Virtual for getting products count
moodboardSchema.virtual("productsCount", {
  ref: "MoodboardProduct",
  localField: "_id",
  foreignField: "moodboard",
  count: true,
});

// Static method to get user's moodboards
moodboardSchema.statics.getUserMoodboards = function (userId) {
  return this.find({ user: userId, isActive: true })
    .populate("user", "name email")
    .sort({ updatedAt: -1 });
};

// Static method to get moodboard with sections and products
moodboardSchema.statics.getMoodboardWithDetails = function (moodboardId) {
  return this.findById(moodboardId)
    .populate("user", "name email")
    .populate({
      path: "sections",
      populate: {
        path: "products",
        populate: "product",
      },
    });
};

export default mongoose.models.Moodboard ||
  mongoose.model("Moodboard", moodboardSchema);
