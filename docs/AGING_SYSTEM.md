# Lead Aging System

## Overview

The lead aging system tracks how many days have passed since the last contact with each lead. This helps identify leads that need follow-up and ensures no leads fall through the cracks.

## How It Works

### Aging Calculation

- **`agingDays`**: Number of days since last contact
- **`lastContactDate`**: Timestamp of the most recent contact
- **Automatic calculation**: Aging is calculated automatically when leads are saved

### What Resets the Aging Timer

#### ✅ Activities that reset aging:

1. **Adding activities** with contact made:
   - Calls (📞)
   - Emails (📧)
   - Site visits (🏠)
   - Meetings (🤝)
   - Notes (📝) - with "Contact Made" checkbox
   - Attachments (📎) - with "Contact Made" checkbox

2. **Adding notes** (automatically resets aging)

3. **Adding tasks** (automatically resets aging)

4. **Updating lead stage** (moving through pipeline)

#### ❌ Activities that DON'T reset aging:

- Internal notes (without "Contact Made" checkbox)
- Internal tasks
- General lead updates (name, email, etc.)

## Enhanced Contact Tracking

### Contact Made Checkbox

When adding activities, you can now specify whether actual contact was made:

- **Checked**: Contact was made → Resets aging timer
- **Unchecked**: Internal activity → Does NOT reset aging timer

### Visual Indicators

- Activities with contact made show a blue "📞 Contact" badge
- This helps distinguish between actual contact and internal tracking

## Setup and Maintenance

### Automatic Updates (Recommended)

The aging system now runs **automatically** via Vercel Cron jobs. No manual intervention required!

The system is configured to run automatically:

1. **Daily at 2 AM**: Updates all lead aging
2. **Daily at 3 AM**: Checks for overdue payments
3. **Weekdays at 8 AM**: Sends morning brief emails

### Manual Updates (For Testing)

You can still run the update manually for testing:

```bash
npm run update-aging
```

Or trigger via API:

```bash
curl -X GET https://yourdomain.com/api/cron/update-aging
```

### Legacy Cron Job Setup (Alternative)

If you prefer traditional cron jobs, add this to your crontab to run daily at 2 AM:

```bash
# Edit crontab
crontab -e

# Add this line
0 2 * * * cd /path/to/your/project && npm run update-aging >> /var/log/lead-aging.log 2>&1
```

## Aging Statistics

The update script provides statistics:

- Average aging across all leads
- Maximum aging
- Number of leads over 7 days
- Number of leads over 14 days

## Best Practices

1. **Always check "Contact Made"** when you actually speak with or email a lead
2. **Use notes for internal tracking** without checking "Contact Made"
3. **Run the daily update script** to keep aging accurate
4. **Review leads over 7 days** regularly for follow-up
5. **Use the aging filter** in reports to identify stale leads

## Troubleshooting

### Aging Not Updating

- Check if the daily script is running
- Verify the `lastContactDate` field is being updated
- Ensure the lead is active and not archived

### Incorrect Aging

- Run the manual update script: `npm run update-aging`
- Check the activity history for the lead
- Verify the `lastContactDate` timestamp

### Script Errors

- Check the log file: `/var/log/lead-aging.log`
- Verify database connection
- Ensure proper permissions for the script
