import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Notification Schema
 * Handles user notifications for various system events
 */
const notificationSchema = mongoose.Schema(
  {
    // Reference to the user who should receive this notification
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    // Type of notification
    type: {
      type: String,
      enum: [
        "document_added",
        "payment_due",
        "payment_overdue",
        "payment_plan_updated",
        "project_status_changed",
        "announcement",
      ],
      required: true,
    },
    // Title of the notification
    title: {
      type: String,
      required: true,
    },
    // Detailed message
    message: {
      type: String,
      required: true,
    },
    // Whether the notification has been read
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
    // Related document/payment ID (optional)
    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "relatedModel",
    },
    // Model name for the related document
    relatedModel: {
      type: String,
      enum: ["Document", "Payment", "User"],
    },
    // Additional data for the notification
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    // Priority level
    priority: {
      type: String,
      enum: ["low", "medium", "high", "urgent"],
      default: "medium",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);

// Index for efficient queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, type: 1, createdAt: -1 });

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function (
  userId,
  notificationIds,
) {
  return await this.updateMany(
    {
      _id: { $in: notificationIds },
      user: userId,
    },
    {
      $set: { isRead: true },
    },
  );
};

// Static method to mark all notifications as read
notificationSchema.statics.markAllAsRead = async function (userId) {
  return await this.updateMany(
    {
      user: userId,
      isRead: false,
    },
    {
      $set: { isRead: true },
    },
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (userId) {
  return await this.countDocuments({
    user: userId,
    isRead: false,
  });
};

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
