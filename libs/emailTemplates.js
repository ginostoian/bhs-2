import config from "@/config";

/**
 * Email Template System
 * Provides professional HTML email templates for various system events
 */

// Base template wrapper
const baseTemplate = (content, title = "Better Homes Studio") => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${title}</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            margin: 0;
            padding: 0;
            background-color: #f8f9fa;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            background: linear-gradient(135deg, #266bf1 0%, #1449B0 100%);
            color: white;
            padding: 30px 40px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 28px;
            font-weight: 700;
        }
        .header p {
            margin: 10px 0 0 0;
            opacity: 0.9;
            font-size: 16px;
        }
        .content {
            padding: 40px;
        }
        .footer {
            background-color: #f8f9fa;
            padding: 30px 40px;
            text-align: center;
            border-top: 1px solid #e9ecef;
        }
        .footer p {
            margin: 0;
            color: #6c757d;
            font-size: 14px;
        }
        .button {
            display: inline-block;
            background: linear-gradient(135deg, #266bf1 0%, #1449B0 100%);
            color: white;
            text-decoration: none;
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            margin: 20px 0;
        }
        .button:hover {
            background: linear-gradient(135deg, #1449B0 0%, #0C5AC8 100%);
        }
        .alert {
            padding: 16px;
            border-radius: 8px;
            margin: 20px 0;
        }
        .alert-success {
            background-color: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
        }
        .alert-warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            color: #856404;
        }
        .alert-urgent {
            background-color: #f8d7da;
            border: 1px solid #f5c6cb;
            color: #721c24;
        }
        .document-card {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .document-title {
            font-weight: 600;
            color: #266bf1;
            margin-bottom: 8px;
        }
        .document-meta {
            color: #6c757d;
            font-size: 14px;
        }
        @media (max-width: 600px) {
            .container {
                margin: 0;
                box-shadow: none;
            }
            .header, .content, .footer {
                padding: 20px;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Better Homes Studio</h1>
            <p>Your trusted partner in home renovation</p>
        </div>
        <div class="content">
            ${content}
        </div>
        <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Better Homes Studio. All rights reserved.</p>
            <p>${config.domainName} | ${config.resend.supportEmail || "info@betterhomesstudio.com"}</p>
        </div>
    </div>
</body>
</html>
`;

/**
 * Welcome Email Template
 * Sent to new users when they are created by admin
 */
export const welcomeEmailTemplate = (userName, userEmail) => {
  const content = `
    <h2>Welcome to Better Homes Studio! 🏠</h2>
    
    <p>Hello ${userName || "there"},</p>
    
    <p>Welcome to Better Homes Studio! Your account has been successfully created and you're now part of our community of homeowners transforming their spaces.</p>
    
    <div class="alert alert-success">
        <strong>Your Account Details:</strong><br>
        Email: ${userEmail}<br>
        Status: Active
    </div>
    
    <h3>What's Next?</h3>
    <ul>
        <li><strong>Access Your Dashboard:</strong> Log in to view your project documents, quotes, and invoices</li>
        <li><strong>Request a Quote:</strong> Get started with your renovation project</li>
        <li><strong>Track Progress:</strong> Monitor your project status and payments</li>
        <li><strong>Stay Updated:</strong> Receive notifications about important updates</li>
    </ul>
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/dashboard" class="button">Access Your Dashboard</a>
    </div>
    
    <p>If you have any questions or need assistance, don't hesitate to reach out to our support team.</p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: "Welcome to Better Homes Studio!",
    html: baseTemplate(content, "Welcome to Better Homes Studio"),
    text: `Welcome to Better Homes Studio! Your account has been created successfully. Access your dashboard at https://${config.domainName}/dashboard`,
  };
};

/**
 * Document Added Email Template
 * Sent when admin adds a new document (quote, invoice, photo, comment)
 */
export const documentAddedEmailTemplate = (
  userName,
  documentType,
  documentName,
  documentContent,
  documentId,
) => {
  const typeLabels = {
    quote: "Quote",
    invoice: "Invoice",
    photo: "Photo",
    comment: "Comment",
    instruction: "Instruction",
  };

  const typeLabel = typeLabels[documentType] || "Document";
  const typeIcon =
    {
      quote: "📋",
      invoice: "💰",
      photo: "📸",
      comment: "💬",
      instruction: "📝",
    }[documentType] || "📄";

  const content = `
    <h2>New ${typeLabel} Added ${typeIcon}</h2>
    
    <p>Hello ${userName || "there"},</p>
    
    <p>A new ${documentType} has been added to your project. Here are the details:</p>
    
    <div class="document-card">
        <div class="document-title">${documentName}</div>
        <div class="document-meta">
            Type: ${typeLabel}<br>
            Added: ${new Date().toLocaleDateString("en-GB")}
        </div>
        ${
          documentContent
            ? `<div style="margin-top: 12px; padding-top: 12px; border-top: 1px solid #e9ecef;">
            <strong>Details:</strong><br>
            ${typeof documentContent === "string" ? documentContent : JSON.stringify(documentContent, null, 2)}
        </div>`
            : ""
        }
    </div>
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/dashboard" class="button">View in Dashboard</a>
    </div>
    
    <p>You can view all your project documents, track payments, and stay updated on your renovation progress through your dashboard.</p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: `New ${typeLabel} Added - ${documentName}`,
    html: baseTemplate(content, `New ${typeLabel} Added`),
    text: `A new ${documentType} "${documentName}" has been added to your project. View it in your dashboard at https://${config.domainName}/dashboard`,
  };
};

/**
 * Payment Due Email Template
 * Sent when payment is due soon or overdue
 */
export const paymentDueEmailTemplate = (
  userName,
  paymentName,
  amount,
  dueDate,
  isOverdue = false,
) => {
  const daysUntilDue = Math.ceil(
    (new Date(dueDate) - new Date()) / (1000 * 60 * 60 * 24),
  );
  const isPastDue = daysUntilDue < 0;

  const alertClass = isOverdue ? "alert-urgent" : "alert-warning";
  const alertIcon = isOverdue ? "🚨" : "⚠️";
  const statusText = isOverdue
    ? "OVERDUE"
    : isPastDue
      ? "DUE NOW"
      : `DUE IN ${daysUntilDue} DAY${daysUntilDue !== 1 ? "S" : ""}`;

  const content = `
    <h2>Payment ${isOverdue ? "Overdue" : "Due Soon"} ${alertIcon}</h2>
    
    <p>Hello ${userName || "there"},</p>
    
    <p>This is a reminder about an upcoming payment for your renovation project.</p>
    
    <div class="alert ${alertClass}">
        <strong>Payment Details:</strong><br>
        Payment: ${paymentName}<br>
        Amount: £${amount.toFixed(2)}<br>
        Status: ${statusText}<br>
        Due Date: ${new Date(dueDate).toLocaleDateString("en-GB")}
    </div>
    
    ${
      isOverdue
        ? `
    <div class="alert alert-urgent">
        <strong>Action Required:</strong> This payment is overdue. Please contact us immediately to arrange payment and avoid any delays to your project.
    </div>
    `
        : ""
    }
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/dashboard/payments" class="button">View Payment Details</a>
    </div>
    
    <p>If you have any questions about this payment or need to discuss payment arrangements, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: `Payment ${isOverdue ? "Overdue" : "Due Soon"} - ${paymentName}`,
    html: baseTemplate(
      content,
      `Payment ${isOverdue ? "Overdue" : "Due Soon"}`,
    ),
    text: `Payment "${paymentName}" (£${amount.toFixed(2)}) is ${isOverdue ? "overdue" : `due in ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}`}. View details at https://${config.domainName}/dashboard/payments`,
  };
};

