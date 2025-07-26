/**
 * CRM Email Templates
 * Templates for automated email sequences in the CRM system
 */

/**
 * Generate lead introduction email
 */
export const leadIntroEmailTemplate = (leadData) => {
  const projectTypesText =
    leadData.projectTypes?.length > 0
      ? leadData.projectTypes.join(", ")
      : leadData.customProjectType || "your project";

  const budgetText =
    {
      "£": "£0-10,000",
      "££": "£10,000-25,000",
      "£££": "£25,000-50,000",
      "££££": "£50,000+",
    }[leadData.budget] || "your budget range";

  const subject = `You and Better Homes - Let's discuss your ${projectTypesText}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Better Homes Studio</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 20px; border-radius: 8px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        .cta { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="color: #007bff; margin: 0;">Better Homes Studio</h1>
        <p style="margin: 10px 0 0 0; color: #666;">Transforming Homes, Exceeding Expectations</p>
      </div>
      
      <div class="content">
        <p>Dear ${leadData.name},</p>
        
        <p>Thank you for your interest in Better Homes Studio! We&apos;re excited to help you bring your vision to life.</p>
        
        <div class="highlight">
          <strong>Project Details:</strong><br>
          • Project Type: ${projectTypesText}<br>
          • Location: ${leadData.address || "Your area"}
        </div>
        
        <p>Our team of experienced professionals is ready to discuss your ${projectTypesText} project and provide you with a comprehensive quote tailored to your needs and budget.</p>
        
        <p>Here&apos;s what you can expect from us:</p>
        <ul>
          <li>Free consultation and site visit</li>
          <li>Detailed project planning and design</li>
          <li>Best in industry workmanship warranty</li>
          <li>Transparent pricing with no hidden costs</li>
          <li>Quality craftsmanship and materials</li>
          <li>Professional project management</li>
        </ul>
        
        <p>We&apos;ll be in touch within the next 24 hours to schedule a convenient time to discuss your project in detail. If you already have a preferred time, please let us know and we&apos;ll do our best to accommodate.</p>
        
        <p>In the meantime, feel free to explore our portfolio and learn more about our services at <a href="https://bhstudio.co.uk" style="color: #007bff;">bhstudio.co.uk</a>.</p>
        
        <p>To get started even faster, please reply to this email with a list of things you'd like to get done and any relevant photos, videos or documents you have and we'll get back to you with a quote and a plan of action.</p>

        <p>If you have any immediate questions, please don&apos;t hesitate to reply to this email or call us directly.</p>
        
        <p>We look forward to working with you!</p>

        <p>Kind regards,<br>
        Gino @ Better Homes</p>
      </div>
      
      <div class="footer">
        <p><strong>Better Homes Studio</strong><br>
        <a href="https://bhstudio.co.uk" style="color: #007bff;">bhstudio.co.uk</a></p>
      </div>
    </body>
    </html>
  `;

  const text = `
Dear ${leadData.name},

Thank you for your interest in Better Homes Studio! We're excited to help you bring your vision to life.

Project Details:
• Project Type: ${projectTypesText}
• Location: ${leadData.address || "Your area"}

Our team of experienced professionals is ready to discuss your ${projectTypesText} project and provide you with a comprehensive quote tailored to your needs and budget.

Here's what you can expect from us:
• Free consultation and site visit
• Detailed project planning and design
• Best in industry workmanship warranty
• Transparent pricing with no hidden costs
• Quality craftsmanship and materials
• Professional project management

We'll be in touch within the next 24 hours to schedule a convenient time to discuss your project in detail.

In the meantime, feel free to explore our portfolio and learn more about our services at https://bhstudio.co.uk.
If you already have a preferred time, please let us know and we'll do our best to accommodate.

If you have any immediate questions, please don't hesitate to reply to this email or call us directly.
To get started even faster, please reply to this email with a list of things you'd like to get done and any relevant photos, videos or documents you have and we'll get back to you with a quote and a plan of action.

We look forward to working with you!

Better Homes Studio
https://bhstudio.co.uk

Kind regards,<br>
Gino @ Better Homes
  `;

  return { subject, html, text };
};

