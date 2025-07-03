# Notification System

This document describes the notification system implemented for the Better Homes Studio dashboard.

## Overview

The notification system provides real-time alerts to users about important events related to their projects, payments, and documents. Users can view notifications through a bell icon in the dashboard header.

## Features

- **Real-time notifications** with polling every 30 seconds
- **Multiple notification types** (documents, payments, project status, announcements)
- **Priority levels** (low, medium, high, urgent)
- **Read/unread status** management
- **Mark all as read** functionality
- **Responsive dropdown** interface
- **Automatic notification creation** from system events

## Notification Types

### 1. Document Added (`document_added`)

- **Triggered when**: Admin adds quotes, invoices, photos, or comments
- **Priority**: Medium
- **Icon**: FileText (blue)
- **Example**: "New Quote Added - A new quote has been added to your project."

### 2. Payment Due (`payment_due`)

- **Triggered when**: Payment is due within 7 days
- **Priority**: High
- **Icon**: CreditCard (orange)
- **Example**: "Payment Due Soon - Payment 'Deposit' is due in 3 days."

### 3. Payment Overdue (`payment_overdue`)

- **Triggered when**: Payment is past due date
- **Priority**: Urgent
- **Icon**: CreditCard (orange)
- **Example**: "Payment Overdue - Payment 'Final Payment' is overdue. Please contact us."

### 4. Payment Plan Updated (`payment_plan_updated`)

- **Triggered when**: Admin creates, updates, or deletes payment plans
- **Priority**: Medium
- **Icon**: CreditCard (green)
- **Example**: "Payment Plan Updated - Your payment plan has been modified."

### 5. Project Status Changed (`project_status_changed`)

- **Triggered when**: Project status is updated
- **Priority**: Medium
- **Icon**: AlertCircle (purple)
- **Example**: "Project Status Updated - Your project status has changed from 'Planning' to 'In Progress'."

### 6. Announcement (`announcement`)

- **Triggered when**: System-wide announcements are made
- **Priority**: Configurable (default: medium)
- **Icon**: AlertCircle (red)
- **Example**: "System Maintenance - Scheduled maintenance on Sunday 2-4 AM."

## Database Schema

### Notification Model

```javascript
{
  user: ObjectId,           // Reference to user
  type: String,             // Notification type
  title: String,            // Notification title
  message: String,          // Detailed message
  isRead: Boolean,          // Read status
  relatedId: ObjectId,      // Related document/payment ID
  relatedModel: String,     // Model name for related document
  metadata: Object,         // Additional data
  priority: String,         // Priority level
  createdAt: Date,          // Creation timestamp
  updatedAt: Date           // Last update timestamp
}
```

## API Endpoints

### GET /api/notifications

Fetch user's notifications with pagination and filtering.

**Query Parameters:**

- `limit` (number): Number of notifications to return (default: 20)
- `offset` (number): Number of notifications to skip (default: 0)
- `unread` (boolean): Filter to unread notifications only

**Response:**

```json
{
  "notifications": [...],
  "pagination": {
    "total": 50,
    "limit": 20,
    "offset": 0,
    "hasMore": true
  },
  "unreadCount": 5
}
```

### POST /api/notifications

Create a new notification (admin only).

**Request Body:**

```json
{
  "userId": "user_id",
  "type": "document_added",
  "title": "New Quote Added",
  "message": "A new quote has been added to your project.",
  "relatedId": "document_id",
  "relatedModel": "Document",
  "priority": "medium",
  "metadata": {}
}
```

### POST /api/notifications/mark-read

Mark notifications as read.

**Request Body:**

```json
{
  "notificationIds": ["id1", "id2"], // Specific notifications
  "markAll": true // Or mark all as read
}
```

### POST /api/cron/check-overdue-payments

Cron job endpoint to check for overdue payments and create notifications automatically.

## Integration Points

### Automatic Notification Creation

The system automatically creates notifications when:

1. **Documents are added** (`/api/documents` POST)
2. **Payments are created** (`/api/payments` POST)
3. **Payments become overdue** (cron job)

### Manual Notification Creation

Admins can create custom notifications through:

- Admin notification testing page (`/admin/notifications`)
- Direct API calls to `/api/notifications`

## UI Components

### NotificationBell Component

Located at `app/dashboard/components/NotificationBell.js`

**Features:**

- Bell icon with unread count badge
- Dropdown with notification list
- Mark individual notifications as read
- Mark all notifications as read
- Real-time updates (30-second polling)
- Responsive design

**Usage:**

```jsx
import NotificationBell from "./components/NotificationBell";

// In dashboard layout
<NotificationBell />;
```

## Utility Functions

### Notification Helpers

Located at `libs/notifications.js`

**Available Functions:**

- `notifyDocumentAdded(userId, type, name, id)`
- `notifyPaymentDue(userId, name, dueDate, id, isOverdue)`
- `notifyPaymentPlanUpdated(userId, name, id, changeType)`
- `notifyProjectStatusChanged(userId, oldStatus, newStatus, projectId)`
- `notifyAnnouncement(userId, title, message, priority)`

## Setup and Configuration

### 1. Database Setup

The Notification model is automatically created when the application starts.

### 2. Cron Job Setup

To enable automatic overdue payment notifications, set up a cron job to call:

```
POST /api/cron/check-overdue-payments
```

**Recommended schedule:** Daily at 9 AM

**Example with Vercel Cron:**

```json
{
  "crons": [
    {
      "path": "/api/cron/check-overdue-payments",
      "schedule": "0 9 * * *"
    }
  ]
}
```

### 3. Environment Variables

No additional environment variables are required for basic functionality.

For enhanced security, consider adding:

```
CRON_SECRET=your-secret-key
```

## Testing

### Admin Testing Interface

Visit `/admin/notifications` to test notification creation with:

- Quick test buttons for each notification type
- Custom notification form
- Real-time result display

### Manual Testing

1. Create a test user
2. Add documents or payments for the user
3. Check the user's dashboard for notifications
4. Test mark as read functionality

## Future Enhancements

### Planned Features

1. **Email notifications** - Send email alerts for urgent notifications
2. **Push notifications** - Browser push notifications
3. **Notification preferences** - User-configurable notification settings
4. **Notification history** - Full notification history page
5. **Bulk actions** - Delete multiple notifications
6. **Notification templates** - Predefined notification templates

### Technical Improvements

1. **WebSocket support** - Real-time notifications without polling
2. **Notification queuing** - Handle high-volume notification creation
3. **Notification analytics** - Track notification engagement
4. **Mobile app support** - Native mobile notifications

## Troubleshooting

### Common Issues

1. **Notifications not appearing**

   - Check user authentication
   - Verify notification creation in database
   - Check browser console for errors

2. **Cron job not working**

   - Verify cron service is properly configured
   - Check server logs for errors
   - Test endpoint manually

3. **Performance issues**
   - Consider pagination for large notification lists
   - Implement notification cleanup for old notifications
   - Optimize database queries with proper indexing

### Debug Mode

Enable debug logging by setting:

```javascript
console.log("Notification debug:", notificationData);
```

## Security Considerations

1. **Admin-only creation** - Only admins can create notifications
2. **User isolation** - Users can only see their own notifications
3. **Input validation** - All notification data is validated
4. **Rate limiting** - Consider implementing rate limiting for notification creation

## Performance Notes

1. **Polling interval** - 30 seconds provides good balance between real-time updates and server load
2. **Database indexing** - Proper indexes on user, isRead, and createdAt fields
3. **Pagination** - Default limit of 20 notifications per request
4. **Cleanup** - Consider archiving old notifications after 90 days
