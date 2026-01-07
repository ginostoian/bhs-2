import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import DocumentList from "./components/DocumentList";
import { cookies } from "next/headers";

/**
 * Dashboard Main Page - Quotes
 * Displays user's quotes and allows requesting new ones
 */
export default async function DashboardPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Get selected project from cookies
  const cookieStore = cookies();
  const selectedProjectId = cookieStore.get("selectedProjectId")?.value;

  // Fetch user's quotes and convert to plain objects
  const query = {
    user: session.user.id,
    type: "quote",
  };

  if (selectedProjectId) {
    query.project = selectedProjectId;
  }

  const quotes = await Document.find(query)
    .sort({ createdAt: -1 })
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
              Your Quotes
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              View and manage your renovation quotes
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-gradient-to-r from-blue-50 to-indigo-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
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
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">
                    Total Quotes
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {quotes.length}
                  </p>
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
          <p className="mb-6 text-gray-600">
            Request your first quote to get started with your renovation
            project.
          </p>
          <a
            href="/dashboard/request-quote"
            className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-3 text-sm font-medium text-white shadow-lg shadow-blue-600/25 transition-all duration-200 hover:from-blue-700 hover:to-blue-800 hover:shadow-xl"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Request Quote
          </a>
        </div>
      ) : (
        <div className="space-y-6">
          <DocumentList documents={quotes} type="quote" />
        </div>
      )}
    </div>
  );
}
