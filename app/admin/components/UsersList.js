"use client";

import { useState } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";

/**
 * Users List Component
 * Displays all users with management capabilities
 */
export default function UsersList({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete user");
      }

      // Remove user from state
      setUsers(users.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      // Show error modal
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete user. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (userId, userName) => {
    setModalState({
      isOpen: true,
      userId,
      userName,
      title: "Delete User",
      message: `Are you sure you want to delete ${userName || "this user"}? This action cannot be undone.`,
      type: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
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

  return (
    <div>
      <div className="mb-8">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">
          User Management
        </h2>
        <p className="text-gray-600">View and manage all registered users</p>
      </div>

      {users.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">👥</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No users found
          </h3>
          <p className="text-gray-600">No users have registered yet.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Users List */}
          {users.map((user) => (
            <div
              key={user.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-4 flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500 text-sm font-medium text-white">
                        {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                      </div>
                    </div>
                    <div>
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="text-lg font-medium text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {user.name || "Unknown User"}
                      </Link>
                      <div className="text-sm text-gray-500">{user.email}</div>
                    </div>
                  </div>

                  <div className="mb-3 text-sm text-gray-600">
                    <div>
                      Role:{" "}
                      <span className="font-medium">{user.role || "user"}</span>
                    </div>
                    <div>Joined: {formatDate(user.createdAt)}</div>
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <Link
                    href={`/admin/users/${user.id}`}
                    className="rounded-md border border-blue-300 bg-blue-50 px-3 py-1 text-sm font-medium text-blue-700 hover:bg-blue-100"
                  >
                    View Details
                  </Link>
                  <button
                    onClick={() =>
                      openDeleteModal(user.id, user.name || user.email)
                    }
                    disabled={isDeleting}
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Statistics */}
      <div className="mt-8 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Statistics</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {users.length}
            </div>
            <div className="text-sm text-blue-600">Total Users</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {users.filter((u) => u.role === "admin").length}
            </div>
            <div className="text-sm text-green-600">Admin Users</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {users.length > 0 ? formatDate(users[0].createdAt) : "N/A"}
            </div>
            <div className="text-sm text-purple-600">Latest User</div>
          </div>
        </div>
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({ isOpen: false, userId: null, userName: "" })
        }
        onConfirm={() => {
          if (modalState.userId && modalState.type === "confirm") {
            handleDeleteUser(modalState.userId);
          }
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
