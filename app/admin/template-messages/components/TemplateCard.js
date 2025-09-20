"use client";

import { useState } from "react";

/**
 * Template Card Component
 * Displays individual template information with actions
 */
export default function TemplateCard({
  template,
  onEdit,
  onDelete,
  onUse,
  onPreview,
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  // Get category badge styling
  const getCategoryBadge = (category) => {
    const styles = {
      "Email Templates": "bg-blue-100 text-blue-800",
      "SMS Templates": "bg-green-100 text-green-800",
      "General Messages": "bg-gray-100 text-gray-800",
      "Project Communications": "bg-purple-100 text-purple-800",
      "Support Responses": "bg-orange-100 text-orange-800",
      "Quote Templates": "bg-yellow-100 text-yellow-800",
      "Bank Information": "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          styles[category] || "bg-gray-100 text-gray-800"
        }`}
      >
        {category}
      </span>
    );
  };

  // Get content preview (strip HTML and limit length)
  const getContentPreview = (content) => {
    if (!content) return "No content";
    const plainText = content.replace(/<[^>]*>/g, "");
    return plainText.length > 100
      ? plainText.substring(0, 100) + "..."
      : plainText;
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(template.content);
      // Track usage
      onUse(template.id);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  // Handle delete
  const handleDelete = () => {
    setIsDeleting(true);
    onDelete(template.id, template.title);
  };

  return (
    <div className="flex h-full flex-col rounded-lg border border-gray-200 bg-white p-5 shadow transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between">
          <h3
            className="overflow-hidden text-lg font-semibold text-gray-900"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {template.title}
          </h3>
          <div className="ml-2 flex-shrink-0">
            {getCategoryBadge(template.category)}
          </div>
        </div>
        {template.description && (
          <p
            className="mt-1 overflow-hidden text-sm text-gray-600"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {template.description}
          </p>
        )}
      </div>

      {/* Content Preview */}
      <div className="mb-4 flex-1">
        <div className="rounded-md bg-gray-50 p-3">
          <p
            className="overflow-hidden text-sm text-gray-700"
            style={{
              display: "-webkit-box",
              WebkitLineClamp: 4,
              WebkitBoxOrient: "vertical",
            }}
          >
            {getContentPreview(template.content)}
          </p>
        </div>
      </div>

      {/* Tags */}
      {template.tags && template.tags.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {template.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs text-gray-600"
              >
                #{tag}
              </span>
            ))}
            {template.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{template.tags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="mb-4 flex items-center justify-between text-xs text-gray-500">
        <div className="flex items-center space-x-4">
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
                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
              />
            </svg>
            {template.usageCount || 0} uses
          </span>
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
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            {formatDate(template.lastUsed)}
          </span>
        </div>
        <div className="flex items-center">
          <span
            className={`inline-flex h-2 w-2 rounded-full ${
              template.isActive ? "bg-green-400" : "bg-gray-400"
            }`}
          ></span>
          <span className="ml-1 text-xs">
            {template.isActive ? "Active" : "Inactive"}
          </span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={() => onPreview(template)}
          className="flex-1 rounded-md border border-blue-300 bg-blue-50 px-3 py-1 text-center text-xs font-medium text-blue-700 hover:bg-blue-100"
        >
          Preview
        </button>
        <button
          onClick={handleCopy}
          className="flex-1 rounded-md border border-green-300 bg-green-50 px-3 py-1 text-center text-xs font-medium text-green-700 hover:bg-green-100"
        >
          Copy
        </button>
        <button
          onClick={() => onEdit(template)}
          className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-1 text-center text-xs font-medium text-gray-700 hover:bg-gray-100"
        >
          Edit
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex-1 rounded-md border border-red-300 bg-red-50 px-3 py-1 text-center text-xs font-medium text-red-700 hover:bg-red-100 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isDeleting ? "..." : "Delete"}
        </button>
      </div>

      {/* Created by info */}
      <div className="mt-3 text-xs text-gray-500">
        Created by {template.createdBy?.name || "Unknown"} on{" "}
        {formatDate(template.createdAt)}
      </div>
    </div>
  );
}
