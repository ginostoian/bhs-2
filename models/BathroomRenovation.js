import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

/**
 * Bathroom Renovation Form Submission Schema
 * Stores bathroom renovation form submissions from the website
 */
const bathroomRenovationSchema = mongoose.Schema(
  {
    // Basic Information
    name: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      index: true,
    },
    address: {
      type: String,
      trim: true,
      required: true,
    },

    // Project Information
    budget: {
      type: String,
      enum: ["££", "£££", "££££"],
    },
    source: {
      type: String,
      enum: [
        "Google Ads",
        "Google Search",
        "Facebook",
        "Instagram",
        "Houzz",
        "MyBuilder",
        "Recommendation",
        "Other",
      ],
    },
    customSource: {
      type: String,
      trim: true,
      maxlength: 200,
    },

    // Detailed Information (optional)
    hasDetailedInfo: {
      type: Boolean,
      default: false,
    },
    bathroomSize: {
      type: String,
      enum: ["Small", "Medium", "Large"],
    },
    designService: {
      type: String,
      enum: [
        "Yes, I would like my bathroom designed",
        "No, I have design covered",
      ],
    },
    startDate: {
      type: String,
      trim: true,
      maxlength: 200,
    },
    keepExisting: {
      type: String,
      trim: true,
      maxlength: 500,
    },
    layout: {
      type: String,
      enum: ["Same layout", "New Layout"],
    },
    layoutChanges: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // Electrics
    electrics: {
      newExtractorFan: { type: Boolean, default: false },
      replaceExtractorFan: { type: Boolean, default: false },
      newSpotlights: { type: Boolean, default: false },
      replaceSpotlights: { type: Boolean, default: false },
      newShaverSocket: { type: Boolean, default: false },
      replaceShaverSocket: { type: Boolean, default: false },
      moveSwitch: { type: Boolean, default: false },
      electricShowerPump: { type: Boolean, default: false },
      electricShower: { type: Boolean, default: false },
      electricMirror: { type: Boolean, default: false },
    },

    // Underfloor Heating
    underfloorHeating: {
      type: String,
      enum: ["Yes, electric UFH", "Yes, wet UFH", "No, I don't need UFH"],
    },

    // Bathroom Suite
    bathroomSuite: {
      floorStandingToilet: { type: Boolean, default: false },
      wallHungToilet: { type: Boolean, default: false },
      visibleCistern: { type: Boolean, default: false },
      concealedCistern: { type: Boolean, default: false },
      basin: { type: Boolean, default: false },
      vanityUnit: { type: Boolean, default: false },
      freestandingBath: { type: Boolean, default: false },
      cornerBath: { type: Boolean, default: false },
      separateShowerUnit: { type: Boolean, default: false },
      wetRoomKit: { type: Boolean, default: false },
      radiator: { type: Boolean, default: false },
    },

    // Tiling
    tiling: {
      fullHeightShower: { type: Boolean, default: false },
      halfHeightWalls: { type: Boolean, default: false },
      allWallsFullHeight: { type: Boolean, default: false },
      tileFloor: { type: Boolean, default: false },
      vinylFlooring: { type: Boolean, default: false },
    },

    // Decorating
    decorating: {
      plasterCeiling: { type: Boolean, default: false },
      plasterWalls: { type: Boolean, default: false },
      paintCeiling: { type: Boolean, default: false },
      paintWalls: { type: Boolean, default: false },
      paintWoodwork: { type: Boolean, default: false },
    },

    // Additional Information
    additionalInfo: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    // Status and Processing
    status: {
      type: String,
      enum: ["new", "read", "replied", "closed"],
      default: "new",
      index: true,
    },

    // Email Status
    confirmationEmailSent: {
      type: Boolean,
      default: false,
    },
    adminNotificationSent: {
      type: Boolean,
      default: false,
    },

    // Metadata
    ipAddress: {
      type: String,
      trim: true,
    },
    userAgent: {
      type: String,
      trim: true,
    },
    source: {
      type: String,
      default: "bathroom-renovation-form",
    },
  },
  {
    timestamps: true,
  },
);

// Add toJSON plugin
bathroomRenovationSchema.plugin(toJSON);

// Index for efficient queries
bathroomRenovationSchema.index({ createdAt: -1 });
bathroomRenovationSchema.index({ status: 1, createdAt: -1 });

// Virtual for full name
bathroomRenovationSchema.virtual("fullName").get(function () {
  return this.name;
});

// Ensure virtual fields are serialized
bathroomRenovationSchema.set("toJSON", { virtuals: true });
bathroomRenovationSchema.set("toObject", { virtuals: true });

const BathroomRenovation =
  mongoose.models.BathroomRenovation ||
  mongoose.model("BathroomRenovation", bathroomRenovationSchema);

export default BathroomRenovation;
