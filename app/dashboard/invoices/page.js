import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Invoice from "@/models/Invoice";
import UserInvoicesList from "./components/UserInvoicesList";
import { cookies } from "next/headers";

/**
 * Invoices Dashboard Page
 * Displays user's invoices from the invoicing system
 */
export default async function InvoicesPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Get selected project from cookies
  const cookieStore = cookies();
  const selectedProjectId = cookieStore.get("selectedProjectId")?.value;

  // Fetch user's invoices from the new Invoice model
  const query = {
    linkedUser: session.user.id,
    status: { $ne: "draft" }, // Only show sent and paid invoices to users
  };

  if (selectedProjectId) {
    query.project = selectedProjectId;
  }

  const invoices = await Invoice.find(query)
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
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              Your Invoices
            </h2>
            <p className="mt-2 text-lg text-gray-600">
              View and track your renovation invoices
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
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
                      d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">
                    Total Invoices
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {invoices.length}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {invoices.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-100 to-green-200">
            <svg
              className="h-10 w-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            No invoices yet
          </h3>
          <p className="text-gray-600">
            Your invoices will appear here once they are sent to you by BH
            Studio.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <UserInvoicesList invoices={invoices} />
        </div>
      )}
    </div>
  );
}
