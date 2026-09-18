"use client";

import { Fragment, useEffect, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { BriefcaseBusiness, Clock3, X } from "lucide-react";
import toast from "react-hot-toast";

function toDateInput(value) {
  if (!value) return new Date().toISOString().slice(0, 10);
  return new Date(value).toISOString().slice(0, 10);
}

function initialForm(entry, date) {
  const isCustom = Boolean(entry?.projectName && !entry?.project);
  return {
    date: toDateInput(entry?.date || date),
    worker: entry?.worker?._id || entry?.worker?.id || "",
    projectMode: isCustom ? "custom" : "existing",
    project: entry?.project?._id || entry?.project?.id || "",
    projectName: entry?.projectName || "",
    status: entry?.status || "Present",
    hours: entry?.hours ?? 8,
    notes: entry?.notes || "",
  };
}

export default function TimeEntryDialog({
  open,
  onClose,
  onSaved,
  entry,
  date,
  workers,
  projects,
}) {
  const [form, setForm] = useState(() => initialForm(entry, date));
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) setForm(initialForm(entry, date));
  }, [open, entry, date]);

  const isEditing = Boolean(entry?._id || entry?.id);
  const canSave =
    form.worker &&
    Number(form.hours) >= 0 &&
    Number(form.hours) <= 24 &&
    (form.projectMode === "custom" ? form.projectName.trim() : form.project);

  const update = (field, value) =>
    setForm((current) => ({ ...current, [field]: value }));

  async function saveEntry(event) {
    event.preventDefault();
    if (!canSave || saving) return;

    const hours = Number(form.hours);
    const payload = {
      worker: form.worker,
      date: form.date,
      status: form.status,
      hours,
      shiftType: hours === 8 ? "full" : hours === 4 ? "half" : "custom",
      notes: form.notes.trim(),
      project: form.projectMode === "existing" ? form.project : null,
      projectName:
        form.projectMode === "custom" ? form.projectName.trim() : null,
    };

    setSaving(true);
    try {
      const response = await fetch(
        isEditing
          ? `/api/attendance/${entry._id || entry.id}`
          : "/api/attendance",
        {
          method: isEditing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || data.warning || "Unable to save entry");
      }

      toast.success(isEditing ? "Time entry updated" : "Time entry saved");
      await onSaved();
      onClose();
    } catch (error) {
      toast.error(error.message || "Unable to save entry");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-slate-950/35" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto p-4 sm:p-6">
          <div className="flex min-h-full items-center justify-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="translate-y-3 opacity-0 sm:scale-95"
              enterTo="translate-y-0 opacity-100 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="translate-y-0 opacity-100 sm:scale-100"
              leaveTo="translate-y-3 opacity-0 sm:scale-95"
            >
              <Dialog.Panel className="w-full max-w-3xl overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-slate-900/10">
                <form onSubmit={saveEntry}>
                  <div className="flex items-start justify-between border-b border-slate-200 px-6 py-5">
                    <div>
                      <Dialog.Title className="text-xl font-semibold text-slate-950">
                        {isEditing ? "Edit time entry" : "Log time"}
                      </Dialog.Title>
                      <Dialog.Description className="mt-1 text-sm text-slate-500">
                        Record an employee&apos;s hours against an existing or
                        one-off project.
                      </Dialog.Description>
                    </div>
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700"
                      aria-label="Close time entry"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>

                  <div className="grid gap-5 px-6 py-6 sm:grid-cols-2">
                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Date
                      </span>
                      <input
                        type="date"
                        value={form.date}
                        onChange={(event) => update("date", event.target.value)}
                        required
                        className="w-full rounded-lg border-slate-300 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Employee
                      </span>
                      <select
                        value={form.worker}
                        onChange={(event) => update("worker", event.target.value)}
                        required
                        className="w-full rounded-lg border-slate-300 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                      >
                        <option value="">Select an employee</option>
                        {workers.map((worker) => (
                          <option
                            key={worker._id || worker.id}
                            value={worker._id || worker.id}
                          >
                            {worker.name}
                            {worker.position ? ` — ${worker.position}` : ""}
                          </option>
                        ))}
                      </select>
                    </label>

                    <div className="sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Project type
                      </span>
                      <div className="grid grid-cols-2 rounded-lg border border-slate-300 p-1 sm:w-96">
                        {[
                          ["existing", "Existing project"],
                          ["custom", "One-off project"],
                        ].map(([value, label]) => (
                          <button
                            key={value}
                            type="button"
                            onClick={() => update("projectMode", value)}
                            className={`rounded-md px-3 py-2 text-sm font-medium transition ${
                              form.projectMode === value
                                ? "bg-emerald-800 text-white shadow-sm"
                                : "text-slate-600 hover:bg-slate-100"
                            }`}
                          >
                            {label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {form.projectMode === "existing" ? (
                      <label className="block sm:col-span-2">
                        <span className="mb-1.5 block text-sm font-medium text-slate-700">
                          Project
                        </span>
                        <div className="relative">
                          <BriefcaseBusiness className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                          <select
                            value={form.project}
                            onChange={(event) => update("project", event.target.value)}
                            required
                            className="w-full rounded-lg border-slate-300 pl-10 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                          >
                            <option value="">Select an ongoing project</option>
                            {projects.map((project) => (
                              <option
                                key={project.id || project._id}
                                value={project.id || project._id}
                              >
                                {project.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      </label>
                    ) : (
                      <label className="block sm:col-span-2">
                        <span className="mb-1.5 block text-sm font-medium text-slate-700">
                          One-off project name
                        </span>
                        <input
                          type="text"
                          value={form.projectName}
                          onChange={(event) =>
                            update("projectName", event.target.value)
                          }
                          required
                          placeholder="For example: Head office, supplier visit"
                          className="w-full rounded-lg border-slate-300 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                        />
                        <span className="mt-1.5 block text-xs text-slate-500">
                          This records the name on the attendance entry without
                          creating a project in the main database.
                        </span>
                      </label>
                    )}

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Status
                      </span>
                      <select
                        value={form.status}
                        onChange={(event) => update("status", event.target.value)}
                        className="w-full rounded-lg border-slate-300 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                      >
                        {["Present", "Sick", "Holiday", "Unavailable"].map(
                          (status) => (
                            <option key={status}>{status}</option>
                          ),
                        )}
                      </select>
                    </label>

                    <label className="block">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Hours
                      </span>
                      <div className="relative">
                        <Clock3 className="pointer-events-none absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
                        <input
                          type="number"
                          min="0"
                          max="24"
                          step="0.25"
                          value={form.hours}
                          onChange={(event) => update("hours", event.target.value)}
                          required
                          className="w-full rounded-lg border-slate-300 pl-10 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                        />
                      </div>
                    </label>

                    <label className="block sm:col-span-2">
                      <span className="mb-1.5 block text-sm font-medium text-slate-700">
                        Notes <span className="font-normal text-slate-400">(optional)</span>
                      </span>
                      <textarea
                        rows={3}
                        value={form.notes}
                        onChange={(event) => update("notes", event.target.value)}
                        placeholder="Add context for payroll or the project team"
                        className="w-full rounded-lg border-slate-300 text-sm focus:border-emerald-700 focus:ring-emerald-700"
                      />
                    </label>
                  </div>

                  <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                    <button
                      type="button"
                      onClick={onClose}
                      className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!canSave || saving}
                      className="rounded-lg bg-emerald-800 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-emerald-900 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving
                        ? "Saving…"
                        : isEditing
                          ? "Update entry"
                          : "Save entry"}
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
