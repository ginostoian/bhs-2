import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Moodboard from "@/models/Moodboard";
import MoodboardsList from "./components/MoodboardsList";
import { cookies } from "next/headers";

/**
 * User Moodboards Page
 * Displays user's moodboards for product selection and approval
 */
export default async function MoodboardsPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Get selected project from cookies
  const cookieStore = cookies();
  const selectedProjectId = cookieStore.get("selectedProjectId")?.value;

  // Fetch user's moodboards and convert to plain objects
  const query = {
    user: session.user.id,
    isActive: true,
  };

  if (selectedProjectId) {
    query.project = selectedProjectId;
  }

  const moodboards = await Moodboard.find(query)
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
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Your Moodboards
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              Review and approve products for your renovation project
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">
                    Total Moodboards
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    {moodboards.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {moodboards.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200">
            <svg
              className="h-10 w-10 text-purple-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zM21 5a2 2 0 00-2-2h-4a2 2 0 00-2 2v12a4 4 0 004 4h4a2 2 0 002-2V5z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No moodboards yet
          </h3>
          <p className="text-gray-600">
            Your moodboards will appear here once they are created by our team.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <MoodboardsList moodboards={moodboards} />
        </div>
      )}
    </div>
  );
}
