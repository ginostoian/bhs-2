"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import CreateMoodboardModal from "./CreateMoodboardModal";

/**
 * Designer Moodboards Client Component
 * Manages moodboards with creation and overview capabilities
 */
export default function DesignerMoodboardsClient({
  moodboards: initialMoodboards,
  users,
}) {
  const [moodboards, setMoodboards] = useState(initialMoodboards);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });
  const [createModal, setCreateModal] = useState({
    isOpen: false,
  });

  // Filter states
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterUser, setFilterUser] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter moodboards
  const filteredMoodboards = moodboards.filter((moodboard) => {
    const matchesStatus =
      filterStatus === "all" || moodboard.status === filterStatus;
    const matchesUser = !filterUser || moodboard.user.id === filterUser;
    const matchesSearch =
      !searchTerm ||
      moodboard.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moodboard.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      moodboard.user.email.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesStatus && matchesUser && matchesSearch;
  });

  // Handle moodboard creation
  const handleCreateMoodboard = async (moodboardData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/moodboards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(moodboardData),
      });

      if (!response.ok) throw new Error("Failed to create moodboard");

      const { moodboard } = await response.json();
      setMoodboards((prev) => [moodboard, ...prev]);
      setCreateModal({ isOpen: false });
    } catch (error) {
      console.error("Error creating moodboard:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to create moodboard. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle moodboard deletion
  const handleDeleteMoodboard = async (moodboardId) => {
    try {
      const response = await fetch(`/api/moodboards/${moodboardId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Failed to delete moodboard");

      setMoodboards((prev) => prev.filter((m) => m.id !== moodboardId));
      setModalState({
        isOpen: false,
        title: "",
        message: "",
        type: "alert",
        confirmText: "OK",
      });
    } catch (error) {
      console.error("Error deleting moodboard:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete moodboard. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  };

  // Status badge component
  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { bg: "bg-gray-100", text: "text-gray-800", label: "Draft" },
      shared: { bg: "bg-blue-100", text: "text-blue-800", label: "Shared" },
      approved: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Approved",
      },
      completed: {
        bg: "bg-purple-100",
        text: "text-purple-800",
        label: "Completed",
      },
    };

    const config = statusConfig[status] || statusConfig.draft;
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  // Project status badge component
  const getProjectStatusBadge = (projectStatus) => {
    const statusConfig = {
      Lead: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Lead" },
      "On Going": {
        bg: "bg-blue-100",
        text: "text-blue-800",
        label: "On Going",
      },
      Finished: {
        bg: "bg-green-100",
        text: "text-green-800",
        label: "Finished",
      },
    };

    const config = statusConfig[projectStatus] || statusConfig.Lead;
    return (
      <span
        className={`rounded-full px-2 py-1 text-xs font-medium ${config.bg} ${config.text}`}
      >
        {config.label}
      </span>
    );
  };

  return (
    <div>
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            All Moodboards ({filteredMoodboards.length})
          </h3>
          <p className="text-sm text-gray-600">
            Manage and organize moodboards for client projects
          </p>
        </div>
        <button
          onClick={() => setCreateModal({ isOpen: true })}
          className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
              d="M12 4v16m8-8H4"
            />
          </svg>
          Create Moodboard
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Status
          </label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          >
            <option value="all">All Statuses</option>
            <option value="draft">Draft</option>
            <option value="shared">Shared</option>
            <option value="approved">Approved</option>
            <option value="completed">Completed</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            User
          </label>
          <select
            value={filterUser}
            onChange={(e) => setFilterUser(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          >
            <option value="">All Users</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.name || user.email}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search moodboards..."
            className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Moodboards Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredMoodboards.map((moodboard) => (
          <div
            key={moodboard.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Moodboard Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <Link
                  href={`/designer/moodboards/${moodboard.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-purple-600 hover:underline"
                >
                  {moodboard.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {moodboard.user.name || moodboard.user.email}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                {getStatusBadge(moodboard.status)}
                {getProjectStatusBadge(moodboard.user.projectStatus)}
              </div>
            </div>

            {/* Moodboard Details */}
            {moodboard.description && (
              <div className="mb-4">
                <p className="text-sm text-gray-600">{moodboard.description}</p>
              </div>
            )}

            {moodboard.projectType && (
              <div className="mb-4">
                <p className="text-sm text-gray-500">
                  <strong>Project:</strong> {moodboard.projectType}
                </p>
              </div>
            )}

            {/* Moodboard Info */}
            <div className="mb-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Created:</span>
                <span className="text-gray-900">
                  {new Date(moodboard.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Updated:</span>
                <span className="text-gray-900">
                  {new Date(moodboard.updatedAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between border-t border-gray-200 pt-4">
              <Link
                href={`/designer/moodboards/${moodboard.id}`}
                className="text-sm font-medium text-purple-600 hover:text-purple-500"
              >
                View Details
              </Link>
              <button
                onClick={() => {
                  setModalState({
                    isOpen: true,
                    title: "Delete Moodboard",
                    message: `Are you sure you want to delete "${moodboard.name}"? This action cannot be undone.`,
                    type: "confirm",
                    confirmText: "Delete",
                    onConfirm: () => handleDeleteMoodboard(moodboard.id),
                  });
                }}
                className="text-sm font-medium text-red-600 hover:text-red-500"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMoodboards.length === 0 && (
        <div className="py-12 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No moodboards
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchTerm || filterStatus !== "all" || filterUser
              ? "No moodboards match your current filters."
              : "Get started by creating a new moodboard."}
          </p>
          {!searchTerm && filterStatus === "all" && !filterUser && (
            <div className="mt-6">
              <button
                onClick={() => setCreateModal({ isOpen: true })}
                className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Moodboard
              </button>
            </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <CreateMoodboardModal
        isOpen={createModal.isOpen}
        onClose={() => setCreateModal({ isOpen: false })}
        onSubmit={handleCreateMoodboard}
        users={users}
        isSubmitting={isSubmitting}
      />

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
        title={modalState.title}
        message={modalState.message}
        type={modalState.type}
        confirmText={modalState.confirmText}
        onConfirm={modalState.onConfirm}
      />
    </div>
  );
}
