import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import Quote from "@/models/Quote";
import Invoice from "@/models/Invoice";
import Payment from "@/models/Payment";
import Project from "@/models/Project";
import Expense from "@/models/Expense";
import ItemPurchase from "@/models/ItemPurchase";
import ProjectChange from "@/models/ProjectChange";
import { Ticket } from "@/models/index.js";
import "@/models/User";
import { CRM_STAGES } from "@/libs/crmStages";

// Business report: read-only aggregation across sales, money and delivery.
// Definitions are deliberately simple and shown on the report screen.

const DAY = 86400000;
const round = (n) => Math.round((Number(n) || 0) * 100) / 100;
const sum = (rows, pick) =>
  round(rows.reduce((s, r) => s + (Number(pick(r)) || 0), 0));

export const REPORT_RANGES = {
  "30d": { label: "Last 30 days", days: 30 },
  "90d": { label: "Last 90 days", days: 90 },
  ytd: { label: "Year to date" },
  "12m": { label: "Last 12 months", days: 365 },
  all: { label: "All time" },
};

export const resolveRange = (key) => {
  const now = new Date();
  const range = REPORT_RANGES[key] ? key : "90d";
  let from = null;
  if (range === "ytd") from = new Date(now.getFullYear(), 0, 1);
  else if (REPORT_RANGES[range].days)
    from = new Date(now.getTime() - REPORT_RANGES[range].days * DAY);
  return { key: range, label: REPORT_RANGES[range].label, from, to: now };
};

const inRange = (date, from, to) => {
  if (!date) return false;
  const t = new Date(date).getTime();
  return (!from || t >= from.getTime()) && t <= to.getTime();
};

const monthKey = (date) => {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const lastMonths = (count) => {
  const now = new Date();
  return Array.from({ length: count }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (count - 1 - i), 1);
    return {
      key: monthKey(d),
      label: d.toLocaleDateString("en-GB", { month: "short" }),
      year: d.getFullYear(),
    };
  });
};

