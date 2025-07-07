import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import NotificationTestClient from "./components/NotificationTestClient";

/**
 * Admin Notifications Test Page
 * Allows admins to test notification creation
 */
export default async function AdminNotificationsPage() {
  // Check authentication and admin access
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all users for testing
  const users = await User.find({})
    .select("name email role")
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        _id: undefined,
      })),
    );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">
          Notification Testing
        </h1>
        <p className="text-gray-600">
          Test notification creation for different users and scenarios
        </p>
      </div>

      <NotificationTestClient users={users} />
    </div>
  );
}
