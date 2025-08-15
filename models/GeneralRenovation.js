import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

const generalRenovationSchema = new mongoose.Schema(
  {
    // Basic Information
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

    // Project Information
    isNewPurchase: {
      type: String,
      enum: ["Yes", "No"],
      required: true,
    },
    propertyType: {
      type: String,
      enum: ["Flat", "House"],
      required: true,
    },
    flatFloor: {
      type: String,
      trim: true,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },

    // Detailed Information (optional)
    hasDetailedInfo: {
      type: Boolean,
      default: false,
    },
    boilerWork: {
      type: String,
      enum: [
        "Yes, I need to convert to a combi boiler",
        "Yes, I need to replace my boiler",
        "Yes, I need to move my boiler",
        "No work needed",
      ],
    },
    rewiring: {
      type: String,
      enum: ["Yes, full rewire required", "Yes, partial rewire required", "No"],
    },
    plastering: {
      type: String,
      enum: ["Yes", "No"],
    },
    roomsNeedPlastering: {
      type: Number,
    },
    painting: {
      type: String,
      enum: ["Yes", "No"],
    },
    roomsNeedPainting: {
      type: Number,
    },
    flooring: {
      type: String,
      enum: ["Yes", "No"],
    },
    roomsNeedFlooring: {
      type: Number,
    },
    flooringType: {
      type: String,
      trim: true,
    },
    bathroomRenovation: {
      type: String,
      enum: ["No", "Yes, one bathroom", "Yes, more than one bathroom"],
    },
    kitchenRenovation: {
      type: String,
      enum: ["Yes", "No"],
    },
    additionalRequests: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      trim: true,
    },

    // Status and Processing
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
      index: true,
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
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },
    adminNotificationSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

// Add the toJSON plugin
generalRenovationSchema.plugin(toJSON);

// Index for efficient queries
generalRenovationSchema.index({ createdAt: -1 });
generalRenovationSchema.index({ status: 1, createdAt: -1 });

const GeneralRenovation =
  mongoose.models.GeneralRenovation ||
  mongoose.model("GeneralRenovation", generalRenovationSchema);

// Set toJSON options
generalRenovationSchema.set("toJSON", { virtuals: true });

export default GeneralRenovation;
