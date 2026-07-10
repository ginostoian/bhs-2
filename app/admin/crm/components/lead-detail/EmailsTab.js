"use client";

import { useState } from "react";
import useSWR from "swr";
import {
  Check,
  ChevronDown,
  ChevronUp,
  CirclePause,
  CirclePlay,
  Clock3,
  Eye,
  MailCheck,
  SkipForward,
  TriangleAlert,
} from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";

const statusStyles = {
  sent: {
    label: "Sent",
    className: "bg-emerald-50 text-emerald-700",
    Icon: Check,
  },
  skipped: {
    label: "Skipped",
    className: "bg-slate-100 text-slate-600",
    Icon: SkipForward,
  },
  failed: {
    label: "Delivery failed",
    className: "bg-rose-50 text-rose-700",
    Icon: TriangleAlert,
  },
  next: {
    label: "Next",
    className: "bg-blue-50 text-blue-700",
    Icon: Clock3,
  },
  upcoming: {
    label: "Upcoming",
    className: "bg-slate-50 text-slate-500",
    Icon: Clock3,
  },
};

const sequenceLabel = (key) =>
  key?.replaceAll("_", " ").replace(/^./, (letter) => letter.toUpperCase()) ||
  "No sequence";

const scheduleLabel = (dayOffset) =>
  dayOffset === 0 ? "Immediately" : `Day ${dayOffset}`;

const dueFormatter = new Intl.DateTimeFormat("en-GB", {
  weekday: "short",
  day: "numeric",
  month: "short",
  hour: "2-digit",
  minute: "2-digit",
});

