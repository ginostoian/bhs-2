"use client";

import { useState, useEffect } from "react";

/**
 * Task Modal Component
 * Modern, accessible modal for adding and editing tasks
 */
export default function TaskModal({
  isOpen,
  onClose,
  onSave,
  task = null,
  projectId,
  sections = [],
  employees = [],
  defaultSection = null,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    section: "",
    status: "Scheduled",
    assignedTo: "",
    estimatedDuration: 1,
    plannedStartDate: "",
    priority: "medium",
    notes: "",
    tags: [],
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [attachments, setAttachments] = useState([]);
  const [newTag, setNewTag] = useState("");

  // Initialize form data when editing
  useEffect(() => {
    if (task) {
      setFormData({
        name: task.name || "",
        description: task.description || "",
        section: task.section?.id || "",
        status: task.status || "Scheduled",
        assignedTo: task.assignedTo?.id || "",
        estimatedDuration: task.estimatedDuration || 1,
        plannedStartDate: task.plannedStartDate
          ? new Date(task.plannedStartDate).toISOString().split("T")[0]
          : "",
        priority: task.priority || "medium",
        notes: task.notes || "",
        tags: task.tags || [],
      });
      setAttachments(task.attachments || []);
    } else {
      setFormData({
        name: "",
        description: "",
        section:
          defaultSection?.id || (sections.length > 0 ? sections[0].id : ""),
        status: "Scheduled",
        assignedTo: "",
        estimatedDuration: 1,
        plannedStartDate: "",
        priority: "medium",
        notes: "",
        tags: [],
      });
      setAttachments([]);
    }
    setErrors({});
  }, [task, isOpen, sections, defaultSection]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  // Handle file upload
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    const newAttachments = files.map((file) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: URL.createObjectURL(file), // Temporary URL for preview
      file: file, // Store the actual file for upload
    }));
    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  // Remove attachment
  const removeAttachment = (index) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index));
  };

  // Add tag
  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }));
      setNewTag("");
    }
  };

  // Remove tag
  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }));
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Task name is required";
    }
    if (!formData.section) {
      newErrors.section = "Section is required";
    }
    if (formData.name.length > 100) {
      newErrors.name = "Task name must be less than 100 characters";
    }
    if (formData.description && formData.description.length > 500) {
      newErrors.description = "Description must be less than 500 characters";
    }
    if (formData.estimatedDuration < 0) {
      newErrors.estimatedDuration = "Duration must be positive";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const url = task
        ? `/api/tasks/${task.id}`
        : `/api/projects/${projectId}/tasks`;

      const method = task ? "PUT" : "POST";

      // Prepare data for submission
      const submitData = {
        ...formData,
        // Convert empty strings to null for ObjectId fields
        assignedTo: formData.assignedTo || null,
        section: formData.section || null,
        // Convert empty date strings to null
        plannedStartDate: formData.plannedStartDate || null,
        attachments: attachments.map((att) => ({
          name: att.name,
          type: att.type,
          size: att.size,
          url: att.url,
        })),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save task");
      }

      const result = await response.json();
      onSave(result.task);
      onClose();
    } catch (error) {
      console.error("Error saving task:", error);
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Handle modal close
  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl transform rounded-lg bg-white p-6 shadow-xl transition-all">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {task ? "Edit Task" : "Add New Task"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {task
                ? "Update the task details below."
                : "Create a new task for this project."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {/* Task Name */}
              <div className="md:col-span-2">
                <label
                  htmlFor="name"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Task Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="e.g., Install bathroom tiles"
                  disabled={loading}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              {/* Section */}
              <div>
                <label
                  htmlFor="section"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Section *
                </label>
                <select
                  id="section"
                  name="section"
                  value={formData.section}
                  onChange={handleChange}
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.section ? "border-red-300" : "border-gray-300"
                  }`}
                  disabled={loading}
                >
                  <option value="">Select a section</option>
                  {sections.map((section) => (
                    <option key={section.id} value={section.id}>
                      {section.name}
                    </option>
                  ))}
                </select>
                {errors.section && (
                  <p className="mt-1 text-sm text-red-600">{errors.section}</p>
                )}
              </div>

              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="Scheduled">Scheduled</option>
                  <option value="Blocked">Blocked</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>

              {/* Assigned To */}
              <div>
                <label
                  htmlFor="assignedTo"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Assigned To
                </label>
                <select
                  id="assignedTo"
                  name="assignedTo"
                  value={formData.assignedTo}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="">Unassigned</option>
                  {employees.map((employee) => (
                    <option key={employee.id} value={employee.id}>
                      {employee.name} ({employee.position})
                    </option>
                  ))}
                </select>
              </div>

              {/* Estimated Duration */}
              <div>
                <label
                  htmlFor="estimatedDuration"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Estimated Duration (days)
                </label>
                <input
                  type="number"
                  id="estimatedDuration"
                  name="estimatedDuration"
                  value={formData.estimatedDuration}
                  onChange={handleChange}
                  min="0"
                  className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.estimatedDuration
                      ? "border-red-300"
                      : "border-gray-300"
                  }`}
                  disabled={loading}
                />
                {errors.estimatedDuration && (
                  <p className="mt-1 text-sm text-red-600">
                    {errors.estimatedDuration}
                  </p>
                )}
              </div>

              {/* Planned Start Date */}
              <div>
                <label
                  htmlFor="plannedStartDate"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Planned Start Date
                </label>
                <input
                  type="date"
                  id="plannedStartDate"
                  name="plannedStartDate"
                  value={formData.plannedStartDate}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                />
              </div>

              {/* Priority */}
              <div>
                <label
                  htmlFor="priority"
                  className="mb-1 block text-sm font-medium text-gray-700"
                >
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label
                htmlFor="description"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.description ? "border-red-300" : "border-gray-300"
                }`}
                placeholder="Detailed description of the task"
                disabled={loading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Tags */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Tags
              </label>
              <div className="mb-2 flex flex-wrap gap-2">
                {formData.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-blue-600 hover:text-blue-800"
                      disabled={loading}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === "Enter" && (e.preventDefault(), addTag())
                  }
                  className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add a tag"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={addTag}
                  className="rounded-md bg-gray-100 px-3 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  disabled={loading}
                >
                  Add
                </button>
              </div>
            </div>

            {/* File Attachments */}
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Attachments
              </label>
              <div className="rounded-lg border-2 border-dashed border-gray-300 p-4">
                <input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={loading}
                />
                <label
                  htmlFor="file-upload"
                  className="block cursor-pointer text-center"
                >
                  <div className="text-gray-600">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <p className="mt-1 text-sm">
                      Click to upload files or drag and drop
                    </p>
                  </div>
                </label>
              </div>

              {/* Attachment List */}
              {attachments.length > 0 && (
                <div className="mt-3 space-y-2">
                  {attachments.map((attachment, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between rounded-lg bg-gray-50 p-2"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-600">
                          {attachment.name}
                        </span>
                        <span className="text-xs text-gray-400">
                          ({(attachment.size / 1024 / 1024).toFixed(2)} MB)
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeAttachment(index)}
                        className="text-sm text-red-600 hover:text-red-800"
                        disabled={loading}
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Notes */}
            <div>
              <label
                htmlFor="notes"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Notes
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={2}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Additional notes about this task"
                disabled={loading}
              />
            </div>

            {/* Error Message */}
            {errors.submit && (
              <div className="rounded-md bg-red-50 p-3">
                <p className="text-sm text-red-600">{errors.submit}</p>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={handleClose}
                disabled={loading}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {loading ? (
                  <div className="flex items-center">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                    Saving...
                  </div>
                ) : task ? (
                  "Update Task"
                ) : (
                  "Create Task"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