/**
 * Project Status Update Email Template
 * Sent when project status changes
 */
export const projectStatusUpdateEmailTemplate = (
  userName,
  oldStatus,
  newStatus,
) => {
  const content = `
    <h2>Project Status Updated 📊</h2>
    
    <p>Hello ${userName || "there"},</p>
    
    <p>Your renovation project status has been updated. Here are the details:</p>
    
    <div class="alert alert-success">
        <strong>Status Change:</strong><br>
        From: ${oldStatus}<br>
        To: ${newStatus}<br>
        Updated: ${new Date().toLocaleDateString("en-GB")}
    </div>
    
    <h3>What This Means:</h3>
    <ul>
        <li><strong>Lead:</strong> Initial consultation and planning phase</li>
        <li><strong>On Going:</strong> Active construction and renovation work</li>
        <li><strong>Finished:</strong> Project completed and ready for handover</li>
    </ul>
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/dashboard" class="button">View Project Details</a>
    </div>
    
    <p>You can track your project progress, view documents, and manage payments through your dashboard.</p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: `Project Status Updated - ${newStatus}`,
    html: baseTemplate(content, "Project Status Updated"),
    text: `Your project status has changed from "${oldStatus}" to "${newStatus}". View details at https://${config.domainName}/dashboard`,
  };
};

