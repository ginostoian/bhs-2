import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Moodboard from "@/models/Moodboard";
import User from "@/models/User";
import AdminMoodboardsClient from "./components/AdminMoodboardsClient";

/**
 * Admin Moodboards Page
 * Manages user moodboards with creation and management capabilities
 */
export default async function AdminMoodboardsPage() {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all moodboards with user data
  const moodboards = await Moodboard.find({})
    .sort({ updatedAt: -1 })
    .populate("user", "name email projectStatus")
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        _id: undefined,
        user: doc.user
          ? {
              ...doc.user,
              id: doc.user._id.toString(),
              _id: undefined,
            }
          : doc.user,
      })),
    );

  // Fetch all users for moodboard creation
  const users = await User.find({})
    .select("name email projectStatus")
    .sort({ name: 1 })
    .lean()
    .then((docs) =>
      docs.map((doc) => ({
        ...doc,
        id: doc._id.toString(),
        _id: undefined,
      })),
    );

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Moodboard Management
        </h2>
        <p className="text-gray-600">
          Create and manage moodboards for users to review and approve products
        </p>
      </div>

      <AdminMoodboardsClient moodboards={moodboards} users={users} />
    </div>
  );
}
