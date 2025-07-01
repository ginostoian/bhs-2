import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import DocumentList from "../components/DocumentList";

/**
 * Invoices Dashboard Page
 * Displays user's invoices
 */
export default async function InvoicesPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch user's invoices and convert to plain objects
  const invoices = await Document.find({
    user: session.user.id,
    type: "invoice",
  })
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
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Your Invoices</h2>
        <p className="text-gray-600">View and track your renovation invoices</p>
      </div>

      {invoices.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">💰</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No invoices yet
          </h3>
          <p className="text-gray-600">
            Invoices will appear here once your quotes are approved.
          </p>
        </div>
      ) : (
        <DocumentList documents={invoices} type="invoice" />
      )}
    </div>
  );
}
