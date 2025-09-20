import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * TemplateMessage Schema
 * Stores reusable text snippets, messages, and information for admin use
 */
const templateMessageSchema = mongoose.Schema(
  {
    // Template title/name
    title: {
      type: String,
      trim: true,
      required: true,
      maxlength: 200,
    },
    // Template content (supports rich text)
    content: {
      type: String,
      required: true,
    },
    // Template category
    category: {
      type: String,
      required: true,
      enum: [
        "Email Templates",
        "SMS Templates",
        "General Messages",
        "Project Communications",
        "Support Responses",
        "Quote Templates",
        "Bank Information",
      ],
      index: true,
    },
    // Tags for easier searching and organization
    tags: [
      {
        type: String,
        trim: true,
        maxlength: 50,
      },
    ],
    // Whether the template is active/available
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Usage tracking
    usageCount: {
      type: Number,
      default: 0,
    },
    // Last time this template was used
    lastUsed: {
      type: Date,
    },
    // Template version for change tracking
    version: {
      type: Number,
      default: 1,
    },
    // Admin who created this template
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Admin who last updated this template
    lastUpdatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    // Short description/notes about the template
    description: {
      type: String,
      trim: true,
      maxlength: 500,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
templateMessageSchema.plugin(toJSON);

// Indexes for efficient queries
templateMessageSchema.index({ category: 1, isActive: 1 });
templateMessageSchema.index({ tags: 1 });
templateMessageSchema.index({ usageCount: -1 });
templateMessageSchema.index({ lastUsed: -1 });
templateMessageSchema.index({ createdAt: -1 });

// Virtual for content preview (first 100 characters)
templateMessageSchema.virtual("contentPreview").get(function () {
  if (!this.content) return "";
  // Strip HTML tags for preview
  const plainText = this.content.replace(/<[^>]*>/g, "");
  return plainText.length > 100
    ? plainText.substring(0, 100) + "..."
    : plainText;
});

// Method to increment usage count
templateMessageSchema.methods.incrementUsage = function () {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

// Export model, but only if it doesn't already exist
export default mongoose.models.TemplateMessage ||
  mongoose.model("TemplateMessage", templateMessageSchema);
