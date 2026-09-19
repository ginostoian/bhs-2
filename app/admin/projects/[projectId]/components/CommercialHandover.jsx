"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

const money = (value) => new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(value || 0);

export default function CommercialHandover({ projectId, onSaved }) {
  const [data, setData] = useState(null);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  useEffect(() => {
    let active = true;
    fetch(`/api/projects/${projectId}/handover`)
      .then(async (res) => { const body = await res.json(); if (!res.ok) throw new Error(body.error); return body; })
      .then((body) => { if (active) { setData(body); setForm({ ...body.project, sourceLead: String(body.project.sourceLead || ""), sourceQuote: String(body.project.sourceQuote || "") }); } })
      .catch((err) => { if (active) setError(err.message); });
    return () => { active = false; };
  }, [projectId]);

  const save = async (event) => {
    event.preventDefault();
    setSaving(true); setError("");
    try {
      const res = await fetch(`/api/projects/${projectId}/handover`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const body = await res.json();
      if (!res.ok) throw new Error(body.error || "Could not save handover");
      setData((current) => ({ ...current, project: body.project }));
      onSaved?.(body.project);
    } catch (err) { setError(err.message); }
    finally { setSaving(false); }
  };
  const quote = data?.quotes.find((item) => String(item._id) === form?.sourceQuote);
  if (!form) return <div className="rounded-lg border border-slate-200 p-5 text-sm text-slate-500">{error || "Loading handover…"}</div>;
  return (
    <section className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">Commercial handover</h2>
        <p className="text-sm text-slate-500">Connect the original enquiry and quote to this project. Older records remain intact.</p>
      </div>
      <form onSubmit={save} className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <label className="block text-sm font-medium text-slate-700">Original enquiry
            <select value={form.sourceLead} onChange={(e) => setForm({ ...form, sourceLead: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 p-2.5">
              <option value="">Not linked</option>
              {data.leads.map((lead) => <option key={lead._id} value={lead._id}>{lead.name} · {lead.email} · {lead.stage}</option>)}
            </select>
          </label>
          <label className="block text-sm font-medium text-slate-700">Project quote
            <select value={form.sourceQuote} onChange={(e) => {
              const selected = data.quotes.find((item) => String(item._id) === e.target.value);
              setForm({ ...form, sourceQuote: e.target.value, sourceLead: selected?.linkedLead ? String(selected.linkedLead) : form.sourceLead });
            }} className="mt-1 w-full rounded-md border border-slate-300 p-2.5">
              <option value="">Not linked</option>
              {data.quotes.map((item) => <option key={item._id} value={item._id}>{item.quoteNumber} · {item.title} · {money(item.total)}</option>)}
            </select>
          </label>
        </div>
        {quote && <p className="text-sm text-slate-600">Quote value: <strong>{money(quote.total)}</strong> · Status: {quote.status}{quote.clientResponse ? ` · Client: ${quote.clientResponse}` : ""}. Confirm that this is the agreed scope before using it as a contract baseline.</p>}
        <label className="block text-sm font-medium text-slate-700">Handover notes and commitments
          <textarea value={form.handoverNotes || ""} onChange={(e) => setForm({ ...form, handoverNotes: e.target.value })} rows={3} maxLength={4000} className="mt-1 w-full rounded-md border border-slate-300 p-2.5" placeholder="Scope assumptions, client decisions, survey findings…" />
        </label>
        <label className="block max-w-xs text-sm font-medium text-slate-700">Estimated cost still to complete (£)
          <input type="number" min="0" step="0.01" value={form.remainingCostEstimate ?? ""} onChange={(e) => setForm({ ...form, remainingCostEstimate: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 p-2.5" placeholder="Leave blank until reviewed" />
        </label>
        {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
        <div className="flex flex-wrap items-center gap-3">
          <button disabled={saving} className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">{saving ? "Saving…" : "Save handover"}</button>
          {form.sourceLead && <Link className="text-sm text-blue-700 underline" href={`/admin/crm?lead=${form.sourceLead}`}>Open enquiry</Link>}
          {form.sourceQuote && <Link className="text-sm text-blue-700 underline" href={`/admin/quoting/${form.sourceQuote}/preview`}>Open quote</Link>}
        </div>
      </form>
    </section>
  );
}
