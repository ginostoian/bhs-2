"use client";

import { useState } from "react";
import Link from "next/link";
import DocumentList from "../../../../dashboard/components/DocumentList";

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

  // Handle document deletion
  const handleDeleteDocument = async (documentId, documentType) => {
    if (!confirm("Are you sure you want to delete this document?")) {
      return;
    }

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
      alert("Failed to delete document. Please try again.");
    } finally {
      setIsDeleting(false);
    }
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
                    onClick={() => handleDeleteDocument(doc.id, doc.type)}
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
                  {doc.content.includes("drive.google.com/file/d/") ? (
                    <div className="h-[300px] w-[300px] overflow-hidden rounded border border-gray-200">
                      <iframe
                        src={doc.content}
                        title="Document photo"
                        className="h-full w-full"
                        frameBorder="0"
                      />
                    </div>
                  ) : (
                    <img
                      src={doc.content}
                      alt="Document photo"
                      className="h-auto max-w-[300px] rounded border border-gray-200 object-cover"
                    />
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
