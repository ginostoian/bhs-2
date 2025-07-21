"use client";

import { useState } from "react";
import Link from "next/link";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import DocumentList from "../../../../dashboard/components/DocumentList";
import Modal from "@/components/Modal";
import UserInfoModal from "./UserInfoModal";

/**
 * User Detail Client Component
 * Displays user information and all their documents with management capabilities
 */
export default function UserDetailClient({
  user,
  documentsByType: initialDocumentsByType,
  payments: initialPayments = [],
  projects: initialProjects = [],
  moodboards: initialMoodboards = [],
}) {
  const [documentsByType, setDocumentsByType] = useState(
    initialDocumentsByType || {
      photo: [],
      comment: [],
      quote: [],
      invoice: [],
    },
  );
  const [payments, setPayments] = useState(initialPayments || []);
  const [projects, setProjects] = useState(initialProjects || []);
  const [moodboards, setMoodboards] = useState(initialMoodboards || []);
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    documentId: null,
    documentType: "",
    documentContent: "",
  });
  const [editModal, setEditModal] = useState({
    isOpen: false,
    payment: null,
  });
  const [createModal, setCreateModal] = useState({
    isOpen: false,
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);

  // Helper functions
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
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

  const isPdfUrl = (content) => {
    return (
      typeof content === "string" &&
      content.startsWith("http") &&
      content.toLowerCase().includes(".pdf")
    );
  };

  const getStatusBadge = (status) => {
    const styles = {
      // Project statuses
      Lead: "bg-blue-100 text-blue-800",
      "On Going": "bg-yellow-100 text-yellow-800",
      Finished: "bg-green-100 text-green-800",
      // Payment statuses
      Scheduled: "bg-blue-100 text-blue-800",
      Due: "bg-yellow-100 text-yellow-800",
      Paid: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status || "Unknown"}
      </span>
    );
  };

  const getMoodboardStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      shared: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          styles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status || "Unknown"}
      </span>
    );
  };

  const getAllDocuments = () => {
    return [
      ...documentsByType.photo,
      ...documentsByType.comment,
      ...documentsByType.quote,
      ...documentsByType.invoice,
    ];
  };

  const getCurrentDocuments = () => {
    if (activeTab === "all") {
      return getAllDocuments();
    }
    return documentsByType[activeTab] || [];
  };

  const openDeleteModal = (documentId, documentType, documentContent) => {
    setModalState({
      isOpen: true,
      documentId,
      documentType,
      documentContent,
      title: "Delete Document",
      message: `Are you sure you want to delete this ${documentType}? This action cannot be undone.`,
      type: "confirm",
      confirmText: "Delete",
      cancelText: "Cancel",
    });
  };

  const handleDeleteDocument = async (documentId, documentType) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        // Remove from local state
        setDocumentsByType((prev) => ({
          ...prev,
          [documentType]: prev[documentType].filter(
            (doc) => doc.id !== documentId,
          ),
        }));

        setModalState({
          isOpen: true,
          title: "Success",
          message: `${documentType} deleted successfully.`,
          type: "alert",
          confirmText: "OK",
        });
      } else {
        throw new Error("Failed to delete document");
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to delete document. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const handleCreatePayment = async (paymentData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...paymentData,
          user: user.id,
        }),
      });

      if (response.ok) {
        const newPayment = await response.json();
        setPayments((prev) => [...prev, newPayment]);
        setCreateModal({ isOpen: false });
        setModalState({
          isOpen: true,
          title: "Success",
          message: "Payment created successfully.",
          type: "alert",
          confirmText: "OK",
        });
      } else {
        throw new Error("Failed to create payment");
      }
    } catch (error) {
      console.error("Error creating payment:", error);
      setModalState({
        isOpen: true,
        title: "Error",
        message: "Failed to create payment. Please try again.",
        type: "alert",
        confirmText: "OK",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdatePayment = async (paymentData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/payments/${paymentData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(paymentData),
      });

      if (response.ok) {
        const updatedPayment = await response.json();
        setPayments((prev) =>
          prev.map((p) => (p.id === paymentData.id ? updatedPayment : p)),
        );
        setEditModal({ isOpen: false, payment: null });
        setModalState({
          isOpen: true,
          title: "Success",
          message: "Payment updated successfully.",
          type: "alert",
          confirmText: "OK",
        });
      } else {
        throw new Error("Failed to update payment");
      }
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

  const handleDeletePayment = async (paymentId) => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/payments/${paymentId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setPayments((prev) => prev.filter((p) => p.id !== paymentId));
        setModalState({
          isOpen: true,
          title: "Success",
          message: "Payment deleted successfully.",
          type: "alert",
          confirmText: "OK",
        });
      } else {
        throw new Error("Failed to delete payment");
      }
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

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(payments);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setPayments(items);

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
            userId: user.id,
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
      setPayments(updatedItems);
    } catch (error) {
      console.error("Error updating payment order:", error);
      // Revert to original order on error
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

  const currentDocuments = getCurrentDocuments();

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to Admin
          </Link>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-xl font-medium text-white">
              {currentUser.name?.charAt(0) ||
                currentUser.email?.charAt(0) ||
                "U"}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentUser.name || "Unknown User"}
              </h1>
              <p className="text-lg text-gray-600">{currentUser.email}</p>
              <div className="mt-1 space-y-1 text-sm text-gray-500">
                {currentUser.phone && <p>📞 {currentUser.phone}</p>}
                {currentUser.address && <p>📍 {currentUser.address}</p>}
                {currentUser.source && <p>🎯 Source: {currentUser.source}</p>}
                <p>⭐ Left Review: {currentUser.leftReview ? "Yes" : "No"}</p>
                <p>
                  Role:{" "}
                  <span className="font-medium">
                    {currentUser.role || "user"}
                  </span>{" "}
                  • Joined: {formatDate(currentUser.createdAt)}
                </p>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={() => setModalOpen(true)}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Edit User Info
            </button>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Statistics</h3>
        <div className="flex flex-nowrap gap-4 overflow-x-auto pb-2 sm:flex-wrap sm:gap-6 sm:overflow-x-visible">
          <div className="min-w-[140px] flex-shrink-0 rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {getAllDocuments().length}
            </div>
            <div className="text-sm text-blue-600">Total Documents</div>
          </div>
          <div className="min-w-[140px] flex-shrink-0 rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {documentsByType.photo.length}
            </div>
            <div className="text-sm text-green-600">Photos</div>
          </div>
          <div className="min-w-[140px] flex-shrink-0 rounded-lg bg-yellow-50 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {documentsByType.comment.length}
            </div>
            <div className="text-sm text-yellow-600">Comments</div>
          </div>
          <div className="min-w-[140px] flex-shrink-0 rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {documentsByType.quote.length + documentsByType.invoice.length}
            </div>
            <div className="text-sm text-purple-600">Quotes & Invoices</div>
          </div>
          <div className="min-w-[140px] flex-shrink-0 rounded-lg bg-orange-50 p-4">
            <div className="text-2xl font-bold text-orange-600">
              {payments?.length || 0}
            </div>
            <div className="text-sm text-orange-600">Payments</div>
          </div>
          <div className="min-w-[140px] flex-shrink-0 rounded-lg bg-indigo-50 p-4">
            <div className="text-2xl font-bold text-indigo-600">
              {projects?.length || 0}
            </div>
            <div className="text-sm text-indigo-600">Projects</div>
          </div>
          <div className="min-w-[140px] flex-shrink-0 rounded-lg bg-pink-50 p-4">
            <div className="text-2xl font-bold text-pink-600">
              {moodboards?.length || 0}
            </div>
            <div className="text-sm text-pink-600">Moodboards</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="relative mb-6">
        <nav className="hide-scrollbar flex flex-nowrap gap-2 overflow-x-auto border-b border-gray-200 pb-2 sm:gap-4">
          {[
            {
              id: "all",
              label: "All Documents",
              count: getAllDocuments().length,
            },
            {
              id: "photo",
              label: "Photos",
              count: documentsByType.photo.length,
            },
            {
              id: "comment",
              label: "Comments",
              count: documentsByType.comment.length,
            },
            {
              id: "quote",
              label: "Quotes",
              count: documentsByType.quote.length,
            },
            {
              id: "invoice",
              label: "Invoices",
              count: documentsByType.invoice.length,
            },
            {
              id: "payments",
              label: "Payment Plan",
              count: payments?.length || 0,
            },
            {
              id: "projects",
              label: "Projects",
              count: projects?.length || 0,
            },
            {
              id: "moodboards",
              label: "Moodboards",
              count: moodboards?.length || 0,
            },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`min-w-[120px] flex-shrink-0 border-b-2 px-4 py-2 text-sm font-medium transition-colors duration-150 ${
                activeTab === tab.id
                  ? "border-blue-500 bg-blue-50 text-blue-600"
                  : "border-transparent bg-white text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
        {/* Gradient fade on the right to indicate scrollability */}
        <div className="pointer-events-none absolute right-0 top-0 h-full w-8 bg-gradient-to-l from-white to-transparent" />
      </div>

      {/* Content based on active tab */}
      {activeTab === "payments" ? (
        <div>
          {/* Header */}
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Payment Plan</h2>
              <p className="mt-1 text-sm text-gray-600">
                Manage and track payment schedule for {user.name || user.email}
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
              Add Payment
            </button>
          </div>

          {/* Payment List */}
          {!payments || payments.length === 0 ? (
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
                No Payment Plan Found
              </h3>
              <p className="mb-6 text-gray-600">
                This user doesn&apos;t have any payments set up yet. Create a
                payment plan to get started.
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
                Create Payment Plan
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Payment Summary Cards */}
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
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-600">
                        Total Payments
                      </p>
                      <p className="text-2xl font-bold text-blue-900">
                        {payments.length}
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
                      <p className="text-sm font-medium text-green-600">Paid</p>
                      <p className="text-2xl font-bold text-green-900">
                        {payments.filter((p) => p.status === "Paid").length}
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
                      <p className="text-sm font-medium text-yellow-600">Due</p>
                      <p className="text-2xl font-bold text-yellow-900">
                        {payments.filter((p) => p.status === "Due").length}
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
                          payments.reduce((sum, p) => sum + p.amount, 0),
                        )}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Schedule with Drag & Drop */}
              <DragDropContext onDragEnd={handleDragEnd}>
                <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                  <div className="border-b border-gray-200 px-6 py-4">
                    <h3 className="text-lg font-semibold text-gray-900">
                      Payment Schedule
                    </h3>
                    <p className="mt-1 text-sm text-gray-600">
                      Drag and drop to reorder payments
                    </p>
                  </div>
                  <Droppable droppableId={`user-${user.id}-payments`}>
                    {(provided) => (
                      <div
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className="divide-y divide-gray-200"
                      >
                        {payments.map((payment, index) => (
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
                                  snapshot.isDragging ? "bg-blue-50" : ""
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
                                          Due: {formatDate(payment.dueDate)}
                                        </span>
                                        {payment.status === "Paid" && (
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
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex items-center space-x-4">
                                    <div className="text-right">
                                      <p className="text-sm font-semibold text-gray-900">
                                        {formatAmount(payment.amount)}
                                      </p>
                                    </div>
                                    <span
                                      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                        payment.status === "Paid"
                                          ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                                          : payment.status === "Due"
                                            ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                                            : "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                                      }`}
                                    >
                                      {payment.status === "Paid" && (
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
                                      {payment.status === "Due" && (
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
                                      {payment.status === "Scheduled" && (
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
                                          setModalState({
                                            isOpen: true,
                                            title: "Delete Payment",
                                            message: `Are you sure you want to delete "${payment.name}"? This action cannot be undone.`,
                                            type: "confirm",
                                            confirmText: "Delete",
                                            cancelText: "Cancel",
                                            onConfirm: () =>
                                              handleDeletePayment(payment.id),
                                          })
                                        }
                                        disabled={isDeleting}
                                        className="rounded-md border border-red-300 bg-red-50 px-2 py-1 text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                                      >
                                        {isDeleting ? "Deleting..." : "Delete"}
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
                </div>
              </DragDropContext>

              {/* Progress Overview */}
              <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
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
                          (payments.filter((p) => p.status === "Paid").length /
                            payments.length) *
                            100,
                        )}
                        %
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                        style={{
                          width: `${(payments.filter((p) => p.status === "Paid").length / payments.length) * 100}%`,
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="font-medium text-gray-900">
                        {formatAmount(
                          payments
                            .filter((p) => p.status === "Paid")
                            .reduce((sum, p) => sum + p.amount, 0),
                        )}
                      </div>
                      <div className="text-gray-600">Amount Paid</div>
                    </div>
                    <div className="rounded-lg bg-white p-3 shadow-sm">
                      <div className="font-medium text-gray-900">
                        {formatAmount(
                          payments
                            .filter((p) => p.status !== "Paid")
                            .reduce((sum, p) => sum + p.amount, 0),
                        )}
                      </div>
                      <div className="text-gray-600">Amount Remaining</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : activeTab === "projects" ? (
        <div>
          {/* Projects Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Projects</h2>
            <Link
              href="/admin/projects"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View All Projects
            </Link>
          </div>

          {/* Projects List */}
          {!projects || projects.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">🏗️</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No projects found
              </h3>
              <p className="text-gray-600">
                This user doesn&apos;t have any projects yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {project.name}
                        </h3>
                        {getStatusBadge(project.status)}
                        <span className="text-sm text-gray-500">
                          {formatDate(project.createdAt)}
                        </span>
                      </div>

                      <div className="mb-3 space-y-2 text-sm text-gray-600">
                        {project.description && <p>{project.description}</p>}
                        <div className="flex flex-wrap gap-4">
                          <span className="flex items-center">
                            <span className="mr-1">🏠</span>
                            {project.type}
                          </span>
                          {project.location && (
                            <span className="flex items-center">
                              <span className="mr-1">📍</span>
                              {project.location}
                            </span>
                          )}
                          {project.budget && (
                            <span className="flex items-center">
                              <span className="mr-1">💰</span>
                              {formatAmount(project.budget)}
                            </span>
                          )}
                          <span className="flex items-center">
                            <span className="mr-1">📊</span>
                            {project.progress}% complete
                          </span>
                        </div>
                        {project.projectManager && (
                          <p className="text-sm text-gray-500">
                            Project Manager: {project.projectManager.name} (
                            {project.projectManager.position})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      <Link
                        href={`/admin/projects/${project.id}`}
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View Project
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : activeTab === "moodboards" ? (
        <div>
          {/* Moodboards Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Moodboards</h2>
            <Link
              href="/admin/moodboards"
              className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
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
                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                />
              </svg>
              View All Moodboards
            </Link>
          </div>

          {/* Moodboards List */}
          {!moodboards || moodboards.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">🎨</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No moodboards found
              </h3>
              <p className="text-gray-600">
                This user doesn&apos;t have any moodboards yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {moodboards.map((moodboard) => (
                <div
                  key={moodboard.id}
                  className="rounded-lg border border-gray-200 bg-white p-6 shadow"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="mb-2 flex items-center space-x-3">
                        <h3 className="text-lg font-medium text-gray-900">
                          {moodboard.name}
                        </h3>
                        {getMoodboardStatusBadge(moodboard.status)}
                        <span className="text-sm text-gray-500">
                          {formatDate(moodboard.createdAt)}
                        </span>
                      </div>

                      <div className="mb-3 space-y-2 text-sm text-gray-600">
                        {moodboard.description && (
                          <p>{moodboard.description}</p>
                        )}
                        <div className="flex flex-wrap gap-4">
                          {moodboard.projectType && (
                            <span className="flex items-center">
                              <span className="mr-1">🏠</span>
                              {moodboard.projectType}
                            </span>
                          )}
                          <span className="flex items-center">
                            <span className="mr-1">📊</span>
                            {moodboard.isActive ? "Active" : "Inactive"}
                          </span>
                        </div>
                        {moodboard.notes && (
                          <p className="text-sm text-gray-500">
                            Notes: {moodboard.notes}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="ml-4 flex flex-col space-y-2">
                      <Link
                        href={`/admin/moodboards/${moodboard.id}`}
                        className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        <svg
                          className="mr-1 h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        View Moodboard
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : /* Documents Content */
      currentDocuments.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📄</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No documents found
          </h3>
          <p className="text-gray-600">
            {activeTab === "all"
              ? "This user hasn&apos;t created any documents yet."
              : `This user hasn&apos;t created any ${activeTab}s yet.`}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {currentDocuments.map((doc) => (
            <div
              key={doc.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-3">
                    <h3 className="text-lg font-medium capitalize text-gray-900">
                      {doc.type}
                    </h3>
                    <span className="text-sm text-gray-500">
                      {formatDate(doc.createdAt)}
                    </span>
                  </div>

                  <div className="mb-3 text-gray-600">
                    {doc.type === "photo" ? (
                      "Project photo"
                    ) : doc.type === "invoice" && isPdfUrl(doc.content) ? (
                      "PDF Invoice"
                    ) : doc.type === "quote" && isPdfUrl(doc.content) ? (
                      "PDF Quote"
                    ) : typeof doc.content === "string" ? (
                      doc.content
                    ) : (
                      <pre className="whitespace-pre-wrap text-sm">
                        {JSON.stringify(doc.content, null, 2)}
                      </pre>
                    )}
                  </div>
                </div>

                <div className="ml-4 flex flex-col space-y-2">
                  <button
                    onClick={() =>
                      openDeleteModal(doc.id, doc.type, doc.content)
                    }
                    disabled={isDeleting}
                    className="rounded-md border border-red-300 bg-red-50 px-3 py-1 text-sm font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isDeleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>

              {/* Show image for photos */}
              {doc.type === "photo" && typeof doc.content === "string" && (
                <div className="mt-4">
                  <img
                    src={doc.content}
                    alt="Document photo"
                    className="h-auto max-w-[300px] rounded border border-gray-200 object-cover"
                    onError={(e) => {
                      console.log("Image failed to load:", doc.content);
                      e.target.style.display = "none";
                    }}
                  />
                </div>
              )}

              {/* Show embedded PDF for invoices */}
              {doc.type === "invoice" &&
                typeof doc.content === "string" &&
                isPdfUrl(doc.content) && (
                  <div className="mt-4">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          PDF Invoice
                        </h4>
                        <a
                          href={doc.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Download PDF
                        </a>
                      </div>
                      <iframe
                        src={doc.content}
                        className="h-[600px] w-full rounded border border-gray-200"
                        title="Invoice PDF"
                        onError={(e) => {
                          console.log("PDF failed to load:", doc.content);
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="flex hidden h-[600px] w-full items-center justify-center rounded border border-gray-200 bg-gray-100 text-sm text-gray-500"
                        style={{ display: "none" }}
                      >
                        <div className="text-center">
                          <svg
                            className="mx-auto mb-2 h-8 w-8 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p>PDF unavailable</p>
                          <a
                            href={doc.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-blue-600 hover:text-blue-800"
                          >
                            Open in new tab
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

              {/* Show embedded PDF for quotes */}
              {doc.type === "quote" &&
                typeof doc.content === "string" &&
                isPdfUrl(doc.content) && (
                  <div className="mt-4">
                    <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                      <div className="mb-3 flex items-center justify-between">
                        <h4 className="text-sm font-medium text-gray-900">
                          PDF Quote
                        </h4>
                        <a
                          href={doc.content}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                        >
                          <svg
                            className="mr-1 h-3 w-3"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                              clipRule="evenodd"
                            />
                          </svg>
                          Download PDF
                        </a>
                      </div>
                      <iframe
                        src={doc.content}
                        className="h-[600px] w-full rounded border border-gray-200"
                        title="Quote PDF"
                        onError={(e) => {
                          console.log("PDF failed to load:", doc.content);
                          e.target.style.display = "none";
                          e.target.nextSibling.style.display = "flex";
                        }}
                      />
                      <div
                        className="flex hidden h-[600px] w-full items-center justify-center rounded border border-gray-200 bg-gray-100 text-sm text-gray-500"
                        style={{ display: "none" }}
                      >
                        <div className="text-center">
                          <svg
                            className="mx-auto mb-2 h-8 w-8 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2H4zm0 2h12v8H4V6z"
                              clipRule="evenodd"
                            />
                          </svg>
                          <p>PDF unavailable</p>
                          <a
                            href={doc.content}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-2 text-blue-600 hover:text-blue-800"
                          >
                            Open in new tab
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
            </div>
          ))}
        </div>
      )}

      {/* Modals */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            documentId: null,
            documentType: "",
            documentContent: "",
          })
        }
        onConfirm={() => {
          if (modalState.documentId && modalState.type === "confirm") {
            handleDeleteDocument(
              modalState.documentId,
              modalState.documentType,
            );
          } else if (modalState.onConfirm) {
            modalState.onConfirm();
          }
        }}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        cancelText={modalState.cancelText}
        type={modalState.type}
      />

      {/* Create Payment Modal */}
      {createModal.isOpen && (
        <CreatePaymentModal
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

      <UserInfoModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        user={currentUser}
        onSave={(u) => {
          setCurrentUser(u);
          setModalOpen(false);
        }}
      />
    </div>
  );
}

// Create Payment Modal Component
function CreatePaymentModal({ onClose, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    name: "",
    amount: "",
    dueDate: "",
    status: "Scheduled",
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      dueDate: new Date(formData.dueDate).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Create Payment
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="e.g., Deposit, 1st Instalment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (£)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
              {isSubmitting ? "Creating..." : "Create Payment"}
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
    id: payment.id,
    name: payment.name,
    amount: payment.amount,
    dueDate: payment.dueDate
      ? new Date(payment.dueDate).toISOString().split("T")[0]
      : "",
    status: payment.status,
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      amount: parseFloat(formData.amount),
      dueDate: new Date(formData.dueDate).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Edit Payment</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Payment Name
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="e.g., Deposit, 1st Instalment"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Amount (£)
            </label>
            <input
              type="number"
              step="0.01"
              required
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Due Date
            </label>
            <input
              type="date"
              required
              value={formData.dueDate}
              onChange={(e) =>
                setFormData({ ...formData, dueDate: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
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
              {isSubmitting ? "Updating..." : "Update Payment"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
