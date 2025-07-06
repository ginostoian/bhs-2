"use client";

import Link from "next/link";

/**
 * Moodboards List Component
 * Displays a list of user's moodboards
 */
export default function MoodboardsList({ moodboards }) {
  // Format date for display
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  // Get status badge styling
  const getStatusBadge = (status) => {
    const styles = {
      draft: "bg-gray-100 text-gray-800",
      shared: "bg-blue-100 text-blue-800",
      approved: "bg-green-100 text-green-800",
      completed: "bg-purple-100 text-purple-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {moodboards.map((moodboard) => (
        <div
          key={moodboard.id}
          className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          {/* Moodboard Header */}
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <Link
                href={`/dashboard/moodboards/${moodboard.id}`}
                className="text-lg font-semibold text-gray-900 hover:text-blue-600 hover:underline"
              >
                {moodboard.name}
              </Link>
              {moodboard.projectType && (
                <p className="text-sm text-gray-500">{moodboard.projectType}</p>
              )}
            </div>
            <div className="flex flex-col items-end space-y-1">
              {getStatusBadge(moodboard.status)}
            </div>
          </div>

          {/* Moodboard Description */}
          {moodboard.description && (
            <div className="mb-4">
              <p className="text-sm text-gray-600">{moodboard.description}</p>
            </div>
          )}

          {/* Moodboard Details */}
          <div className="mb-4 space-y-2 text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              <span>📅</span>
              <span>Updated: {formatDate(moodboard.updatedAt)}</span>
            </div>
            {moodboard.notes && (
              <div className="flex items-start space-x-2">
                <span>📝</span>
                <span className="line-clamp-2">{moodboard.notes}</span>
              </div>
            )}
          </div>

          {/* Action Button */}
          <div className="mt-auto">
            <Link
              href={`/dashboard/moodboards/${moodboard.id}`}
              className="inline-flex w-full items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              View Moodboard
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
