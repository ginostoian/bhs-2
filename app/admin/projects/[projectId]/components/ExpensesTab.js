"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { toast } from "react-hot-toast";
import FileUpload from "@/components/FileUpload";

/**
 * ExpensesTab Component
 * Displays and manages project expenses with drag-and-drop functionality
 */
export default function ExpensesTab({
  projectId,
  projectName,
  userName,
  userAddress,
  expenses: initialExpenses = [],
}) {
  const [expenses, setExpenses] = useState(initialExpenses);
  const [loading, setLoading] = useState(false);
  const [createModal, setCreateModal] = useState({ isOpen: false });
  const [editModal, setEditModal] = useState({ isOpen: false, expense: null });
  const [detailModal, setDetailModal] = useState({
    isOpen: false,
    expense: null,
  });
  const [projectData, setProjectData] = useState(null);
  const [totals, setTotals] = useState({
    totalAmount: initialExpenses.reduce((sum, e) => sum + e.amount, 0),
    byCategory: [],
    byType: [],
  });

  // Update totals when expenses change
  useEffect(() => {
    const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

    // Calculate unique categories
    const uniqueCategories = [...new Set(expenses.map((e) => e.category))];

    // Calculate by category
    const byCategory = uniqueCategories.map((category) => {
      const categoryExpenses = expenses.filter((e) => e.category === category);
      return {
        _id: category,
        total: categoryExpenses.reduce((sum, e) => sum + e.amount, 0),
        count: categoryExpenses.length,
        expenses: categoryExpenses,
      };
    });

    // Calculate by type
    const uniqueTypes = [...new Set(expenses.map((e) => e.type))];
    const byType = uniqueTypes.map((type) => {
      const typeExpenses = expenses.filter((e) => e.type === type);
      return {
        _id: type,
        total: typeExpenses.reduce((sum, e) => sum + e.amount, 0),
        count: typeExpenses.length,
        expenses: typeExpenses,
      };
    });

    setTotals({
      totalAmount,
      byCategory,
      byType,
    });
  }, [expenses]);

  // Handle drag and drop reordering
  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(expenses);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    setExpenses(items);

    try {
      const response = await fetch(`/api/projects/${projectId}/expenses`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ expenses: items }),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder expenses");
      }

      toast.success("Expenses reordered successfully");
    } catch (error) {
      console.error("Error reordering expenses:", error);
      toast.error("Failed to reorder expenses");
      // Reload to restore original order
      window.location.reload();
    }
  };

  // Handle expense creation
  const handleCreateExpense = async (expenseData) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(expenseData),
      });

      if (response.ok) {
        const data = await response.json();
        setExpenses((prev) => [...prev, data.expense]);
        setCreateModal({ isOpen: false });
        toast.success("Expense created successfully");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to create expense");
      }
    } catch (error) {
      console.error("Error creating expense:", error);
      toast.error(error.message);
    }
  };

  // Handle expense update
  const handleUpdateExpense = async (expenseId, expenseData) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/expenses/${expenseId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(expenseData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setExpenses((prev) =>
          prev.map((expense) =>
            expense.id === expenseId ? data.expense : expense,
          ),
        );
        setEditModal({ isOpen: false, expense: null });
        toast.success("Expense updated successfully");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to update expense");
      }
    } catch (error) {
      console.error("Error updating expense:", error);
      toast.error(error.message);
    }
  };

  // Handle expense deletion
  const handleDeleteExpense = async (expenseId) => {
    if (!confirm("Are you sure you want to delete this expense?")) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/expenses/${expenseId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        setExpenses((prev) =>
          prev.filter((expense) => expense.id !== expenseId),
        );
        toast.success("Expense deleted successfully");
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete expense");
      }
    } catch (error) {
      console.error("Error deleting expense:", error);
      toast.error(error.message);
    }
  };

  // Format date for display
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
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

  // Get category display name
  const getCategoryDisplayName = (expense) => {
    if (expense.category === "Custom" && expense.customCategory) {
      return expense.customCategory;
    }
    return expense.category;
  };

  // Get type badge
  const getTypeBadge = (type) => {
    const badges = {
      Expense: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
      Charge: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          badges[type] || badges.Expense
        }`}
      >
        {type}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-600">Loading expenses...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">
            Project Expenses
          </h2>
          <p className="text-sm text-gray-600">
            Track and manage expenses for {projectName}
          </p>
        </div>
        <button
          onClick={() => setCreateModal({ isOpen: true })}
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
          Add Expense
        </button>
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-blue-600">
                Total Expenses
              </p>
              <p className="text-2xl font-bold text-blue-900">
                {expenses.length}
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
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-600">Total Amount</p>
              <p className="text-lg font-bold text-green-900">
                {formatAmount(totals.totalAmount)}
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-purple-600">Categories</p>
              <p className="text-2xl font-bold text-purple-900">
                {totals.byCategory.length}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 p-4">
          <div className="flex items-center">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500">
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
                  d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-orange-600">With Files</p>
              <p className="text-2xl font-bold text-orange-900">
                {expenses.filter((e) => e.files && e.files.length > 0).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
        <div className="border-b border-gray-200 px-6 py-4">
          <h3 className="text-lg font-semibold text-gray-900">Expense List</h3>
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop to reorder expenses
          </p>
        </div>

        {expenses.length > 0 ? (
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="expenses">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="divide-y divide-gray-200"
                >
                  {expenses.map((expense, index) => (
                    <Draggable
                      key={expense.id}
                      draggableId={expense.id}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className={`px-6 py-4 transition-colors hover:bg-gray-50 ${
                            snapshot.isDragging ? "bg-blue-50 shadow-lg" : ""
                          }`}
                        >
                          <div className="flex items-center justify-between">
                            <div
                              className="flex cursor-pointer items-center space-x-4 rounded-lg p-2 transition-colors hover:bg-gray-50"
                              onClick={() =>
                                setDetailModal({ isOpen: true, expense })
                              }
                            >
                              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                <span className="text-sm font-semibold text-gray-600">
                                  #{expense.order}
                                </span>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-900">
                                  {expense.name}
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
                                    {formatDate(expense.purchaseDate)}
                                  </span>
                                  <span>{getCategoryDisplayName(expense)}</span>
                                  {expense.files &&
                                    expense.files.length > 0 && (
                                      <span className="flex items-center text-blue-600">
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
                                            d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                          />
                                        </svg>
                                        {expense.files.length} file(s)
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-4">
                              <div className="text-right">
                                <p className="text-sm font-semibold text-gray-900">
                                  {formatAmount(expense.amount)}
                                </p>
                              </div>
                              <div className="flex items-center space-x-2">
                                {getTypeBadge(expense.type)}
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    setEditModal({ isOpen: true, expense })
                                  }
                                  className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <svg
                                    className="mr-1.5 h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                                    />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteExpense(expense.id)
                                  }
                                  className="inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                                >
                                  <svg
                                    className="mr-1.5 h-3.5 w-3.5"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                    />
                                  </svg>
                                  Delete
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        ) : (
          <div className="p-12 text-center">
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
              No Expenses Found
            </h3>
            <p className="mb-6 text-gray-600">
              Start tracking project expenses by adding your first expense.
            </p>
            <button
              onClick={() => setCreateModal({ isOpen: true })}
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
              Add First Expense
            </button>
          </div>
        )}
      </div>

      {/* Total Summary */}
      {expenses.length > 0 && (
        <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            Expense Summary
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(totals.totalAmount)}
              </div>
              <div className="text-gray-600">Total Expenses</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(
                  expenses
                    .filter((e) => e.type === "Expense")
                    .reduce((sum, e) => sum + e.amount, 0),
                )}
              </div>
              <div className="text-gray-600">Total Expenses (Type)</div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow-sm">
              <div className="text-2xl font-bold text-gray-900">
                {formatAmount(
                  expenses
                    .filter((e) => e.type === "Charge")
                    .reduce((sum, e) => sum + e.amount, 0),
                )}
              </div>
              <div className="text-gray-600">Total Charges</div>
            </div>
          </div>
        </div>
      )}

      {/* Create Expense Modal */}
      {createModal.isOpen && (
        <ExpenseModal
          isOpen={createModal.isOpen}
          onClose={() => setCreateModal({ isOpen: false })}
          onSubmit={handleCreateExpense}
          projectId={projectId}
          projectName={projectName}
          userName={userName}
          userAddress={userAddress}
        />
      )}

      {/* Edit Expense Modal */}
      {editModal.isOpen && editModal.expense && (
        <ExpenseModal
          isOpen={editModal.isOpen}
          onClose={() => setEditModal({ isOpen: false, expense: null })}
          onSubmit={(data) => handleUpdateExpense(editModal.expense.id, data)}
          expense={editModal.expense}
          projectId={projectId}
          projectName={projectName}
          userName={userName}
          userAddress={userAddress}
        />
      )}

      {/* Expense Detail Modal */}
      {detailModal.isOpen && detailModal.expense && (
        <ExpenseDetailModal
          isOpen={detailModal.isOpen}
          onClose={() => setDetailModal({ isOpen: false, expense: null })}
          expense={detailModal.expense}
          onEdit={() => {
            setDetailModal({ isOpen: false, expense: null });
            setEditModal({ isOpen: true, expense: detailModal.expense });
          }}
          onDelete={() => {
            setDetailModal({ isOpen: false, expense: null });
            handleDeleteExpense(detailModal.expense.id);
          }}
        />
      )}
    </div>
  );
}

/**
 * ExpenseDetailModal Component
 * Modal for viewing expense details with image preview
 */
function ExpenseDetailModal({ isOpen, onClose, expense, onEdit, onDelete }) {
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatAmount = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const getCategoryDisplayName = (expense) => {
    if (expense.category === "Custom" && expense.customCategory) {
      return expense.customCategory;
    }
    return expense.category;
  };

  const getTypeBadge = (type) => {
    const badges = {
      Expense: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
      Charge: "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          badges[type] || badges.Expense
        }`}
      >
        {type}
      </span>
    );
  };

  const isImageFile = (fileName) => {
    const imageExtensions = [".jpg", ".jpeg", ".png", ".gif", ".webp"];
    const ext = fileName.toLowerCase().substring(fileName.lastIndexOf("."));
    return imageExtensions.includes(ext);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Expense Details</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Left Column - Expense Details */}
          <div className="space-y-6">
            <div>
              <h4 className="mb-2 text-xl font-semibold text-gray-900">
                {expense.name}
              </h4>
              <div className="mb-4 flex items-center space-x-2">
                {getTypeBadge(expense.type)}
                <span className="text-sm text-gray-500">
                  {getCategoryDisplayName(expense)}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-medium text-gray-600">
                  Amount:
                </span>
                <span className="text-lg font-semibold text-gray-900">
                  {formatAmount(expense.amount)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-medium text-gray-600">
                  Purchase Date:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {formatDate(expense.purchaseDate)}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-medium text-gray-600">Type:</span>
                <span className="text-sm font-medium text-gray-900">
                  {expense.type}
                </span>
              </div>

              <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                <span className="text-sm font-medium text-gray-600">
                  Category:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  {getCategoryDisplayName(expense)}
                </span>
              </div>

              {expense.purchaseLink && (
                <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                  <span className="text-sm font-medium text-gray-600">
                    Purchase Link:
                  </span>
                  <a
                    href={expense.purchaseLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-2 truncate text-sm text-blue-600 hover:text-blue-800"
                  >
                    View Link
                  </a>
                </div>
              )}

              {expense.notes && (
                <div className="rounded-lg bg-gray-50 p-3">
                  <span className="mb-2 block text-sm font-medium text-gray-600">
                    Notes:
                  </span>
                  <p className="text-sm text-gray-900">{expense.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Files */}
          <div className="space-y-4">
            <h4 className="text-lg font-medium text-gray-900">
              Attached Files
            </h4>

            {expense.files && expense.files.length > 0 ? (
              <div className="space-y-4">
                {expense.files.map((file, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-gray-200 p-4"
                  >
                    <div className="mb-3 flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        {file.fileName}
                      </span>
                      <a
                        href={file.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        View File
                      </a>
                    </div>

                    {isImageFile(file.fileName) && (
                      <div className="mt-3">
                        <img
                          src={file.fileUrl}
                          alt={file.fileName}
                          className="h-48 w-full rounded-lg border border-gray-200 object-cover"
                          onError={(e) => {
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-8 text-center text-gray-500">
                <svg
                  className="mx-auto mb-4 h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p>No files attached</p>
              </div>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end space-x-3">
          <button
            onClick={onDelete}
            className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            Delete Expense
          </button>
          <button
            onClick={onEdit}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Expense
          </button>
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

/**
 * ExpenseModal Component
 * Modal for creating/editing expenses
 */
function ExpenseModal({
  isOpen,
  onClose,
  onSubmit,
  expense,
  projectId,
  projectName,
  userName,
  userAddress,
}) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    purchaseDate: new Date().toISOString().split("T")[0],
    type: "Expense",
    category: "Bathroom",
    customCategory: "",
    purchaseLink: "",
    notes: "",
    files: [],
  });
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data when expense is provided (edit mode)
  useEffect(() => {
    if (expense) {
      setFormData({
        name: expense.name || "",
        amount: expense.amount?.toString() || "",
        purchaseDate: expense.purchaseDate
          ? new Date(expense.purchaseDate).toISOString().split("T")[0]
          : new Date().toISOString().split("T")[0],
        type: expense.type || "Expense",
        category: expense.category || "Bathroom",
        customCategory: expense.customCategory || "",
        purchaseLink: expense.purchaseLink || "",
        notes: expense.notes || "",
        files: expense.files || [],
      });
      setUploadedFiles(expense.files || []);
    }
  }, [expense]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const submitData = {
        ...formData,
        amount: parseFloat(formData.amount),
        files: uploadedFiles,
      };

      await onSubmit(submitData);
    } catch (error) {
      console.error("Error submitting expense:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileUpload = (files) => {
    const newFiles = files.map((file) => ({
      fileId: file.id, // This is the MongoDB ObjectId as string from the upload API
      fileName: file.originalName,
      fileUrl: file.url,
      filePath: file.filePath,
    }));
    setUploadedFiles((prev) => [...prev, ...newFiles]);

    // Auto-populate purchase link with the first file URL
    if (files.length > 0 && files[0].url) {
      setFormData((prev) => ({
        ...prev,
        purchaseLink: files[0].url,
      }));
    }
  };

  const removeFile = (fileId) => {
    setUploadedFiles((prev) => prev.filter((f) => f.fileId !== fileId));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            {expense ? "Edit Expense" : "Add New Expense"}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Expense Name *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="e.g., Bathroom tiles, Kitchen cabinets"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount (GBP) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.amount}
                onChange={(e) =>
                  setFormData({ ...formData, amount: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="0.00"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Purchase Date *
              </label>
              <input
                type="date"
                required
                value={formData.purchaseDate}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseDate: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type *
              </label>
              <select
                required
                value={formData.type}
                onChange={(e) =>
                  setFormData({ ...formData, type: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Expense">Expense</option>
                <option value="Charge">Charge</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
              >
                <option value="Bathroom">Bathroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Electric">Electric</option>
                <option value="Tiling">Tiling</option>
                <option value="Custom">Custom</option>
              </select>
            </div>

            {formData.category === "Custom" && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Custom Category Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.customCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, customCategory: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Plumbing, Flooring"
                />
              </div>
            )}

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Purchase Link
              </label>
              <input
                type="url"
                value={formData.purchaseLink}
                onChange={(e) =>
                  setFormData({ ...formData, purchaseLink: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="https://..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                rows={3}
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                placeholder="Additional notes about this expense..."
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Receipts & Documents
              </label>
              <FileUpload
                onUploadComplete={handleFileUpload}
                multiple={true}
                maxSize={10 * 1024 * 1024} // 10MB
                allowedTypes={[".pdf", ".jpg", ".jpeg", ".png", ".webp"]}
                folder={`Project/${userName}-${userAddress?.replace(/[^a-zA-Z0-9]/g, "")}/expenses`}
                className="mt-1"
              />

              {/* Display uploaded files */}
              {uploadedFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  <p className="text-sm font-medium text-gray-700">
                    Uploaded Files:
                  </p>
                  {uploadedFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-md bg-gray-50 p-2"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {file.fileName}
                        </span>
                        <a
                          href={file.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          View
                        </a>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFile(file.fileId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
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
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <svg
                    className="mr-2 h-4 w-4 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Saving...
                </>
              ) : expense ? (
                "Update Expense"
              ) : (
                "Create Expense"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
