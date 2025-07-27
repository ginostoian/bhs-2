"use client";

/**
 * Enhanced View Note Modal Component
 * Displays full note content with rich text formatting and attachments
 */
export default function EnhancedViewNoteModal({
  isOpen,
  onClose,
  note,
  availableTags,
}) {
  // Get tag display info
  const getTagInfo = (tag) => {
    return (
      availableTags.find((t) => t.value === tag) || {
        label: tag,
        icon: "🏷️",
        color: "bg-gray-100 text-gray-800",
      }
    );
  };

  // Format date
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Get file type icon
  const getFileIcon = (fileType) => {
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
    return icons[fileType.toLowerCase()] || icons.default;
  };

  if (!isOpen || !note) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-5xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="max-h-[calc(90vh-2rem)] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="min-w-0 flex-1">
                <h3 className="truncate text-xl font-semibold text-gray-900">
                  {note.title}
                </h3>
                <div className="mt-1 flex items-center space-x-4 text-sm text-gray-600">
                  <span className="flex items-center">
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    {formatDate(note.createdAt)}
                  </span>
                  <span className="flex items-center">
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
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    {note.createdBy?.name || "Unknown"}
                  </span>
                  {note.isImportant && (
                    <span className="inline-flex items-center rounded-full bg-orange-100 px-2.5 py-0.5 text-xs font-medium text-orange-800">
                      <svg
                        className="mr-1 h-3 w-3"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      Important
                    </span>
                  )}
                </div>
              </div>
              <button
                onClick={onClose}
                className="ml-4 rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
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
          </div>

          {/* Content */}
          <div className="space-y-6 p-6">
            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-700">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => {
                    const tagInfo = getTagInfo(tag);
                    return (
                      <span
                        key={tag}
                        className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${tagInfo.color}`}
                      >
                        {tagInfo.icon} {tagInfo.label}
                        {tag === "custom" &&
                          note.customTag &&
                          `: ${note.customTag}`}
                      </span>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Note Content */}
            <div>
              <h4 className="mb-3 text-sm font-medium text-gray-700">
                Content
              </h4>
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-6">
                <div
                  className="prose-sm prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: note.content }}
                />
              </div>
            </div>

            {/* Attachments */}
            {note.attachments && note.attachments.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-medium text-gray-700">
                  Attachments ({note.attachments.length})
                </h4>
                <div className="grid gap-3">
                  {note.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-4 rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-sm"
                    >
                      <div className="flex-shrink-0">
                        <span className="text-2xl">
                          {getFileIcon(attachment.type)}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-gray-900">
                          {attachment.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {attachment.type.toUpperCase()} •{" "}
                          {formatDate(attachment.uploadedAt)}
                        </div>
                      </div>
                      <div className="flex-shrink-0">
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                          View
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="rounded-lg bg-gray-50 p-4">
              <h4 className="mb-3 text-sm font-medium text-gray-700">
                Note Details
              </h4>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-gray-400"
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
                  <span className="text-gray-500">Created:</span>
                  <span className="font-medium text-gray-900">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
                {note.modifiedBy && (
                  <div className="flex items-center space-x-2">
                    <svg
                      className="h-4 w-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      />
                    </svg>
                    <span className="text-gray-500">Modified:</span>
                    <span className="font-medium text-gray-900">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-gray-500">Created by:</span>
                  <span className="font-medium text-gray-900">
                    {note.createdBy?.name || "Unknown"}
                  </span>
                </div>
                <div className="flex items-center space-x-2">
                  <svg
                    className="h-4 w-4 text-gray-400"
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
                  <span className="text-gray-500">Status:</span>
                  <span className="font-medium text-gray-900">
                    {note.isImportant ? (
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                        <svg
                          className="mr-1 h-3 w-3"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        Important
                      </span>
                    ) : (
                      "Normal"
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
