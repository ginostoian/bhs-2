import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import UsersList from "./components/UsersList";
import CreateUserForm from "./components/CreateUserForm";

/**
 * Admin Users Page
 * Displays user management interface with CRUD operations
 */
export default async function AdminUsersPage() {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all users
  const users = await User.find(
    {},
    {
      email: 1,
      name: 1,
      role: 1,
      createdAt: 1,
      hasAccess: 1,
    },
  ).sort({ createdAt: -1 });

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          User Management
        </h2>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Create User Form */}
      <div className="mb-8">
        <CreateUserForm />
      </div>

      {/* Users List */}
      <div>
        <UsersList users={users} />
      </div>
    </div>
  );
}
