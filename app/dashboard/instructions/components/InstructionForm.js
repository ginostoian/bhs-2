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
    <div className="border border-[#D8D2C6] bg-[#F4F1EA] p-5 sm:p-6">
      <h3 className="mb-4 text-base font-semibold text-[#202925]">
        Add an instruction
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
            className="w-full rounded-md border border-[#d8d4ca] bg-white px-3 py-2 text-sm text-[#202925] focus:border-[#4D5B4B] focus:outline-none focus:ring-2 focus:ring-[#4D5B4B]/15"
            placeholder="Share your instructions, questions, or feedback about your project..."
            disabled={isSubmitting}
          />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting || !comment.trim()}
            className="inline-flex min-h-11 items-center rounded-md bg-[#4D5B4B] px-4 text-xs font-semibold text-white hover:bg-[#3E4A3C] disabled:cursor-not-allowed disabled:opacity-50"
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
