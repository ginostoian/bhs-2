"use client";

import Link from "next/link";

const dateLabel = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "Not set";

export default function ProjectsList({ projects = [], pagination }) {
  const total = pagination?.total ?? projects.length;
  const blockedOnPage = projects.reduce(
    (sum, project) => sum + (project.blockedTasks || 0),
    0,
  );
  const missingFinishOnPage = projects.filter(
    (project) => !project.projectedFinishDate,
  ).length;

  return (
    <div className="space-y-5">
      <div className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-3">
        <div className="bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Ongoing projects
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">{total}</p>
        </div>
        <div className="bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Blocked site tasks on this page
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {blockedOnPage}
          </p>
        </div>
        <div className="bg-white p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
            Finish date missing on this page
          </p>
          <p className="mt-1 text-2xl font-semibold text-slate-900">
            {missingFinishOnPage}
          </p>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
        <table className="w-full min-w-[850px] divide-y divide-slate-200 text-sm">
          <thead className="bg-slate-50 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Client</th>
              <th className="px-4 py-3">Project manager</th>
              <th className="px-4 py-3">Projected finish</th>
              <th className="px-4 py-3">Site tasks</th>
              <th className="px-4 py-3">Blocked</th>
              <th className="px-4 py-3">Go to</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {projects.map((project) => (
              <tr key={project.id} className="hover:bg-slate-50">
                <td className="px-4 py-4">
                  <Link
                    href={`/admin/projects/${project.id}`}
                    className="font-semibold text-slate-900 hover:text-blue-700 hover:underline"
                  >
                    {project.name}
                  </Link>
                  <span className="mt-0.5 block text-xs text-slate-500">
                    {project.type} · {project.location || "Location not set"}
                  </span>
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {project.user?.name || project.user?.email || "Unknown"}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {project.projectManager?.name || "Unassigned"}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {dateLabel(project.projectedFinishDate)}
                </td>
                <td className="px-4 py-4 text-slate-700">
                  {project.completedTasksCount || 0}/{project.tasksCount || 0}{" "}
                  done
                </td>
                <td className="px-4 py-4">
                  <span
                    className={
                      project.blockedTasks
                        ? "font-semibold text-red-700"
                        : "text-slate-500"
                    }
                  >
                    {project.blockedTasks || 0}
                  </span>
                </td>
                <td className="whitespace-nowrap px-4 py-4 text-xs font-medium">
                  <Link
                    href={`/admin/projects/${project.id}?tab=tasks`}
                    className="mr-3 text-blue-700 hover:underline"
                  >
                    Site
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}?tab=admin-tasks`}
                    className="mr-3 text-blue-700 hover:underline"
                  >
                    Admin
                  </Link>
                  <Link
                    href={`/admin/projects/${project.id}?tab=gantt`}
                    className="text-blue-700 hover:underline"
                  >
                    Schedule
                  </Link>
                </td>
              </tr>
            ))}
            {!projects.length && (
              <tr>
                <td
                  colSpan={7}
                  className="px-4 py-12 text-center text-slate-500"
                >
                  No ongoing projects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {pagination?.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 text-sm text-slate-600">
          <span>
            Showing {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, total)} of {total}
          </span>
          <div className="flex items-center gap-2">
            {pagination.page > 1 && (
              <Link
                href={`?page=${pagination.page - 1}`}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50"
              >
                Previous
              </Link>
            )}
            <span>
              Page {pagination.page} of {pagination.totalPages}
            </span>
            {pagination.page < pagination.totalPages && (
              <Link
                href={`?page=${pagination.page + 1}`}
                className="rounded-md border border-slate-300 bg-white px-3 py-2 hover:bg-slate-50"
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
