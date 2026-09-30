"use client";

import { useEffect, useRef, useState } from "react";
import { Link2, Search, UserRound, X } from "lucide-react";
import { PROJECT_TYPES } from "./quoteModel";
import { Card, Field, TextArea, TextInput, cx, inputClass } from "./ui";

/** Search registered users + CRM leads and link one to the quote. */
function ClientSearch({ onPick }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const boxRef = useRef(null);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `/api/admin/search/clients?q=${encodeURIComponent(query.trim())}`,
          { signal: controller.signal },
        );
        const data = response.ok ? await response.json() : [];
        setResults(Array.isArray(data) ? data : []);
        setOpen(true);
      } catch (error) {
        if (error.name !== "AbortError") setResults([]);
      } finally {
        setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [query]);

  useEffect(() => {
    const close = (e) => !boxRef.current?.contains(e.target) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="relative" ref={boxRef}>
      <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[#A3A8A4]" />
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => results.length && setOpen(true)}
        placeholder="Find a client or CRM lead by name, email or phone…"
        className={cx(inputClass, "pl-8")}
        aria-label="Search clients and leads"
      />
      {open && (
        <div className="absolute z-30 mt-1 max-h-72 w-full overflow-y-auto rounded-md border border-[#D8D2C6] bg-white py-1 shadow-[0_8px_24px_rgba(32,41,37,0.12)]">
          {loading && (
            <p className="px-3 py-2 text-sm text-[#7A807B]">Searching…</p>
          )}
          {!loading && results.length === 0 && (
            <p className="px-3 py-2 text-sm text-[#7A807B]">
              No matches — just type the details below.
            </p>
          )}
          {results.map((client) => (
            <button
              key={`${client.type}-${client.id}`}
              type="button"
              onClick={() => {
                onPick(client);
                setQuery("");
                setOpen(false);
              }}
              className="flex w-full items-start gap-3 px-3 py-2 text-left hover:bg-[#F4F1EA]"
            >
              <UserRound className="mt-0.5 h-4 w-4 shrink-0 text-[#7A807B]" />
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">
                  {client.name || "Unnamed"}
                </span>
                <span className="block truncate text-xs text-[#7A807B]">
                  {[client.email, client.phone, client.postcode]
                    .filter(Boolean)
                    .join(" · ")}
                </span>
              </span>
              <span
                className={cx(
                  "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                  client.type === "user"
                    ? "bg-[#EEF5EF] text-[#2F6B3F]"
                    : "bg-[#FFF4DB] text-[#8A5A00]",
                )}
              >
                {client.type === "user" ? "Client" : "Lead"}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function DetailsPanel({ quote, set }) {
  const client = quote.client;
  const [projects, setProjects] = useState([]);

  // Offer the linked client's projects so the quote can be attached to one
  useEffect(() => {
    if (!quote.linkedUser) {
      setProjects([]);
      return;
    }
    let cancelled = false;
    fetch(`/api/admin/projects?userId=${quote.linkedUser}`)
      .then((r) => (r.ok ? r.json() : { projects: [] }))
      .then((data) => !cancelled && setProjects(data.projects || []))
      .catch(() => !cancelled && setProjects([]));
    return () => {
      cancelled = true;
    };
  }, [quote.linkedUser]);

  const pick = (picked) => {
    set(["client"], {
      name: picked.name || "",
      email: picked.email || "",
      phone: picked.phone || "",
      address: picked.address || "",
      postcode: picked.postcode || "",
    });
    set(["linkedUser"], picked.type === "user" ? picked.id : null);
    set(["linkedLead"], picked.type === "lead" ? picked.id : null);
    if (picked.type !== "user") set(["project"], null);
    if (!quote.projectAddress && picked.address) {
      set(
        ["projectAddress"],
        [picked.address, picked.postcode].filter(Boolean).join(", "),
      );
    }
  };

  const unlink = () => {
    set(["linkedUser"], null);
    set(["linkedLead"], null);
    set(["project"], null);
  };

  const clientField = (key, label, props = {}) => (
    <Field label={label}>
      <TextInput
        value={client[key] || ""}
        onChange={(e) => set(["client", key], e.target.value)}
        {...props}
      />
    </Field>
  );

  const linkedLabel = quote.linkedUser
    ? "Linked to a registered client"
    : quote.linkedLead
      ? "Linked to a CRM lead"
      : null;

  return (
    <Card title="Client & project">
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A65B43]">
            Client
          </p>
          <ClientSearch onPick={pick} />
          {linkedLabel && (
            <div className="flex items-center justify-between gap-2 rounded bg-[#F4F1EA] px-3 py-2 text-xs">
              <span className="flex items-center gap-1.5 text-[#4A524D]">
                <Link2 className="h-3.5 w-3.5" /> {linkedLabel}
              </span>
              <button
                type="button"
                onClick={unlink}
                className="inline-flex items-center gap-1 text-[#7A807B] hover:text-[#B42318]"
              >
                <X className="h-3.5 w-3.5" /> Unlink
              </button>
            </div>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            {clientField("name", "Name", { placeholder: "Full name" })}
            {clientField("email", "Email", {
              type: "email",
              placeholder: "name@example.com",
            })}
            {clientField("phone", "Phone", { type: "tel" })}
            {clientField("postcode", "Postcode")}
          </div>
          {clientField("address", "Address")}
          {projects.length > 0 && (
            <Field
              label="Attach to project"
              hint="Shows this quote on the project and in the client's dashboard"
            >
              <select
                value={quote.project || ""}
                onChange={(e) => set(["project"], e.target.value || null)}
                className={inputClass}
              >
                <option value="">Not attached</option>
                {projects.map((p) => (
                  <option key={p._id} value={p._id}>
                    {p.name || p.title || "Project"}
                  </option>
                ))}
              </select>
            </Field>
          )}
        </div>

        <div className="space-y-3">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#A65B43]">
            Project
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Project type">
              <select
                value={quote.projectType}
                onChange={(e) => set(["projectType"], e.target.value)}
                className={inputClass}
              >
                {PROJECT_TYPES.map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Estimated duration">
              <TextInput
                value={quote.estimatedDuration}
                onChange={(e) => set(["estimatedDuration"], e.target.value)}
                placeholder="e.g. 10–12 weeks"
              />
            </Field>
            <Field label="Start date">
              <TextInput
                type="date"
                value={quote.startDate}
                onChange={(e) => set(["startDate"], e.target.value)}
              />
            </Field>
            <Field label="Quote valid until">
              <TextInput
                type="date"
                value={quote.validUntil}
                onChange={(e) => set(["validUntil"], e.target.value)}
              />
            </Field>
          </div>
          <Field label="Site address">
            <TextInput
              value={quote.projectAddress}
              onChange={(e) => set(["projectAddress"], e.target.value)}
              placeholder="Where the work happens"
            />
          </Field>
          <Field
            label="Project description"
            hint="Shown to the client under “Overview”. Blank lines start a new paragraph."
          >
            <TextArea
              rows={4}
              value={quote.projectDescription}
              onChange={(e) => set(["projectDescription"], e.target.value)}
              placeholder="Scope in a few sentences…"
            />
          </Field>
        </div>
      </div>
    </Card>
  );
}
