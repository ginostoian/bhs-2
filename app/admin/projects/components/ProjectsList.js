"use client";

import { useState } from "react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";

/**
 * Projects List Component
 * Displays all ongoing projects in a card layout with progress tracking
 */
export default function ProjectsList({ projects: initialProjects }) {
  const { data: session, status } = useSession();
  const [projects, setProjects] = useState(initialProjects);
  const [isCreatingProjects, setIsCreatingProjects] = useState(false);
  const [isCheckingUsers, setIsCheckingUsers] = useState(false);
  const [userStatus, setUserStatus] = useState(null);

  const createProjectsForUsers = async () => {
    setIsCreatingProjects(true);
    try {
      const response = await fetch("/api/admin/create-projects", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Ensure cookies are sent
      });

      const result = await response.json();
      if (response.ok) {
        // Refresh the page to show new projects
        window.location.reload();
        toast.success(
          `Created ${result.summary.projectsCreated} new projects!`,
        );
      } else {
        toast.error(result.error || "Failed to create projects");
      }
    } catch (error) {
      console.error("Error creating projects:", error);
      toast.error("Failed to create projects");
    } finally {
      setIsCreatingProjects(false);
    }
  };

  const checkUsersStatus = async () => {
    setIsCheckingUsers(true);
    try {
      console.log("Session status:", status);
      console.log("Session data:", session);
      console.log("Making request to check users...");

      const response = await fetch("/api/admin/check-users", {
        credentials: "include", // Ensure cookies are sent
      });
      console.log("Response status:", response.status);
      const result = await response.json();
      console.log("Response data:", result);

      if (response.ok) {
        setUserStatus(result);
        toast.success(
          `Found ${result.summary.ongoingUsers} users with "On Going" status`,
        );
      } else {
        toast.error(result.error || "Failed to check users");
      }
    } catch (error) {
      console.error("Error checking users:", error);
      toast.error("Failed to check users");
    } finally {
      setIsCheckingUsers(false);
    }
  };

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to calculate progress percentage
  const calculateProgress = (project) => {
    if (!project.tasksCount || project.tasksCount === 0) return 0;
    return Math.round((project.completedTasksCount / project.tasksCount) * 100);
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority) => {
    const badges = {
      low: "bg-gray-100 text-gray-800 ring-1 ring-gray-200",
      medium: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
      high: "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
      urgent: "bg-red-100 text-red-800 ring-1 ring-red-200",
    };
    return badges[priority] || badges.medium;
  };

  // Helper function to get type badge
  const getTypeBadge = (type) => {
    const badges = {
      "Kitchen Renovation": "bg-green-100 text-green-800 ring-1 ring-green-200",
      "Bathroom Renovation": "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
      "House Extension": "bg-purple-100 text-purple-800 ring-1 ring-purple-200",
      "Loft Conversion": "bg-indigo-100 text-indigo-800 ring-1 ring-indigo-200",
      "General Renovation": "bg-gray-100 text-gray-800 ring-1 ring-gray-200",
    };
    return badges[type] || badges["General Renovation"];
  };

  // Helper function to format budget
  const formatBudget = (budget) => {
    if (!budget) return "Not set";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(budget);
  };

  // Calculate summary statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter((p) => p.status === "On Going").length;
  const totalCompletedTasks = projects.reduce(
    (sum, p) => sum + (p.completedTasksCount || 0),
    0,
  );
  const totalInProgressTasks = projects.reduce(
    (sum, p) => sum + (p.inProgressTasks || 0),
    0,
  );
  const totalBudget = projects.reduce((sum, p) => sum + (p.budget || 0), 0);

  return (
    <div className="space-y-8">
      {/* Summary Statistics Cards */}
      {projects.length > 0 && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6 shadow-sm ring-1 ring-blue-200">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-blue-500">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-blue-600">
                  Total Projects
                </p>
                <p className="text-2xl font-bold text-blue-900">
                  {totalProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6 shadow-sm ring-1 ring-green-200">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-green-600">
                  Active Projects
                </p>
                <p className="text-2xl font-bold text-green-900">
                  {activeProjects}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6 shadow-sm ring-1 ring-purple-200">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-500">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-purple-600">
                  Completed Tasks
                </p>
                <p className="text-2xl font-bold text-purple-900">
                  {totalCompletedTasks}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-br from-orange-50 to-orange-100 p-6 shadow-sm ring-1 ring-orange-200">
            <div className="flex items-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-500">
                <svg
                  className="h-6 w-6 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                  />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-orange-600">
                  Total Budget
                </p>
                <p className="text-lg font-bold text-orange-900">
                  {formatBudget(totalBudget)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid */}
      {projects.length > 0 ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
          {projects.map((project) => {
            const progress = calculateProgress(project);
            return (
              <div
                key={project.id}
                className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-lg hover:ring-gray-300"
              >
                {/* Project Header */}
                <div className="border-b border-gray-100 p-6">
                  <div className="flex items-start justify-between">
                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-lg font-semibold text-gray-900">
                        {project.name}
                      </h3>
                      <div className="mt-2 flex items-center space-x-2">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getTypeBadge(project.type)}`}
                        >
                          {project.type}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            project.status === "On Going"
                              ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                              : "bg-green-100 text-green-800 ring-1 ring-green-200"
                          }`}
                        >
                          {project.status}
                        </span>
                      </div>
                      {project.location && (
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <svg
                            className="mr-1.5 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                            />
                          </svg>
                          {project.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Progress Section */}
                <div className="p-6">
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span className="font-medium text-gray-700">
                        Progress
                      </span>
                      <span className="font-semibold text-gray-900">
                        {progress}%
                      </span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>
                  </div>

                  {/* Task Statistics */}
                  <div className="mb-6 grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-gray-50 p-3 text-center">
                      <div className="text-lg font-bold text-gray-900">
                        {project.tasksCount}
                      </div>
                      <div className="text-xs text-gray-600">Total Tasks</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-3 text-center">
                      <div className="text-lg font-bold text-green-600">
                        {project.completedTasksCount}
                      </div>
                      <div className="text-xs text-gray-600">Completed</div>
                    </div>
                    <div className="rounded-lg bg-blue-50 p-3 text-center">
                      <div className="text-lg font-bold text-blue-600">
                        {project.inProgressTasks || 0}
                      </div>
                      <div className="text-xs text-gray-600">In Progress</div>
                    </div>
                    <div className="rounded-lg bg-orange-50 p-3 text-center">
                      <div className="text-lg font-bold text-orange-600">
                        {project.scheduledTasks || 0}
                      </div>
                      <div className="text-xs text-gray-600">Scheduled</div>
                    </div>
                  </div>

                  {/* Project Details */}
                  <div className="mb-6 space-y-3 text-sm text-gray-600">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {project.user?.name || "Unknown"}
                      </span>
                      <Link
                        href={`/admin/users/${project.user?.id}`}
                        className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        View User
                      </Link>
                    </div>
                    <div className="flex items-center">
                      <svg
                        className="mr-2 h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                      Started: {formatDate(project.startDate)}
                    </div>
                    {project.budget && (
                      <div className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                          />
                        </svg>
                        Budget: {formatBudget(project.budget)}
                      </div>
                    )}
                    {project.projectManager && (
                      <div className="flex items-center">
                        <svg
                          className="mr-2 h-4 w-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                          />
                        </svg>
                        {project.projectManager.name} (
                        {project.projectManager.position})
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="flex-1 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      View Details
                    </Link>
                    <Link
                      href={`/admin/projects/${project.id}?tab=tasks`}
                      className="flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-700 shadow-sm transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      Manage Tasks
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="rounded-xl bg-white p-12 text-center shadow-sm ring-1 ring-gray-200">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
            <svg
              className="h-10 w-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Active Projects
          </h3>
          <p className="mb-6 text-gray-600">
            There are currently no ongoing projects. Projects are created when
            users are moved from &ldquo;Lead&rdquo; to &ldquo;On Going&rdquo;
            status.
          </p>
          <Link
            href="/admin"
            className="inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              />
            </svg>
            Manage Users
          </Link>
        </div>
      )}
    </div>
  );
}
