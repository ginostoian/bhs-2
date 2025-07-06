"use client";

import { useState } from "react";

/**
 * Create Employee Form Component
 * Allows admins to create new employees or convert existing users
 */
export default function CreateEmployeeForm({ users }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    position: "",
    phone: "",
    skills: "",
    hourlyRate: "",
    availability: "available",
    notes: "",
    convertUser: false,
    userId: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleUserSelect = (e) => {
    const userId = e.target.value;
    if (userId) {
      const selectedUser = users.find((user) => user.id === userId);
      if (selectedUser) {
        setFormData((prev) => ({
          ...prev,
          userId,
          name: selectedUser.name || "",
          email: selectedUser.email || "",
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        userId: "",
        name: "",
        email: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.position.trim()) {
      newErrors.position = "Position is required";
    }

    if (formData.hourlyRate && isNaN(formData.hourlyRate)) {
      newErrors.hourlyRate = "Hourly rate must be a number";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(false);

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    try {
      const employeeData = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        position: formData.position.trim(),
        phone: formData.phone.trim(),
        skills: formData.skills
          .split(",")
          .map((skill) => skill.trim())
          .filter(Boolean),
        hourlyRate: formData.hourlyRate
          ? parseFloat(formData.hourlyRate)
          : null,
        availability: formData.availability,
        notes: formData.notes.trim(),
        convertUser: formData.convertUser,
        userId: formData.userId || null,
      };

      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      const result = await response.json();

      if (response.ok) {
        setSuccess(true);
        setFormData({
          name: "",
          email: "",
          position: "",
          phone: "",
          skills: "",
          hourlyRate: "",
          availability: "available",
          notes: "",
          convertUser: false,
          userId: "",
        });
        setErrors({});

        // Refresh the page to show the new employee
        setTimeout(() => {
          window.location.reload();
        }, 1500);
      } else {
        setErrors({ submit: result.error || "Failed to create employee" });
      }
    } catch (error) {
      setErrors({ submit: "An error occurred while creating the employee" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6">
      <h3 className="mb-4 text-lg font-medium text-gray-900">
        Create New Employee
      </h3>

      {success && (
        <div className="mb-4 rounded-md bg-green-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-green-400"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm font-medium text-green-800">
                Employee created successfully!
              </p>
            </div>
          </div>
        </div>
      )}

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
        {/* Convert User Option */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="convertUser"
            name="convertUser"
            checked={formData.convertUser}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                convertUser: e.target.checked,
                userId: "",
                name: "",
                email: "",
              }))
            }
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label
            htmlFor="convertUser"
            className="text-sm font-medium text-gray-700"
          >
            Convert existing user to employee
          </label>
        </div>

        {/* User Selection */}
        {formData.convertUser && (
          <div>
            <label
              htmlFor="userId"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Select User
            </label>
            <select
              id="userId"
              name="userId"
              value={formData.userId}
              onChange={handleUserSelect}
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={loading}
            >
              <option value="">Choose a user...</option>
              {users && users.length > 0 ? (
                users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email} (
                    {user.projectStatus || user.role || "No status"})
                  </option>
                ))
              ) : (
                <option value="" disabled>
                  No users available for conversion
                </option>
              )}
            </select>
            {users && users.length === 0 && (
              <p className="mt-1 text-sm text-gray-500">
                No users found. All existing users may already be admins or
                employees.
              </p>
            )}
          </div>
        )}

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
            disabled={loading || formData.convertUser}
            placeholder="Enter full name"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600">{errors.name}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Email Address *
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.email ? "border-red-300" : "border-gray-300"
            }`}
            disabled={loading || formData.convertUser}
            placeholder="Enter email address"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600">{errors.email}</p>
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

        {/* Hourly Rate */}
        <div>
          <label
            htmlFor="hourlyRate"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Hourly Rate (£)
          </label>
          <input
            type="number"
            id="hourlyRate"
            name="hourlyRate"
            value={formData.hourlyRate}
            onChange={handleChange}
            min="0"
            step="0.01"
            className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              errors.hourlyRate ? "border-red-300" : "border-gray-300"
            }`}
            disabled={loading}
            placeholder="Enter hourly rate"
          />
          {errors.hourlyRate && (
            <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
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

        {/* Submit Button */}
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Creating..." : "Create Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}
