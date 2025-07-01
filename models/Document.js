import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

/**
 * Document Schema
 * Handles various document types: quotes, invoices, comments, and photos
 * Each document is associated with a user and can have different content formats
 */
const documentSchema = mongoose.Schema(
  {
    // Reference to the user who owns this document
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster queries when fetching user's documents
    },
    // Type of document (quote, invoice, comment, photo)
    type: {
      type: String,
      enum: ["quote", "invoice", "comment", "photo"],
      required: true,
    },
    // Document content - can be text, URL, or structured data
    // For quotes/invoices: JSON with pricing details
    // For comments: plain text
    // For photos: URL to the image
    content: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    // Status for invoices (pending/paid) - only relevant for invoice type
    status: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
documentSchema.plugin(toJSON);

export default mongoose.models.Document ||
  mongoose.model("Document", documentSchema);
