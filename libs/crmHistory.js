const FIELD_LABELS = {
  name: "Lead name",
  email: "Email address",
  phone: "Phone number",
  address: "Address",
  stage: "Pipeline stage",
  value: "Estimated value",
  estimatedValue: "Estimated value",
  probability: "Win probability",
  expectedCloseDate: "Expected close date",
  budget: "Budget",
  clientHealth: "Lead quality",
  source: "Lead source",
  customSource: "Lead source details",
  projectTypes: "Project type",
  customProjectType: "Project type details",
  assignedTo: "Owner",
  winLossReason: "Win/loss reason",
  referredBy: "Referral partner",
  referralSource: "Referral source",
  marketingConsent: "Email follow-up consent",
  lifecycleStatus: "Contact status",
  attribution: "Marketing attribution",
};

const ATTRIBUTION_LABELS = {
  utmSource: "Source",
  utmMedium: "Medium",
  utmCampaign: "Campaign",
  utmTerm: "Search term",
  utmContent: "Content",
  referrer: "Referring page",
  landingPage: "Landing page",
  acquisitionCost: "Acquisition cost",
};

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 2,
});

const humaniseKey = (key) =>
  String(key)
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replaceAll("_", " ")
    .replace(/^./, (letter) => letter.toUpperCase());

export const normalizeCRMHistoryValue = (input) => {
  if (input === undefined || input === null || input === "") return null;
  if (input instanceof Date) return input.toISOString();
  if (typeof input?.toHexString === "function") return input.toHexString();

  const value =
    typeof input?.toObject === "function" ? input.toObject() : input;
  if (Array.isArray(value)) return value.map(normalizeCRMHistoryValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.keys(value)
        .filter((key) => value[key] !== undefined)
        .sort()
        .map((key) => [key, normalizeCRMHistoryValue(value[key])]),
    );
  }
  return value;
};

export const crmHistoryValuesEqual = (left, right) =>
  JSON.stringify(normalizeCRMHistoryValue(left)) ===
  JSON.stringify(normalizeCRMHistoryValue(right));

export const extractHistoryReferenceId = (value) => {
  const candidate =
    value && typeof value === "object"
      ? value.id || value._id || value.$oid
      : value;
  const id = candidate ? String(candidate) : "";
  return /^[a-f\d]{24}$/i.test(id) ? id : null;
};

export const normalizeCRMHistoryFieldValue = (field, value) => {
  if (["assignedTo", "referredBy"].includes(field)) {
    return extractHistoryReferenceId(value) || normalizeCRMHistoryValue(value);
  }
  return normalizeCRMHistoryValue(value);
};

export const crmHistoryFieldValuesEqual = (field, left, right) =>
  JSON.stringify(normalizeCRMHistoryFieldValue(field, left)) ===
  JSON.stringify(normalizeCRMHistoryFieldValue(field, right));

const formatDate = (value) => {
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? String(value)
    : date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      });
};

const formatValue = (field, input, userNames = {}) => {
  const value = normalizeCRMHistoryValue(input);
  if (value === null) return field === "assignedTo" ? "Unassigned" : "Not set";

  if (field === "assignedTo") {
    const id = extractHistoryReferenceId(value);
    if (id && userNames[id]) return userNames[id];
    if (value?.name || value?.email) return value.name || value.email;
    return "A team member";
  }
  if (field === "referredBy") {
    return value?.name || value?.email || "A referral partner";
  }
  if (Array.isArray(value)) {
    return value.length ? value.map(String).join(", ") : "None";
  }
  if (["value", "estimatedValue"].includes(field)) {
    return currency.format(Number(value) || 0);
  }
  if (field === "probability") {
    const probability = Number(value);
    return `${Math.round(probability <= 1 ? probability * 100 : probability)}%`;
  }
  if (field === "expectedCloseDate") return formatDate(value);
  if (field === "marketingConsent") {
    return value === true ? "Consent recorded" : "Consent not recorded";
  }
  if (typeof value === "boolean") return value ? "Yes" : "No";
  if (value && typeof value === "object") {
    return Object.entries(value)
      .map(([key, nested]) => `${humaniseKey(key)}: ${nested ?? "Not set"}`)
      .join("; ");
  }
  return String(value);
};

const describeAttribution = (oldValue, newValue) => {
  const before = normalizeCRMHistoryValue(oldValue) || {};
  const after = normalizeCRMHistoryValue(newValue) || {};
  return [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((key) => !crmHistoryValuesEqual(before[key], after[key]))
    .map((key) => {
      const label = ATTRIBUTION_LABELS[key] || humaniseKey(key);
      const format = key === "acquisitionCost" ? "estimatedValue" : key;
      return `${label}: ${formatValue(format, before[key])} → ${formatValue(format, after[key])}`;
    })
    .join("\n");
};

export const describeCRMHistoryChange = (change, userNames = {}) => {
  const label = FIELD_LABELS[change.field] || humaniseKey(change.field);
  const before = formatValue(change.field, change.oldValue, userNames);
  const after = formatValue(change.field, change.newValue, userNames);

  if (change.field === "attribution") {
    return {
      title: "Marketing attribution updated",
      body: describeAttribution(change.oldValue, change.newValue),
    };
  }
  if (change.field === "assignedTo" && before === "Unassigned") {
    return {
      title: "Owner assigned",
      body: `${after} is now responsible for this lead.`,
    };
  }
  if (change.field === "assignedTo" && after === "Unassigned") {
    return {
      title: "Owner removed",
      body: `${before} is no longer responsible for this lead.`,
    };
  }
  if (["Not set", "None"].includes(before)) {
    return { title: `${label} added`, body: `Set to ${after}.` };
  }
  if (["Not set", "None"].includes(after)) {
    return { title: `${label} removed`, body: `Previously ${before}.` };
  }
  return {
    title: `${label} changed`,
    body: `Changed from ${before} to ${after}.`,
  };
};

export const isAutomaticHistoryComment = (comment) =>
  !comment || /^Updated\s+[a-zA-Z]/.test(comment);
