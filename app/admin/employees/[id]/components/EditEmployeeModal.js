"use client";

import { useState, useEffect } from "react";

/**
 * Edit Employee Modal Component
 * Allows admins to edit employee information
 */
export default function EditEmployeeModal({
  employee,
  isOpen,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    phone: "",
    skills: "",
    dayRate: "",
    availability: "available",
    notes: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  // Initialize form data when employee changes
  useEffect(() => {
    if (employee) {
      setFormData({
        name: employee.name || "",
        position: employee.position || "",
        phone: employee.phone || "",
        skills: employee.skills ? employee.skills.join(", ") : "",
        dayRate: employee.dayRate ? employee.dayRate.toString() : "",
        availability: employee.availability || "available",
        notes: employee.notes || "",
        isActive: employee.isActive !== undefined ? employee.isActive : true,
      });
    }
  }, [employee]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    console.log("Validating form data:", formData);

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (formData.dayRate && isNaN(formData.dayRate)) {
      newErrors.dayRate = "Day rate must be a number";
    }

    console.log("Validation errors:", newErrors);
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    console.log("Form submission started");
    console.log("Form data:", formData);
    console.log("Day rate in form:", formData.dayRate);

    if (!validateForm()) {
      console.log("Form validation failed");
      setLoading(false);
      return;
    }

    try {
      const employeeData = {
        name: formData.name.trim(),
        position: formData.position.trim(),
        phone: formData.phone.trim(),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        dayRate: formData.dayRate ? parseFloat(formData.dayRate) : null,
        availability: formData.availability,
        notes: formData.notes.trim(),
        isActive: formData.isActive,
      };

      console.log("Employee data being sent:", employeeData);
      console.log("Day rate being sent:", employeeData.dayRate);

      const response = await fetch(`/api/employees/${employee.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      const result = await response.json();
      console.log("API response:", result);

      if (response.ok) {
        console.log("Update successful, calling onSave");
        onSave(result.employee);
        onClose();
      } else {
        console.log("Update failed:", result.error);
        setErrors({ submit: result.error || "Failed to update employee" });
      }
    } catch (error) {
      console.error("Error during update:", error);
      setErrors({ submit: "An error occurred while updating the employee" });
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Edit Employee: {employee?.name}
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
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

        {errors.submit && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-red-800">
                  {errors.submit}
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Full Name *
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
                disabled={loading}
                placeholder="Enter full name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Position */}
            <div>
              <label
                htmlFor="position"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Position/Title *
              </label>
              <input
                type="text"
                id="position"
                name="position"
                value={formData.position}
                onChange={handleChange}
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.position ? "border-red-300" : "border-gray-300"
                }`}
                disabled={loading}
                placeholder="e.g., Carpenter, Electrician, Project Manager"
              />
              {errors.position && (
                <p className="mt-1 text-sm text-red-600">{errors.position}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
                placeholder="Enter phone number"
              />
            </div>

            {/* Day Rate */}
            <div>
              <label
                htmlFor="dayRate"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Day Rate (£)
              </label>
              <input
                type="number"
                id="dayRate"
                name="dayRate"
                value={formData.dayRate}
                onChange={handleChange}
                min="0"
                step="0.01"
                className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.dayRate ? "border-red-300" : "border-gray-300"
                }`}
                disabled={loading}
                placeholder="Enter day rate"
              />
              {errors.dayRate && (
                <p className="mt-1 text-sm text-red-600">{errors.dayRate}</p>
              )}
            </div>

            {/* Availability */}
            <div>
              <label
                htmlFor="availability"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Availability
              </label>
              <select
                id="availability"
                name="availability"
                value={formData.availability}
                onChange={handleChange}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={loading}
              >
                <option value="available">Available</option>
                <option value="busy">Busy</option>
                <option value="unavailable">Unavailable</option>
              </select>
            </div>

            {/* Active Status */}
            <div>
              <label
                htmlFor="isActive"
                className="mb-1 block text-sm font-medium text-gray-700"
              >
                Status
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  name="isActive"
                  checked={formData.isActive}
                  onChange={handleChange}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                <label htmlFor="isActive" className="text-sm text-gray-700">
                  Active Employee
                </label>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div>
            <label
              htmlFor="skills"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Skills (comma-separated)
            </label>
            <input
              type="text"
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="e.g., Plumbing, Electrical, Carpentry"
            />
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
              rows={3}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
              placeholder="Additional notes about the employee"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Updating..." : "Update Employee"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
