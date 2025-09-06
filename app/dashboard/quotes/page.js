import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Quote from "@/models/Quote";
import UserQuotesList from "./components/UserQuotesList";

/**
 * Quotes Dashboard Page
 * Displays user's quotes from the quoting system
 */
export default async function QuotesPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch user's quotes from the Quote model
  const quotes = await Quote.find({
    linkedUser: session.user.id,
    status: { $ne: "draft" }, // Only show non-draft quotes to users
  })
    .sort({ createdAt: -1 })
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
      {/* Header Section */}
      <div className="mb-8">
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
          <div className="mx-auto max-w-4xl">
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-indigo-600">
                <svg
                  className="h-10 w-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h1 className="mb-4 text-4xl font-bold text-gray-900">
                Your Quotes
              </h1>
              <p className="text-lg text-gray-700">
                View and manage your project quotes from BH Studio. Track
                progress, review details, and download your quotes.
              </p>
              <div className="mt-6">
                <div className="inline-flex items-center rounded-full bg-white px-4 py-2 text-sm font-medium text-blue-600 shadow-sm">
                  <span className="mr-2 h-2 w-2 rounded-full bg-blue-500"></span>
                  {quotes.length} quote{quotes.length !== 1 ? "s" : ""}{" "}
                  available
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {quotes.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-100 to-blue-200">
            <svg
              className="h-10 w-10 text-blue-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No quotes yet
          </h3>
          <p className="text-gray-600">
            Your project quotes will appear here once they are created by BH
            Studio.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <UserQuotesList quotes={quotes} />
        </div>
      )}
    </div>
  );
}
