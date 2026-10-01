import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import UsersList from "../components/UsersList";
import CreateUserForm from "../components/CreateUserForm";
import { PageHeader } from "@/components/admin/ui";

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
      .limit(25) // First page (matches the list page size)
      .lean()
      .then((users) => {
        const mappedUsers = users.map((user) => ({
          ...user,
          id: user._id.toString(),
          _id: undefined,
        }));
        return mappedUsers;
      }),
  ]);

  const clients = await User.countDocuments({ role: { $in: ["user", null] } });

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="People"
        title="Users & clients"
        description={`${totalCount} accounts · ${clients} clients. Open a client to see their projects, quotes, invoices, leads and tickets in one place.`}
      />
      <div className="mb-4">
        <CreateUserForm />
      </div>
      <UsersList users={users} totalUsers={totalCount} />
    </div>
  );
}
