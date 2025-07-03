"use client";

import { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
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

  // Group payments by user
  const groupedPayments = payments.reduce((groups, payment) => {
    const userId = payment.user?.id || payment.user?._id || "unknown";
    const userName =
      payment.user?.name || payment.user?.email || "Unknown User";

    if (!groups[userId]) {
      groups[userId] = {
        user: payment.user,
        userName,
        payments: [],
      };
    }

    groups[userId].payments.push(payment);
    return groups;
  }, {});

  // Handle drag and drop reordering within a user group
  const handleDragEnd = async (result) => {
    console.log("Drag end result:", result);

    if (!result.destination) {
      console.log("No destination, returning");
      return;
    }

    const { source, destination } = result;
    const sourceUserId = source.droppableId;
    const destUserId = destination.droppableId;

    // Only allow reordering within the same user group
    if (sourceUserId !== destUserId) {
      console.log("Cannot move payments between users");
      return;
    }

    const userGroup = groupedPayments[sourceUserId];
    if (!userGroup) return;

    const items = Array.from(userGroup.payments);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    console.log(
      "Reordered items for user:",
      sourceUserId,
      items.map((item) => ({
        id: item.id,
        name: item.name,
        order: item.order,
      })),
    );

    // Update local state
    setPayments((prevPayments) =>
      prevPayments.map((payment) => {
        if (
          payment.user?.id === sourceUserId ||
          payment.user?._id === sourceUserId
        ) {
          const newPayment = items.find((item) => item.id === payment.id);
          return newPayment || payment;
        }
        return payment;
      }),
    );

    // Update order in database
    try {
      const response = await fetch(`/api/payments/${reorderedItem.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newOrder: destination.index + 1,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder payment");
      }

      console.log("Reorder successful");
    } catch (error) {
      console.error("Error reordering payment:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to reorder payment. Please try again.",
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

      {/* Payments Grouped by User */}
      {Object.keys(groupedPayments).length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">💳</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No payments found
          </h3>
          <p className="text-gray-600">
            Create the first payment to get started.
          </p>
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="space-y-6">
            {Object.entries(groupedPayments).map(([userId, userGroup]) => (
              <div
                key={userId}
                className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow"
              >
                {/* User Header */}
                <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {userGroup.userName}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {userGroup.payments.length} payment
                    {userGroup.payments.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* User's Payments */}
                <Droppable droppableId={userId}>
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="min-h-[100px]"
                    >
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Payment #
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Payment Name
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Amount
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Due Date
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Status
                              </th>
                              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                Actions
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 bg-white">
                            {userGroup.payments.map((payment, index) => (
                              <Draggable
                                key={payment.id}
                                draggableId={payment.id}
                                index={index}
                              >
                                {(provided, snapshot) => (
                                  <tr
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className={`hover:bg-gray-50 ${
                                      snapshot.isDragging ? "bg-blue-50" : ""
                                    }`}
                                  >
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                      <div className="flex items-center">
                                        <div
                                          {...provided.dragHandleProps}
                                          className="mr-2 cursor-move text-gray-400 hover:text-gray-600"
                                        >
                                          <svg
                                            className="h-4 w-4"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                          >
                                            <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
                                          </svg>
                                        </div>
                                        {payment.paymentNumber}
                                      </div>
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                      {payment.name}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                                      {formatAmount(payment.amount)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                      {formatDate(payment.dueDate)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                                      {getStatusBadge(payment.status)}
                                    </td>
                                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
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
                                    </td>
                                  </tr>
                                )}
                              </Draggable>
                            ))}
                            {provided.placeholder}
                          </tbody>
                          {/* Totals Row */}
                          <tfoot className="bg-gray-50">
                            <tr>
                              <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                                Total
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                {userGroup.payments.length} payment
                                {userGroup.payments.length !== 1 ? "s" : ""}
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                £
                                {userGroup.payments
                                  .reduce(
                                    (sum, payment) =>
                                      sum + parseFloat(payment.amount || 0),
                                    0,
                                  )
                                  .toLocaleString("en-GB", {
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2,
                                  })}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                -
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                -
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-600">
                                -
                              </td>
                            </tr>
                          </tfoot>
                        </table>
                      </div>
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      )}

      {/* Create Payment Modal */}
      {createModal.isOpen && (
        <CreatePaymentModal
          users={users}
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
          users={users}
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
    name: "",
    dueDate: "",
    amount: "",
    status: "Scheduled",
  });

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
              <option value="">Select user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>
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
              disabled={isSubmitting}
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
    payments: [{ name: "", amount: "", dueDate: "", status: "Scheduled" }],
  });

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
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Bulk Create Payments
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
              <option value="">Select user...</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.name || user.email}
                </option>
              ))}
            </select>
          </div>

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
              {isSubmitting ? "Creating..." : "Create All Payments"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// Edit Payment Modal Component
function EditPaymentModal({ payment, onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: payment.name,
    dueDate: new Date(payment.dueDate).toISOString().split("T")[0],
    amount: payment.amount,
    status: payment.status,
  });

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
