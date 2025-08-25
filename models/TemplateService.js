import mongoose from "mongoose";

const templateServiceSchema = new mongoose.Schema(
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
    category: {
      type: String,
      required: true,
      trim: true,
    },
    unit: {
      type: String,
      required: true,
      trim: true,
    },
    pricingType: {
      type: String,
      required: true,
      enum: ["fixed", "calculated"],
    },
    // For fixed pricing
    fixedPrice: {
      type: Number,
      min: 0,
      required: function () {
        return this.pricingType === "fixed";
      },
    },
    // For calculated pricing
    calculationConfig: {
      tradesperson: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RateCard",
        required: function () {
          return this.pricingType === "calculated";
        },
      },
      material: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "RateCard",
      },
      defaultQuantity: {
        type: Number,
        min: 0,
      },
      defaultMaterialQuantity: {
        type: Number,
        min: 0,
      },
    },
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Index for efficient queries
templateServiceSchema.index({ category: 1, isActive: 1 });
templateServiceSchema.index({ name: 1, pricingType: 1 });

const TemplateService =
  mongoose.models.TemplateService ||
  mongoose.model("TemplateService", templateServiceSchema);

export default TemplateService;
