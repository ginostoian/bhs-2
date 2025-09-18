# Designer Role Implementation

This document describes the implementation of the Designer role in the BHS application, which provides limited access to moodboards and products management.

## Overview

The Designer role is a new user type that has access to:

- **Moodboards**: Create, view, edit, and manage moodboards for client projects
- **Products**: View, add, edit, and manage products in the global catalog
- **No access** to other admin functions like user management, CRM, invoicing, etc.

## Implementation Details

### 1. User Model Updates

**File**: `models/User.js`

- Added `"designer"` to the role enum: `["user", "admin", "employee", "designer"]`
- Updated role description to include designer access information

### 2. Designer Model

**File**: `models/Designer.js`

- New model specifically for designer accounts
- Includes designer-specific fields:
  - `specializations`: Array of design specializations
  - `experienceLevel`: junior, mid, senior, lead
  - `portfolioUrl`: Optional portfolio link
  - `availability`: available, busy, unavailable
- Always has role set to "designer"

### 3. Middleware Updates

**File**: `middleware.js`

- Added designer route protection: `/designer/*`
- Designers are redirected to sign-in if not authenticated
- Added designer routes to middleware matcher

### 4. Authentication & Authorization

**File**: `libs/requireDesigner.js`

- `requireDesigner()`: Requires designer role for API access
- `requireDesignerOrAdmin()`: Allows both designer and admin access

### 5. Designer Routes

#### Main Dashboard

- **Route**: `/designer`
- **File**: `app/designer/page.js`
- **Features**: Overview of designer's accessible features, recent moodboards, recent products

#### Moodboards Management

- **Route**: `/designer/moodboards`
- **File**: `app/designer/moodboards/page.js`
- **Features**:
  - View all moodboards
  - Create new moodboards
  - Filter by status, user, search
  - Delete moodboards

#### Individual Moodboard

- **Route**: `/designer/moodboards/[id]`
- **File**: `app/designer/moodboards/[id]/page.js`
- **Features**:
  - View moodboard details
  - Manage sections
  - Add/remove products
  - Edit section information

#### Products Management

- **Route**: `/designer/products`
- **File**: `app/designer/products/page.js`
- **Features**:
  - View all products
  - Add new products
  - Edit existing products
  - Delete products
  - Filter by category, supplier, status
  - Search products

### 6. API Updates

#### Moodboards API

- **File**: `app/api/moodboards/route.js`
- Updated to allow designer access for GET and POST operations
- Designers can create and view moodboards

#### Individual Moodboard API

- **File**: `app/api/moodboards/[id]/route.js`
- Updated PUT and DELETE operations to allow designer access
- Designers can update and delete moodboards

#### Products API

- **File**: `app/api/products/route.js`
- Updated POST operation to allow designer access
- Designers can create products

#### Individual Product API

- **File**: `app/api/products/[id]/route.js`
- Updated PUT and DELETE operations to allow designer access
- Designers can update and delete products

### 7. UI Components

#### Layout

- **File**: `app/designer/layout.js`
- Designer-specific layout with sidebar navigation
- Role verification and redirect logic

#### Sidebar

- **File**: `app/designer/components/DesignerSidebar.js`
- Navigation for designer-accessible features only
- Purple color scheme to distinguish from admin

#### Moodboard Components

- `DesignerMoodboardsClient.js`: Main moodboards management
- `CreateMoodboardModal.js`: Create new moodboards
- `DesignerMoodboardManager.js`: Individual moodboard management
- `SectionManager.js`: Section management within moodboards
- `ProductCard.js`: Product display in moodboards
- `AddSectionModal.js`: Add/edit sections
- `AddProductModal.js`: Add products to sections

#### Product Components

- `DesignerProductsClient.js`: Main products management
- `ProductForm.js`: Create/edit products

## Access Control

### What Designers CAN Access:

- ✅ Moodboards (create, view, edit, delete)
- ✅ Products (create, view, edit, delete)
- ✅ Designer dashboard
- ✅ All moodboard sections and products
- ✅ Product categories and suppliers

### What Designers CANNOT Access:

- ❌ Admin dashboard (`/admin`)
- ❌ Employee dashboard (`/employee`)
- ❌ User management
- ❌ CRM features
- ❌ Invoicing
- ❌ Reports
- ❌ Email automation
- ❌ Any other admin-only features

## Usage

### Creating a Designer User

1. **Via Database** (for testing):

```javascript
// Update existing user to designer role
db.users.updateOne(
  { email: "designer@example.com" },
  { $set: { role: "designer" } },
);
```

2. **Via Application**:

- Admin users can update user roles through the admin interface
- New users can be assigned designer role during creation

### Designer Workflow

1. **Sign In**: Designer signs in with their credentials
2. **Dashboard**: View overview of accessible features
3. **Moodboards**: Create and manage moodboards for client projects
4. **Products**: Manage the product catalog
5. **Collaboration**: Work with clients on moodboard approvals

## Testing

### Test Script

Run the test script to verify implementation:

```bash
node scripts/test-designer-role.js
```

### Manual Testing

1. Create a user with designer role
2. Sign in as designer
3. Verify access to `/designer` routes
4. Verify no access to `/admin` routes
5. Test moodboard creation and management
6. Test product management
7. Verify all CRUD operations work correctly

## Security Considerations

- Designer role is properly validated in middleware
- API routes check for designer role before allowing access
- No access to sensitive admin functions
- All designer actions are logged and auditable
- Role-based access control is enforced at multiple levels

## Future Enhancements

Potential improvements for the designer role:

- Designer-specific notifications
- Client communication features
- Portfolio management
- Project templates
- Advanced filtering and search
- Bulk operations
- Designer analytics and reporting

## Troubleshooting

### Common Issues

1. **Designer cannot access routes**:
   - Check if user role is set to "designer"
   - Verify middleware configuration
   - Check authentication status

2. **API access denied**:
   - Verify API routes are updated for designer access
   - Check requireDesigner utility functions

3. **Missing components**:
   - Ensure all designer components are created
   - Check import paths and file locations

### Debug Steps

1. Check user role in database
2. Verify middleware is running
3. Check browser console for errors
4. Verify API responses
5. Check server logs for authentication issues
