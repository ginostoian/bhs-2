"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

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
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Submitted
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {formatDate(submission.submittedAt)}
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
                  New Purchase
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.isNewPurchase}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Property Type
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.propertyType}
                </p>
              </div>
              {submission.flatFloor && (
                <div>
                  <label className="block text-sm font-medium text-gray-500">
                    Flat Floor
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    {submission.flatFloor}
                  </p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-500">
                  Kitchen Size
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {submission.kitchenSize}
                </p>
              </div>
            </div>
          </div>

          {/* Detailed Information (if available) */}
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
                      Rewiring Needed
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
                  {submission.source}
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
                  {submission.status}
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
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("submittedAt");
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
      const response = await fetch("/api/admin/kitchen-renovations");
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
      const response = await fetch(
        `/api/admin/kitchen-renovations/${submissionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        },
      );

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

  const addNote = async (submissionId, note) => {
    try {
      const response = await fetch(
        `/api/admin/kitchen-renovations/${submissionId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ notes: note }),
        },
      );

      if (response.ok) {
        toast.success("Note added successfully");
        fetchSubmissions(); // Refresh the list
      } else {
        toast.error("Failed to add note");
      }
    } catch (error) {
      console.error("Error adding note:", error);
      toast.error("Failed to add note");
    }
  };

  const deleteSubmission = async (submissionId) => {
    if (!confirm("Are you sure you want to delete this submission?")) return;

    try {
      const response = await fetch(
        `/api/admin/kitchen-renovations/${submissionId}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        toast.success("Submission deleted successfully");
        fetchSubmissions(); // Refresh the list
      } else {
        toast.error("Failed to delete submission");
      }
    } catch (error) {
      console.error("Error deleting submission:", error);
      toast.error("Failed to delete submission");
    }
  };

  // Filter and sort submissions
  const filteredAndSortedSubmissions = submissions
    .filter((submission) => {
      const matchesSearch =
        submission.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        submission.address.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" || submission.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "submittedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  if (!session || session.user.role !== "admin") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Kitchen Renovation Submissions
        </h1>
        <p className="mt-2 text-gray-600">
          Manage and track kitchen renovation form submissions
        </p>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4">
        <div>
          <input
            type="text"
            placeholder="Search by name, email, or address..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          />
        </div>
        <div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Quote Sent">Quote Sent</option>
            <option value="Converted">Converted</option>
            <option value="Lost">Lost</option>
          </select>
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="submittedAt">Sort by Date</option>
            <option value="name">Sort by Name</option>
            <option value="status">Sort by Status</option>
          </select>
        </div>
        <div>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>
      </div>

      {/* Submissions Table */}
      {loading ? (
        <div className="flex h-64 items-center justify-center">
          <div className="text-xl">Loading submissions...</div>
        </div>
      ) : (
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
                    Submitted
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 bg-white">
                {filteredAndSortedSubmissions.map((submission) => (
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
                        <div>
                          <span className="font-medium">Type:</span>{" "}
                          {submission.propertyType}
                        </div>
                        <div>
                          <span className="font-medium">Size:</span>{" "}
                          {submission.kitchenSize}
                        </div>
                        {submission.hasDetailedInfo && (
                          <div className="text-xs text-blue-600">
                            Detailed info available
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <select
                        value={submission.status}
                        onChange={(e) =>
                          updateStatus(submission._id, e.target.value)
                        }
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Quote Sent">Quote Sent</option>
                        <option value="Converted">Converted</option>
                        <option value="Lost">Lost</option>
                      </select>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                      {new Date(submission.submittedAt).toLocaleDateString(
                        "en-GB",
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedSubmission(submission);
                            setIsModalOpen(true);
                          }}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          View
                        </button>
                        <button
                          onClick={() => {
                            const note = prompt("Enter a note:");
                            if (note) {
                              addNote(submission._id, note);
                            }
                          }}
                          className="text-green-600 hover:text-green-900"
                        >
                          Add Note
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
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredAndSortedSubmissions.length === 0 && (
        <div className="mt-8 text-center">
          <div className="text-gray-500">
            {searchTerm || statusFilter !== "all"
              ? "No submissions match your filters"
              : "No kitchen renovation submissions yet"}
          </div>
        </div>
      )}

      {/* Modal */}
      <KitchenRenovationModal
        submission={selectedSubmission}
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedSubmission(null);
        }}
      />
    </div>
  );
};

export default KitchenRenovationsClient;
