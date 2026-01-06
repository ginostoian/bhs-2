"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";

const PAGE_SIZE = 12;

/**
 * Users List Component
 * Displays all users with premium glassmorphism design
 */
export default function UsersList({ users: initialUsers, totalUsers = 0 }) {
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
  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(totalUsers || initialUsers.length); // Use totalUsers prop
  const [loading, setLoading] = useState(false);

  // Fetch users from API with pagination and search
  const fetchUsers = async (
    pageNum = 1,
    search = "",
    status = statusFilter,
  ) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: pageNum,
        limit: PAGE_SIZE,
      });
      if (search) params.set("search", search);
      const res = await fetch(`/api/users?${params.toString()}`);
      const data = await res.json();
      let users = data.users || [];
      // Filter by status on client (since projectStatus is not indexed for $or)
      if (status !== "All") {
        users = users.filter((user) => user.projectStatus === status);
      }
      setUsers(users);
      setFilteredUsers(users);
      setTotalCount(data.totalCount || 0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch users when page, search, or status changes
  useEffect(() => {
    if (searchTerm || page > 1 || statusFilter !== "All") {
      fetchUsers(page, searchTerm, statusFilter);
    } else {
      // Use initial data if on page 1 and no filters
      let filtered = initialUsers;
       if (statusFilter !== "All") {
        filtered = initialUsers.filter(
          (user) => user.projectStatus === statusFilter,
        );
      }
      setFilteredUsers(filtered);
      // Only set total count if we haven't fetched from API yet (approximate)
      if (initialUsers.length < PAGE_SIZE) {
          setTotalCount(initialUsers.length);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, searchTerm, statusFilter]);

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setPage(1);
  };

  // Handle search term change
  const handleSearchChange = (newSearchTerm) => {
    setSearchTerm(newSearchTerm);
    setPage(1);
  };

  // Pagination controls
  const totalPages = Math.ceil(totalCount / PAGE_SIZE);
  const canPrev = page > 1;
  const canNext = page < totalPages;

  // Handle status update
  const handleStatusUpdate = async (userId, newStatus) => {
    try {
      const response = await fetch(`/api/users/${userId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projectStatus: newStatus }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      const { user } = await response.json();

      const updatedUsers = users.map((u) =>
        u.id === userId ? { ...u, ...user } : u,
      );
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers.filter(u => statusFilter === "All" || u.projectStatus === statusFilter));
      setEditModal({ isOpen: false, user: null });
    } catch (error) {
      console.error("Error updating user status:", error);
      alert("Failed to update status");
    }
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      Lead: "bg-blue-100 text-blue-700 border-blue-200",
      "On Going": "bg-yellow-100 text-yellow-700 border-yellow-200",
      Finished: "bg-green-100 text-green-700 border-green-200",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold border ${styles[status] || "bg-gray-100 text-gray-800 border-gray-200"}`}
      >
        {status || "Lead"}
      </span>
    );
  };

  // Handle user deletion
  const handleDeleteUser = async (userId) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/users/${userId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete user");
      setUsers(users.filter((user) => user.id !== userId));
      setFilteredUsers(filteredUsers.filter((user) => user.id !== userId));
    } catch (error) {
      console.error("Error deleting user:", error);
      alert("Failed to delete user");
    } finally {
      setIsDeleting(false);
    }
  };


  return (
    <div className="space-y-6">
      {/* Filter Bar */}
      <div className="rounded-2xl border border-gray-100 bg-white/70 backdrop-blur-md p-4 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            {/* Search */}
            <div className="relative w-full md:w-64">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-400">🔍</span>
                </div>
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    placeholder="Search users..."
                    className="block w-full rounded-xl border-gray-200 bg-white/50 pl-10 pr-3 py-2 text-sm placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
                />
            </div>
          
            {/* Status Filter */}
            <div className="flex flex-wrap items-center gap-2">
                {["All", "Lead", "On Going", "Finished"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusFilterChange(status)}
                    className={`rounded-full px-4 py-1.5 text-xs font-bold transition-all ${
                      statusFilter === status
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                        : "bg-white text-gray-600 hover:bg-gray-50 border border-gray-100"
                    }`}
                  >
                    {status}
                  </button>
                ))}
            </div>
        </div>
      </div>

      {/* Grid */}
      {filteredUsers.length === 0 && !loading ? (
        <div className="py-12 text-center rounded-2xl bg-white/40 border border-dashed border-gray-200">
          <div className="text-4xl mb-3">👥</div>
          <h3 className="text-lg font-bold text-gray-900">No users found</h3>
          <p className="text-gray-500 text-sm">Try adjusting your filters.</p>
        </div>
      ) : loading ? (
        <div className="py-20 text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
             {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="group relative flex flex-col rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-blue-100"
              >
                 <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className={`flex h-10 w-10 items-center justify-center rounded-full text-lg font-bold text-white shadow-sm ${
                            user.role === 'admin' ? 'bg-gradient-to-br from-purple-500 to-indigo-600' : 'bg-gradient-to-br from-blue-400 to-blue-600'
                        }`}>
                          {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
                        </div>
                        <div className="min-w-0">
                            <Link href={`/admin/users/${user.id}`} className="block truncate text-sm font-bold text-gray-900 hover:text-blue-600 transition-colors">
                                {user.name || "Unknown User"}
                            </Link>
                            <div className="truncate text-xs text-gray-500">{user.email}</div>
                        </div>
                    </div>
                    {user.role === 'admin' && (
                        <span className="text-[10px] font-bold uppercase tracking-wider text-purple-600 bg-purple-50 px-2 py-1 rounded-md">Admin</span>
                    )}
                 </div>

                 <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Status</span>
                        <button 
                            onClick={() => setEditModal({ isOpen: true, user })}
                            className="hover:opacity-80 transition-opacity"
                        >
                            {getStatusBadge(user.projectStatus)}
                        </button>
                    </div>
                     <div className="flex items-center justify-between text-xs">
                        <span className="text-gray-500 font-medium">Joined</span>
                        <span className="text-gray-700">{new Date(user.createdAt).toLocaleDateString('en-GB')}</span>
                    </div>
                     {(user.phone || user.address) && (
                        <div className="pt-3 border-t border-gray-50 space-y-1">
                             {user.phone && <div className="text-xs text-gray-600 flex items-center gap-2"><span className="opacity-50">📞</span> {user.phone}</div>}
                             {user.address && <div className="text-xs text-gray-600 flex items-center gap-2 truncate"><span className="opacity-50">📍</span> {user.address}</div>}
                        </div>
                     )}
                 </div>

                 <div className="mt-auto pt-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <Link href={`/admin/users/${user.id}`} className="flex-1 rounded-lg border border-gray-200 bg-white py-1.5 text-center text-xs font-bold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm">
                        View Profile
                    </Link>
                    <button 
                         onClick={() => setModalState({
                            isOpen: true,
                            userId: user.id,
                            userName: user.name || user.email,
                            title: "Delete User",
                            message: `Are you sure you want to delete ${user.name}? This cannot be undone.`,
                            type: "confirm",
                            confirmText: "Delete",
                            cancelText: "Cancel"
                          })}
                        disabled={isDeleting}
                        className="rounded-lg border border-red-100 bg-red-50 p-1.5 text-red-600 hover:bg-red-100 transition-colors"
                    >
                        🗑️
                    </button>
                 </div>
              </div>
             ))}
        </div>
      )}

      {/* Pagination */}
       {totalPages > 1 && (
        <div className="flex justify-center mt-8">
            <nav className="flex items-center gap-2 rounded-xl bg-white p-1 border border-gray-100 shadow-sm">
                <button
                    onClick={() => canPrev && setPage(page - 1)}
                    disabled={!canPrev}
                    className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                >
                    Previous
                </button>
                <div className="h-4 w-px bg-gray-200"></div>
                <span className="px-3 text-xs font-bold text-gray-900">Page {page} of {totalPages}</span>
                <div className="h-4 w-px bg-gray-200"></div>
                <button
                    onClick={() => canNext && setPage(page + 1)}
                    disabled={!canNext}
                    className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-gray-900 disabled:opacity-30 transition-colors"
                >
                    Next
                </button>
            </nav>
        </div>
       )}

      {/* Edit Modal */}
      {editModal.isOpen && editModal.user && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
           <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl border border-gray-100">
             <h3 className="text-lg font-bold text-gray-900 mb-1">Update Status</h3>
             <p className="text-sm text-gray-500 mb-6">Change project status for <span className="font-semibold text-gray-700">{editModal.user.name}</span></p>
             
             <div className="space-y-4">
                <div className="grid grid-cols-1 gap-2">
                    {["Lead", "On Going", "Finished"].map(status => (
                        <button
                            key={status}
                            onClick={() => handleStatusUpdate(editModal.user.id, status)}
                            className={`w-full p-3 rounded-xl border text-sm font-bold transition-all flex items-center justify-between ${
                                editModal.user.projectStatus === status 
                                ? 'border-blue-500 bg-blue-50 text-blue-700 ring-2 ring-blue-100 ring-offset-1' 
                                : 'border-gray-200 bg-white text-gray-600 hover:border-gray-300'
                            }`}
                        >
                            {status}
                            {editModal.user.projectStatus === status && <span>✓</span>}
                        </button>
                    ))}
                </div>
                <button 
                    onClick={() => setEditModal({isOpen: false, user: null})}
                    className="w-full py-2.5 text-sm font-medium text-gray-500 hover:text-gray-800 transition-colors"
                >
                    Cancel
                </button>
             </div>
           </div>
         </div>
      )}

      {/* Alert/Confirm Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, userId: null, userName: "" })}
        onConfirm={() => {
          if (modalState.userId && modalState.type === "confirm") {
            handleDeleteUser(modalState.userId);
            setModalState({ isOpen: false });
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
