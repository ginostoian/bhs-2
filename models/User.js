import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

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
    // User role for access control (user = regular user, admin = administrator)
    role: {
      type: String,
      enum: ["user", "admin"],
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
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
userSchema.plugin(toJSON);

export default mongoose.models.User || mongoose.model("User", userSchema);
