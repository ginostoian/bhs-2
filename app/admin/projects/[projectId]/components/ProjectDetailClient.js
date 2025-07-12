"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import TasksTable from "./TasksTable";
import MilestoneModal from "./MilestoneModal";
import ProjectInfoModal from "./ProjectInfoModal";
import NotesTab from "./NotesTab";
import GanttChart from "./GanttChart";

/**
 * Project Detail Client Component
 * Handles the main project view with tabs and navigation
 */
export default function ProjectDetailClient({
  project: initialProject,
  documentsByType: initialDocumentsByType,
  payments: initialPayments,
  activeTab: initialActiveTab,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState(initialActiveTab);
  const [project] = useState(initialProject);
  const [documentsByType] = useState(initialDocumentsByType);
  const [payments] = useState(initialPayments);
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

  // Helper function to get status badge
  const getStatusBadge = (status) => {
    const badges = {
      "On Going": "bg-yellow-100 text-yellow-800",
      Finished: "bg-green-100 text-green-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[status] || badges["On Going"]}`}
      >
        {status}
      </span>
    );
  };

  // Tab navigation
  const tabs = [
    { id: "overview", name: "Overview", icon: "📊" },
    { id: "tasks", name: "Tasks", icon: "📋" },
    { id: "timeline", name: "Timeline", icon: "📅" },
    { id: "gantt", name: "Gantt Chart", icon: "📈" },
    { id: "documents", name: "Documents", icon: "📄" },
    { id: "notes", name: "Notes", icon: "📝" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.push(`?${params.toString()}`);
  };

  // Milestone management functions
  const handleMilestoneSave = (savedMilestone) => {
    if (milestoneModal.milestone) {
      // Update existing milestone
      setMilestones((prev) =>
        prev.map((m) => (m.id === savedMilestone.id ? savedMilestone : m)),
      );
    } else {
      // Add new milestone
      setMilestones((prev) => [...prev, savedMilestone]);
    }
  };

  const handleMilestoneEdit = (milestone) => {
    setMilestoneModal({ isOpen: true, milestone });
  };

  const handleMilestoneDelete = async (milestoneId) => {
    if (!confirm("Are you sure you want to delete this milestone?")) return;

    try {
      const response = await fetch(`/api/admin/milestones/${milestoneId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (response.ok) {
        setMilestones((prev) => prev.filter((m) => m.id !== milestoneId));
      }
    } catch (error) {
      console.error("Error deleting milestone:", error);
    }
  };

  // Handle marking project as finished
  const handleMarkAsFinished = async () => {
    try {
      const response = await fetch(`/api/projects/${project.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ status: "Finished" }),
      });

      if (response.ok) {
        const result = await response.json();
        // Update the project data
        window.location.reload(); // Simple refresh to update all data
      } else {
        console.error("Failed to mark project as finished");
      }
    } catch (error) {
      console.error("Error marking project as finished:", error);
    }
  };

  // Calculate project progress from tasks
  const calculateProgress = () => {
    if (tasks.length === 0) return 0;

    const completedTasks = tasks.filter(
      (task) => task.status === "Done",
    ).length;
    return Math.round((completedTasks / tasks.length) * 100);
  };

  // Get project start date from tasks
  const getProjectStartDate = () => {
    const inProgressTasks = tasks.filter(
      (task) => task.status === "In Progress" || task.status === "Done",
    );
    if (inProgressTasks.length === 0) return null;

    const startDates = inProgressTasks
      .map((task) => task.startDate)
      .filter((date) => date)
      .map((date) => new Date(date));

    return startDates.length > 0 ? new Date(Math.min(...startDates)) : null;
  };

  // Get project completion date from project status change
  const getProjectCompletionDate = () => {
    // If project status is "Finished", use the project's completion date
    // This is set when the project status changes from "On Going" to "Finished"
    if (project.status === "Finished" && project.completionDate) {
      return new Date(project.completionDate);
    }
    return null;
  };

  const currentProgress = calculateProgress();
  const projectStartDate = getProjectStartDate();
  const projectCompletionDate = getProjectCompletionDate();

  // Debug logging
  console.log("Tasks count:", tasks.length);
  console.log(
    "Completed tasks:",
    tasks.filter((t) => t.status === "Done").length,
  );
  console.log("Current progress:", currentProgress);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/projects"
            className="text-blue-600 hover:text-blue-800 hover:underline"
          >
            ← Back to Projects
          </Link>
        </div>

        <div className="mt-4 flex items-center space-x-4">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-500 text-xl font-medium text-white">
            🏗️
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{project.name}</h1>
            <p className="text-lg text-gray-600">
              {project.user.name || project.user.email}
            </p>
            <div className="mt-2 flex items-center space-x-2">
              {getStatusBadge(project.status)}
              {getPriorityBadge(project.priority)}
              <span className="text-sm text-gray-500">
                Progress: {currentProgress}%
              </span>
              {project.status === "On Going" && (
                <button
                  onClick={() => setMarkAsFinishedModal({ isOpen: true })}
                  className="ml-4 rounded-md bg-green-600 px-3 py-1 text-xs font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Mark as Finished
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-1 flex justify-between text-sm text-gray-600">
          <span>Overall Progress</span>
          <span>{currentProgress}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${currentProgress}%` }}
          ></div>
        </div>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleTabChange(tab.id)}
              className={`flex items-center space-x-2 border-b-2 px-1 py-2 text-sm font-medium ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700"
              }`}
            >
              <span>{tab.icon}</span>
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="rounded-lg border border-gray-200 bg-white">
        {activeTab === "overview" && (
          <div className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Project Overview
              </h2>
              <button
                onClick={() => setProjectInfoModal({ isOpen: true })}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Edit Project Info
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              {/* Project Details */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Project Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Type:</span>
                    <span className="font-medium">{project.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">
                      {project.location || "Not specified"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">
                      {formatBudget(project.budget)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Start Date:</span>
                    <span className="font-medium">
                      {formatDate(project.startDate)}
                    </span>
                  </div>
                  {project.completionDate && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Completion Date:</span>
                      <span className="font-medium">
                        {formatDate(project.completionDate)}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tasks:</span>
                    <span className="font-medium">
                      {tasks.filter((t) => t.status === "Done").length}/
                      {tasks.length} completed
                    </span>
                  </div>
                </div>

                {project.description && (
                  <div className="mt-6">
                    <h4 className="mb-2 text-sm font-medium text-gray-900">
                      Description
                    </h4>
                    <p className="text-sm text-gray-600">
                      {project.description}
                    </p>
                  </div>
                )}

                {project.notes && (
                  <div className="mt-6">
                    <h4 className="mb-2 text-sm font-medium text-gray-900">
                      Notes
                    </h4>
                    <p className="text-sm text-gray-600">{project.notes}</p>
                  </div>
                )}
              </div>

              {/* Project Manager & User Info */}
              <div>
                <h3 className="mb-4 text-lg font-medium text-gray-900">
                  Team & Client
                </h3>

                {project.projectManager && (
                  <div className="mb-6">
                    <h4 className="mb-2 text-sm font-medium text-gray-900">
                      Project Manager
                    </h4>
                    <div className="rounded-lg bg-gray-50 p-3">
                      <div className="font-medium">
                        {project.projectManager.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {project.projectManager.position}
                      </div>
                      <div className="text-sm text-gray-500">
                        {project.projectManager.email}
                      </div>
                    </div>
                  </div>
                )}

                <div>
                  <h4 className="mb-2 text-sm font-medium text-gray-900">
                    Client
                  </h4>
                  <div className="rounded-lg bg-blue-50 p-3">
                    <div className="font-medium">
                      {project.user.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-600">
                      {project.user.email}
                    </div>
                    <div className="text-sm text-gray-500">
                      Status: {project.user.projectStatus}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "tasks" && (
          <div className="p-6">
            <TasksTable projectId={project.id} />
          </div>
        )}

        {activeTab === "timeline" && (
          <div className="p-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Project Timeline
              </h2>
              <button
                onClick={() =>
                  setMilestoneModal({ isOpen: true, milestone: null })
                }
                className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <span>➕</span>
                <span>Add Milestone</span>
              </button>
            </div>

            {loading ? (
              <div className="py-12 text-center text-gray-500">
                Loading timeline data...
              </div>
            ) : (
              <div className="relative">
                {/* Timeline Line */}
                <div className="absolute bottom-0 left-2 top-0 w-0.5 bg-gray-300"></div>

                <div className="space-y-8">
                  {/* Project Start */}
                  {projectStartDate && (
                    <div className="relative flex items-start">
                      <div className="absolute left-2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-green-500 shadow"></div>
                      <div className="ml-8 flex-1">
                        <div className="rounded-lg bg-green-50 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-green-900">
                                Project Started
                              </h3>
                              <p className="text-sm text-green-700">
                                {formatDate(projectStartDate)}
                              </p>
                              <p className="text-sm text-green-600">
                                Based on first task start date
                              </p>
                            </div>
                            <div className="text-green-600">🚀</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Current Progress */}
                  <div className="relative flex items-start">
                    <div className="absolute left-2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-blue-500 shadow"></div>
                    <div className="ml-8 flex-1">
                      <div className="rounded-lg bg-blue-50 p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-medium text-blue-900">
                              Current Progress
                            </h3>
                            <p className="text-sm text-blue-700">
                              {currentProgress}% Complete
                            </p>
                            <p className="text-sm text-blue-600">
                              {tasks.filter((t) => t.status === "Done").length}{" "}
                              of {tasks.length} tasks completed
                            </p>
                          </div>
                          <div className="text-blue-600">📊</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Custom Milestones */}
                  {milestones.length > 0 &&
                    milestones.map((milestone) => (
                      <div
                        key={milestone.id}
                        className="relative flex items-start"
                      >
                        <div
                          className="absolute left-2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white shadow"
                          style={{ backgroundColor: milestone.color }}
                        ></div>
                        <div className="ml-8 flex-1">
                          <div
                            className="rounded-lg p-4"
                            style={{ backgroundColor: `${milestone.color}10` }}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <div className="flex items-center space-x-2">
                                  <span className="text-lg">
                                    {milestone.icon}
                                  </span>
                                  <h3
                                    className="font-medium"
                                    style={{ color: milestone.color }}
                                  >
                                    {milestone.name}
                                  </h3>
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                      milestone.status === "Completed"
                                        ? "bg-green-100 text-green-800"
                                        : milestone.status === "In Progress"
                                          ? "bg-blue-100 text-blue-800"
                                          : milestone.status === "Delayed"
                                            ? "bg-red-100 text-red-800"
                                            : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {milestone.status}
                                  </span>
                                </div>
                                {milestone.description && (
                                  <p
                                    className="mt-1 text-sm"
                                    style={{ color: `${milestone.color}CC` }}
                                  >
                                    {milestone.description}
                                  </p>
                                )}
                                <p
                                  className="mt-1 text-sm"
                                  style={{ color: `${milestone.color}CC` }}
                                >
                                  {formatDate(milestone.date)}
                                </p>
                                {milestone.notes && (
                                  <p className="mt-1 text-xs text-gray-600">
                                    {milestone.notes}
                                  </p>
                                )}
                              </div>
                              <div className="flex space-x-2">
                                <button
                                  onClick={() => handleMilestoneEdit(milestone)}
                                  className="text-gray-400 hover:text-gray-600"
                                  title="Edit milestone"
                                >
                                  ✏️
                                </button>
                                <button
                                  onClick={() =>
                                    handleMilestoneDelete(milestone.id)
                                  }
                                  className="text-gray-400 hover:text-red-600"
                                  title="Delete milestone"
                                >
                                  🗑️
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}

                  {/* Project Completion */}
                  {projectCompletionDate && (
                    <div className="relative flex items-start">
                      <div className="absolute left-2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-purple-500 shadow"></div>
                      <div className="ml-8 flex-1">
                        <div className="rounded-lg bg-purple-50 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-purple-900">
                                Project Completed
                              </h3>
                              <p className="text-sm text-purple-700">
                                {formatDate(projectCompletionDate)}
                              </p>
                              <p className="text-sm text-purple-600">
                                Based on project completion date
                              </p>
                            </div>
                            <div className="text-purple-600">✅</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Budget Status */}
                  {project.budget && (
                    <div className="relative flex items-start">
                      <div className="absolute left-2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-yellow-500 shadow"></div>
                      <div className="ml-8 flex-1">
                        <div className="rounded-lg bg-yellow-50 p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="font-medium text-yellow-900">
                                Budget Overview
                              </h3>
                              <p className="text-sm text-yellow-700">
                                Total Budget: {formatBudget(project.budget)}
                              </p>
                              <p className="text-sm text-yellow-700">
                                Status: {project.status}
                              </p>
                            </div>
                            <div className="text-yellow-600">💰</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No milestones message */}
                  {milestones.length === 0 &&
                    !projectStartDate &&
                    !projectCompletionDate && (
                      <div className="relative flex items-start">
                        <div className="absolute left-2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-white bg-gray-400 shadow"></div>
                        <div className="ml-8 flex-1">
                          <div className="rounded-lg bg-gray-50 p-4">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="font-medium text-gray-900">
                                  No Timeline Data
                                </h3>
                                <p className="text-sm text-gray-700">
                                  Add milestones or start tasks to see timeline
                                  data
                                </p>
                              </div>
                              <div className="text-gray-600">📅</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Timeline Legend */}
            <div className="mt-8 rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 text-sm font-medium text-gray-900">
                Timeline Legend
              </h3>
              <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-green-500"></div>
                  <span className="text-gray-700">Project Start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="text-gray-700">Current Progress</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-orange-500"></div>
                  <span className="text-gray-700">Custom Milestones</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                  <span className="text-gray-700">Project Complete</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="p-6">
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Project Documents
            </h2>

            {Object.keys(documentsByType).length === 0 ? (
              <div className="py-12 text-center text-gray-500">
                No documents found for this project.
              </div>
            ) : (
              <div className="space-y-6">
                {Object.entries(documentsByType).map(([type, documents]) => (
                  <div key={type}>
                    <h3 className="mb-3 text-lg font-medium capitalize text-gray-900">
                      {type}s ({documents.length})
                    </h3>
                    <div className="rounded-lg bg-gray-50 p-4">
                      {documents.map((doc) => (
                        <div
                          key={doc.id}
                          className="flex items-center justify-between py-2"
                        >
                          <div>
                            <div className="font-medium">
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </div>
                            <div className="text-sm text-gray-600">
                              {formatDate(doc.createdAt)}
                            </div>
                          </div>
                          {doc.status && (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                                doc.status === "paid"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {doc.status}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "gantt" && (
          <GanttChart
            projectId={project.id}
            projectName={project.name}
            tasks={tasks}
            sections={sections}
          />
        )}

        {activeTab === "notes" && <NotesTab projectId={project.id} />}
      </div>

      {/* Milestone Modal */}
      <MilestoneModal
        isOpen={milestoneModal.isOpen}
        onClose={() => setMilestoneModal({ isOpen: false, milestone: null })}
        milestone={milestoneModal.milestone}
        projectId={project.id}
        onSave={handleMilestoneSave}
      />

      {/* Mark as Finished Modal */}
      {markAsFinishedModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <span className="text-lg text-green-600">✅</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Mark Project as Finished
                  </h3>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Are you sure you want to mark this project as finished? This
                  action will:
                </p>
                <ul className="mt-3 space-y-1 text-sm text-gray-600">
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    Set the project completion date to today
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    Update the project status to &quot;Finished&quot;
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-green-500">•</span>
                    Update the user&apos;s project status to
                    &quot;Finished&quot;
                  </li>
                  <li className="flex items-start">
                    <span className="mr-2 text-yellow-500">•</span>
                    This action cannot be undone
                  </li>
                </ul>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setMarkAsFinishedModal({ isOpen: false })}
                  className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    handleMarkAsFinished();
                    setMarkAsFinishedModal({ isOpen: false });
                  }}
                  className="rounded-md bg-green-600 px-4 py-2 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  Mark as Finished
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Project Info Modal */}
      <ProjectInfoModal
        isOpen={projectInfoModal.isOpen}
        onClose={() => setProjectInfoModal({ isOpen: false })}
        project={project}
        onSave={() => window.location.reload()}
      />
    </div>
  );
}
