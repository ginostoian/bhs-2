"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import CreateMoodboardModal from "./CreateMoodboardModal";

/**
 * Admin Moodboards Client Component
 * Manages moodboards with creation and overview capabilities
 */
export default function AdminMoodboardsClient({
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

  // Open delete confirmation modal
  const openDeleteModal = (moodboard) => {
    setModalState({
      isOpen: true,
      title: "Delete Moodboard",
      message: `Are you sure you want to delete "${moodboard.name}" for ${moodboard.user.name || moodboard.user.email}? This action cannot be undone.`,
      type: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => handleDeleteMoodboard(moodboard.id),
    });
  };

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      shared: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  // Get project status badge styling
  const getProjectStatusBadge = (status) => {
    const styles = {
      Lead: "bg-blue-100 text-blue-800",
      "On Going": "bg-yellow-100 text-yellow-800",
      Finished: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div>
      {/* Header with Create Button */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900">
            Moodboards ({filteredMoodboards.length})
          </h3>
          <p className="text-sm text-gray-600">
            Total moodboards: {moodboards.length}
          </p>
        </div>
        <button
          onClick={() => setCreateModal({ isOpen: true })}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
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
          Create Moodboard
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search moodboards..."
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="shared">Shared</option>
              <option value="approved">Approved</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              User
            </label>
            <select
              value={filterUser}
              onChange={(e) => setFilterUser(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Users</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setFilterStatus("all");
                setFilterUser("");
                setSearchTerm("");
              }}
              className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
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
                  href={`/admin/moodboards/${moodboard.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline"
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
            <div className="mb-4 space-y-2 text-sm text-gray-500">
              <div className="flex items-center space-x-2">
                <span>📅</span>
                <span>Updated: {formatDate(moodboard.updatedAt)}</span>
              </div>
              {moodboard.notes && (
                <div className="flex items-start space-x-2">
                  <span>📝</span>
                  <span className="line-clamp-2">{moodboard.notes}</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Link
                href={`/admin/moodboards/${moodboard.id}`}
                className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-blue-700"
              >
                Manage
              </Link>
              <button
                onClick={() => openDeleteModal(moodboard)}
                className="flex-1 rounded-md bg-red-600 px-3 py-2 text-sm font-medium text-white hover:bg-red-700"
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
          <div className="mb-4 text-6xl">🎨</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No moodboards found
          </h3>
          <p className="text-gray-600">
            {moodboards.length === 0
              ? "Get started by creating your first moodboard for a user."
              : "Try adjusting your filters to see more moodboards."}
          </p>
        </div>
      )}

      {/* Create Moodboard Modal */}
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
        onConfirm={() => {
          if (modalState.onConfirm) {
            modalState.onConfirm();
          }
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          });
        }}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </div>
  );
}
