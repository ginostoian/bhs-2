import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const catalogueShareItemSchema = mongoose.Schema(
  {
    productId: {
      type: String,
      trim: true,
      required: true,
    },
    variantId: {
      type: String,
      trim: true,
      default: "default",
    },
    quantity: {
      type: Number,
      min: 1,
      default: 1,
    },
    name: {
      type: String,
      trim: true,
      required: true,
    },
    brand: {
      type: String,
      trim: true,
    },
    productType: {
      type: String,
      trim: true,
    },
    catalogueCategory: {
      type: String,
      trim: true,
    },
    color: {
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
    unitPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    linePrice: {
      type: Number,
      min: 0,
      default: 0,
    },
    stockStatus: {
      type: String,
      trim: true,
      default: "in_stock",
    },
  },
  { _id: false },
);

const catalogueShareSchema = mongoose.Schema(
  {
    token: {
      type: String,
      trim: true,
      required: true,
      unique: true,
      index: true,
    },
    items: {
      type: [catalogueShareItemSchema],
      default: [],
    },
    itemCount: {
      type: Number,
      min: 0,
      default: 0,
    },
    totalPrice: {
      type: Number,
      min: 0,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

catalogueShareSchema.plugin(toJSON);

export default mongoose.models.CatalogueShare ||
  mongoose.model("CatalogueShare", catalogueShareSchema);
