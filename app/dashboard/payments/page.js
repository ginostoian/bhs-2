import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";
import PaymentsTable from "../components/PaymentsTable";

/**
 * Payments Dashboard Page
 * Displays user's payment schedule
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
    .sort({ order: 1, paymentNumber: 1 })
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

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Payment Schedule
        </h2>
        <p className="text-gray-600">
          Track your payment schedule and due dates
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">💳</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No payments scheduled
          </h3>
          <p className="text-gray-600">
            Your payment schedule will appear here once payments are set up.
          </p>
        </div>
      ) : (
        <PaymentsTable payments={payments} />
      )}
    </div>
  );
}
