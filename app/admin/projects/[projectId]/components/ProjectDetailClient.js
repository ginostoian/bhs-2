"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import TasksTable from "./TasksTable";

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

  // Update active tab when URL changes
  useEffect(() => {
    const tab = searchParams.get("tab") || "overview";
    setActiveTab(tab);
  }, [searchParams]);

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
    { id: "documents", name: "Documents", icon: "📄" },
  ];

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const params = new URLSearchParams(searchParams);
    params.set("tab", tabId);
    router.push(`?${params.toString()}`);
  };

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
                Progress: {project.progress}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-8">
        <div className="mb-1 flex justify-between text-sm text-gray-600">
          <span>Overall Progress</span>
          <span>{project.progress}%</span>
        </div>
        <div className="h-3 w-full rounded-full bg-gray-200">
          <div
            className="h-3 rounded-full bg-blue-600 transition-all duration-300"
            style={{ width: `${project.progress}%` }}
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
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Project Overview
            </h2>

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
                      {project.completedTasksCount}/{project.tasksCount}{" "}
                      completed
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
            <h2 className="mb-6 text-xl font-semibold text-gray-900">
              Project Timeline
            </h2>
            <div className="py-12 text-center text-gray-500">
              Timeline view coming soon...
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
      </div>
    </div>
  );
}
