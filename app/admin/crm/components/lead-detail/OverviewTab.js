"use client";

import { useEffect, useState } from "react";
import {
  CalendarClock,
  Mail,
  MapPin,
  Phone,
  Save,
  Sparkles,
  UserRound,
} from "lucide-react";
import { CRM_STAGES } from "@/libs/crmStages";

const input =
  "w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500";

export default function OverviewTab({ lead, admins, onSave, onStageUpdate }) {
  const [form, setForm] = useState(lead);
  const [saving, setSaving] = useState(false);
  useEffect(() => setForm(lead), [lead]);
  const set = (key, value) =>
    setForm((current) => ({ ...current, [key]: value }));
  const save = async () => {
    setSaving(true);
    try {
      await onSave(lead.id || lead._id, form);
    } finally {
      setSaving(false);
    }
  };
  const nextAction = lead.overdueTaskCount
    ? `Complete ${lead.overdueTaskCount} overdue task${lead.overdueTaskCount > 1 ? "s" : ""}`
    : lead.emailAutomation?.isActive
      ? `Monitor ${lead.emailAutomation.sequenceKey?.replaceAll("_", " ")} step ${(lead.emailAutomation.sequenceStep || 0) + 1}`
      : "Set a clear next action";

  return (
    <div className="space-y-5">
      <section className="rounded-xl border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <span className="rounded-lg bg-blue-600 p-2 text-white">
            <Sparkles className="h-4 w-4" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
              Next best action
            </p>
            <p className="mt-1 font-semibold text-blue-950">{nextAction}</p>
            <p className="mt-1 text-sm text-blue-800">
              Keep an owner and due date attached to every open deal.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-2">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">Name</span>
          <input
            className={input}
            value={form.name || ""}
            onChange={(event) => set("name", event.target.value)}
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">Email</span>
          <div className="relative">
            <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="email"
              className={`${input} pl-9`}
              value={form.email || ""}
              onChange={(event) => set("email", event.target.value)}
            />
          </div>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">Phone</span>
          <div className="relative">
            <Phone className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              className={`${input} pl-9`}
              value={form.phone || ""}
              onChange={(event) => set("phone", event.target.value)}
            />
          </div>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">Address</span>
          <div className="relative">
            <MapPin className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              className={`${input} pl-9`}
              value={form.address || ""}
              onChange={(event) => set("address", event.target.value)}
            />
          </div>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">Owner</span>
          <div className="relative">
            <UserRound className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <select
              className={`${input} pl-9`}
              value={
                form.assignedTo?.id ||
                form.assignedTo?._id ||
                form.assignedTo ||
                ""
              }
              onChange={(event) => set("assignedTo", event.target.value)}
            >
              <option value="">Unassigned</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name || admin.email}
                </option>
              ))}
            </select>
          </div>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">Stage</span>
          <select
            className={input}
            value={lead.stage}
            onChange={(event) =>
              onStageUpdate(
                lead.id || lead._id,
                event.target.value,
                "Changed from lead workspace",
              )
            }
          >
            {CRM_STAGES.map((stage) => (
              <option key={stage}>{stage}</option>
            ))}
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">
            Estimated value
          </span>
          <input
            type="number"
            min="0"
            className={input}
            value={form.estimatedValue ?? form.value ?? 0}
            onChange={(event) =>
              set("estimatedValue", Number(event.target.value))
            }
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold text-slate-600">
            Expected close
          </span>
          <div className="relative">
            <CalendarClock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
            <input
              type="date"
              className={`${input} pl-9`}
              value={
                form.expectedCloseDate
                  ? new Date(form.expectedCloseDate).toISOString().slice(0, 10)
                  : ""
              }
              onChange={(event) => set("expectedCloseDate", event.target.value)}
            />
          </div>
        </label>
        <label className="flex items-center gap-3 rounded-lg border border-slate-200 p-3 text-sm text-slate-700 sm:col-span-2">
          <input
            type="checkbox"
            checked={form.marketingConsent === true}
            onChange={(event) => set("marketingConsent", event.target.checked)}
            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          Consent recorded for automated follow-up
        </label>
        <div className="flex justify-end sm:col-span-2">
          <button
            onClick={save}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            <Save className="h-4 w-4" />
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </section>
    </div>
  );
}
