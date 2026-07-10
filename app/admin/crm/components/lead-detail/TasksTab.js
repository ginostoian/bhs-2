"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  AlarmClock,
  CalendarClock,
  Check,
  Edit3,
  Trash2,
  UserRound,
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";

const localDateTime = (date) => {
  const value = date ? new Date(date) : new Date();
  value.setMinutes(value.getMinutes() - value.getTimezoneOffset());
  return value.toISOString().slice(0, 16);
};
const blank = {
  title: "",
  description: "",
  assignedTo: "",
  dueDate: "",
  priority: "medium",
  reminderOffsetHours: "24",
};
const field =
  "w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500";

export default function TasksTab({ leadId, leadOwner }) {
  const { data, mutate, isLoading } = useSWR(
    `/crm/leads/${leadId}/tasks`,
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );
  const { data: users } = useSWR(
    "/admin/check-users",
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );
  const admins = (users?.users || []).filter((user) => user.role === "admin");
  const [draft, setDraft] = useState({ ...blank, assignedTo: leadOwner || "" });
  const [editing, setEditing] = useState(null);
  const set = (key, value) =>
    setDraft((current) => ({ ...current, [key]: value }));
  const preset = (days) => {
    const date = new Date();
    date.setDate(date.getDate() + days);
    date.setHours(days === 0 ? 17 : 9, 0, 0, 0);
    set("dueDate", localDateTime(date));
  };
  const save = async () => {
    if (!draft.title.trim()) return;
    if (editing)
      await apiClient.patch(`/crm/leads/${leadId}/tasks/${editing}`, draft);
    else await apiClient.post(`/crm/leads/${leadId}/tasks`, draft);
    setDraft({ ...blank, assignedTo: leadOwner || "" });
    setEditing(null);
    await mutate();
    toast.success(editing ? "Task updated" : "Task created");
  };
  const complete = async (task) => {
    await apiClient.patch(`/crm/leads/${leadId}/tasks/${task.id || task._id}`, {
      status: task.status === "completed" ? "pending" : "completed",
    });
    await mutate();
  };
  const remove = async (task) => {
    if (!window.confirm("Delete this task?")) return;
    await apiClient.delete(`/crm/leads/${leadId}/tasks/${task.id || task._id}`);
    await mutate();
  };

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <h3 className="text-sm font-semibold text-slate-900">
          {editing ? "Edit task" : "Add a task"}
        </h3>
        <div className="mt-3 space-y-3">
          <input
            value={draft.title}
            onChange={(event) => set("title", event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                save();
              }
            }}
            className={field}
            placeholder="What needs to be done?"
          />
          <textarea
            value={draft.description}
            onChange={(event) => set("description", event.target.value)}
            className={field}
            rows={2}
            placeholder="Description or outcome"
          />
          <div className="flex flex-wrap gap-2">
            {[
              [0, "Today"],
              [1, "Tomorrow"],
              [7, "Next week"],
            ].map(([days, label]) => (
              <button
                key={label}
                onClick={() => preset(days)}
                className="rounded-md border border-slate-200 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                {label}
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">
                Due date and time
              </span>
              <input
                type="datetime-local"
                value={draft.dueDate}
                onChange={(event) => set("dueDate", event.target.value)}
                className={field}
              />
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">
                Assignee
              </span>
              <select
                value={draft.assignedTo}
                onChange={(event) => set("assignedTo", event.target.value)}
                className={field}
              >
                <option value="">Lead owner</option>
                {admins.map((admin) => (
                  <option key={admin.id} value={admin.id}>
                    {admin.name || admin.email}
                  </option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">
                Priority
              </span>
              <select
                value={draft.priority}
                onChange={(event) => set("priority", event.target.value)}
                className={field}
              >
                {["low", "medium", "high", "urgent"].map((value) => (
                  <option key={value}>{value}</option>
                ))}
              </select>
            </label>
            <label className="space-y-1">
              <span className="text-xs font-semibold text-slate-600">
                Reminder
              </span>
              <select
                value={draft.reminderOffsetHours}
                onChange={(event) =>
                  set("reminderOffsetHours", event.target.value)
                }
                className={field}
              >
                <option value="0">At due time</option>
                <option value="1">1 hour before</option>
                <option value="24">1 day before</option>
                <option value="168">1 week before</option>
              </select>
            </label>
          </div>
        </div>
        <div className="mt-3 flex justify-end gap-2">
          {editing ? (
            <button
              onClick={() => {
                setEditing(null);
                setDraft({ ...blank, assignedTo: leadOwner || "" });
              }}
              className="rounded-lg px-3 py-2 text-sm font-semibold text-slate-600"
            >
              Cancel
            </button>
          ) : null}
          <button
            onClick={save}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
          >
            {editing ? "Save task" : "Add task"}
          </button>
        </div>
      </section>

      <div className="space-y-2.5">
        {isLoading ? (
          <div className="h-20 animate-pulse rounded-xl bg-slate-100" />
        ) : (
          (data?.tasks || []).map((task) => {
            const overdue =
              task.status !== "completed" &&
              task.dueDate &&
              new Date(task.dueDate) < new Date();
            return (
              <article
                key={task.id || task._id}
                className={`flex gap-3 rounded-xl border bg-white p-3.5 ${overdue ? "border-rose-200" : "border-slate-200"}`}
              >
                <button
                  onClick={() => complete(task)}
                  className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border ${task.status === "completed" ? "border-emerald-600 bg-emerald-600 text-white" : "border-slate-300"}`}
                  aria-label={
                    task.status === "completed"
                      ? "Reopen task"
                      : "Complete task"
                  }
                >
                  {task.status === "completed" ? (
                    <Check className="h-3 w-3" />
                  ) : null}
                </button>
                <div className="min-w-0 flex-1">
                  <p
                    className={`text-sm font-semibold ${task.status === "completed" ? "text-slate-400 line-through" : "text-slate-900"}`}
                  >
                    {task.title}
                  </p>
                  {task.description ? (
                    <p className="mt-1 text-sm text-slate-600">
                      {task.description}
                    </p>
                  ) : null}
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-500">
                    <span
                      className={`inline-flex items-center gap-1 ${overdue ? "font-semibold text-rose-700" : ""}`}
                    >
                      <CalendarClock className="h-3.5 w-3.5" />
                      {task.dueDate
                        ? new Date(task.dueDate).toLocaleString("en-GB", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "No due date"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <UserRound className="h-3.5 w-3.5" />
                      {task.assignedTo?.name || "Unassigned"}
                    </span>
                    <span className="inline-flex items-center gap-1 capitalize">
                      <AlarmClock className="h-3.5 w-3.5" />
                      {task.priority}
                    </span>
                  </div>
                </div>
                <div className="flex">
                  <button
                    onClick={() => {
                      setEditing(task.id || task._id);
                      setDraft({
                        title: task.title,
                        description: task.description || "",
                        assignedTo:
                          task.assignedTo?.id || task.assignedTo?._id || "",
                        dueDate: task.dueDate
                          ? localDateTime(task.dueDate)
                          : "",
                        priority: task.priority,
                        reminderOffsetHours: "24",
                      });
                    }}
                    className="p-1.5 text-slate-400 hover:text-blue-600"
                    aria-label="Edit task"
                  >
                    <Edit3 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => remove(task)}
                    className="p-1.5 text-slate-400 hover:text-rose-600"
                    aria-label="Delete task"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </article>
            );
          })
        )}
        {!isLoading && !data?.tasks?.length ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No tasks yet
          </div>
        ) : null}
      </div>
    </div>
  );
}
