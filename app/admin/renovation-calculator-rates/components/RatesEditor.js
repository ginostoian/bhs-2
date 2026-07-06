"use client";

import { useEffect, useMemo, useState } from "react";

// Keys that are not editable numeric rates.
const SKIP_KEYS = new Set(["version", "priceBookDate", "currency", "vatRate"]);

// Human-friendly labels for the recursive tree (fallback: prettified key).
const LABELS = {
  // Extension calculator
  baseBuildRates: "Base build rates (£/m² split)",
  sizeMultipliers: "Size band multipliers",
  complexityMultipliers: "Complexity multipliers",
  siteAccessMultipliers: "Site access multipliers",
  glazingLevelMultipliers: "Glazing multipliers",
  additionalFeatures: "Optional extras (unit costs)",
  planningServices: "Planning & professional fees (£)",
  vatTreatments: "VAT treatments",
  // Renovation calculator
  baseScopeRates: "General builder's work (£/m² of affected area)",
  coverageFactors: "Coverage factors (fraction of home affected)",
  regionMultipliers: "Regional multipliers",
  londonZoneMultipliers: "London zone multipliers",
  propertyMultipliers: "Property-type multipliers",
  houseStyleMultipliers: "House-style multipliers",
  floorMultipliers: "Floor multipliers (flats)",
  finishLevelMultipliers: "Finish-level multipliers (fittings)",
  roomRates: "Room fit-out (£ per room)",
  structuralWork: "Structural work (£)",
  systems: "Systems (fixed £ + £/m²)",
  finishing: "Finishing",
  preliminaries: "Preliminaries (% of construction)",
  professionalFees: "Professional & statutory fees (£)",
  contingencyRates: "Contingency by level",
  confidenceModifiers: "Confidence modifiers",
  vatTreatments: "VAT treatments",
  plastering: "Plastering",
  decoration: "Decoration",
  flooringCoverage: "Flooring coverage",
  floorRates: "Floor rates (£/m²)",
  doorPackages: "Door packages (£)",
  rewire: "Rewire",
  heating: "Heating",
  plumbing: "Plumbing",
  base: "Base rate",
  occupancyAdd: "Occupancy uplift",
};

const prettify = (key) =>
  LABELS[key] ||
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/^./, (c) => c.toUpperCase())
    .replace(/ M2/g, "/m²")
    .trim();

const formatValue = (n) => (Number.isFinite(n) ? String(n) : "");

// Deep clone helper for plain JSON config.
const clone = (obj) => JSON.parse(JSON.stringify(obj));

// Set a value at a dot-path, returning a new object.
function setAtPath(obj, path, value) {
  const next = clone(obj);
  let cursor = next;
  for (let i = 0; i < path.length - 1; i += 1) {
    cursor = cursor[path[i]];
  }
  cursor[path[path.length - 1]] = value;
  return next;
}

// Compute the diff of `current` against `defaults` (only changed numeric leaves).
function diff(defaults, current) {
  const out = {};
  for (const key of Object.keys(current || {})) {
    const d = defaults ? defaults[key] : undefined;
    const c = current[key];
    if (isPlainObject(c) && isPlainObject(d)) {
      const nested = diff(d, c);
      if (Object.keys(nested).length > 0) out[key] = nested;
    } else if (typeof c === "number" && c !== d) {
      out[key] = c;
    }
  }
  return out;
}

function isPlainObject(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v);
}

function NumberField({ label, value, isOverridden, onChange }) {
  return (
    <label className="flex items-center justify-between gap-3 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2">
      <span className="text-xs font-medium text-gray-700">
        {label}
        {isOverridden && (
          <span className="ml-1 rounded bg-amber-100 px-1 text-[10px] font-semibold text-amber-800">
            edited
          </span>
        )}
      </span>
      <input
        type="number"
        step="any"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-28 rounded-md border border-gray-300 bg-white px-2 py-1 text-right text-sm text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </label>
  );
}

