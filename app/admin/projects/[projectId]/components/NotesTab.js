"use client";

import { useState, useEffect } from "react";

// Helper: Convert URLs to clickable links in text
const renderTextWithLinks = (text) => {
  if (!text) return "";
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const parts = text.split(urlRegex);
  return parts.map((part, index) => {
    if (part.match(urlRegex)) {
      return (
        <a
          key={index}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-600 underline hover:text-blue-800"
        >
          {part}
        </a>
      );
    }
    return part;
  });
};

/**
 * Notes Tab Component
 * Handles project notes with filtering, search, and CRUD operations
 */
export default function NotesTab({ projectId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [viewingNote, setViewingNote] = useState(null);
  const [filters, setFilters] = useState({
    tag: "all",
    important: "all",
    search: "",
  });

  // Available tags
  const availableTags = [
    { value: "email", label: "Email", icon: "📧" },
    { value: "phone call", label: "Phone Call", icon: "📞" },
    { value: "instruction", label: "Instruction", icon: "📋" },
    { value: "meeting", label: "Meeting", icon: "🤝" },
    { value: "follow-up", label: "Follow-up", icon: "🔄" },
    { value: "custom", label: "Custom", icon: "🏷️" },
  ];

  // Load notes
  const loadNotes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.tag !== "all") params.append("tag", filters.tag);
      if (filters.important !== "all")
        params.append("important", filters.important);
      if (filters.search) params.append("search", filters.search);

      const response = await fetch(
        `/api/projects/${projectId}/notes?${params}`,
        {
          credentials: "include",
        },
      );

      if (response.ok) {
        const data = await response.json();
        setNotes(data.notes || []);
      } else {
        console.error("Failed to load notes");
      }
    } catch (error) {
      console.error("Error loading notes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Load notes when filters change
  useEffect(() => {
    loadNotes();
  }, [filters, projectId]);

  // Create new note
  const handleCreateNote = async (noteData) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(noteData),
      });

      if (response.ok) {
        const data = await response.json();
        setNotes((prev) => [data.note, ...prev]);
        setShowCreateModal(false);
      } else {
        console.error("Failed to create note");
      }
    } catch (error) {
      console.error("Error creating note:", error);
    }
  };

  // Update note
  const handleUpdateNote = async (noteId, noteData) => {
    try {
      const response = await fetch(
        `/api/projects/${projectId}/notes/${noteId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(noteData),
        },
      );

      if (response.ok) {
        const data = await response.json();
        setNotes((prev) =>
          prev.map((note) => (note.id === noteId ? data.note : note)),
        );
        setEditingNote(null);
      } else {
        console.error("Failed to update note");
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  // Delete note
  const handleDeleteNote = async (noteId) => {
    if (!confirm("Are you sure you want to delete this note?")) return;

    try {
      const response = await fetch(
        `/api/projects/${projectId}/notes/${noteId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );

      if (response.ok) {
        setNotes((prev) => prev.filter((note) => note.id !== noteId));
      } else {
        console.error("Failed to delete note");
      }
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  // Get tag display info
  const getTagInfo = (tag) => {
    return (
      availableTags.find((t) => t.value === tag) || { label: tag, icon: "🏷️" }
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

  // Truncate text for preview
  const truncateText = (text, maxLength = 200) => {
    if (!text) return "";
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };

  // Check if note has attachments
  const hasAttachments = (note) => {
    return note.attachments && note.attachments.length > 0;
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

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Project Notes</h2>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span>➕</span>
          <span>Add Note</span>
        </button>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-lg bg-gray-50 p-4">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Search in notes..."
              value={filters.search}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, search: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          {/* Tag Filter */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Tag
            </label>
            <select
              value={filters.tag}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, tag: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Tags</option>
              {availableTags.map((tag) => (
                <option key={tag.value} value={tag.value}>
                  {tag.icon} {tag.label}
                </option>
              ))}
            </select>
          </div>

          {/* Importance Filter */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Importance
            </label>
            <select
              value={filters.important}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, important: e.target.value }))
              }
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="all">All Notes</option>
              <option value="true">Important Only</option>
              <option value="false">Not Important</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notes List */}
      {loading ? (
        <div className="py-12 text-center text-gray-500">Loading notes...</div>
      ) : notes.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          No notes found. Create your first note to get started.
        </div>
      ) : (
        <div className="space-y-4">
          {notes.map((note) => {
            return (
              <div
                key={note.id}
                className={`rounded-lg border p-4 ${
                  note.isImportant
                    ? "border-orange-200 bg-orange-50"
                    : "border-gray-200 bg-white"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">
                        {note.title}
                      </h3>
                      {note.isImportant && (
                        <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                          ⭐ Important
                        </span>
                      )}
                      {hasAttachments(note) && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          📎 {note.attachments.length} attachment
                          {note.attachments.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <p className="mb-3 text-sm text-gray-600">
                      {renderTextWithLinks(truncateText(note.content))}
                      {note.content.length > 200 && (
                        <button
                          onClick={() => setViewingNote(note)}
                          className="ml-2 text-xs font-medium text-blue-600 hover:text-blue-800"
                        >
                          Read more
                        </button>
                      )}
                    </p>

                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>Created: {formatDate(note.createdAt)}</span>
                      {note.modifiedBy && (
                        <span>Modified: {formatDate(note.updatedAt)}</span>
                      )}
                      <span>By: {note.createdBy?.name || "Unknown"}</span>
                    </div>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {note.tags.map((tag) => {
                          const tagInfo = getTagInfo(tag);
                          return (
                            <span
                              key={tag}
                              className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                            >
                              {tagInfo.icon} {tagInfo.label}
                              {tag === "custom" &&
                                note.customTag &&
                                `: ${note.customTag}`}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>

                  <div className="ml-4 flex space-x-2">
                    {(hasAttachments(note) || note.content.length > 200) && (
                      <button
                        onClick={() => setViewingNote(note)}
                        className="text-gray-400 hover:text-green-600"
                        title="View full note"
                      >
                        👁️
                      </button>
                    )}
                    <button
                      onClick={() => setEditingNote(note)}
                      className="text-gray-400 hover:text-blue-600"
                      title="Edit note"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="text-gray-400 hover:text-red-600"
                      title="Delete note"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Note Modal */}
      {showCreateModal && (
        <NoteModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateNote}
          availableTags={availableTags}
        />
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <NoteModal
          isOpen={true}
          onClose={() => setEditingNote(null)}
          onSubmit={(data) => handleUpdateNote(editingNote.id, data)}
          note={editingNote}
          availableTags={availableTags}
        />
      )}

      {/* View Note Modal */}
      {viewingNote && (
        <ViewNoteModal
          isOpen={true}
          onClose={() => setViewingNote(null)}
          note={viewingNote}
          availableTags={availableTags}
        />
      )}
    </div>
  );
}

/**
 * View Note Modal Component
 * Displays full note content with attachments
 */
function ViewNoteModal({ isOpen, onClose, note, availableTags }) {
  // Get tag display info
  const getTagInfo = (tag) => {
    const availableTags = [
      { value: "email", label: "Email", icon: "📧" },
      { value: "phone call", label: "Phone Call", icon: "📞" },
      { value: "instruction", label: "Instruction", icon: "📋" },
      { value: "meeting", label: "Meeting", icon: "🤝" },
      { value: "follow-up", label: "Follow-up", icon: "🔄" },
      { value: "custom", label: "Custom", icon: "🏷️" },
    ];
    return (
      availableTags.find((t) => t.value === tag) || { label: tag, icon: "🏷️" }
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
      <div className="max-h-[90vh] w-full max-w-4xl overflow-hidden rounded-lg bg-white shadow-xl">
        <div className="max-h-[calc(90vh-2rem)] overflow-y-auto p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-xl font-medium text-gray-900">{note.title}</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <div className="space-y-4">
            {/* Note Content */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Content
              </h4>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm text-gray-900">
                  {renderTextWithLinks(note.content)}
                </p>
              </div>
            </div>

            {/* Attachments */}
            {note.attachments && note.attachments.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">
                  Attachments ({note.attachments.length})
                </h4>
                <div className="space-y-2">
                  {note.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 rounded-lg border border-gray-200 p-3"
                    >
                      <span className="text-lg">
                        {getFileIcon(attachment.type)}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium">
                          {attachment.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {attachment.type.toUpperCase()} •{" "}
                          {formatDate(attachment.uploadedAt)}
                        </div>
                      </div>
                      <a
                        href={attachment.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-md bg-blue-600 px-3 py-1 text-xs font-medium text-white hover:bg-blue-700"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {note.tags && note.tags.length > 0 && (
              <div>
                <h4 className="mb-2 text-sm font-medium text-gray-700">Tags</h4>
                <div className="flex flex-wrap gap-2">
                  {note.tags.map((tag) => {
                    const tagInfo = getTagInfo(tag);
                    return (
                      <span
                        key={tag}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
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

            {/* Metadata */}
            <div>
              <h4 className="mb-2 text-sm font-medium text-gray-700">
                Details
              </h4>
              <div className="grid grid-cols-1 gap-4 text-sm md:grid-cols-2">
                <div>
                  <span className="text-gray-500">Created:</span>
                  <span className="ml-2 text-gray-900">
                    {formatDate(note.createdAt)}
                  </span>
                </div>
                {note.modifiedBy && (
                  <div>
                    <span className="text-gray-500">Modified:</span>
                    <span className="ml-2 text-gray-900">
                      {formatDate(note.updatedAt)}
                    </span>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Created by:</span>
                  <span className="ml-2 text-gray-900">
                    {note.createdBy?.name || "Unknown"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-500">Status:</span>
                  <span className="ml-2">
                    {note.isImportant ? (
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                        ⭐ Important
                      </span>
                    ) : (
                      <span className="text-gray-900">Normal</span>
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

/**
 * Note Modal Component
 * Handles creating and editing notes
 */
function NoteModal({ isOpen, onClose, onSubmit, note, availableTags }) {
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
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              {note ? "Edit Note" : "Create New Note"}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Title */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter note title"
                required
              />
            </div>

            {/* Content */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Content *
              </label>
              <textarea
                value={formData.content}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, content: e.target.value }))
                }
                rows={4}
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter note content"
                required
              />
            </div>

            {/* Tags */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
                {availableTags.map((tag) => (
                  <label
                    key={tag.value}
                    className="flex items-center space-x-2 rounded-md border border-gray-200 p-2 hover:bg-gray-50"
                  >
                    <input
                      type="checkbox"
                      checked={formData.tags.includes(tag.value)}
                      onChange={() => handleTagChange(tag.value)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-sm">
                      {tag.icon} {tag.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Custom Tag */}
            {showCustomTag && (
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
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
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder="Enter custom tag name"
                  required={showCustomTag}
                />
              </div>
            )}

            {/* Important */}
            <div className="flex items-center space-x-2">
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
                className="text-sm font-medium text-gray-700"
              >
                Mark as Important
              </label>
            </div>

            {/* File Attachments */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                File Attachments
              </label>

              {/* Current Attachments */}
              {formData.attachments.length > 0 && (
                <div className="mb-3 space-y-2">
                  {formData.attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center space-x-3 rounded-lg border border-gray-200 p-2"
                    >
                      <span className="text-lg">
                        {getFileIcon(attachment.type)}
                      </span>
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          {attachment.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {attachment.type.toUpperCase()}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => handleRemoveAttachment(index)}
                        className="text-red-500 hover:text-red-700"
                        title="Remove attachment"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* Add New Attachment */}
              <div className="space-y-2 rounded-lg border border-gray-200 p-3">
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
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
                      className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                      className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      placeholder="e.g., pdf, doc, jpg"
                    />
                  </div>
                </div>
                <div>
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
                    className="w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="https://example.com/file.pdf"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddAttachment}
                  className="w-full rounded-md bg-gray-100 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  + Add Attachment
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
