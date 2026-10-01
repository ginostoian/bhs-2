import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Lead from "@/models/Lead";
import Quote from "@/models/Quote";
import Invoice from "@/models/Invoice";
import Payment from "@/models/Payment";
import Project from "@/models/Project";
import { Ticket } from "@/models/index.js";

// Everything linked to one client, for the client overview. Records are
// matched by their explicit link (linkedUser / user) and, for older records
// created before linking existed, by the client's email address.

const escapeRegex = (value) =>
  String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const id = (value) => (value ? String(value) : null);

export async function getClientRecords(userId) {
  await connectMongo();
  const user = await User.findById(userId).select("email name").lean();
  if (!user) return null;
  const email = user.email
    ? new RegExp(`^${escapeRegex(user.email)}$`, "i")
    : null;
  const byLinkOrEmail = (linkField, emailField) => ({
    $or: [
      { [linkField]: user._id },
      ...(email ? [{ [emailField]: email }] : []),
    ],
  });

  const [leads, quotes, invoices, payments, projects, tickets] =
    await Promise.all([
      Lead.find(byLinkOrEmail("linkedUser", "email"))
        .select("name stage value estimatedValue source createdAt linkedUser")
        .sort({ createdAt: -1 })
        .lean(),
      Quote.find(byLinkOrEmail("linkedUser", "client.email"))
        .select(
          "quoteNumber title status total pricing.vatRate createdAt sentAt project linkedUser",
        )
        .sort({ createdAt: -1 })
        .lean(),
      Invoice.find(byLinkOrEmail("linkedUser", "client.email"))
        .select(
          "invoiceNumber title status total dueDate issueDate paymentDate project linkedUser",
        )
        .sort({ createdAt: -1 })
        .lean(),
      Payment.find({ user: user._id })
        .select("name amount status dueDate project")
        .lean(),
      Project.find({ user: user._id })
        .select(
          "name status startDate projectedFinishDate completionDate budget sourceLead sourceQuote",
        )
        .sort({ startDate: -1 })
        .lean(),
      Ticket.find({ user: user._id })
        .select("ticketNumber title status priority createdAt project")
        .sort({ createdAt: -1 })
        .lean(),
    ]);

  const now = new Date();
  const unpaidInvoices = invoices.filter((i) => i.status === "sent");
  const summary = {
    contract: payments.reduce((s, p) => s + (p.amount || 0), 0),
    paid: payments
      .filter((p) => p.status === "Paid")
      .reduce((s, p) => s + (p.amount || 0), 0),
    outstandingInvoices: unpaidInvoices.reduce((s, i) => s + (i.total || 0), 0),
    overdueInvoices: unpaidInvoices
      .filter((i) => i.dueDate && new Date(i.dueDate) < now)
      .reduce((s, i) => s + (i.total || 0), 0),
    openTickets: tickets.filter(
      (t) => !["Resolved", "Closed"].includes(t.status),
    ).length,
  };

  return {
    summary,
    leads: leads.map((l) => ({
      id: id(l._id),
      name: l.name,
      stage: l.stage,
      value: l.value || l.estimatedValue || 0,
      source: l.source,
      createdAt: l.createdAt,
      matchedByEmail: !l.linkedUser,
    })),
    quotes: quotes.map((q) => ({
      id: id(q._id),
      number: q.quoteNumber,
      title: q.title,
      status: q.status,
      gross: (q.total || 0) * (1 + (q.pricing?.vatRate ?? 20) / 100),
      date: q.sentAt || q.createdAt,
      projectId: id(q.project),
      matchedByEmail: !q.linkedUser,
    })),
    invoices: invoices.map((i) => ({
      id: id(i._id),
      number: i.invoiceNumber,
      title: i.title,
      status:
        i.status === "sent" && i.dueDate && new Date(i.dueDate) < now
          ? "overdue"
          : i.status,
      total: i.total || 0,
      dueDate: i.dueDate,
      projectId: id(i.project),
      matchedByEmail: !i.linkedUser,
    })),
    projects: projects.map((p) => ({
      id: id(p._id),
      name: p.name,
      status: p.status,
      startDate: p.startDate,
      finishDate: p.completionDate || p.projectedFinishDate,
      sourceLeadId: id(p.sourceLead),
      sourceQuoteId: id(p.sourceQuote),
    })),
    tickets: tickets.map((t) => ({
      id: id(t._id),
      number: t.ticketNumber,
      title: t.title,
      status: t.status,
      priority: t.priority,
      createdAt: t.createdAt,
    })),
  };
}
