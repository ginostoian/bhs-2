"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { formatCurrency } from "@/libs/documentFormat";
import { Drawer, cx, inputClass } from "./ui";

const TABS = [
  ["services", "Services"],
  ["rates", "Rate cards"],
  ["templates", "Templates"],
];

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

/**
 * Price a template service as a line item.
 * "calculated" services: labour rate × quantity + material rate × material
 * quantity, expressed as a unit rate so quantity × rate = that total.
 * (The old builder multiplied by quantity twice.)
 */
export const serviceToItem = (service) => {
  const cfg = service.calculationConfig || {};
  const quantity = Number(cfg.defaultQuantity) || 1;
  let unitPrice = Number(service.fixedPrice) || 0;
  if (service.pricingType === "calculated" && cfg.tradesperson) {
    const labour = (Number(cfg.tradesperson.price) || 0) * quantity;
    const material = cfg.material
      ? (Number(cfg.material.price) || 0) *
        (Number(cfg.defaultMaterialQuantity) || 0)
      : 0;
    unitPrice = round2((labour + material) / quantity);
  }
  return {
    name: service.name,
    description: service.description || "",
    unit: service.unit || "",
    quantity,
    unitPrice,
    notes: service.notes || "",
  };
};

const rateToItem = (rate) => ({
  name: rate.name,
  description: rate.description || "",
  unit: rate.unit || "",
  quantity: 1,
  unitPrice: Number(rate.price) || 0,
});

export const templateToSections = (template) =>
  (template.baseServices || []).map((group) => ({
    categoryName: group.category || "Section",
    items: (group.items || []).map((item) => ({
      name: item.name || "",
      description: item.description || "",
      unit: item.unit || "",
      quantity: 1,
      unitPrice: Number(item.basePrice) || 0,
      notes: item.notes || "",
    })),
  }));

const ENDPOINTS = {
  services: "/api/admin/quoting/template-services?isActive=true",
  rates: "/api/admin/quoting/rates?isActive=true",
  templates: "/api/admin/quoting/templates",
};

export default function CatalogueDrawer({
  initialTab = "services",
  targetName,
  onInsertItems,
  onInsertTemplate,
  onClose,
}) {
  const [tab, setTab] = useState(initialTab);
  const [data, setData] = useState({});
  const [error, setError] = useState(null);
  const [query, setQuery] = useState("");
  const [added, setAdded] = useState({});

  useEffect(() => {
    if (data[tab]) return;
    let cancelled = false;
    setError(null);
    fetch(ENDPOINTS[tab])
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(r.statusText))))
      .then((list) => !cancelled && setData((d) => ({ ...d, [tab]: list })))
      .catch(() => !cancelled && setError("Couldn't load the catalogue"));
    return () => {
      cancelled = true;
    };
  }, [tab, data]);

  const list = data[tab];
  const filtered = useMemo(() => {
    if (!list) return [];
    const q = query.trim().toLowerCase();
    const active =
      tab === "templates" ? list.filter((t) => t.isActive !== false) : list;
    if (!q) return active;
    return active.filter((entry) =>
      [entry.name, entry.description, entry.category, entry.projectType]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  }, [list, query, tab]);

  // Group by category for services and rates
  const groups = useMemo(() => {
    if (tab === "templates") return [["", filtered]];
    const map = new Map();
    filtered.forEach((entry) => {
      const key = entry.category || "Other";
      map.set(key, [...(map.get(key) || []), entry]);
    });
    return [...map.entries()];
  }, [filtered, tab]);

  const flash = (id) => {
    setAdded((a) => ({ ...a, [id]: true }));
    setTimeout(() => setAdded((a) => ({ ...a, [id]: false })), 1200);
  };

  const insert = (entry) => {
    if (tab === "templates") {
      onInsertTemplate(entry);
      onClose();
      return;
    }
    onInsertItems(
      [tab === "services" ? serviceToItem(entry) : rateToItem(entry)],
      entry.category,
    );
    flash(entry._id);
  };

  return (
    <Drawer title="Catalogue" onClose={onClose}>
      <p className="mb-3 text-xs text-[#7A807B]">
        {tab === "templates"
          ? "Inserts every section of the template at the end of the quote."
          : targetName
            ? `Adding to “${targetName}”.`
            : "Adds to a section matching the item's category (created if needed)."}
      </p>
      <div className="mb-3 flex gap-1 border-b border-[#EDE9E0]">
        {TABS.map(([key, label]) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={cx(
              "-mb-px border-b-2 px-3 py-2 text-sm font-medium",
              tab === key
                ? "border-[#4D5B4B] text-[#202925]"
                : "border-transparent text-[#7A807B] hover:text-[#202925]",
            )}
          >
            {label}
          </button>
        ))}
      </div>
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-[#A3A8A4]" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search…"
          className={cx(inputClass, "pl-8")}
          aria-label="Search catalogue"
        />
      </div>

      {error && <p className="text-sm text-[#B42318]">{error}</p>}
      {!list && !error && <p className="text-sm text-[#7A807B]">Loading…</p>}
      {list && filtered.length === 0 && (
        <p className="text-sm text-[#7A807B]">Nothing matches.</p>
      )}

      <div className="space-y-4">
        {groups.map(([group, entries]) => (
          <div key={group || "all"}>
            {group && (
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.12em] text-[#A65B43]">
                {group}
              </p>
            )}
            <ul className="divide-y divide-[#EDE9E0] border-y border-[#EDE9E0]">
              {entries.map((entry) => {
                const price =
                  tab === "services"
                    ? serviceToItem(entry).unitPrice
                    : tab === "rates"
                      ? entry.price
                      : null;
                const unit = entry.unit;
                return (
                  <li key={entry._id}>
                    <button
                      type="button"
                      onClick={() => insert(entry)}
                      className="flex w-full items-start gap-3 px-1 py-2.5 text-left hover:bg-[#F4F1EA]"
                    >
                      <span className="min-w-0 flex-1">
                        <span className="block text-sm font-medium">
                          {entry.name}
                        </span>
                        {(entry.description || tab === "templates") && (
                          <span className="line-clamp-2 block text-xs text-[#7A807B]">
                            {tab === "templates"
                              ? `${(entry.baseServices || []).length} sections · ${(entry.baseServices || []).reduce((n, g) => n + (g.items?.length || 0), 0)} items${entry.description ? ` — ${entry.description}` : ""}`
                              : entry.description}
                          </span>
                        )}
                        {tab === "rates" && (
                          <span className="text-[10px] font-bold uppercase tracking-wide text-[#7A807B]">
                            {entry.type}
                          </span>
                        )}
                      </span>
                      {price !== null && (
                        <span className="shrink-0 text-right text-sm tabular-nums">
                          {formatCurrency(price)}
                          {unit && (
                            <span className="block text-[11px] text-[#7A807B]">
                              per {unit}
                            </span>
                          )}
                        </span>
                      )}
                      <span
                        className={cx(
                          "inline-flex h-7 shrink-0 items-center gap-1 px-2 text-xs font-medium",
                          added[entry._id]
                            ? "bg-[#EEF5EF] text-[#2F6B3F]"
                            : "bg-[#4D5B4B] text-white",
                        )}
                      >
                        {added[entry._id] ? (
                          "Added"
                        ) : (
                          <>
                            <Plus className="h-3.5 w-3.5" /> Add
                          </>
                        )}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </Drawer>
  );
}
