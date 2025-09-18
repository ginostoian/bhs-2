import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * User Schema
 * Handles user authentication and role-based access control
 *
 * To create the first admin manually, run this in MongoDB shell:
 * db.users.updateOne(
 *   { email: "admin@example.com" },
 *   { $set: { role: "admin" } }
 * )
 */
const userSchema = mongoose.Schema(
  {
    // User's full name (optional)
    name: {
      type: String,
      trim: true,
    },
    // User's email address (required, unique, used for authentication)
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      unique: true,
      private: true,
    },
    // User's profile image URL (from OAuth providers)
    image: {
      type: String,
    },
    // Hashed password for email/password authentication
    password: {
      type: String,
      private: true,
    },
    // Google OAuth ID for account linking
    googleId: {
      type: String,
      private: true,
    },
    // User role for access control (user = regular user, admin = administrator, employee = restricted access, designer = limited access to moodboards and products)
    role: {
      type: String,
      enum: ["user", "admin", "employee", "designer"],
      default: "user",
    },
    // Stripe customer ID for payment processing
    customerId: {
      type: String,
      validate(value) {
        return value.includes("cus_");
      },
    },
    // Stripe price ID for subscription management
    priceId: {
      type: String,
      validate(value) {
        return value.includes("price_");
      },
    },
    // Access control flag managed by Stripe webhook
    hasAccess: {
      type: Boolean,
      default: false,
    },
    // Project status for filtering and organization
    projectStatus: {
      type: String,
      enum: ["Lead", "On Going", "Finished"],
      default: "Lead",
    },
    // User address
    address: {
      type: String,
      trim: true,
    },
    // User phone number
    phone: {
      type: String,
      trim: true,
    },
    // Source (how user found us)
    source: {
      type: String,
      enum: [
        "Organic",
        "Google Ads",
        "Meta Ads",
        "Houzz",
        "MyBuilder",
        "Returning Customer",
        "Referral",
      ],
    },
    // Has the user left a review?
    leftReview: {
      type: Boolean,
      default: false,
    },
    // Last login timestamp for activity tracking
    lastLoginAt: {
      type: Date,
      index: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema);
