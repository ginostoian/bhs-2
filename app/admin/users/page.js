import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import UsersList from "../components/UsersList";
import CreateUserForm from "../components/CreateUserForm";

/**
 * Admin Users Page
 * Displays user management interface with CRUD operations
 */
export default async function AdminUsersPage() {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all users and convert to plain objects
  const users = await User.find(
    {},
    {
      email: 1,
      name: 1,
      role: 1,
      projectStatus: 1,
      createdAt: 1,
      hasAccess: 1,
      phone: 1,
      address: 1,
    },
  )
    .sort({ createdAt: -1 })
    .lean()
    .then((users) => {
      const mappedUsers = users.map((user) => ({
        ...user,
        id: user._id.toString(),
        _id: undefined,
      }));
      console.log(
        "Fetched users with project status:",
        mappedUsers.map((u) => ({
          id: u.id,
          name: u.name,
          projectStatus: u.projectStatus,
        })),
      );
      return mappedUsers;
    });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          User Management
        </h1>
        <p className="text-gray-600">Manage user accounts and permissions</p>
      </div>

      {/* Create User Form */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <CreateUserForm />
      </div>

      {/* Users List */}
      <div className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
        <UsersList users={users} />
      </div>
    </div>
  );
}
