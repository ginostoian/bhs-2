"use client";

import { useMemo, useState } from "react";
import {
  addDays,
  buildGanttLayout,
  daysBetween,
  formatGanttDate,
  utcDay,
} from "@/libs/ganttTimeline.mjs";

const statusColors = {
  Scheduled: "bg-slate-400",
  "In Progress": "bg-blue-600",
  Blocked: "bg-red-500",
  Done: "bg-emerald-600",
};

export default function GanttTimeline({
  tasks = [],
  sections = [],
  milestones = [],
}) {
  const [zoom, setZoom] = useState("week");
  const layout = useMemo(
    () => buildGanttLayout({ tasks, milestones, zoom }),
    [tasks, milestones, zoom],
  );
  const today = utcDay(new Date());
  const todayOffset =
    layout.start && today >= layout.start && today <= layout.end
      ? daysBetween(layout.start, today) * layout.dayWidth + layout.dayWidth / 2
      : null;
  const groups = sections.map((section) => ({
    ...section,
    tasks: layout.scheduled.filter(
      (task) => (task.section?.id || task.section) === section.id,
    ),
  }));
  const sectionIds = new Set(sections.map((section) => section.id));
  const otherTasks = layout.scheduled.filter(
    (task) => !sectionIds.has(task.section?.id || task.section),
  );
  if (otherTasks.length)
    groups.push({ id: "other", name: "Other tasks", tasks: otherTasks });
  const monthBands = [];
  if (layout.start) {
    for (let date = layout.start; date <= layout.end; date = addDays(date, 1)) {
      const key = `${date.getUTCFullYear()}-${date.getUTCMonth()}`;
      const last = monthBands[monthBands.length - 1];
      if (last?.key === key) last.days += 1;
      else monthBands.push({ key, date, days: 1 });
    }
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Project schedule
          </h2>
          <p className="text-sm text-slate-500">
            Bars show planned start and estimated calendar days. Dates are
            editable in Site Tasks.
          </p>
        </div>
        <div
          className="inline-flex rounded-md border border-slate-200 bg-white p-1"
          aria-label="Timeline scale"
        >
          {["week", "day"].map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setZoom(option)}
              aria-pressed={zoom === option}
              className={`rounded px-3 py-1.5 text-sm capitalize ${zoom === option ? "bg-blue-700 text-white" : "text-slate-600 hover:bg-slate-100"}`}
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      {!layout.start ? (
        <div className="rounded-lg border border-dashed border-slate-300 p-8 text-center text-sm text-slate-600">
          Add a planned start date to a site task or a milestone date to build
          the schedule.
        </div>
      ) : (
        <div
          className="max-w-full overflow-x-auto rounded-lg border border-slate-200 bg-white"
          role="region"
          aria-label="Project Gantt chart"
          tabIndex={0}
        >
          <div style={{ width: layout.width + 236 }}>
            <div className="sticky top-0 z-20 flex border-b border-slate-200 bg-slate-50">
              <div className="sticky left-0 z-30 flex w-[236px] shrink-0 items-end border-r border-slate-200 bg-slate-50 px-3 py-3 text-xs font-semibold uppercase tracking-wide text-slate-600">
                Task / milestone
              </div>
              <div style={{ width: layout.width }}>
                <div className="flex h-7 border-b border-slate-200">
                  {monthBands.map((band) => (
                    <div
                      key={band.key}
                      className="shrink-0 overflow-hidden border-r border-slate-200 px-2 py-1 text-xs font-semibold text-slate-700"
                      style={{ width: band.days * layout.dayWidth }}
                    >
                      {band.days * layout.dayWidth >= 90
                        ? new Intl.DateTimeFormat("en-GB", {
                            month: "long",
                            year: "numeric",
                            timeZone: "UTC",
                          }).format(band.date)
                        : ""}
                    </div>
                  ))}
                </div>
                <div className="relative h-11">
                  {layout.ticks.map((tick) => (
                    <div
                      key={tick.toISOString()}
                      className="absolute top-0 flex h-full items-center border-l border-slate-200 px-2 text-xs font-medium text-slate-600"
                      style={{
                        left: daysBetween(layout.start, tick) * layout.dayWidth,
                        width: layout.dayWidth * (zoom === "day" ? 1 : 7),
                      }}
                    >
                      {zoom === "day"
                        ? formatGanttDate(tick, {
                            day: "numeric",
                            month: "short",
                          })
                        : `Week of ${formatGanttDate(tick)}`}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {groups
              .filter((group) => group.tasks.length)
              .map((group) => (
                <div key={group.id}>
                  <div className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
                    {group.name}
                  </div>
                  {group.tasks.map((task) => (
                    <div
                      key={task.id}
                      className="flex h-12 border-b border-slate-100"
                    >
                      <div className="sticky left-0 z-10 flex w-[236px] shrink-0 flex-col justify-center border-r border-slate-200 bg-white px-3">
                        <span
                          className="truncate text-sm font-medium text-slate-900"
                          title={task.name}
                        >
                          {task.name}
                        </span>
                        <span className="truncate text-xs text-slate-500">
                          {task.assignedWorkers?.filter(Boolean).length
                            ? task.assignedWorkers
                                .filter(Boolean)
                                .map((worker) => worker.name)
                                .join(", ")
                            : task.assignedTo?.name || "Unassigned"}
                        </span>
                      </div>
                      <div
                        className="relative h-12"
                        style={{
                          width: layout.width,
                          backgroundImage: `repeating-linear-gradient(to right, transparent 0, transparent ${layout.dayWidth * (zoom === "day" ? 1 : 7) - 1}px, #e2e8f0 ${layout.dayWidth * (zoom === "day" ? 1 : 7) - 1}px, #e2e8f0 ${layout.dayWidth * (zoom === "day" ? 1 : 7)}px)`,
                        }}
                      >
                        {todayOffset !== null && (
                          <div
                            className="absolute inset-y-0 z-10 w-px bg-blue-700"
                            style={{ left: todayOffset }}
                          />
                        )}
                        <div
                          className={`absolute top-3 h-6 rounded-sm ${statusColors[task.status] || statusColors.Scheduled}`}
                          style={{
                            left:
                              daysBetween(layout.start, task.start) *
                                layout.dayWidth +
                              2,
                            width: Math.max(
                              4,
                              task.duration * layout.dayWidth - 4,
                            ),
                          }}
                          title={`${task.name}: ${formatGanttDate(task.start)}–${formatGanttDate(task.end)} · ${task.status}`}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            {layout.milestones.length > 0 && (
              <div>
                <div className="border-b border-slate-200 bg-slate-100 px-3 py-2 text-xs font-semibold uppercase tracking-wide text-slate-700">
                  Milestones
                </div>
                {layout.milestones.map((milestone) => (
                  <div
                    key={milestone.id}
                    className="flex h-11 border-b border-slate-100"
                  >
                    <div className="sticky left-0 z-10 flex w-[236px] shrink-0 items-center truncate border-r border-slate-200 bg-white px-3 text-sm font-medium text-slate-900">
                      {milestone.name}
                    </div>
                    <div
                      className="relative h-11"
                      style={{ width: layout.width }}
                    >
                      {todayOffset !== null && (
                        <div
                          className="absolute inset-y-0 w-px bg-blue-700"
                          style={{ left: todayOffset }}
                        />
                      )}
                      <div
                        className="absolute top-4 h-3 w-3 rotate-45 border-2 border-blue-700 bg-white"
                        style={{
                          left:
                            daysBetween(layout.start, milestone.date) *
                            layout.dayWidth,
                        }}
                        title={`${milestone.name}: ${formatGanttDate(milestone.date)}`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      {layout.undated.length > 0 && (
        <p className="mt-3 text-sm text-amber-800">
          {layout.undated.length} site task
          {layout.undated.length === 1 ? "" : "s"} without a planned start date{" "}
          {layout.start ? "are not shown on the timeline" : "need scheduling"}.
        </p>
      )}
      <div className="mt-4 flex flex-wrap gap-4 text-xs text-slate-600">
        {Object.entries(statusColors).map(([status, color]) => (
          <span key={status} className="flex items-center gap-1.5">
            <i className={`h-2.5 w-2.5 rounded-sm ${color}`} />
            {status}
          </span>
        ))}
        <span className="flex items-center gap-1.5">
          <i className="h-2.5 w-2.5 rotate-45 border border-blue-700" />
          Milestone
        </span>
        {todayOffset !== null && (
          <span className="flex items-center gap-1.5">
            <i className="h-3 w-px bg-blue-700" />
            Today
          </span>
        )}
      </div>
    </div>
  );
}
