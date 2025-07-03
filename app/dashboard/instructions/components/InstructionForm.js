"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Modal from "@/components/Modal";

/**
 * Instructions Form Component
 * Allows users to add new instructions
 */
export default function InstructionForm({ onInstructionAdded }) {
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!comment.trim()) {
      setModalState({
        isOpen: true,
        title: "Validation Error",
        message: "Please enter instructions",
        type: "alert",
        confirmText: "OK",
      });
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
          content: comment.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add instructions");
      }

      const newComment = await response.json();

      // Reset form
      setComment("");

      // Callback to parent component
      if (onInstructionAdded) {
        onInstructionAdded(newComment);
      }

      // Show success modal
      setModalState({
        isOpen: true,
        title: "Success",
        message: "Instructions added successfully!",
        type: "alert",
        confirmText: "OK",
      });

      // Clear form and refresh page
      router.refresh();
    } catch (error) {
      console.error("Error adding comment:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to add instructions. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow">
      <h3 className="mb-4 text-lg font-medium text-gray-900">
        Add New Instructions
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="comment"
            className="mb-2 block text-sm font-medium text-gray-700"
          >
            Your Instructions
          </label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={4}
            className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            placeholder="Share your instructions, questions, or feedback about your project..."
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? "Adding..." : "Add Instructions"}
          </button>
        </div>
      </form>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          })
        }
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        type={modalState.type}
      />
    </div>
  );
}
