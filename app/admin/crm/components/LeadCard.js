"use client";

import { useState } from "react";
import {
  AlarmClock,
  CalendarCheck,
  ChevronDown,
  CirclePause,
  CirclePlay,
  GripVertical,
  MailCheck,
  UserRound,
} from "lucide-react";
import { CRM_STAGES } from "@/libs/crmStages";

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

const agingStyle = (days) => {
  if (days >= 14) return "border-rose-200 bg-rose-50 text-rose-700";
  if (days >= 7) return "border-amber-200 bg-amber-50 text-amber-700";
  return "border-emerald-200 bg-emerald-50 text-emerald-700";
};

const automationSignal = (automation) => {
  if (!automation)
    return {
      label: "No automation",
      Icon: CirclePause,
      className: "text-slate-400",
    };
  if (automation.leadReplied)
    return { label: "Replied", Icon: MailCheck, className: "text-emerald-700" };
  if (automation.isActive)
    return {
      label: "Automation active",
      Icon: CirclePlay,
      className: "text-blue-700",
    };
  return {
    label: automation.pausedReason || "Automation paused",
    Icon: CirclePause,
    className: "text-slate-500",
  };
};

export default function LeadCard({
  lead,
  onClick,
  onStageUpdate,
  selected,
  onSelect,
}) {
  const [updating, setUpdating] = useState(false);
  const automation = automationSignal(lead.emailAutomation);
  const value = lead.estimatedValue || lead.value || 0;
  const nextAction = lead.overdueTaskCount
    ? `${lead.overdueTaskCount} overdue task${lead.overdueTaskCount > 1 ? "s" : ""}`
    : lead.nextFollowUpDate
      ? `Follow up ${new Date(lead.nextFollowUpDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}`
      : "Set next action";

  const changeStage = async (event) => {
    event.stopPropagation();
    const stage = event.target.value;
    if (stage === lead.stage) return;
    setUpdating(true);
    try {
      await onStageUpdate(
        lead.id || lead._id,
        stage,
        `Moved from ${lead.stage} to ${stage}`,
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <article
      className={`group relative rounded-xl border bg-white p-3.5 shadow-[0_1px_2px_rgba(15,23,42,0.05)] transition hover:border-blue-200 hover:shadow-[0_8px_24px_rgba(15,23,42,0.08)] ${selected ? "border-blue-500 ring-2 ring-blue-100" : "border-slate-200"}`}
    >
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          checked={selected}
          onChange={(event) =>
            onSelect(lead.id || lead._id, event.target.checked)
          }
          onClick={(event) => event.stopPropagation()}
          aria-label={`Select ${lead.name}`}
          className="mt-1 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
        />
        <button
          type="button"
          onClick={onClick}
          className="min-w-0 flex-1 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
        >
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <h4 className="truncate text-sm font-semibold text-slate-950">
                {lead.name}
              </h4>
              <p className="mt-0.5 text-sm font-medium text-slate-700">
                {currency.format(value)}
              </p>
            </div>
            <GripVertical
              className="h-4 w-4 shrink-0 text-slate-300"
              aria-hidden="true"
            />
          </div>

          <div className="mt-3 space-y-1.5 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-slate-100 text-[9px] font-bold text-slate-700">
                {lead.assignedTo?.name
                  ?.split(" ")
                  .map((part) => part[0])
                  .join("")
                  .slice(0, 2) || <UserRound className="h-3 w-3" />}
              </span>
              <span className="truncate">
                {lead.assignedTo?.name || "Unassigned"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="truncate">
                {lead.source === "Other"
                  ? lead.customSource || "Other"
                  : lead.source}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-300" />
              <span className="truncate">
                {lead.projectTypes?.[0] ||
                  lead.customProjectType ||
                  "Project not set"}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <span
              className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-1 text-[11px] font-semibold ${agingStyle(lead.agingDays || 0)}`}
            >
              <AlarmClock className="h-3 w-3" />
              {lead.agingDays || 0}d
            </span>
            <span className="rounded-md bg-slate-950 px-1.5 py-1 text-[11px] font-semibold text-white">
              Score {lead.leadScore || 0}
            </span>
          </div>
        </button>
      </div>

      <div
        className={`mt-3 flex items-center gap-1.5 border-t border-slate-100 pt-2.5 text-[11px] font-medium ${lead.overdueTaskCount ? "text-rose-700" : "text-slate-600"}`}
      >
        {lead.overdueTaskCount ? (
          <AlarmClock className="h-3.5 w-3.5" />
        ) : (
          <CalendarCheck className="h-3.5 w-3.5" />
        )}
        <span className="truncate">{nextAction}</span>
      </div>
      <div
        className={`mt-2 flex items-center gap-1.5 text-[11px] font-medium ${automation.className}`}
        title={automation.label}
      >
        <automation.Icon className="h-3.5 w-3.5" />
        <span className="truncate">{automation.label}</span>
      </div>

      <div
        className="relative mt-2.5"
        onClick={(event) => event.stopPropagation()}
      >
        <select
          value={lead.stage}
          onChange={changeStage}
          disabled={updating}
          aria-label={`Change stage for ${lead.name}`}
          className="w-full appearance-none rounded-lg border border-slate-200 bg-slate-50 py-1.5 pl-2.5 pr-7 text-[11px] font-medium text-slate-700 focus:border-blue-500 focus:ring-blue-500"
        >
          {CRM_STAGES.map((stage) => (
            <option key={stage}>{stage}</option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-2 top-2 h-3 w-3 text-slate-400" />
      </div>
    </article>
  );
}
