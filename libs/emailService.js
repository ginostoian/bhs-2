import { sendEmail as resendSendEmail } from "./resend";
import config from "@/config";
import connectMongoose from "./mongoose";
import EmailStats from "@/models/EmailStats";

/**
 * Enhanced Email Service
 * Provides template-based email sending with error handling and tracking
 */

// In-memory cache for performance
let emailStatsCache = null;
let cacheTimestamp = 0;
const CACHE_DURATION = 30000; // 30 seconds

/**
 * Get or create email stats document
 */
const getEmailStatsDocument = async () => {
  await connectMongoose();
  return await EmailStats.getOrCreate();
};

/**
 * Update email stats in database
 */
const updateEmailStats = async (
  incrementSent = false,
  incrementFailed = false,
  error = null,
) => {
  try {
    const stats = await getEmailStatsDocument();

    if (incrementSent) {
      stats.sent += 1;
    }

    if (incrementFailed) {
      stats.failed += 1;
    }

    if (error) {
      stats.emailErrors.push(error);
      // Keep only the last 100 errors to prevent the array from growing too large
      if (stats.emailErrors.length > 100) {
        stats.emailErrors = stats.emailErrors.slice(-100);
      }
    }

    await stats.save();

    // Invalidate cache
    emailStatsCache = null;
    cacheTimestamp = 0;

    return stats;
  } catch (error) {
    console.error("Error updating email stats:", error);
    // Fallback to in-memory tracking if database fails
    return null;
  }
};

/**
 * Send email with enhanced error handling and tracking
 * @param {Object} emailData - Email data object
 * @param {string} emailData.to - Recipient email
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.html - HTML content
 * @param {string} emailData.text - Plain text content
 * @param {string} emailData.replyTo - Reply-to email
 * @param {Object} emailData.metadata - Additional metadata for tracking
 * @returns {Promise<Object>} - Result object with success status and details
 */
export const sendEmailWithTracking = async (emailData) => {
  const startTime = Date.now();

  try {
    // Validate required fields
    if (
      !emailData.to ||
      !emailData.subject ||
      (!emailData.html && !emailData.text)
    ) {
      throw new Error(
        "Missing required email fields: to, subject, and html or text",
      );
    }

    // Add default reply-to if not provided
    if (!emailData.replyTo) {
      emailData.replyTo = config.resend.supportEmail;
    }

    // Send email via Resend
    await resendSendEmail(emailData);

    // Track successful email
    await updateEmailStats(true, false);

    const duration = Date.now() - startTime;

    console.log(
      `✅ Email sent successfully to ${emailData.to} in ${duration}ms`,
    );

    return {
      success: true,
      message: "Email sent successfully",
      recipient: emailData.to,
      subject: emailData.subject,
      duration,
      timestamp: new Date().toISOString(),
      metadata: emailData.metadata || {},
    };
  } catch (error) {
    // Track failed email
    const errorData = {
      error: error.message,
      recipient: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString(),
      metadata: emailData.metadata || {},
    };

    await updateEmailStats(false, true, errorData);

    const duration = Date.now() - startTime;

    console.error(`❌ Email failed to send to ${emailData.to}:`, error.message);

    return {
      success: false,
      error: error.message,
      recipient: emailData.to,
      subject: emailData.subject,
      duration,
      timestamp: new Date().toISOString(),
      metadata: emailData.metadata || {},
    };
  }
};

/**
 * Send email with retry logic
 * @param {Object} emailData - Email data object
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} retryDelay - Delay between retries in milliseconds (default: 1000)
 * @returns {Promise<Object>} - Result object
 */
export const sendEmailWithRetry = async (
  emailData,
  maxRetries = 3,
  retryDelay = 1000,
) => {
  let lastError;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await sendEmailWithTracking(emailData);

      if (result.success) {
        return result;
      }

      lastError = result.error;

      // If this is not the last attempt, wait before retrying
      if (attempt < maxRetries) {
        console.log(
          `Retrying email to ${emailData.to} (attempt ${attempt + 1}/${maxRetries})`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt),
        ); // Exponential backoff
      }
    } catch (error) {
      lastError = error.message;

      if (attempt < maxRetries) {
        console.log(
          `Retrying email to ${emailData.to} after error (attempt ${attempt + 1}/${maxRetries})`,
        );
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay * attempt),
        );
      }
    }
  }

  // All retries failed
  console.error(
    `Failed to send email to ${emailData.to} after ${maxRetries} attempts`,
  );

  return {
    success: false,
    error: `Failed after ${maxRetries} attempts: ${lastError}`,
    recipient: emailData.to,
    subject: emailData.subject,
    attempts: maxRetries,
    timestamp: new Date().toISOString(),
    metadata: emailData.metadata || {},
  };
};

/**
 * Send welcome email to new user
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @returns {Promise<Object>} - Result object
 */
export const sendWelcomeEmail = async (userEmail, userName = null) => {
  const { welcomeEmailTemplate } = await import("./emailTemplates");
  const template = welcomeEmailTemplate(userName, userEmail);

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "welcome_email",
      userName,
      userEmail,
    },
  });
};

