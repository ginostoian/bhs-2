"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function TicketDetailPage() {
  const { ticketId } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newUpdate, setNewUpdate] = useState("");
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchTicket();
  }, [session, status, router, ticketId, fetchTicket]);

  const fetchTicket = async () => {
    try {
      setLoading(true);

      const response = await fetch(`/api/tickets/${ticketId}`);
      if (response.ok) {
        const data = await response.json();
        setTicket(data.ticket);
      } else {
        toast.error("Failed to fetch ticket");
        router.push("/dashboard/tickets");
      }
    } catch (error) {
      console.error("Error fetching ticket:", error);
      toast.error("Failed to fetch ticket");
      router.push("/dashboard/tickets");
    } finally {
      setLoading(false);
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
      case "Emergency":
        return "bg-red-100 text-red-800";
      case "General":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900">
              Ticket not found
            </h1>
            <p className="mt-2 text-gray-600">
              The ticket you&apos;re looking for doesn&apos;t exist.
            </p>
            <Link
              href="/dashboard/tickets"
              className="mt-4 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
            >
              Back to Tickets
            </Link>
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
                <div className="flex items-center space-x-4">
                  <Link
                    href="/dashboard/tickets"
                    className="text-blue-600 hover:text-blue-700"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  </Link>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-900">
                      {ticket.title}
                    </h1>
                    <p className="text-gray-600">{ticket.ticketNumber}</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getCategoryColor(ticket.category)}`}
                >
                  {ticket.category}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getPriorityColor(ticket.priority)}`}
                >
                  {ticket.priority}
                </span>
                <span
                  className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(ticket.status)}`}
                >
                  {ticket.status}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Content */}
            <div className="space-y-6 lg:col-span-2">
              {/* Ticket Details */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Description
                </h2>
                <p className="whitespace-pre-wrap text-gray-700">
                  {ticket.description}
                </p>
              </div>

              {/* Attachments */}
              {ticket.attachments && ticket.attachments.length > 0 && (
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Attachments
                  </h2>
                  <div className="space-y-3">
                    {ticket.attachments.map((attachment, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between rounded-lg bg-gray-50 p-3"
                      >
                        <div className="flex items-center space-x-3">
                          <svg
                            className="h-5 w-5 text-gray-400"
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
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {attachment.fileName}
                            </p>
                            <p className="text-xs text-gray-500">
                              {formatFileSize(attachment.fileSize)}
                            </p>
                          </div>
                        </div>
                        <a
                          href={attachment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          View
                        </a>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Customer Updates */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Updates
                </h2>
                {ticket.customerUpdates && ticket.customerUpdates.length > 0 ? (
                  <div className="space-y-4">
                    {ticket.customerUpdates.map((update, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <p className="text-sm font-medium text-gray-900">
                            {update.createdBy?.name || "Unknown"}
                          </p>
                          <p className="text-sm text-gray-500">
                            {formatDate(update.createdAt)}
                          </p>
                        </div>
                        <p className="text-gray-700">{update.update}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No updates yet.</p>
                )}

                {/* Add Update Form */}
                {ticket.status !== "Closed" && (
                  <div className="mt-6 border-t border-gray-200 pt-6">
                    <h3 className="text-md mb-4 font-semibold text-gray-900">
                      Add Update
                    </h3>
                    <form onSubmit={handleSubmitUpdate} className="space-y-4">
                      <div>
                        <textarea
                          value={newUpdate}
                          onChange={(e) => setNewUpdate(e.target.value)}
                          rows={4}
                          className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-transparent focus:ring-2 focus:ring-blue-500"
                          placeholder="Add an update to your ticket..."
                        />
                      </div>

                      {/* File Upload */}
                      <div>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          onChange={handleFileChange}
                          className="hidden"
                          accept="image/*,.pdf,.doc,.docx,.txt"
                        />
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium leading-4 text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          <svg
                            className="-ml-0.5 mr-2 h-4 w-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                            />
                          </svg>
                          Attach Files
                        </button>
                      </div>

                      {/* Selected Files */}
                      {selectedFiles.length > 0 && (
                        <div className="space-y-2">
                          {selectedFiles.map((file, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between rounded bg-gray-50 p-2"
                            >
                              <span className="text-sm text-gray-700">
                                {file.name}
                              </span>
                              <button
                                type="button"
                                onClick={() => removeFile(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                <svg
                                  className="h-4 w-4"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={
                          updating ||
                          (!newUpdate.trim() && selectedFiles.length === 0)
                        }
                        className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {updating ? "Adding..." : "Add Update"}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Ticket Info */}
              <div className="rounded-lg bg-white p-6 shadow">
                <h2 className="mb-4 text-lg font-semibold text-gray-900">
                  Ticket Information
                </h2>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm font-medium text-gray-500">
                      Created
                    </dt>
                    <dd className="text-sm text-gray-900">
                      {formatDate(ticket.createdAt)}
                    </dd>
                  </div>
                  {ticket.scheduledDate && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Scheduled
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(ticket.scheduledDate)}
                        {ticket.scheduledTime && ` at ${ticket.scheduledTime}`}
                      </dd>
                    </div>
                  )}
                  {ticket.estimatedDuration && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Estimated Duration
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {ticket.estimatedDuration} minutes
                      </dd>
                    </div>
                  )}
                  {ticket.resolvedAt && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Resolved
                      </dt>
                      <dd className="text-sm text-gray-900">
                        {formatDate(ticket.resolvedAt)}
                      </dd>
                    </div>
                  )}
                  {ticket.tags && ticket.tags.length > 0 && (
                    <div>
                      <dt className="text-sm font-medium text-gray-500">
                        Tags
                      </dt>
                      <dd className="text-sm text-gray-900">
                        <div className="mt-1 flex flex-wrap gap-1">
                          {ticket.tags.map((tag, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </dd>
                    </div>
                  )}
                </dl>
              </div>

              {/* Project Link */}
              {ticket.project && (
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Linked Project
                  </h2>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-900">
                      {ticket.project.name}
                    </p>
                    <p className="text-sm text-gray-500">
                      {ticket.project.type}
                    </p>
                    <p className="text-sm text-gray-500">
                      Status: {ticket.project.status}
                    </p>
                  </div>
                </div>
              )}

              {/* Resolution */}
              {ticket.resolution && (
                <div className="rounded-lg bg-white p-6 shadow">
                  <h2 className="mb-4 text-lg font-semibold text-gray-900">
                    Resolution
                  </h2>
                  <p className="whitespace-pre-wrap text-sm text-gray-700">
                    {ticket.resolution}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
