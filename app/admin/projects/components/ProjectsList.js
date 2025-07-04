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
    <div>
      {/* Statistics */}
      <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-medium text-gray-900">
            Project Statistics
          </h3>
          <div className="flex gap-2">
            <button
              onClick={checkUsersStatus}
              disabled={isCheckingUsers}
              className="rounded-md bg-gray-600 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:opacity-50"
            >
              {isCheckingUsers ? "Checking..." : "Check Users Status"}
            </button>
            <button
              onClick={createProjectsForUsers}
              disabled={isCreatingProjects}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {isCreatingProjects ? "Creating..." : "Create Projects for Users"}
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-4">
          <div className="rounded-lg bg-blue-50 p-4">
            <div className="text-2xl font-bold text-blue-600">
              {projects.length}
            </div>
            <div className="text-sm text-blue-600">Active Projects</div>
          </div>
          <div className="rounded-lg bg-green-50 p-4">
            <div className="text-2xl font-bold text-green-600">
              {
                projects.filter(
                  (p) => p.priority === "high" || p.priority === "urgent",
                ).length
              }
            </div>
            <div className="text-sm text-green-600">High Priority</div>
          </div>
          <div className="rounded-lg bg-yellow-50 p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {Math.round(
                projects.reduce((acc, p) => acc + p.progress, 0) /
                  Math.max(projects.length, 1),
              )}
              %
            </div>
            <div className="text-sm text-yellow-600">Avg Progress</div>
          </div>
          <div className="rounded-lg bg-purple-50 p-4">
            <div className="text-2xl font-bold text-purple-600">
              {projects.reduce((acc, p) => acc + p.tasksCount, 0)}
            </div>
            <div className="text-sm text-purple-600">Total Tasks</div>
          </div>
        </div>
      </div>

      {/* User Status Information */}
      {userStatus && (
        <div className="mb-8 rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            User Status Analysis
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-lg bg-blue-50 p-4">
              <div className="text-2xl font-bold text-blue-600">
                {userStatus.summary.ongoingUsers}
              </div>
              <div className="text-sm text-blue-600">
                Users with &ldquo;On Going&rdquo; Status
              </div>
            </div>
            <div className="rounded-lg bg-green-50 p-4">
              <div className="text-2xl font-bold text-green-600">
                {userStatus.summary.usersWithProjects}
              </div>
              <div className="text-sm text-green-600">Users with Projects</div>
            </div>
            <div className="rounded-lg bg-yellow-50 p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {userStatus.summary.usersWithoutProjects}
              </div>
              <div className="text-sm text-yellow-600">Users Need Projects</div>
            </div>
          </div>

          {userStatus.summary.usersWithoutProjects > 0 && (
            <div className="mt-4 rounded-lg bg-yellow-50 p-4">
              <h4 className="mb-2 font-medium text-yellow-800">
                Users without Projects:
              </h4>
              <ul className="text-sm text-yellow-700">
                {userStatus.usersWithoutProjects.map((user) => (
                  <li key={user.id}>• {user.name || user.email}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
          >
            {/* Project Header */}
            <div className="mb-4 flex items-start justify-between">
              <div className="flex-1">
                <Link
                  href={`/admin/projects/${project.id}`}
                  className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline"
                >
                  {project.name}
                </Link>
                <p className="text-sm text-gray-500">
                  {project.user.name || project.user.email}
                </p>
              </div>
              <div className="flex flex-col items-end space-y-1">
                {getPriorityBadge(project.priority)}
                {getTypeBadge(project.type)}
              </div>
            </div>

            {/* Project Details */}
            <div className="mb-4 space-y-2 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Location:</span>
                <span className="font-medium">
                  {project.location || "Not specified"}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Budget:</span>
                <span className="font-medium">
                  {formatBudget(project.budget)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Started:</span>
                <span className="font-medium">
                  {formatDate(project.startDate)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Tasks:</span>
                <span className="font-medium">
                  {project.completedTasksCount}/{project.tasksCount} completed
                </span>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-4">
              <div className="mb-1 flex justify-between text-sm text-gray-600">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="h-2 w-full rounded-full bg-gray-200">
                <div
                  className="h-2 rounded-full bg-blue-600 transition-all duration-300"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Project Manager */}
            {project.projectManager && (
              <div className="mb-4 text-sm text-gray-600">
                <span className="font-medium">Project Manager:</span>{" "}
                {project.projectManager.name} ({project.projectManager.position}
                )
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Link
                href={`/admin/projects/${project.id}`}
                className="flex-1 rounded-md bg-blue-600 px-3 py-2 text-center text-sm font-medium text-white transition-colors hover:bg-blue-700"
              >
                View Details
              </Link>
              <Link
                href={`/admin/projects/${project.id}?tab=tasks`}
                className="flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-center text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Manage Tasks
              </Link>
            </div>
          </div>
        ))}
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
    </div>
  );
}
