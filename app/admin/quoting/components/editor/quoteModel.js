import { businessFacts } from "@/libs/businessFacts";
import {
  DEFAULT_LEAD_TIME,
  DEFAULT_PAYMENT_TERMS,
  usableText,
} from "@/libs/quoteTerms";

// Client-side shape of a quote inside the editor. Sections and items carry a
// local `_key` for React/drag-and-drop; it's stripped before saving.

export const PROJECT_TYPES = [
  ["home-extension", "Home extension"],
  ["loft-conversion", "Loft conversion"],
  ["full-home-renovation", "Full home renovation"],
  ["kitchen-renovation", "Kitchen renovation"],
  ["bathroom-renovation", "Bathroom renovation"],
  ["electrical-rewiring", "Electrical rewiring"],
  ["boiler-installation", "Boiler installation"],
  ["garden-work", "Garden work"],
  ["custom", "Custom"],
];

export const STATUS_META = {
  draft: { label: "Draft", className: "bg-[#EDE9E0] text-[#4A524D]" },
  pending: { label: "Pending", className: "bg-[#FFF4DB] text-[#8A5A00]" },
  sent: { label: "Sent", className: "bg-[#E7EEF7] text-[#2B4C7E]" },
  won: { label: "Won", className: "bg-[#EEF5EF] text-[#2F6B3F]" },
  lost: { label: "Lost", className: "bg-[#FDF0EE] text-[#B42318]" },
  expired: { label: "Expired", className: "bg-[#EDE9E0] text-[#7A807B]" },
};

export const uid = () =>
  `k${Math.random().toString(36).slice(2, 10)}${Date.now().toString(36).slice(-3)}`;

export const blankItem = (overrides = {}) => ({
  _key: uid(),
  name: "",
  description: "",
  quantity: 1,
  unit: "",
  unitPrice: 0,
  costPrice: null,
  notes: "",
  internalNote: "",
  ...overrides,
});

export const blankSection = (name = "New section", items) => ({
  _key: uid(),
  type: "category",
  categoryName: name,
  description: "",
  items: items || [blankItem()],
});

export const blankHeading = (text = "New heading") => ({
  _key: uid(),
  type: "heading",
  headingText: text,
  headingDescription: "",
  items: [],
});

const dateInput = (value) => {
  if (!value) return "";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "" : d.toISOString().slice(0, 10);
};

const inDays = (days) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000).toISOString().slice(0, 10);

export const blankQuote = () => ({
  _id: null,
  quoteNumber: null,
  status: "draft",
  title: "",
  projectType: "custom",
  client: { name: "", email: "", phone: "", address: "", postcode: "" },
  projectAddress: "",
  projectDescription: "",
  startDate: "",
  estimatedDuration: "",
  validUntil: inDays(30),
  services: [blankSection("General")],
  pricing: {
    vatRate: 20,
    depositRequired: true,
    depositAmount: 0,
    depositPercentage: 0,
  },
  termsAndConditions: DEFAULT_PAYMENT_TERMS,
  warrantyInformation: businessFacts.workmanship,
  leadTime: DEFAULT_LEAD_TIME,
  specialInstructions: "",
  internalNotes: "",
  linkedUser: null,
  linkedLead: null,
  project: null,
});

const refId = (value) =>
  value && typeof value === "object" ? value._id || null : value || null;

/** Server document → editor state */
export const fromServer = (quote) => {
  const blank = blankQuote();
  return {
    ...blank,
    ...quote,
    client: { ...blank.client, ...quote.client },
    pricing: { ...blank.pricing, ...quote.pricing },
    startDate: dateInput(quote.startDate),
    validUntil: dateInput(quote.validUntil) || blank.validUntil,
    termsAndConditions:
      usableText(quote.termsAndConditions) || blank.termsAndConditions,
    warrantyInformation:
      usableText(quote.warrantyInformation) || blank.warrantyInformation,
    leadTime: usableText(quote.leadTime) || blank.leadTime,
    projectDescription:
      quote.projectDescription === "Draft project description"
        ? ""
        : quote.projectDescription || "",
    estimatedDuration:
      quote.estimatedDuration === "TBD" ? "" : quote.estimatedDuration || "",
    linkedUser: refId(quote.linkedUser),
    linkedLead: refId(quote.linkedLead),
    project: refId(quote.project),
    services: (quote.services || []).map((service) => ({
      ...service,
      _key: service._id || uid(),
      type: service.type || "category",
      items: (service.items || []).map((item) => ({
        ...blankItem(),
        ...item,
        // Old quotes may have been priced via the legacy customer fields
        unitPrice: item.customerUnitPrice || item.unitPrice || 0,
        costPrice: item.costPrice ?? null,
        _key: item._id || uid(),
      })),
    })),
  };
};

