"use client";

import Link from "next/link";
import { Building2 } from "lucide-react";
import {
  Badge,
  EmptyState,
  buttonClass,
  formatMoney,
  formatShortDate,
  relativeDays,
} from "@/components/admin/ui";
import { DataTable } from "@/components/admin/interactive";

const isLate = (p) =>
  p.projectedFinishDate && new Date(p.projectedFinishDate) < new Date();

export default function ProjectsList({ projects = [], pagination }) {
  const total = pagination?.total ?? projects.length;

  return (
    <section className="rounded-lg border border-[#D8D2C6] bg-white">
      <DataTable
        rows={projects}
        getRowKey={(p) => p.id}
        rowHref={(p) => `/admin/projects/${p.id}`}
        empty={
          <EmptyState
            icon={Building2}
            title="No projects on site"
            description="Projects appear here once they're created for a client."
          />
        }
        columns={[
          {
            header: "Project",
            key: "name",
            primary: true,
            render: (p) => (
              <div className="min-w-0">
                <div className="truncate font-medium">{p.name}</div>
                <div className="truncate text-xs text-[#7A807B]">
                  {[p.type, p.location].filter(Boolean).join(" · ") ||
                    "Location not set"}
                </div>
              </div>
            ),
          },
          {
            header: "Client",
            sortValue: (p) => p.user?.name || "",
            render: (p) =>
              p.user?.id ? (
                <Link
                  href={`/admin/users/${p.user.id}`}
                  className="hover:underline"
                >
                  {p.user.name || p.user.email}
                </Link>
              ) : (
                <span className="text-[#B42318]">
                  {p.user?.name || "Unknown"}
                </span>
              ),
          },
          {
            header: "Manager",
            sortValue: (p) => p.projectManager?.name || "",
            hideOnMobile: true,
            render: (p) =>
              p.projectManager?.name || (
                <span className="text-[#A3A8A4]">Unassigned</span>
              ),
          },
          {
            header: "Finish",
            key: "projectedFinishDate",
            render: (p) =>
              p.projectedFinishDate ? (
                <span className="whitespace-nowrap">
                  {formatShortDate(p.projectedFinishDate)}
                  {isLate(p) ? (
                    <Badge tone="warn" className="ml-1.5">
                      {relativeDays(p.projectedFinishDate)}
                    </Badge>
                  ) : null}
                </span>
              ) : (
                <Badge tone="neutral">Not set</Badge>
              ),
          },
          {
            header: "Site tasks",
            sortValue: (p) =>
              p.tasksCount ? (p.completedTasksCount || 0) / p.tasksCount : 0,
            render: (p) => {
              const pct = p.tasksCount
                ? Math.round(
                    ((p.completedTasksCount || 0) / p.tasksCount) * 100,
                  )
                : 0;
              return (
                <div className="w-32">
                  <div className="flex justify-between text-xs">
                    <span>
                      {p.completedTasksCount || 0}/{p.tasksCount || 0} done
                    </span>
                    {p.blockedTasks ? (
                      <span className="font-semibold text-[#B42318]">
                        {p.blockedTasks} blocked
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-[#EDE9E0]">
                    <div
                      className="h-full rounded-full bg-[#4D5B4B]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            },
          },
          {
            header: "Collected",
            align: "right",
            sortValue: (p) => p.money?.collected || 0,
            render: (p) =>
              p.money?.contract ? (
                <div className="whitespace-nowrap text-right">
                  <div className="tabular-nums">
                    {formatMoney(p.money.collected)}
                  </div>
                  <div className="text-xs text-[#7A807B]">
                    of {formatMoney(p.money.contract)}
                  </div>
                  {p.money.overdue > 0 && (
                    <div className="text-xs font-semibold text-[#B42318]">
                      {formatMoney(p.money.overdue)} overdue
                    </div>
                  )}
                </div>
              ) : (
                <span className="text-xs text-[#A3A8A4]">No schedule</span>
              ),
          },
          {
            header: "Open",
            sortable: false,
            hideOnMobile: true,
            render: (p) => (
              <div className="flex justify-end gap-1 text-xs">
                <Link
                  href={`/admin/projects/${p.id}?tab=tasks`}
                  className={buttonClass("ghost", "sm")}
                >
                  Tasks
                </Link>
                <Link
                  href={`/admin/projects/${p.id}?tab=gantt`}
                  className={buttonClass("ghost", "sm")}
                >
                  Schedule
                </Link>
              </div>
            ),
          },
        ]}
      />
      {pagination?.totalPages > 1 && (
        <div className="flex items-center justify-between gap-3 border-t border-[#EDE9E0] px-4 py-3 text-sm">
          <span className="text-[#7A807B]">
            {(pagination.page - 1) * pagination.limit + 1}–
            {Math.min(pagination.page * pagination.limit, total)} of {total}
          </span>
          <div className="flex gap-2">
            {pagination.page > 1 && (
              <Link
                href={`?page=${pagination.page - 1}`}
                className={buttonClass("secondary", "sm")}
              >
                Previous
              </Link>
            )}
            {pagination.page < pagination.totalPages && (
              <Link
                href={`?page=${pagination.page + 1}`}
                className={buttonClass("secondary", "sm")}
              >
                Next
              </Link>
            )}
          </div>
        </div>
      )}
    </section>
  );
}
