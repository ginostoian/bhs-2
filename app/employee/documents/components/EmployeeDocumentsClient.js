"use client";

import { useState } from "react";

/**
 * Employee Documents Client Component
 * Displays documents with filtering options
 */
export default function EmployeeDocumentsClient({
  documents: initialDocuments,
}) {
  const [documents, setDocuments] = useState(initialDocuments);
  const [filterType, setFilterType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Filter documents
  const filteredDocuments = documents.filter((doc) => {
    // Filter by type
    if (filterType !== "all" && doc.type !== filterType) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const typeMatch = doc.type.toLowerCase().includes(searchLower);
      if (!typeMatch) return false;
    }

    return true;
  });

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Type
              </label>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-48"
              >
                <option value="all">All Types</option>
                <option value="quote">Quotes</option>
                <option value="invoice">Invoices</option>
                <option value="comment">Comments</option>
                <option value="photo">Photos</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search documents..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredDocuments.map((doc) => (
          <div
            key={doc.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-md"
          >
            <div className="flex items-center space-x-3">
              <span className="text-2xl">
                {doc.type === "quote"
                  ? "📄"
                  : doc.type === "invoice"
                    ? "💰"
                    : doc.type === "comment"
                      ? "💬"
                      : doc.type === "photo"
                        ? "📸"
                        : "📋"}
              </span>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900">
                  {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                </h3>
                <p className="text-sm text-gray-500">
                  {formatDate(doc.createdAt)}
                </p>
              </div>
            </div>

            {doc.type === "comment" && (
              <div className="mt-3">
                <p className="text-sm text-gray-600">
                  {typeof doc.content === "string"
                    ? doc.content
                    : "Document content"}
                </p>
              </div>
            )}

            {doc.type === "photo" && (
              <div className="mt-3">
                <img
                  src={doc.content}
                  alt="Document"
                  className="h-32 w-full rounded object-cover"
                />
              </div>
            )}

            {doc.type === "quote" || doc.type === "invoice" ? (
              <div className="mt-3">
                <p className="text-sm text-gray-500">
                  Price information is hidden for employees
                </p>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredDocuments.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">📄</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Documents Found
          </h3>
          <p className="text-gray-600">
            {documents.length === 0
              ? "No documents are available for your assigned projects."
              : "No documents match your current filters."}
          </p>
        </div>
      )}

      {/* Summary Statistics */}
      {documents.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Document Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {documents.length}
              </div>
              <div className="text-sm text-gray-500">Total Documents</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {documents.filter((d) => d.type === "quote").length}
              </div>
              <div className="text-sm text-gray-500">Quotes</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {documents.filter((d) => d.type === "invoice").length}
              </div>
              <div className="text-sm text-gray-500">Invoices</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {documents.filter((d) => d.type === "photo").length}
              </div>
              <div className="text-sm text-gray-500">Photos</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
