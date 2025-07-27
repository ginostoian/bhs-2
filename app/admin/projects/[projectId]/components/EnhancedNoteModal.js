"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";

/**
 * Enhanced Note Modal Component
 * Handles creating and editing notes with rich text capabilities
 */
export default function EnhancedNoteModal({
  isOpen,
  onClose,
  onSubmit,
  note,
  availableTags,
}) {
  const [formData, setFormData] = useState({
    title: note?.title || "",
    content: note?.content || "",
    tags: note?.tags || [],
    customTag: note?.customTag || "",
    isImportant: note?.isImportant || false,
    attachments: note?.attachments || [],
  });

  const [showCustomTag, setShowCustomTag] = useState(
    note?.tags?.includes("custom") || false,
  );

  const [newAttachment, setNewAttachment] = useState({
    name: "",
    url: "",
    type: "",
  });

  // Reset form when note changes
  useEffect(() => {
    if (note) {
      const newFormData = {
        title: note.title || "",
        content: note.content || "",
        tags: note.tags || [],
        customTag: note.customTag || "",
        isImportant: note.isImportant || false,
        attachments: note.attachments || [],
      };
      setFormData(newFormData);
      setShowCustomTag(note.tags?.includes("custom") || false);
    } else {
      setFormData({
        title: "",
        content: "",
        tags: [],
        customTag: "",
        isImportant: false,
        attachments: [],
      });
      setShowCustomTag(false);
    }
  }, [note]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      alert("Please fill in both title and content");
      return;
    }

    // Validate custom tag
    if (formData.tags.includes("custom") && !formData.customTag.trim()) {
      alert("Please enter a custom tag name");
      return;
    }

    onSubmit(formData);
  };

  const handleTagChange = (tagValue) => {
    setFormData((prev) => {
      const newTags = prev.tags.includes(tagValue)
        ? prev.tags.filter((t) => t !== tagValue)
        : [...prev.tags, tagValue];

      return {
        ...prev,
        tags: newTags,
        customTag: tagValue === "custom" ? prev.customTag : "",
      };
    });

    setShowCustomTag(tagValue === "custom");
  };

  // Get file type from URL
  const getFileTypeFromUrl = (url) => {
    if (!url) return "";
    const extension = url.split(".").pop()?.toLowerCase();
    return extension || "";
  };

  // Add attachment
  const handleAddAttachment = () => {
    if (!newAttachment.name.trim() || !newAttachment.url.trim()) {
      alert("Please fill in both file name and URL");
      return;
    }

    const fileType =
      newAttachment.type || getFileTypeFromUrl(newAttachment.url);

    setFormData((prev) => {
      const newAttachments = [
        ...prev.attachments,
        {
          name: newAttachment.name,
          url: newAttachment.url,
          type: fileType,
          uploadedAt: new Date(),
        },
      ];
      return {
        ...prev,
        attachments: newAttachments,
      };
    });

    setNewAttachment({ name: "", url: "", type: "" });
  };

  // Remove attachment
  const handleRemoveAttachment = (index) => {
    setFormData((prev) => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index),
    }));
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-xl bg-white shadow-2xl">
        <div className="max-h-[calc(90vh-2rem)] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 border-b border-gray-200 bg-white px-6 py-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {note ? "Edit Note" : "Create New Note"}
                </h3>
                <p className="mt-1 text-sm text-gray-600">
                  {note
                    ? "Update your note with rich text formatting"
                    : "Create a new note with rich text formatting"}
                </p>
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6 p-6">
            {/* Title */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Note Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full rounded-lg border border-gray-300 px-4 py-3 transition-colors focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter a descriptive title for your note"
                required
              />
            </div>

            {/* Rich Text Content */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Note Content *
              </label>
              <RichTextEditor
                value={formData.content}
                onChange={(content) =>
                  setFormData((prev) => ({ ...prev, content }))
                }
                placeholder="Write your note content here... You can use the toolbar above to format your text."
              />
            </div>

            {/* Tags Section */}
            <div className="rounded-lg bg-gray-50 p-4">
              <label className="mb-3 block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                {availableTags.map((tag) => (
                  <label
                    key={tag.value}
                    className={`flex cursor-pointer items-center space-x-3 rounded-lg border-2 p-3 transition-all duration-200 ${
                      formData.tags.includes(tag.value)
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag.value)}
                      onChange={() => handleTagChange(tag.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium text-gray-900">
                      {tag.icon} {tag.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Tag */}
            {showCustomTag && (
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Custom Tag Name
                </label>
                <input
                  type="text"
                  value={formData.customTag}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      customTag: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter your custom tag name"
                  required={showCustomTag}
                />
              </div>
            )}

            {/* Important Toggle */}
            <div className="flex items-center space-x-3 rounded-lg border border-orange-200 bg-orange-50 p-4">
              <input
                type="checkbox"
                id="important"
                checked={formData.isImportant}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    isImportant: e.target.checked,
                  }))
                }
                className="rounded border-gray-300 text-orange-600 focus:ring-orange-500"
              />
              <label
                htmlFor="important"
                className="flex items-center text-sm font-medium text-gray-900"
              >
                <svg
                  className="mr-2 h-5 w-5 text-orange-600"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                Mark as Important
              </label>
            </div>

            {/* File Attachments */}
            <div className="rounded-lg bg-gray-50 p-4">
              <label className="mb-3 block text-sm font-medium text-gray-700">
                File Attachments
              </label>

              {/* Current Attachments */}
              {formData.attachments.length > 0 && (
                <div className="mb-4 space-y-2">
                  {formData.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 rounded-lg border border-gray-200 bg-white p-3"
                    >
                      <span className="text-lg">
                        {getFileIcon(attachment.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium text-gray-900">
                          {attachment.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {attachment.type.toUpperCase()}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="rounded p-1 text-red-500 transition-colors hover:bg-red-50 hover:text-red-700"
                        title="Remove attachment"
                      >
                        <svg
                          className="h-4 w-4"
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
                  ))}
                </div>
              )}

              {/* Add New Attachment */}
              <div className="rounded-lg border border-gray-200 bg-white p-4">
                <div className="mb-3 grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      File Name
                    </label>
                    <input
                      type="text"
                      value={newAttachment.name}
                      onChange={(e) =>
                        setNewAttachment((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Project Plan.pdf"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium text-gray-700">
                      File Type (optional)
                    </label>
                    <input
                      type="text"
                      value={newAttachment.type}
                      onChange={(e) =>
                        setNewAttachment((prev) => ({
                          ...prev,
                          type: e.target.value,
                        }))
                      }
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., pdf, doc, jpg"
                    />
                  </div>
                </div>
                <div className="mb-3">
                  <label className="mb-1 block text-xs font-medium text-gray-700">
                    File URL
                  </label>
                  <input
                    type="url"
                    value={newAttachment.url}
                    onChange={(e) =>
                      setNewAttachment((prev) => ({
                        ...prev,
                        url: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="w-full rounded-md bg-gray-100 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  + Add Attachment
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 border-t border-gray-200 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg border border-gray-300 px-6 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-2 font-medium text-white transition-all duration-200 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {note ? "Update Note" : "Create Note"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
