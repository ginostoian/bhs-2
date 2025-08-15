"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// Modal Component
const BathroomRenovationModal = ({ submission, isOpen, onClose }) => {
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

  const renderCheckboxList = (items, title) => {
    const selectedItems = Object.entries(items || {}).filter(
      ([, value]) => value,
    );
    if (selectedItems.length === 0) return null;

    return (
      <div className="mb-4">
        <h4 className="mb-2 font-semibold text-gray-900">{title}:</h4>
        <div className="space-y-1">
          {selectedItems.map(([key, value]) => (
            <div key={key} className="text-sm text-gray-700">
              ✅{" "}
              {key
                .replace(/([A-Z])/g, " $1")
                .replace(/^./, (str) => str.toUpperCase())}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900">
            Bathroom Renovation Details
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
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Budget
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.budget || "Not specified"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Source
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.source}$
                  {submission.customSource
                    ? ` - ${submission.customSource}`
                    : ""}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          {submission.hasDetailedInfo && (
            <div className="rounded-lg bg-gray-50 p-6">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Detailed Information
              </h3>

              <div className="mb-4 grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Bathroom Size
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.bathroomSize}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Design Service
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.designService}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Start Date
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.startDate || "Not specified"}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Layout
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.layout}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Underfloor Heating
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.underfloorHeating}
                  </p>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-500">
                  Keep Existing
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.keepExisting}
                </p>
              </div>

              {submission.layoutChanges && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">
                    Layout Changes
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.layoutChanges}
                  </p>
                </div>
              )}

              {submission.additionalInfo && (
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-500">
                    Additional Information
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.additionalInfo}
                  </p>
                </div>
              )}

              {/* Checkbox Lists */}
              {renderCheckboxList(submission.electrics, "Electrics")}
              {renderCheckboxList(submission.bathroomSuite, "Bathroom Suite")}
              {renderCheckboxList(submission.tiling, "Tiling")}
              {renderCheckboxList(submission.decorating, "Decorating")}
            </div>
          )}

          {/* Status and Metadata */}
          <div>
            <h3 className="mb-4 text-lg font-medium text-gray-900">
              Status & Metadata
            </h3>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Status
                </label>
                <span
                  className={`mt-1 inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                    submission.status === "new"
                      ? "bg-blue-100 text-blue-800"
                      : submission.status === "read"
                        ? "bg-yellow-100 text-yellow-800"
                        : submission.status === "replied"
                          ? "bg-green-100 text-green-800"
                          : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {submission.status.charAt(0).toUpperCase() +
                    submission.status.slice(1)}
                </span>
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
                  Submitted
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(submission.createdAt)}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Email Status
                </label>
                <div className="mt-1 space-y-1">
                  <p className="text-sm text-gray-900">
                    Confirmation:{" "}
                    {submission.confirmationEmailSent
                      ? "✅ Sent"
                      : "❌ Not sent"}
                  </p>
                  <p className="text-sm text-gray-900">
                    Admin Notification:{" "}
                    {submission.adminNotificationSent
                      ? "✅ Sent"
                      : "❌ Not sent"}
                  </p>
                </div>
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
                `mailto:${submission.email}?subject=Re: Your bathroom renovation enquiry`,
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

const BathroomRenovationsClient = () => {
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
      const response = await fetch("/api/admin/bathroom-renovations");

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
      const response = await fetch(
        `/api/admin/bathroom-renovations/${submissionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

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

  const deleteSubmission = async (submissionId) => {
    if (!confirm("Are you sure you want to delete this submission?")) {
      return;
    }

    try {
      const response = await fetch(
        `/api/admin/bathroom-renovations/${submissionId}`,
        {
          method: "DELETE",
        },
      );

      if (!response.ok) {
        throw new Error("Failed to delete submission");
      }

      // Remove from local state
      setSubmissions((prev) => prev.filter((sub) => sub._id !== submissionId));
      toast.success("Submission deleted successfully");
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    }
  };

  const openModal = (submission) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedSubmission(null);
  };

  // Filter and sort submissions
  const filteredSubmissions = submissions
    .filter((sub) => {
      const matchesFilter = filter === "all" || sub.status === filter;
      const matchesSearch =
        sub.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (sub.budget &&
          sub.budget.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchesFilter && matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const getStatusColor = (status) => {
    switch (status) {
      case "new":
        return "bg-blue-100 text-blue-800";
      case "read":
        return "bg-yellow-100 text-yellow-800";
      case "replied":
        return "bg-green-100 text-green-800";
      case "closed":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl p-6">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Bathroom Renovation Submissions
        </h1>
        <p className="text-gray-600">
          Manage and respond to bathroom renovation form submissions from your
          website.
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
      <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Search */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Search
            </label>
            <input
              type="text"
              placeholder="Search by name, email, or address..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Status
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="read">Read</option>
              <option value="replied">Replied</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="createdAt">Date</option>
              <option value="name">Name</option>
              <option value="email">Email</option>
              <option value="address">Address</option>
            </select>
          </div>

          {/* Sort Order */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Order
            </label>
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4">
        <p className="text-sm text-gray-600">
          Showing {filteredSubmissions.length} of {submissions.length}{" "}
          submissions
        </p>
      </div>

      {/* Submissions List */}
      <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
        {filteredSubmissions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-gray-500">
              No submissions found matching your criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Contact
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Address
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Budget
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Status
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
                {filteredSubmissions.map((submission) => (
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
                      <div className="text-sm text-gray-900">
                        {submission.address}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {submission.budget || "Not specified"}
                      </div>
                      {submission.hasDetailedInfo && (
                        <div className="text-xs text-blue-600">
                          Detailed info provided
                        </div>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <select
                        value={submission.status}
                        onChange={(e) =>
                          updateStatus(submission._id, e.target.value)
                        }
                        className={`rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(submission.status)} border-0 focus:ring-2 focus:ring-blue-500`}
                      >
                        <option value="new">New</option>
                        <option value="read">Read</option>
                        <option value="replied">Replied</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {formatDate(submission.createdAt)}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => openModal(submission)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => deleteSubmission(submission._id)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Refresh Button */}
      <div className="mt-6 text-center">
        <button
          onClick={fetchSubmissions}
          className="rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Refresh Submissions
        </button>
      </div>

      {/* Modal */}
      <BathroomRenovationModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={closeModal}
      />
    </div>
  );
};

export default BathroomRenovationsClient;
