import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import AdminCommentsClient from "./components/AdminCommentsClient";

/**
 * Admin Comments Page
 * Server component that fetches comments data
 */
export default async function AdminCommentsPage() {
  // Get admin session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch all comments with user information
  const comments = await Document.find({ type: "comment" })
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

  return <AdminCommentsClient comments={comments} />;
}
