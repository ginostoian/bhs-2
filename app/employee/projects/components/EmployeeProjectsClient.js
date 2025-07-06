"use client";

import Link from "next/link";

/**
 * Employee Projects Client Component
 * Displays all projects the employee has tasks assigned to
 */
export default function EmployeeProjectsClient({ projects }) {
  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to calculate progress percentage
  const calculateProgress = (project) => {
    if (project.taskCount === 0) return 0;
    return Math.round((project.completedTasks / project.taskCount) * 100);
  };

  return (
    <div className="space-y-6">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project) => {
          const progress = calculateProgress(project);

          return (
            <div
              key={project.id}
              className="rounded-lg border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-md"
            >
              <div className="mb-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">
                      {project.name}
                    </h3>
                    <p className="text-sm text-gray-500">{project.type}</p>
                    {project.location && (
                      <p className="text-sm text-gray-500">
                        {project.location}
                      </p>
                    )}
                  </div>
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
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="mb-1 flex items-center justify-between text-sm text-gray-600">
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Task Statistics */}
              <div className="mb-4 grid grid-cols-2 gap-2 text-xs">
                <div className="text-center">
                  <div className="font-medium text-gray-900">
                    {project.taskCount}
                  </div>
                  <div className="text-gray-500">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-600">
                    {project.completedTasks}
                  </div>
                  <div className="text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-600">
                    {project.inProgressTasks}
                  </div>
                  <div className="text-gray-500">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-600">
                    {project.scheduledTasks}
                  </div>
                  <div className="text-gray-500">Scheduled</div>
                </div>
              </div>

              {/* Project Details */}
              <div className="mb-4 space-y-1 text-xs text-gray-500">
                <div>Client: {project.user?.name || "Unknown"}</div>
                <div>Started: {formatDate(project.startDate)}</div>
                {project.progress !== undefined && (
                  <div>Overall Progress: {project.progress}%</div>
                )}
              </div>

              {/* Action Button */}
              <Link
                href={`/employee/projects/${project.id}`}
                className="block w-full rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                View Project Details
              </Link>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🏗️</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Projects Assigned
          </h3>
          <p className="text-gray-600">
            You don&apos;t have any tasks assigned yet. Contact your
            administrator to get started.
          </p>
        </div>
      )}

      {/* Summary Statistics */}
      {projects.length > 0 && (
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-medium text-gray-900">Summary</h3>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">
                {projects.length}
              </div>
              <div className="text-sm text-gray-500">Total Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {projects.filter((p) => p.status === "On Going").length}
              </div>
              <div className="text-sm text-gray-500">Active Projects</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {projects.reduce((sum, p) => sum + p.completedTasks, 0)}
              </div>
              <div className="text-sm text-gray-500">Completed Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {projects.reduce((sum, p) => sum + p.inProgressTasks, 0)}
              </div>
              <div className="text-sm text-gray-500">In Progress Tasks</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
