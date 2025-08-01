"use client";

import { useState } from "react";

/**
 * User Change Modal Component
 * Modal for users to view change details and accept/decline changes
 */
export default function UserChangeModal({
  isOpen,
  change,
  onClose,
  onStatusUpdate,
}) {
  const [loading, setLoading] = useState(false);

  // Handle status update
  const handleStatusUpdate = async (status) => {
    if (!change) return;

    setLoading(true);
    try {
      await onStatusUpdate(change.id, status);
      onClose();
    } catch (error) {
      console.error("Error updating change status:", error);
    } finally {
      setLoading(false);
    }
  };

  // Format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  // Get status badge
  const getStatusBadge = (status) => {
    const statusConfig = {
      Review: {
        bg: "bg-yellow-100",
        text: "text-yellow-800",
        ring: "ring-yellow-200",
        icon: "⏳",
      },
      Accepted: {
        bg: "bg-green-100",
        text: "text-green-800",
        ring: "ring-green-200",
        icon: "✅",
      },
      Declined: {
        bg: "bg-red-100",
        text: "text-red-800",
        ring: "ring-red-200",
        icon: "❌",
      },
    };

    const config = statusConfig[status] || statusConfig.Review;

    return (
      <span
        className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${config.bg} ${config.text} ring-1 ring-inset ${config.ring}`}
      >
        <span className="mr-1">{config.icon}</span>
        {status}
      </span>
    );
  };

  if (!isOpen || !change) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal */}
        <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Change Details
              </h3>
              <button
                onClick={onClose}
                className="rounded-md bg-white text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <span className="sr-only">Close</span>
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
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
          </div>

          {/* Content */}
          <div className="px-6 py-4">
            <div className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Change Number
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    #{change.changeNumber}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <div className="mt-1">{getStatusBadge(change.status)}</div>
                </div>
              </div>

              {change.project && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Project
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {change.project.name}
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{change.name}</p>
              </div>

              {change.description && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {change.description}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Cost
                  </label>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    {formatCurrency(change.cost)}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Type
                  </label>
                  <p className="mt-1 text-sm text-gray-900">{change.type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Payment Plan
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {change.includedInPaymentPlan}
                  </p>
                </div>
              </div>

              {change.adminNotes && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Admin Notes
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {change.adminNotes}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Requested Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {new Date(change.requestedDate).toLocaleDateString("en-GB")}
                  </p>
                </div>
                {change.decisionDate && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Decision Date
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {new Date(change.decisionDate).toLocaleDateString(
                        "en-GB",
                      )}
                    </p>
                  </div>
                )}
              </div>

              {change.decidedBy && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Decided By
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {change.decidedBy.name}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-between">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>

              {change.status === "Review" && (
                <div className="flex space-x-3">
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate("Declined")}
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-red-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? (
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Decline"
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStatusUpdate("Accepted")}
                    disabled={loading}
                    className="inline-flex justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {loading ? (
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
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          />
                        </svg>
                        Processing...
                      </>
                    ) : (
                      "Accept"
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
