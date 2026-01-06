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

  // Fetch total count and initial users in parallel
  const [totalCount, users] = await Promise.all([
    User.countDocuments({}),
    User.find(
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
      .limit(12) // Optimize initial load
      .lean()
      .then((users) => {
        const mappedUsers = users.map((user) => ({
          ...user,
          id: user._id.toString(),
          _id: undefined,
        }));
        return mappedUsers;
      })
  ]);

  return (
    <div className="space-y-8 pb-12">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 rounded-xl border border-gray-100/50 shadow-sm transition-all px-1">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
            User Management
          </h1>
          <p className="text-gray-500">Manage user accounts and permissions</p>
        </div>
        <div className="text-sm font-medium text-gray-400">
             {totalCount} Total Users
        </div>
      </div>

      {/* Create User Form Section */}
      <CreateUserForm />

      {/* Users List */}
      <UsersList users={users} totalUsers={totalCount} />
    </div>
  );
}
