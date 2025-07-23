# Lead Aging Pause Feature

## Overview

The Lead Aging Pause feature allows administrators to temporarily pause the aging timer for specific leads. This is useful for leads that have asked to be contacted in a few months, or for leads that are in "Won" or "Lost" stages where aging tracking is no longer needed.

## How It Works

### Aging Pause State

When aging is paused for a lead:

- **`agingPaused`**: Boolean flag indicating if aging is paused
- **`agingPausedAt`**: Timestamp when aging was paused
- **`agingPausedReason`**: Optional reason for pausing aging
- **`agingDays`**: Remains frozen at the value when paused

### What Happens When Aging is Paused

1. **Aging timer stops**: The lead's aging days will not increase
2. **Excluded from aging reports**: Paused leads won't appear in aging alerts or reports
3. **Visual indicators**: Paused leads show a pause icon (⏸️) in the UI
4. **Reason tracking**: Optional reason is stored for audit purposes

### What Happens When Aging is Resumed

1. **Aging timer resets**: Aging days is set to 0
2. **Last contact date updated**: Set to current time
3. **Normal aging resumes**: Aging will start counting from the resume date
4. **Included in reports**: Lead will appear in aging reports again

## User Interface

### Lead Cards

In the CRM kanban board, each lead card shows:

- **Aging display**: Shows current aging days with pause icon if paused
- **Pause/Resume button**: Small button (⏸️/▶️) next to aging display
- **Status indicator**: "Paused" or "Aging" label below the number

### Lead Detail Modal

In the lead detail view:

- **Aging section**: Shows aging information with pause status
- **Pause/Resume button**: Larger button with clear text
- **Reason display**: Shows pause reason if provided
- **Status indicator**: Clear visual indication of pause state

## API Endpoints

### Toggle Aging Pause

**POST** `/api/crm/leads/[id]/aging-pause`

**Request Body:**

```json
{
  "reason": "Optional reason for pausing"
}
```

**Response:**

```json
{
  "success": true,
  "lead": {
    "id": "lead_id",
    "agingPaused": true,
    "agingPausedAt": "2024-01-15T10:30:00Z",
    "agingPausedReason": "Customer asked to call back in 3 months",
    "agingDays": 5
  },
  "message": "Aging timer paused successfully"
}
```

## Database Schema Changes

The Lead model has been extended with new fields:

```javascript
// New fields in Lead schema
agingPaused: {
  type: Boolean,
  default: false,
},
agingPausedAt: {
  type: Date,
},
agingPausedReason: {
  type: String,
  trim: true,
},
```

## Updated Queries

All aging-related queries now exclude paused leads:

### Aging Leads Query

```javascript
// Before
Lead.find({
  agingDays: { $gte: 2 },
  stage: { $nin: ["Won", "Lost"] },
  isActive: true,
  isArchived: false,
});

// After
Lead.find({
  agingDays: { $gte: 2 },
  stage: { $nin: ["Won", "Lost"] },
  isActive: true,
  isArchived: false,
  agingPaused: false, // Exclude paused leads
});
```

### Aging Update Scripts

The daily aging update scripts now skip paused leads:

```javascript
for (const lead of leads) {
  // Skip leads with paused aging
  if (lead.agingPaused) {
    continue;
  }
  // ... rest of aging update logic
}
```

## Use Cases

### 1. Customer Requests Delay

- **Scenario**: Customer asks to be contacted in 3 months
- **Action**: Pause aging with reason "Customer requested 3-month delay"
- **Benefit**: Lead won't appear in aging alerts until ready to contact

### 2. Won/Lost Leads

- **Scenario**: Lead is marked as Won or Lost
- **Action**: Pause aging (though this is optional since these stages are already excluded)
- **Benefit**: Ensures no aging tracking for completed leads

### 3. Temporary Hold

- **Scenario**: Lead is temporarily on hold due to external factors
- **Action**: Pause aging with appropriate reason
- **Benefit**: Prevents unnecessary aging alerts during hold period

## Testing

Run the test script to verify functionality:

```bash
node scripts/test-aging-pause.js
```

This script will:

1. Test pausing aging for a lead
2. Verify aging doesn't update when paused
3. Test resuming aging
4. Verify aging updates when resumed
5. Test that paused leads are excluded from aging queries

## Migration

Existing leads will have:

- `agingPaused`: `false` (default)
- `agingPausedAt`: `null`
- `agingPausedReason`: `null`

No migration script is needed as these fields have default values.

## Best Practices

1. **Use descriptive reasons**: When pausing aging, provide a clear reason
2. **Regular review**: Periodically review paused leads to ensure they're still relevant
3. **Resume when ready**: Resume aging when ready to re-engage with the lead
4. **Document decisions**: Use the reason field to document why aging was paused

## Troubleshooting

### Aging Still Updates When Paused

- Check that the `agingPaused` field is set to `true`
- Verify the pre-save middleware is working correctly
- Check that the aging update scripts are respecting the pause state

### Paused Lead Appears in Aging Reports

- Verify that aging queries include `agingPaused: false`
- Check that the lead's pause state is correctly set
- Ensure all aging-related endpoints have been updated

### Button Not Working

- Check browser console for JavaScript errors
- Verify the API endpoint is accessible
- Ensure proper authentication (admin role required)
