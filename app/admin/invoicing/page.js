import connectMongoose from "@/libs/mongoose";
import Invoice from "@/models/Invoice";
import "@/models/User";
import "@/models/Project";
import {
  LinkButton,
  PageHeader,
  Stat,
  StatGrid,
  formatMoney,
} from "@/components/admin/ui";
import InvoicesTable from "./components/InvoicesTable";

export const dynamic = "force-dynamic";

const id = (v) => (v ? String(v._id || v) : null);
const iso = (d) => (d ? new Date(d).toISOString() : null);

/**
 * Invoicing: money position across every invoice (the previous screen counted
 * only the 20 invoices on the current page) and a searchable list linked to the
 * client account, project and lead each invoice belongs to.
 */
export default async function InvoicingPage() {
  await connectMongoose();
  const now = new Date();
  const invoices = await Invoice.find({})
    .select(
      "invoiceNumber title status total client.name client.email issueDate dueDate paymentDate createdAt updatedAt publicToken linkedUser linkedLead project sourcePayment",
    )
    .populate("linkedUser", "name email")
    .populate("project", "name")
    .sort({ createdAt: -1 })
    .lean();

  const rows = invoices.map((inv) => ({
    id: String(inv._id),
    invoiceNumber: inv.invoiceNumber,
    title: inv.title,
    status: inv.status,
    total: inv.total || 0,
    clientName: inv.client?.name || inv.linkedUser?.name || "",
    clientEmail: inv.client?.email || inv.linkedUser?.email || "",
    userId: id(inv.linkedUser),
    leadId: id(inv.linkedLead),
    project: inv.project
      ? { id: id(inv.project), name: inv.project.name }
      : null,
    fromPaymentPlan: !!inv.sourcePayment,
    issueDate: iso(inv.issueDate || inv.createdAt),
    dueDate: iso(inv.dueDate),
    paymentDate: iso(inv.paymentDate),
    createdAt: iso(inv.createdAt),
    publicToken: inv.publicToken || null,
    overdue:
      inv.status !== "paid" && inv.dueDate && new Date(inv.dueDate) < now,
  }));

  const sum = (list) => list.reduce((s, r) => s + r.total, 0);
  const unpaid = rows.filter((r) => r.status === "sent");
  const overdue = rows.filter((r) => r.overdue);
  const drafts = rows.filter((r) => r.status === "draft");
  const since = new Date(now.getFullYear(), now.getMonth(), 1);
  const paidThisMonth = rows.filter(
    (r) =>
      r.status === "paid" && new Date(r.paymentDate || r.createdAt) >= since,
  );

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Finance"
        title="Invoicing"
        description="Every invoice with what's outstanding, what's late and what's been collected."
        actions={
          <>
            <LinkButton href="/admin/payments">Payment plans</LinkButton>
            <LinkButton href="/admin/invoicing/create" variant="primary">
              New invoice
            </LinkButton>
          </>
        }
      />
      <StatGrid>
        <Stat
          label="Outstanding"
          value={formatMoney(sum(unpaid))}
          hint={`${unpaid.length} sent, not yet paid`}
          tone="info"
        />
        <Stat
          label="Overdue"
          value={formatMoney(sum(overdue))}
          hint={
            overdue.length
              ? `${overdue.length} past their due date`
              : "Nothing overdue"
          }
          tone={overdue.length ? "bad" : "good"}
        />
        <Stat
          label="Collected this month"
          value={formatMoney(sum(paidThisMonth))}
          hint={`${paidThisMonth.length} paid since the 1st`}
          tone="good"
          href="/admin/reports"
        />
        <Stat
          label="Drafts"
          value={drafts.length}
          hint={drafts.length ? formatMoney(sum(drafts)) : "None waiting"}
          tone="neutral"
        />
      </StatGrid>
      <InvoicesTable invoices={rows} />
    </div>
  );
}
