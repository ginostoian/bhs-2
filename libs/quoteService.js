import { businessFacts } from "@/libs/businessFacts";
import { DEFAULT_LEAD_TIME, DEFAULT_PAYMENT_TERMS } from "@/libs/quoteTerms";

// Server-side helpers shared by the admin quoting API routes.

const round2 = (n) => Math.round((Number(n) || 0) * 100) / 100;
const num = (v) => {
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : 0;
};
const optionalNum = (v) => {
  if (v === "" || v === null || v === undefined) return undefined;
  const n = parseFloat(v);
  return Number.isFinite(n) ? n : undefined;
};
const text = (v) => (v === null || v === undefined ? "" : String(v));

export const QUOTE_STATUSES = [
  "draft",
  "pending",
  "sent",
  "won",
  "lost",
  "expired",
];

// Fields an admin may set through POST/PUT. Everything else (tracking,
// tokens, numbering, authorship) is managed server-side.
export const EDITABLE_QUOTE_FIELDS = [
  "title",
  "projectType",
  "client",
  "projectAddress",
  "projectDescription",
  "startDate",
  "estimatedDuration",
  "template",
  "services",
  "pricing",
  "paymentTerms",
  "termsAndConditions",
  "warrantyInformation",
  "leadTime",
  "status",
  "validUntil",
  "clientResponse",
  "internalNotes",
  "specialInstructions",
  "linkedUser",
  "linkedLead",
  "project",
];

export const pickEditableFields = (body) => {
  const out = {};
  for (const key of EDITABLE_QUOTE_FIELDS) {
    if (Object.prototype.hasOwnProperty.call(body, key)) out[key] = body[key];
  }
  // Empty strings would fail ObjectId casting — treat them as "unlink"
  for (const key of ["linkedUser", "linkedLead", "project", "template"]) {
    if (out[key] === "") out[key] = null;
  }
  for (const key of ["startDate", "validUntil"]) {
    if (out[key] === "") out[key] = null;
  }
  return out;
};

const cleanItem = (item) => {
  const quantity = num(item.quantity);
  const unitPrice = num(item.unitPrice);
  const cleaned = {
    name: text(item.name).trim(),
    description: text(item.description),
    quantity,
    unit: text(item.unit).trim(),
    unitPrice,
    total: round2(quantity * unitPrice),
    notes: text(item.notes),
    internalNote: text(item.internalNote),
  };
  const costPrice = optionalNum(item.costPrice);
  if (costPrice !== undefined) cleaned.costPrice = costPrice;
  if (item._id) cleaned._id = item._id;
  return cleaned;
};

/**
 * Recalculate every line/category total server-side (never trust client
 * totals) and return { services, total } where total is ex. VAT.
 */
export const normalizeServices = (services = []) => {
  let total = 0;
  const cleaned = services.map((service, index) => {
    const base = service._id ? { _id: service._id } : {};
    if (service.type === "heading") {
      return {
        ...base,
        type: "heading",
        headingText: text(service.headingText).trim() || "Heading",
        headingDescription: text(service.headingDescription),
        order: index,
        items: [],
      };
    }
    const items = (service.items || []).map(cleanItem);
    const categoryTotal = round2(items.reduce((s, i) => s + i.total, 0));
    total += categoryTotal;
    return {
      ...base,
      type: "category",
      categoryName: text(service.categoryName).trim() || "Untitled section",
      description: text(service.description),
      categoryTotal,
      order: index,
      items,
    };
  });
  return { services: cleaned, total: round2(total) };
};

/** Problems that stop a quote being sent to a client. */
export const validateForSending = (quote) => {
  const errors = [];
  if (!text(quote.title).trim()) errors.push("Add a quote title");
  const clientName = text(quote.client?.name).trim();
  if (!clientName || clientName === "New client")
    errors.push("Add the client's name");
  if (!text(quote.client?.email).trim()) errors.push("Add the client's email");
  const items = (quote.services || []).flatMap((s) =>
    s.type === "heading" ? [] : s.items || [],
  );
  if (items.length === 0) errors.push("Add at least one line item");
  if (items.some((i) => !text(i.name).trim()))
    errors.push("Every line item needs a name");
  return errors;
};

const isPlaceholder = (value) => !value || String(value).startsWith("Draft -");

/** Fill client-facing terms that were left empty or as old draft placeholders. */
export const applyDefaultTerms = (quote) => {
  if (isPlaceholder(quote.termsAndConditions))
    quote.termsAndConditions = DEFAULT_PAYMENT_TERMS;
  if (isPlaceholder(quote.warrantyInformation))
    quote.warrantyInformation = businessFacts.workmanship;
  if (isPlaceholder(quote.leadTime)) quote.leadTime = DEFAULT_LEAD_TIME;
};

export const generateQuoteNumber = async (Quote) => {
  const year = new Date().getFullYear();
  const [latest] = await Quote.find({
    quoteNumber: { $regex: `^${year}\\d+$` },
  })
    .sort({ quoteNumber: -1 })
    .limit(1)
    .select("quoteNumber")
    .lean();
  const next = latest ? parseInt(latest.quoteNumber, 10) + 1 : null;
  return next ? String(next) : `${year}0001`;
};

/** Strip anything internal before a quote leaves the admin area. */
export const sanitizePublicQuote = (quote) => {
  const {
    internalNotes,
    createdBy,
    lastModifiedBy,
    revisionHistory,
    viewCount,
    firstViewed,
    lastViewed,
    template,
    linkedUser,
    linkedLead,
    project,
    ...rest
  } = quote;
  return {
    ...rest,
    services: (quote.services || []).map((service) => ({
      ...service,
      items: (service.items || []).map(
        ({ costPrice, internalNote, ...item }) => item,
      ),
    })),
  };
};
