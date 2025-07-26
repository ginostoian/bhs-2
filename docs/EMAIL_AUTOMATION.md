# Email Automation System

## Overview

The Email Automation System provides comprehensive automated email sequences for CRM leads based on their stage in the pipeline. The system automatically sends personalized emails to leads and notifications to admins at appropriate intervals.

## Features

- **Stage-based automation**: Different email sequences for each CRM stage
- **Personalized content**: Emails include lead name, project type, budget, and address
- **Admin notifications**: Internal notifications to assigned admins
- **Activity logging**: All emails are logged as activities in the lead record
- **Pause/resume functionality**: Automation can be paused when needed
- **Comprehensive tracking**: Full history of sent emails with success/failure status

## Email Sequences by Stage

### Lead Stage

- **Introduction email**: Sent immediately when lead is created
- **Follow-up emails**: 4 follow-up emails sent every 2 days
- **Auto-move**: Lead automatically moves to "Never replied" after 5 emails

### Qualified Stage

- **Admin notifications**: Sent to assigned admin every 2 days
- **Purpose**: Remind admin to send quote to the lead

### Proposal Sent Stage

- **First follow-up**: Sent 1 day after proposal is sent
- **Subsequent follow-ups**: Every 2 days with different content
- **Purpose**: Check if lead has reviewed quote and has questions

### Negotiations Stage

- **Admin notifications**: Sent to assigned admin every 2 days
- **Purpose**: Remind admin to move the deal forward

## Email Templates

All emails include:

- Personalized greeting with lead name
- Project-specific content
- Professional branding with Better Homes Studio
- Contact information and website link
- BCC to contact@celli.co.uk
- Signature: "Kind Regards, Gino @ Better Homes"

## Setup Instructions

### 1. Environment Variables

No additional environment variables are required for the email automation system. The system uses your existing email service configuration.

### 2. Cron Job Setup

The email automation cron job is configured to run multiple times per day to ensure reliable email delivery.

#### Current Cron Jobs (Vercel)

You have 2 cron jobs configured:

1. **Update Aging** (`/api/cron/update-aging`) - Daily at 2 AM
2. **Email Automation** (`/api/cron/email-automation`) - Multiple times per day

#### Recommended Schedule

For the email automation, we recommend running it **3-4 times per day** to ensure emails are sent promptly:

```bash
# Example schedule (adjust based on your needs)
0 8 * * *   # 8 AM - Morning check
0 12 * * *  # 12 PM - Midday check
0 16 * * *  # 4 PM - Afternoon check
0 20 * * *  # 8 PM - Evening check
```

#### Manual Processing

You can also process emails manually through the admin interface at `/admin/email-automation`

### 3. Database Setup

The system automatically creates the required collections when first used. No manual database setup is required.

## Configuration

### Email Timing

The system uses these default intervals:

- **Lead stage**: 2 days between follow-ups
- **Qualified stage**: 2 days between admin notifications
- **Proposal Sent stage**: 1 day for first email, then 2 days
- **Negotiations stage**: 2 days between admin notifications

### Email Limits

- **Lead stage**: Maximum 5 emails (1 intro + 4 follow-ups)
- **Other stages**: No limit, continues until stage changes

## Integration with CRM

### Automatic Integration

The email automation system automatically integrates with your existing CRM:

1. **New leads**: Email automation is automatically initialized when a lead is created
2. **Stage changes**: Automation updates when lead stage changes
3. **Activity logging**: All emails are logged as activities in the lead record
4. **Aging integration**: Automation pauses when lead aging is paused

### Manual Control

You can manually control automation for specific leads:

```javascript
// Pause automation
await pauseEmailAutomation(leadId, "Lead requested to be contacted later");

// Resume automation
await resumeEmailAutomation(leadId);

// Get automation details
const details = await getLeadAutomationDetails(leadId);
```

## Monitoring and Analytics

### Admin Interface

Visit `/admin/email-automation` to:

- View automation statistics
- Process due emails manually
- Monitor email success rates
- See automation rules and configuration

### API Endpoints

- `GET /api/crm/email-automation` - Get automation statistics
- `POST /api/crm/email-automation` - Process due emails
- `GET /api/crm/email-automation/[leadId]` - Get lead automation details
- `POST /api/crm/email-automation/[leadId]` - Control lead automation

### Statistics Available

- Total automations by stage
- Active vs paused automations
- Email success rates by type
- Processing history

## Email Content Customization

### Template Structure

Email templates are located in `libs/crmEmailTemplates.js` and include:

- **HTML version**: Rich formatting with styling
- **Text version**: Plain text fallback
- **Personalization**: Dynamic content based on lead data
- **Responsive design**: Mobile-friendly layouts

### Customizing Content

To modify email content:

1. Edit the template functions in `libs/crmEmailTemplates.js`
2. Update the personalization variables
3. Modify styling in the HTML templates
4. Test with the admin interface

### Personalization Variables

Available variables for personalization:

- `leadData.name` - Lead's name
- `leadData.email` - Lead's email
- `leadData.phone` - Lead's phone
- `leadData.address` - Lead's address
- `leadData.projectTypes` - Array of project types
- `leadData.budget` - Budget range (£, ££, £££, ££££)
- `leadData.value` - Project value
- `leadData.source` - Lead source

## Troubleshooting

### Common Issues

1. **Emails not sending**
   - Check email service configuration
   - Verify CRON_SECRET environment variable
   - Check server logs for errors

2. **Automation not working**
   - Ensure cron job is properly configured
   - Check if leads are in correct stages
   - Verify automation is not paused

3. **Wrong email content**
   - Check lead data completeness
   - Verify template personalization
   - Test with admin interface

### Debugging

Enable detailed logging by checking:

- Server console logs
- Email service logs
- Database automation records
- Lead activity history

### Testing

Use the admin interface to:

- Process emails manually
- View automation details
- Test email templates
- Monitor success rates

## Security Considerations

- **Cron job authentication**: Uses secure token authentication
- **Email BCC**: All emails are BCC'd to contact@celli.co.uk
- **Admin-only access**: All endpoints require admin authentication
- **Rate limiting**: Built-in delays prevent email spam

## Performance

- **Efficient queries**: Uses database indexes for fast lookups
- **Batch processing**: Processes multiple emails efficiently
- **Caching**: Email stats are cached for performance
- **Error handling**: Graceful failure handling prevents system crashes

## Future Enhancements

Potential improvements:

- Email open/click tracking
- A/B testing for email content
- Advanced personalization rules
- Integration with external email services
- Advanced analytics and reporting
- Custom email templates per admin
