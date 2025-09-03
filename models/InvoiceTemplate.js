import mongoose from "mongoose";

const InvoiceTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },

    // Template line item
    serviceName: {
      type: String,
      required: true,
      trim: true,
    },
    priceExclVat: {
      type: Number,
      required: true,
      min: 0,
    },
    vatRate: {
      type: Number,
      required: true,
      default: 20,
    },
    type: {
      type: String,
      required: true,
      enum: ["Labour", "Material"],
    },

    // Default quantity for this template
    defaultQuantity: {
      type: Number,
      default: 1,
      min: 0,
    },

    // Category for organization
    category: {
      type: String,
      trim: true,
      default: "General",
    },

    // Usage tracking
    usageCount: {
      type: Number,
      default: 0,
    },
    lastUsed: {
      type: Date,
    },

    // Admin who created/modified
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    // Status
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

// Method to increment usage count
InvoiceTemplateSchema.methods.markAsUsed = function () {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

// Method to convert template to line item format
InvoiceTemplateSchema.methods.toLineItem = function (quantity = null) {
  return {
    serviceName: this.serviceName,
    priceExclVat: this.priceExclVat,
    vatRate: this.vatRate,
    type: this.type,
    quantity: quantity || this.defaultQuantity,
    totalVatIncluded: 0, // Will be calculated when added to invoice
  };
};

// Indexes for better query performance
InvoiceTemplateSchema.index({ category: 1, isActive: 1 });
InvoiceTemplateSchema.index({ serviceName: 1, type: 1 });
InvoiceTemplateSchema.index({ usageCount: -1, lastUsed: -1 });
InvoiceTemplateSchema.index({ createdBy: 1, createdAt: -1 });

// Static method to find popular templates
InvoiceTemplateSchema.statics.findPopular = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ usageCount: -1, lastUsed: -1 })
    .limit(limit)
    .populate("createdBy", "name");
};

// Static method to find by category
InvoiceTemplateSchema.statics.findByCategory = function (category) {
  return this.find({ category, isActive: true })
    .sort({ serviceName: 1 })
    .populate("createdBy", "name");
};

// Static method to search templates
InvoiceTemplateSchema.statics.search = function (searchTerm) {
  return this.find({
    isActive: true,
    $or: [
      { serviceName: { $regex: searchTerm, $options: "i" } },
      { description: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
    ],
  })
    .sort({ usageCount: -1 })
    .populate("createdBy", "name");
};

export default mongoose.models.InvoiceTemplate ||
  mongoose.model("InvoiceTemplate", InvoiceTemplateSchema);
