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
      Lead: "bg-blue-100 text-blue-800",
      "On Going": "bg-yellow-100 text-yellow-800",
      Finished: "bg-green-100 text-green-800",
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

    setPayments(items);

    // Update order in database
    try {
      await fetch("/api/payments/update-statuses", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          payments: items.map((item, index) => ({
            id: item.id,
            order: index + 1,
          })),
        }),
      });
    } catch (error) {
      console.error("Error updating payment order:", error);
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
          {/* Payment Plan Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Payment Plan</h2>
            <button
              onClick={() => setCreateModal({ isOpen: true })}
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
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Add Payment
            </button>
          </div>

          {/* Payment List */}
          {!payments || payments.length === 0 ? (
            <div className="py-12 text-center">
              <div className="mb-4 text-6xl">💰</div>
              <h3 className="mb-2 text-lg font-medium text-gray-900">
                No payments found
              </h3>
              <p className="text-gray-600">
                This user doesn&apos;t have any payments set up yet.
              </p>
            </div>
          ) : (
            <DragDropContext onDragEnd={handleDragEnd}>
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
                <Droppable droppableId={`user-${user.id}-payments`}>
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
                            {payments.map((payment, index) => (
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
                                {payments.length} payment
                                {payments.length !== 1 ? "s" : ""}
                              </td>
                              <td className="px-6 py-4 text-sm font-bold text-gray-900">
                                £
                                {payments
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
            </DragDropContext>
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
