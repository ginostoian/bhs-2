"use client";

import Link from "next/link";

/**
 * Employee Dashboard Client Component
 * Displays employee dashboard with statistics and recent tasks
 */
export default function EmployeeDashboardClient({
  tasks,
  projects,
  stats,
  employee,
}) {
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

  // Get recent tasks (last 5)
  const recentTasks = tasks.slice(0, 5);

  // Get urgent tasks
  const urgentTasks = tasks.filter((task) => task.priority === "urgent");

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                📋
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Total Tasks</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.totalTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white">
                ✅
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Completed</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.completedTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-white">
                🔄
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">In Progress</p>
              <p className="text-2xl font-semibold text-gray-900">
                {stats.inProgressTasks}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-orange-500 text-white">
                ⚠️
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-500">Urgent</p>
              <p className="text-2xl font-semibold text-gray-900">
                {urgentTasks.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Tasks */}
      {urgentTasks.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Urgent Tasks</h3>
            <Link
              href="/employee/tasks"
              className="text-sm font-medium text-blue-600 hover:text-blue-800"
            >
              View All Tasks →
            </Link>
          </div>
          <div className="space-y-3">
            {urgentTasks.slice(0, 3).map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-red-200 bg-red-50 p-4"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.name}</h4>
                    <p className="text-sm text-gray-500">
                      {task.project?.name} • {task.section?.name}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                      {task.plannedStartDate && (
                        <span className="text-xs text-gray-500">
                          Start: {formatDate(task.plannedStartDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/employee/projects/${task.project?.id}?task=${task.id}`}
                    className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Tasks */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">Recent Tasks</h3>
          <Link
            href="/employee/tasks"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View All Tasks →
          </Link>
        </div>
        <div className="space-y-3">
          {recentTasks.length > 0 ? (
            recentTasks.map((task) => (
              <div
                key={task.id}
                className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">{task.name}</h4>
                    <p className="text-sm text-gray-500">
                      {task.project?.name} • {task.section?.name}
                    </p>
                    <div className="mt-2 flex items-center space-x-2">
                      {getStatusBadge(task.status)}
                      {getPriorityBadge(task.priority)}
                      {task.plannedStartDate && (
                        <span className="text-xs text-gray-500">
                          Start: {formatDate(task.plannedStartDate)}
                        </span>
                      )}
                    </div>
                  </div>
                  <Link
                    href={`/employee/projects/${task.project?.id}?task=${task.id}`}
                    className="ml-4 text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    View →
                  </Link>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-500">No tasks assigned yet.</p>
          )}
        </div>
      </div>

      {/* Projects Overview */}
      <div className="rounded-lg bg-white p-6 shadow">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">My Projects</h3>
          <Link
            href="/employee/projects"
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            View All Projects →
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {projects.slice(0, 6).map((project) => (
            <Link
              key={project.id}
              href={`/employee/projects/${project.id}`}
              className="rounded-lg border border-gray-200 p-4 hover:bg-gray-50"
            >
              <h4 className="font-medium text-gray-900">{project.name}</h4>
              <p className="text-sm text-gray-500">{project.type}</p>
              <p className="text-sm text-gray-500">{project.location}</p>
              <div className="mt-2">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    project.status === "On Going"
                      ? "bg-green-100 text-green-800"
                      : project.status === "Finished"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {project.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Welcome Message */}
      <div className="rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white shadow">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white bg-opacity-20">
              👋
            </div>
          </div>
          <div className="ml-4">
            <h3 className="text-lg font-medium">
              Welcome back, {employee.name}!
            </h3>
            <p className="text-blue-100">
              You have {tasks.filter((t) => t.status === "Scheduled").length}{" "}
              scheduled tasks and {urgentTasks.length} urgent tasks to complete.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
