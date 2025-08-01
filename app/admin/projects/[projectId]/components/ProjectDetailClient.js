"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import TasksTable from "./TasksTable";
import AdminTasksTable from "./AdminTasksTable";
import MilestoneModal from "./MilestoneModal";
import ProjectInfoModal from "./ProjectInfoModal";
import EnhancedNotesTab from "./EnhancedNotesTab";
import GanttChart from "./GanttChart";
import ExpensesTab from "./ExpensesTab";
import ChangesTab from "./ChangesTab";

/**
 * Project Detail Client Component
 * Handles the main project view with tabs and navigation
 */
export default function ProjectDetailClient({
  project: initialProject,
  documentsByType: initialDocumentsByType,
  payments: initialPayments,
  expenses: initialExpenses,
  changes: initialChanges,
  activeTab: initialActiveTab,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [project, setProject] = useState(initialProject);
  const [documentsByType] = useState(initialDocumentsByType);
  const [payments] = useState(initialPayments);
  const [expenses] = useState(initialExpenses);
  const [changes] = useState(initialChanges);
  const [milestones, setMilestones] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [milestoneModal, setMilestoneModal] = useState({
    isOpen: false,
    milestone: null,
  });
  const [markAsFinishedModal, setMarkAsFinishedModal] = useState({
    isOpen: false,
  });
  const [projectInfoModal, setProjectInfoModal] = useState({
    isOpen: false,
  });

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
  }, [searchParams]);

  // Load milestones and tasks data
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Load milestones
        const milestonesResponse = await fetch(
          `/api/admin/milestones?projectId=${project.id}`,
          {
            credentials: "include",
          },
        );
        if (milestonesResponse.ok) {
          const milestonesData = await milestonesResponse.json();
          console.log("Loaded milestones:", milestonesData.milestones);
          console.log(
            "Milestones count:",
            milestonesData.milestones?.length || 0,
          );
          setMilestones(milestonesData.milestones || []);
        } else {
          console.error(
            "Failed to load milestones:",
            milestonesResponse.status,
          );
        }

        // Load tasks
        const tasksResponse = await fetch(`/api/projects/${project.id}/tasks`, {
          credentials: "include",
        });
        if (tasksResponse.ok) {
          const tasksData = await tasksResponse.json();
          console.log("Loaded tasks:", tasksData.tasks);
          setTasks(tasksData.tasks || []);
        } else {
          console.error("Failed to load tasks:", tasksResponse.status);
        }

        // Load sections
        const sectionsResponse = await fetch(
          `/api/projects/${project.id}/sections`,
          {
            credentials: "include",
          },
        );
        if (sectionsResponse.ok) {
          const sectionsData = await sectionsResponse.json();
          console.log("Loaded sections:", sectionsData.sections);
          setSections(sectionsData.sections || []);
        } else {
          console.error("Failed to load sections:", sectionsResponse.status);
        }
      } catch (error) {
        console.error("Error loading project data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [project.id]);

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to format budget
  const formatBudget = (budget) => {
    if (!budget) return "Not set";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(budget);
  };

  // Helper function to get priority badge
  const getPriorityBadge = (priority) => {
    const badges = {
      low: "bg-gray-100 text-gray-800 ring-1 ring-gray-200",
      medium: "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
      high: "bg-orange-100 text-orange-800 ring-1 ring-orange-200",
      urgent: "bg-red-100 text-red-800 ring-1 ring-red-200",
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

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const badges = {
      "On Going": "bg-blue-100 text-blue-800 ring-1 ring-blue-200",
      Finished: "bg-green-100 text-green-800 ring-1 ring-green-200",
      "On Hold": "bg-yellow-100 text-yellow-800 ring-1 ring-yellow-200",
      Cancelled: "bg-red-100 text-red-800 ring-1 ring-red-200",
    };
    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          badges[status] || badges["On Going"]
        }`}
      >
        {status}
      </span>
    );
  };

  // Helper function to handle tab changes
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    router.push(`/admin/projects/${project.id}?tab=${tabId}`);
  };

  // Helper function to handle milestone save
  const handleMilestoneSave = (savedMilestone) => {
    setMilestones((prev) => {
      const existingIndex = prev.findIndex((m) => m.id === savedMilestone.id);
      if (existingIndex >= 0) {
        const updated = [...prev];
        updated[existingIndex] = savedMilestone;
        return updated;
      } else {
        return [...prev, savedMilestone];
      }
    });
    setMilestoneModal({ isOpen: false, milestone: null });
  };

  // Helper function to handle milestone edit
  const handleMilestoneEdit = (milestone) => {
    setMilestoneModal({ isOpen: true, milestone });
  };

  // Helper function to handle milestone delete
  const handleMilestoneDelete = async (milestoneId) => {
    try {
      const response = await fetch(`/api/admin/milestones/${milestoneId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
      } else {
        console.error("Failed to delete milestone");
      }
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  // Helper function to handle mark as finished
  const handleMarkAsFinished = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "Finished" }),
      });

      if (response.ok) {
        window.location.reload();
      } else {
        console.error("Failed to mark project as finished");
      }
    } catch (error) {
      console.error("Error marking project as finished:", error);
    }
  };

  // Helper function to calculate progress
  const calculateProgress = () => {
    if (!tasks || tasks.length === 0) return 0;
    const completedTasks = tasks.filter((t) => t.status === "Done").length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Helper function to get project start date
  const getProjectStartDate = () => {
    if (project.startDate) {
      return formatDate(project.startDate);
    }
    return "Not set";
  };

  // Helper function to get project completion date
  const getProjectCompletionDate = () => {
    if (project.completionDate) {
      return formatDate(project.completionDate);
    }
    if (project.status === "Finished" && tasks && tasks.length > 0) {
      const completionDates = tasks
        .map((t) => t.completionDate)
        .filter((d) => d)
        .sort()
        .reverse();
      return completionDates.length > 0
        ? formatDate(completionDates[0])
        : "Not set";
    }
    return "Not set";
  };

  // Helper function to get projected finish date
  const getProjectedFinishDate = () => {
    if (project.projectedFinishDate) {
      return formatDate(project.projectedFinishDate);
    }
    return "Not set";
  };

  // Helper function to format document content for display
  const formatDocumentContent = (content) => {
    if (typeof content === "string") {
      return content.length > 100 ? content.substring(0, 100) + "..." : content;
    }

    if (typeof content === "object" && content !== null) {
      const keys = Object.keys(content);
      if (keys.length === 0) return "Empty document";

      // Try to find a meaningful field to display
      const priorityFields = [
        "description",
        "name",
        "title",
        "projectType",
        "address",
      ];
      for (const field of priorityFields) {
        if (content[field] && typeof content[field] === "string") {
          const value = content[field];
          return value.length > 100 ? value.substring(0, 100) + "..." : value;
        }
      }

      // If no priority field found, show field count
      return `${keys.length} fields: ${keys.slice(0, 3).join(", ")}${keys.length > 3 ? "..." : ""}`;
    }

    return "No content available";
  };

  // Calculate incomplete admin tasks count
  const [adminTasks, setAdminTasks] = useState([]);
  const incompleteAdminTasksCount = adminTasks.filter(
    (task) => task.status !== "Done",
  ).length;

  // Load admin tasks
  useEffect(() => {
    const loadAdminTasks = async () => {
      try {
        const response = await fetch(
          `/api/projects/${project.id}/admin-tasks`,
          {
            credentials: "include",
          },
        );
        if (response.ok) {
          const data = await response.json();
          setAdminTasks(data.tasks || []);
        }
      } catch (error) {
        console.error("Error loading admin tasks:", error);
      }
    };

    loadAdminTasks();
  }, [project.id]);

  // Define tabs
  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "tasks", name: "Tasks", icon: "📋" },
    {
      id: "admin-tasks",
      name: `Admin Tasks${incompleteAdminTasksCount > 0 ? ` (${incompleteAdminTasksCount})` : ""}`,
      icon: "👥",
    },
    { id: "milestones", name: "Milestones", icon: "🎯" },
    { id: "documents", name: "Documents", icon: "📄" },
    { id: "payments", name: "Payment Plan", icon: "💰" },
    { id: "changes", name: "Changes", icon: "🔄" },
    { id: "expenses", name: "Expenses", icon: "💳" },
    { id: "notes", name: "Notes", icon: "📝" },
    { id: "gantt", name: "Gantt Chart", icon: "📈" },
  ];

  // Calculate current progress
  const currentProgress = calculateProgress();
  console.log("Current progress:", currentProgress);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/projects"
                className="inline-flex items-center text-blue-600 hover:text-blue-800 hover:underline"
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
                    d="M10 19l-7-7m0 0l7-7m-7 7h18"
                  />
                </svg>
                Back to Projects
              </Link>
            </div>
          </div>

          <div className="mt-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-x-6 sm:space-y-0">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-2xl font-bold text-white shadow-lg">
              🏗️
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="truncate text-2xl font-bold text-gray-900 sm:text-3xl">
                {project.name}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2 sm:space-x-3">
                <p className="text-base text-gray-600 sm:text-lg">
                  {project.user.name || project.user.email}
                </p>
                <Link
                  href={`/admin/users/${project.user.id}`}
                  className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  View User
                </Link>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 sm:space-x-3">
                {getStatusBadge(project.status)}
                {getPriorityBadge(project.priority)}
                <span className="text-xs text-gray-500 sm:text-sm">
                  Progress: {currentProgress}%
                </span>
                {project.startDate &&
                  new Date(project.startDate) > new Date() && (
                    <span className="inline-flex items-center rounded-md bg-orange-50 px-2 py-1 text-xs font-medium text-orange-700 ring-1 ring-inset ring-orange-600/20">
                      <svg
                        className="mr-1 h-3 w-3"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="hidden sm:inline">Future Start</span>
                      <span className="sm:hidden">Future</span>
                    </span>
                  )}
                {project.status === "On Going" && (
                  <button
                    onClick={() => setMarkAsFinishedModal({ isOpen: true })}
                    className="inline-flex items-center rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                  >
                    <svg
                      className="mr-1 h-3 w-3"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Mark as Finished
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Progress Overview */}
        <div className="mb-8 rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Project Progress
            </h3>
            <p className="text-sm text-gray-600">Overall completion status</p>
          </div>
          <div className="mb-2 flex justify-between text-sm">
            <span className="font-medium text-gray-700">Overall Progress</span>
            <span className="font-semibold text-gray-900">
              {currentProgress}%
            </span>
          </div>
          <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-blue-600 transition-all duration-500"
              style={{ width: `${currentProgress}%` }}
            ></div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="hide-scrollbar flex flex-nowrap gap-1 overflow-x-auto sm:gap-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id)}
                  className={`group relative min-w-[140px] flex-shrink-0 rounded-t-lg px-4 py-3 text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-white text-blue-600 shadow-sm ring-1 ring-blue-500 ring-opacity-50"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center justify-center space-x-2">
                    <span className="text-base">{tab.icon}</span>
                    <span>{tab.name}</span>
                  </div>
                  {activeTab === tab.id && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
          {activeTab === "overview" && (
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Project Overview
                </h2>
                <button
                  onClick={() => setProjectInfoModal({ isOpen: true })}
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
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                  Edit Project Info
                </button>
              </div>

              <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                {/* Project Details */}
                <div>
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    Project Information
                  </h3>
                  <div className="space-y-4 text-sm">
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Type:</span>
                      <span className="font-medium">{project.type}</span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">
                        {project.location || "Not specified"}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Budget:</span>
                      <span className="font-medium">
                        {formatBudget(project.budget)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Start Date:</span>
                      <span className="font-medium">
                        {getProjectStartDate()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Projected Finish:</span>
                      <span className="font-medium">
                        {getProjectedFinishDate()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                      <span className="text-gray-600">Completion Date:</span>
                      <span className="font-medium">
                        {getProjectCompletionDate()}
                      </span>
                    </div>
                    {project.projectManager && (
                      <div className="flex items-center justify-between rounded-lg bg-gray-50 p-3">
                        <span className="text-gray-600">Project Manager:</span>
                        <span className="font-medium">
                          {project.projectManager.name} (
                          {project.projectManager.position})
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Task Statistics */}
                <div>
                  <h3 className="mb-4 text-lg font-medium text-gray-900">
                    Task Statistics
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="rounded-lg bg-blue-50 p-4 text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {tasks.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Tasks</div>
                    </div>
                    <div className="rounded-lg bg-green-50 p-4 text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {tasks.filter((t) => t.status === "Done").length}
                      </div>
                      <div className="text-sm text-gray-600">Completed</div>
                    </div>
                    <div className="rounded-lg bg-yellow-50 p-4 text-center">
                      <div className="text-2xl font-bold text-yellow-600">
                        {tasks.filter((t) => t.status === "In Progress").length}
                      </div>
                      <div className="text-sm text-gray-600">In Progress</div>
                    </div>
                    <div className="rounded-lg bg-gray-50 p-4 text-center">
                      <div className="text-2xl font-bold text-gray-600">
                        {tasks.filter((t) => t.status === "Scheduled").length}
                      </div>
                      <div className="text-sm text-gray-600">Scheduled</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">
                  Project Tasks
                </h2>
              </div>
              <TasksTable projectId={project.id} />
            </div>
          )}

          {activeTab === "admin-tasks" && (
            <div className="p-6">
              <AdminTasksTable
                projectId={project.id}
                onTasksUpdate={() => {
                  // Reload admin tasks to update the count
                  const loadAdminTasks = async () => {
                    try {
                      const response = await fetch(
                        `/api/projects/${project.id}/admin-tasks`,
                        {
                          credentials: "include",
                        },
                      );
                      if (response.ok) {
                        const data = await response.json();
                        setAdminTasks(data.tasks || []);
                      }
                    } catch (error) {
                      console.error("Error loading admin tasks:", error);
                    }
                  };
                  loadAdminTasks();
                }}
              />
            </div>
          )}

          {activeTab === "milestones" && (
            <div className="p-6">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">
                    Project Milestones
                  </h2>
                  <p className="text-sm text-gray-600">
                    Key project milestones and important deadlines
                  </p>
                </div>
                <button
                  onClick={() => {
                    console.log("Opening milestone modal");
                    setMilestoneModal({ isOpen: true, milestone: null });
                  }}
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
                  Add Milestone
                </button>
              </div>

              {/* Milestones Summary Cards */}
              {milestones.length > 0 && (
                <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                        <svg
                          className="h-5 w-5 text-white"
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
                      <div className="ml-3">
                        <p className="text-sm font-medium text-blue-600">
                          Total Milestones
                        </p>
                        <p className="text-2xl font-bold text-blue-900">
                          {milestones.length}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                        <svg
                          className="h-5 w-5 text-white"
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
                      <div className="ml-3">
                        <p className="text-sm font-medium text-green-600">
                          Completed
                        </p>
                        <p className="text-2xl font-bold text-green-900">
                          {
                            milestones.filter((m) => m.status === "Completed")
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
                        <svg
                          className="h-5 w-5 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-yellow-600">
                          In Progress
                        </p>
                        <p className="text-2xl font-bold text-yellow-900">
                          {
                            milestones.filter((m) => m.status === "In Progress")
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                        <svg
                          className="h-5 w-5 text-white"
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
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-purple-600">
                          Scheduled
                        </p>
                        <p className="text-2xl font-bold text-purple-900">
                          {
                            milestones.filter((m) => m.status === "Scheduled")
                              .length
                          }
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Milestones List */}
              <div className="space-y-6">
                {console.log("Rendering milestones:", milestones)}
                {milestones.map((milestone, index) => (
                  <div
                    key={milestone.id}
                    className="group relative overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-200 hover:shadow-lg hover:ring-gray-300"
                  >
                    {/* Milestone Header */}
                    <div className="border-b border-gray-100 p-6">
                      <div className="flex flex-col space-y-4 sm:flex-row sm:items-start sm:justify-between sm:space-y-0">
                        <div className="flex items-start space-x-4">
                          <div
                            className="flex h-12 w-12 items-center justify-center rounded-full text-xl shadow-sm"
                            style={{
                              backgroundColor: milestone.color + "20",
                              color: milestone.color,
                            }}
                          >
                            {milestone.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-3 sm:space-y-0">
                              <h3 className="break-words text-lg font-semibold text-gray-900">
                                {milestone.name}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    milestone.status === "Completed"
                                      ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                                      : milestone.status === "In Progress"
                                        ? "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                                        : milestone.status === "Delayed"
                                          ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                                          : "bg-gray-100 text-gray-800 ring-1 ring-gray-200"
                                  }`}
                                >
                                  {milestone.status}
                                </span>
                                <span
                                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                    milestone.type === "Planning"
                                      ? "bg-purple-100 text-purple-800 ring-1 ring-purple-200"
                                      : milestone.type === "Construction"
                                        ? "bg-orange-100 text-orange-800 ring-1 ring-orange-200"
                                        : milestone.type === "Finishing"
                                          ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                                          : "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                                  }`}
                                >
                                  {milestone.type}
                                </span>
                              </div>
                            </div>
                            {milestone.description && (
                              <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                {milestone.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleMilestoneEdit(milestone)}
                            className="inline-flex items-center rounded-md bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          >
                            <svg
                              className="mr-1.5 h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                            Edit
                          </button>
                          <button
                            onClick={() => handleMilestoneDelete(milestone.id)}
                            className="inline-flex items-center rounded-md bg-red-50 px-3 py-1.5 text-sm font-medium text-red-700 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                          >
                            <svg
                              className="mr-1.5 h-3.5 w-3.5"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                              />
                            </svg>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Milestone Details */}
                    <div className="p-6">
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <svg
                              className="h-4 w-4 text-gray-600"
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
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Due Date
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {formatDate(milestone.date)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <svg
                              className="h-4 w-4 text-gray-600"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Type
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {milestone.type}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center space-x-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                            <svg
                              className="h-4 w-4 text-gray-600"
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
                          <div>
                            <p className="text-xs font-medium text-gray-500">
                              Status
                            </p>
                            <p className="text-sm font-semibold text-gray-900">
                              {milestone.status}
                            </p>
                          </div>
                        </div>
                      </div>

                      {milestone.notes && (
                        <div className="mt-4 rounded-lg bg-gray-50 p-4">
                          <p className="text-sm text-gray-700">
                            <span className="font-medium">Notes:</span>{" "}
                            {milestone.notes}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {milestones.length === 0 && (
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
                          d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                        />
                      </svg>
                    </div>
                    <h3 className="mb-2 text-lg font-medium text-gray-900">
                      No Milestones Created
                    </h3>
                    <p className="mb-6 text-gray-600">
                      Create your first milestone to track important project
                      deadlines and achievements.
                    </p>
                    <button
                      onClick={() =>
                        setMilestoneModal({ isOpen: true, milestone: null })
                      }
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
                      Create First Milestone
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "documents" && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Project Documents
                </h2>
                <p className="text-sm text-gray-600">
                  Documents uploaded by{" "}
                  {project.user.name || project.user.email}
                </p>
              </div>
              <div className="space-y-4">
                {Object.entries(documentsByType).map(([type, documents]) => (
                  <div
                    key={type}
                    className="rounded-lg border border-gray-200 bg-white p-4"
                  >
                    <h3 className="mb-3 font-medium capitalize text-gray-900">
                      {type} ({documents.length})
                    </h3>
                    <div className="space-y-2">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between rounded-md bg-gray-50 p-3"
                        >
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {formatDocumentContent(doc.content)}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatDate(doc.createdAt)}
                            </p>
                          </div>
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              doc.status === "approved"
                                ? "bg-green-100 text-green-800"
                                : doc.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {doc.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                {Object.keys(documentsByType).length === 0 && (
                  <div className="py-8 text-center">
                    <p className="text-gray-500">No documents uploaded yet.</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === "payments" && (
            <div className="p-6">
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Payment Plan
                </h2>
                <p className="text-sm text-gray-600">
                  Payment schedule for {project.user.name || project.user.email}
                </p>
              </div>
              {payments && payments.length > 0 ? (
                <div className="space-y-6">
                  {/* Payment Summary Cards */}
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    <div className="rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 p-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-500">
                          <svg
                            className="h-5 w-5 text-white"
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
                        <div className="ml-3">
                          <p className="text-sm font-medium text-blue-600">
                            Total Payments
                          </p>
                          <p className="text-2xl font-bold text-blue-900">
                            {payments.length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-green-50 to-green-100 p-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-500">
                          <svg
                            className="h-5 w-5 text-white"
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
                        <div className="ml-3">
                          <p className="text-sm font-medium text-green-600">
                            Paid
                          </p>
                          <p className="text-2xl font-bold text-green-900">
                            {payments.filter((p) => p.status === "Paid").length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-yellow-500">
                          <svg
                            className="h-5 w-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-yellow-600">
                            Due
                          </p>
                          <p className="text-2xl font-bold text-yellow-900">
                            {payments.filter((p) => p.status === "Due").length}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-lg bg-gradient-to-br from-purple-50 to-purple-100 p-4">
                      <div className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-500">
                          <svg
                            className="h-5 w-5 text-white"
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
                        <div className="ml-3">
                          <p className="text-sm font-medium text-purple-600">
                            Total Amount
                          </p>
                          <p className="text-lg font-bold text-purple-900">
                            {formatBudget(
                              payments.reduce((sum, p) => sum + p.amount, 0),
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Schedule */}
                  <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
                    <div className="border-b border-gray-200 px-6 py-4">
                      <h3 className="text-lg font-semibold text-gray-900">
                        Payment Schedule
                      </h3>
                      <p className="mt-1 text-sm text-gray-600">
                        Detailed breakdown of all scheduled payments
                      </p>
                    </div>
                    <div className="overflow-x-auto">
                      <div className="min-w-[800px]">
                        <div className="divide-y divide-gray-200">
                          {payments.map((payment, index) => (
                            <div
                              key={payment.id}
                              className="px-6 py-4 transition-colors hover:bg-gray-50"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-100">
                                    <span className="text-sm font-semibold text-gray-600">
                                      #{payment.order}
                                    </span>
                                  </div>
                                  <div>
                                    <h4 className="text-sm font-medium text-gray-900">
                                      {payment.name}
                                    </h4>
                                    <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                                      <span className="flex items-center">
                                        <svg
                                          className="mr-1 h-3 w-3"
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
                                        Due: {formatDate(payment.dueDate)}
                                      </span>
                                      {payment.status === "Paid" && (
                                        <span className="flex items-center text-green-600">
                                          <svg
                                            className="mr-1 h-3 w-3"
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
                                          Paid
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center space-x-4">
                                  <div className="text-right">
                                    <p className="text-sm font-semibold text-gray-900">
                                      {formatBudget(payment.amount)}
                                    </p>
                                  </div>
                                  <span
                                    className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium ${
                                      payment.status === "Paid"
                                        ? "bg-green-100 text-green-800 ring-1 ring-green-200"
                                        : payment.status === "Due"
                                          ? "bg-red-100 text-red-800 ring-1 ring-red-200"
                                          : "bg-blue-100 text-blue-800 ring-1 ring-blue-200"
                                    }`}
                                  >
                                    {payment.status === "Paid" && (
                                      <svg
                                        className="mr-1 h-3 w-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                    {payment.status === "Due" && (
                                      <svg
                                        className="mr-1 h-3 w-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                    {payment.status === "Scheduled" && (
                                      <svg
                                        className="mr-1 h-3 w-3"
                                        fill="currentColor"
                                        viewBox="0 0 20 20"
                                      >
                                        <path
                                          fillRule="evenodd"
                                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                                          clipRule="evenodd"
                                        />
                                      </svg>
                                    )}
                                    {payment.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Progress Overview */}
                  <div className="rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50 p-6">
                    <h3 className="mb-4 text-lg font-semibold text-gray-900">
                      Payment Progress
                    </h3>
                    <div className="space-y-4">
                      <div>
                        <div className="mb-2 flex justify-between text-sm">
                          <span className="font-medium text-gray-700">
                            Overall Progress
                          </span>
                          <span className="font-semibold text-gray-900">
                            {Math.round(
                              (payments.filter((p) => p.status === "Paid")
                                .length /
                                payments.length) *
                                100,
                            )}
                            %
                          </span>
                        </div>
                        <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                          <div
                            className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500"
                            style={{
                              width: `${(payments.filter((p) => p.status === "Paid").length / payments.length) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                          <div className="font-medium text-gray-900">
                            {formatBudget(
                              payments
                                .filter((p) => p.status === "Paid")
                                .reduce((sum, p) => sum + p.amount, 0),
                            )}
                          </div>
                          <div className="text-gray-600">Amount Paid</div>
                        </div>
                        <div className="rounded-lg bg-white p-3 shadow-sm">
                          <div className="font-medium text-gray-900">
                            {formatBudget(
                              payments
                                .filter((p) => p.status !== "Paid")
                                .reduce((sum, p) => sum + p.amount, 0),
                            )}
                          </div>
                          <div className="text-gray-600">Amount Remaining</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
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
                        d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
                      />
                    </svg>
                  </div>
                  <h3 className="mb-2 text-lg font-medium text-gray-900">
                    No Payment Plan Found
                  </h3>
                  <p className="mb-6 text-gray-600">
                    This user doesn&apos;t have any payments set up yet. Create
                    a payment plan to get started.
                  </p>
                  <Link
                    href={`/admin/users/${project.user.id}?tab=payments`}
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
                    Create Payment Plan
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === "changes" && (
            <div className="p-6">
              <ChangesTab
                projectId={project.id}
                projectName={project.name}
                userName={project.user.name || project.user.email}
                changes={changes}
              />
            </div>
          )}

          {activeTab === "expenses" && (
            <div className="p-6">
              <ExpensesTab
                projectId={project.id}
                projectName={project.name}
                userName={project.user.name || project.user.email}
                userAddress={project.location}
                expenses={expenses}
              />
            </div>
          )}

          {activeTab === "notes" && (
            <div className="p-6">
              <EnhancedNotesTab projectId={project.id} />
            </div>
          )}

          {activeTab === "gantt" && (
            <div className="p-6">
              <GanttChart
                projectId={project.id}
                projectName={project.name}
                tasks={tasks}
                sections={sections}
              />
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      {milestoneModal.isOpen && (
        <MilestoneModal
          isOpen={milestoneModal.isOpen}
          milestone={milestoneModal.milestone}
          projectId={project.id}
          onClose={() => {
            console.log("Closing milestone modal");
            setMilestoneModal({ isOpen: false, milestone: null });
          }}
          onSave={handleMilestoneSave}
        />
      )}

      {projectInfoModal.isOpen && (
        <ProjectInfoModal
          isOpen={projectInfoModal.isOpen}
          project={project}
          onClose={() => setProjectInfoModal({ isOpen: false })}
          onSave={(updatedProject) => {
            // Update the local project state with the updated data
            setProject(updatedProject);
            console.log("Project updated successfully:", updatedProject);
          }}
        />
      )}

      {/* Mark as Finished Modal */}
      {markAsFinishedModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="rounded-lg bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Mark Project as Finished
            </h3>
            <p className="mb-6 text-gray-600">
              Are you sure you want to mark this project as finished? This
              action cannot be undone.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setMarkAsFinishedModal({ isOpen: false })}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleMarkAsFinished}
                className="rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700"
              >
                Mark as Finished
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
