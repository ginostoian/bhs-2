"use client";

import { useEffect, useState } from "react";
import { Download, FileBarChart2 } from "lucide-react";

function csvCell(value) {
  return `"${String(value ?? "").replaceAll('"', '""')}"`;
}

export default function AttendanceReports({ start, end }) {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const controller = new AbortController();

    async function load() {
      setLoading(true);
      setError("");
      try {
        const params = new URLSearchParams({ start, end });
        const response = await fetch(`/api/reports/attendance?${params}`, {
          signal: controller.signal,
        });
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Unable to generate attendance report");
        }
        setRows(data.rows || []);
      } catch (requestError) {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }

    load();
    return () => controller.abort();
  }, [start, end]);

  function exportCsv() {
    const lines = ["Employee,Days present,Hours,Projects"];
    rows.forEach((row) => {
      lines.push(
        [
          csvCell(row.worker?.name),
          row.days || 0,
          row.hours || 0,
          csvCell((row.projects || []).join("; ")),
        ].join(","),
      );
    });

    const url = URL.createObjectURL(
      new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `attendance-${start.slice(0, 10)}-${end.slice(0, 10)}.csv`;
    anchor.click();
    URL.revokeObjectURL(url);
  }

  const totals = rows.reduce(
    (result, row) => ({
      hours: result.hours + Number(row.hours || 0),
      days: result.days + Number(row.days || 0),
    }),
    { hours: 0, days: 0 },
  );

  return (
    <section className="rounded-xl border border-slate-200 bg-white">
      <div className="flex flex-col gap-4 border-b border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-semibold text-slate-950">Employee summary</h2>
          <p className="mt-1 text-sm text-slate-500">
            Hours, days attended and project allocation for the selected month.
          </p>
        </div>
        <button
          type="button"
          onClick={exportCsv}
          disabled={rows.length === 0}
          className="inline-flex items-center justify-center gap-2 rounded-lg border border-slate-300 bg-white px-3.5 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Download className="h-4 w-4" />
          Export CSV
        </button>
      </div>

      <div className="grid grid-cols-3 divide-x divide-slate-200 border-b border-slate-200 bg-slate-50/70">
        {[
          ["Employees", rows.length],
          ["Days present", totals.days],
          ["Total hours", `${totals.hours.toLocaleString("en-GB")}h`],
        ].map(([label, value]) => (
          <div key={label} className="px-5 py-4">
            <div className="text-xl font-semibold tabular-nums text-slate-950">
              {value}
            </div>
            <div className="mt-0.5 text-xs text-slate-500">{label}</div>
          </div>
        ))}
      </div>

      {error ? (
        <div className="m-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      ) : loading ? (
        <div className="py-16 text-center text-sm text-slate-500">
          Generating report…
        </div>
      ) : rows.length === 0 ? (
        <div className="flex flex-col items-center px-6 py-16 text-center">
          <FileBarChart2 className="h-8 w-8 text-slate-300" />
          <h3 className="mt-3 font-semibold text-slate-800">No report data</h3>
          <p className="mt-1 text-sm text-slate-500">
            No attendance entries were recorded in this period.
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                {["Employee", "Days present", "Hours", "Projects"].map(
                  (heading) => (
                    <th
                      key={heading}
                      className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-[0.06em] text-slate-500"
                    >
                      {heading}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {rows.map((row) => (
                <tr key={row.worker?._id} className="hover:bg-slate-50/70">
                  <td className="whitespace-nowrap px-5 py-4 text-sm font-semibold text-slate-900">
                    {row.worker?.name || "Unknown employee"}
                  </td>
                  <td className="px-5 py-4 text-sm tabular-nums text-slate-700">
                    {row.days || 0}
                  </td>
                  <td className="px-5 py-4 text-sm font-semibold tabular-nums text-slate-800">
                    {Number(row.hours || 0).toLocaleString("en-GB")}h
                  </td>
                  <td className="min-w-72 px-5 py-4 text-sm text-slate-600">
                    {(row.projects || []).join(", ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