/**
 * Send document added notification email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @param {string} documentType - Type of document (quote, invoice, photo, comment)
 * @param {string} documentName - Name/title of the document
 * @param {any} documentContent - Document content
 * @param {string} documentId - Document ID (optional)
 * @returns {Promise<Object>} - Result object
 */
export const sendDocumentAddedEmail = async (
  userEmail,
  userName,
  documentType,
  documentName,
  documentContent,
  documentId = null,
) => {
  const { documentAddedEmailTemplate } = await import("./emailTemplates");
  const template = documentAddedEmailTemplate(
    userName,
    documentType,
    documentName,
    documentContent,
    documentId,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "document_added",
      documentType,
      documentName,
      documentId,
      userName,
      userEmail,
    },
  });
};

/**
 * Send payment due/overdue notification email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @param {string} paymentName - Name of the payment
 * @param {number} amount - Payment amount
 * @param {Date} dueDate - Due date
 * @param {boolean} isOverdue - Whether payment is overdue
 * @returns {Promise<Object>} - Result object
 */
export const sendPaymentDueEmail = async (
  userEmail,
  userName,
  paymentName,
  amount,
  dueDate,
  isOverdue = false,
) => {
  const { paymentDueEmailTemplate } = await import("./emailTemplates");
  const template = paymentDueEmailTemplate(
    userName,
    paymentName,
    amount,
    dueDate,
    isOverdue,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "payment_due",
      paymentName,
      amount,
      dueDate: dueDate.toISOString(),
      isOverdue,
      userName,
      userEmail,
    },
  });
};

/**
 * Send project status update email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @param {string} oldStatus - Previous project status
 * @param {string} newStatus - New project status
 * @returns {Promise<Object>} - Result object
 */
export const sendProjectStatusUpdateEmail = async (
  userEmail,
  userName,
  oldStatus,
  newStatus,
) => {
  const { projectStatusUpdateEmailTemplate } = await import("./emailTemplates");
  const template = projectStatusUpdateEmailTemplate(
    userName,
    oldStatus,
    newStatus,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "project_status_update",
      oldStatus,
      newStatus,
      userName,
      userEmail,
    },
  });
};

/**
 * Send admin notification for new user creation
 * @param {string} userEmail - New user's email address
 * @param {string} userName - New user's name (optional)
 * @param {string} createdBy - Who created the user (optional)
 * @returns {Promise<Object>} - Result object
 */
export const sendAdminNewUserNotification = async (
  userEmail,
  userName = null,
  createdBy = null,
) => {
  // Send to admin email if configured
  const adminEmail =
    config.resend.forwardRepliesTo || config.resend.supportEmail;

  if (!adminEmail) {
    console.warn("No admin email configured for new user notifications");
    return {
      success: false,
      error: "No admin email configured",
      recipient: "admin",
      subject: "New User Created",
      timestamp: new Date().toISOString(),
    };
  }

  const { adminNewUserNotificationTemplate } = await import("./emailTemplates");
  const template = adminNewUserNotificationTemplate(
    userName,
    userEmail,
    createdBy,
  );

  return await sendEmailWithRetry({
    to: adminEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "admin_new_user_notification",
      newUserEmail: userEmail,
      newUserName: userName,
      createdBy,
      adminEmail,
    },
  });
};

/**
 * Send system announcement email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @param {string} title - Announcement title
 * @param {string} message - Announcement message
 * @param {string} priority - Priority level (low, medium, high, urgent)
 * @returns {Promise<Object>} - Result object
 */
export const sendAnnouncementEmail = async (
  userEmail,
  userName,
  title,
  message,
  priority = "medium",
) => {
  const { announcementEmailTemplate } = await import("./emailTemplates");
  const template = announcementEmailTemplate(
    userName,
    title,
    message,
    priority,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "announcement",
      title,
      message,
      priority,
      userName,
      userEmail,
    },
  });
};

/**
 * Send moodboard created notification email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @param {string} moodboardName - Name of the moodboard
 * @param {string} description - Moodboard description (optional)
 * @param {string} projectType - Project type (optional)
 * @returns {Promise<Object>} - Result object
 */
export const sendMoodboardCreatedEmail = async (
  userEmail,
  userName,
  moodboardName,
  description = null,
  projectType = null,
) => {
  const { moodboardCreatedEmailTemplate } = await import("./emailTemplates");
  const template = moodboardCreatedEmailTemplate(
    userName,
    moodboardName,
    description,
    projectType,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "moodboard_created",
      moodboardName,
      description,
      projectType,
      userName,
      userEmail,
    },
  });
};

/**
 * Send product approval/decline notification email to admin
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @param {string} productName - Name of the product
 * @param {string} approvalStatus - "approved" or "declined"
 * @param {string} userComment - User's comment (optional)
 * @param {string} moodboardName - Name of the moodboard
 * @returns {Promise<Object>} - Result object
 */
export const sendProductApprovalEmail = async (
  userEmail,
  userName,
  productName,
  approvalStatus,
  userComment = null,
  moodboardName = null,
) => {
  const { productApprovalEmailTemplate } = await import("./emailTemplates");
  const template = productApprovalEmailTemplate(
    userName,
    productName,
    approvalStatus,
    userComment,
    moodboardName,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "product_approval",
      productName,
      approvalStatus,
      userComment,
      moodboardName,
      userName,
      userEmail,
    },
  });
};

