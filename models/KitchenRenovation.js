import mongoose from "mongoose";

const kitchenRenovationSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      required: true,
      trim: true,
    },
    address: {
      type: String,
      required: true,
      trim: true,
    },
    isNewPurchase: {
      type: String,
      required: true,
      enum: ["Yes", "No"],
    },
    propertyType: {
      type: String,
      required: true,
      enum: ["Flat", "House"],
    },
    flatFloor: {
      type: String,
      trim: true,
    },
    kitchenSize: {
      type: String,
      trim: true,
    },
    knockDownWall: {
      type: String,
      enum: ["Yes", "No"],
    },
    rewiring: {
      type: String,
      enum: ["Yes", "No", "Not sure"],
    },
    kitchenType: {
      type: String,
      enum: [
        "Retailer, flat packed",
        "Retailer, pre assembled",
        "Custom built by us",
        "Not sure",
      ],
    },
    additionalRequests: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },
    hasDetailedInfo: {
      type: Boolean,
      default: false,
    },
    submittedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ["New", "Contacted", "Quote Sent", "Converted", "Lost"],
      default: "New",
    },
    notes: {
      type: String,
      trim: true,
    },

    // Email tracking fields
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },
    adminNotificationSent: {
      type: Boolean,
      default: false,
    },

    // System fields
    ipAddress: {
      type: String,
      default: "unknown",
    },
    userAgent: {
      type: String,
      default: "unknown",
    },
  },
  {
    timestamps: true,
  },
);

// Add text index for search functionality
kitchenRenovationSchema.index({
  name: "text",
  email: "text",
  address: "text",
  additionalRequests: "text",
  notes: "text",
});

const KitchenRenovation =
  mongoose.models.KitchenRenovation ||
  mongoose.model("KitchenRenovation", kitchenRenovationSchema);

export default KitchenRenovation;
