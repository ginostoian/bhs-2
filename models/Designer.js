import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Designer Schema
 * Handles designer accounts with limited access to moodboards and products only
 * Designers can manage moodboards and view/edit products but have no access to other admin functions
 */
const designerSchema = mongoose.Schema(
  {
    // Designer's full name
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Designer's email address (required, unique, used for authentication)
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      private: true,
    },
    // Designer's profile image URL (from OAuth providers)
    image: {
      type: String,
    },
    // Designer role (always "designer" for this model)
    role: {
      type: String,
      enum: ["designer"],
      default: "designer",
    },
    // Designer's phone number
    phone: {
      type: String,
      trim: true,
    },
    // Designer's specializations/areas of expertise
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
    // Whether the designer is active
    isActive: {
      type: Boolean,
      default: true,
    },
    // Designer's portfolio URL (optional)
    portfolioUrl: {
      type: String,
      trim: true,
    },
    // Designer's experience level
    experienceLevel: {
      type: String,
      enum: ["junior", "mid", "senior", "lead"],
      default: "mid",
    },
    // Designer's availability status
    availability: {
      type: String,
      enum: ["available", "busy", "unavailable"],
      default: "available",
    },
    // Notes about the designer
    notes: {
      type: String,
      trim: true,
    },
    // Last login timestamp for activity tracking
    lastLoginAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
designerSchema.plugin(toJSON);

// Indexes for efficient queries
designerSchema.index({ email: 1 });
designerSchema.index({ isActive: 1 });
designerSchema.index({ specializations: 1 });

// Virtual for getting assigned moodboards count
designerSchema.virtual("moodboardsCount", {
  ref: "Moodboard",
  localField: "_id",
  foreignField: "designer",
  count: true,
});

// Static method to get active designers
designerSchema.statics.getActiveDesigners = function () {
  return this.find({ isActive: true }).sort({ name: 1 });
};

// Static method to get designers by specialization
designerSchema.statics.getBySpecialization = function (specialization) {
  return this.find({
    isActive: true,
    specializations: { $in: [specialization] },
  }).sort({ name: 1 });
};

export default mongoose.models.Designer ||
  mongoose.model("Designer", designerSchema);
