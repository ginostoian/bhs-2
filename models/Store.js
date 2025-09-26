import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

/**
 * Store Schema
 * Manages store options for item purchases dropdown
 */
const storeSchema = mongoose.Schema(
  {
    // Name of the store
    name: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    // Store color for UI display (optional)
    color: {
      type: String,
      trim: true,
      default: "#6B7280", // Default gray color
    },
    // Whether the store is active
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
storeSchema.plugin(toJSON);

// Index for name lookup
storeSchema.index({ name: 1 });

const Store = mongoose.models.Store || mongoose.model("Store", storeSchema);

export default Store;
