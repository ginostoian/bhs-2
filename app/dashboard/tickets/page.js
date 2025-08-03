"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function TicketsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push("/auth/signin");
      return;
    }

    fetchTickets();
  }, [session, status, router]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/tickets");
      if (response.ok) {
        const data = await response.json();
        setTickets(data.tickets || []);
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

  const filteredTickets = tickets.filter((ticket) => {
    const matchesFilter = filter === "all" || ticket.status === filter;
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.ticketNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ticket.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
                <h1 className="text-3xl font-bold text-gray-900">My Tickets</h1>
                <p className="mt-2 text-gray-600">
                  View and manage your support tickets and warranty claims.
                </p>
              </div>
              <div className="mt-4 sm:mt-0">
                <Link
                  href="/dashboard/tickets/new"
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
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
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  New Ticket
                </Link>
              </div>
            </div>
          </div>

          {/* Filters and Search */}
          <div className="mb-6 rounded-lg bg-white p-4 shadow">
            <div className="flex flex-col gap-4 sm:flex-row">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search tickets..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Statuses</option>
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
          ) : filteredTickets.length === 0 ? (
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
                  {searchTerm || filter !== "all"
                    ? "Try adjusting your search or filter criteria."
                    : "Get started by creating a new ticket."}
                </p>
                {!searchTerm && filter === "all" && (
                  <div className="mt-6">
                    <Link
                      href="/dashboard/tickets/new"
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                    >
                      Create your first ticket
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="overflow-hidden bg-white shadow sm:rounded-md">
              <ul className="divide-y divide-gray-200">
                {filteredTickets.map((ticket) => (
                  <li key={ticket._id}>
                    <Link
                      href={`/dashboard/tickets/${ticket._id}`}
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
                                    {ticket.ticketNumber} • Created{" "}
                                    {formatDate(ticket.createdAt)}
                                  </p>
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
                              {ticket.attachments &&
                                ticket.attachments.length > 0 && (
                                  <div className="mt-2 flex items-center text-sm text-gray-500">
                                    <svg
                                      className="mr-1.5 h-4 w-4 flex-shrink-0"
                                      fill="none"
                                      stroke="currentColor"
                                      viewBox="0 0 24 24"
                                    >
                                      <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                                      />
                                    </svg>
                                    {ticket.attachments.length} attachment
                                    {ticket.attachments.length !== 1 ? "s" : ""}
                                  </div>
                                )}
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
          )}
        </div>
      </div>
    </div>
  );
}
