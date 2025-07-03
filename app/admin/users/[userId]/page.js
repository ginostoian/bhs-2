import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import Document from "@/models/Document";
import Payment from "@/models/Payment";
import { notFound } from "next/navigation";
import UserDetailClient from "./components/UserDetailClient";

/**
 * User Detail Page
 * Shows all documents for a specific user with management capabilities
 */
export default async function UserDetailPage({ params }) {
  // Get user session
  const session = await getServerSession(authOptions);

  // Check if user is admin
  if (!session?.user?.role === "admin") {
    return notFound();
  }

  // Connect to MongoDB
  await connectMongoose();

  // Fetch user
  const user = await User.findById(params.userId)
    .lean()
    .then((doc) => ({
      ...doc,
      id: doc._id.toString(),
      _id: undefined,
    }));

  if (!user) {
    return notFound();
  }

  // Fetch all documents for this user
  let documents = [];
  try {
    documents = await Document.find({ user: params.userId })
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
  } catch (error) {
    console.error("Error fetching documents:", error);
    documents = [];
  }

  // Fetch all payments for this user
  let payments = [];
  try {
    payments = await Payment.find({ user: params.userId })
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
  } catch (error) {
    console.error("Error fetching payments:", error);
    payments = [];
  }

  // Update payment statuses based on due dates
  for (const payment of payments) {
    try {
      const paymentDoc = await Payment.findById(payment.id);
      if (paymentDoc) {
        paymentDoc.updateStatus();
        if (paymentDoc.isModified()) {
          await paymentDoc.save();
          payment.status = paymentDoc.status;
        }
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  }

  // Group documents by type
  const documentsByType = {
    photo: documents.filter((doc) => doc.type === "photo") || [],
    comment: documents.filter((doc) => doc.type === "comment") || [],
    quote: documents.filter((doc) => doc.type === "quote") || [],
    invoice: documents.filter((doc) => doc.type === "invoice") || [],
  };

  return (
    <div>
      <UserDetailClient
        user={user}
        documentsByType={documentsByType}
        payments={payments}
      />
    </div>
  );
}
