"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminTicketDetailPage() {
  const { ticketId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [editing, setEditing] = useState(false);
  const [newUpdate, setNewUpdate] = useState("");
  const [newNote, setNewNote] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [editForm, setEditForm] = useState({});
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/auth/signin");
      return;
    }

    fetchTicket();
    fetchEmployees();
    fetchProjects();
  }, [session, status, router, ticketId]);

  const fetchTicket = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/tickets/${ticketId}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data.ticket);
        setEditForm({
          title: data.ticket.title,
          description: data.ticket.description,
          category: data.ticket.category,
          priority: data.ticket.priority,
          status: data.ticket.status,
          projectId: data.ticket.project?.id || "",
          assignedTo: data.ticket.assignedTo?.id || "",
          scheduledDate: data.ticket.scheduledDate
            ? new Date(data.ticket.scheduledDate).toISOString().split("T")[0]
            : "",
          scheduledTime: data.ticket.scheduledTime || "",
          estimatedDuration: data.ticket.estimatedDuration || "",
          resolution: data.ticket.resolution || "",
          tags: data.ticket.tags?.join(", ") || "",
        });
      } else {
        toast.error("Failed to fetch ticket");
        router.push("/admin/tickets");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast.error("Failed to fetch ticket");
      router.push("/admin/tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await fetch("/api/admin/employees");
      if (response.ok) {
        const data = await response.json();
        setEmployees(data.employees || []);
      }
    } catch (error) {
      console.error("Error fetching employees:", error);
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch("/api/admin/projects");
      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      }
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles((prev) => [...prev, ...files]);
  };

  const removeFile = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveEdit = async () => {
    setEditing(false);
    const loadingToast = toast.loading("Updating ticket...");

    try {
      const response = await fetch(`/api/tickets/${ticketId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(editForm),
      });

      if (response.ok) {
        const data = await response.json();
        setTicket(data.ticket);
        toast.success("Ticket updated successfully", { id: loadingToast });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to update ticket", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error updating ticket:", error);
      toast.error("Failed to update ticket", { id: loadingToast });
    }
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
    if (!newUpdate.trim() && selectedFiles.length === 0) return;

    setUpdating(true);
    const loadingToast = toast.loading("Adding update...");

    try {
      const formData = new FormData();
      formData.append("update", newUpdate.trim());

      selectedFiles.forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch(`/api/tickets/${ticketId}/updates`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setTicket(data.ticket);
        setNewUpdate("");
        setSelectedFiles([]);
        toast.success("Update added successfully", { id: loadingToast });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add update", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error adding update:", error);
      toast.error("Failed to add update", { id: loadingToast });
    } finally {
      setUpdating(false);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const loadingToast = toast.loading("Adding internal note...");

    try {
      const response = await fetch(`/api/tickets/${ticketId}/notes`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ note: newNote.trim() }),
      });

      if (response.ok) {
        const data = await response.json();
        setTicket(data.ticket);
        setNewNote("");
        toast.success("Internal note added successfully", { id: loadingToast });
      } else {
        const error = await response.json();
        toast.error(error.error || "Failed to add note", {
          id: loadingToast,
        });
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note", { id: loadingToast });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "New":
        return "bg-blue-100 text-blue-800";
      case "In Progress":
        return "bg-yellow-100 text-yellow-800";
      case "Waiting for Customer":
        return "bg-orange-100 text-orange-800";
      case "Scheduled":
        return "bg-purple-100 text-purple-800";
      case "Resolved":
        return "bg-green-100 text-green-800";
      case "Closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "Critical":
        return "bg-red-100 text-red-800";
      case "High":
        return "bg-orange-100 text-orange-800";
      case "Medium":
        return "bg-blue-100 text-blue-800";
      case "Low":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case "Warranty":
        return "bg-green-100 text-green-800";
      case "Support":
        return "bg-blue-100 text-blue-800";
      case "General":
        return "bg-gray-100 text-gray-800";
      case "Emergency":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="animate-pulse">
              <div className="mb-4 h-8 w-64 rounded bg-gray-200"></div>
              <div className="mb-8 h-4 w-96 rounded bg-gray-200"></div>
              <div className="h-96 rounded bg-gray-200"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="py-8">
            <div className="text-center">
              <h1 className="mb-4 text-2xl font-bold text-gray-900">
                Ticket Not Found
              </h1>
              <Link
                href="/admin/tickets"
                className="text-blue-600 hover:text-blue-800"
              >
                ← Back to Tickets
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <Link
                  href="/admin/tickets"
                  className="mb-4 inline-flex items-center text-blue-600 hover:text-blue-800"
                >
                  ← Back to Tickets
                </Link>
                <h1 className="text-3xl font-bold text-gray-900">
                  Ticket #{ticket.ticketNumber}
                </h1>
                <p className="mt-2 text-gray-600">{ticket.title}</p>
              </div>
              <div className="flex items-center space-x-3">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(ticket.status)}`}
                >
                  {ticket.status}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getPriorityColor(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getCategoryColor(ticket.category)}`}
                >
                  {ticket.category}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Ticket Details */}
              <div className="rounded-lg bg-white p-6 shadow">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Ticket Details
                  </h2>
                  <button
                    onClick={() => setEditing(!editing)}
                    className="text-sm font-medium text-blue-600 hover:text-blue-800"
                  >
                    {editing ? "Cancel" : "Edit"}
                  </button>
                </div>

                {editing ? (
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Title
                      </label>
                      <input
                        type="text"
                        name="title"
                        value={editForm.title}
                        onChange={handleEditChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        name="description"
                        value={editForm.description}
                        onChange={handleEditChange}
                        rows={4}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Category
                        </label>
                        <select
                          name="category"
                          value={editForm.category}
                          onChange={handleEditChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Warranty">Warranty</option>
                          <option value="Support">Support</option>
                          <option value="General">General</option>
                          <option value="Emergency">Emergency</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Priority
                        </label>
                        <select
                          name="priority"
                          value={editForm.priority}
                          onChange={handleEditChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="Low">Low</option>
                          <option value="Medium">Medium</option>
                          <option value="High">High</option>
                          <option value="Critical">Critical</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Status
                        </label>
                        <select
                          name="status"
                          value={editForm.status}
                          onChange={handleEditChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="New">New</option>
                          <option value="In Progress">In Progress</option>
                          <option value="Waiting for Customer">
                            Waiting for Customer
                          </option>
                          <option value="Scheduled">Scheduled</option>
                          <option value="Resolved">Resolved</option>
                          <option value="Closed">Closed</option>
                        </select>
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Assigned To
                        </label>
                        <select
                          name="assignedTo"
                          value={editForm.assignedTo}
                          onChange={handleEditChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="">Unassigned</option>
                          {employees.map((employee) => (
                            <option key={employee._id} value={employee._id}>
                              {employee.name} - {employee.position}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Link to Project
                      </label>
                      <select
                        name="projectId"
                        value={editForm.projectId}
                        onChange={handleEditChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">No project link</option>
                        {projects.map((project) => (
                          <option key={project._id} value={project._id}>
                            {project.name} ({project.type})
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Scheduled Date
                        </label>
                        <input
                          type="date"
                          name="scheduledDate"
                          value={editForm.scheduledDate}
                          onChange={handleEditChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Scheduled Time
                        </label>
                        <input
                          type="time"
                          name="scheduledTime"
                          value={editForm.scheduledTime}
                          onChange={handleEditChange}
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Estimated Duration (minutes)
                        </label>
                        <input
                          type="number"
                          name="estimatedDuration"
                          value={editForm.estimatedDuration}
                          onChange={handleEditChange}
                          min="15"
                          step="15"
                          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., 60"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Resolution
                      </label>
                      <textarea
                        name="resolution"
                        value={editForm.resolution}
                        onChange={handleEditChange}
                        rows={3}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="How was this ticket resolved?"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-sm font-medium text-gray-700">
                        Tags
                      </label>
                      <input
                        type="text"
                        name="tags"
                        value={editForm.tags}
                        onChange={handleEditChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="e.g., bathroom, plumbing, electrical (comma separated)"
                      />
                    </div>
                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={() => setEditing(false)}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSaveEdit}
                        className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Title
                      </h3>
                      <p className="mt-1 text-sm text-gray-900">
                        {ticket.title}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Description
                      </h3>
                      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                        {ticket.description}
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Category
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {ticket.category}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Priority
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {ticket.priority}
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Status
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {ticket.status}
                        </p>
                      </div>
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Assigned To
                        </h3>
                        {ticket.assignedTo ? (
                          <Link
                            href={`/admin/employees/${ticket.assignedTo.id || ""}`}
                            className="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {ticket.assignedTo.name} (
                            {ticket.assignedTo.position})
                            <svg
                              className="ml-1 h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                              />
                            </svg>
                          </Link>
                        ) : (
                          <p className="mt-1 text-sm text-gray-900">
                            Unassigned
                          </p>
                        )}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-500">
                        Project
                      </h3>
                      {ticket.project ? (
                        <Link
                          href={`/admin/projects/${ticket.project.id || ""}`}
                          className="mt-1 inline-flex items-center text-sm text-blue-600 hover:text-blue-800 hover:underline"
                        >
                          {ticket.project.name} ({ticket.project.type})
                          <svg
                            className="ml-1 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                            />
                          </svg>
                        </Link>
                      ) : (
                        <p className="mt-1 text-sm text-gray-900">
                          No project linked
                        </p>
                      )}
                    </div>
                    {ticket.scheduledDate && (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Scheduled Date
                          </h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {formatDate(ticket.scheduledDate)}
                          </p>
                        </div>
                        <div>
                          <h3 className="text-sm font-medium text-gray-500">
                            Scheduled Time
                          </h3>
                          <p className="mt-1 text-sm text-gray-900">
                            {ticket.scheduledTime || "Not specified"}
                          </p>
                        </div>
                      </div>
                    )}
                    {ticket.estimatedDuration && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Estimated Duration
                        </h3>
                        <p className="mt-1 text-sm text-gray-900">
                          {ticket.estimatedDuration} minutes
                        </p>
                      </div>
                    )}
                    {ticket.resolution && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Resolution
                        </h3>
                        <p className="mt-1 whitespace-pre-wrap text-sm text-gray-900">
                          {ticket.resolution}
                        </p>
                      </div>
                    )}
                    {ticket.tags && ticket.tags.length > 0 && (
                      <div>
                        <h3 className="text-sm font-medium text-gray-500">
                          Tags
                        </h3>
                        <div className="mt-1 flex flex-wrap gap-2">
                          {ticket.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Customer Updates */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Customer Updates
                </h2>
                {ticket.customerUpdates && ticket.customerUpdates.length > 0 ? (
                  <div className="space-y-4">
                    {ticket.customerUpdates.map((update, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-900">
                            {update.update}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(update.createdAt)} by{" "}
                            {update.createdBy?.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No customer updates yet.</p>
                )}
              </div>

              {/* Internal Notes */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">
                  Internal Notes
                </h2>
                {ticket.internalNotes && ticket.internalNotes.length > 0 ? (
                  <div className="mb-4 space-y-4">
                    {ticket.internalNotes.map((note, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-green-500 pl-4"
                      >
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-gray-900">{note.note}</p>
                          <span className="text-xs text-gray-500">
                            {formatDateTime(note.createdAt)} by{" "}
                            {note.createdBy?.name || "Unknown"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="mb-4 text-gray-500">No internal notes yet.</p>
                )}
                <form onSubmit={handleAddNote} className="space-y-3">
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    placeholder="Add an internal note..."
                    rows={3}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="submit"
                    disabled={!newNote.trim()}
                    className="rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Add Note
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Customer Info */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Customer Information
                </h2>
                <div className="space-y-3">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Name</h3>
                    <p className="text-sm text-gray-900">
                      {ticket.user?.name || "Unknown"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="text-sm text-gray-900">
                      {ticket.customerEmail ||
                        ticket.user?.email ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Phone</h3>
                    <p className="text-sm text-gray-900">
                      {ticket.customerPhone ||
                        ticket.user?.phone ||
                        "Not provided"}
                    </p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Created
                    </h3>
                    <p className="text-sm text-gray-900">
                      {formatDateTime(ticket.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Attachments ({ticket.attachments.length})
                  </h2>
                  <div className="space-y-2">
                    {ticket.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded bg-gray-50 p-2"
                      >
                        <div className="flex items-center space-x-2">
                          <svg
                            className="h-4 w-4 text-gray-400"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                            />
                          </svg>
                          <span className="text-sm text-gray-900">
                            {attachment.fileName}
                          </span>
                        </div>
                        <a
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
