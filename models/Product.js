import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Product Schema
 * Global product database managed by admins
 * Products can be reused across different moodboards
 */
const productSchema = mongoose.Schema(
  {
    // Product name/title
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Product description
    description: {
      type: String,
      trim: true,
    },
    // Product image URL
    imageUrl: {
      type: String,
      trim: true,
      required: true,
    },
    // Product link (where to buy/view)
    productUrl: {
      type: String,
      trim: true,
      required: true,
    },
    // Product price (VAT inclusive)
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    // Product supplier
    supplier: {
      type: String,
      trim: true,
      required: true,
    },
    // Product category (dynamically created by admin)
    category: {
      type: String,
      trim: true,
      required: true,
    },
    // Product SKU or reference number
    sku: {
      type: String,
      trim: true,
    },
    // Whether the product is active/available
    isActive: {
      type: Boolean,
      default: true,
    },
    // Additional product specifications
    specifications: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Product tags for easier searching
    tags: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
productSchema.plugin(toJSON);

// Indexes for efficient queries
productSchema.index({ category: 1, isActive: 1 });
productSchema.index({ supplier: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: "text", description: "text" });

// Static method to get all categories
productSchema.statics.getCategories = function () {
  return this.distinct("category").sort();
};

// Static method to get all suppliers
productSchema.statics.getSuppliers = function () {
  return this.distinct("supplier").sort();
};

// Static method to get active products by category
productSchema.statics.getActiveByCategory = function (category) {
  return this.find({ category, isActive: true }).sort({ name: 1 });
};

// Static method to search products
productSchema.statics.searchProducts = function (query) {
  return this.find({
    $and: [
      { isActive: true },
      {
        $or: [
          { name: { $regex: query, $options: "i" } },
          { description: { $regex: query, $options: "i" } },
          { supplier: { $regex: query, $options: "i" } },
          { tags: { $in: [new RegExp(query, "i")] } },
        ],
      },
    ],
  }).sort({ name: 1 });
};

export default mongoose.models.Product ||
  mongoose.model("Product", productSchema);
