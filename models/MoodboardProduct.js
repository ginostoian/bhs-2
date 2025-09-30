import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Moodboard Product Schema
 * Products within moodboard sections with user-specific data
 * Links to the global Product database but stores user-specific information
 */
const moodboardProductSchema = mongoose.Schema(
  {
    // Reference to the moodboard this product belongs to
    moodboard: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moodboard",
      required: true,
      index: true,
    },
    // Reference to the section this product belongs to
    section: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MoodboardSection",
      required: true,
      index: true,
    },
    // Reference to the global product
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    // Quantity needed for this product
    quantity: {
      type: Number,
      required: true,
      min: 1,
      default: 1,
    },
    // User's approval status (pending, approved, declined)
    approvalStatus: {
      type: String,
      enum: ["pending", "approved", "declined"],
      default: "pending",
    },
    // User's comment on this product
    userComment: {
      type: String,
      trim: true,
    },
    // Admin's comment on this product (for collaboration)
    adminComment: {
      type: String,
      trim: true,
    },
    // Order/position of the product within the section
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // Whether this product is active
    isActive: {
      type: Boolean,
      default: true,
    },
    // Custom price override (if different from product price)
    customPrice: {
      type: Number,
      min: 0,
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

// Add plugin that converts mongoose to json
moodboardProductSchema.plugin(toJSON);

// Indexes for efficient queries
moodboardProductSchema.index({ moodboard: 1, section: 1, order: 1 });
moodboardProductSchema.index({ moodboard: 1, approvalStatus: 1 });
moodboardProductSchema.index({ section: 1, order: 1 });

// Virtual for total price (quantity * price)
moodboardProductSchema.virtual("totalPrice").get(function () {
  const price = this.customPrice || this.product?.price || 0;
  return price * this.quantity;
});

// Virtual for price per unit
moodboardProductSchema.virtual("unitPrice").get(function () {
  return this.customPrice || this.product?.price || 0;
});

// Static method to get products for a moodboard
moodboardProductSchema.statics.getMoodboardProducts = function (moodboardId) {
  return this.find({ moodboard: moodboardId, isActive: true })
    .populate("product")
    .populate("section", "name color icon")
    .sort({ "section.order": 1, order: 1 });
};

// Static method to get products for a section
moodboardProductSchema.statics.getSectionProducts = function (sectionId) {
  return this.find({ section: sectionId, isActive: true })
    .populate("product")
    .sort({ order: 1 });
};

// Static method to get next order number for a section
moodboardProductSchema.statics.getNextOrder = async function (sectionId) {
  const lastProduct = await this.findOne({ section: sectionId })
    .sort({ order: -1 })
    .select("order");

  return (lastProduct?.order || 0) + 1;
};

// Static method to get products by approval status
moodboardProductSchema.statics.getByApprovalStatus = function (
  moodboardId,
  status,
) {
  return this.find({
    moodboard: moodboardId,
    approvalStatus: status,
    isActive: true,
  })
    .populate("product")
    .populate("section", "name color icon")
    .sort({ "section.order": 1, order: 1 });
};

// Instance method to update approval status
moodboardProductSchema.methods.updateApprovalStatus = function (
  status,
  comment = null,
) {
  this.approvalStatus = status;
  if (comment) {
    this.userComment = comment;
  }
  return this.save();
};

// Instance method to add admin comment
moodboardProductSchema.methods.addAdminComment = function (comment) {
  this.adminComment = comment;
  return this.save();
};

export default mongoose.models.MoodboardProduct ||
  mongoose.model("MoodboardProduct", moodboardProductSchema);