function ConfigTree({ node, defaults, path, onChange, depth = 0 }) {
  const entries = Object.keys(node).filter((k) => !SKIP_KEYS.has(k));

  const numberKeys = entries.filter((k) => typeof node[k] === "number");
  const objectKeys = entries.filter((k) => isPlainObject(node[k]));

  return (
    <div className={depth === 0 ? "space-y-5" : "space-y-3"}>
      {numberKeys.length > 0 && (
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {numberKeys.map((key) => {
            const defVal = defaults ? defaults[key] : undefined;
            return (
              <NumberField
                key={key}
                label={prettify(key)}
                value={formatValue(node[key])}
                isOverridden={typeof node[key] === "number" && node[key] !== defVal}
                onChange={(raw) => onChange([...path, key], raw)}
              />
            );
          })}
        </div>
      )}

      {objectKeys.map((key) => (
        <div
          key={key}
          className={
            depth === 0
              ? "rounded-2xl border border-gray-100 bg-white p-5 shadow-sm"
              : "rounded-xl border border-gray-100 bg-white/60 p-3"
          }
        >
          <h3
            className={
              depth === 0
                ? "mb-3 text-sm font-bold uppercase tracking-[0.12em] text-gray-700"
                : "mb-2 text-xs font-semibold uppercase tracking-[0.1em] text-gray-500"
            }
          >
            {prettify(key)}
          </h3>
          <ConfigTree
            node={node[key]}
            defaults={defaults ? defaults[key] : undefined}
            path={[...path, key]}
            onChange={onChange}
            depth={depth + 1}
          />
        </div>
      ))}
    </div>
  );
}

export default function RatesEditor({ calculatorType = "renovation" }) {
  const [defaults, setDefaults] = useState(null);
  const [config, setConfig] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [updatedAt, setUpdatedAt] = useState(null);

  const apiUrl = `/api/admin/calculator-rates?type=${encodeURIComponent(calculatorType)}`;

  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const res = await fetch(apiUrl);
        if (!res.ok) throw new Error("Failed to load rates");
        const data = await res.json();
        if (!active) return;
        setDefaults(data.defaults);
        setConfig(data.effective);
        setUpdatedAt(data.updatedAt);
        setStatus("ready");
      } catch (error) {
        if (!active) return;
        setStatus("error");
        setMessage(error.message);
      }
    })();
    return () => {
      active = false;
    };
  }, [apiUrl]);

  const overrides = useMemo(
    () => (defaults && config ? diff(defaults, config) : {}),
    [defaults, config],
  );
  const overrideCount = useMemo(() => countLeaves(overrides), [overrides]);

  const handleChange = (path, raw) => {
    const value = raw === "" ? 0 : Number(raw);
    if (Number.isNaN(value)) return;
    setConfig((prev) => setAtPath(prev, path, value));
  };

  const save = async () => {
    setStatus("saving");
    setMessage("");
    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides }),
      });
      if (!res.ok) throw new Error("Save failed");
      const data = await res.json();
      setUpdatedAt(data.updatedAt);
      setStatus("ready");
      setMessage("Saved. Public calculator will reflect changes within 5 minutes.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const resetAll = async () => {
    if (!window.confirm("Clear all overrides and restore the built-in default rates?")) return;
    setStatus("saving");
    try {
      const res = await fetch(apiUrl, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ overrides: {} }),
      });
      if (!res.ok) throw new Error("Reset failed");
      const data = await res.json();
      setConfig(data.effective);
      setUpdatedAt(data.updatedAt);
      setStatus("ready");
      setMessage("All rates reset to defaults.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  if (status === "loading") {
    return <div className="rounded-2xl border border-gray-100 bg-white p-6 text-sm text-gray-500">Loading rates…</div>;
  }
  if (!config) {
    return <div className="rounded-2xl border border-red-100 bg-red-50 p-6 text-sm text-red-700">{message || "Could not load rates."}</div>;
  }

  return (
    <div className="space-y-5">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-white/95 p-4 shadow-sm backdrop-blur">
        <div className="text-sm text-gray-600">
          <span className="font-semibold text-gray-900">{overrideCount}</span> field
          {overrideCount === 1 ? "" : "s"} overridden
          {updatedAt && (
            <span className="ml-2 text-xs text-gray-400">
              · last saved {new Date(updatedAt).toLocaleString("en-GB")}
            </span>
          )}
          {message && <span className="ml-2 text-xs text-emerald-600">{message}</span>}
        </div>
        <div className="flex gap-2">
          <button
            onClick={resetAll}
            disabled={status === "saving"}
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50"
          >
            Reset all to defaults
          </button>
          <button
            onClick={save}
            disabled={status === "saving"}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:opacity-50"
          >
            {status === "saving" ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      <ConfigTree node={config} defaults={defaults} path={[]} onChange={handleChange} />
    </div>
  );
}

function countLeaves(obj) {
  let count = 0;
  for (const key of Object.keys(obj || {})) {
    if (isPlainObject(obj[key])) count += countLeaves(obj[key]);
    else count += 1;
  }
  return count;
}
