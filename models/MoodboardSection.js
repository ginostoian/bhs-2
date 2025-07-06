import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Moodboard Section Schema
 * Organizes products into sections within moodboards
 * Each section has a color and can be collapsed by users
 */
const moodboardSectionSchema = mongoose.Schema(
  {
    // Reference to the moodboard this section belongs to
    moodboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moodboard",
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
    // Order/position of the section within the moodboard
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
    // Whether the section is collapsed by default for users
    isCollapsed: {
      type: Boolean,
      default: false,
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
moodboardSectionSchema.plugin(toJSON);

// Indexes for efficient queries
moodboardSectionSchema.index({ moodboard: 1, order: 1 });
moodboardSectionSchema.index({ moodboard: 1, isActive: 1 });

// Virtual for getting products count
moodboardSectionSchema.virtual("productsCount", {
  ref: "MoodboardProduct",
  localField: "_id",
  foreignField: "section",
  count: true,
});

// Virtual for getting products
moodboardSectionSchema.virtual("products", {
  ref: "MoodboardProduct",
  localField: "_id",
  foreignField: "section",
});

// Static method to get sections for a moodboard
moodboardSectionSchema.statics.getMoodboardSections = function (moodboardId) {
  return this.find({ moodboard: moodboardId, isActive: true })
    .populate({
      path: "products",
      match: { isActive: true },
      populate: "product",
      options: { sort: { order: 1 } },
    })
    .sort({ order: 1 });
};

// Static method to get next order number for a moodboard
moodboardSectionSchema.statics.getNextOrder = async function (moodboardId) {
  const lastSection = await this.findOne({ moodboard: moodboardId })
    .sort({ order: -1 })
    .select("order");

  return (lastSection?.order || 0) + 1;
};

export default mongoose.models.MoodboardSection ||
  mongoose.model("MoodboardSection", moodboardSectionSchema);
