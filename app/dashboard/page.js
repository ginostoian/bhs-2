import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import DocumentList from "./components/DocumentList";

/**
 * Dashboard Main Page - Quotes
 * Displays user's quotes and allows requesting new ones
 */
export default async function DashboardPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch user's quotes
  const quotes = await Document.find({
    user: session.user.id,
    type: "quote",
  })
    .sort({ createdAt: -1 })
    .populate("user", "name email");

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Your Quotes</h2>
        <p className="text-gray-600">View and manage your renovation quotes</p>
      </div>

      {quotes.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No quotes yet
          </h3>
          <p className="mb-6 text-gray-600">
            Request your first quote to get started with your renovation
            project.
          </p>
          <a
            href="/dashboard/request-quote"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
          >
            Request Quote
          </a>
        </div>
      ) : (
        <DocumentList documents={quotes} type="quote" />
      )}
    </div>
  );
}
