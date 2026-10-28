import mongoose from "mongoose";
import connectMongoose from "@/libs/mongoose";
import {
  assertSafe,
  HIDDEN_MODELS,
  redact,
  reviveExtendedJson,
  SENSITIVE_KEYS,
} from "./queryGuards.mjs";
// Register every app model so agents can read any collection
import "@/models/AdminTask";
import "@/models/Attendance";
import "@/models/BathroomRenovation";
import "@/models/BookingConfirmation";
import "@/models/CRMView";
import "@/models/CalculatorRates";
import "@/models/CatalogueShare";
import "@/models/Contact";
import "@/models/Contractor";
import "@/models/Designer";
import "@/models/Document";
import "@/models/EmailAutomation";
import "@/models/EmailPreference";
import "@/models/EmailStats";
import "@/models/Employee";
import "@/models/Expense";
import "@/models/File";
import "@/models/GanttShare";
import "@/models/GeneralRenovation";
import "@/models/Invoice";
import "@/models/InvoiceTemplate";
import "@/models/ItemPurchase";
import "@/models/KitchenRenovation";
import "@/models/Lead";
import "@/models/LeadActivity";
import "@/models/LeadNote";
import "@/models/LeadTask";
import "@/models/Milestone";
import "@/models/Moodboard";
import "@/models/MoodboardProduct";
import "@/models/MoodboardSection";
import "@/models/Notification";
import "@/models/Partner";
import "@/models/Payment";
import "@/models/Product";
import "@/models/Project";
import "@/models/ProjectChange";
import "@/models/ProjectNote";
import "@/models/ProjectWeeklyUpdate";
import "@/models/Quote";
import "@/models/QuoteTemplate";
import "@/models/QuoteView";
import "@/models/RateCard";
import "@/models/Store";
import "@/models/Task";
import "@/models/TaskSection";
import "@/models/TaskStatusUpdate";
import "@/models/TemplateMessage";
import "@/models/TemplateService";
import "@/models/Ticket";
import "@/models/User";
import "@/models/McpAuditLog";

// Read-only database access for agents. The admin dashboard renders many
// pages straight from MongoDB, so agents need the same reach to "see
// everything". Writes never go through here — they use the API routes.

export const MAX_LIMIT = 200;

export function listModels() {
  return mongoose
    .modelNames()
    .filter((name) => !HIDDEN_MODELS.has(name))
    .sort();
}

export function getModel(name) {
  const match = listModels().find(
    (m) => m.toLowerCase() === String(name).toLowerCase(),
  );
  if (!match) {
    throw new Error(
      `Unknown model "${name}". Available: ${listModels().join(", ")}`,
    );
  }
  return mongoose.model(match);
}

/** Describe a model's fields (type, enum, required, ref) for agents. */
export function describeModel(name) {
  const model = getModel(name);
  const fields = {};
  model.schema.eachPath((path, schemaType) => {
    if (path === "__v" || SENSITIVE_KEYS.has(path.split(".").pop())) return;
    const opts = schemaType.options || {};
    const field = { type: schemaType.instance };
    if (schemaType.caster?.instance) field.itemType = schemaType.caster.instance;
    if (opts.enum) field.enum = Array.isArray(opts.enum) ? opts.enum : opts.enum.values;
    if (opts.required) field.required = true;
    if (opts.ref) field.ref = opts.ref;
    if (schemaType.caster?.options?.ref) field.ref = schemaType.caster.options.ref;
    if (opts.default !== undefined && typeof opts.default !== "function") {
      field.default = opts.default;
    }
    fields[path] = field;
  });
  return {
    model: model.modelName,
    collection: model.collection.collectionName,
    fields,
  };
}

export async function findRecords({
  model: modelName,
  filter = {},
  projection,
  sort,
  limit = 25,
  skip = 0,
  populate,
}) {
  await connectMongoose();
  const model = getModel(modelName);
  assertSafe(filter);
  filter = reviveExtendedJson(filter);
  let query = model
    .find(filter, projection || undefined)
    .sort(sort || { createdAt: -1 })
    .skip(Math.max(0, skip))
    .limit(Math.min(Math.max(1, limit), MAX_LIMIT));
  for (const p of [].concat(populate || [])) {
    const spec = typeof p === "string" ? { path: p } : p;
    if (spec.model && HIDDEN_MODELS.has(spec.model)) continue;
    query = query.populate({ ...spec, strictPopulate: false });
  }
  const [records, total] = await Promise.all([
    query.lean(),
    model.countDocuments(filter),
  ]);
  return {
    model: model.modelName,
    total,
    returned: records.length,
    skip,
    records: redact(records),
  };
}

export async function countRecords({ model: modelName, filter = {} }) {
  await connectMongoose();
  const model = getModel(modelName);
  assertSafe(filter);
  return {
    model: model.modelName,
    count: await model.countDocuments(reviveExtendedJson(filter)),
  };
}

export async function aggregateRecords({ model: modelName, pipeline = [] }) {
  await connectMongoose();
  const model = getModel(modelName);
  if (!Array.isArray(pipeline)) throw new Error("pipeline must be an array");
  assertSafe(pipeline, "pipeline");
  const capped = reviveExtendedJson(pipeline);
  if (!capped.some((stage) => stage.$limit)) capped.push({ $limit: MAX_LIMIT });
  const results = await model.aggregate(capped).option({ maxTimeMS: 20000 });
  return { model: model.modelName, results: redact(results) };
}
