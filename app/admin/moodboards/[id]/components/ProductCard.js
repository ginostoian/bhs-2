"use client";

import { useState } from "react";

/**
 * Product Card Component for Admin Interface
 * Displays product information with admin actions
 */
export default function ProductCard({
  product,
  onEdit,
  onDelete,
  onAdminComment,
}) {
  const [showUserCommentModal, setShowUserCommentModal] = useState(false);
  const [showAdminCommentModal, setShowAdminCommentModal] = useState(false);

  // Helper function to check if comment is long enough to truncate
  const isCommentLong = (comment) => {
    return comment && comment.length > 100; // Adjust threshold as needed
  };

  // Format price for display
  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(price);
  };

  // Get product display data
  const displayTitle =
    product.customTitle || product.product?.name || "Unknown Product";
  const displayPrice = product.customPrice || product.product?.price || 0;
  const displayImage = product.customImageUrl || product.product?.imageUrl;
  const displayUrl = product.customProductUrl || product.product?.productUrl;
  const displaySupplier = product.customSupplier || product.product?.supplier;
  const displayCategory = product.customCategory || product.product?.category;
  const totalPrice = displayPrice * product.quantity;

  // Get approval status styling
  const getStatusStyle = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "declined":
        return "bg-red-100 text-red-800 border-red-200";
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      {/* Product Image */}
      <div className="mb-3 aspect-square overflow-hidden rounded-lg bg-gray-100">
        {displayImage ? (
          <img
            src={displayImage}
            alt={displayTitle}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.target.style.display = "none";
              e.target.nextSibling.style.display = "flex";
            }}
          />
        ) : null}
        <div
          className={`flex h-full w-full items-center justify-center text-gray-400 ${
            displayImage ? "hidden" : "flex"
          }`}
        >
          <svg
            className="h-12 w-12"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-2">
        {/* Title */}
        <h4 className="line-clamp-2 font-medium text-gray-900">
          {displayTitle}
        </h4>

        {/* Price and Quantity */}
        <div className="flex items-center justify-between">
          <span className="text-sm text-gray-600">
            {formatPrice(displayPrice)} each
          </span>
          <span className="text-sm font-medium text-gray-900">
            Qty: {product.quantity}
          </span>
        </div>

        {/* Total Price */}
        <div className="text-lg font-semibold text-gray-900">
          {formatPrice(totalPrice)}
        </div>

        {/* Category and Supplier */}
        <div className="space-y-1 text-xs text-gray-500">
          {displayCategory && <div>Category: {displayCategory}</div>}
          {displaySupplier && <div>Supplier: {displaySupplier}</div>}
        </div>

        {/* Approval Status */}
        <div className="flex items-center justify-between">
          <span
            className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${getStatusStyle(
              product.approvalStatus,
            )}`}
          >
            {product.approvalStatus === "approved" && "✓ Approved"}
            {product.approvalStatus === "declined" && "✗ Declined"}
            {product.approvalStatus === "pending" && "⏳ Pending"}
          </span>
        </div>

        {/* User Comment Indicator */}
        {product.userComment && (
          <div className="rounded bg-blue-50 p-2 text-xs text-blue-700">
            <div className="font-medium">User Comment:</div>
            <div className="line-clamp-2">{product.userComment}</div>
            {isCommentLong(product.userComment) && (
              <button
                onClick={() => setShowUserCommentModal(true)}
                className="mt-1 text-blue-600 underline hover:text-blue-800"
              >
                Show more...
              </button>
            )}
          </div>
        )}

        {/* Admin Comment Indicator */}
        {product.adminComment && (
          <div className="rounded bg-purple-50 p-2 text-xs text-purple-700">
            <div className="font-medium">Admin Comment:</div>
            <div className="line-clamp-2">{product.adminComment}</div>
            {isCommentLong(product.adminComment) && (
              <button
                onClick={() => setShowAdminCommentModal(true)}
                className="mt-1 text-purple-600 underline hover:text-purple-800"
              >
                Show more...
              </button>
            )}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-2">
          {displayUrl && (
            <a
              href={displayUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 rounded bg-gray-100 px-2 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-200"
            >
              View
            </a>
          )}
          <button
            onClick={onEdit}
            className="flex-1 rounded bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onClick={onAdminComment}
            className="flex-1 rounded bg-purple-100 px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-200"
          >
            Comment
          </button>
          <button
            onClick={onDelete}
            className="flex-1 rounded bg-red-100 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      {/* User Comment Modal */}
      {showUserCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  User Comment
                </h3>
                <button
                  onClick={() => setShowUserCommentModal(false)}
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
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-700">{product.userComment}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Comment Modal */}
      {showAdminCommentModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Admin Comment
                </h3>
                <button
                  onClick={() => setShowAdminCommentModal(false)}
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
              <div className="rounded-lg bg-purple-50 p-4">
                <p className="text-sm text-purple-700">
                  {product.adminComment}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