export async function getBusinessReport(rangeKey) {
  await connectMongo();
  const range = resolveRange(rangeKey);
  const { from, to } = range;
  const now = to;

  const [
    leads,
    quotes,
    invoices,
    payments,
    projects,
    expenses,
    purchases,
    changes,
    tickets,
  ] = await Promise.all([
    Lead.find({})
      .select(
        "name stage source value estimatedValue probability createdAt winLossDate winLossReason isArchived isActive linkedUser",
      )
      .lean(),
    Quote.find({})
      .select(
        "quoteNumber title status total sentAt createdAt updatedAt pricing.vatRate linkedLead linkedUser project client.name",
      )
      .lean(),
    Invoice.find({ status: { $ne: "draft" } })
      .select(
        "invoiceNumber title status total issueDate dueDate paymentDate createdAt updatedAt linkedUser project client.name",
      )
      .lean(),
    Payment.find({})
      .select("name amount status dueDate project user updatedAt")
      .lean(),
    Project.find({})
      .select(
        "name status startDate completionDate projectedFinishDate budget user sourceQuote",
      )
      .populate("user", "name")
      .lean(),
    Expense.find({}).select("project amount type purchaseDate").lean(),
    ItemPurchase.find({})
      .select("project paidPrice quotedPrice purchaseDate")
      .lean(),
    ProjectChange.find({ status: "Accepted" }).select("project cost").lean(),
    Ticket.find({ status: { $nin: ["Resolved", "Closed"] } })
      .select("priority status createdAt")
      .lean(),
  ]);

  // ── Money ────────────────────────────────────────────────────────────────
  const issuedAt = (inv) => inv.issueDate || inv.createdAt;
  const paidAt = (inv) =>
    inv.paymentDate || (inv.status === "paid" ? inv.updatedAt : null);
  const invoiced = invoices.filter((inv) => inRange(issuedAt(inv), from, to));
  const collected = invoices.filter(
    (inv) => inv.status === "paid" && inRange(paidAt(inv), from, to),
  );
  const outstanding = invoices.filter((inv) => inv.status === "sent");
  const overdue = outstanding.filter(
    (inv) => inv.dueDate && new Date(inv.dueDate) < now,
  );

  const upcoming = payments.filter((p) => p.status !== "Paid");
  const forecastWindow = (days) =>
    sum(
      upcoming.filter(
        (p) =>
          p.dueDate &&
          new Date(p.dueDate) >= now &&
          new Date(p.dueDate) <= new Date(now.getTime() + days * DAY),
      ),
      (p) => p.amount,
    );
  const overdueSchedule = upcoming.filter(
    (p) => p.dueDate && new Date(p.dueDate) < now,
  );

  const months = lastMonths(12).map((m) => ({
    ...m,
    invoiced: 0,
    collected: 0,
    leads: 0,
    won: 0,
  }));
  const byMonth = new Map(months.map((m) => [m.key, m]));
  invoices.forEach((inv) => {
    const m = byMonth.get(monthKey(issuedAt(inv)));
    if (m) m.invoiced = round(m.invoiced + (inv.total || 0));
    const paid = paidAt(inv);
    if (inv.status === "paid" && paid) {
      const pm = byMonth.get(monthKey(paid));
      if (pm) pm.collected = round(pm.collected + (inv.total || 0));
    }
  });

  // ── Sales ────────────────────────────────────────────────────────────────
  const activeLeads = leads.filter(
    (l) => l.isActive !== false && !l.isArchived,
  );
  const newLeads = leads.filter((l) => inRange(l.createdAt, from, to));
  leads.forEach((l) => {
    const m = byMonth.get(monthKey(l.createdAt));
    if (m) m.leads++;
    if (l.stage === "Won" && l.winLossDate) {
      const wm = byMonth.get(monthKey(l.winLossDate));
      if (wm) wm.won++;
    }
  });
  const leadValue = (l) => l.value || l.estimatedValue || 0;
  const open = activeLeads.filter((l) => !["Won", "Lost"].includes(l.stage));
  const pipeline = CRM_STAGES.filter((s) => !["Won", "Lost"].includes(s)).map(
    (stage) => {
      const rows = open.filter((l) => l.stage === stage);
      return {
        stage,
        count: rows.length,
        value: sum(rows, leadValue),
        weighted: sum(rows, (l) => leadValue(l) * (l.probability ?? 0)),
      };
    },
  );

  const decidedInRange = leads.filter(
    (l) =>
      ["Won", "Lost"].includes(l.stage) &&
      inRange(l.winLossDate || l.createdAt, from, to),
  );
  const sources = new Map();
  newLeads.forEach((l) => {
    const key = l.source || "Other";
    const row = sources.get(key) || {
      source: key,
      leads: 0,
      won: 0,
      lost: 0,
      wonValue: 0,
    };
    row.leads++;
    if (l.stage === "Won") {
      row.won++;
      row.wonValue += leadValue(l);
    }
    if (l.stage === "Lost") row.lost++;
    sources.set(key, row);
  });
  const lostReasons = new Map();
  decidedInRange
    .filter((l) => l.stage === "Lost")
    .forEach((l) => {
      const reason = l.winLossReason?.trim() || "Not recorded";
      lostReasons.set(reason, (lostReasons.get(reason) || 0) + 1);
    });

  const quoteDate = (q) => q.sentAt || q.createdAt;
  const quoteGross = (q) =>
    (q.total || 0) * (1 + (q.pricing?.vatRate ?? 20) / 100);
  const quotesInRange = quotes.filter(
    (q) => q.status !== "draft" && inRange(quoteDate(q), from, to),
  );
  const wonQuotes = quotesInRange.filter((q) => q.status === "won");
  const lostQuotes = quotesInRange.filter((q) =>
    ["lost", "expired"].includes(q.status),
  );
  const openQuotes = quotes.filter((q) =>
    ["sent", "pending"].includes(q.status),
  );

  // ── Delivery & profitability ────────────────────────────────────────────
  const costsByProject = new Map();
  const add = (map, id, key, value) => {
    const k = String(id);
    const row = map.get(k) || { expenses: 0, purchases: 0, changes: 0 };
    row[key] = round(row[key] + (Number(value) || 0));
    map.set(k, row);
  };
  expenses.forEach((e) => add(costsByProject, e.project, "expenses", e.amount));
  purchases.forEach((p) =>
    add(costsByProject, p.project, "purchases", p.paidPrice ?? p.quotedPrice),
  );
  changes.forEach((c) => add(costsByProject, c.project, "changes", c.cost));

  const paymentsByProject = new Map();
  payments.forEach((p) => {
    const k = String(p.project);
    const row = paymentsByProject.get(k) || {
      scheduled: 0,
      paid: 0,
      overdue: 0,
    };
    row.scheduled = round(row.scheduled + (p.amount || 0));
    if (p.status === "Paid") row.paid = round(row.paid + (p.amount || 0));
    else if (p.dueDate && new Date(p.dueDate) < now)
      row.overdue = round(row.overdue + (p.amount || 0));
    paymentsByProject.set(k, row);
  });

  const projectRows = projects
    .map((p) => {
      const k = String(p._id);
      const pay = paymentsByProject.get(k) || {
        scheduled: 0,
        paid: 0,
        overdue: 0,
      };
      const cost = costsByProject.get(k) || {
        expenses: 0,
        purchases: 0,
        changes: 0,
      };
      // Contract value: the payment schedule agreed with the client, else the budget
      const contract = pay.scheduled || p.budget || 0;
      const spend = round(cost.expenses + cost.purchases);
      const margin =
        contract > 0 ? round(((contract - spend) / contract) * 100) : null;
      return {
        id: k,
        name: p.name,
        client: p.user?.name || "—",
        clientId: p.user?._id ? String(p.user._id) : null,
        status: p.status,
        contract,
        collected: pay.paid,
        overdue: pay.overdue,
        expenses: cost.expenses,
        purchases: cost.purchases,
        changes: cost.changes,
        spend,
        margin,
        finishLate:
          p.status !== "Finished" &&
          p.projectedFinishDate &&
          new Date(p.projectedFinishDate) < now,
      };
    })
    .sort((a, b) =>
      a.status === b.status
        ? b.contract - a.contract
        : a.status === "On Going"
          ? -1
          : 1,
    );

  const ongoing = projectRows.filter((p) => p.status === "On Going");
  const finishedInRange = projects.filter(
    (p) => p.status === "Finished" && inRange(p.completionDate, from, to),
  );

  return {
    range,
    generatedAt: now.toISOString(),
    money: {
      invoiced: sum(invoiced, (i) => i.total),
      invoicedCount: invoiced.length,
      collected: sum(collected, (i) => i.total),
      collectedCount: collected.length,
      outstanding: sum(outstanding, (i) => i.total),
      outstandingCount: outstanding.length,
      overdue: sum(overdue, (i) => i.total),
      overdueCount: overdue.length,
      overdueInvoices: overdue
        .map((i) => ({
          id: String(i._id),
          number: i.invoiceNumber,
          client: i.client?.name,
          total: i.total,
          dueDate: i.dueDate,
          clientId: i.linkedUser ? String(i.linkedUser) : null,
        }))
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
      forecast: {
        d30: forecastWindow(30),
        d60: forecastWindow(60),
        d90: forecastWindow(90),
      },
      overdueSchedule: sum(overdueSchedule, (p) => p.amount),
      overdueScheduleCount: overdueSchedule.length,
    },
    months,
    sales: {
      newLeads: newLeads.length,
      openLeads: open.length,
      pipelineValue: sum(open, leadValue),
      weightedPipeline: sum(open, (l) => leadValue(l) * (l.probability ?? 0)),
      pipeline,
      leadsWon: decidedInRange.filter((l) => l.stage === "Won").length,
      leadsLost: decidedInRange.filter((l) => l.stage === "Lost").length,
      sources: [...sources.values()]
        .map((r) => ({
          ...r,
          wonValue: round(r.wonValue),
          conversion: r.won + r.lost > 0 ? r.won / (r.won + r.lost) : null,
        }))
        .sort((a, b) => b.leads - a.leads),
      lostReasons: [...lostReasons.entries()]
        .map(([reason, count]) => ({ reason, count }))
        .sort((a, b) => b.count - a.count),
      quotesSent: quotesInRange.length,
      quotesSentValue: sum(quotesInRange, quoteGross),
      quotesWon: wonQuotes.length,
      quotesWonValue: sum(wonQuotes, quoteGross),
      quoteWinRate:
        wonQuotes.length + lostQuotes.length > 0
          ? wonQuotes.length / (wonQuotes.length + lostQuotes.length)
          : null,
      avgQuote: quotesInRange.length
        ? round(sum(quotesInRange, quoteGross) / quotesInRange.length)
        : 0,
      openQuotes: openQuotes.length,
      openQuotesValue: sum(openQuotes, quoteGross),
    },
    delivery: {
      ongoing: ongoing.length,
      finishedInRange: finishedInRange.length,
      lateProjects: ongoing.filter((p) => p.finishLate).length,
      contractOngoing: sum(ongoing, (p) => p.contract),
      collectedOngoing: sum(ongoing, (p) => p.collected),
      projects: projectRows,
      openTickets: tickets.length,
      urgentTickets: tickets.filter((t) =>
        ["High", "Critical"].includes(t.priority),
      ).length,
    },
  };
}
