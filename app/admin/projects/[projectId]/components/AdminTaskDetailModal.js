"use client";

/**
 * Admin Task Detail Modal Component
 * Modal for viewing admin task details
 */
export default function AdminTaskDetailModal({
  isOpen,
  onClose,
  task,
  admins,
}) {
  if (!isOpen || !task) return null;

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const badges = {
      Scheduled: "bg-gray-100 text-gray-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Done: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[status] || badges["Scheduled"]}`}
      >
        {status}
      </span>
    );
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority) => {
    const badges = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[priority] || badges.medium}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-4xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Admin Task Details
          </h2>
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

        <div className="space-y-6">
          {/* Task Header */}
          <div className="border-b border-gray-200 pb-4">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h3 className="text-lg font-medium text-gray-900">
                  {task.name}
                </h3>
                <div className="mt-2 flex items-center space-x-3">
                  {getStatusBadge(task.status)}
                  {getPriorityBadge(task.priority)}
                  <span className="text-sm text-gray-500">
                    Order: #{task.order}
                  </span>
                </div>
              </div>
              <div className="text-right text-sm text-gray-500">
                <div>Created: {formatDate(task.createdAt)}</div>
                {task.updatedAt && task.updatedAt !== task.createdAt && (
                  <div>Updated: {formatDate(task.updatedAt)}</div>
                )}
              </div>
            </div>
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Left Column */}
            <div className="space-y-6">
              {/* Description */}
              {task.description && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Description
                  </h4>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-sm text-gray-700">
                      {task.description}
                    </p>
                  </div>
                </div>
              )}

              {/* Assigned To */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Assigned To
                </h4>
                <div className="rounded-lg bg-gray-50 p-4">
                  {task.assignedTo ? (
                    <div className="flex items-center space-x-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <span className="text-sm font-medium text-blue-600">
                          {task.assignedTo.name?.charAt(0) ||
                            task.assignedTo.email?.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {task.assignedTo.name || "No name"}
                        </p>
                        <p className="text-sm text-gray-500">
                          {task.assignedTo.email}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500">Unassigned</p>
                  )}
                </div>
              </div>

              {/* Notes */}
              {task.notes && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Notes
                  </h4>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-sm text-gray-700">
                      {task.notes}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {/* Due Date */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-900">
                  Due Date
                </h4>
                <div className="rounded-lg bg-gray-50 p-4">
                  <div className="flex items-center space-x-2">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="text-sm font-medium text-gray-900">
                      {formatDate(task.dueDate)}
                    </span>
                  </div>
                  {task.dueDate && (
                    <div className="mt-2 text-xs text-gray-500">
                      {new Date(task.dueDate) < new Date() &&
                      task.status !== "Done" ? (
                        <span className="text-red-600">⚠️ Overdue</span>
                      ) : new Date(task.dueDate) <
                        new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) ? (
                        <span className="text-orange-600">⚠️ Due soon</span>
                      ) : (
                        <span className="text-green-600">✓ On track</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Attachments */}
              {task.attachments && task.attachments.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Attachments
                  </h4>
                  <div className="space-y-2">
                    {task.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                          <svg
                            className="h-4 w-4 text-gray-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                            />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            {attachment.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {attachment.size
                              ? `${(attachment.size / 1024).toFixed(1)} KB`
                              : "Unknown size"}
                          </p>
                        </div>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <svg
                            className="h-4 w-4"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Documents */}
              {task.relatedDocuments && task.relatedDocuments.length > 0 && (
                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Related Documents
                  </h4>
                  <div className="space-y-2">
                    {task.relatedDocuments.map((doc, index) => (
                      <div
                        key={index}
                        className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3"
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-100">
                          <svg
                            className="h-4 w-4 text-gray-600"
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
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium text-gray-900">
                            Document {index + 1}
                          </p>
                          <p className="text-xs text-gray-500">
                            Related document
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex justify-end space-x-3 border-t border-gray-200 pt-6">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
