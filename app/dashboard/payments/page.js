import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";
import Link from "next/link";

/**
 * Payments Dashboard Page
 * Displays user's payment schedule with beautiful modern design
 */
export default async function PaymentsPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch user's payments and convert to plain objects
  const payments = await Payment.find({
    user: session.user.id,
  })
    .sort({ order: 1 })
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

  // Update statuses based on due dates
  for (const payment of payments) {
    const paymentDoc = await Payment.findById(payment.id);
    if (paymentDoc) {
      paymentDoc.updateStatus();
      if (paymentDoc.isModified()) {
        await paymentDoc.save();
        payment.status = paymentDoc.status;
      }
    }
  }

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to format budget
  const formatBudget = (budget) => {
    if (!budget) return "Not set";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(budget);
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Payment Schedule</h2>
        <p className="mt-1 text-sm text-gray-600">
          Track your payment schedule and due dates
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Payments Scheduled
          </h3>
          <p className="text-gray-600">
            Your payment schedule will appear here once payments are set up.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Payment Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
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
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-blue-600">
                    Total Payments
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {payments.length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4">
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
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-green-600">Paid</p>
                  <p className="text-2xl font-bold text-green-900">
                    {payments.filter((p) => p.status === "Paid").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
              <div className="flex items-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
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
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-yellow-600">Due</p>
                  <p className="text-2xl font-bold text-yellow-900">
                    {payments.filter((p) => p.status === "Due").length}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
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
                      d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-purple-600">
                    Total Amount
                  </p>
                  <p className="text-lg font-bold text-purple-900">
                    {formatBudget(
                      payments.reduce((sum, p) => sum + p.amount, 0),
                    )}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Schedule */}
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-semibold text-gray-900">
                Payment Schedule
              </h3>
              <p className="mt-1 text-sm text-gray-600">
                Detailed breakdown of all your scheduled payments
              </p>
            </div>
            <div className="overflow-x-auto">
              <div className="min-w-[800px]">
                <div className="divide-y divide-gray-200">
                  {payments.map((payment, index) => (
                    <div
                      key={payment.id}
                      className="px-6 py-4 transition-colors hover:bg-gray-50"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                            <span className="text-sm font-semibold text-gray-600">
                              #{payment.order}
                            </span>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-900">
                              {payment.name}
                            </h4>
                            <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                              <span className="flex items-center">
                                <svg
                                  className="mr-1 h-3 w-3"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                  />
                                </svg>
                                Due: {formatDate(payment.dueDate)}
                              </span>
                              {payment.status === "Paid" && (
                                <span className="flex items-center text-green-600">
                                  <svg
                                    className="mr-1 h-3 w-3"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                                    />
                                  </svg>
                                  Paid
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="text-sm font-semibold text-gray-900">
                              {formatBudget(payment.amount)}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                              payment.status === "Paid"
                                ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                                : payment.status === "Due"
                                  ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                                  : "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                            }`}
                          >
                            {payment.status === "Paid" && (
                              <svg
                                className="mr-1 h-3 w-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {payment.status === "Due" && (
                              <svg
                                className="mr-1 h-3 w-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {payment.status === "Scheduled" && (
                              <svg
                                className="mr-1 h-3 w-3"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                            {payment.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Progress Overview */}
          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Payment Progress
            </h3>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span className="font-medium text-gray-700">
                    Overall Progress
                  </span>
                  <span className="font-semibold text-gray-900">
                    {Math.round(
                      (payments.filter((p) => p.status === "Paid").length /
                        payments.length) *
                        100,
                    )}
                    %
                  </span>
                </div>
                <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                  <div
                    className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                    style={{
                      width: `${(payments.filter((p) => p.status === "Paid").length / payments.length) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <div className="font-medium text-gray-900">
                    {formatBudget(
                      payments
                        .filter((p) => p.status === "Paid")
                        .reduce((sum, p) => sum + p.amount, 0),
                    )}
                  </div>
                  <div className="text-gray-600">Amount Paid</div>
                </div>
                <div className="rounded-lg bg-white p-3 shadow-sm">
                  <div className="font-medium text-gray-900">
                    {formatBudget(
                      payments
                        .filter((p) => p.status !== "Paid")
                        .reduce((sum, p) => sum + p.amount, 0),
                    )}
                  </div>
                  <div className="text-gray-600">Amount Remaining</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
