"use client";

import { useEffect, useState } from "react";

const startOfWeek = () => {
  const date = new Date();
  date.setDate(date.getDate() - ((date.getDay() + 6) % 7));
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
};
const initialForm = () => ({ weekStart: startOfWeek(), completed: "", nextWeek: "", blockers: "", decisionsNeeded: "", scheduleImpact: "none", costImpact: "none" });

export default function WeeklyUpdates({ projectId }) {
  const [updates, setUpdates] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  useEffect(() => {
    let active = true;
    fetch(`/api/projects/${projectId}/weekly-updates`)
      .then(async (res) => { const body = await res.json(); if (!res.ok) throw new Error(body.error); return body; })
      .then((body) => { if (active) setUpdates(body.updates); })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [projectId]);
  const save = async (event) => {
    event.preventDefault(); setSaving(true); setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/weekly-updates`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Could not save update");
      setUpdates((current) => [body.update, ...current.filter((item) => item._id !== body.update._id)].sort((a, b) => new Date(b.weekStart) - new Date(a.weekStart)));
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  const edit = (update) => { setForm({ weekStart: update.weekStart.slice(0, 10), completed: update.completed, nextWeek: update.nextWeek, blockers: update.blockers || "", decisionsNeeded: update.decisionsNeeded || "", scheduleImpact: update.scheduleImpact, costImpact: update.costImpact }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  return <div className="space-y-6 p-5 sm:p-6">
    <div><h2 className="text-xl font-semibold text-slate-900">Weekly project update</h2><p className="text-sm text-slate-500">A short record of progress, next steps and decisions. One update per week.</p></div>
    <form onSubmit={save} className="space-y-4 rounded-lg border border-slate-200 bg-slate-50 p-4">
      <label className="block text-sm font-medium">Week of <input type="date" required value={form.weekStart} onChange={(e) => setForm({ ...form, weekStart: e.target.value })} className="ml-2 rounded border border-slate-300 p-2" /></label>
      <div className="grid gap-4 md:grid-cols-2">
        {[["completed", "Completed this week"], ["nextWeek", "Planned next week"], ["blockers", "Blockers"], ["decisionsNeeded", "Decisions needed"]].map(([key, label]) =>
          <label key={key} className="block text-sm font-medium">{label}<textarea required={key === "completed" || key === "nextWeek"} maxLength={4000} rows={3} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} className="mt-1 w-full rounded border border-slate-300 bg-white p-2" /></label>)}
      </div>
      <div className="flex flex-wrap gap-4">
        <label className="text-sm font-medium">Schedule impact <select value={form.scheduleImpact} onChange={(e) => setForm({ ...form, scheduleImpact: e.target.value })} className="ml-2 rounded border border-slate-300 p-2"><option value="none">None</option><option value="at-risk">At risk</option><option value="delayed">Delayed</option></select></label>
        <label className="text-sm font-medium">Cost impact <select value={form.costImpact} onChange={(e) => setForm({ ...form, costImpact: e.target.value })} className="ml-2 rounded border border-slate-300 p-2"><option value="none">None</option><option value="possible">Possible</option><option value="confirmed">Confirmed</option></select></label>
      </div>
      {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
      <button disabled={saving} className="rounded bg-slate-900 px-4 py-2 text-sm text-white disabled:opacity-50">{saving ? "Saving…" : "Save update"}</button>
    </form>
    <div className="space-y-3">{updates.map((update) => <article key={update._id} className="rounded-lg border border-slate-200 p-4">
      <div className="flex flex-wrap justify-between gap-2"><h3 className="font-semibold text-slate-900">Week of {new Date(update.weekStart).toLocaleDateString("en-GB", { timeZone: "UTC", day: "numeric", month: "long", year: "numeric" })}</h3><button onClick={() => edit(update)} className="text-sm text-blue-700 underline">Edit this week</button></div>
      <p className="mt-1 text-xs text-slate-500">Updated by {update.updatedBy?.name || "Admin"} · Schedule: {update.scheduleImpact} · Cost: {update.costImpact}</p>
      <div className="mt-3 grid gap-3 text-sm md:grid-cols-2">{[["Completed", update.completed], ["Next", update.nextWeek], ["Blockers", update.blockers], ["Decisions", update.decisionsNeeded]].filter(([, value]) => value).map(([label, value]) => <div key={label}><strong>{label}</strong><p className="whitespace-pre-wrap text-slate-600">{value}</p></div>)}</div>
    </article>)}{updates.length === 0 && <p className="text-sm text-slate-500">No weekly updates yet.</p>}</div>
  </div>;
}
