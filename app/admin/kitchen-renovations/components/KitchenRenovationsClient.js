"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Helper functions
const getStatusColor = (status) => {
  const safeStatus = status || "New";
  switch (safeStatus) {
    case "New":
      return "bg-blue-100 text-blue-800";
    case "Contacted":
      return "bg-yellow-100 text-yellow-800";
    case "Quote Sent":
      return "bg-green-100 text-green-800";
    case "Converted":
      return "bg-purple-100 text-purple-800";
    case "Lost":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusDisplay = (status) => {
  const safeStatus = status || "New";
  return safeStatus;
};

// Modal Component
const KitchenRenovationModal = ({ submission, isOpen, onClose }) => {
  if (!isOpen || !submission) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Kitchen Renovation Details
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 transition-colors hover:text-gray-600"
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
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6 p-6">
          {/* Basic Information */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">{submission.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <a
                    href={`mailto:${submission.email}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {submission.email}
                  </a>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Phone
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <a
                    href={`tel:${submission.phone}`}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    {submission.phone}
                  </a>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.address}
                </p>
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Project Details
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Property Type
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.propertyType}
                  {submission.flatFloor && ` (Floor: ${submission.flatFloor})`}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Kitchen Size
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.kitchenSize || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  New Purchase
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.isNewPurchase}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Detailed Information
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.hasDetailedInfo ? "Yes" : "No"}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          {submission.hasDetailedInfo && (
            <div>
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Detailed Information
              </h3>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                {submission.knockDownWall && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Knock Down Wall
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {submission.knockDownWall}
                    </p>
                  </div>
                )}
                {submission.rewiring && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Rewiring
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {submission.rewiring}
                    </p>
                  </div>
                )}
                {submission.kitchenType && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Kitchen Type
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {submission.kitchenType}
                    </p>
                  </div>
                )}
                {submission.additionalRequests && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500">
                      Additional Requests
                    </label>
                    <p className="mt-1 text-sm text-gray-900">
                      {submission.additionalRequests}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Source Information */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Source Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  How They Found Us
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.source || "Not specified"}
                </p>
              </div>
            </div>
          </div>

          {/* Status and Notes */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Status & Notes
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                      submission.status,
                    )}`}
                  >
                    {getStatusDisplay(submission.status)}
                  </span>
                </p>
              </div>
              {submission.notes && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Notes
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.notes}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* System Information */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              System Information
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Submission ID
                </label>
                <p className="mt-1 font-mono text-sm text-gray-900">
                  {submission._id}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Submitted At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(submission.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  IP Address
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.ipAddress || "Not recorded"}
                </p>
              </div>
            </div>
          </div>

          {/* Email Status */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Email Status
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Confirmation Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.confirmationEmailSent ? "Sent" : "Not sent"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Admin Notification
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.adminNotificationSent ? "Sent" : "Not sent"}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              onClick={() => {
                window.open(
                  `mailto:${submission.email}?subject=Re: Kitchen Renovation Enquiry`,
                  "_blank",
                );
              }}
              className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Reply via Email
            </button>
            <button
              onClick={onClose}
              className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Component
const KitchenRenovationsClient = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    if (status === "loading") return;

    if (!session || session.user.role !== "admin") {
      router.push("/auth/signin");
      return;
    }

    fetchSubmissions();
  }, [session, status, router]);

  const fetchSubmissions = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        status: filter,
        search: searchTerm,
        sortBy,
        sortOrder,
      });

      const response = await fetch(`/api/admin/kitchen-renovations?${params}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSubmissions(data.submissions);
        } else {
          toast.error("Failed to fetch submissions");
        }
      } else {
        toast.error("Failed to fetch submissions");
      }
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to fetch submissions");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (submissionId, newStatus) => {
    try {
      const response = await fetch(`/api/admin/kitchen-renovations`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionId, status: newStatus }),
      });

      if (response.ok) {
        toast.success("Status updated successfully");
        fetchSubmissions(); // Refresh the list
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Failed to update status");
    }
  };

  const handleViewDetails = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  // Filter and sort submissions
  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || (sub.status || "New") === filter;

    return matchesSearch && matchesFilter;
  });

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-gray-900"></div>
          <p className="mt-4 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Kitchen Renovation Submissions
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and track all kitchen renovation form submissions
        </p>
      </div>

      {/* Stats Cards */}
      <div className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Total Submissions
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-gray-900">
            {submissions.length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            New Submissions
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-blue-600">
            {submissions.filter((s) => (s.status || "New") === "New").length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            Detailed Submissions
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-purple-600">
            {submissions.filter((s) => s.hasDetailedInfo).length}
          </dd>
        </div>
        <div className="overflow-hidden rounded-lg bg-white px-4 py-5 shadow sm:p-6">
          <dt className="truncate text-sm font-medium text-gray-500">
            This Month
          </dt>
          <dd className="mt-1 text-3xl font-semibold tracking-tight text-green-600">
            {
              submissions.filter(
                (s) =>
                  new Date(s.createdAt).getMonth() === new Date().getMonth() &&
                  new Date(s.createdAt).getFullYear() ===
                    new Date().getFullYear(),
              ).length
            }
          </dd>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-3">
        {/* Search */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-700"
          >
            Search
          </label>
          <div className="relative mt-1 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
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
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              id="search"
              className="block w-full rounded-md border border-gray-300 bg-white py-2 pl-10 pr-3 leading-5 placeholder-gray-500 focus:border-blue-500 focus:placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
              placeholder="Search by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Filter */}
        <div>
          <label
            htmlFor="status-filter"
            className="block text-sm font-medium text-gray-700"
          >
            Status
          </label>
          <select
            id="status-filter"
            name="status-filter"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Quote Sent">Quote Sent</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>

        {/* Sort */}
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-700"
          >
            Sort By
          </label>
          <select
            id="sort"
            name="sort"
            className="mt-1 block w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-base focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            value={`${sortBy}-${sortOrder}`}
            onChange={(e) => {
              const [newSortBy, newSortOrder] = e.target.value.split("-");
              setSortBy(newSortBy);
              setSortOrder(newSortOrder);
            }}
          >
            <option value="createdAt-desc">Newest First</option>
            <option value="createdAt-asc">Oldest First</option>
            <option value="name-asc">Name A-Z</option>
            <option value="name-desc">Name Z-A</option>
            <option value="status-asc">Status A-Z</option>
            <option value="status-desc">Status Z-A</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Project Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    Loading submissions...
                  </td>
                </tr>
              ) : filteredSubmissions.length === 0 ? (
                <tr>
                  <td
                    colSpan="6"
                    className="px-6 py-4 text-center text-gray-500"
                  >
                    {searchTerm || filter !== "all"
                      ? "No submissions match your filters"
                      : "No submissions found"}
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((submission) => (
                  <tr key={submission._id} className="hover:bg-gray-50">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {submission.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.email}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.phone}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">
                          {submission.propertyType}
                          {submission.flatFloor &&
                            ` (Floor: ${submission.flatFloor})`}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.kitchenSize || "Size not specified"}
                        </div>
                        <div className="text-sm text-gray-500">
                          {submission.hasDetailedInfo
                            ? "Detailed info"
                            : "Basic info"}
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <select
                        value={submission.status || "New"}
                        onChange={(e) =>
                          updateStatus(submission._id, e.target.value)
                        }
                        className={`inline-flex items-center rounded-full border-0 px-2.5 py-0.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                          submission.status,
                        )}`}
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quote Sent">Quote Sent</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {submission.source || "Not specified"}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(submission.createdAt).toLocaleDateString(
                        "en-GB",
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleViewDetails(submission)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View Details
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

      {/* Modal */}
      <KitchenRenovationModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default KitchenRenovationsClient;
