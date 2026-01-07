"use client";

import { useState, useEffect } from "react";

/**
 * Create Moodboard Modal Component
 * Form for creating new moodboards for users
 */
export default function CreateMoodboardModal({
  isOpen,
  onClose,
  onSubmit,
  users,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    userId: "",
    name: "",
    description: "",
    projectType: "",
    notes: "",
    project: "",
  });

  const [projects, setProjects] = useState([]);
  const [isLoadingProjects, setIsLoadingProjects] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        userId: "",
        name: "",
        description: "",
        projectType: "",
        notes: "",
        project: "",
      });
      setProjects([]);
    }
  }, [isOpen]);

  // Fetch projects when user is selected
  useEffect(() => {
    const fetchProjects = async () => {
      if (formData.userId) {
        setIsLoadingProjects(true);
        try {
          const response = await fetch(
            `/api/admin/projects?userId=${formData.userId}`,
          );
          if (response.ok) {
            const data = await response.json();
            setProjects(data.projects || []);
            // Automatically select if there's only one project
            if (data.projects?.length === 1) {
              setFormData((prev) => ({ ...prev, project: data.projects[0]._id }));
            }
          }
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setIsLoadingProjects(false);
        }
      } else {
        setProjects([]);
      }
    };

    fetchProjects();
  }, [formData.userId]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.userId || !formData.name) {
      alert("Please select a user and enter a moodboard name");
      return;
    }

    onSubmit(formData);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Create New Moodboard
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* User Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                User *
              </label>
              <select
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name || user.email} ({user.projectStatus})
                  </option>
                ))}
              </select>
            </div>

            {/* Project Selection */}
            {formData.userId && (
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Assign to Project (Optional)
                </label>
                {isLoadingProjects ? (
                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    Loading projects...
                  </div>
                ) : projects.length > 0 ? (
                  <select
                    name="project"
                    value={formData.project || ""}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  >
                    <option value="">-- No Project --</option>
                    {projects.map((project) => (
                      <option key={project._id} value={project._id}>
                        {project.name} ({project.status})
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1 text-xs text-gray-500 italic">
                    No projects found for this user.
                  </p>
                )}
              </div>
            )}

            {/* Moodboard Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Moodboard Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="e.g., Kitchen Renovation Products"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                rows={3}
                placeholder="Brief description of the moodboard..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Project Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Category/Type
              </label>
              <input
                type="text"
                name="projectType"
                value={formData.projectType}
                onChange={handleChange}
                placeholder="e.g., Kitchen Renovation, Bathroom Remodel"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes for the moodboard..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Creating..." : "Create Moodboard"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
