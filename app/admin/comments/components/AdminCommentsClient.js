"use client";

import { useState } from "react";

/**
 * Admin Comments Client Component
 * Displays all user comments with management capabilities
 */
export default function AdminCommentsClient({ comments: initialComments }) {
  const [comments, setComments] = useState(initialComments);
  const [isDeleting, setIsDeleting] = useState(false);

  // Handle comment deletion
  const handleDeleteComment = async (commentId) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setIsDeleting(true);

    try {
      const response = await fetch(`/api/documents/${commentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete comment");
      }

      // Remove comment from state
      setComments(comments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          User Comments Management
        </h2>
        <p className="text-gray-600">
          View and manage all user comments and feedback
        </p>
      </div>

      {comments.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">💬</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No comments yet
          </h3>
          <p className="text-gray-600">
            Users haven&apos;t submitted any comments yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Comments List */}
          {comments.map((comment) => (
            <div
              key={comment.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                        {comment.user?.name?.charAt(0) ||
                          comment.user?.email?.charAt(0) ||
                          "U"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {comment.user?.name || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {comment.user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-gray-900">
                      {comment.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Posted: {formatDate(comment.createdAt)}</span>
                    <span>Comment ID: {comment.id}</span>
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() => handleDeleteComment(comment.id)}
                    disabled={isDeleting}
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Statistics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {comments.length}
            </div>
            <div className="text-sm text-blue-600">Total Comments</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {new Set(comments.map((c) => c.user?.id)).size}
            </div>
            <div className="text-sm text-green-600">Unique Users</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {comments.length > 0 ? formatDate(comments[0].createdAt) : "N/A"}
            </div>
            <div className="text-sm text-purple-600">Latest Comment</div>
          </div>
        </div>
      </div>
    </div>
  );
}
