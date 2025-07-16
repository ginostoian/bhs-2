import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

/**
 * File Schema
 * Stores metadata for files uploaded to bunny.net storage
 */
const fileSchema = mongoose.Schema(
  {
    // Original file name
    originalName: {
      type: String,
      required: true,
      trim: true,
    },
    // Unique file name in storage
    fileName: {
      type: String,
      required: true,
      trim: true,
    },
    // File path in bunny.net storage
    filePath: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    // Public URL to access the file
    url: {
      type: String,
      required: true,
      trim: true,
    },
    // File size in bytes
    size: {
      type: Number,
      required: true,
      min: 0,
    },
    // MIME type
    contentType: {
      type: String,
      required: true,
      trim: true,
    },
    // File extension
    extension: {
      type: String,
      trim: true,
    },
    // Upload folder
    folder: {
      type: String,
      default: "uploads",
      trim: true,
    },
    // User who uploaded the file
    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Associated entity (optional - for linking to documents, tasks, etc.)
    entityType: {
      type: String,
      enum: ["document", "task", "project", "note", "user", "other"],
      default: "other",
    },
    // Associated entity ID (optional)
    entityId: {
      type: mongoose.Schema.Types.ObjectId,
      index: true,
    },
    // File tags for categorization
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
    // File description
    description: {
      type: String,
      trim: true,
    },
    // Whether the file is public or private
    isPublic: {
      type: Boolean,
      default: true,
    },
    // File hash for integrity checking
    hash: {
      type: String,
      trim: true,
    },
    // Upload metadata
    uploadMetadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
fileSchema.plugin(toJSON);

// Indexes for better query performance
fileSchema.index({ uploadedBy: 1, createdAt: -1 });
fileSchema.index({ entityType: 1, entityId: 1 });
fileSchema.index({ contentType: 1 });
fileSchema.index({ size: 1 });
fileSchema.index({ tags: 1 });

// Virtual for file type category
fileSchema.virtual("fileType").get(function () {
  const ext = this.extension?.toLowerCase();
  if (!ext) return "unknown";

  const typeMap = {
    // Images
    ".jpg": "image",
    ".jpeg": "image",
    ".png": "image",
    ".gif": "image",
    ".webp": "image",
    ".svg": "image",
    ".bmp": "image",
    ".tiff": "image",
    // Documents
    ".pdf": "document",
    ".doc": "document",
    ".docx": "document",
    ".xls": "document",
    ".xlsx": "document",
    ".ppt": "document",
    ".pptx": "document",
    ".txt": "document",
    ".rtf": "document",
    // Videos
    ".mp4": "video",
    ".avi": "video",
    ".mov": "video",
    ".wmv": "video",
    ".flv": "video",
    ".webm": "video",
    // Audio
    ".mp3": "audio",
    ".wav": "audio",
    ".flac": "audio",
    ".aac": "audio",
    // Archives
    ".zip": "archive",
    ".rar": "archive",
    ".7z": "archive",
    ".tar": "archive",
    ".gz": "archive",
  };

  return typeMap[ext] || "other";
});

// Virtual for formatted file size
fileSchema.virtual("formattedSize").get(function () {
  if (this.size === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(this.size) / Math.log(k));
  return parseFloat((this.size / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
});

// Static method to create file record from upload result
fileSchema.statics.createFromUpload = function (
  uploadResult,
  userId,
  entityType = "other",
  entityId = null,
) {
  const extension = uploadResult.originalName.split(".").pop()?.toLowerCase();

  return this.create({
    originalName: uploadResult.originalName,
    fileName: uploadResult.fileName,
    filePath: uploadResult.filePath,
    url: uploadResult.url,
    size: uploadResult.size,
    contentType: uploadResult.contentType,
    extension: extension ? `.${extension}` : null,
    folder:
      uploadResult.filePath.split("/").slice(0, -1).join("/") || "uploads",
    uploadedBy: userId,
    entityType,
    entityId,
    uploadMetadata: {
      bunnyResponse: uploadResult.bunnyResponse,
      userId: uploadResult.userId,
      userName: uploadResult.userName,
    },
  });
};

// Static method to get file statistics
fileSchema.statics.getStats = async function (userId = null) {
  const match = userId ? { uploadedBy: userId } : {};

  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalFiles: { $sum: 1 },
        totalSize: { $sum: "$size" },
        avgSize: { $avg: "$size" },
        fileTypes: { $addToSet: "$contentType" },
      },
    },
  ]);

  return (
    stats[0] || {
      totalFiles: 0,
      totalSize: 0,
      avgSize: 0,
      fileTypes: [],
    }
  );
};

// Instance method to get file info for API response
fileSchema.methods.toAPIResponse = function () {
  return {
    id: this._id.toString(),
    originalName: this.originalName,
    fileName: this.fileName,
    filePath: this.filePath,
    url: this.url,
    size: this.size,
    contentType: this.contentType,
    extension: this.extension,
    folder: this.folder,
    entityType: this.entityType,
    entityId: this.entityId,
    tags: this.tags,
    description: this.description,
    isPublic: this.isPublic,
    fileType: this.fileType,
    formattedSize: this.formattedSize,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

export default mongoose.models.File || mongoose.model("File", fileSchema);
