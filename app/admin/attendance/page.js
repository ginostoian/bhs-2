"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Clock3,
  FileBarChart2,
  List,
  Pencil,
  Plus,
  Search,
  Trash2,
  Users,
} from "lucide-react";
import toast from "react-hot-toast";
import Modal from "@/components/Modal";
import AttendanceCalendar from "./components/AttendanceCalendar";
import AttendanceReports from "./components/AttendanceReports";
import EmployeeAttendanceDrawer from "./components/EmployeeAttendanceDrawer";
import TimeEntryDialog from "./components/TimeEntryDialog";

const TABS = [
  { id: "calendar", label: "Calendar", icon: CalendarDays },
  { id: "entries", label: "Entries", icon: List },
  { id: "reports", label: "Reports", icon: FileBarChart2 },
];

const STATUS_STYLES = {
  Present: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  Sick: "bg-red-50 text-red-700 ring-red-600/20",
  Holiday: "bg-amber-50 text-amber-700 ring-amber-600/20",
  Unavailable: "bg-slate-100 text-slate-600 ring-slate-500/20",
};

function startOfMonth(date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function monthRange(date) {
  const year = date.getFullYear();
  const month = date.getMonth();
  return {
    start: new Date(Date.UTC(year, month, 1)).toISOString(),
    end: new Date(
      Date.UTC(year, month + 1, 0, 23, 59, 59, 999),
    ).toISOString(),
  };
}

function monthInputValue(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function entryDateKey(value) {
  return new Date(value).toISOString().slice(0, 10);
}

function projectLabel(entry) {
  return entry.project?.name || entry.projectName || "Unassigned project";
}

function employeeId(employee) {
  return employee?._id || employee?.id || "";
}

export default function AttendanceAdminPage() {
  const [activeTab, setActiveTab] = useState("calendar");
  const [month, setMonth] = useState(() => startOfMonth(new Date()));
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [entries, setEntries] = useState([]);
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workerFilter, setWorkerFilter] = useState("");
  const [projectFilter, setProjectFilter] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [entryDialog, setEntryDialog] = useState({
    open: false,
    entry: null,
    date: new Date(),
  });
  const [employeeDrawer, setEmployeeDrawer] = useState(null);
  const [deleteEntry, setDeleteEntry] = useState(null);

  const range = useMemo(() => monthRange(month), [month]);

  const loadEntries = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({
      start: range.start,
      end: range.end,
      limit: "1000",
    });
    if (workerFilter) params.set("workerId", workerFilter);
    if (projectFilter) params.set("projectId", projectFilter);

    try {
      const response = await fetch(`/api/attendance?${params}`);
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Unable to load attendance");
      }
      const nextEntries = data.items || [];
      setEntries(nextEntries);

      setWorkers((current) => {
        const map = new Map(
          current.map((worker) => [employeeId(worker), worker]),
        );
        nextEntries.forEach((entry) => {
          const id = employeeId(entry.worker);
          if (id && !map.has(id)) map.set(id, entry.worker);
        });
        return Array.from(map.values()).sort((a, b) =>
          a.name.localeCompare(b.name),
        );
      });
    } catch (requestError) {
      setError(requestError.message || "Unable to load attendance");
    } finally {
      setLoading(false);
    }
  }, [projectFilter, range.end, range.start, workerFilter]);

  useEffect(() => {
    const controller = new AbortController();

    async function loadOptions() {
      try {
        const [workersResponse, projectsResponse] = await Promise.all([
          fetch("/api/workers?active=true", { signal: controller.signal }),
          fetch("/api/admin/projects?status=On%20Going", {
            signal: controller.signal,
          }),
        ]);
        const [workersData, projectsData] = await Promise.all([
          workersResponse.json(),
          projectsResponse.json(),
        ]);
        if (!workersResponse.ok || !projectsResponse.ok) {
          throw new Error("Unable to load employees and projects");
        }
        setWorkers(workersData.workers || []);
        setProjects(
          (projectsData.projects || []).map((project) => ({
            id: project._id || project.id,
            name: project.name,
          })),
        );
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      }
    }

    loadOptions();
    return () => controller.abort();
  }, []);

  useEffect(() => {
    loadEntries();
  }, [loadEntries]);

  const visibleEntries = useMemo(() => {
    const needle = search.trim().toLowerCase();
    if (!needle) return entries;
    return entries.filter((entry) =>
      [
        entry.worker?.name,
        projectLabel(entry),
        entry.status,
        entry.notes,
      ].some((value) => value?.toLowerCase().includes(needle)),
    );
  }, [entries, search]);

  const monthSummary = useMemo(() => {
    const totalHours = entries.reduce(
      (sum, entry) => sum + Number(entry.hours || 0),
      0,
    );
    const activeEmployees = new Set(
      entries.map((entry) => employeeId(entry.worker)).filter(Boolean),
    ).size;
    const statusCounts = entries.reduce((counts, entry) => {
      counts[entry.status] = (counts[entry.status] || 0) + 1;
      return counts;
    }, {});
    const presentRate = entries.length
      ? Math.round(((statusCounts.Present || 0) / entries.length) * 100)
      : 0;

    return { totalHours, activeEmployees, statusCounts, presentRate };
  }, [entries]);

  const selectedDayEntries = useMemo(() => {
    const key = entryDateKey(selectedDate);
    return entries.filter((entry) => entryDateKey(entry.date) === key);
  }, [entries, selectedDate]);

  function changeMonth(offset) {
    setMonth(
      (current) => new Date(current.getFullYear(), current.getMonth() + offset, 1),
    );
  }

  function openCreate(date = selectedDate) {
    setSelectedDate(date);
    setEntryDialog({ open: true, entry: null, date });
  }

  function openEdit(entry) {
    setEntryDialog({
      open: true,
      entry,
      date: new Date(entry.date),
    });
  }

  async function confirmDelete() {
    if (!deleteEntry) return;
    try {
      const response = await fetch(
        `/api/attendance/${deleteEntry._id || deleteEntry.id}`,
        { method: "DELETE" },
      );
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Unable to delete entry");
      toast.success("Attendance entry deleted");
      setDeleteEntry(null);
      await loadEntries();
    } catch (requestError) {
      toast.error(requestError.message || "Unable to delete entry");
    }
  }

  return (
    <div className="mx-auto max-w-[1600px] space-y-5 pb-10">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950">
            Attendance
          </h1>
          <p className="mt-1.5 max-w-2xl text-sm text-slate-600">
            Record employee hours, manage project allocation and review
            attendance across your team.
          </p>
        </div>
        <button
          type="button"
          onClick={() => openCreate(new Date())}
          className="inline-flex items-center justify-center gap-2 rounded-lg bg-emerald-800 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900 focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2"
        >
          <Plus className="h-4 w-4" />
          Log time
        </button>
      </header>

      <nav className="flex gap-6 border-b border-slate-200" aria-label="Attendance views">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setActiveTab(id)}
            className={`relative inline-flex items-center gap-2 px-1 pb-3 pt-1 text-sm font-semibold transition ${
              activeTab === id
                ? "text-emerald-800"
                : "text-slate-500 hover:text-slate-800"
            }`}
          >
            <Icon className="h-4 w-4" />
            {label}
            {activeTab === id ? (
              <span className="absolute inset-x-0 -bottom-px h-0.5 bg-emerald-800" />
            ) : null}
          </button>
        ))}
      </nav>

      <section className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
            aria-label="Previous month"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <input
            type="month"
            value={monthInputValue(month)}
            onChange={(event) => {
              const [year, monthIndex] = event.target.value
                .split("-")
                .map(Number);
              setMonth(new Date(year, monthIndex - 1, 1));
            }}
            className="rounded-lg border-slate-300 bg-white text-sm font-semibold text-slate-800 focus:border-emerald-700 focus:ring-emerald-700"
            aria-label="Attendance month"
          />
          <button
            type="button"
            onClick={() => changeMonth(1)}
            className="rounded-lg border border-slate-300 bg-white p-2.5 text-slate-600 hover:bg-slate-50"
            aria-label="Next month"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 xl:flex">
          <select
            value={workerFilter}
            onChange={(event) => setWorkerFilter(event.target.value)}
            className="min-w-52 rounded-lg border-slate-300 bg-white text-sm text-slate-700 focus:border-emerald-700 focus:ring-emerald-700"
            aria-label="Filter by employee"
          >
            <option value="">All employees</option>
            {workers.map((worker) => (
              <option
                key={employeeId(worker)}
                value={employeeId(worker)}
              >
                {worker.name}
              </option>
            ))}
          </select>
          <select
            value={projectFilter}
            onChange={(event) => setProjectFilter(event.target.value)}
            className="min-w-52 rounded-lg border-slate-300 bg-white text-sm text-slate-700 focus:border-emerald-700 focus:ring-emerald-700"
            aria-label="Filter by project"
          >
            <option value="">All projects</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          {workerFilter || projectFilter ? (
            <button
              type="button"
              onClick={() => {
                setWorkerFilter("");
                setProjectFilter("");
              }}
              className="px-2 text-sm font-medium text-slate-500 underline-offset-4 hover:text-slate-800 hover:underline"
            >
              Clear filters
            </button>
          ) : null}
        </div>
      </section>

      {error ? (
        <div className="flex items-center justify-between rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <span>{error}</span>
          <button
            type="button"
            onClick={loadEntries}
            className="font-semibold underline"
          >
            Retry
          </button>
        </div>
      ) : null}

      {activeTab === "calendar" ? (
        <div className="grid gap-5 2xl:grid-cols-[minmax(0,1fr)_280px]">
          <div className="relative min-w-0">
            {loading ? (
              <div className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white/75 text-sm font-medium text-slate-500 backdrop-blur-[1px]">
                Loading attendance…
              </div>
            ) : null}
            <AttendanceCalendar
              month={month}
              entries={entries}
              selectedDate={selectedDate}
              onSelectDate={setSelectedDate}
              onAddEntry={openCreate}
              onOpenEmployee={setEmployeeDrawer}
            />
          </div>

          <aside className="space-y-5">
            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-baseline justify-between">
                <h2 className="font-semibold text-slate-950">This month</h2>
                <span className="text-xs text-slate-500">
                  {month.toLocaleDateString("en-GB", {
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <dl className="mt-5 space-y-4">
                {[
                  [Clock3, "Total hours", `${monthSummary.totalHours.toLocaleString("en-GB")}h`],
                  [CalendarDays, "Present rate", `${monthSummary.presentRate}%`],
                  [Users, "Active employees", monthSummary.activeEmployees],
                ].map(([Icon, label, value]) => (
                  <div key={label} className="flex items-center gap-3">
                    <Icon className="h-5 w-5 text-slate-500" />
                    <dt className="flex-1 text-sm text-slate-600">{label}</dt>
                    <dd className="text-lg font-semibold tabular-nums text-slate-950">
                      {value}
                    </dd>
                  </div>
                ))}
              </dl>

              <div className="mt-5 border-t border-slate-200 pt-4">
                <h3 className="text-xs font-semibold uppercase tracking-[0.06em] text-slate-500">
                  Status breakdown
                </h3>
                <div className="mt-3 space-y-2.5">
                  {Object.keys(STATUS_STYLES).map((status) => (
                    <div key={status} className="flex items-center gap-2 text-sm">
                      <span
                        className={`h-2 w-2 rounded-full ${
                          status === "Present"
                            ? "bg-emerald-500"
                            : status === "Sick"
                              ? "bg-red-500"
                              : status === "Holiday"
                                ? "bg-amber-500"
                                : "bg-slate-400"
                        }`}
                      />
                      <span className="flex-1 text-slate-600">{status}</span>
                      <span className="font-semibold tabular-nums text-slate-800">
                        {monthSummary.statusCounts[status] || 0}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="rounded-xl border border-slate-200 bg-white p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold text-slate-950">
                    {selectedDate.toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                    })}
                  </h2>
                  <p className="mt-0.5 text-xs text-slate-500">
                    {selectedDayEntries.length} time entr
                    {selectedDayEntries.length === 1 ? "y" : "ies"}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => openCreate(selectedDate)}
                  className="rounded-lg p-2 text-emerald-800 hover:bg-emerald-50"
                  aria-label="Log time on selected date"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-3 divide-y divide-slate-200">
                {selectedDayEntries.length === 0 ? (
                  <p className="py-5 text-sm text-slate-500">
                    No hours recorded on this date.
                  </p>
                ) : (
                  selectedDayEntries.map((entry) => (
                    <button
                      key={entry._id || entry.id}
                      type="button"
                      onClick={() => openEdit(entry)}
                      className="flex w-full items-center gap-3 py-3 text-left hover:bg-slate-50"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-semibold text-slate-800">
                          {entry.worker?.name || "Unknown employee"}
                        </span>
                        <span className="block truncate text-xs text-slate-500">
                          {projectLabel(entry)}
                        </span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums text-slate-700">
                        {Number(entry.hours || 0)}h
                      </span>
                    </button>
                  ))
                )}
              </div>
            </section>
          </aside>
        </div>
      ) : null}

      {activeTab === "entries" ? (
        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="flex flex-col gap-3 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="font-semibold text-slate-950">Time entries</h2>
              <p className="mt-1 text-sm text-slate-500">
                {entries.length} records in this period
              </p>
            </div>
            <label className="relative block sm:w-72">
              <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search employee or project"
                className="w-full rounded-lg border-slate-300 pl-9 text-sm focus:border-emerald-700 focus:ring-emerald-700"
              />
            </label>
          </div>

          {loading ? (
            <div className="py-16 text-center text-sm text-slate-500">
              Loading entries…
            </div>
          ) : visibleEntries.length === 0 ? (
            <div className="py-16 text-center text-sm text-slate-500">
              No attendance entries match this view.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    {["Date", "Employee", "Project", "Status", "Hours", ""].map(
                      (heading, index) => (
                        <th
                          key={`${heading}-${index}`}
                          className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.06em] text-slate-500"
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {visibleEntries.map((entry) => (
                    <tr key={entry._id || entry.id} className="hover:bg-slate-50/70">
                      <td className="whitespace-nowrap px-5 py-4 text-sm text-slate-600">
                        {new Date(entry.date).toLocaleDateString("en-GB", {
                          day: "2-digit",
                          month: "short",
                          year: "numeric",
                        })}
                      </td>
                      <td className="whitespace-nowrap px-5 py-4">
                        <button
                          type="button"
                          onClick={() => setEmployeeDrawer(entry.worker)}
                          className="text-sm font-semibold text-slate-900 hover:text-emerald-800 hover:underline"
                        >
                          {entry.worker?.name || "Unknown employee"}
                        </button>
                      </td>
                      <td className="min-w-56 px-5 py-4 text-sm text-slate-600">
                        {projectLabel(entry)}
                        {entry.projectName && !entry.project ? (
                          <span className="ml-2 text-xs text-slate-400">
                            One-off
                          </span>
                        ) : null}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${STATUS_STYLES[entry.status] || STATUS_STYLES.Unavailable}`}
                        >
                          {entry.status}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm font-semibold tabular-nums text-slate-800">
                        {Number(entry.hours || 0)}h
                      </td>
                      <td className="whitespace-nowrap px-5 py-4 text-right">
                        <button
                          type="button"
                          onClick={() => openEdit(entry)}
                          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-800"
                          aria-label="Edit attendance entry"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setDeleteEntry(entry)}
                          className="rounded-lg p-2 text-slate-400 hover:bg-red-50 hover:text-red-700"
                          aria-label="Delete attendance entry"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}

      {activeTab === "reports" ? (
        <AttendanceReports start={range.start} end={range.end} />
      ) : null}

      <TimeEntryDialog
        open={entryDialog.open}
        onClose={() =>
          setEntryDialog({ open: false, entry: null, date: selectedDate })
        }
        onSaved={loadEntries}
        entry={entryDialog.entry}
        date={entryDialog.date}
        workers={workers}
        projects={projects}
      />

      <EmployeeAttendanceDrawer
        employee={employeeDrawer}
        month={month}
        onClose={() => setEmployeeDrawer(null)}
        onEdit={(entry) => {
          setEmployeeDrawer(null);
          openEdit(entry);
        }}
      />

      <Modal
        isOpen={Boolean(deleteEntry)}
        onClose={() => setDeleteEntry(null)}
        onConfirm={confirmDelete}
        title="Delete attendance entry"
        message={
          deleteEntry
            ? `Delete ${deleteEntry.worker?.name || "this employee"}'s ${Number(deleteEntry.hours || 0)} hour entry for ${projectLabel(deleteEntry)}? This cannot be undone.`
            : ""
        }
        confirmText="Delete"
        cancelText="Cancel"
        type="confirm"
      />
    </div>
  );
}
