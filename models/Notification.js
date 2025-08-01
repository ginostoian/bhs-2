import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

/**
 * Notification Schema
 * Handles user notifications for various system events
 */
const notificationSchema = mongoose.Schema(
  {
    // Reference to the recipient (user, employee, or admin)
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      index: true,
    },
    // Type of recipient (user, employee, admin)
    recipientType: {
      type: String,
      enum: ["user", "employee", "admin"],
      required: true,
      index: true,
    },
    // Type of notification
    type: {
      type: String,
      enum: [
        // User notifications
        "document_added",
        "payment_due",
        "payment_overdue",
        "payment_plan_updated",
        "project_status_changed",
        "project_change_added",
        "project_change_status_changed",
        "announcement",
        // Employee notifications
        "task_assigned",
        "task_status_approved",
        "task_status_rejected",
        "project_updated",
        // Admin notifications
        "new_user_registered",
        "new_employee_created",
        "task_status_update_request",
        "payment_received",
        "project_completed",
        "system_alert",
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
      enum: ["Document", "Payment", "User", "Task", "Project", "ProjectChange"],
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
notificationSchema.index({
  recipient: 1,
  recipientType: 1,
  isRead: 1,
  createdAt: -1,
});
notificationSchema.index({
  recipient: 1,
  recipientType: 1,
  type: 1,
  createdAt: -1,
});

// Static method to create notification
notificationSchema.statics.createNotification = async function (data) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

// Static method to mark notifications as read
notificationSchema.statics.markAsRead = async function (
  recipientId,
  recipientType,
  notificationIds,
) {
  return await this.updateMany(
    {
      _id: { $in: notificationIds },
      recipient: recipientId,
      recipientType: recipientType,
    },
    {
      $set: { isRead: true },
    },
  );
};

// Static method to mark all notifications as read
notificationSchema.statics.markAllAsRead = async function (
  recipientId,
  recipientType,
) {
  return await this.updateMany(
    {
      recipient: recipientId,
      recipientType: recipientType,
      isRead: false,
    },
    {
      $set: { isRead: true },
    },
  );
};

// Static method to get unread count
notificationSchema.statics.getUnreadCount = async function (
  recipientId,
  recipientType,
) {
  return await this.countDocuments({
    recipient: recipientId,
    recipientType: recipientType,
    isRead: false,
  });
};

// Static method to get notifications for a recipient
notificationSchema.statics.getNotifications = async function (
  recipientId,
  recipientType,
  options = {},
) {
  const { limit = 20, offset = 0, unreadOnly = false } = options;

  const query = { recipient: recipientId, recipientType: recipientType };
  if (unreadOnly) {
    query.isRead = false;
  }

  return await this.find(query)
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(offset)
    .lean();
};

// Static method to create notification for specific recipient type
notificationSchema.statics.createNotificationForRecipient = async function (
  data,
) {
  const notification = new this(data);
  await notification.save();
  return notification;
};

const Notification =
  mongoose.models.Notification ||
  mongoose.model("Notification", notificationSchema);

export default Notification;