export default function EmailsTab({ leadId }) {
  const [showSequence, setShowSequence] = useState(false);
  const { data, mutate, isLoading } = useSWR(
    `/crm/email-automation/${leadId}`,
    (url) => apiClient.get(url),
    { revalidateOnFocus: false, shouldRetryOnError: false },
  );
  const automation = data?.automation;
  const sequence = data?.sequencePreview || [];
  const action = async (name) => {
    await apiClient.post(`/crm/email-automation/${leadId}`, {
      action: name,
      reason: name === "pause" ? "Paused by admin in CRM" : undefined,
    });
    await mutate();
    toast.success(`Automation ${name === "skip" ? "advanced" : `${name}d`}`);
  };
  if (isLoading)
    return <div className="h-40 animate-pulse rounded-xl bg-slate-100" />;
  if (!automation)
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-sm text-slate-500">
        No automation exists for this lead.
      </div>
    );
  const totalSteps = sequence.length;
  const completedSteps = Math.min(automation.sequenceStep || 0, totalSteps);
  const sentSteps = sequence.filter((step) => step.status === "sent").length;
  const skippedSteps = sequence.filter(
    (step) => step.status === "skipped",
  ).length;
  const nextStep = sequence.find((step) =>
    ["next", "failed"].includes(step.status),
  );
  const progress = totalSteps
    ? Math.round((completedSteps / totalSteps) * 100)
    : 0;
  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Sequence
            </p>
            <h3 className="mt-1 font-semibold text-slate-950">
              {sequenceLabel(automation.sequenceKey)}
            </h3>
            <p className="mt-1 text-sm font-medium text-slate-700">
              {nextStep
                ? `Email ${nextStep.stepNumber} of ${totalSteps} is ${nextStep.status === "failed" ? "waiting to retry" : "next"}`
                : totalSteps && completedSteps >= totalSteps
                  ? "Sequence complete"
                  : `${completedSteps} of ${totalSteps} steps processed`}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              {automation.nextActionDue
                ? `Scheduled for ${dueFormatter.format(new Date(automation.nextActionDue))}`
                : automation.pausedReason || "No further email is scheduled"}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-xs font-semibold ${automation.isActive ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}
          >
            {automation.isActive ? (
              <CirclePlay className="h-3.5 w-3.5" />
            ) : (
              <CirclePause className="h-3.5 w-3.5" />
            )}
            {automation.isActive ? "Active" : "Paused"}
          </span>
        </div>
        {totalSteps ? (
          <div
            className="mt-4"
            aria-label={`${progress}% of sequence completed`}
          >
            <div className="mb-1.5 flex items-center justify-between text-[11px] font-medium text-slate-500">
              <span>
                {sentSteps} sent
                {skippedSteps ? ` · ${skippedSteps} skipped` : ""}
              </span>
              <span>{totalSteps} total</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600 transition-[width]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        ) : null}
        <div className="mt-4 flex flex-wrap gap-2">
          {automation.isActive ? (
            <button
              onClick={() => action("pause")}
              className="rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
            >
              Pause
            </button>
          ) : (
            <button
              onClick={() => action("resume")}
              className="rounded-lg bg-blue-600 px-3 py-2 text-sm font-semibold text-white"
            >
              Resume
            </button>
          )}
          <button
            onClick={() => action("skip")}
            disabled={!automation.sequenceKey}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 disabled:opacity-40"
          >
            <SkipForward className="h-4 w-4" />
            Skip step
          </button>
          <button
            onClick={() => setShowSequence((current) => !current)}
            aria-expanded={showSequence}
            aria-controls="automation-sequence-preview"
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-sm font-semibold text-slate-700"
          >
            <Eye className="h-4 w-4" />
            {showSequence ? "Hide full automation" : "View full automation"}
            {showSequence ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </button>
        </div>
      </section>
      {showSequence ? (
        <section
          id="automation-sequence-preview"
          className="space-y-3 rounded-xl border border-slate-200 bg-white p-4"
        >
          <div>
            <h3 className="text-sm font-semibold text-slate-950">
              Full automation
            </h3>
            <p className="mt-1 text-xs text-slate-500">
              This is the personalised subject and plain-text copy used for each
              email.
            </p>
          </div>
          <div className="space-y-3">
            {sequence.map((step) => {
              const status = statusStyles[step.status] || statusStyles.upcoming;
              const StatusIcon = status.Icon;
              return (
                <article
                  key={step.stepNumber}
                  className={`rounded-xl border p-4 ${step.status === "next" ? "border-blue-200 bg-blue-50/40" : "border-slate-200 bg-slate-50/40"}`}
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Email {step.stepNumber} ·{" "}
                        {scheduleLabel(step.dayOffset)}
                      </p>
                      <h4 className="mt-1 text-sm font-semibold text-slate-950">
                        {step.subject}
                      </h4>
                    </div>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-md px-2 py-1 text-[11px] font-semibold ${status.className}`}
                    >
                      <StatusIcon className="h-3.5 w-3.5" />
                      {status.label}
                    </span>
                  </div>
                  <pre className="mt-3 whitespace-pre-wrap font-sans text-xs leading-5 text-slate-600">
                    {step.text}
                  </pre>
                  {step.lastError ? (
                    <p className="mt-3 rounded-lg bg-rose-50 p-2 text-xs text-rose-700">
                      Last delivery error: {step.lastError}
                    </p>
                  ) : null}
                </article>
              );
            })}
          </div>
        </section>
      ) : null}
      <section className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-900">Email history</h3>
        {[...(automation.emailHistory || [])].reverse().map((email) => (
          <article
            key={email.id || email._id}
            className="rounded-xl border border-slate-200 bg-white p-3.5"
          >
            <div className="flex items-start gap-3">
              <span
                className={`rounded-lg p-2 ${email.success ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}
              >
                <MailCheck className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-slate-900">
                  {email.subject}
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  {email.recipient} ·{" "}
                  {new Date(email.sentAt).toLocaleString("en-GB")}
                </p>
                <p className="mt-1 text-xs capitalize text-slate-500">
                  {email.sequenceKey?.replaceAll("_", " ")} · step{" "}
                  {email.sequenceStep}
                </p>
              </div>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
