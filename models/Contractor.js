import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Contractor Schema
 * Stores external contractors/vendors with trades, pricing tier, and past experience
 */
const contractorSchema = mongoose.Schema(
  {
    // Display name of the contractor or company
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Primary contact email address
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    // Primary contact phone number
    phone: {
      type: String,
      trim: true,
    },
    // Address or service area
    address: {
      type: String,
      trim: true,
    },
    // Trades this contractor can perform (supports multiple tags)
    trades: [
      {
        type: String,
        trim: true,
      },
    ],
    // Pricing tier indicator
    priceTier: {
      type: String,
      enum: ["£", "££", "£££", "££££"],
      default: "££",
      index: true,
    },
    // Past experience quality
    experience: {
      type: String,
      enum: ["Bad", "Good", "Great"],
      default: "Good",
      index: true,
    },
    // Whether the contractor is currently active/available
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    // Optional free-form notes
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

// Add plugin that converts mongoose docs to clean JSON
contractorSchema.plugin(toJSON);

// Indexes for efficient queries and search
contractorSchema.index({
  name: "text",
  email: "text",
  phone: "text",
  address: "text",
});
contractorSchema.index({ trades: 1 });

export default mongoose.models.Contractor ||
  mongoose.model("Contractor", contractorSchema);
