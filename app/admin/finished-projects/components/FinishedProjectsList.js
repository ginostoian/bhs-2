"use client";

import Link from "next/link";

/**
 * Finished Projects List Component
 * Displays all finished projects in a table format
 */
export default function FinishedProjectsList({ projects }) {
  // Helper function to format date
  const formatDate = (date) => {
    if (!date) return "Not set";
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  // Helper function to format budget
  const formatBudget = (budget) => {
    if (!budget) return "Not set";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(budget);
  };

  // Helper function to get type badge
  const getTypeBadge = (type) => {
    const badges = {
      bathroom: "bg-blue-100 text-blue-800",
      kitchen: "bg-green-100 text-green-800",
      extension: "bg-purple-100 text-purple-800",
      renovation: "bg-orange-100 text-orange-800",
    };

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
          badges[type.toLowerCase()] || "bg-gray-100 text-gray-800"
        }`}
      >
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </span>
    );
  };

  if (projects.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">✅</span>
        </div>
        <h3 className="mb-2 text-lg font-medium text-gray-900">
          No Finished Projects
        </h3>
        <p className="text-gray-600">
          No projects have been marked as finished yet. Projects will appear
          here once they are completed.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white px-2 sm:px-4 md:px-6">
        <table className="w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Project
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Client
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Completion Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Duration
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Budget
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Final Progress
              </th>
              <th className="relative px-6 py-3">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {projects.map((project) => {
              // Calculate project duration
              const startDate = new Date(project.startDate);
              const completionDate = new Date(project.completionDate);
              const durationInDays = Math.ceil(
                (completionDate - startDate) / (1000 * 60 * 60 * 24),
              );

              return (
                <tr key={project.id} className="hover:bg-gray-50">
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-green-100">
                        <span className="text-sm font-medium text-green-600">
                          ✅
                        </span>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {project.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          {project.location || "Location not specified"}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {project.user.name || "Unknown"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {project.user.email}
                    </div>
                    <Link
                      href={`/admin/users/${project.user.id}`}
                      className="text-xs text-blue-600 hover:text-blue-900 hover:underline"
                    >
                      View User
                    </Link>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    {getTypeBadge(project.type)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {formatDate(project.completionDate)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {durationInDays} days
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-900">
                    {formatBudget(project.budget)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex h-2 w-16 rounded-full bg-gray-200">
                        <div
                          className="flex h-2 rounded-full bg-green-600"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                      <span className="ml-2 text-sm text-gray-900">
                        {project.progress}%
                      </span>
                    </div>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-right text-sm font-medium">
                    <Link
                      href={`/admin/projects/${project.id}`}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      View Details
                    </Link>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
