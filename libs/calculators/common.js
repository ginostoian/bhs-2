// Shared helpers for the public cost calculators. Plain JS so the same code runs in the
// browser (live estimate), on the server (lead emails, PDFs) and in the admin price editor.

export const REGIONS = [
  { id: "london", label: "London" },
  { id: "southEast", label: "South East" },
  { id: "eastEngland", label: "East of England" },
  { id: "southWest", label: "South West" },
  { id: "midlands", label: "Midlands" },
  { id: "northEngland", label: "North of England" },
  { id: "scotlandWales", label: "Scotland or Wales" },
];

export const LONDON_ZONES = [
  { id: "zone1", label: "Central", hint: "Zone 1" },
  { id: "zone2", label: "Inner", hint: "Zone 2" },
  { id: "zone3", label: "Outer", hint: "Zone 3" },
  { id: "zone4", label: "Greater", hint: "Zone 4" },
  { id: "zone5", label: "Edge", hint: "Zone 5–6" },
];

export const VAT_OPTIONS = [
  { id: "standard", label: "Include VAT (20%)" },
  { id: "zero", label: "Exclude VAT" },
];

export const round = (n, to = 1) => Math.round((Number(n) || 0) / to) * to;

// Rounds a currency figure to a sensible precision for its size, so ranges read as
// budgets rather than false precision.
export const niceRound = (n) => {
  const v = Number(n) || 0;
  if (v >= 100000) return round(v, 1000);
  if (v >= 20000) return round(v, 500);
  if (v >= 2000) return round(v, 100);
  return round(v, 10);
};

export const formatGBP = (n, { compact = false } = {}) => {
  const v = Number(n) || 0;
  if (compact && v >= 1000) {
    const k = v / 1000;
    return `£${k >= 100 ? Math.round(k) : Math.round(k * 10) / 10}k`;
  }
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(v);
};

export const clamp = (n, min, max) => Math.min(max, Math.max(min, Number(n) || 0));

export const optionLabel = (options, id) =>
  options?.find((o) => o.id === id)?.label ?? (id === undefined || id === null ? "–" : String(id));

export function deepMerge(base, override) {
  if (!override || typeof override !== "object" || Array.isArray(override)) return base;
  const out = Array.isArray(base) ? [...base] : { ...base };
  for (const [key, value] of Object.entries(override)) {
    if (value && typeof value === "object" && !Array.isArray(value) && base?.[key] && typeof base[key] === "object") {
      out[key] = deepMerge(base[key], value);
    } else if (value !== undefined && value !== null && value !== "") {
      out[key] = value;
    }
  }
  return out;
}

// Region uplift shared by the new calculators: London zones are relative to outer London.
export function locationMultiplier(config, region, londonZone) {
  if (region === "london") return config.londonZoneMultipliers?.[londonZone || "zone3"] ?? 1;
  return config.regionMultipliers?.[region] ?? 1;
}

// Share links: answers are stored as compact base64url JSON in `?a=`.
export function encodeAnswers(answers) {
  const json = JSON.stringify(answers);
  const b64 =
    typeof window === "undefined"
      ? Buffer.from(json, "utf8").toString("base64")
      : btoa(unescape(encodeURIComponent(json)));
  return b64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

export function decodeAnswers(value) {
  if (!value) return null;
  try {
    const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
    const json =
      typeof window === "undefined"
        ? Buffer.from(b64, "base64").toString("utf8")
        : decodeURIComponent(escape(atob(b64)));
    const parsed = JSON.parse(json);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed) ? parsed : null;
  } catch {
    return null;
  }
}

// Builds the standard result shape every calculator returns.
export function buildRange(total, { lowFactor = 0.9, highFactor = 1.15 } = {}) {
  return {
    low: niceRound(total * lowFactor),
    expected: niceRound(total),
    high: niceRound(total * highFactor),
  };
}

// Confidence widening used by the new engines: less defined projects get wider ranges.
export const CERTAINTY = {
  justExploring: { label: "Just exploring", low: 0.86, high: 1.22 },
  roughIdea: { label: "I have a rough idea", low: 0.9, high: 1.16 },
  drawings: { label: "I have drawings", low: 0.94, high: 1.1 },
  quoting: { label: "Ready to get quotes", low: 0.96, high: 1.07 },
};
