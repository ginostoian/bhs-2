import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Gantt Share Schema
 * Handles public sharing of Gantt charts via unique tokens
 */
const ganttShareSchema = mongoose.Schema(
  {
    // Reference to the project this share belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    // Unique token for the share link
    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Whether the share is active
    isActive: {
      type: Boolean,
      default: true,
    },
    // Expiration date (optional)
    expiresAt: {
      type: Date,
    },
    // Created by (admin)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Number of views
    viewCount: {
      type: Number,
      default: 0,
    },
    // Last viewed date
    lastViewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
ganttShareSchema.plugin(toJSON);

// Generate a unique token
ganttShareSchema.statics.generateToken = function () {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let token = "";
  for (let i = 0; i < 32; i++) {
    token += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return token;
};

// Static method to get active share by token
ganttShareSchema.statics.getActiveByToken = function (token) {
  return this.findOne({
    token,
    isActive: true,
    $or: [
      { expiresAt: { $exists: false } },
      { expiresAt: { $gt: new Date() } },
    ],
  }).populate("project", "name type status");
};

// Static method to get shares for a project
ganttShareSchema.statics.getProjectShares = function (projectId) {
  return this.find({ project: projectId })
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// Instance method to increment view count
ganttShareSchema.methods.incrementView = function () {
  this.viewCount += 1;
  this.lastViewedAt = new Date();
  return this.save();
};

export default mongoose.models.GanttShare ||
  mongoose.model("GanttShare", ganttShareSchema);
