import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import Payment from "@/models/Payment";
import { Task } from "@/models/index.js";
import {
  LinkButton,
  PageHeader,
  Stat,
  StatGrid,
  formatMoney,
} from "@/components/admin/ui";
import ProjectsList from "./components/ProjectsList";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage({ searchParams }) {
  await connectMongoose();
  const now = new Date();
  const page = Math.max(1, Number.parseInt(searchParams?.page, 10) || 1);
  const { projects, pagination } = await Project.getOngoingProjectsPaginated({
    page,
    limit: 20,
  });

  // Portfolio-wide numbers (not just this page)
  const ongoing = await Project.find({ status: "On Going" })
    .select("_id projectedFinishDate")
    .lean();
  const ongoingIds = ongoing.map((p) => p._id);
  const [payments, blockedTasks] = await Promise.all([
    Payment.find({ project: { $in: ongoingIds } })
      .select("project amount status dueDate")
      .lean(),
    Task.countDocuments({ project: { $in: ongoingIds }, status: "Blocked" }),
  ]);

  const money = new Map();
  payments.forEach((p) => {
    const key = String(p.project);
    const row = money.get(key) || { contract: 0, collected: 0, overdue: 0 };
    row.contract += p.amount || 0;
    if (p.status === "Paid") row.collected += p.amount || 0;
    else if (p.dueDate && new Date(p.dueDate) < now)
      row.overdue += p.amount || 0;
    money.set(key, row);
  });
  const totals = [...money.values()].reduce(
    (t, r) => ({
      contract: t.contract + r.contract,
      collected: t.collected + r.collected,
      overdue: t.overdue + r.overdue,
    }),
    { contract: 0, collected: 0, overdue: 0 },
  );
  const late = ongoing.filter(
    (p) => p.projectedFinishDate && new Date(p.projectedFinishDate) < now,
  ).length;
  const noFinish = ongoing.filter((p) => !p.projectedFinishDate).length;

  const rows = JSON.parse(
    JSON.stringify(
      projects.map((p) => ({
        ...p,
        money: money.get(String(p._id)) || {
          contract: 0,
          collected: 0,
          overdue: 0,
        },
      })),
    ),
  );

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Delivery"
        title="Projects on site"
        description="Live builds with programme, site-task progress and payment position. Open a project for tasks, schedule, changes, costs and notes."
        actions={
          <LinkButton href="/admin/finished-projects">
            Finished projects
          </LinkButton>
        }
      />
      <StatGrid>
        <Stat
          label="On site"
          value={pagination.total}
          hint={
            noFinish
              ? `${noFinish} without a finish date`
              : "All have finish dates"
          }
          tone="olive"
        />
        <Stat
          label="Past projected finish"
          value={late}
          tone={late ? "warn" : "good"}
        />
        <Stat
          label="Blocked site tasks"
          value={blockedTasks}
          tone={blockedTasks ? "bad" : "good"}
        />
        <Stat
          label="Collected / contract"
          value={formatMoney(totals.collected)}
          hint={`of ${formatMoney(totals.contract)}${totals.overdue ? ` · ${formatMoney(totals.overdue)} overdue` : ""}`}
          tone={totals.overdue ? "bad" : "good"}
          href="/admin/payments"
        />
      </StatGrid>
      <ProjectsList projects={rows} pagination={pagination} />
    </div>
  );
}
