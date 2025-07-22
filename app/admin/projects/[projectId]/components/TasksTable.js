"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import SectionModal from "./SectionModal";
import TaskModal from "./TaskModal";
import TaskDetailModal from "./TaskDetailModal";

/**
 * Tasks Table Component
 * Main task management interface with sections, status changes, and employee assignments
 */
export default function TasksTable({ projectId }) {
  const [tasks, setTasks] = useState([]);
  const [sections, setSections] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showSectionModal, setShowSectionModal] = useState(false);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [editingSection, setEditingSection] = useState(null);
  const [defaultSection, setDefaultSection] = useState(null);

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load tasks, sections, and employees in parallel
      const [tasksRes, sectionsRes, employeesRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/tasks`),
        fetch(`/api/projects/${projectId}/sections`),
        fetch("/api/employees"),
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }

      if (sectionsRes.ok) {
        const sectionsData = await sectionsRes.json();
        setSections(sectionsData.sections || []);
      }

      if (employeesRes.ok) {
        const employeesData = await employeesRes.json();
        setEmployees(employeesData.employees || []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

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
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[status] || badges["Scheduled"]}`}
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
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${badges[priority] || badges.medium}`}
      >
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  // Handle status change
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        // Update local state
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId ? { ...task, status: newStatus } : task,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating task status:", error);
    }
  };

  // Handle employee assignment
  const handleEmployeeChange = async (taskId, employeeId) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: employeeId || null }),
      });

      if (response.ok) {
        // Update local state
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? { ...task, assignedTo: employeeId || null }
              : task,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating task assignment:", error);
    }
  };

  // Handle section save
  const handleSectionSave = (savedSection) => {
    if (editingSection) {
      // Update existing section
      setSections((prev) =>
        prev.map((section) =>
          section.id === savedSection.id ? savedSection : section,
        ),
      );
    } else {
      // Add new section
      setSections((prev) => [...prev, savedSection]);
    }
  };

  // Handle section edit
  const handleSectionEdit = (section) => {
    setEditingSection(section);
    setShowSectionModal(true);
  };

  // Handle section modal close
  const handleSectionModalClose = () => {
    setShowSectionModal(false);
    setEditingSection(null);
  };

  // Handle task save
  const handleTaskSave = (savedTask) => {
    if (editingTask) {
      // Update existing task
      setTasks((prev) =>
        prev.map((task) => (task.id === savedTask.id ? savedTask : task)),
      );
    } else {
      // Add new task
      setTasks((prev) => [...prev, savedTask]);
    }
  };

  // Handle task edit
  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowTaskModal(true);
  };

  // Handle task modal close
  const handleTaskModalClose = () => {
    setShowTaskModal(false);
    setEditingTask(null);
    setDefaultSection(null);
  };

  // Handle add new task
  const handleAddTask = (section) => {
    setDefaultSection(section);
    setEditingTask(null);
    setShowTaskModal(true);
  };

  // Handle task detail modal
  const handleTaskClick = (task) => {
    setSelectedTask(task);
    setShowTaskDetailModal(true);
  };

  // Handle task detail modal close
  const handleTaskDetailModalClose = () => {
    setShowTaskDetailModal(false);
    setSelectedTask(null);
  };

  // Handle drag and drop reordering within a section
  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;
    let sourceSectionId = source.droppableId;
    let destSectionId = destination.droppableId;

    // Handle mobile droppable IDs (they have "mobile-" prefix)
    if (sourceSectionId.startsWith("mobile-")) {
      sourceSectionId = sourceSectionId.replace("mobile-", "");
    }
    if (destSectionId.startsWith("mobile-")) {
      destSectionId = destSectionId.replace("mobile-", "");
    }

    // Only allow reordering within the same section
    if (sourceSectionId !== destSectionId) {
      return;
    }

    const sectionTasks = tasksBySection[sourceSectionId] || [];
    if (!sectionTasks.length) return;

    const items = Array.from(sectionTasks);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        const sectionId = task.section?.id || task.section;
        if (sectionId === sourceSectionId) {
          const newTask = items.find((item) => item.id === task.id);
          return newTask || task;
        }
        return task;
      }),
    );

    // Update order in database
    try {
      const response = await fetch(`/api/projects/${projectId}/tasks/reorder`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          tasks: items.map((item, index) => ({
            id: item.id,
            sectionId: sourceSectionId,
            order: index + 1,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to reorder tasks");
      }

      // Update local state with new order
      const updatedItems = items.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          const sectionId = task.section?.id || task.section;
          if (sectionId === sourceSectionId) {
            const newTask = updatedItems.find((item) => item.id === task.id);
            return newTask || task;
          }
          return task;
        }),
      );
    } catch (error) {
      console.error("Error reordering tasks:", error);
      // Revert to original state on error
      loadData();
    }
  };

  // Group tasks by section - handle both populated objects and IDs
  const tasksBySection = tasks.reduce((acc, task) => {
    // Handle both populated section objects and section IDs
    const sectionId = task.section?.id || task.section;
    if (!sectionId) return acc; // Skip tasks without section

    if (!acc[sectionId]) {
      acc[sectionId] = [];
    }
    acc[sectionId].push(task);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading tasks...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Project Tasks</h2>
          <p className="mt-1 text-sm text-gray-600">
            Drag and drop tasks to reorder them within each section
          </p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => setShowSectionModal(true)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Section
          </button>
          <button
            onClick={() => setShowTaskModal(true)}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Task
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Tasks by Section */}
        {sections.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">📋</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Sections Created
            </h3>
            <p className="mb-6 text-gray-600">
              Create your first section to start organizing tasks.
            </p>
            <button
              onClick={() => setShowSectionModal(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Create First Section
            </button>
          </div>
        ) : (
          <div className="w-full space-y-8">
            {sections.map((section) => {
              const sectionTasks = tasksBySection[section.id] || [];
              const completedTasks = sectionTasks.filter(
                (task) => task.status === "Done",
              ).length;
              const progress =
                sectionTasks.length > 0
                  ? Math.round((completedTasks / sectionTasks.length) * 100)
                  : 0;

              return (
                <div
                  key={section.id}
                  className="overflow-hidden rounded-lg border border-gray-200 bg-white"
                >
                  {/* Section Header */}
                  <div className="rounded-t-lg border-b border-gray-200 bg-gray-50 px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex min-w-0 flex-1 items-center space-x-3">
                        <span className="flex-shrink-0 text-lg">
                          {section.icon}
                        </span>
                        <div className="min-w-0 flex-1">
                          <h3 className="truncate text-lg font-medium text-gray-900">
                            {section.name}
                          </h3>
                          {section.description && (
                            <p className="truncate text-sm text-gray-600">
                              {section.description}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex flex-shrink-0 items-center space-x-4">
                        <div className="text-sm text-gray-600">
                          {completedTasks}/{sectionTasks.length} tasks completed
                        </div>
                        <div className="text-sm font-medium text-gray-900">
                          {progress}%
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-500">
                          <span>📋 Drag to reorder</span>
                          <button
                            onClick={() => handleAddTask(section)}
                            className="text-sm font-medium text-blue-600 hover:text-blue-800"
                          >
                            Add Task
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Section Progress Bar */}
                    <div className="mt-3">
                      <div className="h-2 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2 rounded-full transition-all duration-300"
                          style={{
                            width: `${progress}%`,
                            backgroundColor: section.color || "#3B82F6",
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>

                  {/* Tasks Table */}
                  {sectionTasks.length === 0 ? (
                    <div className="px-6 py-8 text-center text-gray-500">
                      No tasks in this section yet.
                    </div>
                  ) : (
                    <>
                      {/* Desktop Table View */}
                      <div className="hidden w-full overflow-x-auto lg:block">
                        <Droppable droppableId={section.id}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                            >
                              <table className="w-full divide-y divide-gray-200">
                                <thead className="bg-gray-50">
                                  <tr>
                                    <th className="w-12 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Order
                                    </th>
                                    <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Status
                                    </th>
                                    <th className="w-64 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Task
                                    </th>
                                    <th className="w-40 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Assigned To
                                    </th>
                                    <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Duration
                                    </th>
                                    <th className="w-20 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Priority
                                    </th>
                                    <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Start Date
                                    </th>
                                    <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                                      Actions
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-200 bg-white">
                                  {sectionTasks.map((task, index) => (
                                    <Draggable
                                      key={task.id}
                                      draggableId={task.id}
                                      index={index}
                                    >
                                      {(provided, snapshot) => (
                                        <tr
                                          ref={provided.innerRef}
                                          {...provided.draggableProps}
                                          className={`cursor-pointer transition-colors hover:bg-gray-50 ${
                                            snapshot.isDragging
                                              ? "bg-blue-50"
                                              : ""
                                          }`}
                                          onClick={() => handleTaskClick(task)}
                                        >
                                          <td className="px-4 py-3">
                                            <div className="flex items-center space-x-2">
                                              <div
                                                {...provided.dragHandleProps}
                                                className="flex h-8 w-8 cursor-move items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                              >
                                                <svg
                                                  className="h-4 w-4 text-gray-400"
                                                  fill="currentColor"
                                                  viewBox="0 0 20 20"
                                                >
                                                  <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
                                                </svg>
                                              </div>
                                              <span className="text-sm font-semibold text-gray-600">
                                                #{task.order || index + 1}
                                              </span>
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <select
                                              value={task.status}
                                              onChange={(e) =>
                                                handleStatusChange(
                                                  task.id,
                                                  e.target.value,
                                                )
                                              }
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                              className="w-full rounded-md border-gray-300 text-xs focus:border-blue-500 focus:ring-blue-500"
                                            >
                                              <option value="Scheduled">
                                                Scheduled
                                              </option>
                                              <option value="Blocked">
                                                Blocked
                                              </option>
                                              <option value="In Progress">
                                                In Progress
                                              </option>
                                              <option value="Done">Done</option>
                                            </select>
                                          </td>
                                          <td className="px-4 py-3">
                                            <div className="min-w-0">
                                              <div className="flex items-center text-sm font-medium text-gray-900">
                                                {task.name}
                                                {task.attachments &&
                                                  task.attachments.length >
                                                    0 && (
                                                    <span
                                                      className="ml-2 text-blue-600"
                                                      title={`${task.attachments.length} attachment(s)`}
                                                    >
                                                      📎
                                                    </span>
                                                  )}
                                              </div>
                                              {task.description && (
                                                <div className="mt-1 text-xs text-gray-500">
                                                  <div className="line-clamp-2">
                                                    {task.description.length >
                                                    100
                                                      ? `${task.description.substring(0, 100)}...`
                                                      : task.description}
                                                  </div>
                                                </div>
                                              )}
                                              {task.notes && (
                                                <div className="mt-1 text-xs text-gray-400">
                                                  <div className="flex items-start">
                                                    <span className="mr-1">
                                                      📝
                                                    </span>
                                                    <span className="line-clamp-1">
                                                      {task.notes.length > 50
                                                        ? `${task.notes.substring(0, 50)}...`
                                                        : task.notes}
                                                    </span>
                                                  </div>
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            <select
                                              value={task.assignedTo?.id || ""}
                                              onChange={(e) =>
                                                handleEmployeeChange(
                                                  task.id,
                                                  e.target.value || null,
                                                )
                                              }
                                              onClick={(e) =>
                                                e.stopPropagation()
                                              }
                                              className="w-full rounded-md border-gray-300 text-xs focus:border-blue-500 focus:ring-blue-500"
                                            >
                                              <option value="">
                                                Unassigned
                                              </option>
                                              {employees.map((employee) => (
                                                <option
                                                  key={employee.id}
                                                  value={employee.id}
                                                >
                                                  {employee.name} (
                                                  {employee.position})
                                                </option>
                                              ))}
                                            </select>
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900">
                                            <div>
                                              <div>
                                                Est: {task.estimatedDuration}{" "}
                                                days
                                              </div>
                                              {task.actualDuration && (
                                                <div className="text-gray-500">
                                                  Act: {task.actualDuration}{" "}
                                                  days
                                                </div>
                                              )}
                                            </div>
                                          </td>
                                          <td className="px-4 py-3">
                                            {getPriorityBadge(task.priority)}
                                          </td>
                                          <td className="px-4 py-3 text-sm text-gray-900">
                                            {task.startDate
                                              ? new Date(
                                                  task.startDate,
                                                ).toLocaleDateString("en-GB", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                                })
                                              : "Not set"}
                                          </td>
                                          <td className="px-4 py-3 text-sm font-medium">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleTaskEdit(task);
                                              }}
                                              className="mr-3 text-blue-600 hover:text-blue-900"
                                            >
                                              Edit
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleTaskClick(task);
                                              }}
                                              className="text-green-600 hover:text-green-900"
                                            >
                                              View
                                            </button>
                                          </td>
                                        </tr>
                                      )}
                                    </Draggable>
                                  ))}
                                  {provided.placeholder}
                                </tbody>
                              </table>
                            </div>
                          )}
                        </Droppable>
                      </div>

                      {/* Mobile Card View */}
                      <div className="space-y-4 lg:hidden">
                        <Droppable droppableId={`mobile-${section.id}`}>
                          {(provided) => (
                            <div
                              {...provided.droppableProps}
                              ref={provided.innerRef}
                              className="space-y-4"
                            >
                              {sectionTasks.map((task, index) => (
                                <Draggable
                                  key={task.id}
                                  draggableId={`mobile-${task.id}`}
                                  index={index}
                                >
                                  {(provided, snapshot) => (
                                    <div
                                      ref={provided.innerRef}
                                      {...provided.draggableProps}
                                      className={`cursor-pointer rounded-lg border border-gray-200 bg-white p-4 transition-colors hover:bg-gray-50 ${
                                        snapshot.isDragging ? "bg-blue-50" : ""
                                      }`}
                                      onClick={() => handleTaskClick(task)}
                                    >
                                      <div className="mb-3 flex items-start justify-between">
                                        <div className="min-w-0 flex-1">
                                          <div className="mb-1 flex items-center">
                                            <div
                                              {...provided.dragHandleProps}
                                              className="mr-2 flex h-6 w-6 cursor-move items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                            >
                                              <svg
                                                className="h-3 w-3 text-gray-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                              >
                                                <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
                                              </svg>
                                            </div>
                                            <h4 className="truncate text-sm font-medium text-gray-900">
                                              {task.name}
                                            </h4>
                                            {task.attachments &&
                                              task.attachments.length > 0 && (
                                                <span className="ml-2 flex-shrink-0 text-blue-600">
                                                  📎
                                                </span>
                                              )}
                                          </div>
                                          {task.description && (
                                            <p className="mb-2 line-clamp-2 text-xs text-gray-500">
                                              {task.description}
                                            </p>
                                          )}
                                        </div>
                                        <div className="ml-3 flex items-center space-x-2">
                                          {getStatusBadge(task.status)}
                                          {getPriorityBadge(task.priority)}
                                        </div>
                                      </div>
                                      <div className="mb-3 flex items-start justify-between">
                                        <div className="min-w-0 flex-1">
                                          <div className="mb-1 flex items-center">
                                            <h4 className="truncate text-sm font-medium text-gray-900">
                                              {task.name}
                                            </h4>
                                            {task.attachments &&
                                              task.attachments.length > 0 && (
                                                <span className="ml-2 flex-shrink-0 text-blue-600">
                                                  📎
                                                </span>
                                              )}
                                          </div>
                                          {task.description && (
                                            <p className="mb-2 line-clamp-2 text-xs text-gray-500">
                                              {task.description}
                                            </p>
                                          )}
                                        </div>
                                        <div className="ml-3 flex items-center space-x-2">
                                          {getStatusBadge(task.status)}
                                          {getPriorityBadge(task.priority)}
                                        </div>
                                      </div>

                                      <div className="grid grid-cols-2 gap-3 text-xs">
                                        <div>
                                          <span className="text-gray-500">
                                            Assigned:
                                          </span>
                                          <div className="font-medium">
                                            {task.assignedTo?.name ||
                                              "Unassigned"}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">
                                            Duration:
                                          </span>
                                          <div className="font-medium">
                                            Est: {task.estimatedDuration} days
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">
                                            Start Date:
                                          </span>
                                          <div className="font-medium">
                                            {task.startDate
                                              ? new Date(
                                                  task.startDate,
                                                ).toLocaleDateString("en-GB", {
                                                  day: "2-digit",
                                                  month: "short",
                                                  year: "numeric",
                                                })
                                              : "Not set"}
                                          </div>
                                        </div>
                                        <div>
                                          <span className="text-gray-500">
                                            Actions:
                                          </span>
                                          <div className="flex space-x-2">
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleTaskEdit(task);
                                              }}
                                              className="text-xs text-blue-600 hover:text-blue-900"
                                            >
                                              Edit
                                            </button>
                                            <button
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleTaskClick(task);
                                              }}
                                              className="text-xs text-green-600 hover:text-green-900"
                                            >
                                              View
                                            </button>
                                          </div>
                                        </div>
                                      </div>

                                      {task.notes && (
                                        <div className="mt-3 border-t border-gray-100 pt-3">
                                          <div className="flex items-start">
                                            <span className="mr-2 text-gray-400">
                                              📝
                                            </span>
                                            <p className="line-clamp-2 text-xs text-gray-600">
                                              {task.notes}
                                            </p>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </Draggable>
                              ))}
                              {provided.placeholder}
                            </div>
                          )}
                        </Droppable>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Task Modal */}
        <TaskModal
          isOpen={showTaskModal}
          onClose={handleTaskModalClose}
          onSave={handleTaskSave}
          task={editingTask}
          projectId={projectId}
          sections={sections}
          employees={employees}
          defaultSection={defaultSection}
        />

        {/* Task Detail Modal */}
        <TaskDetailModal
          isOpen={showTaskDetailModal}
          onClose={handleTaskDetailModalClose}
          task={selectedTask}
          employees={employees}
          sections={sections}
        />

        {/* Section Modal */}
        <SectionModal
          isOpen={showSectionModal}
          onClose={handleSectionModalClose}
          onSave={handleSectionSave}
          section={editingSection}
          projectId={projectId}
        />
      </DragDropContext>
    </div>
  );
}
