import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Partner Schema
 * Stores partners who refer customers, with occupation and referral history
 */
const referralSubSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      trim: true,
      required: true,
    },
    projectValue: {
      type: Number,
      required: true,
      min: 0,
    },
    referredAt: {
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
    notes: {
      type: String,
      trim: true,
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

export default mongoose.models.Partner ||
  mongoose.model("Partner", partnerSchema);
