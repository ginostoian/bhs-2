import { z } from "zod";
import connectMongoose from "@/libs/mongoose";
import apiCatalog from "./apiCatalog.json";
import { callInternalApi } from "./internalApi";
import {
  aggregateRecords,
  countRecords,
  describeModel,
  findRecords,
  getModel,
  listModels,
} from "./dataAccess";
import { redact } from "./queryGuards.mjs";
import { recordAudit } from "./audit";
import { matchesCatalog } from "./catalogMatch.mjs";
import { CRM_STAGES } from "@/libs/crmStages";

// Tool definitions for the admin MCP server.
//
// Reads come straight from MongoDB (read-only, credentials redacted).
// Every write goes through the app's existing API routes via callInternalApi,
// so agents trigger the same validation, emails and notifications as the UI.

const MAX_RESULT_CHARS = 80000;

const id = (label) =>
  z
    .string()
    .regex(/^[A-Za-z0-9_-]+$/, "Must be a record ID")
    .describe(label);
const jsonObject = z.record(z.any());

const toText = (value) => {
  const text =
    typeof value === "string" ? value : JSON.stringify(value, null, 2);
  if (text.length <= MAX_RESULT_CHARS) return text;
  return `${text.slice(0, MAX_RESULT_CHARS)}\n…[truncated — narrow the query, use projection, or page with skip/limit]`;
};

const ok = (value) => ({ content: [{ type: "text", text: toText(value) }] });
const fail = (message, details) => ({
  isError: true,
  content: [
    {
      type: "text",
      text: toText(details ? { error: message, details } : { error: message }),
    },
  ],
});

/** Turn an internal API response into a tool result. */
const apiResult = (res) => {
  if (res.ok) {
    if (res.data && typeof res.data === "object" && "base64" in res.data) {
      return {
        content: [
          {
            type: "text",
            text: `Binary response (${res.contentType}, ${res.data.size} bytes) returned as an embedded resource.`,
          },
          {
            type: "resource",
            resource: {
              uri: "bhs://api-response",
              mimeType: res.contentType || "application/octet-stream",
              blob: res.data.base64,
            },
          },
        ],
      };
    }
    return ok(res.data);
  }
  return fail(`API returned ${res.status}`, res.data);
};

const toDate = (d) => (d ? new Date(d) : null);

/**
 * Zod enum built from a mongoose schema path, so agents see the allowed
 * values and they stay in sync with the models. Falls back to a string.
 */
const schemaEnum = (modelName, path) => {
  try {
    const schemaType = getModel(modelName).schema.path(path);
    const values = schemaType?.enumValues?.length
      ? schemaType.enumValues
      : schemaType?.caster?.enumValues;
    if (values?.length) return z.enum(values);
  } catch {}
  return z.string();
};

/**
 * Register every tool on the given McpServer.
 * `ctx` = { user, scopes, origin, tokenId, clientName }
 */
