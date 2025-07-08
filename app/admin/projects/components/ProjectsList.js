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

  // Helper function to get project type badge
  const getTypeBadge = (type) => {
    const badges = {
      bathroom: "bg-blue-100 text-blue-800",
      kitchen: "bg-green-100 text-green-800",
      extension: "bg-purple-100 text-purple-800",
      renovation: "bg-yellow-100 text-yellow-800",
      loft: "bg-indigo-100 text-indigo-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[type.toLowerCase()] || badges.renovation}`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  // Helper function to format budget
  const formatBudget = (budget) => {
    if (!budget) return "Not set";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(budget);
  };

  return (
    <div className="space-y-6">
      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-16 md:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => {
          const progress = calculateProgress(project);
          return (
            <div
              key={project.id}
              className="mx-auto w-full min-w-[320px] max-w-[840px] rounded-lg border border-gray-200 bg-white p-6 shadow transition-shadow hover:shadow-md"
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
                    {project.tasksCount}
                  </div>
                  <div className="text-gray-500">Total Tasks</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-green-600">
                    {project.completedTasksCount}
                  </div>
                  <div className="text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-blue-600">
                    {/* In Progress: not available directly, so show 0 or add if available */}
                    {project.inProgressTasks || 0}
                  </div>
                  <div className="text-gray-500">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="font-medium text-gray-600">
                    {/* Scheduled: not available directly, so show 0 or add if available */}
                    {project.scheduledTasks || 0}
                  </div>
                  <div className="text-gray-500">Scheduled</div>
                </div>
              </div>

              {/* Project Details */}
              <div className="mb-4 space-y-1 text-xs text-gray-500">
                <div>Client: {project.user?.name || "Unknown"}</div>
                <div>Started: {formatDate(project.startDate)}</div>
                {project.budget && (
                  <div>Budget: {formatBudget(project.budget)}</div>
                )}
                {project.projectManager && (
                  <div>
                    Project Manager: {project.projectManager.name} (
                    {project.projectManager.position})
                  </div>
                )}
                {project.progress !== undefined && (
                  <div>Overall Progress: {project.progress}%</div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-2">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
                >
                  View Project Details
                </Link>
                <Link
                  href={`/admin/projects/${project.id}?tab=tasks`}
                  className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
                >
                  Manage Tasks
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {projects.length === 0 && (
        <div className="py-12 text-center">
          <div className="mb-4 text-6xl">🏗️</div>
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
            className="inline-flex items-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
          >
            Manage Users
          </Link>
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
                {projects.reduce(
                  (sum, p) => sum + (p.completedTasksCount || 0),
                  0,
                )}
              </div>
              <div className="text-sm text-gray-500">Completed Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {projects.reduce((sum, p) => sum + (p.inProgressTasks || 0), 0)}
              </div>
              <div className="text-sm text-gray-500">In Progress Tasks</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
