"use client";

import { useEffect, useState } from "react";
import { BookmarkPlus, Search, SlidersHorizontal, X } from "lucide-react";
import apiClient from "@/libs/api";

const inputClass =
  "h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:ring-blue-500";

export default function FilterBar({
  filters,
  setFilters,
  views = [],
  onSaveView,
}) {
  const [admins, setAdmins] = useState([]);
  const [showMobile, setShowMobile] = useState(false);

  useEffect(() => {
    let active = true;
    apiClient
      .get("/admin/check-users")
      .then((response) => {
        if (active)
          setAdmins(
            (response.users || []).filter((user) => user.role === "admin"),
          );
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);

  const change = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const clear = () =>
    setFilters({
      search: "",
      assignedTo: "",
      source: "",
      projectType: "",
      view: "",
    });
  const hasFilters = Object.values(filters).some(Boolean);

  return (
    <div className="border-y border-slate-200 bg-white py-3">
      <div className="flex items-center justify-between sm:hidden">
        <button
          type="button"
          onClick={() => setShowMobile((value) => !value)}
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-700"
        >
          <SlidersHorizontal className="h-4 w-4" />
          Filters
        </button>
        {hasFilters ? (
          <button
            type="button"
            onClick={clear}
            className="text-xs font-medium text-blue-700"
          >
            Clear
          </button>
        ) : null}
      </div>
      <div
        className={`${showMobile ? "mt-3 grid" : "hidden"} gap-2 sm:grid sm:grid-cols-[minmax(190px,1.4fr)_repeat(4,minmax(130px,1fr))_auto]`}
      >
        <label className="relative">
          <span className="sr-only">Search leads</span>
          <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
          <input
            value={filters.search}
            onChange={(event) => change("search", event.target.value)}
            placeholder="Search leads"
            className={`${inputClass} w-full pl-9`}
          />
        </label>
        <select
          aria-label="Owner"
          value={filters.assignedTo}
          onChange={(event) => change("assignedTo", event.target.value)}
          className={inputClass}
        >
          <option value="">Owner</option>
          {admins.map((admin) => (
            <option key={admin.id} value={admin.id}>
              {admin.name || admin.email}
            </option>
          ))}
        </select>
        <select
          aria-label="Source"
          value={filters.source}
          onChange={(event) => change("source", event.target.value)}
          className={inputClass}
        >
          <option value="">Source</option>
          {[
            "Houzz",
            "MyBuilder",
            "Recommendation",
            "Google",
            "Meta Ads",
            "Google Ads",
            "Referral",
            "Other",
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          aria-label="Project type"
          value={filters.projectType}
          onChange={(event) => change("projectType", event.target.value)}
          className={inputClass}
        >
          <option value="">Project type</option>
          {[
            "Bathroom renovation",
            "Kitchen renovation",
            "Extension",
            "Home renovation",
            "Loft Conversion",
            "Commercial",
          ].map((item) => (
            <option key={item}>{item}</option>
          ))}
        </select>
        <select
          aria-label="Saved view"
          value={filters.view}
          onChange={(event) => {
            const selected = views.find(
              (view) =>
                view.id === event.target.value ||
                view._id === event.target.value,
            );
            setFilters(
              selected
                ? { ...filters, ...selected.filters, view: event.target.value }
                : { ...filters, view: event.target.value },
            );
          }}
          className={inputClass}
        >
          <option value="">Saved view</option>
          <option value="mine">My leads</option>
          <option value="hot">Hot leads</option>
          <option value="aging">Aging 7+ days</option>
          <option value="unassigned">Unassigned</option>
          {views.map((view) => (
            <option key={view.id || view._id} value={view.id || view._id}>
              {view.name}
            </option>
          ))}
        </select>
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={onSaveView}
            title="Save current view"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
          >
            <BookmarkPlus className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={clear}
            disabled={!hasFilters}
            title="Clear filters"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50 disabled:opacity-30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
