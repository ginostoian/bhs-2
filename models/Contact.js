import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

/**
 * Contact Form Submission Schema
 * Stores contact form submissions from the website
 */
const contactSchema = mongoose.Schema(
  {
    // Basic Information
    firstName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    lastName: {
      type: String,
      trim: true,
      required: true,
      maxlength: 100,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
      required: true,
      index: true,
    },
    phone: {
      type: String,
      trim: true,
      required: true,
    },

    // Topic Information
    topic: {
      type: String,
      enum: [
        "General",
        "New Project",
        "Work with / For us",
        "Warranty",
        "Other",
      ],
      required: true,
    },
    customTopic: {
      type: String,
      trim: true,
      maxlength: 500,
    },

    // Message
    message: {
      type: String,
      trim: true,
      required: true,
      maxlength: 2000,
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
      default: "contact-form",
    },
  },
  {
    timestamps: true,
  },
);

// Add toJSON plugin
contactSchema.plugin(toJSON);

// Index for efficient queries
contactSchema.index({ createdAt: -1 });
contactSchema.index({ status: 1, createdAt: -1 });

// Virtual for full name
contactSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
contactSchema.set("toJSON", { virtuals: true });
contactSchema.set("toObject", { virtuals: true });

const Contact =
  mongoose.models.Contact || mongoose.model("Contact", contactSchema);

export default Contact;
