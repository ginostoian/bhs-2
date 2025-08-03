"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";

export default function AdminTicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const [filters, setFilters] = useState({
    status: "",
    category: "",
    priority: "",
    assignedTo: "",
    project: "",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/auth/signin");
      return;
    }

    fetchTickets();
    fetchStats();
    fetchEmployees();
    fetchProjects();
  }, [session, status, router, filters, searchTerm, page]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "20",
        ...filters,
      });

      if (searchTerm) {
        params.append("search", searchTerm);
      }

      const response = await fetch(`/api/tickets?${params}`);
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        toast.error("Failed to fetch tickets");
      }
    } catch (error) {
      console.error("Error fetching tickets:", error);
      toast.error("Failed to fetch tickets");
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch("/api/tickets/stats");
      if (response.ok) {
        const data = await response.json();
        setStats(data.overview || {});
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
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

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setPage(1);
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
    });
  };

  const formatDateTime = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Ticket Management
                </h1>
                <p className="mt-2 text-gray-600">
                  Manage support tickets and warranty claims from customers.
                </p>
              </div>
              <div className="mt-4 flex space-x-3 sm:mt-0">
                <Link
                  href="/admin/tickets/stats"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                    />
                  </svg>
                  View Stats
                </Link>
                <Link
                  href="/admin/calendar"
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
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
                  Calendar
                </Link>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
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
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.total || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100">
                    <svg
                      className="h-5 w-5 text-blue-600"
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
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">New</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.new || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-yellow-100">
                    <svg
                      className="h-5 w-5 text-yellow-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13 10V3L4 14h7v7l9-11h-7z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">
                    In Progress
                  </p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.inProgress || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
                    <svg
                      className="h-5 w-5 text-green-600"
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
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Resolved</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.resolved || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
                    <svg
                      className="h-5 w-5 text-gray-600"
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
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Closed</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.closed || 0}
                  </p>
                </div>
              </div>
            </div>
            <div className="rounded-lg bg-white p-4 shadow">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                    <svg
                      className="h-5 w-5 text-red-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Overdue</p>
                  <p className="text-2xl font-semibold text-gray-900">
                    {stats.overdue || 0}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="mb-6 rounded-lg bg-white p-6 shadow">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-6">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Search
                </label>
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={filters.status}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Statuses</option>
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
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={(e) =>
                    handleFilterChange("category", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Categories</option>
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
                  value={filters.priority}
                  onChange={(e) =>
                    handleFilterChange("priority", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Priorities</option>
                  <option value="Critical">Critical</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Assigned To
                </label>
                <select
                  value={filters.assignedTo}
                  onChange={(e) =>
                    handleFilterChange("assignedTo", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Employees</option>
                  {employees.map((employee) => (
                    <option key={employee._id} value={employee._id}>
                      {employee.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">
                  Project
                </label>
                <select
                  value={filters.project}
                  onChange={(e) =>
                    handleFilterChange("project", e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Projects</option>
                  {projects.map((project) => (
                    <option key={project._id} value={project._id}>
                      {project.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Tickets List */}
          {loading ? (
            <div className="rounded-lg bg-white shadow">
              <div className="p-8 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <p className="mt-2 text-gray-600">Loading tickets...</p>
              </div>
            </div>
          ) : tickets.length === 0 ? (
            <div className="rounded-lg bg-white shadow">
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
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
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No tickets found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your search or filter criteria.
                </p>
              </div>
            </div>
          ) : (
            <>
              <div className="overflow-hidden bg-white shadow sm:rounded-md">
                <ul className="divide-y divide-gray-200">
                  {tickets.map((ticket) => (
                    <li key={ticket._id}>
                      <Link
                        href={`/admin/tickets/${ticket._id}`}
                        className="block transition-colors duration-150 hover:bg-gray-50"
                      >
                        <div className="px-4 py-4 sm:px-6">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center">
                              <div className="flex-shrink-0">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                                  <svg
                                    className="h-6 w-6 text-blue-600"
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
                                </div>
                              </div>
                              <div className="ml-4 min-w-0 flex-1">
                                <div className="flex items-center justify-between">
                                  <div>
                                    <p className="truncate text-sm font-medium text-gray-900">
                                      {ticket.title}
                                    </p>
                                    <p className="text-sm text-gray-500">
                                      {ticket.ticketNumber} •{" "}
                                      {ticket.user?.name || "Unknown"} • Created{" "}
                                      {formatDate(ticket.createdAt)}
                                    </p>
                                    {ticket.scheduledDate && (
                                      <p className="text-sm text-gray-500">
                                        Scheduled:{" "}
                                        {formatDateTime(ticket.scheduledDate)}
                                      </p>
                                    )}
                                  </div>
                                  <div className="flex items-center space-x-2">
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getCategoryColor(ticket.category)}`}
                                    >
                                      {ticket.category}
                                    </span>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(ticket.priority)}`}
                                    >
                                      {ticket.priority}
                                    </span>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}
                                    >
                                      {ticket.status}
                                    </span>
                                  </div>
                                </div>
                                {ticket.description && (
                                  <p className="mt-2 line-clamp-2 text-sm text-gray-600">
                                    {ticket.description}
                                  </p>
                                )}
                                <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                  {ticket.assignedTo && (
                                    <span>
                                      Assigned to: {ticket.assignedTo.name}
                                    </span>
                                  )}
                                  {ticket.project && (
                                    <span>Project: {ticket.project.name}</span>
                                  )}
                                  {ticket.attachments &&
                                    ticket.attachments.length > 0 && (
                                      <span>
                                        {ticket.attachments.length} attachment
                                        {ticket.attachments.length !== 1
                                          ? "s"
                                          : ""}
                                      </span>
                                    )}
                                </div>
                              </div>
                            </div>
                            <div className="ml-4 flex-shrink-0">
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
                                  d="M9 5l7 7-7 7"
                                />
                              </svg>
                            </div>
                          </div>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-6 flex items-center justify-between">
                  <div className="flex flex-1 justify-between sm:hidden">
                    <button
                      onClick={() => setPage(Math.max(1, page - 1))}
                      disabled={page === 1}
                      className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Previous
                    </button>
                    <button
                      onClick={() => setPage(Math.min(totalPages, page + 1))}
                      disabled={page === totalPages}
                      className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Next
                    </button>
                  </div>
                  <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm text-gray-700">
                        Showing page <span className="font-medium">{page}</span>{" "}
                        of <span className="font-medium">{totalPages}</span>
                      </p>
                    </div>
                    <div>
                      <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm">
                        <button
                          onClick={() => setPage(Math.max(1, page - 1))}
                          disabled={page === 1}
                          className="relative inline-flex items-center rounded-l-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Previous
                        </button>
                        <button
                          onClick={() =>
                            setPage(Math.min(totalPages, page + 1))
                          }
                          disabled={page === totalPages}
                          className="relative inline-flex items-center rounded-r-md border border-gray-300 bg-white px-2 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Next
                        </button>
                      </nav>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
