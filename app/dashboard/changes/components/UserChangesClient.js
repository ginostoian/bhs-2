"use client";

import { useState, useEffect } from "react";
import UserChangeModal from "./UserChangeModal";

/**
 * User Changes Client Component
 * Displays project changes for users with read-only view and accept/decline capabilities
 */
export default function UserChangesClient({ changes: initialChanges }) {
  const [changes, setChanges] = useState(initialChanges || []);
  const [loading, setLoading] = useState(false);
  const [changeModal, setChangeModal] = useState({
    isOpen: false,
    change: null,
  });

  // Load changes from API
  const loadChanges = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/users/changes", {
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

  // Handle change status update (accept/decline)
  const handleChangeStatusUpdate = async (changeId, status) => {
    try {
      // Find the change to get the project ID
      const change = changes.find((c) => c.id === changeId);
      if (!change) return;

      const response = await fetch(
        `/api/projects/${change.project.id}/changes/${changeId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify({ status }),
        },
      );

      if (response.ok) {
        await loadChanges(); // Reload changes
      } else {
        console.error("Failed to update change status:", response.status);
      }
    } catch (error) {
      console.error("Error updating change status:", error);
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

  // Filter changes by status
  const pendingChanges = changes.filter((change) => change.status === "Review");
  const completedChanges = changes.filter(
    (change) => change.status !== "Review",
  );

  return (
    <div className="space-y-6">
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
              <p className="text-sm font-medium text-yellow-600">
                Pending Review
              </p>
              <p className="text-2xl font-bold text-yellow-900">
                {pendingChanges.length}
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
      <div className="flex justify-end">
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

      {/* Pending Changes */}
      {pendingChanges.length > 0 && (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Pending Review
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Changes awaiting your approval or decline
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="divide-y divide-gray-200">
                {pendingChanges.map((change) => (
                  <div
                    key={change.id}
                    className="px-6 py-4 transition-colors hover:bg-gray-50"
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
                          {change.project && (
                            <p className="mt-1 text-xs text-gray-500">
                              Project: {change.project.name}
                            </p>
                          )}
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
                            onClick={() =>
                              setChangeModal({ isOpen: true, change })
                            }
                            className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            View
                          </button>
                          <button
                            onClick={() =>
                              handleChangeStatusUpdate(change.id, "Accepted")
                            }
                            className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-500"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() =>
                              handleChangeStatusUpdate(change.id, "Declined")
                            }
                            className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            Decline
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Completed Changes */}
      {completedChanges.length > 0 && (
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          <div className="border-b border-gray-200 px-6 py-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Completed Changes
            </h3>
            <p className="mt-1 text-sm text-gray-600">
              Changes that have been accepted or declined
            </p>
          </div>
          <div className="overflow-x-auto">
            <div className="min-w-[800px]">
              <div className="divide-y divide-gray-200">
                {completedChanges.map((change) => (
                  <div
                    key={change.id}
                    className="cursor-pointer px-6 py-4 transition-colors hover:bg-gray-50"
                    onClick={() => setChangeModal({ isOpen: true, change })}
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
                          {change.project && (
                            <p className="mt-1 text-xs text-gray-500">
                              Project: {change.project.name}
                            </p>
                          )}
                          {change.decisionDate && (
                            <p className="mt-1 text-xs text-gray-500">
                              Decided:{" "}
                              {new Date(change.decisionDate).toLocaleDateString(
                                "en-GB",
                              )}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-semibold text-gray-900">
                          {formatCurrency(change.cost)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {changes.length === 0 && (
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-400"
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
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No changes yet
          </h3>
          <p className="mb-6 text-gray-600">
            When project changes are added, they will appear here for your
            review.
          </p>
        </div>
      )}

      {/* Change Modal */}
      <UserChangeModal
        isOpen={changeModal.isOpen}
        change={changeModal.change}
        onClose={() => setChangeModal({ isOpen: false, change: null })}
        onStatusUpdate={handleChangeStatusUpdate}
      />
    </div>
  );
}
