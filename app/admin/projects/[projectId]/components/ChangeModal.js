"use client";

import { useState, useEffect } from "react";

/**
 * Change Modal Component
 * Modal for creating, editing, and viewing project changes
 */
export default function ChangeModal({ isOpen, change, mode, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    cost: "",
    type: "Labour",
    includedInPaymentPlan: "Not Included",
    adminNotes: "",
    status: "Review",
  });
  const [loading, setLoading] = useState(false);

  // Initialize form data when change or mode changes
  useEffect(() => {
    if (change && (mode === "edit" || mode === "view")) {
      setFormData({
        name: change.name || "",
        description: change.description || "",
        cost: change.cost || "",
        type: change.type || "Labour",
        includedInPaymentPlan: change.includedInPaymentPlan || "Not Included",
        adminNotes: change.adminNotes || "",
        status: change.status || "Review",
      });
    } else if (mode === "create") {
      setFormData({
        name: "",
        description: "",
        cost: "",
        type: "Labour",
        includedInPaymentPlan: "Not Included",
        adminNotes: "",
        status: "Review",
      });
    }
  }, [change, mode]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        cost: parseFloat(formData.cost),
      };

      await onSave(submitData);
    } catch (error) {
      console.error("Error saving change:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
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

  if (!isOpen) return null;

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
                {mode === "create" && "Add New Change"}
                {mode === "edit" && "Edit Change"}
                {mode === "view" && "View Change Details"}
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
            {mode === "view" ? (
              // View mode - read-only display
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
                      {new Date(change.requestedDate).toLocaleDateString(
                        "en-GB",
                      )}
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
            ) : (
              // Create/Edit mode - form
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Change Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter change name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter description (optional)"
                  />
                </div>

                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  <div>
                    <label
                      htmlFor="cost"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Cost (£) *
                    </label>
                    <input
                      type="number"
                      id="cost"
                      name="cost"
                      value={formData.cost}
                      onChange={handleInputChange}
                      required
                      min="0"
                      step="0.01"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Type *
                    </label>
                    <select
                      id="type"
                      name="type"
                      value={formData.type}
                      onChange={handleInputChange}
                      required
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="Labour">Labour</option>
                      <option value="Material">Material</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="includedInPaymentPlan"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Payment Plan
                    </label>
                    <select
                      id="includedInPaymentPlan"
                      name="includedInPaymentPlan"
                      value={formData.includedInPaymentPlan}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="Included">Included</option>
                      <option value="Not Included">Not Included</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="adminNotes"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Admin Notes
                  </label>
                  <textarea
                    id="adminNotes"
                    name="adminNotes"
                    value={formData.adminNotes}
                    onChange={handleInputChange}
                    rows={3}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Internal notes (optional)"
                  />
                </div>

                {mode === "edit" && (
                  <div>
                    <label
                      htmlFor="status"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Status
                    </label>
                    <select
                      id="status"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    >
                      <option value="Review">Review</option>
                      <option value="Accepted">Accepted</option>
                      <option value="Declined">Declined</option>
                    </select>
                  </div>
                )}
              </form>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                {mode === "view" ? "Close" : "Cancel"}
              </button>
              {mode !== "view" && (
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={loading}
                  className="inline-flex justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
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
                      Saving...
                    </>
                  ) : (
                    "Save Change"
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
