import connectMongoose from "./mongoose.js";
import Notification from "@/models/Notification.js";
import User from "@/models/User.js";

/**
 * Notification Service
 * Handles creating notifications for different events and user types
 */

/**
 * Create a notification for a specific recipient
 */
export async function createNotification(data) {
  try {
    await connectMongoose();
    const notification =
      await Notification.createNotificationForRecipient(data);
    return notification;
  } catch (error) {
    console.error("Error creating notification:", error);
    throw error;
  }
}

/**
 * Create notifications for all admins
 */
export async function notifyAdmins(data) {
  try {
    await connectMongoose();

    // Get all admin users
    const admins = await User.find({ role: "admin" }).select("_id");

    // Create notifications for each admin
    const notifications = [];
    for (const admin of admins) {
      const notification = await Notification.createNotificationForRecipient({
        ...data,
        recipient: admin._id,
        recipientType: "admin",
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error("Error notifying admins:", error);
    throw error;
  }
}

/**
 * Create notifications for all employees
 */
export async function notifyEmployees(data) {
  try {
    await connectMongoose();

    // Get all employee users
    const employees = await User.find({ role: "employee" }).select("_id");

    // Create notifications for each employee
    const notifications = [];
    for (const employee of employees) {
      const notification = await Notification.createNotificationForRecipient({
        ...data,
        recipient: employee._id,
        recipientType: "employee",
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error("Error notifying employees:", error);
    throw error;
  }
}

/**
 * Create notification for a specific user
 */
export async function notifyUser(userId, data) {
  try {
    await connectMongoose();

    // Get user to determine recipient type
    const user = await User.findById(userId).select("role");
    if (!user) {
      throw new Error("User not found");
    }

    const recipientType =
      user.role === "admin"
        ? "admin"
        : user.role === "employee"
          ? "employee"
          : "user";

    const notification = await Notification.createNotificationForRecipient({
      ...data,
      recipient: userId,
      recipientType: recipientType,
    });

    return notification;
  } catch (error) {
    console.error("Error notifying user:", error);
    throw error;
  }
}

/**
 * Notification templates for common events
 */

// User registration notification for admins
export async function notifyUserRegistration(userData) {
  return await notifyAdmins({
    type: "new_user_registered",
    title: "New User Registration",
    message: `A new user has registered: ${userData.name || userData.email}`,
    priority: "medium",
    metadata: { userData },
  });
}

// Employee creation notification for admins
export async function notifyEmployeeCreation(employeeData) {
  return await notifyAdmins({
    type: "new_employee_created",
    title: "New Employee Added",
    message: `A new employee has been added: ${employeeData.name || employeeData.email}`,
    priority: "medium",
    metadata: { employeeData },
  });
}

// Task assignment notification for employee
export async function notifyTaskAssignment(employeeId, taskData) {
  return await notifyUser(employeeId, {
    type: "task_assigned",
    title: "New Task Assigned",
    message: `You have been assigned a new task: ${taskData.title}`,
    priority: "high",
    relatedId: taskData._id,
    relatedModel: "Task",
    metadata: { taskData },
  });
}

// Task status update request notification for admins
export async function notifyTaskStatusUpdateRequest(taskData, employeeData) {
  let message = `${employeeData.name} (${employeeData.position}) has requested to update task "${taskData.title}" status from "${taskData.currentStatus}" to "${taskData.status}"`;

  if (employeeData.notes) {
    message += `\n\nNotes: ${employeeData.notes}`;
  }

  return await notifyAdmins({
    type: "task_status_update_request",
    title: "Task Status Update Request",
    message: message,
    priority: "high",
    relatedId: taskData._id,
    relatedModel: "Task",
    metadata: { taskData, employeeData },
  });
}

// Task status approval notification for employee
export async function notifyTaskStatusApproved(employeeId, taskData) {
  return await notifyUser(employeeId, {
    type: "task_status_approved",
    title: "Task Status Approved",
    message: `Your status update for task "${taskData.title}" has been approved`,
    priority: "medium",
    relatedId: taskData._id,
    relatedModel: "Task",
    metadata: { taskData },
  });
}

// Task status rejection notification for employee
export async function notifyTaskStatusRejected(employeeId, taskData, reason) {
  return await notifyUser(employeeId, {
    type: "task_status_rejected",
    title: "Task Status Update Rejected",
    message: `Your status update for task "${taskData.title}" was rejected${reason ? `: ${reason}` : ""}`,
    priority: "high",
    relatedId: taskData._id,
    relatedModel: "Task",
    metadata: { taskData, reason },
  });
}

// Payment received notification for admins
export async function notifyPaymentReceived(paymentData) {
  return await notifyAdmins({
    type: "payment_received",
    title: "Payment Received",
    message: `Payment of £${paymentData.amount} received from ${paymentData.customerName || "customer"}`,
    priority: "medium",
    relatedId: paymentData._id,
    relatedModel: "Payment",
    metadata: { paymentData },
  });
}

// Project completion notification for admins
export async function notifyProjectCompleted(projectData) {
  return await notifyAdmins({
    type: "project_completed",
    title: "Project Completed",
    message: `Project "${projectData.title}" has been marked as completed`,
    priority: "medium",
    relatedId: projectData._id,
    relatedModel: "Project",
    metadata: { projectData },
  });
}

// Project update notification for assigned employees
export async function notifyProjectUpdate(
  projectId,
  projectData,
  assignedEmployeeIds,
) {
  try {
    await connectMongoose();

    // Create notifications for each assigned employee
    const notifications = [];
    for (const employeeId of assignedEmployeeIds) {
      const notification = await Notification.createNotificationForRecipient({
        type: "project_updated",
        title: "Project Updated",
        message: `Project "${projectData.title}" has been updated`,
        priority: "medium",
        recipient: employeeId,
        recipientType: "employee",
        relatedId: projectId,
        relatedModel: "Project",
        metadata: { projectData },
      });
      notifications.push(notification);
    }

    return notifications;
  } catch (error) {
    console.error("Error notifying project update:", error);
    throw error;
  }
}

// Document added notification for users
export async function notifyDocumentAdded(userId, documentData) {
  return await notifyUser(userId, {
    type: "document_added",
    title: "New Document Added",
    message: `A new document "${documentData.title}" has been added to your project`,
    priority: "medium",
    relatedId: documentData._id,
    relatedModel: "Document",
    metadata: { documentData },
  });
}

// Payment due notification for users
export async function notifyPaymentDue(userId, paymentData) {
  return await notifyUser(userId, {
    type: "payment_due",
    title: "Payment Due",
    message: `Payment of £${paymentData.amount} is due on ${new Date(paymentData.dueDate).toLocaleDateString()}`,
    priority: "high",
    relatedId: paymentData._id,
    relatedModel: "Payment",
    metadata: { paymentData },
  });
}

// Payment overdue notification for users
export async function notifyPaymentOverdue(userId, paymentData) {
  return await notifyUser(userId, {
    type: "payment_overdue",
    title: "Payment Overdue",
    message: `Payment of £${paymentData.amount} is overdue. Please contact us immediately.`,
    priority: "urgent",
    relatedId: paymentData._id,
    relatedModel: "Payment",
    metadata: { paymentData },
  });
}

// System alert notification for admins
export async function notifySystemAlert(message, priority = "medium") {
  return await notifyAdmins({
    type: "system_alert",
    title: "System Alert",
    message: message,
    priority: priority,
    metadata: { timestamp: new Date() },
  });
}