/**
 * Admin Notification Email Template
 * Sent to admin when new user is created
 */
export const adminNewUserNotificationTemplate = (
  userName,
  userEmail,
  createdBy,
) => {
  const content = `
    <h2>New User Created 👤</h2>
    
    <p>Hello Admin,</p>
    
    <p>A new user has been created in the Better Homes Studio system.</p>
    
    <div class="alert alert-success">
        <strong>New User Details:</strong><br>
        Name: ${userName || "Not provided"}<br>
        Email: ${userEmail}<br>
        Created: ${new Date().toLocaleDateString("en-GB")}<br>
        Created By: ${createdBy || "System"}
    </div>
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/admin/users" class="button">Manage Users</a>
    </div>
    
    <p>You can manage this user's account, add documents, and track their project progress through the admin panel.</p>
    
    <p>Best regards,<br>
    Better Homes Studio System</p>
  `;

  return {
    subject: `New User Created - ${userEmail}`,
    html: baseTemplate(content, "New User Created"),
    text: `New user created: ${userName || "Unknown"} (${userEmail}). Manage at https://${config.domainName}/admin/users`,
  };
};

/**
 * System Announcement Email Template
 * Sent for system-wide announcements
 */
export const announcementEmailTemplate = (
  userName,
  title,
  message,
  priority = "medium",
) => {
  const priorityIcons = {
    low: "📢",
    medium: "📢",
    high: "⚠️",
    urgent: "🚨",
  };

  const priorityColors = {
    low: "alert-success",
    medium: "alert-success",
    high: "alert-warning",
    urgent: "alert-urgent",
  };

  const content = `
    <h2>${title} ${priorityIcons[priority]}</h2>
    
    <p>Hello ${userName || "there"},</p>
    
    <div class="alert ${priorityColors[priority]}">
        ${message}
    </div>
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/dashboard" class="button">Visit Dashboard</a>
    </div>
    
    <p>Thank you for choosing Better Homes Studio.</p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: `Better Homes Studio - ${title}`,
    html: baseTemplate(content, title),
    text: `${title}: ${message}. Visit https://${config.domainName}/dashboard for more information.`,
  };
};

/**
 * Moodboard Created Email Template
 * Sent when a new moodboard is created for a user
 */
export const moodboardCreatedEmailTemplate = (
  userName,
  moodboardName,
  description = null,
  projectType = null,
) => {
  const content = `
    <h2>New Moodboard Created 🎨</h2>
    
    <p>Hello ${userName || "there"},</p>
    
    <p>Great news! We've created a new moodboard for your renovation project.</p>
    
    <div class="alert alert-success">
        <strong>Moodboard Details:</strong><br>
        Name: ${moodboardName}<br>
        ${description ? `Description: ${description}<br>` : ""}
        ${projectType ? `Project Type: ${projectType}<br>` : ""}
        Created: ${new Date().toLocaleDateString("en-GB")}
    </div>
    
    <p>Your moodboard contains carefully selected products for your project. You can now:</p>
    
    <ul style="margin-left: 20px; margin-bottom: 20px;">
        <li>Review all products in each section</li>
        <li>Approve or decline individual products</li>
        <li>Add comments and feedback</li>
        <li>See pricing and supplier information</li>
    </ul>
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/dashboard/moodboards" class="button">View Your Moodboard</a>
    </div>
    
    <p>Please take some time to review the products and let us know your preferences. This helps us ensure your project meets your exact requirements.</p>
    
    <p>If you have any questions about the products or need assistance, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: `New Moodboard Created - ${moodboardName}`,
    html: baseTemplate(content, "New Moodboard Created"),
    text: `New moodboard "${moodboardName}" has been created for your project. View it at https://${config.domainName}/dashboard/moodboards`,
  };
};

