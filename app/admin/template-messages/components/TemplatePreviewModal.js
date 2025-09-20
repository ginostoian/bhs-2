"use client";

import { useState } from "react";
import Modal from "@/components/Modal";

/**
 * Template Preview Modal Component
 * Displays full template content with actions
 */
export default function TemplatePreviewModal({
  template,
  onClose,
  onEdit,
  onDelete,
  onUse,
}) {
  const [isCopying, setIsCopying] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });

  // Get category badge styling
  const getCategoryBadge = (category) => {
    const styles = {
      "Email Templates": "bg-blue-100 text-blue-800",
      "SMS Templates": "bg-green-100 text-green-800",
      "General Messages": "bg-gray-100 text-gray-800",
      "Project Communications": "bg-purple-100 text-purple-800",
      "Support Responses": "bg-orange-100 text-orange-800",
      "Quote Templates": "bg-yellow-100 text-yellow-800",
      "Bank Information": "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          styles[category] || "bg-gray-100 text-gray-800"
        }`}
      >
        {category}
      </span>
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    setIsCopying(true);
    try {
      await navigator.clipboard.writeText(template.content);
      // Track usage
      if (onUse) {
        onUse(template.id);
      }
      setModalState({
        isOpen: true,
        title: "Success",
        message: "Template content copied to clipboard!",
        type: "alert",
        confirmText: "OK",
      });
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to copy to clipboard. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsCopying(false);
    }
  };

  // Handle delete
  const handleDelete = () => {
    setModalState({
      isOpen: true,
      title: "Delete Template",
      message: `Are you sure you want to delete "${template.title}"? This action cannot be undone.`,
      type: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
  };

  // Handle modal confirmation based on type
  const handleModalConfirm = () => {
    if (modalState.type === "confirm") {
      // This is a delete confirmation
      if (onDelete) {
        onDelete(template.id, template.title);
      }
    }
    // For alert type (like copy success), just close the modal
    setModalState({
      isOpen: false,
      title: "",
      message: "",
      type: "alert",
      confirmText: "OK",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        {/* Header */}
        <div className="mb-6 flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-gray-900">
                {template.title}
              </h3>
              {getCategoryBadge(template.category)}
            </div>
            {template.description && (
              <p className="mt-1 text-sm text-gray-600">
                {template.description}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Template Info */}
        <div className="mb-6 rounded-lg bg-gray-50 p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <span className="text-sm font-medium text-gray-500">
                Created by
              </span>
              <p className="text-sm text-gray-900">
                {template.createdBy?.name || "Unknown"}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Created on
              </span>
              <p className="text-sm text-gray-900">
                {formatDate(template.createdAt)}
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Usage count
              </span>
              <p className="text-sm text-gray-900">
                {template.usageCount || 0} times
              </p>
            </div>
            <div>
              <span className="text-sm font-medium text-gray-500">
                Last used
              </span>
              <p className="text-sm text-gray-900">
                {formatDate(template.lastUsed)}
              </p>
            </div>
          </div>
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="mb-6">
            <span className="text-sm font-medium text-gray-500">Tags</span>
            <div className="mt-1 flex flex-wrap gap-2">
              {template.tags.map((tag, index) => (
                <span
                  key={index}
                  className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
                >
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Content */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-500">Content</span>
            <div className="flex items-center space-x-2">
              <span
                className={`inline-flex h-2 w-2 rounded-full ${
                  template.isActive ? "bg-green-400" : "bg-gray-400"
                }`}
              ></span>
              <span className="text-xs text-gray-500">
                {template.isActive ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div
              className="prose-sm prose max-w-none"
              dangerouslySetInnerHTML={{ __html: template.content }}
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={handleCopy}
            disabled={isCopying}
            className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCopying ? (
              <>
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Copying...
              </>
            ) : (
              <>
                <svg
                  className="mr-2 h-4 w-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                  />
                </svg>
                Copy to Clipboard
              </>
            )}
          </button>

          <button
            onClick={() => onEdit && onEdit(template)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Edit Template
          </button>

          <button
            onClick={handleDelete}
            className="inline-flex items-center rounded-md border border-red-300 bg-red-50 px-4 py-2 text-sm font-medium text-red-700 shadow-sm hover:bg-red-100"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
            Delete Template
          </button>

          <button
            onClick={onClose}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
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
        onConfirm={handleModalConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </div>
  );
}
