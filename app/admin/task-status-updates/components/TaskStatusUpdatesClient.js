"use client";

import { useState } from "react";

/**
 * Task Status Updates Client Component
 * Allows admins to review and approve/reject pending status update requests
 */
export default function TaskStatusUpdatesClient({ pendingRequests }) {
  const [requests, setRequests] = useState(pendingRequests);
  const [processing, setProcessing] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [adminNotes, setAdminNotes] = useState("");

  const handleAction = async (requestId, action) => {
    setProcessing(requestId);

    try {
      const response = await fetch("/api/admin/task-status-updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action,
          adminNotes: adminNotes.trim(),
        }),
      });

      const result = await response.json();

      if (response.ok) {
        // Remove the processed request from the list
        setRequests((prev) => prev.filter((req) => req.id !== requestId));
        setShowModal(false);
        setSelectedRequest(null);
        setAdminNotes("");

        // Show success message
        alert(`Request ${action}d successfully!`);
      } else {
        alert(result.error || `Failed to ${action} request`);
      }
    } catch (error) {
      alert(`An error occurred while ${action}ing the request`);
    } finally {
      setProcessing(null);
    }
  };

  const openModal = (request, action) => {
    setSelectedRequest({ ...request, action });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedRequest(null);
    setAdminNotes("");
  };

  const getStatusBadge = (status) => {
    const badges = {
      Scheduled: "bg-gray-100 text-gray-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Done: "bg-green-100 text-green-800",
      Blocked: "bg-red-100 text-red-800",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[status]}`}
      >
        {status}
      </span>
    );
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (requests.length === 0) {
    return (
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <svg
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No pending requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            All task status update requests have been processed.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Requests List */}
      <div className="rounded-lg bg-white shadow">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">
            Pending Requests ({requests.length})
          </h3>
          <div className="mt-4 space-y-4">
            {requests.map((request) => (
              <div
                key={request.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h4 className="font-medium text-gray-900">
                        {request.task?.name || "Unknown Task"}
                      </h4>
                      <span className="text-sm text-gray-500">
                        by {request.requestedBy?.name || "Unknown Employee"}
                      </span>
                    </div>

                    <div className="mt-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">From:</span>
                        {getStatusBadge(request.currentStatus)}
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-500">To:</span>
                        {getStatusBadge(request.requestedStatus)}
                      </div>
                    </div>

                    {request.employeeNotes && (
                      <div className="mt-2">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Employee Notes:</span>{" "}
                          {request.employeeNotes}
                        </p>
                      </div>
                    )}

                    <div className="mt-2 text-xs text-gray-500">
                      Requested: {formatDate(request.requestedAt)}
                    </div>
                  </div>

                  <div className="ml-4 flex space-x-2">
                    <button
                      onClick={() => openModal(request, "approve")}
                      disabled={processing === request.id}
                      className="rounded-md bg-green-600 px-3 py-1 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {processing === request.id ? "Processing..." : "Approve"}
                    </button>
                    <button
                      onClick={() => openModal(request, "reject")}
                      disabled={processing === request.id}
                      className="rounded-md bg-red-600 px-3 py-1 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {processing === request.id ? "Processing..." : "Reject"}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeModal}
            ></div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-yellow-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      {selectedRequest.action === "approve"
                        ? "Approve Status Update"
                        : "Reject Status Update"}
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Are you sure you want to{" "}
                        <span className="font-medium">
                          {selectedRequest.action}
                        </span>{" "}
                        this status update request?
                      </p>
                      <div className="mt-3 rounded-md bg-gray-50 p-3">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Task:</span>{" "}
                          {selectedRequest.task?.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Employee:</span>{" "}
                          {selectedRequest.requestedBy?.name}
                        </p>
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Status Change:</span>{" "}
                          {selectedRequest.currentStatus} →{" "}
                          {selectedRequest.requestedStatus}
                        </p>
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="adminNotes"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Notes (optional)
                      </label>
                      <textarea
                        id="adminNotes"
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        placeholder="Add any notes about your decision..."
                        value={adminNotes}
                        onChange={(e) => setAdminNotes(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() =>
                    handleAction(selectedRequest.id, selectedRequest.action)
                  }
                  disabled={processing === selectedRequest.id}
                  className={`inline-flex w-full justify-center rounded-md border border-transparent px-4 py-2 text-base font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm ${
                    selectedRequest.action === "approve"
                      ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                      : "bg-red-600 hover:bg-red-700 focus:ring-red-500"
                  } disabled:opacity-50`}
                >
                  {processing === selectedRequest.id
                    ? "Processing..."
                    : selectedRequest.action === "approve"
                      ? "Approve"
                      : "Reject"}
                </button>
                <button
                  type="button"
                  onClick={closeModal}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
