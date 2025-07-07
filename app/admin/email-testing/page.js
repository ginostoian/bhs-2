import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { redirect } from "next/navigation";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import EmailTestClient from "./components/EmailTestClient";

/**
 * Admin Email Testing Page
 * Allows admins to test email functionality and view email statistics
 */
export default async function AdminEmailTestingPage() {
  // Check authentication and admin access
  const session = await getServerSession(authOptions);
  if (!session?.user || session.user.role !== "admin") {
    redirect("/dashboard");
  }

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all users for testing
  const users = await User.find({})
    .select("name email role projectStatus")
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
        <h1 className="text-2xl font-bold text-gray-900">Email Testing</h1>
        <p className="text-gray-600">
          Test email functionality and view email statistics
        </p>
      </div>

      <EmailTestClient users={users} />
    </div>
  );
}
