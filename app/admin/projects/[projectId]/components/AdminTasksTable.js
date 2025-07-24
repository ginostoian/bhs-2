"use client";

import { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import AdminTaskModal from "./AdminTaskModal";
import AdminTaskDetailModal from "./AdminTaskDetailModal";
import Modal from "@/components/Modal";

/**
 * Admin Tasks Table Component
 * Main admin task management interface with drag and drop reordering
 */
export default function AdminTasksTable({ projectId, onTasksUpdate }) {
  const [tasks, setTasks] = useState([]);
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showTaskDetailModal, setShowTaskDetailModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    taskId: null,
    taskName: "",
  });
  const [errorModal, setErrorModal] = useState({
    isOpen: false,
    message: "",
  });

  // Load data on component mount
  useEffect(() => {
    loadData();
  }, [projectId]);

  const loadData = async () => {
    try {
      setLoading(true);

      // Load tasks and admins in parallel
      const [tasksRes, adminsRes] = await Promise.all([
        fetch(`/api/projects/${projectId}/admin-tasks`),
        fetch("/api/admin/users"),
      ]);

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setTasks(tasksData.tasks || []);
      }

      if (adminsRes.ok) {
        const adminsData = await adminsRes.json();
        setAdmins(adminsData.admins || []);
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
      const response = await fetch(`/api/admin-tasks/${taskId}`, {
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

  // Handle admin assignment
  const handleAdminChange = async (taskId, adminId) => {
    try {
      const response = await fetch(`/api/admin-tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ assignedTo: adminId || null }),
      });

      if (response.ok) {
        // Update local state
        setTasks((prev) =>
          prev.map((task) =>
            task.id === taskId
              ? {
                  ...task,
                  assignedTo: admins.find((a) => a.id === adminId) || null,
                }
              : task,
          ),
        );
      }
    } catch (error) {
      console.error("Error updating task assignment:", error);
    }
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

    // Notify parent component
    if (onTasksUpdate) {
      onTasksUpdate();
    }
  };

  // Handle task edit
  const handleTaskEdit = (task) => {
    setEditingTask(task);
    setShowAddTaskModal(true);
  };

  // Handle task modal close
  const handleTaskModalClose = () => {
    setShowAddTaskModal(false);
    setEditingTask(null);
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

  // Handle admin task deletion
  const handleTaskDelete = async (taskId) => {
    setDeleteModal({
      isOpen: true,
      taskId: taskId,
      taskName: tasks.find((task) => task.id === taskId)?.name || "",
    });
  };

  // Handle actual admin task deletion
  const performTaskDelete = async () => {
    try {
      const response = await fetch(`/api/admin-tasks/${deleteModal.taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        // Remove task from local state
        setTasks((prev) =>
          prev.filter((task) => task.id !== deleteModal.taskId),
        );

        // Notify parent component
        if (onTasksUpdate) {
          onTasksUpdate();
        }

        setDeleteModal({ isOpen: false, taskId: null, taskName: "" });
      } else {
        const error = await response.json();
        throw new Error(error.error || "Failed to delete admin task");
      }
    } catch (error) {
      console.error("Error deleting admin task:", error);
      setErrorModal({
        isOpen: true,
        message: "Failed to delete admin task: " + error.message,
      });
    }
  };

  // Handle drag and drop reordering
  const handleDragEnd = async (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    // Only allow reordering within the same list
    if (source.droppableId !== destination.droppableId) {
      return;
    }

    const items = Array.from(tasks);
    const [reorderedItem] = items.splice(source.index, 1);
    items.splice(destination.index, 0, reorderedItem);

    // Update local state immediately for better UX
    setTasks(items);

    // Update order in database
    try {
      const response = await fetch(
        `/api/projects/${projectId}/admin-tasks/reorder`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            tasks: items.map((item, index) => ({
              id: item.id,
              order: index + 1,
            })),
          }),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to reorder tasks");
      }

      // Update local state with new order
      const updatedItems = items.map((item, index) => ({
        ...item,
        order: index + 1,
      }));

      setTasks(updatedItems);
    } catch (error) {
      console.error("Error reordering tasks:", error);
      // Revert to original state on error
      loadData();
    }
  };

  // Calculate incomplete tasks count
  const incompleteTasksCount = tasks.filter(
    (task) => task.status !== "Done",
  ).length;

  if (loading) {
    return (
      <div className="py-12 text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Loading admin tasks...</p>
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Admin Tasks</h2>
          <p className="mt-1 text-sm text-gray-600">
            Tasks for office staff - drag and drop to reorder
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-x-4 sm:space-y-0">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{incompleteTasksCount}</span> tasks
            remaining
          </div>
          <button
            onClick={() => setShowAddTaskModal(true)}
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Add Admin Task
          </button>
        </div>
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        {/* Admin Tasks List */}
        {tasks.length === 0 ? (
          <div className="py-12 text-center">
            <div className="mb-4 text-6xl">👥</div>
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No Admin Tasks Created
            </h3>
            <p className="mb-6 text-gray-600">
              Create your first admin task to start managing office
              responsibilities.
            </p>
            <button
              onClick={() => setShowAddTaskModal(true)}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              Create First Admin Task
            </button>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
            {/* Desktop Table View */}
            <div className="hidden w-full overflow-x-auto lg:block">
              <Droppable droppableId="admin-tasks">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
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
                            Priority
                          </th>
                          <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Due Date
                          </th>
                          <th className="w-28 px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                            Actions
                          </th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-200 bg-white">
                        {tasks.map((task, index) => (
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
                                  snapshot.isDragging ? "bg-blue-50" : ""
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
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full rounded-md border-gray-300 text-xs focus:border-blue-500 focus:ring-blue-500"
                                  >
                                    <option value="Scheduled">Scheduled</option>
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
                                        task.attachments.length > 0 && (
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
                                          {task.description.length > 100
                                            ? `${task.description.substring(0, 100)}...`
                                            : task.description}
                                        </div>
                                      </div>
                                    )}
                                    {task.notes && (
                                      <div className="mt-1 text-xs text-gray-400">
                                        <div className="flex items-start">
                                          <span className="mr-1">📝</span>
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
                                      handleAdminChange(
                                        task.id,
                                        e.target.value || null,
                                      )
                                    }
                                    onClick={(e) => e.stopPropagation()}
                                    className="w-full rounded-md border-gray-300 text-xs focus:border-blue-500 focus:ring-blue-500"
                                  >
                                    <option value="">Unassigned</option>
                                    {admins.map((admin) => (
                                      <option key={admin.id} value={admin.id}>
                                        {admin.name || admin.email}
                                      </option>
                                    ))}
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  {getPriorityBadge(task.priority)}
                                </td>
                                <td className="px-4 py-3 text-sm text-gray-900">
                                  {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        },
                                      )
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
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTaskDelete(task.id);
                                    }}
                                    className="ml-3 text-red-600 hover:text-red-900"
                                  >
                                    Delete
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
              <Droppable droppableId="mobile-admin-tasks">
                {(provided) => (
                  <div
                    {...provided.droppableProps}
                    ref={provided.innerRef}
                    className="space-y-4 p-4"
                  >
                    {tasks.map((task, index) => (
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
                            <div className="mb-3">
                              <div className="mb-2 flex items-start">
                                <div
                                  {...provided.dragHandleProps}
                                  className="mr-2 mt-0.5 flex h-6 w-6 flex-shrink-0 cursor-move items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200"
                                >
                                  <svg
                                    className="h-3 w-3 text-gray-400"
                                    fill="currentColor"
                                    viewBox="0 0 20 20"
                                  >
                                    <path d="M7 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 2zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 7 14zm6-8a2 2 0 1 1-.001-4.001A2 2 0 0 1 13 6zm0 2a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 8zm0 6a2 2 0 1 1 .001 4.001A2 2 0 0 1 13 14z" />
                                  </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="break-words text-sm font-medium text-gray-900">
                                    {task.name}
                                  </h4>
                                  {task.attachments &&
                                    task.attachments.length > 0 && (
                                      <span className="mt-1 inline-block text-blue-600">
                                        📎
                                      </span>
                                    )}
                                </div>
                              </div>
                              {task.description && (
                                <p className="mb-3 line-clamp-2 text-xs text-gray-500">
                                  {task.description}
                                </p>
                              )}
                              <div className="flex flex-wrap items-center gap-2">
                                {getStatusBadge(task.status)}
                                {getPriorityBadge(task.priority)}
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-3 text-xs">
                              <div>
                                <span className="text-gray-500">Assigned:</span>
                                <div className="font-medium">
                                  {task.assignedTo?.name || "Unassigned"}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Due Date:</span>
                                <div className="font-medium">
                                  {task.dueDate
                                    ? new Date(task.dueDate).toLocaleDateString(
                                        "en-GB",
                                        {
                                          day: "2-digit",
                                          month: "short",
                                          year: "numeric",
                                        },
                                      )
                                    : "Not set"}
                                </div>
                              </div>
                              <div>
                                <span className="text-gray-500">Actions:</span>
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
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleTaskDelete(task.id);
                                    }}
                                    className="text-xs text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </div>
                              </div>
                            </div>

                            {task.notes && (
                              <div className="mt-3 border-t border-gray-100 pt-3">
                                <div className="flex items-start">
                                  <span className="mr-2 text-gray-400">📝</span>
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
          </div>
        )}

        {/* Admin Task Modal */}
        <AdminTaskModal
          isOpen={showAddTaskModal}
          onClose={handleTaskModalClose}
          onSave={handleTaskSave}
          task={editingTask}
          projectId={projectId}
          admins={admins}
        />

        {/* Admin Task Detail Modal */}
        <AdminTaskDetailModal
          isOpen={showTaskDetailModal}
          onClose={handleTaskDetailModalClose}
          task={selectedTask}
          admins={admins}
        />

        {/* Delete Confirmation Modal */}
        <Modal
          isOpen={deleteModal.isOpen}
          onClose={() =>
            setDeleteModal({ isOpen: false, taskId: null, taskName: "" })
          }
          onConfirm={performTaskDelete}
          title="Delete Admin Task"
          message={`Are you sure you want to delete "${deleteModal.taskName}"? This action cannot be undone.`}
          confirmText="Delete"
          cancelText="Cancel"
          type="confirm"
        />

        {/* Error Modal */}
        <Modal
          isOpen={errorModal.isOpen}
          onClose={() => setErrorModal({ isOpen: false, message: "" })}
          onConfirm={() => setErrorModal({ isOpen: false, message: "" })}
          title="Error"
          message={errorModal.message}
          confirmText="OK"
          type="alert"
        />
      </DragDropContext>
    </div>
  );
}
