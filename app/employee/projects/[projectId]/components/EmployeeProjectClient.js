"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/**
 * Employee Project Client Component
 * Displays project details and tasks with status update functionality
 */
export default function EmployeeProjectClient({
  project,
  sections,
  tasks,
  documents,
  employee,
}) {
  const [updatingTask, setUpdatingTask] = useState(null);
  const [statusUpdate, setStatusUpdate] = useState({});
  const [taskNotes, setTaskNotes] = useState({});
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [pendingStatusChange, setPendingStatusChange] = useState(null);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

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
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          badges[status] || badges["Scheduled"]
        }`}
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
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          badges[priority] || badges.medium
        }`}
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

  // Check if task is assigned to current employee
  const isMyTask = (task) => {
    return task.assignedTo?.id === employee.id;
  };

  // Handle status update request
  const handleStatusUpdate = async (taskId, newStatus, currentStatus) => {
    // Don't make API call if status hasn't changed
    if (newStatus === currentStatus) {
      // Reset the select to current status (in case it was changed by user interaction)
      const selectElement = document.querySelector(
        `select[data-task-id="${taskId}"]`,
      );
      if (selectElement) {
        selectElement.value = currentStatus;
      }
      return;
    }

    // Store pending change and show notes modal
    setPendingStatusChange({ taskId, newStatus, currentStatus });
    setShowNotesModal(true);
  };

  // Submit status update with notes
  const submitStatusUpdate = async () => {
    if (!pendingStatusChange) return;

    const { taskId, newStatus } = pendingStatusChange;
    const notes = taskNotes[taskId] || "";

    setUpdatingTask(taskId);

    try {
      const response = await fetch(
        `/api/employee/tasks/${taskId}/status-update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            status: newStatus,
            notes: notes,
            projectId: project.id,
          }),
        },
      );

      if (response.ok) {
        // Update local state
        setStatusUpdate((prev) => ({
          ...prev,
          [taskId]: { status: newStatus, timestamp: new Date().toISOString() },
        }));

        // Clear notes for this task
        setTaskNotes((prev) => {
          const newNotes = { ...prev };
          delete newNotes[taskId];
          return newNotes;
        });

        // Show success modal
        setSuccessMessage(
          `Your request to change task status from "${pendingStatusChange.currentStatus}" to "${newStatus}" has been submitted for admin approval. You will be notified once the admin reviews your request.`,
        );
        setShowSuccessModal(true);
      } else {
        const error = await response.json();
        // Don't show error for same status (handled silently)
        if (
          error.error !==
          "The requested status is the same as the current status. No update needed."
        ) {
          alert(error.error || "Failed to submit status update request");
        }
      }
    } catch (error) {
      alert("An error occurred while submitting the status update request");
    } finally {
      setUpdatingTask(null);
      setShowNotesModal(false);
      setPendingStatusChange(null);
    }
  };

  // Cancel status update
  const cancelStatusUpdate = () => {
    setShowNotesModal(false);
    setPendingStatusChange(null);
    // Reset the select to current status
    if (pendingStatusChange) {
      const selectElement = document.querySelector(
        `select[data-task-id="${pendingStatusChange.taskId}"]`,
      );
      if (selectElement) {
        selectElement.value = pendingStatusChange.currentStatus;
      }
    }
  };

  // Group tasks by section
  const tasksBySection = sections.map((section) => ({
    ...section,
    tasks: tasks.filter((task) => task.section?.id === section.id),
  }));

  // Filter documents by type
  const photos = documents.filter((doc) => doc.type === "photo");
  const otherDocuments = documents.filter((doc) => doc.type !== "photo");

  return (
    <div className="space-y-6">
      {/* Project Overview */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-medium text-gray-900">
          Project Overview
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Client</p>
            <p className="text-sm text-gray-900">
              {project.user?.name || "Unknown"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Project Type</p>
            <p className="text-sm text-gray-900">{project.type}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                project.status === "On Going"
                  ? "bg-blue-100 text-blue-800"
                  : "bg-green-100 text-green-800"
              }`}
            >
              {project.status}
            </span>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Location</p>
            <p className="text-sm text-gray-900">
              {project.location || "Not specified"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Start Date</p>
            <p className="text-sm text-gray-900">
              {formatDate(project.startDate)}
            </p>
          </div>
          {project.progress !== undefined && (
            <div>
              <p className="text-sm font-medium text-gray-500">
                Overall Progress
              </p>
              <p className="text-sm text-gray-900">{project.progress}%</p>
            </div>
          )}
        </div>
      </div>

      {/* Tasks by Section */}
      <div className="space-y-6">
        <h2 className="text-lg font-medium text-gray-900">Tasks</h2>

        {tasksBySection.map((section) => (
          <div key={section.id} className="rounded-lg bg-white p-6 shadow">
            <div className="mb-4 flex items-center space-x-2">
              <span className="text-lg">{section.icon}</span>
              <h3 className="text-lg font-medium text-gray-900">
                {section.name}
              </h3>
              {section.description && (
                <p className="text-sm text-gray-500">{section.description}</p>
              )}
            </div>

            <div className="space-y-3">
              {section.tasks.length > 0 ? (
                section.tasks.map((task) => (
                  <div
                    key={task.id}
                    className={`rounded-lg border p-4 ${
                      isMyTask(task)
                        ? "border-blue-200 bg-blue-50"
                        : "border-gray-200 bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium text-gray-900">
                            {task.name}
                          </h4>
                          {isMyTask(task) && (
                            <span className="text-xs font-medium text-blue-600">
                              (My Task)
                            </span>
                          )}
                        </div>

                        {task.description && (
                          <p className="mt-1 text-sm text-gray-600">
                            {task.description}
                          </p>
                        )}

                        <div className="mt-2 flex items-center space-x-2">
                          {getStatusBadge(task.status)}
                          {getPriorityBadge(task.priority)}
                          {task.assignedTo && (
                            <span className="text-xs text-gray-500">
                              Assigned to: {task.assignedTo.name}
                            </span>
                          )}
                        </div>

                        <div className="mt-2 text-xs text-gray-500">
                          {task.dueDate && (
                            <span>Due: {formatDate(task.dueDate)} • </span>
                          )}
                          <span>Est: {task.estimatedDuration} days</span>
                          {task.actualDuration && (
                            <span> • Act: {task.actualDuration} days</span>
                          )}
                        </div>

                        {/* Status Update Request */}
                        {statusUpdate[task.id] && (
                          <div className="mt-2 rounded-md bg-yellow-50 p-2">
                            <p className="text-xs text-yellow-800">
                              Status update request submitted:{" "}
                              {statusUpdate[task.id].status}
                              (pending admin approval)
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Status Update Controls (only for assigned tasks) */}
                      {isMyTask(task) && (
                        <div className="ml-4 flex flex-col space-y-2">
                          <select
                            value={task.status}
                            onChange={(e) =>
                              handleStatusUpdate(
                                task.id,
                                e.target.value,
                                task.status,
                              )
                            }
                            disabled={updatingTask === task.id}
                            data-task-id={task.id}
                            className="rounded border border-gray-300 px-2 py-1 text-xs focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          >
                            <option value="Scheduled">Scheduled</option>
                            <option value="Blocked">Blocked</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Done">Done</option>
                          </select>
                          {updatingTask === task.id && (
                            <span className="text-xs text-gray-500">
                              Updating...
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  No tasks in this section.
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Documents */}
      {otherDocuments.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Documents</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {otherDocuments.map((doc) => (
              <div
                key={doc.id}
                className="rounded-lg border border-gray-200 p-4"
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">
                    {doc.type === "quote"
                      ? "📄"
                      : doc.type === "invoice"
                        ? "💰"
                        : "📋"}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">
                      {doc.type.charAt(0).toUpperCase() + doc.type.slice(1)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {formatDate(doc.createdAt)}
                    </p>
                  </div>
                </div>
                {doc.type === "comment" && (
                  <p className="mt-2 text-sm text-gray-600">
                    {typeof doc.content === "string"
                      ? doc.content
                      : "Document content"}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Photos */}
      {photos.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="mb-4 text-lg font-medium text-gray-900">Photos</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <div
                key={photo.id}
                className="aspect-square overflow-hidden rounded-lg"
              >
                <Image
                  src={photo.content}
                  alt="Project photo"
                  width={300}
                  height={300}
                  className="h-full w-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Back to Projects */}
      <div className="text-center">
        <Link
          href="/employee/projects"
          className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          ← Back to Projects
        </Link>
      </div>

      {/* Status Update Notes Modal */}
      {showNotesModal && pendingStatusChange && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={cancelStatusUpdate}
            ></div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-blue-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Status Update Request
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        You&apos;re requesting to change the status from{" "}
                        <span className="font-medium text-gray-900">
                          {pendingStatusChange.currentStatus}
                        </span>{" "}
                        to{" "}
                        <span className="font-medium text-gray-900">
                          {pendingStatusChange.newStatus}
                        </span>
                        . Please provide any additional notes for the admin.
                      </p>
                    </div>
                    <div className="mt-4">
                      <textarea
                        value={taskNotes[pendingStatusChange.taskId] || ""}
                        onChange={(e) =>
                          setTaskNotes((prev) => ({
                            ...prev,
                            [pendingStatusChange.taskId]: e.target.value,
                          }))
                        }
                        placeholder="Optional: Add notes explaining the status change..."
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={submitStatusUpdate}
                  disabled={updatingTask === pendingStatusChange.taskId}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  {updatingTask === pendingStatusChange.taskId
                    ? "Submitting..."
                    : "Submit Request"}
                </button>
                <button
                  type="button"
                  onClick={cancelStatusUpdate}
                  disabled={updatingTask === pendingStatusChange.taskId}
                  className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={() => setShowSuccessModal(false)}
            ></div>

            <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
              <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg
                      className="h-6 w-6 text-green-600"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">
                      Request Submitted Successfully
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">{successMessage}</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button
                  type="button"
                  onClick={() => setShowSuccessModal(false)}
                  className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
