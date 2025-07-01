import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Document from "@/models/Document";
import CommentForm from "./components/CommentForm";

/**
 * Comments Dashboard Page
 * Displays user's comments and allows adding new ones
 */
export default async function CommentsPage() {
  // Get user session
  const session = await getServerSession(authOptions);

  // Connect to MongoDB
  await connectMongoose();

  // Fetch user's comments and convert to plain objects
  const comments = await Document.find({
    user: session.user.id,
    type: "comment",
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
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          Comments & Feedback
        </h2>
        <p className="text-gray-600">
          View project comments and add new feedback
        </p>
      </div>

      {/* Add new comment form */}
      <div className="mb-8">
        <CommentForm />
      </div>

      {/* Comments list */}
      {comments.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">💬</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No comments yet
          </h3>
          <p className="text-gray-600">
            Add a comment above to get started with project feedback.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                    {comment.user?.name?.charAt(0) ||
                      comment.user?.email?.charAt(0) ||
                      "U"}
                  </div>
                </div>
                <div className="flex-1">
                  <div className="mb-1 text-sm text-gray-500">
                    {new Date(comment.createdAt).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                  <div className="text-gray-900">{comment.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
