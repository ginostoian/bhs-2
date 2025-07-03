# Payment System Documentation

## Overview

The payment system allows administrators to create and manage payment schedules for users, with automatic status updates based on due dates.

## Features

- **Payment Management**: Create, edit, and delete payments for users
- **Automatic Status Updates**: Payments automatically change from "Scheduled" to "Due" on their due date
- **Drag & Drop Reordering**: Reorder payments in the admin interface
- **User Dashboard**: Users can view their payment schedule
- **Admin Dashboard**: Comprehensive payment management for all users

## Payment Statuses

- **Scheduled**: Payment is scheduled for a future date
- **Due**: Payment is due today or overdue
- **Paid**: Payment has been marked as paid

## Database Schema

### Payment Model

```javascript
{
  user: ObjectId,           // Reference to User
  paymentNumber: Number,    // Auto-incremented per user
  name: String,            // Payment name (e.g., "1st Instalment")
  dueDate: Date,           // When payment is due
  status: String,          // "Scheduled", "Due", or "Paid"
  order: Number,           // For drag-and-drop reordering
  createdAt: Date,
  updatedAt: Date
}
```

## API Endpoints

### GET /api/payments

- **Purpose**: Get payments for authenticated user
- **Query Parameters**: `status` (optional filter)
- **Response**: Array of payment objects

### POST /api/payments

- **Purpose**: Create new payment (admin only)
- **Body**: `{ userId, name, dueDate, status }`
- **Response**: Created payment object

### GET /api/payments/[id]

- **Purpose**: Get specific payment
- **Response**: Payment object

### PUT /api/payments/[id]

- **Purpose**: Update payment (admin only)
- **Body**: `{ name?, dueDate?, status? }`
- **Response**: Updated payment object

### DELETE /api/payments/[id]

- **Purpose**: Delete payment (admin only)
- **Response**: Success message

### PATCH /api/payments/[id]

- **Purpose**: Reorder payment (admin only)
- **Body**: `{ newOrder }`
- **Response**: Success message

### GET/POST /api/payments/update-statuses

- **Purpose**: Update all payment statuses based on due dates
- **Response**: Status update summary

## User Interface

### User Dashboard

- **Path**: `/dashboard/payments`
- **Features**: View payment schedule with status badges
- **Columns**: Payment #, Payment Name, Due Date, Status

### Admin Dashboard

- **Path**: `/admin/payments`
- **Features**:
  - View all payments for all users
  - Create new payments
  - Edit existing payments
  - Delete payments
  - Drag and drop reordering
  - Payment statistics

## Automatic Status Updates

The system automatically updates payment statuses based on due dates:

1. **Scheduled → Due**: When the due date arrives
2. **Due → Paid**: Only when manually set by admin
3. **Paid**: Remains paid regardless of date

### Manual Status Update

Call the status update endpoint:

```bash
curl -X GET https://yourdomain.com/api/payments/update-statuses
```

### Automated Updates

Set up a cron job to call this endpoint daily:

```bash
# Example cron job (runs daily at 2 AM)
0 2 * * * curl -X POST https://yourdomain.com/api/payments/update-statuses
```

## Usage Examples

### Creating a Payment (Admin)

1. Navigate to `/admin/payments`
2. Click "Add Payment"
3. Select user from dropdown
4. Enter payment name (e.g., "1st Instalment")
5. Set due date
6. Choose initial status
7. Click "Create"

### Editing a Payment (Admin)

1. Navigate to `/admin/payments`
2. Click "Edit" on the payment row
3. Modify name, due date, or status
4. Click "Update"

### Reordering Payments (Admin)

1. Navigate to `/admin/payments`
2. Drag and drop payment rows to reorder
3. Changes are automatically saved

### Viewing Payments (User)

1. Navigate to `/dashboard/payments`
2. View payment schedule with current statuses
3. Status badges show payment state

## Status Badge Colors

- **Scheduled**: Blue (`bg-blue-100 text-blue-800`)
- **Due**: Yellow (`bg-yellow-100 text-yellow-800`)
- **Paid**: Green (`bg-green-100 text-green-800`)

## Error Handling

The system includes comprehensive error handling:

- Validation of required fields
- Admin-only access controls
- Graceful handling of database errors
- User-friendly error messages via modals

## Security

- All payment operations require authentication
- Admin operations require admin role
- Users can only view their own payments
- Input validation on all endpoints

## Testing

Run the test script to verify the payment system:

```bash
node scripts/test-payments.js
```

## Dependencies

- `react-beautiful-dnd`: For drag-and-drop functionality
- `@types/react-beautiful-dnd`: TypeScript types
- MongoDB: Database storage
- Mongoose: ODM for MongoDB

## Future Enhancements

- Email notifications for due payments
- Payment reminders
- Integration with payment gateways
- Payment history tracking
- Bulk payment operations
- Payment templates
