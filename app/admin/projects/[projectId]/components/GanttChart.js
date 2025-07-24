"use client";

import { useState, useEffect } from "react";
import { jsPDF } from "jspdf";

// Initialize autoTable plugin
let autoTableLoaded = false;

const loadAutoTable = async () => {
  if (autoTableLoaded) return true;

  try {
    const autoTable = await import("jspdf-autotable");
    jsPDF.API.autoTable = autoTable.default;
    autoTableLoaded = true;
    return true;
  } catch (error) {
    console.warn(
      "jspdf-autotable not available, using fallback PDF generation",
    );
    return false;
  }
};

export default function GanttChart({
  projectId,
  projectName,
  tasks,
  sections,
}) {
  const [loading, setLoading] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [showShareModal, setShowShareModal] = useState(false);

  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to get task color based on status
  const getTaskColor = (status) => {
    const colors = {
      Scheduled: "#6B7280", // Gray
      "In Progress": "#3B82F6", // Blue
      Done: "#10B981", // Green
      Blocked: "#EF4444", // Red
    };
    return colors[status] || "#6B7280";
  };

  // Helper function to get section color
  const getSectionColor = (sectionId) => {
    const section = sections.find((s) => s.id === sectionId);
    return section?.color || "#3B82F6";
  };

  // Calculate task duration
  const getTaskDuration = (task) => {
    if (task.actualStartDate && task.completionDate) {
      const start = new Date(task.actualStartDate);
      const end = new Date(task.completionDate);
      const diffTime = Math.abs(end - start);
      return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }
    return task.estimatedDuration || 1;
  };

  // Calculate task start position (days from project start)
  const getTaskStartPosition = (task) => {
    if (!task.plannedStartDate) return 0;

    // Find the earliest task planned start date as project start
    const allStartDates = tasks
      .map((t) => t.plannedStartDate)
      .filter((date) => date)
      .map((date) => new Date(date));

    if (allStartDates.length === 0) return 0;

    const projectStart = new Date(Math.min(...allStartDates));
    const taskStart = new Date(task.plannedStartDate);
    const diffTime = Math.abs(taskStart - projectStart);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Generate PDF
  const generatePDF = async () => {
    setLoading(true);
    try {
      await loadAutoTable();

      const doc = new jsPDF();

      // Header
      doc.setFontSize(24);
      doc.setTextColor(59, 130, 246); // Blue color
      doc.text("Better Homes Studio", 20, 30);

      doc.setFontSize(16);
      doc.setTextColor(0, 0, 0);
      doc.text(`Gantt Chart - ${projectName}`, 20, 45);

      // Date
      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(
        `Generated on: ${new Date().toLocaleDateString("en-GB")}`,
        20,
        55,
      );

      // Project Summary
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Project Summary", 20, 75);

      const completedTasks = tasks.filter((t) => t.status === "Done").length;
      const totalTasks = tasks.length;
      const progress =
        totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

      doc.setFontSize(10);
      doc.setTextColor(100, 100, 100);
      doc.text(`Total Tasks: ${totalTasks}`, 20, 85);
      doc.text(`Completed: ${completedTasks}`, 20, 92);
      doc.text(`Progress: ${progress}%`, 20, 99);

      // Tasks Table
      doc.setFontSize(14);
      doc.setTextColor(0, 0, 0);
      doc.text("Task Details", 20, 120);

      const tableData = tasks.map((task) => [
        task.section?.name || "Unknown",
        task.name,
        task.status,
        task.assignedTo?.name || "Unassigned",
        task.plannedStartDate ? formatDate(task.plannedStartDate) : "Not set",
        task.completionDate ? formatDate(task.completionDate) : "Not set",
        `${getTaskDuration(task)} days`,
      ]);

      doc.autoTable({
        startY: 130,
        head: [
          [
            "Section",
            "Task",
            "Status",
            "Assigned To",
            "Start Date",
            "End Date",
            "Duration",
          ],
        ],
        body: tableData,
        theme: "grid",
        headStyles: { fillColor: [59, 130, 246] },
        styles: { fontSize: 8 },
        columnStyles: {
          0: { cellWidth: 25 },
          1: { cellWidth: 40 },
          2: { cellWidth: 20 },
          3: { cellWidth: 25 },
          4: { cellWidth: 25 },
          5: { cellWidth: 25 },
          6: { cellWidth: 20 },
        },
      });

      // Footer
      const finalY = doc.lastAutoTable.finalY + 20;
      doc.setFontSize(8);
      doc.setTextColor(100, 100, 100);
      doc.text(
        "Better Homes Studio | London | www.betterhomesstudio.com",
        20,
        finalY,
      );

      // Download PDF
      const fileName = `gantt-chart-${projectName.toLowerCase().replace(/\s+/g, "-")}-${new Date().toISOString().split("T")[0]}.pdf`;
      doc.save(fileName);
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert("Error generating PDF. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Generate share link
  const generateShareLink = async () => {
    try {
      const response = await fetch(`/api/projects/${projectId}/gantt-share`, {
        method: "POST",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        setShareLink(data.shareUrl);
        setShowShareModal(true);
      } else {
        alert("Error generating share link. Please try again.");
      }
    } catch (error) {
      console.error("Error generating share link:", error);
      alert("Error generating share link. Please try again.");
    }
  };

  // Copy share link to clipboard
  const copyShareLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink);
      alert("Share link copied to clipboard!");
    } catch (error) {
      console.error("Error copying to clipboard:", error);
      alert("Error copying to clipboard. Please copy manually.");
    }
  };

  // Group tasks by section
  const tasksBySection = sections.map((section) => ({
    ...section,
    tasks: tasks.filter((task) => task.section?.id === section.id),
  }));

  // Calculate timeline dimensions
  const allStartDates = tasks
    .map((t) => t.plannedStartDate)
    .filter((date) => date)
    .map((date) => new Date(date));

  const allEndDates = tasks
    .map(
      (t) =>
        t.completionDate ||
        (t.plannedStartDate
          ? new Date(
              new Date(t.plannedStartDate).getTime() +
                (t.estimatedDuration || 1) * 24 * 60 * 60 * 1000,
            )
          : null),
    )
    .filter((date) => date)
    .map((date) => new Date(date));

  const projectStart =
    allStartDates.length > 0
      ? new Date(Math.min(...allStartDates))
      : new Date();
  const projectEnd =
    allEndDates.length > 0 ? new Date(Math.max(...allEndDates)) : new Date();

  const totalDays =
    Math.ceil((projectEnd - projectStart) / (1000 * 60 * 60 * 24)) + 1;

  return (
    <div className="p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Gantt Chart</h2>
        <div className="flex space-x-3">
          <button
            onClick={generateShareLink}
            className="flex items-center space-x-2 rounded-md bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
          >
            <span>🔗</span>
            <span>Share</span>
          </button>
          <button
            onClick={generatePDF}
            disabled={loading}
            className="flex items-center space-x-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <span>{loading ? "⏳" : "📄"}</span>
            <span>{loading ? "Generating..." : "Export PDF"}</span>
          </button>
        </div>
      </div>

      {tasks.length === 0 ? (
        <div className="py-12 text-center text-gray-500">
          <div className="mb-4 text-6xl">📊</div>
          <h3 className="mb-2 text-lg font-medium text-gray-900">
            No Tasks Found
          </h3>
          <p className="text-gray-600">
            Add tasks to this project to see the Gantt chart.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Timeline Header */}
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="flex border-b border-gray-200">
                <div className="w-64 flex-shrink-0 p-3 font-medium text-gray-900">
                  Task
                </div>
                <div className="flex-1 p-3 font-medium text-gray-900">
                  Timeline
                </div>
                <div className="w-32 flex-shrink-0 p-3 font-medium text-gray-900">
                  Duration
                </div>
                <div className="w-32 flex-shrink-0 p-3 font-medium text-gray-900">
                  Status
                </div>
              </div>
            </div>
          </div>

          {/* Gantt Chart Content */}
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {tasksBySection.map((section) => (
                <div key={section.id} className="mb-6">
                  <div className="mb-3 flex items-center space-x-2">
                    <div
                      className="h-4 w-4 rounded"
                      style={{ backgroundColor: section.color }}
                    ></div>
                    <h3 className="text-lg font-medium text-gray-900">
                      {section.name}
                    </h3>
                    <span className="text-sm text-gray-500">
                      ({section.tasks.length} tasks)
                    </span>
                  </div>

                  {section.tasks.map((task) => {
                    const startPosition = getTaskStartPosition(task);
                    const duration = getTaskDuration(task);
                    const width = Math.max((duration / totalDays) * 100, 5);
                    const left = (startPosition / totalDays) * 100;

                    return (
                      <div
                        key={task.id}
                        className="mb-3 flex items-center border-b border-gray-100 pb-3"
                      >
                        <div className="w-64 flex-shrink-0 p-3">
                          <div className="font-medium text-gray-900">
                            {task.name}
                          </div>
                          <div className="text-sm text-gray-500">
                            {task.assignedTo?.name || "Unassigned"}
                          </div>
                        </div>

                        <div className="flex-1 p-3">
                          <div className="relative h-8 rounded bg-gray-100">
                            <div
                              className="absolute top-1 h-6 rounded shadow-sm"
                              style={{
                                left: `${left}%`,
                                width: `${width}%`,
                                backgroundColor: getTaskColor(task.status),
                                minWidth: "20px",
                              }}
                              title={`${task.name} - ${formatDate(task.plannedStartDate)} to ${task.completionDate ? formatDate(task.completionDate) : "Ongoing"}`}
                            ></div>
                          </div>
                          <div className="mt-1 text-xs text-gray-500">
                            {task.plannedStartDate
                              ? formatDate(task.plannedStartDate)
                              : "Not started"}
                            {task.completionDate &&
                              ` - ${formatDate(task.completionDate)}`}
                          </div>
                        </div>

                        <div className="w-32 flex-shrink-0 p-3 text-sm text-gray-600">
                          {duration} days
                        </div>

                        <div className="w-32 flex-shrink-0 p-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              task.status === "Done"
                                ? "bg-green-100 text-green-800"
                                : task.status === "In Progress"
                                  ? "bg-blue-100 text-blue-800"
                                  : task.status === "Blocked"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-gray-100 text-gray-800"
                            }`}
                          >
                            {task.status}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="mt-8 rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 text-sm font-medium text-gray-900">
              Status Legend
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded bg-gray-500"></div>
                <span className="text-gray-700">Scheduled</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded bg-blue-500"></div>
                <span className="text-gray-700">In Progress</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded bg-green-500"></div>
                <span className="text-gray-700">Done</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-3 w-3 rounded bg-red-500"></div>
                <span className="text-gray-700">Blocked</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="p-6">
              <div className="mb-4 flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100">
                    <span className="text-lg text-green-600">🔗</span>
                  </div>
                </div>
                <div className="ml-3">
                  <h3 className="text-lg font-medium text-gray-900">
                    Share Gantt Chart
                  </h3>
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm text-gray-600">
                  Share this link with clients to view the project timeline:
                </p>
                <div className="mt-3">
                  <input
                    type="text"
                    value={shareLink}
                    readOnly
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowShareModal(false)}
                  className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
                >
                  Close
                </button>
                <button
                  onClick={copyShareLink}
                  className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Copy Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