/**
 * Product Approval Email Template
 * Sent to admin when user approves or declines a product
 */
export const productApprovalEmailTemplate = (
  userName,
  productName,
  approvalStatus,
  userComment = null,
  moodboardName = null,
) => {
  const statusIcon = approvalStatus === "approved" ? "✅" : "❌";
  const statusColor =
    approvalStatus === "approved" ? "alert-success" : "alert-warning";
  const statusText = approvalStatus === "approved" ? "APPROVED" : "DECLINED";

  const content = `
    <h2>Product ${statusText} ${statusIcon}</h2>
    
    <p>Hello Admin,</p>
    
    <p>A user has ${approvalStatus} a product in their moodboard.</p>
    
    <div class="alert ${statusColor}">
        <strong>Product Details:</strong><br>
        Product: ${productName}<br>
        Status: ${statusText}<br>
        User: ${userName || "Unknown"}<br>
        ${moodboardName ? `Moodboard: ${moodboardName}<br>` : ""}
        Date: ${new Date().toLocaleDateString("en-GB")}
    </div>
    
    ${
      userComment
        ? `
    <div class="alert alert-info">
        <strong>User Comment:</strong><br>
        "${userComment}"
    </div>
    `
        : ""
    }
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/admin/moodboards" class="button">View Moodboards</a>
    </div>
    
    <p>You can review this decision and take any necessary actions through the admin panel.</p>
    
    <p>Best regards,<br>
    Better Homes Studio System</p>
  `;

  return {
    subject: `Product ${statusText} - ${productName}`,
    html: baseTemplate(content, `Product ${statusText}`),
    text: `Product "${productName}" has been ${approvalStatus} by ${userName || "user"}. ${userComment ? `Comment: "${userComment}"` : ""}`,
  };
};

/**
 * Moodboard Status Update Email Template
 * Sent when moodboard status changes
 */
export const moodboardStatusUpdateEmailTemplate = (
  userName,
  moodboardName,
  oldStatus,
  newStatus,
) => {
  const statusIcons = {
    draft: "📝",
    shared: "📤",
    approved: "✅",
    completed: "🎉",
  };

  const statusColors = {
    draft: "alert-info",
    shared: "alert-warning",
    approved: "alert-success",
    completed: "alert-success",
  };

  const statusDescriptions = {
    draft: "Your moodboard is being prepared by our team",
    shared: "Your moodboard is ready for your review",
    approved:
      "Your moodboard has been approved and is ready for implementation",
    completed:
      "Your moodboard has been completed and products are being ordered",
  };

  const content = `
    <h2>Moodboard Status Updated ${statusIcons[newStatus]}</h2>
    
    <p>Hello ${userName || "there"},</p>
    
    <p>Your moodboard status has been updated.</p>
    
    <div class="alert ${statusColors[newStatus]}">
        <strong>Status Change:</strong><br>
        Moodboard: ${moodboardName}<br>
        Previous Status: ${oldStatus.charAt(0).toUpperCase() + oldStatus.slice(1)}<br>
        New Status: ${newStatus.charAt(0).toUpperCase() + newStatus.slice(1)}<br>
        Updated: ${new Date().toLocaleDateString("en-GB")}
    </div>
    
    <div class="alert alert-info">
        <strong>What this means:</strong><br>
        ${statusDescriptions[newStatus]}
    </div>
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/dashboard/moodboards" class="button">View Your Moodboard</a>
    </div>
    
    <p>If you have any questions about this status change or need assistance, please don't hesitate to contact us.</p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: `Moodboard Status Updated - ${moodboardName}`,
    html: baseTemplate(content, "Moodboard Status Updated"),
    text: `Your moodboard "${moodboardName}" status has changed from ${oldStatus} to ${newStatus}. View it at https://${config.domainName}/dashboard/moodboards`,
  };
};

