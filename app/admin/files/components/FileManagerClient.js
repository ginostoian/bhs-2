"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";

/**
 * File Manager Client Component
 * Handles file listing, filtering, and management for admins
 */
export default function FileManagerClient() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [filters, setFilters] = useState({
    fileType: "",
    entityType: "",
    tags: "",
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    totalCount: 0,
    totalPages: 0,
  });

  // Fetch files from API
  const fetchFiles = async () => {
    try {
      setLoading(true);

      const params = new URLSearchParams({
        page: pagination.page.toString(),
        limit: pagination.limit.toString(),
        ...(filters.fileType && { fileType: filters.fileType }),
        ...(filters.entityType && { entityType: filters.entityType }),
        ...(filters.tags && { tags: filters.tags }),
      });

      const response = await fetch(`/api/files?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch files");
      }

      setFiles(data.files);
      setPagination((prev) => ({
        ...prev,
        totalCount: data.totalCount,
        totalPages: data.totalPages,
      }));
    } catch (error) {
      console.error("Error fetching files:", error);
      toast.error("Failed to load files");
    } finally {
      setLoading(false);
    }
  };

  // Load files on component mount and filter changes
  useEffect(() => {
    fetchFiles();
  }, [pagination.page, filters]);

  // Handle file selection
  const handleFileSelect = (fileId, checked) => {
    if (checked) {
      setSelectedFiles((prev) => [...prev, fileId]);
    } else {
      setSelectedFiles((prev) => prev.filter((id) => id !== fileId));
    }
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedFiles(files.map((file) => file.id));
    } else {
      setSelectedFiles([]);
    }
  };

  // Handle bulk delete
  const handleBulkDelete = async () => {
    if (selectedFiles.length === 0) {
      toast.error("No files selected");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to delete ${selectedFiles.length} file(s)?`,
      )
    ) {
      return;
    }

    try {
      const response = await fetch("/api/files", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fileIds: selectedFiles,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to delete files");
      }

      toast.success(data.message);
      setSelectedFiles([]);
      fetchFiles();
    } catch (error) {
      console.error("Error deleting files:", error);
      toast.error("Failed to delete files");
    }
  };

  // Handle filter changes
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPagination((prev) => ({ ...prev, page: 1 })); // Reset to first page
  };

  // Handle page change
  const handlePageChange = (page) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  // Get file icon
  const getFileIcon = (fileName) => {
    const ext = fileName.split(".").pop()?.toLowerCase();
    const icons = {
      pdf: "📄",
      doc: "📝",
      docx: "📝",
      xls: "📊",
      xlsx: "📊",
      ppt: "📽️",
      pptx: "📽️",
      jpg: "🖼️",
      jpeg: "🖼️",
      png: "🖼️",
      gif: "🖼️",
      webp: "🖼️",
      mp4: "🎥",
      avi: "🎥",
      mov: "🎥",
      zip: "📦",
      rar: "📦",
      txt: "📄",
      default: "📎",
    };
    return icons[ext] || icons.default;
  };

  // Format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Filters</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              File Type
            </label>
            <select
              value={filters.fileType}
              onChange={(e) => handleFilterChange("fileType", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Types</option>
              <option value="image">Images</option>
              <option value="document">Documents</option>
              <option value="video">Videos</option>
              <option value="audio">Audio</option>
              <option value="archive">Archives</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Entity Type
            </label>
            <select
              value={filters.entityType}
              onChange={(e) => handleFilterChange("entityType", e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="">All Entities</option>
              <option value="document">Documents</option>
              <option value="task">Tasks</option>
              <option value="project">Projects</option>
              <option value="user">Users</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tags
            </label>
            <input
              type="text"
              value={filters.tags}
              onChange={(e) => handleFilterChange("tags", e.target.value)}
              placeholder="Enter tags (comma-separated)"
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBulkDelete}
            disabled={selectedFiles.length === 0}
            className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete Selected ({selectedFiles.length})
          </button>
        </div>
        <div className="text-sm text-gray-600">
          Total: {pagination.totalCount} files
        </div>
      </div>

      {/* Files Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        {loading ? (
          <div className="p-8 text-center">
            <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <p className="mt-2 text-gray-600">Loading files...</p>
          </div>
        ) : files.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-600">No files found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    <input
                      type="checkbox"
                      checked={
                        selectedFiles.length === files.length &&
                        files.length > 0
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    File
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Size
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Uploaded By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Entity
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Uploaded
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {files.map((file) => (
                  <tr key={file.id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <input
                        type="checkbox"
                        checked={selectedFiles.includes(file.id)}
                        onChange={(e) =>
                          handleFileSelect(file.id, e.target.checked)
                        }
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center">
                        <span className="mr-3 text-2xl">
                          {getFileIcon(file.originalName)}
                        </span>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {file.originalName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {file.contentType}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {formatFileSize(file.size)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      {file.uploadedBy?.name || "Unknown"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                        {file.entityType || "other"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(file.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <a
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mr-3 text-blue-600 hover:text-blue-900"
                      >
                        View
                      </a>
                      <button
                        onClick={() =>
                          handleFileSelect(
                            file.id,
                            !selectedFiles.includes(file.id),
                          )
                        }
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>

            {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
              (page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`rounded-md px-3 py-2 text-sm font-medium ${
                    page === pagination.page
                      ? "bg-blue-600 text-white"
                      : "border border-gray-300 bg-white text-gray-500 hover:bg-gray-50"
                  }`}
                >
                  {page}
                </button>
              ),
            )}

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page === pagination.totalPages}
              className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}
