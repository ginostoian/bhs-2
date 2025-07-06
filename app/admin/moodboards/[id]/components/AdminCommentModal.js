"use client";

import { useState, useEffect } from "react";

/**
 * Admin Comment Modal Component
 * Form for adding/editing admin comments on products
 */
export default function AdminCommentModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isSubmitting,
}) {
  const [comment, setComment] = useState("");

  // Update comment when product changes
  useEffect(() => {
    if (product) {
      setComment(product.adminComment || "");
    }
  }, [product, isOpen]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(comment);
  };

  if (!isOpen) return null;

  const productTitle =
    product?.customTitle || product?.product?.name || "Unknown Product";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Admin Comment
            </h2>
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

          {/* Product Info */}
          <div className="mb-4 rounded-lg bg-gray-50 p-3">
            <h3 className="text-sm font-medium text-gray-900">Product:</h3>
            <p className="text-sm text-gray-600">{productTitle}</p>
          </div>

          {/* User Comment (if exists) */}
          {product?.userComment && (
            <div className="mb-4 rounded-lg bg-blue-50 p-3">
              <h3 className="text-sm font-medium text-blue-900">
                User Comment:
              </h3>
              <p className="text-sm text-blue-700">{product.userComment}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Admin Comment
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                placeholder="Add your comment about this product..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                This comment will only be visible to admins.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-purple-600 px-4 py-2 text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Comment"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
