"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import EditEmployeeModal from "./EditEmployeeModal";

/**
 * Employee Detail Client Component
 * Displays detailed employee information and assigned tasks
 */
export default function EmployeeDetailClient({
  employee: initialEmployee,
  tasks,
}) {
  const [employee, setEmployee] = useState(initialEmployee);
  const [showEditModal, setShowEditModal] = useState(false);

  // Debug: Log employee state changes
  useEffect(() => {
    console.log("Employee state updated:", employee);
    console.log("Employee dayRate:", employee?.dayRate);
  }, [employee]);

  // Check if edit modal should be opened from URL parameter
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get("edit") === "true") {
      setShowEditModal(true);
      // Remove the edit parameter from URL
      const newUrl = new URL(window.location);
      newUrl.searchParams.delete("edit");
      window.history.replaceState({}, "", newUrl);
    }
  }, []);
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

  // Calculate statistics
  const stats = {
    totalTasks: tasks.length,
    scheduledTasks: tasks.filter((t) => t.status === "Scheduled").length,
    inProgressTasks: tasks.filter((t) => t.status === "In Progress").length,
    completedTasks: tasks.filter((t) => t.status === "Done").length,
    blockedTasks: tasks.filter((t) => t.status === "Blocked").length,
    urgentTasks: tasks.filter((t) => t.priority === "urgent").length,
  };

  return (
    <div className="space-y-6">
      {/* Employee Information */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-medium text-gray-900">
            Employee Information
          </h2>
          <button
            onClick={() => setShowEditModal(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Edit Employee
          </button>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-sm font-medium text-gray-500">Full Name</p>
            <p className="text-sm text-gray-900">{employee.name}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p className="text-sm text-gray-900">{employee.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Position</p>
            <p className="text-sm text-gray-900">{employee.position}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Phone</p>
            <p className="text-sm text-gray-900">
              {employee.phone || "Not provided"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Availability</p>
            <p className="text-sm capitalize text-gray-900">
              {employee.availability}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Day Rate</p>
            <p className="text-sm text-gray-900">
              {employee.dayRate ? `£${employee.dayRate}/day` : "Not set"}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Joined</p>
            <p className="text-sm text-gray-900">
              {formatDate(employee.createdAt)}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <p className="text-sm text-gray-900">
              {employee.isActive ? "Active" : "Inactive"}
            </p>
          </div>
          {employee.skills && employee.skills.length > 0 && (
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-sm font-medium text-gray-500">Skills</p>
              <p className="text-sm text-gray-900">
                {employee.skills.join(", ")}
              </p>
            </div>
          )}
          {employee.notes && (
            <div className="sm:col-span-2 lg:col-span-3">
              <p className="text-sm font-medium text-gray-500">Notes</p>
              <p className="text-sm text-gray-900">{employee.notes}</p>
            </div>
          )}
        </div>
      </div>

      {/* Task Statistics */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-medium text-gray-900">
          Task Statistics
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalTasks}
            </div>
            <div className="text-sm text-gray-500">Total Tasks</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {stats.scheduledTasks}
            </div>
            <div className="text-sm text-gray-500">Scheduled</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {stats.inProgressTasks}
            </div>
            <div className="text-sm text-gray-500">In Progress</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {stats.blockedTasks}
            </div>
            <div className="text-sm text-gray-500">Blocked</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.completedTasks}
            </div>
            <div className="text-sm text-gray-500">Completed</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">
              {stats.urgentTasks}
            </div>
            <div className="text-sm text-gray-500">Urgent</div>
          </div>
        </div>
      </div>

      {/* Assigned Tasks */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-medium text-gray-900">
          Assigned Tasks
        </h2>
        {tasks.length > 0 ? (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="mb-2 flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900">{task.name}</h3>
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                    </div>

                    {task.description && (
                      <p className="mb-2 text-sm text-gray-600">
                        {task.description}
                      </p>
                    )}

                    <div className="grid grid-cols-1 gap-1 text-sm text-gray-500 sm:grid-cols-2">
                      <div>
                        <span className="font-medium">Project:</span>{" "}
                        <Link
                          href={`/admin/projects/${task.project?.id}`}
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
                        <span className="font-medium">Start Date:</span>{" "}
                        {task.startDate
                          ? formatDate(task.startDate)
                          : "Not set"}
                      </div>
                      <div>
                        <span className="font-medium">Duration:</span> Est:{" "}
                        {task.estimatedDuration} days
                        {task.actualDuration &&
                          ` • Act: ${task.actualDuration} days`}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No tasks assigned to this employee.
          </p>
        )}
      </div>

      {/* Back to Employees */}
      <div className="text-center">
        <Link
          href="/admin/employees"
          className="inline-flex items-center rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
        >
          ← Back to Employees
        </Link>
      </div>

      {/* Edit Employee Modal */}
      <EditEmployeeModal
        employee={employee}
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        onSave={(updatedEmployee) => {
          console.log("onSave called with updated employee:", updatedEmployee);
          console.log("Updated employee dayRate:", updatedEmployee.dayRate);
          setEmployee(updatedEmployee);
          setShowEditModal(false);
        }}
      />
    </div>
  );
}
