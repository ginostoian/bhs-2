"use client";

import { useState, useEffect } from "react";

/**
 * Section Modal Component
 * Modern, accessible modal for adding and editing task sections
 */
export default function SectionModal({
  isOpen,
  onClose,
  onSave,
  section = null,
  projectId,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    color: "#3B82F6",
    icon: "📋",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Predefined color options
  const colorOptions = [
    { value: "#3B82F6", label: "Blue", bg: "bg-blue-500" },
    { value: "#10B981", label: "Green", bg: "bg-green-500" },
    { value: "#F59E0B", label: "Yellow", bg: "bg-yellow-500" },
    { value: "#EF4444", label: "Red", bg: "bg-red-500" },
    { value: "#8B5CF6", label: "Purple", bg: "bg-purple-500" },
    { value: "#06B6D4", label: "Cyan", bg: "bg-cyan-500" },
    { value: "#F97316", label: "Orange", bg: "bg-orange-500" },
    { value: "#EC4899", label: "Pink", bg: "bg-pink-500" },
  ];

  // Predefined icon options
  const iconOptions = [
    "📋",
    "🏗️",
    "🔨",
    "⚡",
    "🔧",
    "📐",
    "🎨",
    "🧱",
    "🚪",
    "🪟",
    "🚿",
    "🛁",
    "🍽️",
    "🛏️",
    "🪑",
    "💡",
  ];

  // Initialize form data when editing
  useEffect(() => {
    if (section) {
      setFormData({
        name: section.name || "",
        description: section.description || "",
        color: section.color || "#3B82F6",
        icon: section.icon || "📋",
        notes: section.notes || "",
      });
    } else {
      setFormData({
        name: "",
        description: "",
        color: "#3B82F6",
        icon: "📋",
        notes: "",
      });
    }
    setErrors({});
  }, [section, isOpen]);

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

  // Validate form
  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) {
      newErrors.name = "Section name is required";
    }
    if (formData.name.length > 50) {
      newErrors.name = "Section name must be less than 50 characters";
    }
    if (formData.description && formData.description.length > 200) {
      newErrors.description = "Description must be less than 200 characters";
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
      const url = section
        ? `/api/projects/${projectId}/sections/${section.id}`
        : `/api/projects/${projectId}/sections`;

      const method = section ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to save section");
      }

      const result = await response.json();
      onSave(result.section);
      onClose();
    } catch (error) {
      console.error("Error saving section:", error);
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
        <div className="relative w-full max-w-md transform rounded-lg bg-white p-6 shadow-xl transition-all">
          {/* Header */}
          <div className="mb-6">
            <h3 className="text-lg font-medium text-gray-900">
              {section ? "Edit Section" : "Add New Section"}
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {section
                ? "Update the section details below."
                : "Create a new section to organize tasks."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Section Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Section Name *
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
                placeholder="e.g., Bathroom Renovation"
                disabled={loading}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
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
                placeholder="Optional description of this section"
                disabled={loading}
              />
              {errors.description && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.description}
                </p>
              )}
            </div>

            {/* Color Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Section Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {colorOptions.map((color) => (
                  <button
                    key={color.value}
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: { name: "color", value: color.value },
                      })
                    }
                    className={`h-8 w-8 rounded-full border-2 transition-all ${
                      formData.color === color.value
                        ? "scale-110 border-gray-900"
                        : "border-gray-300 hover:border-gray-400"
                    } ${color.bg}`}
                    aria-label={`Select ${color.label} color`}
                    disabled={loading}
                  />
                ))}
              </div>
            </div>

            {/* Icon Selection */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Section Icon
              </label>
              <div className="grid grid-cols-8 gap-2">
                {iconOptions.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() =>
                      handleChange({ target: { name: "icon", value: icon } })
                    }
                    className={`h-8 w-8 rounded border-2 text-center transition-all ${
                      formData.icon === icon
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                    aria-label={`Select ${icon} icon`}
                    disabled={loading}
                  >
                    {icon}
                  </button>
                ))}
              </div>
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
                placeholder="Optional notes about this section"
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
                ) : section ? (
                  "Update Section"
                ) : (
                  "Create Section"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