/**
 * Ticket: New Ticket Notification (Admins)
 */
export const ticketNewAdminNotificationTemplate = (
  adminName,
  ticketNumber,
  title,
  category,
  priority,
  customerName,
  customerEmail,
  description,
  ticketUrl,
) => {
  const content = `
    <h2>New Ticket Created 🆕</h2>
    <p>Hello ${adminName || "Admin"},</p>
    <p>A new ticket has been created. Here are the details:</p>
    <div class="document-card">
      <div class="document-title">${title}</div>
      <div class="document-meta">
        Ticket: ${ticketNumber}<br>
        Category: ${category}<br>
        Priority: ${priority}<br>
        Customer: ${customerName} (${customerEmail})
      </div>
      ${
        description
          ? `<div style="margin-top:12px"><strong>Description:</strong><br>${description}</div>`
          : ""
      }
    </div>
    <div style="text-align:center;">
      <a href="${ticketUrl}" class="button">Open Ticket</a>
    </div>
  `;

  return {
    subject: `New Ticket Created: ${ticketNumber}`,
    html: baseTemplate(content, "New Ticket Created"),
    text: `New ticket ${ticketNumber} created. Title: ${title}. Customer: ${customerName} (${customerEmail}). Open: ${ticketUrl}`,
  };
};

/**
 * Ticket: Status Update (Customer)
 */
export const ticketStatusUpdateEmailTemplate = (
  userName,
  ticketNumber,
  title,
  oldStatus,
  newStatus,
  ticketUrl,
) => {
  const content = `
    <h2>Ticket Status Updated 📬</h2>
    <p>Hello ${userName || "there"},</p>
    <p>Your ticket has been updated:</p>
    <div class="alert alert-success">
      <strong>${title}</strong><br>
      Ticket: ${ticketNumber}<br>
      From: ${oldStatus || "Unknown"}<br>
      To: ${newStatus}
    </div>
    <div style="text-align:center;">
      <a href="https://${config.domainName}/dashboard/tickets" class="button">View Ticket</a>
    </div>
  `;

  return {
    subject: `Ticket ${ticketNumber} status: ${newStatus}`,
    html: baseTemplate(content, "Ticket Status Updated"),
    text: `Your ticket ${ticketNumber} changed from ${oldStatus || "Unknown"} to ${newStatus}. View: ${ticketUrl}`,
  };
};

/**
 * Ticket: Admin Note Added -> Customer
 */
export const ticketAdminNoteAddedEmailTemplate = (
  userName,
  ticketNumber,
  title,
  adminName,
  note,
) => {
  const content = `
    <h2>New Note Added To Your Ticket 📝</h2>
    <p>Hello ${userName || "there"},</p>
    <p>Our team added a new note to your ticket:</p>
    <div class="document-card">
      <div class="document-title">${title} (${ticketNumber})</div>
      <div class="document-meta">From: ${adminName || "Admin"}</div>
      <div style="margin-top:12px"><strong>Note:</strong><br>${note}</div>
    </div>
    <div style="text-align:center;">
      <a href="https://${config.domainName}/dashboard/tickets" class="button">Open Ticket</a>
    </div>
  `;

  return {
    subject: `New note on ticket ${ticketNumber}`,
    html: baseTemplate(content, "Ticket Note Added"),
    text: `A new note was added by ${adminName} on ticket ${ticketNumber}: ${note}`,
  };
};

/**
 * Ticket: Customer Update Added -> Admins
 */
