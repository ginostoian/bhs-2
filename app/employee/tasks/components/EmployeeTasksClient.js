"use client";

import { useState } from "react";
import Link from "next/link";

/**
 * Employee Tasks Client Component
 * Displays all tasks assigned to the employee with filtering and status updates
 */
export default function EmployeeTasksClient({ tasks: initialTasks }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterPriority, setFilterPriority] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [updatingTask, setUpdatingTask] = useState(null);

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

  // Filter tasks
  const filteredTasks = tasks.filter((task) => {
    // Filter by status
    if (filterStatus !== "all" && task.status !== filterStatus) {
      return false;
    }

    // Filter by priority
    if (filterPriority !== "all" && task.priority !== filterPriority) {
      return false;
    }

    // Filter by search term
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const nameMatch = task.name.toLowerCase().includes(searchLower);
      const projectMatch = task.project?.name
        .toLowerCase()
        .includes(searchLower);
      const sectionMatch = task.section?.name
        .toLowerCase()
        .includes(searchLower);
      if (!nameMatch && !projectMatch && !sectionMatch) return false;
    }

    return true;
  });

  // Handle status update
  const handleStatusUpdate = async (taskId, newStatus) => {
    setUpdatingTask(taskId);

    try {
      const response = await fetch(
        `/api/employee/tasks/${taskId}/status-update`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: newStatus }),
        },
      );

      if (response.ok) {
        // Update local state
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task,
          ),
        );

        // Show success message
        alert("Task status updated successfully!");
      } else {
        const error = await response.json();
        alert(error.error || "Failed to update task status");
      }
    } catch (error) {
      alert("An error occurred while updating the task status");
    } finally {
      setUpdatingTask(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Filter Controls */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
          <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-48"
              >
                <option value="all">All Statuses</option>
                <option value="Scheduled">Scheduled</option>
                <option value="In Progress">In Progress</option>
                <option value="Blocked">Blocked</option>
                <option value="Done">Done</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Filter by Priority
              </label>
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-48"
              >
                <option value="all">All Priorities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Search
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search tasks..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:w-64"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div
              key={task.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      {task.name}
                    </h3>
                    {getStatusBadge(task.status)}
                    {getPriorityBadge(task.priority)}
                  </div>

                  {task.description && (
                    <p className="mb-3 text-sm text-gray-600">
                      {task.description}
                    </p>
                  )}

                  <div className="grid grid-cols-1 gap-2 text-sm text-gray-500 sm:grid-cols-2">
                    <div>
                      <span className="font-medium">Project:</span>{" "}
                      <Link
                        href={`/employee/projects/${task.project?.id}`}
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                      >
                        {task.project?.name || "Unknown"}
                      </Link>
                    </div>
                    <div>
                      <span className="font-medium">Section:</span>{" "}
                      {task.section?.name || "Unknown"}
                    </div>
                    <div>
                      <span className="font-medium">Due Date:</span>{" "}
                      {task.dueDate ? formatDate(task.dueDate) : "Not set"}
                    </div>
                    <div>
                      <span className="font-medium">Duration:</span> Est:{" "}
                      {task.estimatedDuration} days
                      {task.actualDuration &&
                        ` • Act: ${task.actualDuration} days`}
                    </div>
                  </div>

                  {task.startDate && (
                    <div className="mt-2 text-xs text-gray-500">
                      Started: {formatDate(task.startDate)}
                    </div>
                  )}

                  {task.completionDate && (
                    <div className="mt-1 text-xs text-gray-500">
                      Completed: {formatDate(task.completionDate)}
                    </div>
                  )}
                </div>

                {/* Status Update Controls */}
                <div className="ml-4 flex flex-col space-y-2">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      handleStatusUpdate(task.id, e.target.value)
                    }
                    disabled={updatingTask === task.id}
                    className="rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Blocked">Blocked</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Done">Done</option>
                  </select>
                  {updatingTask === task.id && (
                    <span className="text-xs text-gray-500">Updating...</span>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">📋</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Tasks Found
            </h3>
            <p className="text-gray-600">
              {tasks.length === 0
                ? "You don't have any tasks assigned yet."
                : "No tasks match your current filters."}
            </p>
          </div>
        )}
      </div>

      {/* Summary Statistics */}
      {tasks.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Task Summary
          </h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-5">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {tasks.length}
              </div>
              <div className="text-sm text-gray-500">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-600">
                {tasks.filter((t) => t.status === "Scheduled").length}
              </div>
              <div className="text-sm text-gray-500">Scheduled</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {tasks.filter((t) => t.status === "In Progress").length}
              </div>
              <div className="text-sm text-gray-500">In Progress</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-red-600">
                {tasks.filter((t) => t.status === "Blocked").length}
              </div>
              <div className="text-sm text-gray-500">Blocked</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {tasks.filter((t) => t.status === "Done").length}
              </div>
              <div className="text-sm text-gray-500">Completed</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
