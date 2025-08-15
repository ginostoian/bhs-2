# CRM Archive Feature

## Overview

The CRM system now includes an archive feature that allows administrators to move completed or inactive leads to a "Finished" column, keeping the main kanban board clean while maintaining access to historical data.

## Features

### 1. Archive Lead

- **Location**: Each lead card now includes an "Archive" button below the stage dropdown
- **Functionality**: Clicking the archive button moves the lead to the "Finished" column
- **API Endpoint**: `POST /api/crm/leads/[id]/archive`

### 2. Finished Column

- **Location**: Added as a new column to the right of the existing CRM stages
- **Content**: Displays all archived leads
- **Styling**: Gray-themed column to distinguish it from active leads
- **Counter**: Shows the total number of archived leads

### 3. Collapsible Design

- **Toggle Button**: Click the arrow button (▶️/🔽) to collapse/expand the Finished column
- **State Persistence**: The collapsed state is maintained during the session
- **Visual Feedback**: Collapsed column shows reduced opacity and hides content
- **Space Saving**: When collapsed, the column takes minimal space on the page

### 4. Archived Lead Cards

- **Visual Design**: Gray-themed cards with archive-specific styling
- **Archive Information**: Shows when and by whom the lead was archived
- **Smart Date Formatting**: Displays relative time (e.g., "2 days ago", "3 weeks ago")
- **Unarchive Button**: Allows leads to be moved back to active status
- **Full Functionality**: Archived leads can still be viewed, edited, and managed

### 5. Unarchive Lead

- **Functionality**: Click the "Unarchive" button to restore a lead to active status
- **API Endpoint**: `DELETE /api/crm/leads/[id]/archive`
- **State Management**: Lead is automatically moved back to the appropriate stage column

## Technical Implementation

### API Endpoints

- `POST /api/crm/leads/[id]/archive` - Archive a lead
- `DELETE /api/crm/leads/[id]/archive` - Unarchive a lead
- `GET /api/crm/leads/archived` - Fetch archived leads

### Database Schema

The Lead model includes:

- `isArchived`: Boolean flag indicating archive status
- `archivedAt`: Timestamp when the lead was archived
- `archivedBy`: Reference to the user who archived the lead

### State Management

- `archivedLeads`: Array of archived leads
- `isFinishedColumnCollapsed`: Boolean for column collapse state
- Automatic synchronization between active and archived lead arrays

### Components

- `ArchivedLeadCard.js`: Specialized component for archived leads
- Updated `LeadCard.js`: Added archive button
- Updated `CRM page.js`: Integrated archive functionality

## Usage Instructions

### Archiving a Lead

1. Navigate to the CRM dashboard
2. Find the lead you want to archive
3. Click the "Archive" button below the stage dropdown
4. The lead will move to the "Finished" column

### Viewing Archived Leads

1. The "Finished" column is visible on the right side of the CRM board
2. Click the arrow button to expand/collapse the column
3. Archived leads are displayed with archive information

### Unarchiving a Lead

1. In the "Finished" column, find the lead you want to restore
2. Click the "Unarchive" button
3. The lead will return to its previous stage in the active columns

### Managing Archived Leads

- Archived leads can still be clicked to view full details
- All lead information is preserved during archiving
- Email automation status and other features remain intact

## Benefits

1. **Cleaner Interface**: Main kanban board focuses on active leads
2. **Historical Data**: Easy access to completed or inactive leads
3. **Space Efficiency**: Collapsible design prevents page overcrowding
4. **Reversibility**: Leads can be easily restored if needed
5. **Audit Trail**: Tracks when and by whom leads were archived

## Future Enhancements

- Bulk archive/unarchive operations
- Archive reason tracking
- Archive date filtering
- Export archived leads
- Archive statistics and reporting