/**
 * Send moodboard status update notification email
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @param {string} moodboardName - Name of the moodboard
 * @param {string} oldStatus - Previous status
 * @param {string} newStatus - New status
 * @returns {Promise<Object>} - Result object
 */
export const sendMoodboardStatusUpdateEmail = async (
  userEmail,
  userName,
  moodboardName,
  oldStatus,
  newStatus,
) => {
  const { moodboardStatusUpdateEmailTemplate } = await import(
    "./emailTemplates"
  );
  const template = moodboardStatusUpdateEmailTemplate(
    userName,
    moodboardName,
    oldStatus,
    newStatus,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "moodboard_status_update",
      moodboardName,
      oldStatus,
      newStatus,
      userName,
      userEmail,
    },
  });
};

/**
 * Send user inactivity notification email to admin
 * @param {string} userEmail - User's email address
 * @param {string} userName - User's name (optional)
 * @param {Date} lastLoginAt - User's last login date
 * @param {number} daysThreshold - Number of days threshold
 * @returns {Promise<Object>} - Result object
 */
export const sendUserInactivityEmail = async (
  userEmail,
  userName,
  lastLoginAt,
  daysThreshold,
) => {
  const { userInactivityEmailTemplate } = await import("./emailTemplates");
  const template = userInactivityEmailTemplate(
    userName,
    lastLoginAt,
    daysThreshold,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "user_inactivity",
      userName,
      lastLoginAt: lastLoginAt.toISOString(),
      daysThreshold,
      userEmail,
    },
  });
};

export const sendProjectChangeNotificationEmail = async (
  userEmail,
  userName,
  changeName,
  cost,
  type,
  description = null,
) => {
  const { projectChangeNotificationEmailTemplate } = await import(
    "./emailTemplates"
  );
  const template = projectChangeNotificationEmailTemplate(
    userName,
    changeName,
    cost,
    type,
    description,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "project_change_notification",
      userName,
      changeName,
      cost,
      type,
      userEmail,
    },
  });
};

export const sendProjectChangeStatusEmail = async (
  userEmail,
  userName,
  changeName,
  status,
  cost,
  adminNotes = null,
) => {
  const { projectChangeStatusEmailTemplate } = await import("./emailTemplates");
  const template = projectChangeStatusEmailTemplate(
    userName,
    changeName,
    status,
    cost,
    adminNotes,
  );

  return await sendEmailWithRetry({
    to: userEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "project_change_status",
      userName,
      changeName,
      status,
      cost,
      userEmail,
    },
  });
};

export const sendProjectChangeUserResponseEmail = async (
  adminEmail,
  adminName,
  userName,
  changeName,
  status,
  cost,
  projectName,
) => {
  const { projectChangeUserResponseEmailTemplate } = await import(
    "./emailTemplates"
  );
  const template = projectChangeUserResponseEmailTemplate(
    adminName,
    userName,
    changeName,
    status,
    cost,
    projectName,
  );

  return await sendEmailWithRetry({
    to: adminEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
    metadata: {
      type: "project_change_user_response",
      adminName,
      userName,
      changeName,
      status,
      cost,
      projectName,
      adminEmail,
    },
  });
};

/**
 * Get email tracking statistics
 * @returns {Promise<Object>} - Email tracking statistics
 */
export const getEmailStats = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (emailStatsCache && now - cacheTimestamp < CACHE_DURATION) {
      return emailStatsCache;
    }

    const stats = await getEmailStatsDocument();

    const result = {
      sent: stats.sent,
      failed: stats.failed,
      successRate:
        stats.sent + stats.failed > 0
          ? ((stats.sent / (stats.sent + stats.failed)) * 100).toFixed(2) + "%"
          : "0%",
      recentErrors: stats.emailErrors.slice(-10).map((err) => ({
        error: err.error,
        recipient: err.recipient,
        subject: err.subject,
        timestamp: err.timestamp.toISOString(),
        metadata: err.metadata,
      })),
      totalErrors: stats.emailErrors.length,
    };

    // Update cache
    emailStatsCache = result;
    cacheTimestamp = now;

    return result;
  } catch (error) {
    console.error("Error getting email stats:", error);
    // Return empty stats if database fails
    return {
      sent: 0,
      failed: 0,
      successRate: "0%",
      recentErrors: [],
      totalErrors: 0,
    };
  }
};

/**
 * Clear email tracking data (useful for testing)
 */
export const clearEmailStats = async () => {
  try {
    const stats = await getEmailStatsDocument();
    stats.sent = 0;
    stats.failed = 0;
    stats.emailErrors = [];
    await stats.save();

    // Clear cache
    emailStatsCache = null;
    cacheTimestamp = 0;

    console.log("✅ Email stats cleared successfully");
  } catch (error) {
    console.error("Error clearing email stats:", error);
  }
};

// Export the original sendEmail function for backward compatibility
export { resendSendEmail as sendEmail };
