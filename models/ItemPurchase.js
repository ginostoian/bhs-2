import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

/**
 * ItemPurchase Schema
 * Handles project item purchase tracking with store management
 */
const itemPurchaseSchema = mongoose.Schema(
  {
    // Reference to the project this item purchase belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    // Name of the item purchased
    itemName: {
      type: String,
      trim: true,
      required: true,
    },
    // Store where the item was purchased
    store: {
      type: String,
      trim: true,
      required: true,
    },
    // Quoted price in GBP
    quotedPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    // Actual price paid in GBP
    paidPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    // Trade discount (calculated automatically)
    tradeDiscount: {
      type: Number,
      required: false,
      min: 0,
      default: 0,
    },
    // Date when the item was purchased
    purchaseDate: {
      type: Date,
      required: true,
    },
    // Expected delivery date
    deliveryDate: {
      type: Date,
      required: false,
    },
    // Order for drag-and-drop functionality
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // Additional notes
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

// Pre-save middleware to calculate trade discount
itemPurchaseSchema.pre("save", function (next) {
  if (this.quotedPrice !== undefined && this.paidPrice !== undefined) {
    this.tradeDiscount = this.quotedPrice - this.paidPrice;
  }
  next();
});

// Pre-update middleware to calculate trade discount
itemPurchaseSchema.pre(["updateOne", "findOneAndUpdate"], function (next) {
  const update = this.getUpdate();
  if (update.quotedPrice !== undefined && update.paidPrice !== undefined) {
    update.tradeDiscount = update.quotedPrice - update.paidPrice;
  }
  next();
});

// Virtual field to ensure trade discount is always calculated
itemPurchaseSchema.virtual("calculatedTradeDiscount").get(function () {
  if (this.quotedPrice !== undefined && this.paidPrice !== undefined) {
    return this.quotedPrice - this.paidPrice;
  }
  return 0;
});

// Add plugin that converts mongoose to json
itemPurchaseSchema.plugin(toJSON);

// Compound index for project and order to ensure proper ordering
itemPurchaseSchema.index({ project: 1, order: 1 });

const ItemPurchase =
  mongoose.models.ItemPurchase ||
  mongoose.model("ItemPurchase", itemPurchaseSchema);

export default ItemPurchase;