export const ticketCustomerUpdateAddedEmailTemplate = (
  adminName,
  ticketNumber,
  title,
  customerName,
  update,
  adminTicketUrl,
) => {
  const content = `
    <h2>Customer Update Added 💬</h2>
    <p>Hello ${adminName || "Admin"},</p>
    <p>The customer added an update to a ticket:</p>
    <div class="document-card">
      <div class="document-title">${title} (${ticketNumber})</div>
      <div class="document-meta">Customer: ${customerName}</div>
      <div style="margin-top:12px"><strong>Update:</strong><br>${update}</div>
    </div>
    <div style="text-align:center;">
      <a href="${adminTicketUrl}" class="button">Open Ticket</a>
    </div>
  `;

  return {
    subject: `Customer update on ${ticketNumber}`,
    html: baseTemplate(content, "Customer Update Added"),
    text: `Customer ${customerName} added an update on ticket ${ticketNumber}: ${update}. Open: ${adminTicketUrl}`,
  };
};

/**
 * User Inactivity Email Template
 * Sent to admin when user has been inactive for specified days
 */
export const userInactivityEmailTemplate = (
  userName,
  lastLoginAt,
  daysThreshold,
) => {
  const daysInactive = Math.floor(
    (new Date() - new Date(lastLoginAt)) / (1000 * 60 * 60 * 24),
  );
  const lastLoginFormatted = new Date(lastLoginAt).toLocaleDateString("en-GB");

  const content = `
    <h2>User Inactivity Alert ⏰</h2>
    
    <p>Hello Admin,</p>
    
    <p>A user has been inactive for ${daysInactive} days (threshold: ${daysThreshold} days).</p>
    
    <div class="alert alert-warning">
        <strong>User Details:</strong><br>
        Name: ${userName || "Unknown"}<br>
        Last Login: ${lastLoginFormatted}<br>
        Days Inactive: ${daysInactive}<br>
        Alert Date: ${new Date().toLocaleDateString("en-GB")}
    </div>
    
    <div style="text-align: center;">
        <a href="https://${config.domainName}/admin/users" class="button">View User Management</a>
    </div>
    
    <p>Consider reaching out to this user to re-engage them with their project.</p>
    
    <p>Best regards,<br>
    Better Homes Studio System</p>
  `;

  return {
    subject: `User Inactivity Alert - ${userName || "Unknown User"}`,
    html: baseTemplate(content, "User Inactivity Alert"),
    text: `User ${userName || "Unknown"} has been inactive for ${daysInactive} days. Last login: ${lastLoginFormatted}.`,
  };
};

/**
 * Project Change Notification Email Template
 * Sent to user when a new project change is added
 */
export const projectChangeNotificationEmailTemplate = (
  userName,
  changeName,
  cost,
  type,
  description = null,
) => {
  const formattedCost = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(cost);

  const content = `
    <h2>New Project Change Request 📋</h2>
    
    <p>Dear ${userName || "Valued Customer"},</p>
    
    <p>A new change request has been added to your project that requires your review and approval.</p>
    
    <div class="document-card">
      <h3 style="margin: 0 0 15px 0; color: #333;">Change Details:</h3>
      <p style="margin: 8px 0;"><strong>Name:</strong> ${changeName}</p>
      <p style="margin: 8px 0;"><strong>Cost:</strong> ${formattedCost}</p>
      <p style="margin: 8px 0;"><strong>Type:</strong> ${type}</p>
      ${description ? `<p style="margin: 8px 0;"><strong>Description:</strong> ${description}</p>` : ""}
    </div>
    
    <p>Please log into your dashboard to review this change request and provide your approval or decline.</p>
    
    <div style="text-align: center;">
      <a href="https://${config.domainName}/dashboard" class="button">
        Review Change Request
      </a>
    </div>
    
    <p>If you have any questions about this change request, please contact our support team at 
    <a href="mailto:${config.resend.supportEmail}">${config.resend.supportEmail}</a></p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: "New Project Change Request",
    html: baseTemplate(content, "New Project Change Request"),
    text: `New project change request "${changeName}" has been added. Cost: ${formattedCost}, Type: ${type}. Review at https://${config.domainName}/dashboard`,
  };
};