/** Editor state → API payload (only editable fields, no local keys) */
export const toPayload = (quote) => ({
  title: quote.title,
  projectType: quote.projectType,
  client: quote.client,
  projectAddress: quote.projectAddress,
  projectDescription: quote.projectDescription,
  startDate: quote.startDate || null,
  estimatedDuration: quote.estimatedDuration,
  validUntil: quote.validUntil || null,
  pricing: quote.pricing,
  paymentTerms: { deposit: 0, milestones: [] },
  termsAndConditions: quote.termsAndConditions,
  warrantyInformation: quote.warrantyInformation,
  leadTime: quote.leadTime,
  specialInstructions: quote.specialInstructions,
  internalNotes: quote.internalNotes,
  linkedUser: quote.linkedUser || null,
  linkedLead: quote.linkedLead || null,
  project: quote.project || null,
  services: quote.services.map(({ _key, ...service }) => ({
    ...service,
    items: (service.items || [])
      .filter((item) => !isBlankItem(item))
      .map(({ _key: itemKey, customerUnitPrice, customerTotal, ...item }) => ({
        ...item,
        costPrice: item.costPrice ?? undefined,
      })),
  })),
});

// Rows the user added but never filled in aren't saved
export const isBlankItem = (item) =>
  !String(item.name || "").trim() &&
  !String(item.description || "").trim() &&
  !Number(item.unitPrice) &&
  !String(item.notes || "").trim();

/** Shape the client preview / PDF renderer expect */
export const toPreview = (quote) => ({
  ...quote,
  quoteNumber: quote.quoteNumber || "DRAFT",
  createdAt: quote.createdAt || new Date().toISOString(),
  services: quote.services.map((service) => ({
    ...service,
    items: (service.items || [])
      .filter((item) => !isBlankItem(item))
      .map((item) => ({ ...item, total: lineTotal(item) })),
  })),
});

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;

export const lineTotal = (item) =>
  round2((Number(item.quantity) || 0) * (Number(item.unitPrice) || 0));

export const lineMargin = (item) => {
  if (item.costPrice === null || item.costPrice === undefined) return null;
  const price = Number(item.unitPrice) || 0;
  if (price === 0) return null;
  return ((price - Number(item.costPrice)) / price) * 100;
};

/**
 * Evaluate a numeric cell entry. Accepts plain numbers ("1,250.50", "£40")
 * and simple arithmetic, optionally prefixed with "=" like a spreadsheet
 * ("=12*3.5", "2.4*3+1"). Returns null when the input isn't valid.
 * A tiny recursive-descent parser — no eval.
 */
export const evaluateNumber = (input) => {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  let src = String(input ?? "")
    .trim()
    .replace(/^=/, "")
    .replace(/[£,\s]/g, "");
  if (src === "") return null;
  if (!/^[\d.+\-*/()%]+$/.test(src)) return null;

  let pos = 0;
  const peek = () => src[pos];
  const parseExpr = () => {
    let value = parseTerm();
    while (peek() === "+" || peek() === "-") {
      const op = src[pos++];
      const rhs = parseTerm();
      value = op === "+" ? value + rhs : value - rhs;
    }
    return value;
  };
  const parseTerm = () => {
    let value = parseFactor();
    while (peek() === "*" || peek() === "/") {
      const op = src[pos++];
      const rhs = parseFactor();
      value = op === "*" ? value * rhs : value / rhs;
    }
    return value;
  };
  const parseFactor = () => {
    if (peek() === "-") {
      pos++;
      return -parseFactor();
    }
    if (peek() === "+") {
      pos++;
      return parseFactor();
    }
    let value;
    if (peek() === "(") {
      pos++;
      value = parseExpr();
      if (peek() !== ")") throw new Error("Unclosed bracket");
      pos++;
    } else {
      const match = /^\d+\.?\d*|^\.\d+/.exec(src.slice(pos));
      if (!match) throw new Error("Expected number");
      pos += match[0].length;
      value = parseFloat(match[0]);
    }
    if (peek() === "%") {
      pos++;
      value /= 100;
    }
    return value;
  };

  try {
    const value = parseExpr();
    if (pos !== src.length || !Number.isFinite(value)) return null;
    return Math.round(value * 10000) / 10000;
  } catch {
    return null;
  }
};
