"use client";

import { useMemo, useState } from "react";
import useSWR from "swr";
import { CalendarDays, Check, List, RefreshCw, UserRound } from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";

export default function CRMTasksPage() {
  const [filters, setFilters] = useState({
    scope: "mine",
    window: "",
    status: "",
    priority: "",
  });
  const [mode, setMode] = useState("list");
  const query = useMemo(
    () =>
      new URLSearchParams(
        Object.entries(filters).filter(([, value]) => value),
      ).toString(),
    [filters],
  );
  const { data, mutate, isLoading } = useSWR(
    `/crm/tasks?${query}`,
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );
  const tasks = useMemo(() => data?.tasks || [], [data?.tasks]);
  const complete = async (task) => {
    await apiClient.patch(
      `/crm/leads/${task.leadId?.id || task.leadId?._id}/tasks/${task.id || task._id}`,
      { status: task.status === "completed" ? "pending" : "completed" },
    );
    await mutate();
    toast.success(
      task.status === "completed" ? "Task reopened" : "Task completed",
    );
  };
  const grouped = useMemo(
    () =>
      tasks.reduce((map, task) => {
        const key = task.dueDate
          ? new Date(task.dueDate).toLocaleDateString("en-GB", {
              weekday: "short",
              day: "numeric",
              month: "short",
            })
          : "No due date";
        if (!map[key]) map[key] = [];
        map[key].push(task);
        return map;
      }, {}),
    [tasks],
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-12">
      <header className="border-b border-slate-200 bg-white px-4 py-5 sm:px-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight text-slate-950">
              CRM Tasks
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Due work across every lead, owner and priority
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMode("list")}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${mode === "list" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"}`}
            >
              <List className="h-4 w-4" />
              List
            </button>
            <button
              onClick={() => setMode("calendar")}
              className={`inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-semibold ${mode === "calendar" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-200 bg-white text-slate-600"}`}
            >
              <CalendarDays className="h-4 w-4" />
              Calendar
            </button>
            <button
              onClick={() => mutate()}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-4">
          {[
            [
              "scope",
              [
                ["mine", "My tasks"],
                ["team", "Team tasks"],
              ],
            ],
            [
              "window",
              [
                ["", "Any date"],
                ["today", "Due today"],
                ["overdue", "Overdue"],
              ],
            ],
            [
              "status",
              [
                ["", "Any status"],
                ["pending", "Pending"],
                ["in_progress", "In progress"],
                ["completed", "Completed"],
              ],
            ],
            [
              "priority",
              [
                ["", "Any priority"],
                ["urgent", "Urgent"],
                ["high", "High"],
                ["medium", "Medium"],
                ["low", "Low"],
              ],
            ],
          ].map(([key, options]) => (
            <select
              key={key}
              value={filters[key]}
              onChange={(event) =>
                setFilters((current) => ({
                  ...current,
                  [key]: event.target.value,
                }))
              }
              className="rounded-lg border-slate-200 text-sm"
            >
              {options.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          ))}
        </div>
      </header>
      <main className="mx-auto max-w-6xl p-4 sm:p-6">
        {isLoading ? (
          <div className="h-32 animate-pulse rounded-xl bg-white" />
        ) : mode === "list" ? (
          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-4 py-3">Task</th>
                  <th className="hidden px-4 py-3 md:table-cell">Lead</th>
                  <th className="hidden px-4 py-3 sm:table-cell">Owner</th>
                  <th className="px-4 py-3">Due</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {tasks.map((task) => {
                  const overdue =
                    task.status !== "completed" &&
                    task.dueDate &&
                    new Date(task.dueDate) < new Date();
                  return (
                    <tr key={task.id || task._id}>
                      <td className="px-4 py-3">
                        <div className="flex items-start gap-3">
                          <button
                            onClick={() => complete(task)}
                            className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${task.status === "completed" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}
                          >
                            {task.status === "completed" ? (
                              <Check className="h-3 w-3" />
                            ) : null}
                          </button>
                          <div>
                            <p
                              className={`font-semibold ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}
                            >
                              {task.title}
                            </p>
                            <p className="mt-1 text-xs capitalize text-slate-500">
                              {task.priority}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="hidden px-4 py-3 font-medium text-slate-700 md:table-cell">
                        {task.leadId?.name}
                      </td>
                      <td className="hidden px-4 py-3 text-slate-600 sm:table-cell">
                        <span className="inline-flex items-center gap-1.5">
                          <UserRound className="h-3.5 w-3.5" />
                          {task.assignedTo?.name || "Unassigned"}
                        </span>
                      </td>
                      <td
                        className={`px-4 py-3 text-xs font-medium ${overdue ? "text-rose-700" : "text-slate-600"}`}
                      >
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleString("en-GB", {
                              day: "numeric",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {!tasks.length ? (
              <div className="p-10 text-center text-sm text-slate-500">
                No tasks match these filters
              </div>
            ) : null}
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {Object.entries(grouped).map(([date, items]) => (
              <section
                key={date}
                className="rounded-xl border border-slate-200 bg-white p-4"
              >
                <h2 className="text-sm font-semibold text-slate-900">{date}</h2>
                <div className="mt-3 space-y-2">
                  {items.map((task) => (
                    <button
                      key={task.id || task._id}
                      onClick={() => complete(task)}
                      className="flex w-full items-start gap-2 rounded-lg border border-slate-100 p-3 text-left hover:bg-slate-50"
                    >
                      <span
                        className={`mt-0.5 h-2 w-2 rounded-full ${task.priority === "urgent" ? "bg-rose-500" : task.priority === "high" ? "bg-amber-500" : "bg-blue-500"}`}
                      />
                      <span>
                        <span className="block text-sm font-semibold text-slate-800">
                          {task.title}
                        </span>
                        <span className="mt-1 block text-xs text-slate-500">
                          {task.leadId?.name}
                        </span>
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
