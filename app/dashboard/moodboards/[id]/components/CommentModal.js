"use client";

import { useState, useEffect } from "react";

/**
 * Comment Modal Component
 * Allows users to add and edit comments on products
 */
export default function CommentModal({ isOpen, onClose, onSubmit, product }) {
  const [comment, setComment] = useState("");

  // Reset comment when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen && product) {
      setComment(product.userComment || "");
    } else {
      setComment("");
    }
  }, [isOpen, product]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
  };

  // Handle modal close
  const handleClose = () => {
    setComment("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              {product?.userComment ? "Edit Comment" : "Add Comment"}
            </h2>
            <button
              onClick={handleClose}
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

          {/* Product Info */}
          {product && (
            <div className="mb-4 rounded-md bg-gray-50 p-3">
              <h3 className="font-medium text-gray-900">
                {product.product.name}
              </h3>
              <p className="text-sm text-gray-600">
                {product.product.supplier} • {product.product.category}
              </p>
            </div>
          )}

          {/* Comment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Your Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add your thoughts about this product..."
              />
            </div>

            {/* Admin Comment Display */}
            {product?.adminComment && (
              <div className="rounded-md bg-blue-50 p-3">
                <p className="text-xs font-medium text-blue-600">
                  Admin Comment:
                </p>
                <p className="text-sm text-blue-800">{product.adminComment}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {product?.userComment ? "Update Comment" : "Save Comment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
