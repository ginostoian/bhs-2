# Notification System Documentation

## Overview

The notification system provides real-time alerts for users, employees, and admins across the platform. It supports role-based notifications with different types and priorities.

## Architecture

### Notification Model

The `Notification` model supports:

- **Recipient-based system**: Notifications are sent to specific users, employees, or admins
- **Role-based filtering**: Different notification types for different user roles
- **Priority levels**: urgent, high, medium, low
- **Related entities**: Links to documents, tasks, payments, etc.
- **Metadata**: Additional context for notifications

### Key Components

1. **Notification Model** (`models/Notification.js`)
2. **Notification Service** (`libs/notificationService.js`)
3. **Notification Bell Components**:
   - User: `app/dashboard/components/NotificationBell.js`
   - Admin: `app/admin/components/NotificationBell.js`
   - Employee: `app/employee/components/NotificationBell.js`
4. **API Endpoints**:
   - `GET /api/notifications` - Fetch notifications
   - `POST /api/notifications/mark-read` - Mark as read
   - `POST /api/test-notifications` - Test notifications (admin only)

## Notification Types

### User Notifications

- `document_added` - New document added to project
- `payment_due` - Payment due soon
- `payment_overdue` - Payment is overdue
- `payment_plan_updated` - Payment plan changed
- `project_status_changed` - Project status updated
- `announcement` - General announcements

### Employee Notifications

- `task_assigned` - New task assigned
- `task_status_approved` - Task status update approved
- `task_status_rejected` - Task status update rejected
- `project_updated` - Project details updated
- `document_added` - New document added
- `announcement` - General announcements

### Admin Notifications

- `new_user_registered` - New user registration
- `new_employee_created` - New employee added
- `task_status_update_request` - Employee requested status change
- `payment_received` - Payment received from customer
- `project_completed` - Project marked as completed
- `system_alert` - System-wide alerts

## Usage

### Creating Notifications

Use the notification service functions:

```javascript
import {
  notifyUser,
  notifyAdmins,
  notifyEmployees,
  notifyTaskAssignment,
  notifyPaymentReceived,
} from "@/libs/notificationService";

// Notify specific user
await notifyUser(userId, {
  type: "task_assigned",
  title: "New Task Assigned",
  message: "You have been assigned a new task",
  priority: "high",
});

// Notify all admins
await notifyAdmins({
  type: "new_user_registered",
  title: "New User Registration",
  message: "A new user has registered",
  priority: "medium",
});

// Use predefined templates
await notifyTaskAssignment(employeeId, taskData);
await notifyPaymentReceived(paymentData);
```

### Notification Templates

The service provides templates for common events:

- `notifyUserRegistration(userData)` - New user registration
- `notifyEmployeeCreation(employeeData)` - New employee added
- `notifyTaskAssignment(employeeId, taskData)` - Task assigned
- `notifyTaskStatusUpdateRequest(taskData, employeeData)` - Status update requested
- `notifyTaskStatusApproved(employeeId, taskData)` - Status approved
- `notifyTaskStatusRejected(employeeId, taskData, reason)` - Status rejected
- `notifyPaymentReceived(paymentData)` - Payment received
- `notifyProjectCompleted(projectData)` - Project completed
- `notifyDocumentAdded(userId, documentData)` - Document added
- `notifyPaymentDue(userId, paymentData)` - Payment due
- `notifyPaymentOverdue(userId, paymentData)` - Payment overdue
- `notifySystemAlert(message, priority)` - System alert

### Integration Points

The notification system is integrated into:

1. **Task Management**:

   - Task status update requests notify admins
   - Status approvals/rejections notify employees

2. **Employee Management**:

   - Employee creation notifies admins

3. **Payment Processing**:

   - Payment webhooks notify admins of received payments

4. **Document Management**:

   - Document uploads notify users

5. **User Registration**:
   - New user registrations notify admins

## Frontend Components

### Notification Bell

Each role has a customized notification bell:

- **Real-time polling**: Updates every 3-5 minutes
- **Role-specific icons**: Different icons for different notification types
- **Priority indicators**: Color-coded borders for priority levels
- **Mark as read**: Individual and bulk mark as read functionality
- **Responsive design**: Works on desktop and mobile

### Features

- **Live updates**: Polls for new notifications when tab is visible
- **Performance optimized**: Stops polling when tab is hidden
- **Unread count**: Shows badge with unread notification count
- **Priority colors**: Visual indicators for notification importance
- **Time formatting**: Smart time display (just now, hours ago, etc.)

## Testing

### Test Page

Admins can test the notification system at `/admin/test-notifications`:

- Test user registration notifications
- Test employee creation notifications
- Test task assignment notifications
- Test system alerts

### Manual Testing

1. Create a notification using the test page
2. Check the notification bell in the header
3. Verify the notification appears with correct styling
4. Test mark as read functionality
5. Verify unread count updates

## Configuration

### Polling Intervals

- **Users**: 5 minutes (only for active projects)
- **Employees**: 5 minutes
- **Admins**: 5 minutes

### Priority Colors

- **urgent**: Red border
- **high**: Orange border
- **medium**: Blue border
- **low**: Gray border

## Best Practices

1. **Use appropriate priorities**: Don't overuse "urgent" priority
2. **Keep messages concise**: Notifications should be brief and actionable
3. **Include relevant context**: Use metadata for additional information
4. **Handle failures gracefully**: Don't fail main operations if notifications fail
5. **Test notifications**: Use the test page to verify functionality

## Troubleshooting

### Common Issues

1. **Notifications not appearing**:

   - Check user role and recipient type
   - Verify notification service is working
   - Check browser console for errors

2. **Polling not working**:

   - Ensure tab is visible
   - Check network connectivity
   - Verify API endpoints are accessible

3. **Mark as read not working**:
   - Check user authentication
   - Verify notification ownership
   - Check API response for errors

### Debugging

1. Check browser console for JavaScript errors
2. Verify API responses in Network tab
3. Check server logs for notification creation errors
4. Use the test page to verify system functionality

## Future Enhancements

1. **Push notifications**: Browser push notifications
2. **Email integration**: Email notifications for important events
3. **Notification preferences**: User-configurable notification settings
4. **Bulk operations**: Bulk mark as read, delete, etc.
5. **Notification history**: Full notification history page
6. **Real-time updates**: WebSocket-based real-time notifications
