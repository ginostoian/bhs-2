import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Email Preference Schema
 * Allows users to control which types of emails they receive
 */
const emailPreferenceSchema = mongoose.Schema(
  {
    // Reference to the user
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    // Whether email notifications are enabled overall
    enabled: {
      type: Boolean,
      default: true,
    },
    // Specific email type preferences
    preferences: {
      // Welcome emails when account is created
      welcome: {
        type: Boolean,
        default: true,
      },
      // Document notifications (quotes, invoices, photos, comments)
      documents: {
        type: Boolean,
        default: true,
      },
      // Payment reminders and overdue notices
      payments: {
        type: Boolean,
        default: true,
      },
      // Project status updates
      projectStatus: {
        type: Boolean,
        default: true,
      },
      // System announcements
      announcements: {
        type: Boolean,
        default: true,
      },
      // Marketing emails (future use)
      marketing: {
        type: Boolean,
        default: false,
      },
    },
    // Last updated timestamp
    lastUpdated: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
emailPreferenceSchema.plugin(toJSON);

// Static method to get or create email preferences for a user
emailPreferenceSchema.statics.getOrCreate = async function (userId) {
  let preferences = await this.findOne({ user: userId });

  if (!preferences) {
    preferences = await this.create({
      user: userId,
      enabled: true,
      preferences: {
        welcome: true,
        documents: true,
        payments: true,
        projectStatus: true,
        announcements: true,
        marketing: false,
      },
    });
  }

  return preferences;
};

// Static method to check if a specific email type is enabled for a user
emailPreferenceSchema.statics.isEmailEnabled = async function (
  userId,
  emailType,
) {
  const preferences = await this.findOne({ user: userId });

  if (!preferences || !preferences.enabled) {
    return false;
  }

  // Check if the specific email type is enabled
  return preferences.preferences[emailType] !== false;
};

// Static method to update email preferences
emailPreferenceSchema.statics.updatePreferences = async function (
  userId,
  updates,
) {
  const preferences = await this.findOneAndUpdate(
    { user: userId },
    {
      $set: {
        ...updates,
        lastUpdated: new Date(),
      },
    },
    {
      new: true,
      upsert: true,
    },
  );

  return preferences;
};

// Instance method to check if a specific email type is enabled
emailPreferenceSchema.methods.isEmailTypeEnabled = function (emailType) {
  if (!this.enabled) {
    return false;
  }

  return this.preferences[emailType] !== false;
};

// Instance method to update preferences
emailPreferenceSchema.methods.updatePreferences = function (updates) {
  Object.assign(this.preferences, updates);
  this.lastUpdated = new Date();
  return this.save();
};

export default mongoose.models.EmailPreference ||
  mongoose.model("EmailPreference", emailPreferenceSchema);
