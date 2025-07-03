/**
 * Notification Utility Functions
 * Provides helper functions to create notifications from various system events
 */

/**
 * Create a notification for a user
 * @param {Object} notificationData - The notification data
 * @returns {Promise<Object>} - The created notification
 */
export async function createNotification(notificationData) {
  try {
    const response = await fetch("/api/notifications", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(notificationData),
    });

    if (!response.ok) {
      throw new Error(`Failed to create notification: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

/**
 * Create a document added notification
 * @param {string} userId - The user ID
 * @param {string} documentType - The type of document
 * @param {string} documentName - The name of the document
 * @param {string} documentId - The document ID
 */
export async function notifyDocumentAdded(
  userId,
  documentType,
  documentName,
  documentId,
) {
  const documentTypeLabels = {
    quote: "Quote",
    invoice: "Invoice",
    photo: "Photo",
    comment: "Comment",
    instruction: "Instruction",
  };

  const typeLabel = documentTypeLabels[documentType] || "Document";

  return await createNotification({
    userId,
    type: "document_added",
    title: `New ${typeLabel} Added`,
    message: `A new ${documentType} "${documentName}" has been added to your project.`,
    relatedId: documentId,
    relatedModel: "Document",
    priority: "medium",
    metadata: {
      documentType,
      documentName,
    },
  });
}

/**
 * Create a payment due notification
 * @param {string} userId - The user ID
 * @param {string} paymentName - The payment name
 * @param {Date} dueDate - The due date
 * @param {string} paymentId - The payment ID
 * @param {boolean} isOverdue - Whether the payment is overdue
 */
export async function notifyPaymentDue(
  userId,
  paymentName,
  dueDate,
  paymentId,
  isOverdue = false,
) {
  const type = isOverdue ? "payment_overdue" : "payment_due";
  const title = isOverdue ? "Payment Overdue" : "Payment Due Soon";

  const daysUntilDue = Math.ceil(
    (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24),
  );
  const message = isOverdue
    ? `Payment "${paymentName}" is overdue. Please contact us to arrange payment.`
    : `Payment "${paymentName}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}.`;

  return await createNotification({
    userId,
    type,
    title,
    message,
    relatedId: paymentId,
    relatedModel: "Payment",
    priority: isOverdue ? "urgent" : "high",
    metadata: {
      paymentName,
      dueDate: dueDate.toISOString(),
      isOverdue,
      daysUntilDue,
    },
  });
}

/**
 * Create a payment plan updated notification
 * @param {string} userId - The user ID
 * @param {string} planName - The plan name
 * @param {string} planId - The plan ID
 * @param {string} changeType - The type of change
 */
export async function notifyPaymentPlanUpdated(
  userId,
  planName,
  planId,
  changeType,
) {
  const changeMessages = {
    created: "A new payment plan has been created for your project.",
    updated: "Your payment plan has been updated.",
    deleted: "A payment plan has been removed from your project.",
  };

  return await createNotification({
    userId,
    type: "payment_plan_updated",
    title: "Payment Plan Updated",
    message:
      changeMessages[changeType] || "Your payment plan has been modified.",
    relatedId: planId,
    relatedModel: "Payment",
    priority: "medium",
    metadata: {
      planName,
      changeType,
    },
  });
}

/**
 * Create a project status change notification
 * @param {string} userId - The user ID
 * @param {string} oldStatus - The old status
 * @param {string} newStatus - The new status
 * @param {string} projectId - The project ID
 */
export async function notifyProjectStatusChanged(
  userId,
  oldStatus,
  newStatus,
  projectId,
) {
  return await createNotification({
    userId,
    type: "project_status_changed",
    title: "Project Status Updated",
    message: `Your project status has changed from "${oldStatus}" to "${newStatus}".`,
    relatedId: projectId,
    relatedModel: "User",
    priority: "medium",
    metadata: {
      oldStatus,
      newStatus,
    },
  });
}

/**
 * Create a general announcement notification
 * @param {string} userId - The user ID
 * @param {string} title - The announcement title
 * @param {string} message - The announcement message
 * @param {string} priority - The priority level
 */
export async function notifyAnnouncement(
  userId,
  title,
  message,
  priority = "medium",
) {
  return await createNotification({
    userId,
    type: "announcement",
    title,
    message,
    priority,
    metadata: {
      isAnnouncement: true,
    },
  });
}

/**
 * Create notifications for multiple users
 * @param {string[]} userIds - Array of user IDs
 * @param {Function} notificationCreator - Function that creates notification data
 */
export async function notifyMultipleUsers(userIds, notificationCreator) {
  const promises = userIds.map((userId) => notificationCreator(userId));
  return await Promise.allSettled(promises);
}

/**
 * Check for overdue payments and create notifications
 * @param {Array} payments - Array of payment objects
 */
export async function checkOverduePayments(payments) {
  const now = new Date();
  const overduePayments = payments.filter((payment) => {
    const dueDate = new Date(payment.dueDate);
    return (
      dueDate < now &&
      payment.status !== "paid" &&
      payment.status !== "cancelled"
    );
  });

  const notifications = [];
  for (const payment of overduePayments) {
    try {
      await notifyPaymentDue(
        payment.user,
        payment.name,
        payment.dueDate,
        payment._id,
        true,
      );
    } catch (error) {
      console.error(
        `Failed to create overdue notification for payment ${payment._id}:`,
        error,
      );
    }
  }

  return notifications;
}
