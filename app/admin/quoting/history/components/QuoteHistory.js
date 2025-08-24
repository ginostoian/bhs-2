"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Search,
  Filter,
  RefreshCw,
  Eye,
  Edit,
  Trash2,
  Download,
  Copy,
  MoreHorizontal,
} from "lucide-react";
import toast from "react-hot-toast";

export default function QuoteHistory() {
  const [quotes, setQuotes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [projectTypeFilter, setProjectTypeFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    loadQuotes();
  }, [currentPage, statusFilter, projectTypeFilter]);

  const loadQuotes = async () => {
    setIsLoading(true);
    try {
      // Build query parameters
      const params = new URLSearchParams();
      if (statusFilter !== "all") params.append("status", statusFilter);
      if (projectTypeFilter !== "all")
        params.append("projectType", projectTypeFilter);
      params.append("page", currentPage.toString());
      params.append("limit", "50"); // Load more quotes per page

      // Fetch quotes from database API
      const response = await fetch(`/api/admin/quoting?${params.toString()}`);

      if (!response.ok) {
        throw new Error("Failed to fetch quotes from database");
      }

      const result = await response.json();

      if (result.success) {
        setQuotes(result.quotes);
        setTotalPages(result.pagination.pages);
      } else {
        throw new Error(result.error || "Failed to load quotes");
      }
    } catch (error) {
      console.error("Error loading quotes:", error);
      toast.error("Failed to load quotes");

      // Fallback to empty quotes array
      setQuotes([]);
      setTotalPages(1);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteQuote = async (quoteId) => {
    if (
      confirm(
        "Are you sure you want to delete this quote? This action cannot be undone.",
      )
    ) {
      try {
        // Delete from database via API
        const response = await fetch(`/api/admin/quoting/${quoteId}`, {
          method: "DELETE",
        });

        if (!response.ok) {
          throw new Error("Failed to delete quote from database");
        }

        const result = await response.json();
        if (!result.success) {
          throw new Error(result.error || "Failed to delete quote");
        }

        // Remove from local state
        const updatedQuotes = quotes.filter((quote) => quote._id !== quoteId);
        setQuotes(updatedQuotes);

        toast.success("Quote deleted successfully");
      } catch (error) {
        console.error("Error deleting quote:", error);
        toast.error("Failed to delete quote");
      }
    }
  };

  const copyShareLink = async (quoteId) => {
    try {
      const shareLink = `${window.location.origin}/quotes/${quoteId}`;
      await navigator.clipboard.writeText(shareLink);
      toast.success("Share link copied to clipboard!");
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "sent":
        return "bg-blue-100 text-blue-800";
      case "won":
        return "bg-green-100 text-green-800";
      case "lost":
        return "bg-red-100 text-red-800";
      case "expired":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredQuotes = quotes.filter((quote) => {
    const matchesSearch =
      quote.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quote.quoteNumber?.includes(searchTerm);

    return matchesSearch;
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <RefreshCw className="mx-auto h-8 w-8 animate-spin text-gray-400" />
          <p className="mt-2 text-sm text-gray-500">Loading quotes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Quote History</h1>
          <p className="text-gray-600">View and manage all generated quotes</p>
        </div>
        <Link
          href="/admin/quoting/create"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create New Quote
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div className="md:col-span-2">
            <label htmlFor="search" className="sr-only">
              Search quotes
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                id="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="Search quotes by title, client, or quote number..."
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <label htmlFor="status-filter" className="sr-only">
              Filter by status
            </label>
            <select
              id="status-filter"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Draft</option>
              <option value="sent">Sent</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
              <option value="expired">Expired</option>
            </select>
          </div>

          {/* Project Type Filter */}
          <div>
            <label htmlFor="project-type-filter" className="sr-only">
              Filter by project type
            </label>
            <select
              id="project-type-filter"
              value={projectTypeFilter}
              onChange={(e) => setProjectTypeFilter(e.target.value)}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
            >
              <option value="all">All Project Types</option>
              <option value="bathroom-renovation">Bathroom Renovation</option>
              <option value="kitchen-renovation">Kitchen Renovation</option>
              <option value="electrical-rewiring">Electrical Rewiring</option>
              <option value="boiler-installation">Boiler Installation</option>
              <option value="full-home-renovation">Full Home Renovation</option>
              <option value="home-extension">Home Extension</option>
              <option value="loft-conversion">Loft Conversion</option>
              <option value="garden-work">Garden Work</option>
              <option value="custom">Custom Project</option>
            </select>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={loadQuotes}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Quotes Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Quote
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Project Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Created
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {filteredQuotes.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center">
                    <div className="text-gray-500">
                      <p className="text-sm">No quotes found</p>
                      <p className="mt-1 text-xs">
                        {searchTerm ||
                        statusFilter !== "all" ||
                        projectTypeFilter !== "all"
                          ? "Try adjusting your filters or search terms"
                          : "Get started by creating your first quote"}
                      </p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredQuotes.map((quote) => (
                  <tr key={quote._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {quote.title || "Untitled Project"}
                        </div>
                        <div className="text-sm text-gray-500">
                          #{quote.quoteNumber}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {quote.client?.name || "N/A"}
                      </div>
                      <div className="text-sm text-gray-500">
                        {quote.client?.email || "N/A"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {quote.projectType
                          ?.replace(/-/g, " ")
                          .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ${getStatusColor(
                          quote.status,
                        )}`}
                      >
                        {quote.status?.charAt(0).toUpperCase() +
                          quote.status?.slice(1) || "Draft"}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {quote.costBreakdown?.total
                          ? formatCurrency(quote.costBreakdown.total)
                          : quote.total
                            ? formatCurrency(quote.total)
                            : "N/A"}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(quote.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/quoting/${quote._id}/preview`}
                          className="text-blue-600 hover:text-blue-900"
                          title="View Quote"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/quoting/${quote._id}/edit`}
                          className="text-green-600 hover:text-green-900"
                          title="Edit Quote"
                        >
                          <Edit className="h-4 w-4" />
                        </Link>
                        <Link
                          href={`/admin/quoting/${quote._id}/pdf`}
                          className="text-purple-600 hover:text-purple-900"
                          title="Download PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Link>
                        <button
                          onClick={() => copyShareLink(quote._id)}
                          className="text-gray-600 hover:text-gray-900"
                          title="Copy Share Link"
                        >
                          <Copy className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteQuote(quote._id)}
                          className="text-red-600 hover:text-red-900"
                          title="Delete Quote"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            <span>
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
