"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

/**
 * Admin Instructions Client Component
 * Displays all user instructions with management capabilities
 */
export default function AdminInstructionsClient({
  instructions: initialInstructions,
}) {
  const [instructions, setInstructions] = useState(initialInstructions);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    instructionId: null,
    instructionContent: "",
  });

  // Handle instruction deletion
  const handleDeleteInstruction = async (instructionId) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/documents/${instructionId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete instruction");
      }

      // Remove instruction from state
      setInstructions(
        instructions.filter((instruction) => instruction.id !== instructionId),
      );
    } catch (error) {
      console.error("Error deleting instruction:", error);
      // Show error modal
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete instruction. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (instructionId, instructionContent) => {
    setModalState({
      isOpen: true,
      instructionId,
      instructionContent,
      title: "Delete Instruction",
      message:
        "Are you sure you want to delete this instruction? This action cannot be undone.",
      type: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
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
          User Instructions Management
        </h2>
        <p className="text-gray-600">
          View and manage all user instructions and feedback
        </p>
      </div>

      {instructions.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📋</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No instructions yet
          </h3>
          <p className="text-gray-600">
            Users haven&apos;t submitted any instructions yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Instructions List */}
          {instructions.map((instruction) => (
            <div
              key={instruction.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                        {instruction.user?.name?.charAt(0) ||
                          instruction.user?.email?.charAt(0) ||
                          "U"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-900">
                        {instruction.user?.name || "Unknown User"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {instruction.user?.email}
                      </div>
                    </div>
                  </div>

                  <div className="mb-4 rounded-lg bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-gray-900">
                      {instruction.content}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Posted: {formatDate(instruction.createdAt)}</span>
                    <span>Instruction ID: {instruction.id}</span>
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() =>
                      openDeleteModal(instruction.id, instruction.content)
                    }
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
              {instructions.length}
            </div>
            <div className="text-sm text-blue-600">Total Instructions</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {new Set(instructions.map((i) => i.user?.id)).size}
            </div>
            <div className="text-sm text-green-600">Unique Users</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {instructions.length > 0
                ? formatDate(instructions[0].createdAt)
                : "N/A"}
            </div>
            <div className="text-sm text-purple-600">Latest Instruction</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            instructionId: null,
            instructionContent: "",
          })
        }
        onConfirm={() => {
          if (modalState.instructionId && modalState.type === "confirm") {
            handleDeleteInstruction(modalState.instructionId);
          }
        }}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </div>
  );
}