/**
 * Generate lead follow-up email
 */
export const leadFollowupEmailTemplate = (leadData, followupNumber) => {
  const projectTypesText =
    leadData.projectTypes?.length > 0
      ? leadData.projectTypes.join(", ")
      : leadData.customProjectType || "your project";

  const followupMessages = [
    {
      subject: `Following up on your ${projectTypesText} project`,
      intro:
        "I wanted to follow up on your recent inquiry about your project. Have you had a chance to review our initial information?",
    },
    {
      subject: `Quick check-in about your ${projectTypesText}`,
      intro:
        "I hope this message finds you well. I wanted to touch base regarding your project plans and see if you have any questions about our services.",
    },
    {
      subject: `Your ${projectTypesText} project - Still interested?`,
      intro:
        "I wanted to check in and see if you're still considering moving forward with your project. We'd love to help bring your vision to life!",
    },
    {
      subject: `Final follow-up: Your ${projectTypesText} project`,
      intro:
        "This is our final follow-up regarding your project. If you're still interested, we'd be happy to provide a detailed quote and consultation.",
    },
  ];

  const message = followupMessages[followupNumber - 1] || followupMessages[0];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Follow-up from Better Homes Studio</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 20px; border-radius: 8px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        .cta { background: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 20px 0; }
        .highlight { background: #fff3cd; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="color: #007bff; margin: 0;">Better Homes Studio</h1>
        <p style="margin: 10px 0 0 0; color: #666;">Transforming Homes, Exceeding Expectations</p>
      </div>
      
      <div class="content">
        <p>Dear ${leadData.name},</p>
        
        <p>${message.intro}</p>
        
        <div class="highlight">
          <strong>Your Project:</strong> ${projectTypesText}<br>
          <strong>Location:</strong> ${leadData.address || "Your area"}
        </div>
        
        <p>We&apos;re here to help with:</p>
        <ul>
          <li>Free consultation and site visit</li>
          <li>Detailed project planning</li>
          <li>Comprehensive quote</li>
          <li>Professional project management</li>
        </ul>
        
        <p>Simply reply to this email or give us a call, and we&apos;ll get started right away!</p>
        
        <p>You can also visit our website to see examples of our work: <a href="https://bhstudio.co.uk" style="color: #007bff;">bhstudio.co.uk</a></p>
        
        <p>Looking forward to hearing from you!</p>
      </div>
      
      <div class="footer">
        <p><strong>Better Homes Studio</strong><br>
        <a href="https://bhstudio.co.uk" style="color: #007bff;">bhstudio.co.uk</a></p>
        <p style="margin-top: 15px; font-size: 12px; color: #666;">
          Kind Regards,<br>
          Gino @ Better Homes
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Dear ${leadData.name},

${message.intro}

Your Project: ${projectTypesText}
Location: ${leadData.address || "Your area"}

We're here to help with:
• Free consultation and site visit
• Detailed project planning
• Comprehensive quote
• Professional project management

Simply reply to this email or give us a call, and we'll get started right away!

You can also visit our website to see examples of our work: https://bhstudio.co.uk

Looking forward to hearing from you!

Better Homes Studio
https://bhstudio.co.uk

Kind Regards,
Gino @ Better Homes
  `;

  return { subject: message.subject, html, text };
};

/**
 * Generate qualified stage admin notification
 */
export const qualifiedAdminNotificationTemplate = (leadData, adminData) => {
  const projectTypesText =
    leadData.projectTypes?.length > 0
      ? leadData.projectTypes.join(", ")
      : leadData.customProjectType || "project";

  const subject = `URGENT: ${leadData.name} awaiting quote - ${projectTypesText}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Lead Awaiting Quote</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #dc3545; color: white; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 20px; border-radius: 8px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        .urgent { background: #f8d7da; border: 1px solid #f5c6cb; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .lead-info { background: #e2e3e5; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">⚠️ LEAD AWAITING QUOTE</h1>
        <p style="margin: 10px 0 0 0;">Action Required</p>
      </div>
      
      <div class="content">
        <div class="urgent">
          <strong>URGENT:</strong> ${leadData.name} has replied and is awaiting their quote for ${projectTypesText}.
        </div>
        
        <div class="lead-info">
          <strong>Lead Details:</strong><br>
          • Name: ${leadData.name}<br>
          • Email: ${leadData.email}<br>
          • Phone: ${leadData.phone || "Not provided"}<br>
          • Project: ${projectTypesText}<br>
          • Budget: ${leadData.budget}<br>
          • Value: £${leadData.value?.toLocaleString() || "0"}<br>
          • Address: ${leadData.address || "Not provided"}
        </div>
        
        <p><strong>Action Required:</strong> Please prepare and send a quote to ${leadData.name} as soon as possible.</p>
        
        <p>This lead has moved to the "Qualified" stage and is expecting a response.</p>
        
        <p>You can access the full lead details in the CRM system.</p>
      </div>
      
      <div class="footer">
        <p><strong>Better Homes Studio CRM</strong><br>
        Automated Notification</p>
      </div>
    </body>
    </html>
  `;

  const text = `
URGENT: LEAD AWAITING QUOTE

${leadData.name} has replied and is awaiting their quote for ${projectTypesText}.

Lead Details:
• Name: ${leadData.name}
• Email: ${leadData.email}
• Phone: ${leadData.phone || "Not provided"}
• Project: ${projectTypesText}
• Budget: ${leadData.budget}
• Value: £${leadData.value?.toLocaleString() || "0"}
• Address: ${leadData.address || "Not provided"}

Action Required: Please prepare and send a quote to ${leadData.name} as soon as possible.

This lead has moved to the "Qualified" stage and is expecting a response.

You can access the full lead details in the CRM system.

Better Homes Studio CRM
Automated Notification
  `;

  return { subject, html, text };
};

/**
 * Generate proposal follow-up email
 */
export const proposalFollowupEmailTemplate = (leadData, followupNumber) => {
  const projectTypesText =
    leadData.projectTypes?.length > 0
      ? leadData.projectTypes.join(", ")
      : leadData.customProjectType || "your project";

  const followupMessages = [
    {
      subject: `Have you reviewed your ${projectTypesText} quote?`,
      intro:
        "I wanted to check if you've had a chance to review the quote we sent for your project. Do you have any questions about the proposal?",
    },
    {
      subject: `Following up on your ${projectTypesText} proposal`,
      intro:
        "I hope you're well. I wanted to follow up on the quote we provided for your project and see if you need any clarification or have questions.",
    },
    {
      subject: `Your ${projectTypesText} quote - Any questions?`,
      intro:
        "I wanted to touch base regarding your project quote. We're here to answer any questions you might have and help you move forward. If pricing is a concern, please let us know and we'll see what we can do to help.",
    },
    {
      subject: `Final follow-up: Your ${projectTypesText} proposal`,
      intro:
        "This is our final follow-up regarding your project quote. If you have any questions or would like to discuss the proposal, please let us know.",
    },
  ];

  const message = followupMessages[followupNumber - 1] || followupMessages[0];

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Proposal Follow-up</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 20px; border-radius: 8px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        .highlight { background: #d1ecf1; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="color: #007bff; margin: 0;">Better Homes Studio</h1>
        <p style="margin: 10px 0 0 0; color: #666;">Transforming Homes, Exceeding Expectations</p>
      </div>
      
      <div class="content">
        <p>Dear ${leadData.name},</p>
        
        <p>${message.intro}</p>
        
        <div class="highlight">
          <strong>Project:</strong> ${projectTypesText}<br>
          <strong>Location:</strong> ${leadData.address || "Your area"}
        </div>
        
        <p>We&apos;re here to help with:</p>
        <ul>
          <li>Clarifying any aspects of the quote</li>
          <li>Discussing project timeline and scheduling</li>
          <li>Addressing any concerns you might have</li>
          <li>Moving forward with the next steps</li>
        </ul>
        
        <p>Please don&apos;t hesitate to reply to this email or call us directly if you have any questions about the proposal.</p>
        
        <p>We&apos;re excited about the possibility of working with you on your ${projectTypesText}!</p>
      </div>
      
      <div class="footer">
        <p><strong>Better Homes Studio</strong><br>
        <a href="https://bhstudio.co.uk" style="color: #007bff;">bhstudio.co.uk</a></p>
        <p style="margin-top: 15px; font-size: 12px; color: #666;">
          Kind Regards,<br>
          Gino @ Better Homes
        </p>
      </div>
    </body>
    </html>
  `;

  const text = `
Dear ${leadData.name},

${message.intro}

Project: ${projectTypesText}
Location: ${leadData.address || "Your area"}

We're here to help with:
• Clarifying any aspects of the quote
• Discussing project timeline and scheduling
• Addressing any concerns you might have
• Moving forward with the next steps

Please don't hesitate to reply to this email or call us directly if you have any questions about the proposal.

We're excited about the possibility of working with you on your ${projectTypesText}!

Better Homes Studio
https://bhstudio.co.uk

Kind Regards,
Gino @ Better Homes
  `;

  return { subject: message.subject, html, text };
};

/**
 * Generate negotiations admin notification
 */
export const negotiationsAdminNotificationTemplate = (leadData, adminData) => {
  const projectTypesText =
    leadData.projectTypes?.length > 0
      ? leadData.projectTypes.join(", ")
      : leadData.customProjectType || "project";

  const subject = `REMINDER: ${leadData.name} in negotiations - ${projectTypesText}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Negotiations Reminder</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ffc107; color: #212529; padding: 20px; text-align: center; border-radius: 8px; margin-bottom: 20px; }
        .content { background: white; padding: 20px; border-radius: 8px; }
        .footer { background: #f8f9fa; padding: 20px; text-align: center; border-radius: 8px; margin-top: 20px; font-size: 14px; }
        .reminder { background: #fff3cd; border: 1px solid #ffeaa7; padding: 15px; border-radius: 6px; margin: 15px 0; }
        .lead-info { background: #e2e3e5; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="header">
        <h1 style="margin: 0;">🤝 NEGOTIATIONS REMINDER</h1>
        <p style="margin: 10px 0 0 0;">Action Required</p>
      </div>
      
      <div class="content">
        <div class="reminder">
          <strong>REMINDER:</strong> ${leadData.name} is in the negotiations stage for ${projectTypesText} and may need follow-up to move the deal forward.
        </div>
        
        <div class="lead-info">
          <strong>Lead Details:</strong><br>
          • Name: ${leadData.name}<br>
          • Email: ${leadData.email}<br>
          • Phone: ${leadData.phone || "Not provided"}<br>
          • Project: ${projectTypesText}<br>
          • Budget: ${leadData.budget}<br>
          • Value: £${leadData.value?.toLocaleString() || "0"}<br>
          • Address: ${leadData.address || "Not provided"}
        </div>
        
        <p><strong>Action Required:</strong> Please follow up with ${leadData.name} to move the negotiations forward and close the deal.</p>
        
        <p>This lead is in the "Negotiations" stage and may need additional attention to convert to "Won".</p>
        
        <p>You can access the full lead details in the CRM system.</p>
      </div>
      
      <div class="footer">
        <p><strong>Better Homes Studio CRM</strong><br>
        Automated Notification</p>
      </div>
    </body>
    </html>
  `;

  const text = `
NEGOTIATIONS REMINDER

${leadData.name} is in the negotiations stage for ${projectTypesText} and may need follow-up to move the deal forward.

Lead Details:
• Name: ${leadData.name}
• Email: ${leadData.email}
• Phone: ${leadData.phone || "Not provided"}
• Project: ${projectTypesText}
• Budget: ${leadData.budget}
• Value: £${leadData.value?.toLocaleString() || "0"}
• Address: ${leadData.address || "Not provided"}

Action Required: Please follow up with ${leadData.name} to move the negotiations forward and close the deal.

This lead is in the "Negotiations" stage and may need additional attention to convert to "Won".

You can access the full lead details in the CRM system.

Better Homes Studio CRM
Automated Notification
  `;

  return { subject, html, text };
};
