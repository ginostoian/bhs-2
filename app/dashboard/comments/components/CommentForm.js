"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Comment Form Component
 * Allows users to add new comments
 */
export default function CommentForm() {
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!content.trim()) {
      alert("Please enter a comment");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/documents/user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "comment",
          content: content.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      // Clear form and refresh page
      setContent("");
      router.refresh();
    } catch (error) {
      console.error("Error adding comment:", error);
      alert("Failed to add comment. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium text-gray-900">
        Add New Comment
      </h3>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Your Comment
          </label>
          <textarea
            id="comment"
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Share your thoughts, questions, or feedback about your project..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !content.trim()}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Comment"}
          </button>
        </div>
      </form>
    </div>
  );
}
