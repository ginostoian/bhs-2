import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import Payment from "@/models/Payment";
import Expense from "@/models/Expense";
import ItemPurchase from "@/models/ItemPurchase";
import {
  LinkButton,
  PageHeader,
  Stat,
  StatGrid,
  formatMoney,
} from "@/components/admin/ui";
import FinishedProjectsList from "./components/FinishedProjectsList";

export const dynamic = "force-dynamic";

/**
 * Finished projects: the record of completed work with final money position.
 */
export default async function AdminFinishedProjectsPage() {
  await connectMongoose();

  const projects = await Project.find({ status: "Finished" })
    .select(
      "name type location startDate completionDate projectedFinishDate budget user projectManager",
    )
    .populate("user", "name email")
    .populate("projectManager", "name")
    .sort({ completionDate: -1 })
    .lean();
  const ids = projects.map((p) => p._id);

  const [payments, expenses, purchases] = await Promise.all([
    Payment.find({ project: { $in: ids } })
      .select("project amount status")
      .lean(),
    Expense.find({ project: { $in: ids } })
      .select("project amount")
      .lean(),
    ItemPurchase.find({ project: { $in: ids } })
      .select("project paidPrice quotedPrice")
      .lean(),
  ]);
  const sumBy = (rows, value) => {
    const map = new Map();
    rows.forEach((r) =>
      map.set(
        String(r.project),
        (map.get(String(r.project)) || 0) + (Number(value(r)) || 0),
      ),
    );
    return map;
  };
  const contract = sumBy(payments, (p) => p.amount);
  const collected = sumBy(
    payments.filter((p) => p.status === "Paid"),
    (p) => p.amount,
  );
  const spend = sumBy(
    [
      ...expenses.map((e) => ({ project: e.project, v: e.amount })),
      ...purchases.map((p) => ({
        project: p.project,
        v: p.paidPrice ?? p.quotedPrice,
      })),
    ],
    (r) => r.v,
  );

  const rows = projects.map((p) => {
    const id = String(p._id);
    const value = contract.get(id) || p.budget || 0;
    const cost = spend.get(id) || 0;
    const days =
      p.startDate && p.completionDate
        ? Math.max(
            0,
            Math.round(
              (new Date(p.completionDate) - new Date(p.startDate)) / 86400000,
            ),
          )
        : null;
    return {
      id,
      name: p.name,
      type: p.type,
      location: p.location,
      client: p.user
        ? { id: String(p.user._id), name: p.user.name || p.user.email }
        : null,
      manager: p.projectManager?.name || null,
      startDate: p.startDate ? new Date(p.startDate).toISOString() : null,
      completionDate: p.completionDate
        ? new Date(p.completionDate).toISOString()
        : null,
      overran:
        p.completionDate &&
        p.projectedFinishDate &&
        new Date(p.completionDate) > new Date(p.projectedFinishDate),
      days,
      contract: value,
      collected: collected.get(id) || 0,
      spend: cost,
      margin: value > 0 ? ((value - cost) / value) * 100 : null,
    };
  });

  const totalValue = rows.reduce((s, r) => s + r.contract, 0);
  const unpaid = rows.reduce(
    (s, r) => s + Math.max(0, r.contract - r.collected),
    0,
  );
  const withDays = rows.filter((r) => r.days !== null);
  const avgDays = withDays.length
    ? Math.round(withDays.reduce((s, r) => s + r.days, 0) / withDays.length)
    : null;

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Delivery"
        title="Finished projects"
        description="Completed work with final value, what was collected and the recorded margin."
        actions={
          <LinkButton href="/admin/projects">Projects on site</LinkButton>
        }
      />
      <StatGrid>
        <Stat label="Finished" value={rows.length} tone="good" />
        <Stat
          label="Total value"
          value={formatMoney(totalValue)}
          tone="olive"
        />
        <Stat
          label="Still unpaid"
          value={formatMoney(unpaid)}
          tone={unpaid ? "bad" : "good"}
          hint={
            unpaid ? "Payment stages not marked paid" : "Everything collected"
          }
        />
        <Stat
          label="Average duration"
          value={avgDays === null ? "—" : `${avgDays} days`}
          tone="neutral"
        />
      </StatGrid>
      <FinishedProjectsList projects={rows} />
    </div>
  );
}
