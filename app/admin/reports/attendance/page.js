"use client";

import { useEffect, useMemo, useState } from "react";

function formatDateISO(d) {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x.toISOString();
}

export default function AttendanceReportsPage() {
  const [start, setStart] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d.toISOString().slice(0, 10);
  });
  const [end, setEnd] = useState(() => {
    const d = new Date();
    d.setMonth(d.getMonth() + 1, 0);
    return d.toISOString().slice(0, 10);
  });
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const run = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `/api/reports/attendance?start=${formatDateISO(start)}&end=${formatDateISO(end)}`,
        );
        const data = await res.json();
        setRows(data.rows || []);
      } catch (error) {
        console.error("Error fetching attendance reports:", error);
      }
      setLoading(false);
    };
    run();
  }, [start, end]);

  function exportCsv() {
    const header = ["Worker", "Days", "Hours", "Projects"];
    const lines = [header.join(",")];
    rows.forEach((r) => {
      lines.push(
        [
          `"${r.worker?.name || ""}"`,
          r.days || 0,
          r.hours || 0,
          `"${(r.projects || []).join("; ")}"`,
        ].join(","),
      );
    });
    const blob = new Blob([lines.join("\n")], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `attendance-${start}-${end}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Attendance Reports</h1>
        <p className="mt-1 text-sm text-gray-600">
          View attendance summaries by worker for a specific date range
        </p>
      </div>

      <div className="mb-6 rounded-lg bg-white p-4 shadow-sm ring-1 ring-gray-200">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              Start Date
            </label>
            <input
              type="date"
              value={start.slice(0, 10)}
              onChange={(e) => setStart(e.target.value)}
              className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700">
              End Date
            </label>
            <input
              type="date"
              value={end.slice(0, 10)}
              onChange={(e) => setEnd(e.target.value)}
              className="mt-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          <button
            onClick={exportCsv}
            disabled={rows.length === 0}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-gray-300"
          >
            Export CSV
          </button>
        </div>
      </div>
      <div className="mt-6">
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading attendance reports...</div>
          </div>
        ) : rows.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">
              No attendance records found for the selected date range.
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 bg-white">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Worker
                  </th>
                  <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Days Present
                  </th>
                  <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Total Hours
                  </th>
                  <th className="border-b border-gray-200 px-4 py-3 text-left text-sm font-medium text-gray-900">
                    Projects
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rows.map((r) => (
                  <tr key={r.worker?._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">
                      {r.worker?.name || "Unknown Worker"}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {r.days || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {r.hours || 0}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-700">
                      {(r.projects || []).length === 0 ? (
                        <span className="italic text-gray-400">
                          No projects
                        </span>
                      ) : (
                        <div className="flex flex-wrap gap-1">
                          {(r.projects || []).map((project, index) => (
                            <span
                              key={index}
                              className="inline-flex items-center rounded-md bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800"
                            >
                              {project}
                            </span>
                          ))}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
