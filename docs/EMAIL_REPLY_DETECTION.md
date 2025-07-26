# Email Reply Detection System

## Overview

The Email Reply Detection System automatically detects when leads reply to automated emails and intelligently pauses the email automation sequence. This prevents sending follow-up emails to engaged leads and helps maintain better lead relationships.

## How It Works

### 1. **Resend Webhook Integration**

- Resend sends inbound emails to our webhook endpoint
- Webhook processes the email and identifies the sender
- System checks if sender is an active lead with email automation

### 2. **Reply Detection Logic**

- Matches sender email against active leads
- Validates lead has active email automation
- Processes the reply and updates automation status

### 3. **Automation Management**

- Pauses email automation when lead replies
- Resets aging timer (contactMade: true)
- Logs reply as activity in lead history
- Stores reply content for admin review

## Features

### ✅ **Automatic Reply Detection**

- Detects replies to any automated email
- Works with all email stages (Lead, Qualified, Proposal Sent, etc.)
- No manual intervention required

### ✅ **Smart Automation Pausing**

- Automatically pauses email sequence when lead engages
- Prevents sending follow-up emails to engaged leads
- Maintains lead engagement quality

### ✅ **Activity Logging**

- Logs all replies as activities in lead history
- Includes reply subject and content preview
- Tracks reply timestamp and metadata

### ✅ **Aging Timer Reset**

- Resets lead aging timer when they reply
- Indicates active engagement
- Helps with lead prioritization

### ✅ **Admin Visibility**

- Shows reply statistics in email automation dashboard
- Tracks how many leads have replied
- Provides overview of engagement rates

## Technical Implementation

### Webhook Endpoint

```
POST /api/webhook/resend/inbound
```

**Handles:**

- Inbound email processing
- Lead identification
- Reply detection and processing

### Database Schema Updates

**EmailAutomation Model:**

```javascript
// Reply tracking fields
leadReplied: { type: Boolean, default: false },
lastReplyDate: { type: Date },
replySubject: { type: String },
replyContent: { type: String },
```

### Key Functions

**`handleLeadReply(leadId, fromEmail, subject, content, automation)`**

- Processes lead reply
- Updates automation status
- Adds activity to lead
- Resets aging timer

**`resumeEmailAutomation(leadId, reason)`**

- Resumes paused automation
- Resets reply status
- Allows manual restart if needed

## Setup Instructions

### 1. **Resend Webhook Configuration**

1. Log into your Resend dashboard
2. Go to **Settings** → **Webhooks**
3. Click **Add Webhook**
4. Configure:
   - **Name**: "Inbound Email Webhook"
   - **URL**: `https://yourdomain.com/api/webhook/resend/inbound`
   - **Events**: Select "Inbound Email"
5. Save the webhook

### 2. **Domain Configuration**

Ensure your domain is properly configured in Resend:

1. Go to **Settings** → **Domains**
2. Add your domain if not already added
3. Configure DNS records as instructed
4. Verify domain status

### 3. **Testing the Webhook**

1. Send an email to your configured domain
2. Check webhook logs in Resend dashboard
3. Verify webhook endpoint receives the email
4. Check lead automation status in admin panel

## Admin Interface

### Email Automation Dashboard

The admin dashboard now shows:

- **Leads Who Replied**: Count of leads who have replied
- **Reply Statistics**: Overview of engagement rates
- **Automation Status**: Active, paused, and replied automations

### Manual Controls

Admins can:

- **Resume Automation**: Restart paused automations
- **View Reply Content**: See what leads replied with
- **Track Engagement**: Monitor reply patterns

## Monitoring and Troubleshooting

### Webhook Logs

Check webhook delivery in Resend dashboard:

1. Go to **Settings** → **Webhooks**
2. Click on your webhook
3. View **Delivery History**
4. Check for failed deliveries

### Application Logs

Monitor application logs for:

- Webhook processing errors
- Lead identification issues
- Automation update failures

### Common Issues

**Webhook Not Receiving Emails:**

- Verify domain configuration
- Check webhook URL accessibility
- Ensure webhook is active

**Leads Not Being Identified:**

- Check email address matching
- Verify lead is active and not archived
- Confirm automation exists for lead

**Automation Not Pausing:**

- Check database connection
- Verify automation model updates
- Review error logs

## Best Practices

### 1. **Regular Monitoring**

- Check webhook delivery rates weekly
- Monitor reply detection accuracy
- Review automation pause patterns

### 2. **Reply Content Review**

- Periodically review lead replies
- Identify common questions/concerns
- Update email templates based on feedback

### 3. **Automation Optimization**

- Analyze which emails get more replies
- Adjust timing and content based on engagement
- Consider A/B testing different approaches

### 4. **Manual Follow-up**

- Review paused automations regularly
- Manually follow up with engaged leads
- Resume automation when appropriate

## Security Considerations

### Webhook Security

- Webhook endpoint is public but validates lead data
- No sensitive information exposed in logs
- Email content is stored securely

### Data Privacy

- Reply content is stored for admin review only
- No automated processing of reply content
- Follows existing data retention policies

## Future Enhancements

### Potential Improvements

- **Reply Content Analysis**: Automatically categorize replies
- **Smart Resume Logic**: Automatically resume based on reply content
- **Reply Templates**: Pre-written responses for common replies
- **Engagement Scoring**: Rate lead engagement based on reply patterns

### Integration Opportunities

- **CRM Updates**: Auto-update lead status based on replies
- **Task Creation**: Create follow-up tasks for admins
- **Notification System**: Alert admins of important replies
- **Analytics**: Track reply rates and engagement metrics

## Support

For technical support or questions about the Email Reply Detection System:

1. Check this documentation first
2. Review application logs for errors
3. Test webhook configuration
4. Contact development team if issues persist
