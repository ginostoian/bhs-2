"use client";

import { Fragment, useEffect, useMemo, useState, useCallback } from "react";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";
// Tailwind layout to match admin design
import { Combobox, Dialog, Transition } from "@headlessui/react";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Custom styles for the attendance calendar
const calendarStyles = `
  .attendance-calendar .rbc-calendar {
    font-family: inherit;
  }
  
  .attendance-calendar .rbc-header {
    background-color: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
    padding: 12px 8px;
    font-weight: 600;
    color: #374151;
    text-transform: uppercase;
    font-size: 12px;
    letter-spacing: 0.05em;
  }
  
  .attendance-calendar .rbc-month-view {
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    overflow: hidden;
  }
  
  .attendance-calendar .rbc-date-cell {
    padding: 8px;
    min-height: 120px;
  }
  
  .attendance-calendar .rbc-date-cell button {
    font-weight: 500;
    color: #374151;
    padding: 4px 8px;
    border-radius: 4px;
    transition: all 0.2s;
  }
  
  .attendance-calendar .rbc-date-cell button:hover {
    background-color: #f3f4f6;
  }
  
  .attendance-calendar .rbc-today {
    background-color: #eff6ff !important;
  }
  
  .attendance-calendar .rbc-off-range-bg {
    background-color: #f9fafb;
  }
  

  
  .attendance-calendar .rbc-toolbar {
    margin-bottom: 20px;
    padding: 0;
  }
  
  .attendance-calendar .rbc-toolbar button {
    background-color: white;
    border: 1px solid #d1d5db;
    color: #374151;
    padding: 8px 16px;
    border-radius: 6px;
    font-weight: 500;
    transition: all 0.2s;
  }
  
  .attendance-calendar .rbc-toolbar button:hover {
    background-color: #f9fafb;
    border-color: #9ca3af;
  }
  
  .attendance-calendar .rbc-toolbar button.rbc-active {
    background-color: #3b82f6;
    border-color: #2563eb;
    color: white;
  }
  
  .attendance-calendar .rbc-toolbar-label {
    font-size: 18px;
    font-weight: 600;
    color: #111827;
  }
  
  .attendance-calendar .rbc-btn-group {
    display: flex;
    gap: 4px;
  }
  
  .attendance-calendar .rbc-btn-group button:first-child {
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  
  .attendance-calendar .rbc-btn-group button:last-child {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
  }
  
  .attendance-calendar .rbc-btn-group button:not(:first-child):not(:last-child) {
    border-radius: 0;
    border-left: none;
    border-right: none;
  }
`;

const Calendar = dynamic(
  () => import("react-big-calendar").then((m) => m.Calendar),
  { ssr: false },
);
// Build localizer safely on client
function useCalendarLocalizer() {
  return useMemo(() => {
    if (typeof window === "undefined") return undefined;
    // eslint-disable-next-line global-require
    const { momentLocalizer } = require("react-big-calendar");
    // eslint-disable-next-line global-require
    const moment = require("moment");
    return momentLocalizer(moment);
  }, []);
}

// Utility function to merge items into a map-based collection
const mergeItemsById = (existingItems, newItems, getId, mapItem) => {
  const itemMap = new Map(existingItems.map((x) => [String(getId(x)), x]));
  newItems.forEach((x) => {
    if (!itemMap.has(String(getId(x)))) {
      itemMap.set(String(getId(x)), mapItem(x));
    }
  });
  return Array.from(itemMap.values());
};

// Utility function to normalize worker/project ID
const normalizeId = (item) => item._id || item.id;

// Utility function to create date range for current month
const getCurrentMonthRange = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end };
};