/**
 * Project Change Status Email Template
 * Sent to user when a project change is approved or declined
 */
export const projectChangeStatusEmailTemplate = (
  userName,
  changeName,
  status,
  cost,
  adminNotes = null,
) => {
  const formattedCost = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(cost);

  const statusText = status === "Accepted" ? "approved" : "declined";
  const alertClass = status === "Accepted" ? "alert-success" : "alert-urgent";

  const content = `
    <h2>Project Change ${status} ${status === "Accepted" ? "✅" : "❌"}</h2>
    
    <p>Dear ${userName || "Valued Customer"},</p>
    
    <p>Your change request has been ${statusText}. Here are the details:</p>
    
    <div class="document-card">
      <h3 style="margin: 0 0 15px 0; color: #333;">Change Details:</h3>
      <p style="margin: 8px 0;"><strong>Name:</strong> ${changeName}</p>
      <p style="margin: 8px 0;"><strong>Cost:</strong> ${formattedCost}</p>
      <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: ${status === "Accepted" ? "#28a745" : "#dc3545"}; font-weight: bold;">${status}</span></p>
      ${adminNotes ? `<p style="margin: 8px 0;"><strong>Notes:</strong> ${adminNotes}</p>` : ""}
    </div>
    
    <div style="text-align: center;">
      <a href="https://${config.domainName}/dashboard" class="button">
        View in Dashboard
      </a>
    </div>
    
    <p>If you have any questions about this decision, please contact our support team at 
    <a href="mailto:${config.resend.supportEmail}">${config.resend.supportEmail}</a></p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: `Project Change ${status}`,
    html: baseTemplate(content, `Project Change ${status}`),
    text: `Your change request "${changeName}" has been ${statusText}. Cost: ${formattedCost}. View at https://${config.domainName}/dashboard`,
  };
};

/**
 * Project Change User Response Email Template
 * Sent to admin when user accepts or declines a change
 */
export const projectChangeUserResponseEmailTemplate = (
  adminName,
  userName,
  changeName,
  status,
  cost,
  projectName,
) => {
  const subject = `Project Change ${status} by User`;
  const formattedCost = new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
  }).format(cost);

  const statusText = status === "Accepted" ? "accepted" : "declined";
  const statusColor = status === "Accepted" ? "#10b981" : "#ef4444";

  const content = `
    <h2>Project Change ${status} by User ${status === "Accepted" ? "✅" : "❌"}</h2>
    
    <p>Hello ${adminName || "Admin"},</p>
    
    <p>A user has ${statusText} a project change request. Here are the details:</p>
    
    <div class="document-card">
      <h3 style="margin: 0 0 15px 0; color: #333;">Change Details:</h3>
      <p style="margin: 8px 0;"><strong>Project:</strong> ${projectName}</p>
      <p style="margin: 8px 0;"><strong>User:</strong> ${userName}</p>
      <p style="margin: 8px 0;"><strong>Change Name:</strong> ${changeName}</p>
      <p style="margin: 8px 0;"><strong>Cost:</strong> ${formattedCost}</p>
      <p style="margin: 8px 0;"><strong>Status:</strong> <span style="color: ${statusColor}; font-weight: bold;">${status}</span></p>
      <p style="margin: 8px 0;"><strong>Response Date:</strong> ${new Date().toLocaleDateString("en-GB")}</p>
    </div>
    
    <div style="text-align: center;">
      <a href="https://${config.domainName}/admin/projects" class="button">
        View Project Details
      </a>
    </div>
    
    <p>You can view the full project details and manage other changes from the admin panel.</p>
    
    <p>Best regards,<br>
    The Better Homes Studio Team</p>
  `;

  return {
    subject: `Project Change ${status} by User`,
    html: baseTemplate(content, `Project Change ${status} by User`),
    text: `User ${userName} has ${statusText} the change request "${changeName}" for project "${projectName}". Cost: ${formattedCost}. View at https://${config.domainName}/admin/projects`,
  };
};
