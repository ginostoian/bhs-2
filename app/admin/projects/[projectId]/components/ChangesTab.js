"use client";

import { useState, useEffect } from "react";
import ChangeModal from "./ChangeModal";

/**
 * Changes Tab Component
 * Displays project changes/extra costs with admin CRUD capabilities
 */
export default function ChangesTab({
  projectId,
  projectName,
  userName,
  changes: initialChanges,
}) {
  const [changes, setChanges] = useState(initialChanges || []);
  const [loading, setLoading] = useState(false);
  const [changeModal, setChangeModal] = useState({
    isOpen: false,
    change: null,
    mode: "create", // create, edit, view
  });

  // Load changes from API
  const loadChanges = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${projectId}/changes`, {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setChanges(data.changes || []);
      } else {
        console.error("Failed to load changes:", response.status);
      }
    } catch (error) {
      console.error("Error loading changes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle change save (create or update)
  const handleChangeSave = async (changeData) => {
    try {
      const url =
        changeModal.mode === "create"
          ? `/api/projects/${projectId}/changes`
          : `/api/projects/${projectId}/changes/${changeModal.change.id}`;

      const method = changeModal.mode === "create" ? "POST" : "PUT";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(changeData),
      });

      if (response.ok) {
        const data = await response.json();
        await loadChanges(); // Reload changes
        setChangeModal({ isOpen: false, change: null, mode: "create" });
      } else {
        console.error("Failed to save change:", response.status);
      }
    } catch (error) {
      console.error("Error saving change:", error);
    }
  };

  // Handle change delete
  const handleChangeDelete = async (changeId) => {
    if (!confirm("Are you sure you want to delete this change?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/projects/${projectId}/changes/${changeId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        await loadChanges(); // Reload changes
      } else {
        console.error("Failed to delete change:", response.status);
      }
    } catch (error) {
      console.error("Error deleting change:", error);
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

  // Get type badge
  const getTypeBadge = (type) => {
    const typeConfig = {
      Labour: {
        bg: "bg-blue-100",
        text: "text-blue-800",
        ring: "ring-blue-200",
      },
      Material: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        ring: "ring-purple-200",
      },
    };

    const config = typeConfig[type] || typeConfig.Labour;

    return (
      <span
        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.text} ring-1 ring-inset ${config.ring}`}
      >
        {type}
      </span>
    );
  };

  // Calculate totals
  const calculateTotals = () => {
    const totals = changes.reduce(
      (acc, change) => {
        acc.total += change.cost;
        if (change.status === "Accepted") {
          acc.accepted += change.cost;
        } else if (change.status === "Review") {
          acc.pending += change.cost;
        }
        return acc;
      },
      { total: 0, accepted: 0, pending: 0 },
    );

    return totals;
  };

  const totals = calculateTotals();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Project Changes</h2>
        <p className="text-sm text-gray-600">
          Manage changes and extra costs for {userName || "this project"}
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">Total Changes</p>
              <p className="text-2xl font-bold text-blue-900">
                {changes.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Accepted</p>
              <p className="text-2xl font-bold text-green-900">
                {formatCurrency(totals.accepted)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-yellow-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-900">
                {formatCurrency(totals.pending)}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
              <svg
                className="h-5 w-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Total Value</p>
              <p className="text-lg font-bold text-purple-900">
                {formatCurrency(totals.total)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div>
          <button
            onClick={() =>
              setChangeModal({ isOpen: true, change: null, mode: "create" })
            }
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Add Change
          </button>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={loadChanges}
            disabled={loading}
            className="inline-flex items-center rounded-lg bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <svg
              className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Changes Table */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Changes List</h3>
          <p className="mt-1 text-sm text-gray-600">
            All project changes and extra costs
          </p>
        </div>
        <div className="overflow-x-auto">
          <div className="min-w-[800px]">
            {changes.length === 0 ? (
              <div className="px-6 py-12 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
                  <svg
                    className="h-6 w-6 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900">
                  No changes yet
                </h3>
                <p className="mt-2 text-gray-600">
                  Add your first project change to get started.
                </p>
                <button
                  onClick={() =>
                    setChangeModal({
                      isOpen: true,
                      change: null,
                      mode: "create",
                    })
                  }
                  className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Add Change
                </button>
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {changes.map((change) => (
                  <div
                    key={change.id}
                    className="cursor-pointer px-6 py-4 transition-colors hover:bg-gray-50"
                    onClick={() =>
                      setChangeModal({ isOpen: true, change, mode: "view" })
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                          <span className="text-sm font-semibold text-gray-600">
                            #{change.changeNumber}
                          </span>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h4 className="truncate text-sm font-medium text-gray-900">
                            {change.name}
                          </h4>
                          {change.description && (
                            <p className="mt-1 truncate text-xs text-gray-500">
                              {change.description}
                            </p>
                          )}
                          <div className="mt-2 flex items-center space-x-2">
                            {getStatusBadge(change.status)}
                            {getTypeBadge(change.type)}
                            <span className="text-xs text-gray-500">
                              {change.includedInPaymentPlan}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="text-right">
                          <p className="text-sm font-semibold text-gray-900">
                            {formatCurrency(change.cost)}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setChangeModal({
                                isOpen: true,
                                change,
                                mode: "edit",
                              });
                            }}
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            Edit
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleChangeDelete(change.id);
                            }}
                            className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Change Modal */}
      <ChangeModal
        key={changeModal.change?.id || "new"}
        isOpen={changeModal.isOpen}
        change={changeModal.change}
        mode={changeModal.mode}
        onClose={() =>
          setChangeModal({ isOpen: false, change: null, mode: "create" })
        }
        onSave={handleChangeSave}
      />
    </div>
  );
}
