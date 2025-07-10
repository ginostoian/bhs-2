"use client";

import { useState, useEffect } from "react";

/**
 * Notes Tab Component
 * Handles project notes with filtering, search, and CRUD operations
 */
export default function NotesTab({ projectId }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
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
          {notes.map((note) => (
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
                    <h3 className="font-medium text-gray-900">{note.title}</h3>
                    {note.isImportant && (
                      <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
                        ⭐ Important
                      </span>
                    )}
                  </div>

                  <p className="mb-3 text-sm text-gray-600">{note.content}</p>

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
          ))}
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
  });

  const [showCustomTag, setShowCustomTag] = useState(
    note?.tags?.includes("custom") || false,
  );

  // Reset form when note changes
  useEffect(() => {
    if (note) {
      setFormData({
        title: note.title || "",
        content: note.content || "",
        tags: note.tags || [],
        customTag: note.customTag || "",
        isImportant: note.isImportant || false,
      });
      setShowCustomTag(note.tags?.includes("custom") || false);
    } else {
      setFormData({
        title: "",
        content: "",
        tags: [],
        customTag: "",
        isImportant: false,
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
