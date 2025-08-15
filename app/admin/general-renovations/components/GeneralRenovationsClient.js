"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Helper functions
const getStatusColor = (status) => {
  const safeStatus = status || "new";
  switch (safeStatus) {
    case "new":
      return "bg-blue-100 text-blue-800";
    case "read":
      return "bg-yellow-100 text-yellow-800";
    case "replied":
      return "bg-green-100 text-green-800";
    case "closed":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-blue-100 text-blue-800";
  }
};

const getStatusDisplay = (status) => {
  const safeStatus = status || "new";
  return safeStatus.charAt(0).toUpperCase() + safeStatus.slice(1);
};

// Modal Component
const GeneralRenovationModal = ({ submission, isOpen, onClose }) => {
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
            General Renovation Details
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

          {/* Project Information */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Project Information
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
                  Number of Rooms
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.numberOfRooms}
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
                  Source
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.source || "Not specified"}
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
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Boiler Work
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.boilerWork || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Rewiring
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.rewiring || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Plastering
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.plastering || "Not specified"}
                    {submission.roomsNeedPlastering &&
                      ` (${submission.roomsNeedPlastering} rooms)`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Painting
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.painting || "Not specified"}
                    {submission.roomsNeedPainting &&
                      ` (${submission.roomsNeedPainting} rooms)`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Flooring
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.flooring || "Not specified"}
                    {submission.roomsNeedFlooring &&
                      ` (${submission.roomsNeedFlooring} rooms)`}
                    {submission.flooringType && ` - ${submission.flooringType}`}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Bathroom Renovation
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.bathroomRenovation || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Kitchen Renovation
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.kitchenRenovation || "Not specified"}
                  </p>
                </div>
              </div>

              {submission.additionalRequests && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-500">
                    Additional Requests
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.additionalRequests}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* System Information */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              System Information
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
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Submitted
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(submission.createdAt)}
                </p>
              </div>
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
                  Confirmation Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                      submission.confirmationEmailSent
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {submission.confirmationEmailSent ? "Sent" : "Not Sent"}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end space-x-3 border-t border-gray-200 p-6">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Close
          </button>
          <button
            onClick={() => {
              window.open(
                `mailto:${submission.email}?subject=Re: Your general renovation enquiry`,
                "_blank",
              );
            }}
            className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Reply via Email
          </button>
        </div>
      </div>
    </div>
  );
};

// Main Component
const GeneralRenovationsClient = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
      const response = await fetch("/api/admin/general-renovations");

      if (!response.ok) {
        throw new Error("Failed to fetch submissions");
      }

      const data = await response.json();
      setSubmissions(data.submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (submissionId, newStatus) => {
    try {
      const response = await fetch("/api/admin/general-renovations", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ submissionId, status: newStatus }),
      });

      if (!response.ok) {
        throw new Error("Failed to update status");
      }

      // Update local state
      setSubmissions((prev) =>
        prev.map((sub) =>
          sub._id === submissionId ? { ...sub, status: newStatus } : sub,
        ),
      );

      toast.success("Status updated successfully");
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

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch =
      sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sub.address.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter = filter === "all" || (sub.status || "new") === filter;

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
          General Renovation Submissions
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Manage and track all general renovation form submissions
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
            {submissions.filter((s) => (s.status || "new") === "new").length}
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
      <div className="mb-6 rounded-lg bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
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
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
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
                const [field, order] = e.target.value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
          </div>
        </div>
      </div>

      {/* Submissions Table */}
      <div className="overflow-hidden rounded-lg bg-white shadow">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Contact Info
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Project Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Source
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Submitted
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wide text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {loading ? (
                <tr>
                  <td colSpan="6" className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-gray-900"></div>
                      <span className="ml-2">Loading...</span>
                    </div>
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
                filteredSubmissions
                  .sort((a, b) => {
                    if (sortBy === "name") {
                      return sortOrder === "asc"
                        ? a.name.localeCompare(b.name)
                        : b.name.localeCompare(a.name);
                    }
                    return sortOrder === "asc"
                      ? new Date(a[sortBy]) - new Date(b[sortBy])
                      : new Date(b[sortBy]) - new Date(a[sortBy]);
                  })
                  .map((submission) => (
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
                            {submission.numberOfRooms} rooms
                          </div>
                          <div className="text-sm text-gray-500">
                            {submission.isNewPurchase}
                          </div>
                        </div>
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        <select
                          value={submission.status || "new"}
                          onChange={(e) =>
                            updateStatus(submission._id, e.target.value)
                          }
                          className={`inline-flex items-center rounded-full border-0 px-2.5 py-0.5 text-xs font-medium focus:ring-2 focus:ring-blue-500 ${getStatusColor(
                            submission.status || "new",
                          )}`}
                        >
                          <option value="new">New</option>
                          <option value="read">Read</option>
                          <option value="replied">Replied</option>
                          <option value="closed">Closed</option>
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
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              submission.hasDetailedInfo
                                ? "bg-purple-100 text-purple-800"
                                : "bg-blue-100 text-blue-800"
                            }`}
                          >
                            {submission.hasDetailedInfo ? "Detailed" : "Basic"}
                          </span>
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
      <GeneralRenovationModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default GeneralRenovationsClient;