// Utility function to format date for input without timezone issues
const formatDateForInput = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export default function AttendanceAdminPage() {
  const { data: session, status } = useSession();
  const [workers, setWorkers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState("month");
  const [date, setDate] = useState(new Date());
  const [query, setQuery] = useState("");
  const [selectedWorkerId, setSelectedWorkerId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");

  // Pagination for list below calendar
  const [listPage, setListPage] = useState(1);
  const [listLimit, setListLimit] = useState(25);
  const [listTotal, setListTotal] = useState(0);
  const [listItems, setListItems] = useState([]);

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(true);
  const [isLoadingList, setIsLoadingList] = useState(true);

  // Error states
  const [error, setError] = useState(null);
  const [lastError, setLastError] = useState(null);

  // Prevent hydration mismatch by deferring dynamic UI until mounted
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);

    // Remove any existing custom styles that might be cached
    const existingStyle = document.getElementById("attendance-calendar-styles");
    if (existingStyle) {
      existingStyle.remove();
    }

    // Temporarily disable all custom styles to test
    // const styleId = "attendance-calendar-styles";
    // const style = document.createElement("style");
    // style.id = styleId;
    // style.textContent = calendarStyles;
    // document.head.appendChild(style);
  }, []);

  // Add/edit modal state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [addDate, setAddDate] = useState(new Date());
  const [addWorkerQuery, setAddWorkerQuery] = useState("");
  const [addWorkerOptions, setAddWorkerOptions] = useState([]);
  const [addSelectedWorker, setAddSelectedWorker] = useState(null);
  const [addProjectQuery, setAddProjectQuery] = useState("");
  const [addSelectedProject, setAddSelectedProject] = useState(null);
  const [addStatus, setAddStatus] = useState("Present");
  const [addShiftType, setAddShiftType] = useState("full");
  const [addHours, setAddHours] = useState(8);
  const [addNotes, setAddNotes] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // Inline custom worker creation
  const [isCreateWorkerOpen, setIsCreateWorkerOpen] = useState(false);
  const [newWorker, setNewWorker] = useState({
    name: "",
    email: "",
    phone: "",
    position: "",
    trade: "",
    dayRate: "",
    notes: "",
  });

  // Worker profile drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [drawerWorker, setDrawerWorker] = useState(null); // { _id, name }

  // Delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteAttendanceId, setDeleteAttendanceId] = useState(null);
  const [drawerStart, setDrawerStart] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [drawerEnd, setDrawerEnd] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1, 0);
    return d.toISOString().slice(0, 10);
  });
  const [drawerPage, setDrawerPage] = useState(1);
  const [drawerLimit, setDrawerLimit] = useState(25);
  const [drawerTotal, setDrawerTotal] = useState(0);
  const [drawerItems, setDrawerItems] = useState([]);
  const [drawerTotals, setDrawerTotals] = useState({
    days: 0,
    hours: 0,
    projects: [],
  });

  // Consolidated data fetching function
  const fetchAttendanceData = useCallback(
    async (forceRefresh = false) => {
      if (!mounted || status !== "authenticated") {
        console.log("🚫 Skipping fetch - not mounted or not authenticated:", {
          mounted,
          status,
        });
        return;
      }

      console.log("🔍 Fetching attendance data:", {
        date: date.toISOString(),
        selectedWorkerId,
        selectedProjectId,
        listPage,
        listLimit,
        forceRefresh,
        sessionStatus: status,
        userId: session?.user?.id,
      });

      const { start, end } = getCurrentMonthRange(date);
      const params = new URLSearchParams({
        start: start.toISOString(),
        end: end.toISOString(),
      });
      if (selectedWorkerId) params.set("workerId", selectedWorkerId);
      if (selectedProjectId) params.set("projectId", selectedProjectId);

      try {
        // Fetch calendar events and list items in parallel
        const [calendarRes, listRes] = await Promise.all([
          fetch(`/api/attendance?${params.toString()}`, {
            credentials: "include", // Ensure cookies are sent
          }),
          fetch(
            `/api/attendance?${params.toString()}&page=${listPage}&limit=${listLimit}`,
            {
              credentials: "include", // Ensure cookies are sent
            },
          ),
        ]);

        if (!calendarRes.ok || !listRes.ok) {
          throw new Error(
            `Failed to fetch attendance data: Calendar ${calendarRes.status}, List ${listRes.status}`,
          );
        }

        const [calendarData, listData] = await Promise.all([
          calendarRes.json(),
          listRes.json(),
        ]);

        console.log("📊 Calendar data received:", {
          itemsCount: calendarData.items?.length || 0,
          total: calendarData.total || 0,
        });

        console.log("📋 List data received:", {
          itemsCount: listData.items?.length || 0,
          total: listData.total || 0,
        });

        // Update calendar events
        const evts = (calendarData.items || []).map((a, index) => ({
          id: a._id || a.id || `event-${index}`,
          title: `${a.worker?.name || a.worker?.position || "Worker"} → ${a.project?.name || a.projectName || "Project"}`,
          start: new Date(a.date),
          end: new Date(a.date),
          resource: a,
        }));
        setEvents(evts);
        setIsLoadingCalendar(false);

        // Update list items
        setListItems(listData.items || []);
        setListTotal(listData.total || 0);
        setIsLoadingList(false);

        // Set overall loading to false
        setIsLoading(false);

        console.log("✅ Data updated successfully:", {
          eventsCount: evts.length,
          listItemsCount: listData.items?.length || 0,
        });
      } catch (error) {
        console.error("❌ Failed to fetch attendance data:", error);
        setIsLoading(false);
        setIsLoadingCalendar(false);
        setIsLoadingList(false);

        // Capture error for UI display
        setError(`Failed to load attendance data: ${error.message}`);
        setLastError({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });

        // Show error to user
        alert(`Failed to load attendance data: ${error.message}`);
      }
    },
    [
      mounted,
      date,
      selectedWorkerId,
      selectedProjectId,
      listPage,
      listLimit,
      status,
      session,
    ],
  );

  // Load employees/projects basic lists
  useEffect(() => {
    const load = async () => {
      if (status !== "authenticated") return;

      try {
        console.log("🔍 Loading workers and projects...");
        const [wRes, pRes] = await Promise.all([
          fetch("/api/workers?active=true", { credentials: "include" }),
          fetch("/api/projects?status=On Going", { credentials: "include" }),
        ]);

        if (!wRes.ok || !pRes.ok) {
          throw new Error(
            `Failed to load data: Workers ${wRes.status}, Projects ${pRes.status}`,
          );
        }

        const [wData, pData] = await Promise.all([wRes.json(), pRes.json()]);

        console.log("📊 Workers loaded:", wData.workers?.length || 0);
        console.log("📊 Projects loaded:", pData.projects?.length || 0);

        setWorkers(wData.workers || []);
        const mappedProjects = (pData.projects || []).map((p) => ({
          id: normalizeId(p),
          name: p.name,
        }));
        setProjects(mappedProjects);
      } catch (error) {
        console.error("❌ Failed to load workers and projects:", error);
        setError(`Failed to load workers and projects: ${error.message}`);
        setLastError({
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString(),
          url: window.location.href,
          userAgent: navigator.userAgent,
        });
        alert(`Failed to load workers and projects: ${error.message}`);
      }
    };
    load();
  }, [status]);

  const localizer = useCalendarLocalizer();

  // Main data fetching effect - consolidated and simplified
  useEffect(() => {
    if (mounted && status === "authenticated") {
      fetchAttendanceData();
    }
  }, [mounted, status, fetchAttendanceData]);

  // Load additional workers/projects that appear in attendance for current month
  useEffect(() => {
    const loadDistinctData = async () => {
      if (!mounted || status !== "authenticated") return;

      const { start, end } = getCurrentMonthRange(date);
      const qs = `start=${start.toISOString()}&end=${end.toISOString()}`;

      try {
        console.log("🔍 Loading distinct workers and projects...");
        const [w, p] = await Promise.all([
          fetch(`/api/attendance/distinct/workers?${qs}`, {
            credentials: "include",
          })
            .then((r) => {
              if (!r.ok) throw new Error(`Workers API failed: ${r.status}`);
              return r.json();
            })
            .catch(() => ({ workers: [] })),
          fetch(`/api/attendance/distinct/projects?${qs}`, {
            credentials: "include",
          })
            .then((r) => {
              if (!r.ok) throw new Error(`Projects API failed: ${r.status}`);
              return r.json();
            })
            .catch(() => ({ projects: [] })),
        ]);

        console.log("📊 Distinct workers loaded:", w.workers?.length || 0);
        console.log("📊 Distinct projects loaded:", p.projects?.length || 0);

        // Merge distinct workers with existing workers list
        if (Array.isArray(w.workers) && w.workers.length) {
          setWorkers((prevWorkers) =>
            mergeItemsById(
              prevWorkers,
              w.workers,
              (x) => x._id || x.id,
              (x) => ({
                _id: x.id,
                name: x.name,
                type: x.type || "employee",
              }),
            ),
          );
        }

        // Merge distinct projects with existing projects list
        if (Array.isArray(p.projects) && p.projects.length) {
          setProjects((prevProjects) =>
            mergeItemsById(
              prevProjects,
              p.projects,
              (x) => x.id,
              (x) => ({ id: x.id, name: x.name }),
            ),
          );
        }
      } catch (error) {
        console.error("❌ Failed to load distinct workers/projects:", error);
        // Don't show alert for this as it's not critical
      }
    };

    loadDistinctData();
  }, [mounted, date, status]);

  function openAddModal(dayDate) {
    setAddDate(dayDate || new Date());
    setAddSelectedWorker(null);
    setAddSelectedProject(null);
    setAddStatus("Present");
    setAddShiftType("full");
    setAddHours(8);
    setAddNotes("");
    setIsAddOpen(true);
    setIsEditing(false);
    setEditingId(null);
  }

  function openEditModal(att) {
    if (!att) return;
    setEditingId(att._id);
    setIsEditing(true);
    setAddDate(new Date(att.date));
    setAddSelectedWorker(
      att.worker
        ? { _id: att.worker._id, name: att.worker.name, type: "employee" }
        : null,
    );
    setAddSelectedProject(
      att.project ? { id: att.project._id, name: att.project.name } : null,
    );
    setAddStatus(att.status || "Present");
    setAddShiftType(att.shiftType || "full");
    setAddHours(att.hours || 8);
    setAddNotes(att.notes || "");
    setIsAddOpen(true);
  }

  async function saveAdd() {
    const workerId = addSelectedWorker?._id;

    if (!workerId || !addSelectedProject) {
      alert("Please select a worker and a project");
      return;
    }

    setIsSaving(true);

    // Handle custom project entry
    let projectId;
    let projectName;

    if (addSelectedProject.isCustom) {
      // For custom entries, we'll send the custom name instead of an ID
      projectId = null;
      projectName = addSelectedProject.customName;
    } else {
      projectId = addSelectedProject.id || addSelectedProject._id;
      projectName = null;
    }

    const payload = {
      worker: workerId,
      project: projectId,
      projectName: projectName, // Add custom project name for custom entries
      date: addDate,
      status: addStatus,
      shiftType: addShiftType,
      hours: addHours,
      notes: addNotes,
    };
    const res = await fetch(
      isEditing ? `/api/attendance/${editingId}` : "/api/attendance",
      {
        method: isEditing ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    setIsSaving(false);
    if (res.ok) {
      setIsAddOpen(false);
      // Refresh data instead of just setting date
      await fetchAttendanceData(true);
      if (isDrawerOpen) setDrawerPage((p) => p);
    } else {
      const e = await res.json();
      alert(
        e.error ||
          e.warning ||
          (isEditing
            ? "Failed to update attendance"
            : "Failed to add attendance"),
      );
    }
  }

  function openDeleteModal(attId) {
    if (!attId) return;
    setDeleteAttendanceId(attId);
    setIsDeleteModalOpen(true);
  }

  async function confirmDeleteAttendance() {
    if (!deleteAttendanceId) return;

    try {
      const res = await fetch(`/api/attendance/${deleteAttendanceId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Refresh data instead of just setting date
        await fetchAttendanceData(true);
        // Refresh drawer data if open
        if (isDrawerOpen) {
          setDrawerPage((p) => p);
        }
        setIsDeleteModalOpen(false);
        setDeleteAttendanceId(null);
      } else {
        const e = await res.json();
        alert(e.error || "Failed to delete attendance");
      }
    } catch (error) {
      alert("Network error occurred while deleting");
    }
  }

  function onNavigate(nextDate) {
    setDate(nextDate);
    // Reset loading states when navigating
    setIsLoading(true);
    setIsLoadingCalendar(true);
    setIsLoadingList(true);
  }

  // Worker search for modal combobox
  useEffect(() => {
    let ignore = false;
    const run = async () => {
      if (status !== "authenticated") return;

      const qs = addWorkerQuery?.trim();
      if (!qs) {
        setAddWorkerOptions(workers.slice(0, 20));
        return;
      }
      try {
        const res = await fetch(
          `/api/workers?query=${encodeURIComponent(qs)}`,
          { credentials: "include" },
        );
        if (res.ok) {
          const data = await res.json();
          if (!ignore) setAddWorkerOptions(data.workers || []);
        } else {
          console.error("❌ Worker search failed:", res.status);
        }
      } catch (error) {
        console.error("❌ Worker search error:", error);
      }
    };
    run();
    return () => {
      ignore = true;
    };
  }, [addWorkerQuery, workers, status]);

  // Project filtered options
  const filteredProjects = useMemo(() => {
    const q = (addProjectQuery || "").toLowerCase();
    if (!q) return projects;

    const filtered = projects.filter((p) => p.name.toLowerCase().includes(q));

    // If there's a query but no matches, add option to create custom entry
    if (q && filtered.length === 0) {
      return [
        {
          id: "custom-entry",
          name: `Create custom entry: "${addProjectQuery}"`,
          isCustom: true,
          customName: addProjectQuery,
        },
      ];
    }

    return filtered;
  }, [addProjectQuery, projects]);

  function openWorkerDrawer(worker) {
    if (!worker) return;
    const drawerWorkerData = { _id: normalizeId(worker), name: worker.name };
    setDrawerWorker(drawerWorkerData);
    setDrawerPage(1);
    setIsDrawerOpen(true);
  }

  useEffect(() => {
    const fetchDrawer = async () => {
      if (!isDrawerOpen || !drawerWorker?._id || status !== "authenticated")
        return;

      const base = {
        workerId: drawerWorker._id,
        start: new Date(drawerStart).toISOString(),
        end: new Date(drawerEnd).toISOString(),
      };
      const params = new URLSearchParams({
        ...base,
        page: String(drawerPage),
        limit: String(drawerLimit),
      });

      try {
        const [listRes, sumRes] = await Promise.all([
          fetch(`/api/attendance?${params.toString()}`, {
            credentials: "include",
          }).then((r) => r.json()),
          fetch(
            `/api/attendance/summary?${new URLSearchParams(base).toString()}`,
            { credentials: "include" },
          ).then((r) => r.json()),
        ]);

        setDrawerItems(listRes.items || []);
        setDrawerTotal(listRes.total || 0);
        setDrawerTotals(sumRes.summary || { days: 0, hours: 0, projects: [] });
      } catch (error) {
        console.error("❌ Failed to fetch drawer data:", error);
      }
    };
    fetchDrawer();
  }, [
    isDrawerOpen,
    drawerWorker,
    drawerStart,
    drawerEnd,
    drawerPage,
    drawerLimit,
    status,
  ]);

  return (
    <div className="space-y-8">
      {/* Show loading state while session is loading */}
      {status === "loading" && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
            <div className="text-gray-500">Loading session...</div>
          </div>
        </div>
      )}

      {/* Show error if not authenticated */}
      {status === "unauthenticated" && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-red-800">
            Authentication Error
          </h3>
          <p className="text-red-600">
            You are not authenticated. Please sign in again.
          </p>
        </div>
      )}

      {/* Show any errors that occurred */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-red-800">
            Error Loading Data
          </h3>
          <p className="mb-2 text-red-600">{error}</p>
          {lastError && (
            <details className="text-sm">
              <summary className="cursor-pointer text-red-700">
                Technical Details
              </summary>
              <pre className="mt-2 whitespace-pre-wrap rounded bg-red-100 p-2 text-xs text-red-600">
                {JSON.stringify(lastError, null, 2)}
              </pre>
            </details>
          )}
          <button
            onClick={() => {
              setError(null);
              setLastError(null);
              fetchAttendanceData(true);
            }}
            className="mt-2 rounded bg-red-600 px-3 py-1 text-sm text-white hover:bg-red-700"
          >
            Retry
          </button>
        </div>
      )}

      {/* Main content - only show when authenticated */}
      {status === "authenticated" && (
        <>
          {/* Header */}
          <div>
            <h1 className="mb-2 text-3xl font-bold text-gray-900">
              Attendance
            </h1>
            <p className="text-gray-600">
              Assign workers to projects on specific days, review history, and
              export data.
            </p>
          </div>

          {/* Debug Panel - Show in both dev and production for troubleshooting */}
          <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-4">
            <h3 className="mb-2 text-lg font-semibold text-yellow-800">
              Debug Info
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
              <div>
                <span className="font-medium">Session Status:</span> {status}
              </div>
              <div>
                <span className="font-medium">User ID:</span>{" "}
                {session?.user?.id || "None"}
              </div>
              <div>
                <span className="font-medium">Mounted:</span>{" "}
                {mounted ? "✅" : "❌"}
              </div>
              <div>
                <span className="font-medium">Loading:</span>{" "}
                {isLoading ? "🔄" : "✅"}
              </div>
              <div>
                <span className="font-medium">Calendar:</span>{" "}
                {isLoadingCalendar ? "🔄" : "✅"}
              </div>
              <div>
                <span className="font-medium">List:</span>{" "}
                {isLoadingList ? "🔄" : "✅"}
              </div>
              <div>
                <span className="font-medium">Events:</span> {events.length}
              </div>
              <div>
                <span className="font-medium">List Items:</span>{" "}
                {listItems.length}
              </div>
              <div>
                <span className="font-medium">Date:</span> {date.toDateString()}
              </div>
              <div>
                <span className="font-medium">Worker Filter:</span>{" "}
                {selectedWorkerId || "None"}
              </div>
            </div>
            <div className="mt-2 text-xs text-yellow-600">
              Check browser console for detailed logs
            </div>

            {/* Environment Debug Info */}
            <details className="mt-3">
              <summary className="cursor-pointer font-medium text-yellow-700">
                Environment Info
              </summary>
              <div className="mt-2 rounded bg-yellow-100 p-2 text-xs text-yellow-600">
                <div>Environment: {process.env.NODE_ENV || "unknown"}</div>
                {mounted && (
                  <>
                    <div>Base URL: {window.location.origin}</div>
                    <div>Path: {window.location.pathname}</div>
                    <div>
                      User Agent: {navigator.userAgent.substring(0, 50)}...
                    </div>
                    <div>Timestamp: {new Date().toISOString()}</div>
                  </>
                )}
                {!mounted && <div>Loading environment info...</div>}
              </div>
            </details>
          </div>

          {/* Filters */}
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-semibold text-gray-900">Filters</h2>
              <p className="mt-1 text-sm text-gray-600">
                Filter attendance records by worker or project
              </p>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Search workers
                  </label>
                  <div className="relative">
                    <input
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Type a name and press Enter"
                      onKeyDown={async (e) => {
                        if (e.key === "Enter" && status === "authenticated") {
                          try {
                            const res = await fetch(
                              `/api/workers?query=${encodeURIComponent(query)}`,
                              { credentials: "include" },
                            );
                            if (res.ok) {
                              const data = await res.json();
                              setWorkers(data.workers || []);
                            } else {
                              console.error(
                                "❌ Worker search failed:",
                                res.status,
                              );
                            }
                          } catch (error) {
                            console.error("❌ Worker search error:", error);
                          }
                        }
                      }}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <svg
                        className="h-4 w-4 text-gray-400"
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
                  </div>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Filter by worker
                  </label>
                  <select
                    value={selectedWorkerId}
                    onChange={(e) => setSelectedWorkerId(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All workers</option>
                    {workers.map((w) => (
                      <option key={w._id} value={w._id}>
                        {w.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium text-gray-700">
                    Filter by project
                  </label>
                  <select
                    value={selectedProjectId}
                    onChange={(e) => setSelectedProjectId(e.target.value)}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="">All projects</option>
                    {projects.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Calendar Section */}
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            {/* Calendar Header */}
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                  Attendance Calendar
                </h2>
                <div className="flex items-center gap-3">
                  <div className="flex rounded-lg border border-gray-300 p-1">
                    {["month", "week", "day"].map((viewType) => (
                      <button
                        key={viewType}
                        onClick={() => setView(viewType)}
                        className={`rounded-md px-3 py-1 text-sm font-medium capitalize transition-colors ${
                          view === viewType
                            ? "bg-blue-600 text-white"
                            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                        }`}
                      >
                        {viewType}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => fetchAttendanceData(true)}
                    disabled={isLoading}
                    className="rounded-md bg-gray-600 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isLoading ? "Refreshing..." : "Refresh"}
                  </button>
                  <button
                    onClick={() => openAddModal(new Date())}
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    Add Attendance
                  </button>
                </div>
              </div>
            </div>

            {/* Calendar Body */}
            <div className="calendar-container p-6">
              {mounted && localizer ? (
                <div className="attendance-calendar">
                  {isLoadingCalendar ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                        <div className="text-gray-500">Loading calendar...</div>
                      </div>
                    </div>
                  ) : events.length === 0 ? (
                    <div className="flex items-center justify-center py-12">
                      <div className="text-center">
                        <div className="mb-2 text-gray-500">
                          No attendance records found for this month
                        </div>
                        <div className="text-sm text-gray-400">
                          Try changing the date or filters
                        </div>
                      </div>
                    </div>
                  ) : (
                    <Calendar
                      localizer={localizer}
                      events={events}
                      views={["month", "week", "day"]}
                      view={view}
                      onView={setView}
                      date={date}
                      onNavigate={onNavigate}
                      onSelectSlot={(slotInfo) => openAddModal(slotInfo.start)}
                      onSelectEvent={(evt) =>
                        openWorkerDrawer(evt.resource?.worker)
                      }
                      selectable
                      style={{ height: 600 }}
                      eventPropGetter={(event) => ({
                        style: {
                          backgroundColor: "#3b82f6",
                          borderColor: "#2563eb",
                          color: "white",
                          borderRadius: "4px",
                          border: "1px solid #2563eb",
                        },
                      })}
                      dayPropGetter={(date) => {
                        const today = new Date();
                        const isToday =
                          date.getDate() === today.getDate() &&
                          date.getMonth() === today.getMonth() &&
                          date.getFullYear() === today.getFullYear();

                        return {
                          style: {
                            backgroundColor: isToday
                              ? "#eff6ff"
                              : "transparent",
                          },
                        };
                      }}
                    />
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="mx-auto mb-2 h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <div className="text-gray-500">Loading calendar...</div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Assignments Section */}
          <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200">
            <div className="border-b border-gray-200 px-6 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    Attendance Records
                  </h3>
                  <p className="mt-1 text-sm text-gray-600">
                    Recent attendance assignments and history
                  </p>
                </div>
                <div className="text-sm text-gray-500">
                  Total: {listTotal} records
                </div>
              </div>
            </div>
            <div className="p-6">
              {isLoadingList ? (
                <div className="flex items-center justify-center py-8">
                  <div className="text-center">
                    <div className="mx-auto mb-2 h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                    <div className="text-gray-500">
                      Loading attendance records...
                    </div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="mb-4 flex items-center gap-4">
                    <label>
                      <span className="mr-2 text-sm text-gray-700">Page</span>
                      <input
                        type="number"
                        min={1}
                        value={listPage}
                        onChange={(e) =>
                          setListPage(
                            Math.max(1, parseInt(e.target.value || "1", 10)),
                          )
                        }
                        className="w-24 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      />
                    </label>
                    <label>
                      <span className="mr-2 text-sm text-gray-700">
                        Per page
                      </span>
                      <select
                        value={listLimit}
                        onChange={(e) => {
                          setListLimit(parseInt(e.target.value, 10));
                          setListPage(1);
                        }}
                        className="w-28 rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        {[10, 25, 50, 100].map((n) => (
                          <option key={n} value={n}>
                            {n}
                          </option>
                        ))}
                      </select>
                    </label>
                    <div className="text-sm text-gray-600">
                      Total: {listTotal}
                    </div>
                  </div>
                  <ul className="divide-y">
                    {listItems.map((a) => (
                      <li
                        key={a._id || a.id}
                        className="flex items-center justify-between py-3"
                      >
                        <div>
                          <button
                            className="font-medium text-blue-700 underline"
                            onClick={() => openWorkerDrawer(a.worker)}
                            title="Open worker drawer"
                          >
                            {a.worker?.name || "Worker"}
                          </button>{" "}
                          → {a.project?.name || a.projectName || "Project"} —{" "}
                          {new Date(a.date).toDateString()}
                        </div>
                        <div className="flex gap-2 text-sm">
                          <button
                            className="rounded border px-3 py-1"
                            onClick={() => openEditModal(a)}
                          >
                            Edit
                          </button>
                          <button
                            className="rounded border px-3 py-1 text-red-600"
                            onClick={() => openDeleteModal(a._id || a.id)}
                          >
                            Delete
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          </div>

          {/* Add Attendance Modal */}
          <Transition.Root show={isAddOpen} as={Fragment}>
            <Dialog as="div" className="relative z-50" onClose={setIsAddOpen}>
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/30" />
              </Transition.Child>

              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 shadow-xl">
                      <Dialog.Title className="mb-4 text-lg font-medium">
                        {isEditing ? "Edit attendance" : "Add attendance"}
                      </Dialog.Title>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="mb-1 block text-sm">Worker</label>
                          <Combobox
                            value={addSelectedWorker}
                            onChange={(w) => {
                              setAddSelectedWorker(w);
                              setAddWorkerQuery("");
                            }}
                            by={(a, b) => a?._id === b?._id}
                          >
                            <div className="relative">
                              <Combobox.Input
                                className="w-full rounded border p-2"
                                displayValue={(w) => w?.name || ""}
                                onChange={(e) =>
                                  setAddWorkerQuery(e.target.value)
                                }
                                placeholder="Search workers or create custom"
                              />
                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white py-1 shadow">
                                {(addWorkerOptions || []).map((w) => (
                                  <Combobox.Option
                                    key={w._id}
                                    value={{
                                      _id: w._id,
                                      name: w.name,
                                      type: w.type || "employee",
                                    }}
                                    className={({ active }) =>
                                      `cursor-pointer px-3 py-2 text-sm ${active ? "bg-blue-50" : ""}`
                                    }
                                  >
                                    {w.name}{" "}
                                    <span className="text-gray-500">
                                      ({w.type})
                                    </span>
                                  </Combobox.Option>
                                ))}
                                {addWorkerQuery && (
                                  <div className="border-t py-1 text-xs text-gray-500">
                                    <button
                                      type="button"
                                      className="w-full px-3 py-2 text-left text-blue-700 hover:bg-blue-50"
                                      onClick={() => {
                                        setNewWorker({
                                          name: addWorkerQuery,
                                          email: "",
                                          phone: "",
                                          position: "",
                                          trade: "",
                                          dayRate: "",
                                          notes: "",
                                        });
                                        setIsCreateWorkerOpen(true);
                                      }}
                                    >
                                      Create custom worker &apos;
                                      {addWorkerQuery}
                                      &apos;
                                    </button>
                                  </div>
                                )}
                              </Combobox.Options>
                            </div>
                          </Combobox>
                          <div className="mt-2 text-xs text-gray-500">
                            Missing a person? Create one in Workers and try
                            again.
                          </div>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm">Project</label>
                          <Combobox
                            value={addSelectedProject}
                            onChange={(p) => {
                              setAddSelectedProject(p);
                              setAddProjectQuery("");
                            }}
                            by={(a, b) => a?.id === b?.id}
                          >
                            <div className="relative">
                              <Combobox.Input
                                className="w-full rounded border p-2"
                                displayValue={(p) => p?.name || ""}
                                onChange={(e) =>
                                  setAddProjectQuery(e.target.value)
                                }
                                placeholder="Search projects"
                              />
                              <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded border bg-white py-1 shadow">
                                {filteredProjects.map((p) => (
                                  <Combobox.Option
                                    key={p.id}
                                    value={
                                      p.isCustom
                                        ? p
                                        : { id: p.id, name: p.name }
                                    }
                                    className={({ active }) =>
                                      `cursor-pointer px-3 py-2 text-sm ${active ? "bg-blue-50" : ""} ${p.isCustom ? "border-t border-gray-200 italic text-blue-600" : ""}`
                                    }
                                  >
                                    {p.isCustom && (
                                      <span className="mr-1 text-blue-500">
                                        ✨
                                      </span>
                                    )}
                                    {p.name}
                                  </Combobox.Option>
                                ))}
                              </Combobox.Options>
                            </div>
                          </Combobox>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm">Date</label>
                          <input
                            type="date"
                            className="w-full rounded border p-2"
                            value={formatDateForInput(addDate)}
                            onChange={(e) =>
                              setAddDate(new Date(e.target.value))
                            }
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-sm">Status</label>
                          <select
                            className="w-full rounded border p-2"
                            value={addStatus}
                            onChange={(e) => setAddStatus(e.target.value)}
                          >
                            {["Present", "Sick", "Holiday", "Unavailable"].map(
                              (s) => (
                                <option key={s} value={s}>
                                  {s}
                                </option>
                              ),
                            )}
                          </select>
                        </div>

                        <div>
                          <label className="mb-1 block text-sm">Shift</label>
                          <select
                            className="w-full rounded border p-2"
                            value={addShiftType}
                            onChange={(e) => setAddShiftType(e.target.value)}
                          >
                            {["full", "half", "custom"].map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div>
                          <label className="mb-1 block text-sm">Hours</label>
                          <input
                            type="number"
                            className="w-full rounded border p-2"
                            min={0}
                            max={24}
                            value={addHours}
                            onChange={(e) =>
                              setAddHours(parseFloat(e.target.value || "0"))
                            }
                          />
                        </div>

                        <div className="sm:col-span-2">
                          <label className="mb-1 block text-sm">Notes</label>
                          <textarea
                            className="w-full rounded border p-2"
                            rows={3}
                            value={addNotes}
                            onChange={(e) => setAddNotes(e.target.value)}
                          />
                        </div>
                      </div>

                      <div className="mt-6 flex justify-end gap-2">
                        <button
                          className="rounded border px-3 py-1"
                          onClick={() => setIsAddOpen(false)}
                          disabled={isSaving}
                        >
                          Cancel
                        </button>
                        <button
                          className={`rounded px-3 py-1 text-white ${
                            isSaving ||
                            !addSelectedWorker ||
                            !addSelectedProject
                              ? "cursor-not-allowed bg-blue-400 opacity-50"
                              : "bg-blue-600 hover:bg-blue-700"
                          }`}
                          onClick={saveAdd}
                          disabled={isSaving}
                          type="button"
                        >
                          {isSaving ? "Saving…" : isEditing ? "Update" : "Save"}
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Create Custom Worker Modal */}
          <Transition.Root show={isCreateWorkerOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={setIsCreateWorkerOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/30" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-y-auto">
                <div className="flex min-h-full items-center justify-center p-4">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-lg bg-white p-6 shadow-xl">
                      <Dialog.Title className="mb-4 text-lg font-medium">
                        Create custom worker
                      </Dialog.Title>
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <label className="text-sm">
                          Name
                          <input
                            className="mt-1 w-full rounded border p-2"
                            value={newWorker.name}
                            onChange={(e) =>
                              setNewWorker({
                                ...newWorker,
                                name: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="text-sm">
                          Email
                          <input
                            className="mt-1 w-full rounded border p-2"
                            value={newWorker.email}
                            onChange={(e) =>
                              setNewWorker({
                                ...newWorker,
                                email: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="text-sm">
                          Phone
                          <input
                            className="mt-1 w-full rounded border p-2"
                            value={newWorker.phone}
                            onChange={(e) =>
                              setNewWorker({
                                ...newWorker,
                                phone: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="text-sm">
                          Position
                          <input
                            className="mt-1 w-full rounded border p-2"
                            value={newWorker.position}
                            onChange={(e) =>
                              setNewWorker({
                                ...newWorker,
                                position: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="text-sm">
                          Trade
                          <input
                            className="mt-1 w-full rounded border p-2"
                            value={newWorker.trade}
                            onChange={(e) =>
                              setNewWorker({
                                ...newWorker,
                                trade: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="text-sm">
                          Day rate
                          <input
                            type="number"
                            className="mt-1 w-full rounded border p-2"
                            value={newWorker.dayRate}
                            onChange={(e) =>
                              setNewWorker({
                                ...newWorker,
                                dayRate: e.target.value,
                              })
                            }
                          />
                        </label>
                        <label className="text-sm sm:col-span-2">
                          Notes
                          <textarea
                            className="mt-1 w-full rounded border p-2"
                            rows={3}
                            value={newWorker.notes}
                            onChange={(e) =>
                              setNewWorker({
                                ...newWorker,
                                notes: e.target.value,
                              })
                            }
                          />
                        </label>
                      </div>
                      <div className="mt-6 flex justify-end gap-2">
                        <button
                          className="rounded border px-3 py-1"
                          onClick={() => setIsCreateWorkerOpen(false)}
                        >
                          Cancel
                        </button>
                        <button
                          className="rounded bg-blue-600 px-3 py-1 text-white"
                          onClick={async () => {
                            if (
                              !newWorker.name?.trim() ||
                              status !== "authenticated"
                            ) {
                              if (!newWorker.name?.trim()) {
                                // eslint-disable-next-line no-alert
                                alert("Name is required");
                              }
                              return;
                            }
                            try {
                              const res = await fetch("/api/workers", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                credentials: "include",
                                body: JSON.stringify({
                                  name: newWorker.name,
                                  email: newWorker.email || undefined,
                                  phone: newWorker.phone || undefined,
                                  position: newWorker.position || undefined,
                                  trade: newWorker.trade || undefined,
                                  dayRate: newWorker.dayRate
                                    ? Number(newWorker.dayRate)
                                    : undefined,
                                  notes: newWorker.notes || undefined,
                                  isActive: true,
                                }),
                              });
                              if (res.ok) {
                                const data = await res.json();
                                const w = data.worker;
                                setIsCreateWorkerOpen(false);
                                setAddWorkerOptions((prev) => [w, ...prev]);
                                setWorkers((prev) => [w, ...prev]);
                                setAddSelectedWorker(w);
                              } else {
                                const e = await res.json();
                                // eslint-disable-next-line no-alert
                                alert(e.error || "Failed to create worker");
                              }
                            } catch (error) {
                              console.error("❌ Worker creation error:", error);
                              alert("Failed to create worker");
                            }
                          }}
                        >
                          Create
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Worker Drawer */}
          <Transition.Root show={isDrawerOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-40"
              onClose={setIsDrawerOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/30" />
              </Transition.Child>
              <div className="fixed inset-0 overflow-hidden">
                <div className="absolute inset-0 overflow-hidden">
                  <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10">
                    <Transition.Child
                      as={Fragment}
                      enter="transform transition ease-in-out duration-300"
                      enterFrom="translate-x-full"
                      enterTo="translate-x-0"
                      leave="transform transition ease-in-out duration-300"
                      leaveFrom="translate-x-0"
                      leaveTo="translate-x-full"
                    >
                      <Dialog.Panel className="pointer-events-auto w-screen max-w-2xl bg-white shadow-xl">
                        <div className="flex h-full flex-col">
                          <div className="flex items-center justify-between border-b p-4">
                            <Dialog.Title className="text-lg font-medium">
                              Worker profile
                            </Dialog.Title>
                            <button
                              onClick={() => setIsDrawerOpen(false)}
                              className="rounded border px-2 py-1"
                            >
                              Close
                            </button>
                          </div>
                          <div className="flex-1 overflow-y-auto p-4">
                            {drawerWorker && (
                              <div className="mb-4">
                                <div className="text-xl font-semibold">
                                  {drawerWorker.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  History and totals
                                </div>
                              </div>
                            )}

                            <div className="mb-4 flex flex-wrap items-end gap-3">
                              <label className="text-sm">
                                Start
                                <input
                                  type="date"
                                  className="ml-2 border p-1"
                                  value={drawerStart}
                                  onChange={(e) => {
                                    setDrawerStart(e.target.value);
                                    setDrawerPage(1);
                                  }}
                                />
                              </label>
                              <label className="text-sm">
                                End
                                <input
                                  type="date"
                                  className="ml-2 border p-1"
                                  value={drawerEnd}
                                  onChange={(e) => {
                                    setDrawerEnd(e.target.value);
                                    setDrawerPage(1);
                                  }}
                                />
                              </label>
                              <label className="text-sm">
                                Page
                                <input
                                  type="number"
                                  min={1}
                                  className="ml-2 w-20 border p-1"
                                  value={drawerPage}
                                  onChange={(e) =>
                                    setDrawerPage(
                                      Math.max(
                                        1,
                                        parseInt(e.target.value || "1", 10),
                                      ),
                                    )
                                  }
                                />
                              </label>
                              <label className="text-sm">
                                Per page
                                <select
                                  className="ml-2 border p-1"
                                  value={drawerLimit}
                                  onChange={(e) => {
                                    setDrawerLimit(
                                      parseInt(e.target.value, 10),
                                    );
                                    setDrawerPage(1);
                                  }}
                                >
                                  {[10, 25, 50, 100].map((n) => (
                                    <option key={n} value={n}>
                                      {n}
                                    </option>
                                  ))}
                                </select>
                              </label>
                              <div className="text-sm text-gray-600">
                                Total: {drawerTotal}
                              </div>
                            </div>

                            <div className="mb-4 rounded border p-3">
                              <div className="text-sm">
                                Days: <strong>{drawerTotals.days}</strong>
                              </div>
                              <div className="text-sm">
                                Hours: <strong>{drawerTotals.hours}</strong>
                              </div>
                              <div className="text-sm">
                                Projects:{" "}
                                <strong>
                                  {(drawerTotals.projects || []).join(", ")}
                                </strong>
                              </div>
                            </div>

                            <ul className="divide-y">
                              {drawerItems.map((a) => (
                                <li key={a._id} className="py-2 text-sm">
                                  {new Date(a.date).toDateString()} —{" "}
                                  {a.project?.name ||
                                    a.projectName ||
                                    "Project"}{" "}
                                  — {a.status}
                                  {a.hours ? ` (${a.hours}h)` : ""}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Dialog.Panel>
                    </Transition.Child>
                  </div>
                </div>
              </div>
            </Dialog>
          </Transition.Root>

          {/* Delete Confirmation Modal */}
          <Transition.Root show={isDeleteModalOpen} as={Fragment}>
            <Dialog
              as="div"
              className="relative z-50"
              onClose={setIsDeleteModalOpen}
            >
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="fixed inset-0 bg-black/30" />
              </Transition.Child>
              <div className="fixed inset-0 z-10 overflow-y-auto">
                <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
                  <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    enterTo="opacity-100 translate-y-0 sm:scale-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                    leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                  >
                    <Dialog.Panel className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:p-6">
                      <div className="sm:flex sm:items-start">
                        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                          <svg
                            className="h-6 w-6 text-red-600"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
                            />
                          </svg>
                        </div>
                        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                          <Dialog.Title
                            as="h3"
                            className="text-base font-semibold leading-6 text-gray-900"
                          >
                            Delete Attendance Record
                          </Dialog.Title>
                          <div className="mt-2">
                            <p className="text-sm text-gray-500">
                              Are you sure you want to delete this attendance
                              record? This action cannot be undone.
                            </p>
                          </div>
                        </div>
                      </div>
                      <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto"
                          onClick={confirmDeleteAttendance}
                        >
                          Delete
                        </button>
                        <button
                          type="button"
                          className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                          onClick={() => setIsDeleteModalOpen(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </Dialog.Panel>
                  </Transition.Child>
                </div>
              </div>
            </Dialog>
          </Transition.Root>
        </>
      )}
    </div>
  );
}
