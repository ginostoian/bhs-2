import mongoose from "mongoose";

const RateCardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
      enum: ["trade-rate", "material-cost", "service-price"],
    },
    tradeRate: {
      type: Number,
      required: function () {
        return this.type === "trade-rate";
      },
    },
    materialCost: {
      type: Number,
      required: function () {
        return this.type === "material-cost";
      },
    },
    servicePrice: {
      type: Number,
      required: function () {
        return this.type === "service-price";
      },
    },
    unit: {
      type: String,
      required: true,
      enum: ["day", "hour", "sqm", "linear-m", "piece", "job"],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    effectiveDate: {
      type: Date,
      default: Date.now,
    },
    expiryDate: {
      type: Date,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    previousVersions: [
      {
        version: String,
        data: mongoose.Schema.Types.Mixed,
        modifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        modifiedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  {
    timestamps: true,
  },
);

export default mongoose.models.RateCard ||
  mongoose.model("RateCard", RateCardSchema);
