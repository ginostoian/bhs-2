import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Project Note Schema
 * Stores project-specific notes with tags, importance status, and other metadata
 */
const projectNoteSchema = mongoose.Schema(
  {
    // Reference to the project this note belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    // Note content
    content: {
      type: String,
      trim: true,
      required: true,
    },
    // Note title/heading
    title: {
      type: String,
      trim: true,
      required: true,
    },
    // Tags for categorization (email, phone call, instruction, custom, etc.)
    tags: [
      {
        type: String,
        trim: true,
        enum: [
          "email",
          "phone call",
          "instruction",
          "meeting",
          "follow-up",
          "custom",
        ],
      },
    ],
    // Custom tag (if tags includes "custom")
    customTag: {
      type: String,
      trim: true,
    },
    // Importance status
    isImportant: {
      type: Boolean,
      default: false,
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
        // File size in bytes (optional)
        size: {
          type: Number,
        },
        // Upload date
        uploadedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    // Created by (admin/employee)
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // Last modified by
    modifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
projectNoteSchema.plugin(toJSON);

// Index for efficient querying
projectNoteSchema.index({ project: 1, createdAt: -1 });
projectNoteSchema.index({ project: 1, tags: 1 });
projectNoteSchema.index({ project: 1, isImportant: 1 });

// Static method to get notes by project with filters
projectNoteSchema.statics.getProjectNotes = function (projectId, filters = {}) {
  const query = { project: projectId };

  // Apply filters
  if (filters.tag && filters.tag !== "all") {
    if (filters.tag === "custom") {
      query.tags = "custom";
    } else {
      query.tags = filters.tag;
    }
  }

  if (filters.important !== undefined) {
    query.isImportant = filters.important;
  }

  if (filters.search) {
    query.$or = [
      { title: { $regex: filters.search, $options: "i" } },
      { content: { $regex: filters.search, $options: "i" } },
    ];
  }

  return this.find(query)
    .populate("createdBy", "name email role")
    .populate("modifiedBy", "name email role")
    .sort({ createdAt: -1 });
};

// Instance method to get all tags for a project
projectNoteSchema.statics.getProjectTags = function (projectId) {
  return this.distinct("tags", { project: projectId });
};

export default mongoose.models.ProjectNote ||
  mongoose.model("ProjectNote", projectNoteSchema);
