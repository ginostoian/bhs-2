import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";
import { CATALOGUE_CATEGORIES, slugify } from "../libs/catalogue.js";

const catalogueCategoryValues = CATALOGUE_CATEGORIES.map((category) => category.id);

const variantSchema = mongoose.Schema(
  {
    id: {
      type: String,
      trim: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
    },
    color: {
      type: String,
      trim: true,
    },
    colorValue: {
      type: String,
      trim: true,
    },
    colorSwatch: {
      type: String,
      trim: true,
    },
    size: {
      type: String,
      trim: true,
    },
    finish: {
      type: String,
      trim: true,
    },
    sku: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    price: {
      type: Number,
      min: 0,
      default: 0,
    },
    stockStatus: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock", "made_to_order"],
      default: "in_stock",
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false },
);

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
    },
    // Product price (VAT inclusive)
    price: {
      type: Number,
      min: 0,
      default: 0,
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
    // Public catalogue slug
    slug: {
      type: String,
      trim: true,
      index: true,
    },
    // Customer-facing brand
    brand: {
      type: String,
      trim: true,
    },
    // Top-level public catalogue category
    catalogueCategory: {
      type: String,
      trim: true,
      enum: catalogueCategoryValues,
    },
    // Whether the product should be visible in the public catalogue
    catalogueEnabled: {
      type: Boolean,
      default: false,
    },
    // Main stock status
    stockStatus: {
      type: String,
      enum: ["in_stock", "low_stock", "out_of_stock", "made_to_order"],
      default: "in_stock",
    },
    // Optional gallery images for richer product display
    gallery: [
      {
        type: String,
        trim: true,
      },
    ],
    // Optional product finish and material fields
    finish: {
      type: String,
      trim: true,
    },
    material: {
      type: String,
      trim: true,
    },
    // Optional lead time in days
    leadTimeDays: {
      type: Number,
      min: 0,
    },
    // Catalogue variants for colour, size, and pricing
    variants: {
      type: [variantSchema],
      default: [],
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
productSchema.index({ brand: 1 });
productSchema.index({ catalogueCategory: 1, catalogueEnabled: 1, isActive: 1 });
productSchema.index({ tags: 1 });
productSchema.index({ name: "text", description: "text" });

productSchema.pre("save", function handleCatalogueDefaults(next) {
  if (this.name && !this.slug) {
    this.slug = slugify(this.name);
  }

  if (!this.brand && this.supplier) {
    this.brand = this.supplier;
  }

  if (this.catalogueEnabled === undefined || this.catalogueEnabled === null) {
    this.catalogueEnabled = false;
  }

  if (this.variants?.length) {
    const defaultIndex = this.variants.findIndex((variant) => variant.isDefault);
    if (defaultIndex === -1) {
      this.variants[0].isDefault = true;
    }

    this.variants = this.variants.map((variant, index) => ({
      ...variant,
      id:
        variant.id ||
        slugify(
          variant.title || `${variant.color || "variant"}-${variant.size || index + 1}`,
        ) ||
        `variant-${index + 1}`,
      colorValue:
        variant.colorValue ||
        (variant.color ? slugify(variant.color).replace(/-/g, " ") : ""),
    }));

    const prices = this.variants
      .map((variant) => Number(variant.price))
      .filter((value) => Number.isFinite(value));

    if (prices.length && (!this.price || this.price === 0)) {
      this.price = Math.min(...prices);
    }
  }

  next();
});

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
