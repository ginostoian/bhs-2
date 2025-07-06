# Task Status Update System

## Overview

The task status update system allows employees to request status changes for their assigned tasks, which require admin approval before taking effect.

## Workflow

### 1. Employee Requests Status Change

- Employee selects a new status from the dropdown
- System validates the request
- Status update request is created with "pending" status
- Admin is notified of the request

### 2. Admin Reviews Request

- Admin sees pending requests in the task status updates page
- Admin can approve or reject the request
- If approved, task status is updated
- Employee is notified of the decision

### 3. Status Update Rules

#### Valid Status Transitions

- **Scheduled** → **In Progress** (requires approval)
- **Scheduled** → **Blocked** (requires approval)
- **In Progress** → **Done** (requires approval)
- **In Progress** → **Blocked** (requires approval)
- **Blocked** → **In Progress** (requires approval)
- **Done** → **In Progress** (requires approval)

#### Prevention Rules

- **Same Status**: Cannot request to change to the same status
- **Pending Request**: Cannot submit new request if one is already pending
- **Task Assignment**: Only assigned employee can request status changes

## User Experience

### For Employees

- **Status Dropdown**: Shows current task status
- **Change Detection**: Only sends request if status actually changes
- **Notes Modal**: Clean interface to add context for admin review
- **Success Modal**: Clear confirmation explaining request is pending approval
- **Pending Indicator**: Shows when request is pending approval
- **Silent Handling**: No error message for same-status selections

### For Admins

- **Notification**: Real-time notification when request is submitted
- **Review Page**: Dedicated page to review all pending requests
- **Approve/Reject**: Can approve or reject with optional notes
- **Task Update**: Approved requests automatically update task status

## API Endpoints

### Submit Status Update Request

```
POST /api/employee/tasks/[taskId]/status-update
```

**Request Body:**

```json
{
  "status": "In Progress",
  "notes": "Optional employee notes"
}
```

**Response:**

```json
{
  "message": "Status update request submitted for admin approval",
  "statusUpdate": { ... }
}
```

### Review Status Update Request

```
POST /api/admin/task-status-updates
```

**Request Body:**

```json
{
  "requestId": "request_id",
  "action": "approve|reject",
  "adminNotes": "Optional admin notes"
}
```

## Error Handling

### Common Error Scenarios

1. **Same Status Request**

   - Error: "The requested status is the same as the current status. No update needed."
   - Handling: Silently ignored, no user notification

2. **Pending Request Exists**

   - Error: "You already have a pending status update request for this task"
   - Handling: User must wait for admin decision

3. **Unauthorized Task**

   - Error: "You can only update tasks assigned to you"
   - Handling: Employee can only update their own tasks

4. **Invalid Status**
   - Error: "Invalid status"
   - Handling: Only predefined statuses are allowed

## Best Practices

### For Employees

1. **Check Current Status**: Verify current status before requesting change
2. **Use Notes**: Add context when requesting status changes
3. **Wait for Approval**: Don't assume immediate status change
4. **Monitor Requests**: Check for pending requests before submitting new ones

### For Admins

1. **Review Promptly**: Process requests in a timely manner
2. **Add Context**: Use admin notes to explain decisions
3. **Monitor Notifications**: Check notification bell for new requests
4. **Consistent Decisions**: Apply consistent approval criteria

## Technical Implementation

### Frontend Validation

- Prevents API calls for same-status changes
- Shows pending request indicators
- Handles errors gracefully
- Provides clear user feedback with modals
- Explains approval workflow to employees

### Backend Validation

- Validates status transitions
- Prevents duplicate requests
- Ensures proper authorization
- Sends notifications

### Database Schema

- `TaskStatusUpdate` model tracks all requests
- Links to `Task` and `Employee` models
- Includes approval workflow fields
- Maintains audit trail

## Troubleshooting

### Common Issues

1. **Status Not Updating**

   - Check if request is pending approval
   - Verify admin has processed the request
   - Ensure employee has proper permissions

2. **Cannot Submit Request**

   - Check for existing pending request
   - Verify task assignment
   - Ensure status is different from current

3. **Admin Not Seeing Requests**
   - Check notification settings
   - Verify admin role permissions
   - Refresh the task status updates page

### Debug Steps

1. Check browser console for errors
2. Verify API responses in Network tab
3. Check database for pending requests
4. Verify notification delivery
5. Test with different status combinations
