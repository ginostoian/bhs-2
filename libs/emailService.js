import { sendEmail as resendSendEmail } from "./resend";
import config from "@/config";

/**
 * Enhanced Email Service
 * Provides template-based email sending with error handling and tracking
 */

// Email tracking for analytics (in-memory for now, can be extended to database)
const emailTracking = {
  sent: 0,
  failed: 0,
  errors: [],
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
    emailTracking.sent++;

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
    emailTracking.failed++;
    emailTracking.errors.push({
      error: error.message,
      recipient: emailData.to,
      subject: emailData.subject,
      timestamp: new Date().toISOString(),
      metadata: emailData.metadata || {},
    });

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
 * Get email tracking statistics
 * @returns {Object} - Email tracking statistics
 */
export const getEmailStats = () => {
  return {
    sent: emailTracking.sent,
    failed: emailTracking.failed,
    successRate:
      emailTracking.sent + emailTracking.failed > 0
        ? (
            (emailTracking.sent / (emailTracking.sent + emailTracking.failed)) *
            100
          ).toFixed(2) + "%"
        : "0%",
    recentErrors: emailTracking.errors.slice(-10), // Last 10 errors
    totalErrors: emailTracking.errors.length,
  };
};

/**
 * Clear email tracking data (useful for testing)
 */
export const clearEmailStats = () => {
  emailTracking.sent = 0;
  emailTracking.failed = 0;
  emailTracking.errors = [];
};

// Export the original sendEmail function for backward compatibility
export { resendSendEmail as sendEmail };
