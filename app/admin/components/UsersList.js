"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";

/**
 * Users List Component
 * Displays all users with management capabilities
 */
export default function UsersList({ users: initialUsers }) {
  const [users, setUsers] = useState(initialUsers);
  const [filteredUsers, setFilteredUsers] = useState(initialUsers);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    userId: null,
    userName: "",
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    user: null,
  });

  // Initialize filtered users when component mounts or users change
  useEffect(() => {
    console.log(
      "Initializing users:",
      initialUsers.map((u) => ({
        id: u.id,
        name: u.name,
        projectStatus: u.projectStatus,
      })),
    );
    setUsers(initialUsers);
    filterUsers(statusFilter, searchTerm);
  }, [initialUsers, statusFilter, searchTerm]);

  // Filter users based on status and search term
  const filterUsers = (status, search = searchTerm) => {
    console.log("Filtering users by status:", status, "and search:", search);
    console.log(
      "Available users:",
      users.map((u) => ({
        id: u.id,
        name: u.name,
        projectStatus: u.projectStatus,
      })),
    );

    let filtered = users;

    // Filter by status
    if (status !== "All") {
      filtered = filtered.filter((user) => user.projectStatus === status);
    }

    // Filter by search term
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter((user) => {
        const nameMatch = (user.name || "").toLowerCase().includes(searchLower);
        const emailMatch = (user.email || "")
          .toLowerCase()
          .includes(searchLower);
        return nameMatch || emailMatch;
      });
    }

    console.log(
      "Filtered users:",
      filtered.map((u) => ({
        id: u.id,
        name: u.name,
        projectStatus: u.projectStatus,
      })),
    );
    setFilteredUsers(filtered);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    filterUsers(status, searchTerm);
  };

  // Handle search term change
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    filterUsers(statusFilter, newSearchTerm);
  };

  // Handle status update
  const handleStatusUpdate = async (userId, newStatus) => {
    console.log("Updating user status:", userId, "to:", newStatus);

    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ projectStatus: newStatus }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || "Failed to update user status");
      }

      const { user } = await response.json();
      console.log("Updated user data:", user);

      // Update user in state
      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, ...user } : u,
      );
      console.log(
        "Updated users state:",
        updatedUsers.map((u) => ({
          id: u.id,
          name: u.name,
          projectStatus: u.projectStatus,
        })),
      );
      setUsers(updatedUsers);

      // Update filtered users
      filterUsers(statusFilter);

      setEditModal({ isOpen: false, user: null });
    } catch (error) {
      console.error("Error updating user status:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to update user status. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      Lead: "bg-blue-100 text-blue-800",
      "On Going": "bg-yellow-100 text-yellow-800",
      Finished: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || "bg-gray-100 text-gray-800"}`}
      >
        {status || "Lead"}
      </span>
    );
  };

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

      {/* Filter Controls */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                {["All", "Lead", "On Going", "Finished"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={`rounded-full px-3 py-1 text-sm font-medium transition-colors ${
                      statusFilter === status
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by name or email..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-64"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        </div>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">👥</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {users.length === 0
              ? "No users found"
              : "No users match your filters"}
          </h3>
          <p className="text-gray-600">
            {users.length === 0
              ? "No users have registered yet."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Users List */}
          {filteredUsers.map((user) => (
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
                    <div className="mb-2">
                      Role:{" "}
                      <span className="font-medium">{user.role || "user"}</span>
                    </div>
                    <div className="mb-2">
                      Joined: {formatDate(user.createdAt)}
                    </div>
                    <div className="flex items-center space-x-2">
                      <span>Status:</span>
                      {getStatusBadge(user.projectStatus)}
                      <button
                        onClick={() => setEditModal({ isOpen: true, user })}
                        className="ml-2 text-xs text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        Edit
                      </button>
                    </div>
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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-5">
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
          <div className="rounded-lg bg-blue-100 p-4">
            <div className="text-2xl font-bold text-blue-700">
              {users.filter((u) => u.projectStatus === "Lead").length}
            </div>
            <div className="text-sm text-blue-700">Leads</div>
          </div>
          <div className="rounded-lg bg-yellow-100 p-4">
            <div className="text-2xl font-bold text-yellow-700">
              {users.filter((u) => u.projectStatus === "On Going").length}
            </div>
            <div className="text-sm text-yellow-700">On Going</div>
          </div>
          <div className="rounded-lg bg-green-100 p-4">
            <div className="text-2xl font-bold text-green-700">
              {users.filter((u) => u.projectStatus === "Finished").length}
            </div>
            <div className="text-sm text-green-700">Finished</div>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editModal.isOpen && editModal.user && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Update Project Status
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              Update the project status for{" "}
              <span className="font-medium">
                {editModal.user.name || editModal.user.email}
              </span>
            </p>
            <div className="mb-6">
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project Status
              </label>
              <select
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                defaultValue={editModal.user.projectStatus || "Lead"}
                onChange={(e) => {
                  const newStatus = e.target.value;
                  console.log(
                    "Status changed to:",
                    newStatus,
                    "for user:",
                    editModal.user.id,
                  );
                  handleStatusUpdate(editModal.user.id, newStatus);
                }}
              >
                <option value="Lead">Lead</option>
                <option value="On Going">On Going</option>
                <option value="Finished">Finished</option>
              </select>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setEditModal({ isOpen: false, user: null })}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

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
