import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";
import Project from "@/models/Project";
import User from "@/models/User";
import AdminPaymentsClient from "./components/AdminPaymentsClient";

/**
 * Admin Payments Page
 * Shows all payments for all users with management capabilities
 */
export default async function AdminPaymentsPage() {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();
  console.log("Payment Schema Paths:", Object.keys(Payment.schema.paths));

  // Fetch all payments and convert to plain objects
  const payments = await Payment.find({})
    .sort({ order: 1 })
    .populate("user", "name email projectStatus")
    .populate({ path: "project", select: "name status", strictPopulate: false })
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

  // Fetch all users for the create payment form
  const users = await User.find(
    {},
    {
      email: 1,
      name: 1,
      projectStatus: 1,
    },
  )
    .sort({ name: 1 })
    .lean()
    .then((users) =>
      users.map((user) => ({
        ...user,
        id: user._id.toString(),
        _id: undefined,
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
      <AdminPaymentsClient payments={payments} users={users} />
    </div>
  );
}
