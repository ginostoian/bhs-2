"use client";

import { useState, useEffect } from "react";
import RichTextEditor from "./RichTextEditor";
import EnhancedNoteModal from "./EnhancedNoteModal";
import EnhancedViewNoteModal from "./EnhancedViewNoteModal";
import styles from "./NotesTab.module.css";

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
 * Enhanced Notes Tab Component
 * Beautiful, feature-rich notes with rich text editing capabilities
 */
export default function EnhancedNotesTab({ projectId }) {
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

  // Available tags with enhanced styling
  const availableTags = [
    {
      value: "email",
      label: "Email",
      icon: "📧",
      color: "bg-blue-100 text-blue-800",
    },
    {
      value: "phone call",
      label: "Phone Call",
      icon: "📞",
      color: "bg-green-100 text-green-800",
    },
    {
      value: "instruction",
      label: "Instruction",
      icon: "📋",
      color: "bg-purple-100 text-purple-800",
    },
    {
      value: "meeting",
      label: "Meeting",
      icon: "🤝",
      color: "bg-orange-100 text-orange-800",
    },
    {
      value: "follow-up",
      label: "Follow-up",
      icon: "🔄",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      value: "custom",
      label: "Custom",
      icon: "🏷️",
      color: "bg-gray-100 text-gray-800",
    },
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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Project Notes</h2>
          <p className="mt-1 text-gray-600">
            Manage and organize project communications
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 px-4 py-2 font-medium text-white shadow-sm transition-all duration-200 hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <svg
            className="mr-2 h-5 w-5"
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
          Add Note
        </button>
      </div>

      {/* Enhanced Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">
          Filter Notes
        </h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search Notes
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search in notes..."
                value={filters.search}
                onChange={(e) =>
                  setFilters((prev) => ({ ...prev, search: e.target.value }))
                }
                className="block w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Tag Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Filter by Tag
            </label>
            <select
              value={filters.tag}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, tag: e.target.value }))
              }
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Filter by Importance
            </label>
            <select
              value={filters.important}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, important: e.target.value }))
              }
              className="block w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
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
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-600">Loading notes...</span>
        </div>
      ) : notes.length === 0 ? (
        <div className="py-12 text-center">
          <div className="mx-auto h-24 w-24 text-gray-300">
            <svg fill="currentColor" viewBox="0 0 24 24">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6zM14 3v5h5M16 13H8M16 17H8M10 9H8" />
            </svg>
          </div>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            No notes found
          </h3>
          <p className="mt-2 text-gray-600">
            Create your first note to get started.
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 font-medium text-white hover:bg-blue-700"
          >
            Create Note
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          {notes.map((note) => (
            <div
              key={note.id}
              className={`rounded-xl border bg-white shadow-sm transition-all duration-200 hover:shadow-md ${
                note.isImportant
                  ? "border-orange-200 bg-gradient-to-r from-orange-50 to-yellow-50"
                  : "border-gray-200"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start justify-between">
                  <div className="min-w-0 flex-1">
                    <div className="mb-3 flex items-center space-x-3">
                      <h3 className="truncate text-lg font-semibold text-gray-900">
                        {note.title}
                      </h3>
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
                      {hasAttachments(note) && (
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                          📎 {note.attachments.length} attachment
                          {note.attachments.length !== 1 ? "s" : ""}
                        </span>
                      )}
                    </div>

                    <div className="prose-sm prose mb-4 max-w-none">
                      <div
                        className="line-clamp-3 text-gray-600"
                        dangerouslySetInnerHTML={{
                          __html: truncateText(note.content),
                        }}
                      />
                      {note.content.length > 200 && (
                        <button
                          onClick={() => setViewingNote(note)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Read more
                        </button>
                      )}
                    </div>

                    <div className="mb-3 flex items-center space-x-4 text-sm text-gray-500">
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
                    </div>

                    {/* Tags */}
                    {note.tags && note.tags.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {note.tags.map((tag) => {
                          const tagInfo = getTagInfo(tag);
                          return (
                            <span
                              key={tag}
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${tagInfo.color}`}
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
                        className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-green-50 hover:text-green-600"
                        title="View full note"
                      >
                        <svg
                          className="h-5 w-5"
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
                      </button>
                    )}
                    <button
                      onClick={() => setEditingNote(note)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-blue-50 hover:text-blue-600"
                      title="Edit note"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                        />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDeleteNote(note.id)}
                      className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600"
                      title="Delete note"
                    >
                      <svg
                        className="h-5 w-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create Note Modal */}
      {showCreateModal && (
        <EnhancedNoteModal
          isOpen={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreateNote}
          availableTags={availableTags}
        />
      )}

      {/* Edit Note Modal */}
      {editingNote && (
        <EnhancedNoteModal
          isOpen={true}
          onClose={() => setEditingNote(null)}
          onSubmit={(data) => handleUpdateNote(editingNote.id, data)}
          note={editingNote}
          availableTags={availableTags}
        />
      )}

      {/* View Note Modal */}
      {viewingNote && (
        <EnhancedViewNoteModal
          isOpen={true}
          onClose={() => setViewingNote(null)}
          note={viewingNote}
          availableTags={availableTags}
        />
      )}
    </div>
  );
}
