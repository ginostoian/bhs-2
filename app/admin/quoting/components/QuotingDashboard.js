"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import {
  Plus,
  FileText,
  Settings,
  History,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Eye,
  Edit,
  Copy,
} from "lucide-react";
import toast from "react-hot-toast";

export default function QuotingDashboard() {
  const [quotes, setQuotes] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    won: 0,
    pending: 0,
    totalValue: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchQuotes();
  }, []);

  const fetchQuotes = async () => {
    try {
      // Add cache-busting parameter and no-cache headers to ensure fresh data
      const response = await fetch(`/api/admin/quoting?limit=5&t=${Date.now()}`, {
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          console.log("Fetched quotes:", result.quotes); // Debug log
          setQuotes(result.quotes);

          // Calculate stats
          const total = result.pagination.total;
          const won = result.quotes.filter((q) => q.status === "won").length;
          const pending = result.quotes.filter(
            (q) => q.status === "draft" || q.status === "sent" || q.status === "pending",
          ).length;
          const totalValue = result.quotes.reduce(
            (sum, q) => sum + (q.costBreakdown?.total || 0),
            0,
          );

          setStats({
            total,
            won,
            pending,
            totalValue,
          });
        }
      }
    } catch (error) {
      console.error("Error fetching quotes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyShareLink = async (quoteId) => {
    const shareLink = `${window.location.origin}/quotes/${quoteId}`;
    try {
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
    }).format(amount || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Pricing & Quotes</h1>
          <p className="text-gray-600">
            Manage quotes, templates, and rate cards
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link
          href="/admin/quoting/create"
          className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200">
              <Plus className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Create New Quote
              </h3>
              <p className="text-xs text-gray-500">
                Generate a new quote for a client
              </p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/quoting/templates"
          className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200">
              <FileText className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Quote Templates
              </h3>
              <p className="text-xs text-gray-500">Manage project templates</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/quoting/rates"
          className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-200">
              <Settings className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Rate Cards</h3>
              <p className="text-xs text-gray-500">Manage pricing and rates</p>
            </div>
          </div>
        </Link>

        <Link
          href="/admin/quoting/history"
          className="group relative rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-100 transition-colors group-hover:bg-orange-200">
              <History className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">
                Quote History
              </h3>
              <p className="text-xs text-gray-500">View all generated quotes</p>
            </div>
          </div>
        </Link>
      </div>

      {/* Overview Statistics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100">
              <FileText className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-100">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Won Quotes</p>
              <p className="text-2xl font-bold text-gray-900">{stats.won}</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-yellow-100">
              <Calendar className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">
                {stats.pending}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100">
              <DollarSign className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">
                {formatCurrency(stats.totalValue)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">Recent Quotes</h3>
            <div className="flex items-center space-x-3">
              <button
                onClick={fetchQuotes}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Refresh
              </button>
              <Link
                href="/admin/quoting/history"
                className="text-sm text-blue-600 hover:text-blue-800"
              >
                View All
              </Link>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
              <span className="ml-2 text-gray-600">Loading quotes...</span>
            </div>
          </div>
        ) : quotes.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {quotes.map((quote) => (
                <div key={quote._id || quote.id} className="p-6 hover:bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                      <h4 className="text-sm font-medium text-gray-900">
                        {quote.title || "Untitled Quote"}
                      </h4>
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          quote.status === "won"
                            ? "bg-green-100 text-green-800"
                            : quote.status === "sent"
                              ? "bg-blue-100 text-blue-800"
                              : quote.status === "pending"
                              ? "bg-yellow-100 text-yellow-800"
                              : quote.status === "lost"
                              ? "bg-red-100 text-red-800"
                              : quote.status === "expired"
                              ? "bg-orange-100 text-orange-800"
                              : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {(quote.status || "draft").charAt(0).toUpperCase() +
                          (quote.status || "draft").slice(1)}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {quote.client?.name} •{" "}
                      {quote.projectType
                        ?.replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase())}{" "}
                      • {formatCurrency(quote.costBreakdown?.total || 0)}
                    </p>
                    <p className="mt-1 text-xs text-gray-400">
                      Quote #{quote.quoteNumber} • Created{" "}
                      {formatDate(quote.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link
                      href={`/admin/quoting/${quote._id || quote.id}/preview`}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Link>
                    <Link
                      href={`/admin/quoting/${quote._id || quote.id}/edit`}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Edit className="mr-2 h-4 w-4" />
                      Edit
                    </Link>
                    <button
                      onClick={() => copyShareLink(quote._id || quote.id)}
                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-6">
            <div className="py-8 text-center">
              <FileText className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">
                No quotes yet
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get started by creating your first quote.
              </p>
              <div className="mt-6">
                <Link
                  href="/admin/quoting/create"
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Plus className="-ml-1 mr-2 h-4 w-4" />
                  Create Quote
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
