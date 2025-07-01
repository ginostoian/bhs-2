# Better Homes Studio - Authentication System

A complete authentication and user management system for the Better Homes Studio website.

## Features

- **User Authentication**: Google OAuth and email-based authentication
- **Role-Based Access Control**: User and Admin roles
- **Document Management**: Quotes, invoices, comments, and photos
- **Dashboard**: User dashboard with tabs for different document types
- **Admin Panel**: User management and document creation
- **Protected Routes**: Middleware-based route protection

## Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
# MongoDB
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_SECRET=your_random_secret_key
NEXTAUTH_URL=http://localhost:3000

# Google OAuth (optional)
GOOGLE_ID=your_google_client_id
GOOGLE_SECRET=your_google_client_secret

# Email Provider (optional)
EMAIL_SERVER=smtp://username:password@smtp.example.com:587
```

### 2. Create First Admin User

After setting up the authentication system, you need to create the first admin user. You have two options:

#### Option A: Using the Bootstrap Script (Recommended)

1. **Edit the script** to set your email:

   ```bash
   # Open scripts/create-admin.js and change the EMAIL variable
   const EMAIL = "your-email@example.com";
   ```

2. **Run the bootstrap script**:

   ```bash
   npm run create-admin
   ```

3. **Sign in** at `/api/auth/signin` with your email

#### Option B: Manual Database Update

1. **Sign up normally** using Google OAuth or email authentication
2. **Connect to your MongoDB database** (using MongoDB Compass or shell)
3. **Run this command** to promote your user to admin:

```javascript
db.users.updateOne(
  { email: "your-email@example.com" },
  { $set: { role: "admin" } },
);
```

Replace `your-email@example.com` with the email you used to sign up.

#### Creating Additional Admins

Once you have at least one admin, you can create additional admin accounts through the admin panel:

1. **Go to `/admin`** (admin only)
2. **Use the "Create New User" form**
3. **Select "Admin" role** from the dropdown
4. **Submit the form**

### 3. Testing the System

1. **Start the development server**:

   ```bash
   npm run dev
   ```

2. **Test user registration**:

   - Visit `/api/auth/signin` to sign up/sign in
   - Regular users will be redirected to `/dashboard`

3. **Test admin access**:

   - After promoting your user to admin, visit `/admin`
   - You should see the admin dashboard with user management

4. **Test document creation**:
   - As admin: Go to `/admin/add-document` to create documents for users
   - As user: Go to `/dashboard/request-quote` to request quotes

## API Endpoints

### User Management (Admin Only)

- `GET /api/users` - List all users
- `POST /api/users` - Create new user
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Document Management

- `POST /api/documents` - Create document (Admin only)
- `GET /api/documents/user` - Get user's documents
- `POST /api/documents/user` - Create document for current user

## File Structure

```
app/
├── api/
│   ├── users/
│   │   ├── route.js
│   │   └── [id]/route.js
│   └── documents/
│       ├── route.js
│       └── user/route.js
├── dashboard/
│   ├── layout.js
│   ├── page.js
│   ├── components/
│   └── [sections]/
└── admin/
    ├── layout.js
    ├── page.js
    ├── components/
    └── add-document/
models/
├── User.js
└── Document.js
libs/
├── next-auth.js
├── mongoose.js
└── requireAdmin.js
middleware.js
```

## Security Features

- **Role-based middleware** protecting admin routes
- **Authentication verification** in all API routes
- **Input validation** and sanitization
- **CSRF protection** via NextAuth
- **Secure session management**

## Customization

- Modify the `User` model to add additional fields
- Extend the `Document` model for new document types
- Customize the dashboard UI in the components
- Add new admin features in the admin panel

## Support

For issues or questions, please refer to the NextAuth.js documentation or create an issue in the repository.
