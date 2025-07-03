"use client";

import { useState } from "react";
import Link from "next/link";
import DocumentList from "../../../../dashboard/components/DocumentList";
import Modal from "@/components/Modal";

/**
 * User Detail Client Component
 * Displays user information and all their documents with management capabilities
 */
export default function UserDetailClient({
  user,
  documentsByType: initialDocumentsByType,
}) {
  const [documentsByType, setDocumentsByType] = useState(
    initialDocumentsByType,
  );
  const [activeTab, setActiveTab] = useState("all");
  const [isDeleting, setIsDeleting] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    documentId: null,
    documentType: "",
    documentContent: "",
  });

  // Handle document deletion
  const handleDeleteDocument = async (documentId, documentType) => {
    setIsDeleting(true);

    try {
      const response = await fetch(`/api/documents/${documentId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete document");
      }

      // Remove document from state
      setDocumentsByType((prev) => ({
        ...prev,
        [documentType]: prev[documentType].filter(
          (doc) => doc.id !== documentId,
        ),
      }));
    } catch (error) {
      console.error("Error deleting document:", error);
      // Show error modal
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

  // Open delete confirmation modal
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

  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Check if content is a PDF URL
  const isPdfUrl = (content) => {
    return (
      typeof content === "string" &&
      content.startsWith("http") &&
      content.toLowerCase().includes(".pdf")
    );
  };

  // Get all documents for display
  const getAllDocuments = () => {
    return Object.values(documentsByType).flat();
  };

  // Get documents for current tab
  const getCurrentDocuments = () => {
    if (activeTab === "all") {
      return getAllDocuments();
    }
    return documentsByType[activeTab] || [];
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

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-xl font-medium text-white">
            {user.name?.charAt(0) || user.email?.charAt(0) || "U"}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.name || "Unknown User"}
            </h1>
            <p className="text-lg text-gray-600">{user.email}</p>
            <p className="text-sm text-gray-500">
              Role: <span className="font-medium">{user.role || "user"}</span> •
              Joined: {formatDate(user.createdAt)}
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Document Statistics
        </h3>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {getAllDocuments().length}
            </div>
            <div className="text-sm text-blue-600">Total Documents</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {documentsByType.photo.length}
            </div>
            <div className="text-sm text-green-600">Photos</div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {documentsByType.comment.length}
            </div>
            <div className="text-sm text-yellow-600">Comments</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {documentsByType.quote.length + documentsByType.invoice.length}
            </div>
            <div className="text-sm text-purple-600">Quotes & Invoices</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-6">
        <nav className="flex space-x-8 border-b border-gray-200">
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
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              {tab.label} ({tab.count})
            </button>
          ))}
        </nav>
      </div>

      {/* Documents */}
      {currentDocuments.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📄</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No documents found
          </h3>
          <p className="text-gray-600">
            {activeTab === "all"
              ? "This user hasn't created any documents yet."
              : `This user hasn't created any ${activeTab}s yet.`}
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

      {/* Modal */}
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
