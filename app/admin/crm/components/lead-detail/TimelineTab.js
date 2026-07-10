"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Activity,
  CheckSquare2,
  FileText,
  History,
  Mail,
  Plus,
} from "lucide-react";
import apiClient from "@/libs/api";

const icons = {
  activity: Activity,
  email: Mail,
  note: FileText,
  task: CheckSquare2,
  history: History,
};

export default function TimelineTab({ leadId }) {
  const { data, isLoading, mutate } = useSWR(
    `/crm/leads/${leadId}/timeline`,
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState({
    type: "call",
    title: "",
    description: "",
    contactMade: true,
  });
  const add = async () => {
    if (!draft.title.trim()) return;
    await apiClient.post(`/crm/leads/${leadId}/activities`, draft);
    setDraft({ type: "call", title: "", description: "", contactMade: true });
    setOpen(false);
    await mutate();
  };
  if (isLoading)
    return (
      <div className="space-y-3">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="h-24 animate-pulse rounded-xl bg-slate-100"
          />
        ))}
      </div>
    );
  return (
    <div>
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
        >
          <Plus className="h-4 w-4" />
          Log activity
        </button>
      </div>
      {open ? (
        <section className="mb-5 space-y-3 rounded-xl border border-slate-200 bg-white p-4">
          <div className="grid gap-3 sm:grid-cols-2">
            <select
              value={draft.type}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  type: event.target.value,
                }))
              }
              className="rounded-lg border-slate-200 text-sm"
            >
              <option value="call">Call</option>
              <option value="email">Email</option>
              <option value="meeting">Meeting</option>
              <option value="site_visit">Site visit</option>
            </select>
            <input
              value={draft.title}
              onChange={(event) =>
                setDraft((current) => ({
                  ...current,
                  title: event.target.value,
                }))
              }
              className="rounded-lg border-slate-200 text-sm"
              placeholder="Activity title"
            />
          </div>
          <textarea
            value={draft.description}
            onChange={(event) =>
              setDraft((current) => ({
                ...current,
                description: event.target.value,
              }))
            }
            rows={2}
            className="w-full rounded-lg border-slate-200 text-sm"
            placeholder="Outcome and next step"
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={draft.contactMade}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    contactMade: event.target.checked,
                  }))
                }
                className="rounded border-slate-300 text-blue-600"
              />
              Contact made
            </label>
            <button
              onClick={add}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
            >
              Save
            </button>
          </div>
        </section>
      ) : null}
      <div className="relative space-y-0 before:absolute before:bottom-4 before:left-5 before:top-4 before:w-px before:bg-slate-200">
        {(data?.timeline || []).map((entry, index) => {
          const Icon = icons[entry.kind] || Activity;
          const item = entry.item;
          const title =
            item.title ||
            item.subject ||
            (entry.kind === "history" ? "Lead details updated" : entry.kind);
          const body =
            item.description ||
            item.body ||
            (entry.kind === "task"
              ? `${item.status} · ${item.priority}`
              : entry.kind === "history"
                ? item.body
                : "");
          return (
            <article
              key={`${entry.kind}-${item._id || index}`}
              className="relative flex gap-3 pb-5"
            >
              <span className="z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
                <Icon className="h-4 w-4" />
              </span>
              <div className="min-w-0 flex-1 rounded-xl border border-slate-200 bg-white p-3">
                <div className="flex items-start justify-between gap-3">
                  <h3 className="text-sm font-semibold text-slate-900">
                    {title}
                  </h3>
                  <time className="whitespace-nowrap text-[11px] text-slate-400">
                    {new Date(entry.at).toLocaleString("en-GB", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </time>
                </div>
                {body ? (
                  <p className="mt-1.5 whitespace-pre-wrap text-sm text-slate-600">
                    {body}
                  </p>
                ) : null}
              </div>
            </article>
          );
        })}
        {!data?.timeline?.length ? (
          <div className="relative rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
            No timeline events yet
          </div>
        ) : null}
      </div>
    </div>
  );
}
