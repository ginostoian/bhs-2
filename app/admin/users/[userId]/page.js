import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import Document from "@/models/Document";
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
  const documents = await Document.find({ user: params.userId })
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

  // Group documents by type
  const documentsByType = {
    photo: documents.filter((doc) => doc.type === "photo"),
    comment: documents.filter((doc) => doc.type === "comment"),
    quote: documents.filter((doc) => doc.type === "quote"),
    invoice: documents.filter((doc) => doc.type === "invoice"),
  };

  return (
    <div>
      <UserDetailClient user={user} documentsByType={documentsByType} />
    </div>
  );
}
