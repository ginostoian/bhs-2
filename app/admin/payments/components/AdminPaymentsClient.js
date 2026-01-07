"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import Modal from "@/components/Modal";

/**
 * Admin Payments Client Component
 * Manages all payments with drag-and-drop reordering and CRUD operations
 */
export default function AdminPaymentsClient({
  payments: initialPayments,
  users,
}) {
  const [payments, setPayments] = useState(initialPayments);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    payment: null,
  });
  const [createModal, setCreateModal] = useState({
    isOpen: false,
  });
  const [bulkCreateModal, setBulkCreateModal] = useState({
    isOpen: false,
  });

  // New state for filtering, pagination, and collapsible tables
  const [filterStatus, setFilterStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Show 5 user groups per page
  const [collapsedUsers, setCollapsedUsers] = useState(new Set()); // All users start collapsed
  const [searchTerm, setSearchTerm] = useState("");

  // Filter users to show all potential clients for payment creation
  const availableUsers = users.filter((user) =>
    ["Lead", "Planning", "On Going", "Finished"].includes(
      user.projectStatus,
    ),
  );

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
  };

  // Format amount for display
  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      Scheduled: "bg-blue-100 text-blue-800",
      Due: "bg-yellow-100 text-yellow-800",
      Paid: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  // Group payments by user and project
  const groupedPayments = payments.reduce((groups, payment) => {
    const userId = payment.user?.id || payment.user?._id || "unknown";
    const projectId =
      payment.project?.id || payment.project?._id || "no-project";
    const groupKey = `${userId}_${projectId}`;
    const userName =
      payment.user?.name || payment.user?.email || "Unknown User";
    const projectName = payment.project?.name || "General / No Project";

    if (!groups[groupKey]) {
      groups[groupKey] = {
        user: payment.user,
        userId,
        userName,
        project: payment.project,
        projectName,
        payments: [],
      };
    }

    groups[groupKey].payments.push(payment);
    return groups;
  }, {});

  // Initialize all groups as collapsed if collapsedUsers is empty
  useEffect(() => {
    if (collapsedUsers.size === 0 && Object.keys(groupedPayments).length > 0) {
      const allGroupKeys = Object.keys(groupedPayments);
      setCollapsedUsers(new Set(allGroupKeys));
    }
  }, [groupedPayments, collapsedUsers.size]);

  // Filter and search logic
  const filteredGroupedPayments = Object.entries(groupedPayments)
    .filter(([groupKey, userGroup]) => {
      // Filter by user status
      if (filterStatus !== "all") {
        const userStatus = userGroup.user?.projectStatus || "Lead";
        if (filterStatus === "lead" && userStatus !== "Lead") return false;
        if (filterStatus === "onGoing" && userStatus !== "On Going")
          return false;
        if (filterStatus === "finished" && userStatus !== "Finished")
          return false;
      }

      // Filter by search term
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const userNameMatch = userGroup.userName
          .toLowerCase()
          .includes(searchLower);
        const projectNameMatch = userGroup.projectName
          .toLowerCase()
          .includes(searchLower);
        const paymentNameMatch = userGroup.payments.some((payment) =>
          payment.name.toLowerCase().includes(searchLower),
        );
        if (!userNameMatch && !paymentNameMatch && !projectNameMatch)
          return false;
      }

      return true;
    })
    .sort(([, a], [, b]) => a.userName.localeCompare(b.userName));

  // Pagination logic
  const totalPages = Math.ceil(filteredGroupedPayments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedGroupedPayments = filteredGroupedPayments.slice(
    startIndex,
    endIndex,
  );

  // Toggle collapse state for a group
  const toggleUserCollapse = (groupKey) => {
    setCollapsedUsers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(groupKey)) {
        newSet.delete(groupKey);
      } else {
        newSet.add(groupKey);
      }
      return newSet;
    });
  };

  // Reset pagination when filters change
  const handleFilterChange = (newFilter) => {
    setFilterStatus(newFilter);
    setCurrentPage(1);
  };

  const handleSearchChange = (newSearch) => {
    setSearchTerm(newSearch);
    setCurrentPage(1);
  };

  // Handle drag and drop reordering within a group
  const handleDragEnd = async (result) => {
    console.log("Drag end result:", result);

    if (!result.destination) {
      console.log("No destination, returning");
      return;
    }

    const { source, destination } = result;
    const sourceGroupKey = source.droppableId;
    const destGroupKey = destination.droppableId;

    // Only allow reordering within the same group
    if (sourceGroupKey !== destGroupKey) {
      console.log("Cannot move payments between groups");
      return;
    }

    const userGroup = groupedPayments[sourceGroupKey];
    if (!userGroup) return;

    const items = Array.from(userGroup.payments);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setPayments((prevPayments) => {
      const otherPayments = prevPayments.filter((p) => {
        const pUserId = p.user?.id || p.user?._id || "unknown";
        const pProjectId = p.project?.id || p.project?._id || "no-project";
        return `${pUserId}_${pProjectId}` !== sourceGroupKey;
      });
      return [...otherPayments, ...items];
    });

    // Update order and payment numbers in database
    try {
      const response = await fetch("/api/payments/reorder", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payments: items.map((item, index) => ({
            id: item.id,
            userId: userGroup.userId,
            order: index + 1,
            paymentNumber: index + 1,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder payments");
      }

      // Update local state with new order
      const updatedItems = items.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setPayments((prevPayments) => {
        const otherPayments = prevPayments.filter((p) => {
          const pUserId = p.user?.id || p.user?._id || "unknown";
          const pProjectId = p.project?.id || p.project?._id || "no-project";
          return `${pUserId}_${pProjectId}` !== sourceGroupKey;
        });
        return [...otherPayments, ...updatedItems];
      });

      console.log("Reorder successful");
    } catch (error) {
      console.error("Error reordering payment:", error);
      // Revert to original state on error
      setPayments(initialPayments);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to reorder payments. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  };

  // Handle payment deletion
  const handleDeletePayment = async (paymentId) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete payment");
      }

      // Remove payment from state
      setPayments(payments.filter((payment) => payment.id !== paymentId));
    } catch (error) {
      console.error("Error deleting payment:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete payment. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle payment update
  const handleUpdatePayment = async (paymentId, updatedData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Failed to update payment");
      }

      const { payment } = await response.json();

      // Update payment in state
      setPayments(
        payments.map((p) => (p.id === paymentId ? { ...p, ...payment } : p)),
      );

      setEditModal({ isOpen: false, payment: null });
    } catch (error) {
      console.error("Error updating payment:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to update payment. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle payment creation
  const handleCreatePayment = async (paymentData) => {
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        throw new Error("Failed to create payment");
      }

      const { payment } = await response.json();

      // Add payment to state
      setPayments([...payments, payment]);

      // Close modal for single payment creation
      if (!bulkCreateModal.isOpen) {
        setCreateModal({ isOpen: false });
      }

      return payment; // Return the created payment
    } catch (error) {
      console.error("Error creating payment:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to create payment. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
      throw error; // Re-throw to handle in bulk creation
    } finally {
      setIsSubmitting(false);
    }
  };

  // Open delete confirmation modal
  const openDeleteModal = (payment) => {
    setModalState({
      isOpen: true,
      title: "Delete Payment",
      message: `Are you sure you want to delete payment "${payment.name}"? This action cannot be undone.`,
      type: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
      onConfirm: () => handleDeletePayment(payment.id),
    });
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="mb-2 text-2xl font-bold text-gray-900">
              Payment Management
            </h2>
            <p className="text-gray-600">
              Manage payment schedules for all users
            </p>
          </div>
          <div className="flex space-x-2">
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
              Add Payment
            </button>
            <button
              onClick={() => setBulkCreateModal({ isOpen: true })}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
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
              Bulk Add
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Payment Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {payments.length}
            </div>
            <div className="text-sm text-blue-600">Total Payments</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {payments.filter((p) => p.status === "Paid").length}
            </div>
            <div className="text-sm text-green-600">Paid</div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {payments.filter((p) => p.status === "Due").length}
            </div>
            <div className="text-sm text-yellow-600">Due</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {payments.filter((p) => p.status === "Scheduled").length}
            </div>
            <div className="text-sm text-purple-600">Scheduled</div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-auto"
              >
                <option value="all">All Users</option>
                <option value="lead">Lead</option>
                <option value="onGoing">On Going</option>
                <option value="finished">Finished</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search by user name or payment name..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-64"
              />
            </div>
          </div>
          <div className="text-sm text-gray-600">
            Showing {filteredGroupedPayments.length} of{" "}
            {Object.keys(groupedPayments).length} users
          </div>
        </div>
      </div>

      {/* Payments Grouped by User */}
      {filteredGroupedPayments.length === 0 ? (
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
                d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            {Object.keys(groupedPayments).length === 0
              ? "No Payments Found"
              : "No Users Match Your Filters"}
          </h3>
          <p className="text-gray-600">
            {Object.keys(groupedPayments).length === 0
              ? "Create the first payment to get started."
              : "Try adjusting your search or filter criteria."}
          </p>
        </div>
      ) : (
        <>
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="space-y-6">
              {paginatedGroupedPayments.map(([groupKey, userGroup]) => {
                const isCollapsed = collapsedUsers.has(groupKey);
                const userStatus = userGroup.user?.projectStatus || "Lead";

                return (
                  <div
                    key={groupKey}
                    className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
                  >
                    {/* User Header - Clickable to toggle collapse */}
                    <div
                      className="cursor-pointer border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 transition-colors hover:from-gray-100 hover:to-gray-200"
                      onClick={() => toggleUserCollapse(groupKey)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <button className="text-gray-400 hover:text-gray-600">
                            <svg
                              className={`h-5 w-5 transform transition-transform ${
                                isCollapsed ? "" : "rotate-90"
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 5l7 7-7 7"
                              />
                            </svg>
                          </button>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-900">
                              {userGroup.userName}
                            </h3>
                            <div className="flex items-center space-x-2">
                              <span className="text-sm font-medium text-blue-600">
                                {userGroup.projectName}
                              </span>
                              <span className="text-sm text-gray-400">•</span>
                              <span className="text-sm text-gray-600">
                                {userGroup.payments.length} payment
                                {userGroup.payments.length !== 1 ? "s" : ""}
                              </span>
                              <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                                {userStatus}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-500">
                          {isCollapsed
                            ? "Click to expand"
                            : "Click to collapse"}
                        </div>
                      </div>
                    </div>

                    {/* User's Payments - Collapsible */}
                    {!isCollapsed && (
                      <div className="p-6">
                        {/* Payment Summary Cards for this user */}
                        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
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
                                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                                  />
                                </svg>
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-blue-600">
                                  Total Payments
                                </p>
                                <p className="text-2xl font-bold text-blue-900">
                                  {userGroup.payments.length}
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
                                <p className="text-sm font-medium text-green-600">
                                  Paid
                                </p>
                                <p className="text-2xl font-bold text-green-900">
                                  {
                                    userGroup.payments.filter(
                                      (p) => p.status === "Paid",
                                    ).length
                                  }
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
                                  Due
                                </p>
                                <p className="text-2xl font-bold text-yellow-900">
                                  {
                                    userGroup.payments.filter(
                                      (p) => p.status === "Due",
                                    ).length
                                  }
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
                                <p className="text-sm font-medium text-purple-600">
                                  Total Amount
                                </p>
                                <p className="text-lg font-bold text-purple-900">
                                  {formatAmount(
                                    userGroup.payments.reduce(
                                      (sum, p) => sum + p.amount,
                                      0,
                                    ),
                                  )}
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Payment Schedule with Drag & Drop */}
                        <Droppable droppableId={groupKey}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200"
                            >
                              <div className="border-b border-gray-200 px-6 py-4">
                                <h3 className="text-lg font-semibold text-gray-900">
                                  Payment Schedule
                                </h3>
                                <p className="mt-1 text-sm text-gray-600">
                                  Drag and drop to reorder payments
                                </p>
                              </div>
                              <div className="overflow-x-auto">
                                <div className="min-w-[800px]">
                                  <div className="divide-y divide-gray-200">
                                    {userGroup.payments.map(
                                      (payment, index) => (
                                        <Draggable
                                          key={payment.id}
                                          draggableId={payment.id}
                                          index={index}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className={`px-6 py-4 transition-colors hover:bg-gray-50 ${
                                                snapshot.isDragging
                                                  ? "bg-blue-50"
                                                  : ""
                                              }`}
                                            >
                                              <div className="flex items-center justify-between">
                                                <div className="flex items-center space-x-4">
                                                  <div
                                                    {...provided.dragHandleProps}
                                                    className="flex h-10 w-10 cursor-move items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                                  >
                                                    <svg
                                                      className="h-4 w-4 text-gray-400"
                                                      fill="currentColor"
                                                      viewBox="0 0 20 20"
                                                    >
                                                      <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
                                                    </svg>
                                                  </div>
                                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                                    <span className="text-sm font-semibold text-gray-600">
                                                      #{payment.order}
                                                    </span>
                                                  </div>
                                                  <div>
                                                    <h4 className="text-sm font-medium text-gray-900">
                                                      {payment.name}
                                                    </h4>
                                                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                                                      <span className="flex items-center">
                                                        <svg
                                                          className="mr-1 h-3 w-3"
                                                          fill="none"
                                                          stroke="currentColor"
                                                          viewBox="0 0 24 24"
                                                        >
                                                          <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={2}
                                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                          />
                                                        </svg>
                                                        Due:{" "}
                                                        {formatDate(
                                                          payment.dueDate,
                                                        )}
                                                      </span>
                                                      {payment.status ===
                                                        "Paid" && (
                                                        <span className="flex items-center text-green-600">
                                                          <svg
                                                            className="mr-1 h-3 w-3"
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
                                                          Paid
                                                        </span>
                                                      )}
                                                      {payment.project && (
                                                        <span className="flex items-center text-blue-600 font-medium">
                                                          <svg
                                                            className="mr-1 h-3 w-3"
                                                            fill="none"
                                                            stroke="currentColor"
                                                            viewBox="0 0 24 24"
                                                          >
                                                            <path
                                                              strokeLinecap="round"
                                                              strokeLinejoin="round"
                                                              strokeWidth={2}
                                                              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                                                            />
                                                          </svg>
                                                          Project: {payment.project.name}
                                                        </span>
                                                      )}
                                                    </div>
                                                  </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                  <div className="text-right">
                                                    <p className="text-sm font-semibold text-gray-900">
                                                      {formatAmount(
                                                        payment.amount,
                                                      )}
                                                    </p>
                                                  </div>
                                                  <span
                                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                                      payment.status === "Paid"
                                                        ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                                                        : payment.status ===
                                                            "Due"
                                                          ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                                                          : "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                                                    }`}
                                                  >
                                                    {payment.status ===
                                                      "Paid" && (
                                                      <svg
                                                        className="mr-1 h-3 w-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                      >
                                                        <path
                                                          fillRule="evenodd"
                                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                                          clipRule="evenodd"
                                                        />
                                                      </svg>
                                                    )}
                                                    {payment.status ===
                                                      "Due" && (
                                                      <svg
                                                        className="mr-1 h-3 w-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                      >
                                                        <path
                                                          fillRule="evenodd"
                                                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                                          clipRule="evenodd"
                                                        />
                                                      </svg>
                                                    )}
                                                    {payment.status ===
                                                      "Scheduled" && (
                                                      <svg
                                                        className="mr-1 h-3 w-3"
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                      >
                                                        <path
                                                          fillRule="evenodd"
                                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                                          clipRule="evenodd"
                                                        />
                                                      </svg>
                                                    )}
                                                    {payment.status}
                                                  </span>
                                                  <div className="flex space-x-2">
                                                    <button
                                                      onClick={() =>
                                                        setEditModal({
                                                          isOpen: true,
                                                          payment,
                                                        })
                                                      }
                                                      className="rounded-md border border-blue-300 bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100"
                                                    >
                                                      Edit
                                                    </button>
                                                    <button
                                                      onClick={() =>
                                                        openDeleteModal(payment)
                                                      }
                                                      disabled={isDeleting}
                                                      className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                      {isDeleting
                                                        ? "Deleting..."
                                                        : "Delete"}
                                                    </button>
                                                  </div>
                                                </div>
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      ),
                                    )}
                                    {provided.placeholder}
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </Droppable>

                        {/* Progress Overview for this user */}
                        <div className="mt-6 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                          <h3 className="mb-4 text-lg font-semibold text-gray-900">
                            Payment Progress
                          </h3>
                          <div className="space-y-4">
                            <div>
                              <div className="mb-2 flex justify-between text-sm">
                                <span className="font-medium text-gray-700">
                                  Overall Progress
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {Math.round(
                                    (userGroup.payments.filter(
                                      (p) => p.status === "Paid",
                                    ).length /
                                      userGroup.payments.length) *
                                      100,
                                  )}
                                  %
                                </span>
                              </div>
                              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                                <div
                                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                                  style={{
                                    width: `${(userGroup.payments.filter((p) => p.status === "Paid").length / userGroup.payments.length) * 100}%`,
                                  }}
                                ></div>
                              </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div className="rounded-lg bg-white p-3 shadow-sm">
                                <div className="font-medium text-gray-900">
                                  {formatAmount(
                                    userGroup.payments
                                      .filter((p) => p.status === "Paid")
                                      .reduce((sum, p) => sum + p.amount, 0),
                                  )}
                                </div>
                                <div className="text-gray-600">Amount Paid</div>
                              </div>
                              <div className="rounded-lg bg-white p-3 shadow-sm">
                                <div className="font-medium text-gray-900">
                                  {formatAmount(
                                    userGroup.payments
                                      .filter((p) => p.status !== "Paid")
                                      .reduce((sum, p) => sum + p.amount, 0),
                                  )}
                                </div>
                                <div className="text-gray-600">
                                  Amount Remaining
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </DragDropContext>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-8 flex items-center justify-between">
              <div className="text-sm text-gray-700">
                Showing {startIndex + 1} to{" "}
                {Math.min(endIndex, filteredGroupedPayments.length)} of{" "}
                {filteredGroupedPayments.length} users
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Previous
                </button>
                <div className="flex space-x-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                    (page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`rounded-md px-3 py-2 text-sm font-medium ${
                          currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {page}
                      </button>
                    ),
                  )}
                </div>
                <button
                  onClick={() =>
                    setCurrentPage(Math.min(totalPages, currentPage + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Create Payment Modal */}
      {createModal.isOpen && (
        <CreatePaymentModal
          users={availableUsers}
          onClose={() => setCreateModal({ isOpen: false })}
          onSubmit={handleCreatePayment}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Edit Payment Modal */}
      {editModal.isOpen && editModal.payment && (
        <EditPaymentModal
          payment={editModal.payment}
          onClose={() => setEditModal({ isOpen: false, payment: null })}
          onSubmit={handleUpdatePayment}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Bulk Create Payment Modal */}
      {bulkCreateModal.isOpen && (
        <BulkCreatePaymentModal
          users={availableUsers}
          onClose={() => setBulkCreateModal({ isOpen: false })}
          onSubmit={handleCreatePayment}
          isSubmitting={isSubmitting}
          setModalState={setModalState}
        />
      )}

      {/* Alert Modal */}
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
        onConfirm={modalState.onConfirm}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />
    </div>
  );
}

// Create Payment Modal Component
function CreatePaymentModal({ users, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    userId: "",
    project: "",
    name: "",
    dueDate: "",
    amount: "",
    status: "Scheduled",
  });

  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Fetch projects when user is selected
  useEffect(() => {
    const fetchProjects = async () => {
      if (formData.userId) {
        setIsLoadingProjects(true);
        try {
          const response = await fetch(
            `/api/admin/projects?userId=${formData.userId}`,
          );
          if (response.ok) {
            const data = await response.json();
            setProjects(data.projects || []);
            // Automatically select if there's only one project
            if (data.projects?.length === 1) {
              setFormData((prev) => ({
                ...prev,
                project: data.projects[0]._id,
              }));
            } else {
              setFormData((prev) => ({ ...prev, project: "" }));
            }
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setIsLoadingProjects(false);
        }
      } else {
        setProjects([]);
        setFormData((prev) => ({ ...prev, project: "" }));
      }
    };

    fetchProjects();
  }, [formData.userId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Create Payment
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              User
            </label>
            <select
              value={formData.userId}
              onChange={(e) =>
                setFormData({ ...formData, userId: e.target.value })
              }
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="">
                {users.length === 0
                  ? "No users with &quot;On Going&quot; status available"
                  : "Select user..."}
              </option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
            {users.length === 0 && (
              <p className="mt-1 text-sm text-amber-600">
                Only users with &quot;On Going&quot; project status can have
                payments. <br />
                Update user status in the Users section first.
              </p>
            )}
          </div>

          {/* Project Selection */}
          {formData.userId && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Project (Optional)
              </label>
              {isLoadingProjects ? (
                <div className="flex items-center text-sm text-gray-500">
                  <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                  Loading projects...
                </div>
              ) : projects.length > 0 ? (
                <select
                  value={formData.project}
                  onChange={(e) =>
                    setFormData({ ...formData, project: e.target.value })
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value="">-- No Project --</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name} ({project.status})
                    </option>
                  ))}
                </select>
              ) : (
                <p className="text-sm text-amber-600 italic">
                  No projects found for this user.
                </p>
              )}
            </div>
          )}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="e.g., 1st Instalment"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amount (£)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || users.length === 0}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Bulk Create Payment Modal Component
function BulkCreatePaymentModal({
  users,
  onClose,
  onSubmit,
  isSubmitting,
  setModalState,
}) {
  const [formData, setFormData] = useState({
    userId: "",
    project: "",
    payments: [{ name: "", amount: "", dueDate: "", status: "Scheduled" }],
  });

  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Fetch projects when user is selected
  useEffect(() => {
    const fetchProjects = async () => {
      if (formData.userId) {
        setIsLoadingProjects(true);
        try {
          const response = await fetch(
            `/api/admin/projects?userId=${formData.userId}`,
          );
          if (response.ok) {
            const data = await response.json();
            setProjects(data.projects || []);
            // Automatically select if there's only one project
            if (data.projects?.length === 1) {
              setFormData((prev) => ({
                ...prev,
                project: data.projects[0]._id,
              }));
            } else {
              setFormData((prev) => ({ ...prev, project: "" }));
            }
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setIsLoadingProjects(false);
        }
      } else {
        setProjects([]);
        setFormData((prev) => ({ ...prev, project: "" }));
      }
    };

    fetchProjects();
  }, [formData.userId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create multiple payments sequentially
    const validPayments = formData.payments.filter(
      (payment) => payment.name && payment.amount && payment.dueDate,
    );

    let successCount = 0;
    let errorCount = 0;

    for (const payment of validPayments) {
      try {
        await onSubmit({
          userId: formData.userId,
          project: formData.project,
          name: payment.name,
          amount: payment.amount,
          dueDate: payment.dueDate,
          status: payment.status,
        });
        successCount++;
      } catch (error) {
        errorCount++;
        console.error(`Failed to create payment: ${payment.name}`, error);
      }
    }

    // Show result
    if (errorCount > 0) {
      setModalState({
        isOpen: true,
        title: "Bulk Creation Results",
        message: `Successfully created ${successCount} payments. Failed to create ${errorCount} payments.`,
        type: "alert",
        confirmText: "OK",
      });
    }

    onClose();
  };

  const addPayment = () => {
    setFormData({
      ...formData,
      payments: [
        ...formData.payments,
        { name: "", amount: "", dueDate: "", status: "Scheduled" },
      ],
    });
  };

  const removePayment = (index) => {
    if (formData.payments.length > 1) {
      setFormData({
        ...formData,
        payments: formData.payments.filter((_, i) => i !== index),
      });
    }
  };

  const updatePayment = (index, field, value) => {
    const updatedPayments = [...formData.payments];
    updatedPayments[index] = { ...updatedPayments[index], [field]: value };
    setFormData({ ...formData, payments: updatedPayments });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative flex max-h-[90vh] w-full max-w-2xl transform flex-col rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Bulk Create Payments
          </h3>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                User
              </label>
              <select
                value={formData.userId}
                onChange={(e) =>
                  setFormData({ ...formData, userId: e.target.value })
                }
                required
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">
                  {users.length === 0
                    ? "No users with &quot;On Going&quot; status available"
                    : "Select user..."}
                </option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email}
                  </option>
                ))}
              </select>
              {users.length === 0 && (
                <p className="mt-1 text-sm text-amber-600">
                  Only users with &quot;On Going&quot; project status can have
                  payments. <br />
                  Update user status in the Users section first.
                </p>
              )}
            </div>

            {/* Project Selection */}
            {formData.userId && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Project (Optional)
                </label>
                {isLoadingProjects ? (
                  <div className="flex items-center text-sm text-gray-500">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    Loading projects...
                  </div>
                ) : projects.length > 0 ? (
                  <select
                    value={formData.project}
                    onChange={(e) =>
                      setFormData({ ...formData, project: e.target.value })
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="">-- No Project --</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name} ({project.status})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-sm text-amber-600 italic">
                    No projects found for this user.
                  </p>
                )}
              </div>
            )}

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-medium text-gray-700">Payments</h4>
                <button
                  type="button"
                  onClick={addPayment}
                  className="rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700"
                >
                  + Add Payment
                </button>
              </div>

              {formData.payments.map((payment, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">
                      Payment {index + 1}
                    </span>
                    {formData.payments.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removePayment(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Name
                      </label>
                      <input
                        type="text"
                        value={payment.name}
                        onChange={(e) =>
                          updatePayment(index, "name", e.target.value)
                        }
                        required
                        className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="e.g., 1st Instalment"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Amount (£)
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={payment.amount}
                        onChange={(e) =>
                          updatePayment(index, "amount", e.target.value)
                        }
                        required
                        className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={payment.dueDate}
                        onChange={(e) =>
                          updatePayment(index, "dueDate", e.target.value)
                        }
                        required
                        className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </form>
        </div>

        {/* Fixed Footer with Buttons */}
        <div className="border-t border-gray-200 bg-gray-50 px-6 py-4">
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || users.length === 0}
              onClick={handleSubmit}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Creating..." : "Create Payments"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Edit Payment Modal Component
function EditPaymentModal({ payment, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: payment.name,
    project: payment.project?.id || payment.project?._id || "",
    dueDate: new Date(payment.dueDate).toISOString().split("T")[0],
    amount: payment.amount,
    status: payment.status,
  });

  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Fetch projects for the user
  useEffect(() => {
    const fetchProjects = async () => {
      const userId = payment.user?.id || payment.user?._id;
      if (userId) {
        setIsLoadingProjects(true);
        try {
          const response = await fetch(`/api/admin/projects?userId=${userId}`);
          if (response.ok) {
            const data = await response.json();
            setProjects(data.projects || []);
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setIsLoadingProjects(false);
        }
      }
    };

    fetchProjects();
  }, [payment.user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(payment.id, formData);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Edit Payment
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Payment Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Project (Optional)
            </label>
            {isLoadingProjects ? (
              <div className="flex items-center text-sm text-gray-500">
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                Loading projects...
              </div>
            ) : projects.length > 0 ? (
              <select
                value={formData.project}
                onChange={(e) =>
                  setFormData({ ...formData, project: e.target.value })
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              >
                <option value="">-- No Project --</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name} ({p.status})
                  </option>
                ))}
              </select>
            ) : (
              <p className="text-sm text-amber-600 italic">
                No projects found for this user.
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Amount (£)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              required
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="Scheduled">Scheduled</option>
              <option value="Due">Due</option>
              <option value="Paid">Paid</option>
            </select>
          </div>
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
