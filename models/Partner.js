import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Partner Schema
 * Stores partners who refer customers, with occupation and referral history
 */
const referralSubSchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      default: null,
    },
    customerName: {
      type: String,
      trim: true,
      required: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    postcode: {
      type: String,
      trim: true,
      uppercase: true,
    },
    address: {
      type: String,
      trim: true,
    },
    projectValue: {
      type: Number,
      min: 0,
      default: 0,
    },
    projectTypes: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["contacted", "negotiations", "won", "lost"],
      default: "contacted",
      index: true,
    },
    stage: {
      type: String,
      enum: [
        "Lead",
        "Never replied",
        "Qualified",
        "Proposal Sent",
        "Negotiations",
        "Won",
        "Lost",
      ],
      default: "Lead",
    },
    referralSource: {
      type: String,
      enum: ["dashboard_form", "share_link", "admin_manual", "other"],
      default: "other",
    },
    referredAt: {
      type: Date,
      default: Date.now,
    },
    updatedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: true },
);

const partnerSchema = mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
      index: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    // Single occupation label (UI offers presets plus custom)
    occupation: {
      type: String,
      trim: true,
      index: true,
    },
    // Past experience quality (retain from contractor design)
    experience: {
      type: String,
      enum: ["Bad", "Good", "Great"],
      default: "Good",
      index: true,
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    accountStatus: {
      type: String,
      enum: ["pending", "active"],
      default: "active",
      index: true,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    approvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
      trim: true,
    },
    referralCode: {
      type: String,
      trim: true,
      lowercase: true,
      unique: true,
      sparse: true,
      index: true,
    },
    // Referral history
    referrals: [referralSubSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

partnerSchema.plugin(toJSON);

partnerSchema.index({
  name: "text",
  email: "text",
  phone: "text",
  address: "text",
});
partnerSchema.index({ user: 1 }, { unique: true, sparse: true });

export default mongoose.models.Partner ||
  mongoose.model("Partner", partnerSchema);
