"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { CalendarDays, Clock3, FolderKanban, X } from "lucide-react";

function monthRange(month) {
  const year = month.getFullYear();
  const monthIndex = month.getMonth();
  return {
    start: new Date(Date.UTC(year, monthIndex, 1)).toISOString(),
    end: new Date(
      Date.UTC(year, monthIndex + 1, 0, 23, 59, 59, 999),
    ).toISOString(),
  };
}

function initials(name = "") {
  return name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export default function EmployeeAttendanceDrawer({
  employee,
  month,
  onClose,
  onEdit,
}) {
  const [entries, setEntries] = useState([]);
  const [summary, setSummary] = useState({ days: 0, hours: 0, projects: [] });
  const [loading, setLoading] = useState(false);

  const employeeId = employee?._id || employee?.id;

  useEffect(() => {
    if (!employeeId) return;
    const controller = new AbortController();
    const range = monthRange(month);
    const params = new URLSearchParams({
      workerId: employeeId,
      start: range.start,
      end: range.end,
      limit: "100",
    });

    async function load() {
      setLoading(true);
      try {
        const [entriesResponse, summaryResponse] = await Promise.all([
          fetch(`/api/attendance?${params}`, { signal: controller.signal }),
          fetch(
            `/api/attendance/summary?${new URLSearchParams({
              workerId: employeeId,
              start: range.start,
              end: range.end,
            })}`,
            { signal: controller.signal },
          ),
        ]);
        if (!entriesResponse.ok || !summaryResponse.ok) {
          throw new Error("Unable to load employee attendance");
        }
        const [entriesData, summaryData] = await Promise.all([
          entriesResponse.json(),
          summaryResponse.json(),
        ]);
        setEntries(entriesData.items || []);
        setSummary(
          summaryData.summary || { days: 0, hours: 0, projects: [] },
        );
      } catch (error) {
        if (error.name !== "AbortError") console.error(error);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [employeeId, month]);

  return (
    <Transition.Root show={Boolean(employeeId)} as={Fragment}>
      <Dialog as="div" className="relative z-40" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/25" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-8 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-out duration-250"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in duration-200"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-xl bg-white shadow-2xl">
                  <div className="flex h-full flex-col">
                    <div className="border-b border-slate-200 px-5 py-5 sm:px-6">
                      <div className="flex items-center justify-between">
                        <Dialog.Title className="text-lg font-semibold text-slate-950">
                          Employee attendance
                        </Dialog.Title>
                        <button
                          type="button"
                          onClick={onClose}
                          className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                          aria-label="Close employee attendance"
                        >
                          <X className="h-5 w-5" />
                        </button>
                      </div>

                      <div className="mt-5 flex items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-800 text-sm font-semibold text-white">
                          {initials(employee?.name) || "—"}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-950">
                            {employee?.name || "Unknown employee"}
                          </div>
                          <div className="text-sm text-slate-500">
                            {employee?.position || "Employee"}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex-1 overflow-y-auto px-5 py-5 sm:px-6">
                      <div className="mb-5 text-sm font-medium text-slate-700">
                        {month.toLocaleDateString("en-GB", {
                          month: "long",
                          year: "numeric",
                        })}
                      </div>

                      <div className="grid grid-cols-3 divide-x divide-slate-200 rounded-xl border border-slate-200 bg-slate-50">
                        {[
                          [Clock3, "Hours", summary.hours],
                          [CalendarDays, "Days", summary.days],
                          [FolderKanban, "Projects", summary.projects?.length || 0],
                        ].map(([Icon, label, value]) => (
                          <div key={label} className="p-3 sm:p-4">
                            <Icon className="mb-2 h-4 w-4 text-slate-400" />
                            <div className="text-xl font-semibold tabular-nums text-slate-950">
                              {value}
                              {label === "Hours" ? "h" : ""}
                            </div>
                            <div className="text-xs text-slate-500">{label}</div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-7">
                        <h3 className="text-sm font-semibold text-slate-950">
                          Entries this month
                        </h3>
                        <div className="mt-3 divide-y divide-slate-200 border-y border-slate-200">
                          {loading ? (
                            <div className="py-10 text-center text-sm text-slate-500">
                              Loading attendance…
                            </div>
                          ) : entries.length === 0 ? (
                            <div className="py-10 text-center text-sm text-slate-500">
                              No attendance recorded for this month.
                            </div>
                          ) : (
                            entries.map((entry) => (
                              <button
                                key={entry._id || entry.id}
                                type="button"
                                onClick={() => onEdit(entry)}
                                className="grid w-full grid-cols-[92px_1fr_auto] items-center gap-3 py-3 text-left hover:bg-slate-50"
                              >
                                <span className="text-xs font-medium text-slate-600">
                                  {new Date(entry.date).toLocaleDateString(
                                    "en-GB",
                                    { day: "2-digit", month: "short" },
                                  )}
                                </span>
                                <span className="min-w-0">
                                  <span className="block truncate text-sm font-medium text-slate-800">
                                    {entry.project?.name ||
                                      entry.projectName ||
                                      "Project"}
                                  </span>
                                  <span className="block text-xs text-slate-500">
                                    {entry.status}
                                  </span>
                                </span>
                                <span className="text-sm font-semibold tabular-nums text-slate-700">
                                  {Number(entry.hours || 0)}h
                                </span>
                              </button>
                            ))
                          )}
                        </div>
                      </div>

                      {summary.projects?.length ? (
                        <div className="mt-7">
                          <h3 className="text-sm font-semibold text-slate-950">
                            Projects worked
                          </h3>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {summary.projects.map((project) => (
                              <span
                                key={project}
                                className="rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 text-xs text-slate-600"
                              >
                                {project}
                              </span>
                            ))}
                          </div>
                        </div>
                      ) : null}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