export function registerTools(server, ctx) {
  const canWrite = ctx.scopes.includes("write");

  const api = (method, path, { query, body, multipart } = {}) =>
    callInternalApi({
      origin: ctx.origin,
      user: ctx.user,
      method,
      path,
      query,
      body,
      multipart,
    });

  /**
   * Register a tool with auditing and scope checks.
   * `kind` is "read" | "write" | "destructive".
   */
  const tool = (name, { title, description, kind, input }, handler) => {
    if (kind !== "read" && !canWrite) return;
    server.registerTool(
      name,
      {
        title,
        description,
        inputSchema: input,
        annotations: {
          title,
          readOnlyHint: kind === "read",
          destructiveHint: kind === "destructive",
          idempotentHint: kind === "read",
          openWorldHint: false,
        },
      },
      async (args) => {
        const started = Date.now();
        const calls = [];
        const tracedApi = async (method, path, opts) => {
          const res = await api(method, path, opts);
          calls.push({ method, path, status: res.status });
          return res;
        };
        let result;
        let error = null;
        try {
          result = await handler(args || {}, { api: tracedApi });
        } catch (err) {
          error = err.message || String(err);
          result = fail(error);
        }
        const last = calls[calls.length - 1];
        recordAudit({
          ctx,
          tool: name,
          readOnly: kind === "read",
          input: args,
          method: last?.method,
          path: calls.length > 1 ? calls.map((c) => `${c.method} ${c.path}`).join(", ") : last?.path,
          status: last?.status,
          ok: !result?.isError,
          error: error || (result?.isError ? result.content?.[0]?.text?.slice(0, 500) : null),
          durationMs: Date.now() - started,
        });
        return result;
      },
    );
  };

  // ───────────────────────────── Discovery & reading ─────────────────────────────

  tool(
    "whoami",
    {
      title: "Who am I",
      description:
        "Shows which admin account this connection acts as, its permissions, and a quick guide to the available tools.",
      kind: "read",
      input: {},
    },
    async () =>
      ok({
        actingAs: ctx.user,
        scopes: ctx.scopes,
        connection: ctx.clientName,
        guide: [
          "search: find clients, leads, projects, quotes, invoices, tickets or employees by name/email/phone/postcode.",
          "query_records / count_records / aggregate_records: read any data (call describe_model first to see fields).",
          "get_project_overview, list_payments, dashboard_summary: common views.",
          "Purpose-built write tools cover projects, tasks, payments, quotes, users and leads.",
          "list_api_endpoints + call_api: do anything else the admin dashboard can do.",
        ],
      }),
  );

  tool(
    "search",
    {
      title: "Search everything",
      description:
        "Global admin search across users/clients, CRM leads, projects, quotes, invoices, tickets and employees. Matches names, emails, phones, postcodes, addresses and reference numbers.",
      kind: "read",
      input: { q: z.string().min(2).describe("Search text (min 2 characters)") },
    },
    async ({ q }, { api }) => apiResult(await api("GET", "/api/admin/search", { query: { q } })),
  );

  tool(
    "describe_model",
    {
      title: "Describe data model",
      description:
        "Lists every data model (collection) when called without a name, or returns a model's fields, types, enums and references. Use before query_records or before building request bodies.",
      kind: "read",
      input: {
        model: z
          .string()
          .optional()
          .describe("Model name, e.g. Project, Task, Payment, Quote, Lead, User, Invoice"),
      },
    },
    async ({ model }) => (model ? ok(describeModel(model)) : ok({ models: listModels() })),
  );

  tool(
    "query_records",
    {
      title: "Query records",
      description:
        'Read records from any model with a MongoDB filter. Examples: {"model":"Payment","filter":{"status":"Due"},"populate":["user","project"]}; {"model":"Task","filter":{"project":"<projectId>","status":{"$ne":"Done"}}}. ObjectId strings are cast automatically. Use {"$regex":"smith","$options":"i"} for text matching. Credentials are never returned.',
      kind: "read",
      input: {
        model: z.string().describe("Model name (see describe_model)"),
        filter: jsonObject.optional().describe("MongoDB filter object"),
        projection: z
          .union([jsonObject, z.string()])
          .optional()
          .describe('Fields to include/exclude, e.g. "name status dueDate" or {"services":0}'),
        sort: jsonObject.optional().describe('Sort, e.g. {"dueDate":1}. Default {"createdAt":-1}'),
        limit: z.number().int().min(1).max(200).optional().describe("Max records (default 25, max 200)"),
        skip: z.number().int().min(0).optional().describe("Records to skip for paging"),
        populate: z
          .array(z.union([z.string(), jsonObject]))
          .optional()
          .describe('Reference fields to expand, e.g. ["user","project"] or [{"path":"user","select":"name email"}]'),
      },
    },
    async (args) => ok(await findRecords(args)),
  );

  tool(
    "count_records",
    {
      title: "Count records",
      description: "Count records in any model matching a MongoDB filter.",
      kind: "read",
      input: {
        model: z.string(),
        filter: jsonObject.optional(),
      },
    },
    async (args) => ok(await countRecords(args)),
  );

  tool(
    "aggregate_records",
    {
      title: "Aggregate records",
      description:
        'Run a read-only MongoDB aggregation pipeline for reports and totals (e.g. sum of unpaid payments per client). Write {"$oid":"..."} for ObjectIds and {"$date":"2026-01-01"} for dates inside pipelines. $out/$merge/$where/$function are blocked; results are capped at 200 rows unless you add $limit.',
      kind: "read",
      input: {
        model: z.string(),
        pipeline: z.array(jsonObject),
      },
    },
    async (args) => ok(await aggregateRecords(args)),
  );

  tool(
    "get_project_overview",
    {
      title: "Project overview",
      description:
        "Everything about one project in a single call: project details, client, task sections and tasks, payments, recent notes, expenses, changes, linked quotes and invoices.",
      kind: "read",
      input: { projectId: id("Project ID") },
    },
    async ({ projectId }) => {
      await connectMongoose();
      const Project = getModel("Project");
      const project = await Project.findById(projectId)
        .populate("user", "name email phone address projectStatus")
        .populate("projectManager", "name position email")
        .lean();
      if (!project) return fail("Project not found");
      const userId = project.user?._id;
      const find = (model, filter, opts = {}) =>
        getModel(model)
          .find(filter)
          .sort(opts.sort || { createdAt: -1 })
          .limit(opts.limit || 100)
          .populate(opts.populate || [])
          .select(opts.select || "")
          .lean();
      const [sections, tasks, payments, notes, expenses, changes, quotes, invoices] =
        await Promise.all([
          find("TaskSection", { project: projectId }, { sort: { order: 1 } }),
          find("Task", { project: projectId }, {
            sort: { order: 1 },
            limit: 300,
            populate: [{ path: "assignedWorkers", select: "name position" }],
            select: "-attachments",
          }),
          find("Payment", { $or: [{ project: projectId }, { user: userId, project: null }] }, { sort: { order: 1 } }),
          find("ProjectNote", { project: projectId }, { limit: 20 }),
          find("Expense", { project: projectId }),
          find("ProjectChange", { project: projectId }, { limit: 50 }),
          find("Quote", { $or: [{ project: projectId }, ...(userId ? [{ linkedUser: userId }] : [])] }, {
            select: "quoteNumber title status total validUntil sentAt createdAt",
          }),
          userId
            ? find("Invoice", { $or: [{ project: projectId }, { linkedUser: userId }] }, { limit: 50 }).catch(() => [])
            : [],
        ]);
      const paid = payments.filter((p) => p.status === "Paid").reduce((s, p) => s + (p.amount || 0), 0);
      const outstanding = payments.filter((p) => p.status !== "Paid").reduce((s, p) => s + (p.amount || 0), 0);
      return ok(
        redact({
          project,
          sections,
          tasks,
          payments,
          paymentTotals: { paid, outstanding },
          notes,
          expenses,
          changes,
          quotes,
          invoices,
        }),
      );
    },
  );

  tool(
    "list_payments",
    {
      title: "List payments",
      description:
        "List client payments across all clients, with client and project names. Filter by status, client, project, overdue, or due-date range.",
      kind: "read",
      input: {
        status: z.enum(["Scheduled", "Due", "Paid"]).optional(),
        userId: z.string().optional().describe("Client (User) ID"),
        projectId: z.string().optional(),
        overdueOnly: z.boolean().optional().describe("Only unpaid payments past their due date"),
        dueFrom: z.string().optional().describe("ISO date"),
        dueTo: z.string().optional().describe("ISO date"),
        limit: z.number().int().min(1).max(200).optional(),
      },
    },
    async ({ status, userId, projectId, overdueOnly, dueFrom, dueTo, limit = 100 }) => {
      const filter = {};
      if (status) filter.status = status;
      if (userId) filter.user = userId;
      if (projectId) filter.project = projectId;
      if (overdueOnly) {
        filter.status = { $ne: "Paid" };
        filter.dueDate = { $lt: new Date() };
      }
      if (dueFrom || dueTo) {
        filter.dueDate = {
          ...(filter.dueDate || {}),
          ...(dueFrom ? { $gte: toDate(dueFrom) } : {}),
          ...(dueTo ? { $lte: toDate(dueTo) } : {}),
        };
      }
      const result = await findRecords({
        model: "Payment",
        filter,
        sort: { dueDate: 1 },
        limit,
        populate: [
          { path: "user", select: "name email" },
          { path: "project", select: "name status" },
        ],
      });
      const totalAmount = result.records.reduce((s, p) => s + (p.amount || 0), 0);
      return ok({ ...result, totalAmountOfReturned: totalAmount });
    },
  );

  tool(
    "dashboard_summary",
    {
      title: "Business summary",
      description:
        "Snapshot of the business right now: ongoing projects, overdue and upcoming payments, overdue tasks, open quotes, recent leads and open tickets.",
      kind: "read",
      input: {},
    },
    async () => {
      await connectMongoose();
      const now = new Date();
      const inTwoWeeks = new Date(now.getTime() + 14 * 864e5);
      const weekAgo = new Date(now.getTime() - 7 * 864e5);
      const m = (name) => getModel(name);
      const [
        ongoingProjects,
        overduePayments,
        upcomingPayments,
        overdueTasks,
        openQuotes,
        newLeads,
        openTickets,
        pendingStatusUpdates,
      ] = await Promise.all([
        m("Project").find({ status: "On Going" }).select("name progress projectedFinishDate user").populate("user", "name").lean(),
        m("Payment").find({ status: { $ne: "Paid" }, dueDate: { $lt: now } }).populate("user", "name email").populate("project", "name").sort({ dueDate: 1 }).lean(),
        m("Payment").find({ status: { $ne: "Paid" }, dueDate: { $gte: now, $lte: inTwoWeeks } }).populate("user", "name").populate("project", "name").sort({ dueDate: 1 }).lean(),
        m("Task").find({ status: { $nin: ["Done"] }, plannedStartDate: { $lt: now } }).select("name status plannedStartDate project").populate("project", "name").limit(50).lean(),
        m("Quote").find({ status: { $in: ["draft", "pending", "sent"] } }).select("quoteNumber title status total client.name sentAt validUntil").sort({ updatedAt: -1 }).limit(50).lean(),
        m("Lead").find({ createdAt: { $gte: weekAgo } }).select("name email stage source createdAt").sort({ createdAt: -1 }).limit(50).lean(),
        m("Ticket").countDocuments({ status: { $nin: ["Resolved", "Closed"] } }).catch(() => null),
        m("TaskStatusUpdate").countDocuments({ requestStatus: "pending" }).catch(() => null),
      ]);
      const sum = (rows) => rows.reduce((s, p) => s + (p.amount || 0), 0);
      return ok(
        redact({
          generatedAt: now,
          ongoingProjects: { count: ongoingProjects.length, projects: ongoingProjects },
          overduePayments: { count: overduePayments.length, total: sum(overduePayments), payments: overduePayments },
          paymentsDueNext14Days: { count: upcomingPayments.length, total: sum(upcomingPayments), payments: upcomingPayments },
          tasksPastPlannedStart: { count: overdueTasks.length, tasks: overdueTasks },
          openQuotes: { count: openQuotes.length, quotes: openQuotes },
          leadsLast7Days: { count: newLeads.length, leads: newLeads },
          openTickets,
          pendingTaskStatusUpdates: pendingStatusUpdates,
        }),
      );
    },
  );

  tool(
    "list_api_endpoints",
    {
      title: "List API endpoints",
      description:
        "Lists the app's API endpoints that call_api can use — covering everything the admin dashboard can do (CRM, invoicing, moodboards, employees, attendance, tickets, products, files, notifications, …). Filter by keyword to keep the list short.",
      kind: "read",
      input: {
        keyword: z.string().optional().describe("Matches path or description, e.g. invoice, lead, moodboard"),
        method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]).optional(),
      },
    },
    async ({ keyword, method }) => {
      const kw = keyword?.toLowerCase();
      const endpoints = apiCatalog.filter(
        (e) =>
          (!method || e.method === method) &&
          (!kw || e.path.toLowerCase().includes(kw) || e.description?.toLowerCase().includes(kw)),
      );
      return ok({ count: endpoints.length, endpoints });
    },
  );

  // ───────────────────────────── Generic write access ─────────────────────────────

  tool(
    "call_api",
    {
      title: "Call app API",
      description:
        "Call any of the app's API endpoints as the connected admin — the same requests the admin dashboard makes, with the same validation, emails and notifications. Use list_api_endpoints to find the path and fields (replace {id} placeholders with real IDs). For GET requests prefer the read tools when they fit. File uploads: pass multipart with files as base64 or a public URL.",
      kind: "destructive",
      input: {
        method: z.enum(["GET", "POST", "PUT", "PATCH", "DELETE"]),
        path: z.string().describe("API path, e.g. /api/crm/leads/665f.../notes"),
        query: jsonObject.optional().describe("Query string parameters"),
        body: z.any().optional().describe("JSON request body"),
        multipart: z
          .object({
            fields: jsonObject.optional(),
            files: z
              .array(
                z.object({
                  field: z.string().optional().describe('Form field name (default "files")'),
                  filename: z.string(),
                  contentType: z.string().optional(),
                  base64: z.string().optional(),
                  url: z.string().optional(),
                }),
              )
              .optional(),
          })
          .optional()
          .describe("Use instead of body for multipart/form-data endpoints (uploads, tickets)"),
      },
    },
    async ({ method, path, query, body, multipart }, { api }) => {
      const cleanPath = path.split("?")[0];
      if (!matchesCatalog(apiCatalog, method, cleanPath)) {
        return fail(
          `${method} ${cleanPath} is not an available endpoint. Use list_api_endpoints to find the right path.`,
        );
      }
      return apiResult(await api(method, cleanPath, { query, body, multipart }));
    },
  );

  // ───────────────────────────── Clients & projects ─────────────────────────────

  tool(
    "create_client",
    {
      title: "Create client account",
      description:
        "Create a user account (client by default). Use projectStatus 'Lead' for prospects or 'On Going' for active clients.",
      kind: "write",
      input: {
        email: z.string().email(),
        name: z.string(),
        role: z.enum(["user", "admin", "employee", "designer", "referrer"]).optional(),
        projectStatus: z.string().optional().describe("e.g. Lead, On Going, Finished"),
        password: z.string().optional().describe("Optional initial password"),
      },
    },
    async (body, { api }) => apiResult(await api("POST", "/api/users", { body })),
  );

  tool(
    "create_project",
    {
      title: "Create project",
      description: "Create a new project for a client (moves a 'Lead' client to 'On Going').",
      kind: "write",
      input: {
        userId: id("Client (User) ID"),
        name: z.string(),
        type: z.string().describe("Project type, e.g. Kitchen Renovation, Bathroom, Extension, Loft Conversion"),
        description: z.string().optional(),
        location: z.string().optional(),
        budget: z.number().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        startDate: z.string().optional().describe("ISO date"),
        projectedFinishDate: z.string().optional().describe("ISO date"),
      },
    },
    async ({ userId, ...body }, { api }) =>
      apiResult(await api("POST", `/api/admin/users/${userId}/create-project`, { body })),
  );

  tool(
    "update_project",
    {
      title: "Update project",
      description:
        "Update project fields. Setting status to 'Finished' runs the normal completion flow.",
      kind: "write",
      input: {
        projectId: id("Project ID"),
        name: z.string().optional(),
        description: z.string().optional(),
        type: z.string().optional(),
        status: z.enum(["On Going", "Finished"]).optional(),
        location: z.string().optional(),
        budget: z.number().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        projectManager: z.string().optional().describe("Employee ID"),
        startDate: z.string().optional(),
        projectedFinishDate: z.string().optional(),
        notes: z.string().optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    async ({ projectId, ...body }, { api }) =>
      apiResult(await api("PUT", `/api/projects/${projectId}`, { body })),
  );

  tool(
    "add_project_note",
    {
      title: "Add project note",
      description: "Add a note to a project.",
      kind: "write",
      input: {
        projectId: id("Project ID"),
        title: z.string(),
        content: z.string(),
        tags: z.array(z.string()).optional(),
        isImportant: z.boolean().optional(),
      },
    },
    async ({ projectId, ...body }, { api }) =>
      apiResult(await api("POST", `/api/projects/${projectId}/notes`, { body })),
  );

  // ───────────────────────────── Tasks ─────────────────────────────

  tool(
    "create_task_section",
    {
      title: "Create task section",
      description: "Create a task section (phase) in a project, e.g. 'Demolition', 'First fix'.",
      kind: "write",
      input: {
        projectId: id("Project ID"),
        name: z.string(),
        description: z.string().optional(),
        color: z.string().optional(),
      },
    },
    async ({ projectId, ...body }, { api }) =>
      apiResult(await api("POST", `/api/projects/${projectId}/sections`, { body })),
  );

  tool(
    "create_task",
    {
      title: "Create task",
      description:
        "Create a project task. Give either sectionId or sectionName (an existing section with that name is used, otherwise it is created). Assign workers with Employee IDs.",
      kind: "write",
      input: {
        projectId: id("Project ID"),
        name: z.string(),
        sectionId: z.string().optional(),
        sectionName: z.string().optional(),
        description: z.string().optional(),
        status: z.enum(["Scheduled", "Blocked", "In Progress", "Done"]).optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        assignedWorkers: z.array(z.string()).optional().describe("Employee IDs"),
        plannedStartDate: z.string().optional().describe("ISO date"),
        estimatedDuration: z.number().optional().describe("Days"),
        notes: z.string().optional(),
        tags: z.array(z.string()).optional(),
      },
    },
    async ({ projectId, sectionId, sectionName, ...body }, { api }) => {
      let section = sectionId;
      if (!section) {
        if (!sectionName) return fail("Provide sectionId or sectionName");
        await connectMongoose();
        const existing = await getModel("TaskSection")
          .findOne({
            project: projectId,
            name: { $regex: `^${sectionName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, $options: "i" },
          })
          .lean();
        if (existing) {
          section = String(existing._id);
        } else {
          const created = await api("POST", `/api/projects/${projectId}/sections`, {
            body: { name: sectionName },
          });
          if (!created.ok) return apiResult(created);
          const doc = created.data?.section;
          section = doc?.id || doc?._id;
          if (!section) return fail("Section was created but its ID was not returned", created.data);
        }
      }
      return apiResult(
        await api("POST", `/api/projects/${projectId}/tasks`, { body: { ...body, section } }),
      );
    },
  );

  tool(
    "update_task",
    {
      title: "Update task",
      description:
        "Update a task: status, name, assignment, dates, priority, notes or section. Only the fields you pass change.",
      kind: "write",
      input: {
        taskId: id("Task ID"),
        status: z.enum(["Scheduled", "Blocked", "In Progress", "Done"]).optional(),
        name: z.string().optional(),
        description: z.string().optional(),
        assignedWorkers: z.array(z.string()).optional().describe("Employee IDs (replaces current assignment)"),
        plannedStartDate: z.string().nullable().optional(),
        estimatedDuration: z.number().optional(),
        priority: z.enum(["low", "medium", "high", "urgent"]).optional(),
        notes: z.string().optional(),
        section: z.string().optional().describe("Move to another section (section ID)"),
        tags: z.array(z.string()).optional(),
      },
    },
    async ({ taskId, ...body }, { api }) =>
      apiResult(await api("PUT", `/api/tasks/${taskId}`, { body })),
  );

  // ───────────────────────────── Payments ─────────────────────────────

  tool(
    "create_payment",
    {
      title: "Create payment",
      description:
        "Add a payment (instalment) to a client's payment plan. The client is notified as when created in the dashboard.",
      kind: "write",
      input: {
        userId: id("Client (User) ID"),
        projectId: z.string().optional(),
        name: z.string().describe('e.g. "Deposit", "2nd instalment"'),
        amount: z.number().min(0),
        dueDate: z.string().describe("ISO date"),
        status: z.enum(["Scheduled", "Due", "Paid"]).optional(),
      },
    },
    async ({ projectId, ...body }, { api }) =>
      apiResult(await api("POST", "/api/payments", { body: { ...body, project: projectId } })),
  );

  tool(
    "update_payment",
    {
      title: "Update payment",
      description: "Change a payment's name, amount, due date, project or status.",
      kind: "write",
      input: {
        paymentId: id("Payment ID"),
        name: z.string().optional(),
        amount: z.number().min(0).optional(),
        dueDate: z.string().optional(),
        projectId: z.string().nullable().optional(),
        status: z.enum(["Scheduled", "Due", "Paid"]).optional(),
      },
    },
    async ({ paymentId, projectId, ...body }, { api }) =>
      apiResult(
        await api("PUT", `/api/payments/${paymentId}`, {
          body: { ...body, ...(projectId !== undefined ? { project: projectId } : {}) },
        }),
      ),
  );

  tool(
    "mark_payment_paid",
    {
      title: "Mark payment as paid",
      description: "Mark a payment as Paid.",
      kind: "write",
      input: { paymentId: id("Payment ID") },
    },
    async ({ paymentId }, { api }) =>
      apiResult(await api("PUT", `/api/payments/${paymentId}`, { body: { status: "Paid" } })),
  );

  tool(
    "set_payment_plan",
    {
      title: "Set payment plan",
      description:
        "Replace or adjust a client's payment plan (optionally for one project) in one go. Payments with an id are updated, ones without are created, and with removeMissing=true unpaid payments not in the list are deleted. Paid payments are never changed or deleted. Use dryRun=true to preview.",
      kind: "destructive",
      input: {
        userId: id("Client (User) ID"),
        projectId: z.string().optional(),
        payments: z.array(
          z.object({
            id: z.string().optional().describe("Existing payment ID to update"),
            name: z.string(),
            amount: z.number().min(0),
            dueDate: z.string().describe("ISO date"),
          }),
        ),
        removeMissing: z.boolean().optional(),
        dryRun: z.boolean().optional(),
      },
    },
    async ({ userId, projectId, payments, removeMissing, dryRun }, { api }) => {
      await connectMongoose();
      const filter = { user: userId, ...(projectId ? { project: projectId } : {}) };
      const existing = await getModel("Payment").find(filter).sort({ order: 1 }).lean();
      const byId = new Map(existing.map((p) => [String(p._id), p]));
      const keep = new Set(payments.filter((p) => p.id).map((p) => p.id));

      const plan = { create: [], update: [], delete: [], skippedPaid: [] };
      for (const p of payments) {
        if (!p.id) {
          plan.create.push(p);
          continue;
        }
        const current = byId.get(p.id);
        if (!current) return fail(`Payment ${p.id} does not belong to this client/project`);
        if (current.status === "Paid") plan.skippedPaid.push({ id: p.id, name: current.name });
        else plan.update.push(p);
      }
      if (removeMissing) {
        for (const p of existing) {
          if (keep.has(String(p._id))) continue;
          if (p.status === "Paid") plan.skippedPaid.push({ id: String(p._id), name: p.name });
          else plan.delete.push({ id: String(p._id), name: p.name, amount: p.amount });
        }
      }
      if (dryRun) {
        return ok({
          dryRun: true,
          current: redact(existing),
          plan,
          newPlanTotal: payments.reduce((s, p) => s + p.amount, 0),
        });
      }

      const results = [];
      for (const p of plan.update) {
        const res = await api("PUT", `/api/payments/${p.id}`, {
          body: { name: p.name, amount: p.amount, dueDate: p.dueDate },
        });
        results.push({ action: "update", name: p.name, status: res.status, error: res.ok ? undefined : res.data });
      }
      for (const p of plan.create) {
        const res = await api("POST", "/api/payments", {
          body: { userId, project: projectId, name: p.name, amount: p.amount, dueDate: p.dueDate },
        });
        results.push({
          action: "create",
          name: p.name,
          status: res.status,
          id: res.data?.payment?.id,
          error: res.ok ? undefined : res.data,
        });
      }
      for (const p of plan.delete) {
        const res = await api("DELETE", `/api/payments/${p.id}`);
        results.push({ action: "delete", name: p.name, status: res.status, error: res.ok ? undefined : res.data });
      }
      const failed = results.filter((r) => r.status >= 400);
      return failed.length
        ? fail(`${failed.length} of ${results.length} changes failed`, { results, skippedPaid: plan.skippedPaid })
        : ok({ results, skippedPaid: plan.skippedPaid });
    },
  );

  // ───────────────────────────── Quotes ─────────────────────────────

  const quoteServices = z
    .array(
      z.object({
        type: z.enum(["category", "heading"]).optional().describe('Default "category"'),
        categoryName: z.string().optional(),
        description: z.string().optional(),
        headingText: z.string().optional(),
        items: z
          .array(
            z.object({
              name: z.string(),
              description: z.string().optional(),
              quantity: z.number(),
              unit: z.string().optional().describe("e.g. m², item, day"),
              unitPrice: z.number().describe("Price per unit ex. VAT"),
              costPrice: z.number().optional().describe("Internal cost (not shown to client)"),
              notes: z.string().optional(),
              internalNote: z.string().optional(),
            }),
          )
          .optional(),
      }),
    )
    .describe("Quote sections with line items. Totals are calculated by the server.");

  const quoteFields = {
    title: z.string().optional(),
    projectType: schemaEnum("Quote", "projectType").optional(),
    client: z
      .object({
        name: z.string().optional(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        postcode: z.string().optional(),
      })
      .optional(),
    projectAddress: z.string().optional(),
    projectDescription: z.string().optional(),
    startDate: z.string().optional(),
    estimatedDuration: z.any().optional(),
    template: z.string().optional().describe("QuoteTemplate ID"),
    services: quoteServices.optional(),
    pricing: jsonObject.optional().describe("depositRequired, depositAmount, depositPercentage, vatRate"),
    paymentTerms: jsonObject.optional(),
    termsAndConditions: z.string().optional(),
    warrantyInformation: z.string().optional(),
    leadTime: z.any().optional(),
    validUntil: z.string().optional(),
    internalNotes: z.string().optional(),
    specialInstructions: z.string().optional(),
    linkedUser: z.string().optional().describe("Client (User) ID"),
    linkedLead: z.string().optional().describe("CRM Lead ID"),
    project: z.string().optional().describe("Project ID"),
  };

  tool(
    "create_quote",
    {
      title: "Create quote",
      description:
        "Create a new quote (always starts as a draft). Look at existing quotes, rate cards (RateCard) and template services (TemplateService) with query_records for typical items and prices.",
      kind: "write",
      input: quoteFields,
    },
    async (body, { api }) => apiResult(await api("POST", "/api/admin/quoting", { body })),
  );

  tool(
    "update_quote",
    {
      title: "Update quote",
      description:
        "Update a quote. Passing services replaces all sections/items. Set status to 'sent' to mark it as sent to the client (validated first), or 'won'/'lost'/'expired' to close it.",
      kind: "write",
      input: {
        quoteId: id("Quote ID"),
        ...quoteFields,
        status: z.enum(["draft", "pending", "sent", "won", "lost", "expired"]).optional(),
        clientResponse: jsonObject.optional(),
      },
    },
    async ({ quoteId, ...body }, { api }) =>
      apiResult(await api("PUT", `/api/admin/quoting/${quoteId}`, { body })),
  );

  tool(
    "duplicate_quote",
    {
      title: "Duplicate quote",
      description: "Copy an existing quote into a new draft.",
      kind: "write",
      input: { quoteId: id("Quote ID") },
    },
    async ({ quoteId }, { api }) =>
      apiResult(await api("POST", `/api/admin/quoting/${quoteId}/duplicate`)),
  );

  // ───────────────────────────── CRM ─────────────────────────────

  tool(
    "create_lead",
    {
      title: "Create CRM lead",
      description: "Add a new lead to the CRM.",
      kind: "write",
      input: {
        name: z.string(),
        email: z.string().optional(),
        phone: z.string().optional(),
        address: z.string().optional(),
        stage: z.enum(CRM_STAGES).optional().describe("Pipeline stage (default New Enquiry)"),
        source: schemaEnum("Lead", "source").optional(),
        projectTypes: z.array(schemaEnum("Lead", "projectTypes")).optional(),
        value: z.number().optional(),
        budget: schemaEnum("Lead", "budget").optional(),
        tags: z.array(z.string()).optional(),
        expectedCloseDate: z.string().optional(),
      },
    },
    async (body, { api }) => apiResult(await api("POST", "/api/crm/leads", { body })),
  );

  tool(
    "update_lead",
    {
      title: "Update CRM lead",
      description:
        "Update a lead's details. To move it to another pipeline stage pass `stage` (uses the stage-change flow, including automations).",
      kind: "write",
      input: {
        leadId: id("Lead ID"),
        stage: z.enum(CRM_STAGES).optional(),
        stageComment: z.string().optional().describe("Optional comment logged with the stage change"),
        fields: jsonObject.optional().describe("Other lead fields to update"),
      },
    },
    async ({ leadId, stage, stageComment, fields }, { api }) => {
      const results = {};
      if (fields && Object.keys(fields).length) {
        const res = await api("PUT", `/api/crm/leads/${leadId}`, { body: fields });
        if (!res.ok) return apiResult(res);
        results.update = res.data;
      }
      if (stage) {
        const res = await api("PUT", `/api/crm/leads/${leadId}/stage`, {
          body: { stage, comment: stageComment },
        });
        if (!res.ok) return apiResult(res);
        results.stage = res.data;
      }
      return ok(results);
    },
  );

  tool(
    "add_lead_note",
    {
      title: "Add CRM lead note",
      description: "Add a note to a CRM lead.",
      kind: "write",
      input: {
        leadId: id("Lead ID"),
        content: z.string(),
        title: z.string().optional(),
        pinned: z.boolean().optional(),
      },
    },
    async ({ leadId, ...body }, { api }) =>
      apiResult(await api("POST", `/api/crm/leads/${leadId}/notes`, { body })),
  );
}
