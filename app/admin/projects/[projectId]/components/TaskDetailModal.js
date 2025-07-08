"use client";

import { useState, useEffect } from "react";
import TaskModal from "./TaskModal";

/**
 * Task Detail Modal Component
 * Shows comprehensive task information in a modal
 */
export default function TaskDetailModal({
  isOpen,
  onClose,
  task,
  employees,
  sections,
}) {
  const [showEditModal, setShowEditModal] = useState(false);

  if (!isOpen || !task) return null;

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const badges = {
      Scheduled: "bg-gray-100 text-gray-800",
      Blocked: "bg-red-100 text-red-800",
      "In Progress": "bg-blue-100 text-blue-800",
      Done: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[status] || badges["Scheduled"]}`}
      >
        {status}
      </span>
    );
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority) => {
    const badges = {
      low: "bg-gray-100 text-gray-800",
      medium: "bg-blue-100 text-blue-800",
      high: "bg-orange-100 text-orange-800",
      urgent: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[priority] || badges.medium}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to get employee name
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return "Unassigned";
    const employee = employees?.find((emp) => emp.id === employeeId);
    return employee
      ? `${employee.name} (${employee.position})`
      : "Unknown Employee";
  };

  // Helper function to get section name
  const getSectionName = (sectionId) => {
    const section = sections?.find((sec) => sec.id === sectionId);
    return section ? section.name : "Unknown Section";
  };

  // Handle task save from edit modal
  const handleTaskSave = (savedTask) => {
    // Close the edit modal
    setShowEditModal(false);
    // Close the detail modal and refresh the page to show updated data
    onClose();
    // Optionally, you could emit an event to refresh the parent component
    window.location.reload();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={onClose}
        />
        <div className="relative max-h-[90vh] w-full max-w-4xl transform overflow-hidden rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Task Details
              </h3>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowEditModal(true)}
                  className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
                >
                  Edit Task
                </button>
                <button
                  onClick={onClose}
                  className="rounded-md bg-gray-300 px-3 py-1 text-sm text-gray-700 hover:bg-gray-400"
                >
                  Close
                </button>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-h-[calc(90vh-120px)] overflow-y-auto">
            <div className="p-6">
              {/* Basic Information */}
              <div className="mb-8">
                <h4 className="mb-4 border-b border-gray-200 pb-2 text-lg font-medium text-gray-900">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Task Name
                    </label>
                    <div className="text-sm font-medium text-gray-900">
                      {task.name}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Section
                    </label>
                    <div className="text-sm text-gray-900">
                      {getSectionName(task.section?.id)}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <div>{getStatusBadge(task.status)}</div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <div>{getPriorityBadge(task.priority)}</div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Assigned To
                    </label>
                    <div className="text-sm text-gray-900">
                      {getEmployeeName(task.assignedTo?.id)}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Created Date
                    </label>
                    <div className="text-sm text-gray-900">
                      {formatDate(task.createdAt)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="mb-8">
                <h4 className="mb-4 border-b border-gray-200 pb-2 text-lg font-medium text-gray-900">
                  Description
                </h4>
                <div className="rounded-lg bg-gray-50 p-4">
                  <p className="whitespace-pre-wrap text-sm text-gray-900">
                    {task.description || "No description provided"}
                  </p>
                </div>
              </div>

              {/* Duration Information */}
              <div className="mb-8">
                <h4 className="mb-4 border-b border-gray-200 pb-2 text-lg font-medium text-gray-900">
                  Duration & Timeline
                </h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Estimated Duration
                    </label>
                    <div className="text-sm text-gray-900">
                      {task.estimatedDuration || 0} days
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Actual Duration
                    </label>
                    <div className="text-sm text-gray-900">
                      {task.actualDuration
                        ? `${task.actualDuration} days`
                        : "Not started"}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Start Date
                    </label>
                    <div className="text-sm text-gray-900">
                      {formatDate(task.startDate)}
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {task.notes && (
                <div className="mb-8">
                  <h4 className="mb-4 border-b border-gray-200 pb-2 text-lg font-medium text-gray-900">
                    Notes
                  </h4>
                  <div className="rounded-lg bg-gray-50 p-4">
                    <p className="whitespace-pre-wrap text-sm text-gray-900">
                      {task.notes}
                    </p>
                  </div>
                </div>
              )}

              {/* Attachments */}
              {task.attachments && task.attachments.length > 0 && (
                <div className="mb-8">
                  <h4 className="mb-4 border-b border-gray-200 pb-2 text-lg font-medium text-gray-900">
                    Attachments ({task.attachments.length})
                  </h4>
                  <div className="space-y-2">
                    {task.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-600">📎</div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {attachment.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {attachment.size} •{" "}
                              {formatDate(attachment.uploadedAt)}
                            </div>
                          </div>
                        </div>
                        <a
                          href={attachment.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-800"
                        >
                          Download
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {task.tags && task.tags.length > 0 && (
                <div className="mb-8">
                  <h4 className="mb-4 border-b border-gray-200 pb-2 text-lg font-medium text-gray-900">
                    Tags
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {task.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Additional Metadata */}
              <div className="mb-8">
                <h4 className="mb-4 border-b border-gray-200 pb-2 text-lg font-medium text-gray-900">
                  Additional Information
                </h4>
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Last Updated
                    </label>
                    <div className="text-sm text-gray-900">
                      {formatDate(task.updatedAt)}
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium text-gray-700">
                      Task ID
                    </label>
                    <div className="font-mono text-sm text-gray-500">
                      {task.id}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <TaskModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={handleTaskSave}
        task={task}
        projectId={task.project}
        sections={sections}
        employees={employees}
      />
    </>
  );
}
