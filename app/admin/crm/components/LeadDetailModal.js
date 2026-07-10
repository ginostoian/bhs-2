"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import useSWR from "swr";
import {
  CalendarDays,
  FileText,
  History,
  ListTodo,
  Mail,
  PanelRightClose,
  UserRound,
} from "lucide-react";
import apiClient from "@/libs/api";

const OverviewTab = dynamic(() => import("./lead-detail/OverviewTab"));
const TimelineTab = dynamic(() => import("./lead-detail/TimelineTab"));
const NotesTab = dynamic(() => import("./lead-detail/NotesTab"));
const TasksTab = dynamic(() => import("./lead-detail/TasksTab"));
const EmailsTab = dynamic(() => import("./lead-detail/EmailsTab"));
const HistoryTab = dynamic(() => import("./lead-detail/HistoryTab"));

const tabs = [
  { id: "overview", label: "Overview", Icon: UserRound },
  { id: "timeline", label: "Timeline", Icon: CalendarDays },
  { id: "notes", label: "Notes", Icon: FileText },
  { id: "tasks", label: "Tasks", Icon: ListTodo },
  { id: "emails", label: "Emails", Icon: Mail },
  { id: "history", label: "History", Icon: History },
];
const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

export default function LeadDetailModal({
  lead,
  onClose,
  onUpdate,
  onStageUpdate,
  onRefresh,
}) {
  const leadId = lead.id || lead._id;
  const [activeTab, setActiveTab] = useState("overview");
  const closeButton = useRef(null);
  const { data, mutate } = useSWR(
    `/crm/leads/${leadId}`,
    (url) => apiClient.get(url),
    { fallbackData: { lead }, revalidateOnFocus: false },
  );
  const { data: users } = useSWR(
    "/admin/check-users",
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );
  const detail = data?.lead || lead;
  const admins = (users?.users || []).filter((user) => user.role === "admin");

  useEffect(() => {
    closeButton.current?.focus();
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const save = async (id, updates) => {
    const updated = await onUpdate(id, updates);
    await mutate({ lead: updated }, false);
    await onRefresh?.();
  };
  const changeStage = async (...args) => {
    await onStageUpdate(...args);
    await Promise.all([mutate(), onRefresh?.()]);
  };
  const score = detail.leadScore || 0;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-950/30"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <aside
        role="dialog"
        aria-modal="true"
        aria-labelledby="lead-title"
        className="animate-in slide-in-from-right flex h-full w-full max-w-2xl flex-col bg-slate-50 shadow-2xl duration-200"
      >
        <header className="flex-none border-b border-slate-200 bg-white px-4 pb-0 pt-4 sm:px-6">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex items-center gap-3">
                <h2
                  id="lead-title"
                  className="truncate text-xl font-semibold text-slate-950"
                >
                  {detail.name}
                </h2>
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 border-emerald-500 text-sm font-bold text-emerald-700">
                  {score}
                </span>
              </div>
              <p className="mt-1 truncate text-sm text-slate-500">
                {detail.email} {detail.phone ? `· ${detail.phone}` : ""}
              </p>
            </div>
            <button
              ref={closeButton}
              onClick={onClose}
              className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
              aria-label="Close lead workspace"
            >
              <PanelRightClose className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-4 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 text-sm sm:grid-cols-4">
            <div className="bg-white p-3">
              <p className="text-[11px] font-semibold uppercase text-slate-400">
                Stage
              </p>
              <p className="mt-1 truncate font-semibold text-blue-700">
                {detail.stage}
              </p>
            </div>
            <div className="bg-white p-3">
              <p className="text-[11px] font-semibold uppercase text-slate-400">
                Owner
              </p>
              <p className="mt-1 truncate font-semibold text-slate-800">
                {detail.assignedTo?.name || "Unassigned"}
              </p>
            </div>
            <div className="bg-white p-3">
              <p className="text-[11px] font-semibold uppercase text-slate-400">
                Est. value
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {currency.format(detail.estimatedValue || detail.value || 0)}
              </p>
            </div>
            <div className="bg-white p-3">
              <p className="text-[11px] font-semibold uppercase text-slate-400">
                Expected close
              </p>
              <p className="mt-1 font-semibold text-slate-800">
                {detail.expectedCloseDate
                  ? new Date(detail.expectedCloseDate).toLocaleDateString(
                      "en-GB",
                      { day: "numeric", month: "short", year: "numeric" },
                    )
                  : "Not set"}
              </p>
            </div>
          </div>
          <nav
            role="tablist"
            aria-label="Lead details"
            className="mt-4 flex gap-1 overflow-x-auto"
          >
            {tabs.map(({ id, label, Icon }) => (
              <button
                key={id}
                role="tab"
                aria-selected={activeTab === id}
                onClick={() => setActiveTab(id)}
                className={`inline-flex shrink-0 items-center gap-1.5 border-b-2 px-2 py-3 text-xs font-semibold ${activeTab === id ? "border-blue-600 text-blue-700" : "border-transparent text-slate-500 hover:text-slate-800"}`}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </nav>
        </header>
        <div
          role="tabpanel"
          className="min-h-0 flex-1 overflow-y-auto p-4 sm:p-6"
        >
          {activeTab === "overview" ? (
            <OverviewTab
              lead={detail}
              admins={admins}
              onSave={save}
              onStageUpdate={changeStage}
            />
          ) : null}
          {activeTab === "timeline" ? <TimelineTab leadId={leadId} /> : null}
          {activeTab === "notes" ? <NotesTab leadId={leadId} /> : null}
          {activeTab === "tasks" ? (
            <TasksTab
              leadId={leadId}
              leadOwner={detail.assignedTo?.id || detail.assignedTo?._id || ""}
            />
          ) : null}
          {activeTab === "emails" ? <EmailsTab leadId={leadId} /> : null}
          {activeTab === "history" ? (
            <HistoryTab history={detail.versionHistory || []} users={admins} />
          ) : null}
        </div>
      </aside>
    </div>
  );
}
