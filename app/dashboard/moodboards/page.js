import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Moodboard from "@/models/Moodboard";
import MoodboardsList from "./components/MoodboardsList";

/**
 * User Moodboards Page
 * Displays user's moodboards for product selection and approval
 */
export default async function MoodboardsPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch user's moodboards and convert to plain objects
  const moodboards = await Moodboard.find({
    user: session.user.id,
    isActive: true,
  })
    .sort({ updatedAt: -1 })
    .populate("user", "name email")
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

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Your Moodboards
        </h2>
        <p className="text-gray-600">
          Review and approve products for your renovation project
        </p>
      </div>

      {moodboards.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🎨</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No moodboards yet
          </h3>
          <p className="text-gray-600">
            Your moodboards will appear here once they are created by our team.
          </p>
        </div>
      ) : (
        <MoodboardsList moodboards={moodboards} />
      )}
    </div>
  );
}
