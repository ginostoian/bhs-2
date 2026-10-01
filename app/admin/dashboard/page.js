import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import User from "@/models/User";
import Project from "@/models/Project";
import EmailAutomation from "@/models/EmailAutomation";
import AdminTask from "@/models/AdminTask";
import Task from "@/models/Task";
import ProjectChange from "@/models/ProjectChange";
import Payment from "@/models/Payment";
import ProjectWeeklyUpdate from "@/models/ProjectWeeklyUpdate";
import { Ticket } from "@/models/index.js";
import Invoice from "@/models/Invoice";
import Quote from "@/models/Quote";
import { formatDistanceToNow } from "date-fns";
import Link from "next/link";
import {
  Badge,
  LinkButton,
  PageHeader,
  Panel,
  Stat,
  StatGrid,
  compactCurrency,
  formatMoney,
  formatShortDate,
  relativeDays,
} from "@/components/admin/ui";

async function getProjectAttention(now) {
  const projects = await Project.find({ status: "On Going" })
    .select("name projectedFinishDate projectManager")
    .populate("projectManager", "name")
    .sort({ startDate: -1 })
    .lean();
  const ids = projects.map((project) => project._id);
  if (!ids.length) return [];
  const [tasks, changes, payments, updates] = await Promise.all([
    Task.find({ project: { $in: ids }, status: { $ne: "Done" } })
      .select("project status plannedStartDate estimatedDuration")
      .lean(),
    ProjectChange.find({ project: { $in: ids }, status: "Review" })
      .select("project")
      .lean(),
    Payment.find({
      project: { $in: ids },
      status: { $ne: "Paid" },
      dueDate: { $lt: now },
    })
      .select("project")
      .lean(),
    ProjectWeeklyUpdate.find({ project: { $in: ids } })
      .select("project weekStart scheduleImpact costImpact")
      .sort({ weekStart: -1 })
      .lean(),
  ]);
  const rows = new Map(
    projects.map((project) => [
      String(project._id),
      { project, blocked: 0, late: 0, changes: 0, payments: 0, update: null },
    ]),
  );
  for (const task of tasks) {
    const row = rows.get(String(task.project));
    if (!row) continue;
    if (task.status === "Blocked") row.blocked++;
    if (
      task.plannedStartDate &&
      new Date(task.plannedStartDate).getTime() +
        Math.max(1, Number(task.estimatedDuration) || 1) * 86400000 <
        now.getTime()
    )
      row.late++;
  }
  for (const change of changes) {
    const row = rows.get(String(change.project));
    if (row) row.changes++;
  }
  for (const payment of payments) {
    const row = rows.get(String(payment.project));
    if (row) row.payments++;
  }
  for (const update of updates) {
    const row = rows.get(String(update.project));
    if (row && !row.update) row.update = update;
  }
  return [...rows.values()]
    .map((row) => ({
      ...row,
      updateDue:
        !row.update ||
        new Date(row.update.weekStart).getTime() < now.getTime() - 8 * 86400000,
      finishLate:
        row.project.projectedFinishDate &&
        new Date(row.project.projectedFinishDate) < now,
    }))
    .sort(
      (a, b) =>
        Number(b.finishLate) +
        b.late +
        b.blocked +
        b.changes +
        b.payments +
        Number(b.updateDue) -
        (Number(a.finishLate) +
          a.late +
          a.blocked +
          a.changes +
          a.payments +
          Number(a.updateDue)),
    );
}

async function countOverdueLeadActivities(now) {
  const rows = await LeadActivity.aggregate([
    { $match: { dueDate: { $lt: now }, status: { $ne: "done" } } },
    {
      $lookup: {
        from: "leads",
        localField: "leadId",
        foreignField: "_id",
        as: "lead",
      },
    },
    { $unwind: "$lead" },
    { $match: { "lead.isActive": true, "lead.isArchived": false } },
    { $count: "count" },
  ]);
  return rows[0]?.count || 0;
}

export const dynamic = "force-dynamic";

const OPEN_STAGES = { $nin: ["Won", "Lost"] };
const NOT_PAUSED = {
  $or: [{ agingPaused: false }, { agingPaused: { $exists: false } }],
};

/**
 * Admin overview: what needs attention today across sales, money, delivery
 * and support. Every item links to the record it's about.
 */
export default async function AdminDashboardPage() {
  const session = await getServerSession(authOptions);
  await connectMongoose();
  const now = new Date();
  const inAWeek = new Date(now.getTime() + 7 * 86400000);

  const [
    openLeads,
    agingLeads,
    overdueActivities,
    awaitingQuotes,
    overdueInvoices,
    dueThisWeek,
    overdueSchedule,
    ongoingCount,
    openTickets,
    urgentTickets,
    myTasks,
    recentActivities,
    projectAttention,
  ] = await Promise.all([
    Lead.countDocuments({
      isActive: true,
      isArchived: false,
      stage: OPEN_STAGES,
    }),
    Lead.find({
      isActive: true,
      isArchived: false,
      stage: OPEN_STAGES,
      agingDays: { $gte: 2 },
      ...NOT_PAUSED,
    })
      .select("name agingDays stage")
      .sort({ agingDays: -1 })
      .limit(5)
      .lean(),
    countOverdueLeadActivities(now),
    Quote.find({ status: { $in: ["sent", "pending"] } })
      .select(
        "quoteNumber title total pricing.vatRate sentAt viewCount lastViewed client.name",
      )
      .sort({ sentAt: 1 })
      .lean(),
    Invoice.find({ status: "sent", dueDate: { $lt: now } })
      .select("invoiceNumber title total dueDate client.name linkedUser")
      .sort({ dueDate: 1 })
      .lean(),
    Payment.find({
      status: { $ne: "Paid" },
      dueDate: { $gte: now, $lte: inAWeek },
    })
      .select("name amount dueDate project user")
      .populate("project", "name")
      .populate("user", "name")
      .sort({ dueDate: 1 })
      .lean(),
    Payment.find({ status: { $ne: "Paid" }, dueDate: { $lt: now } })
      .select("amount")
      .lean(),
    Project.countDocuments({ status: "On Going" }),
    Ticket.countDocuments({ status: { $nin: ["Resolved", "Closed"] } }),
    Ticket.find({
      status: { $nin: ["Resolved", "Closed"] },
      priority: { $in: ["High", "Critical"] },
    })
      .select("ticketNumber title priority createdAt user")
      .populate("user", "name")
      .sort({ createdAt: 1 })
      .limit(5)
      .lean(),
    AdminTask.find({ assignedTo: session.user.id, status: { $ne: "Done" } })
      .select("name dueDate priority status project")
      .populate("project", "name")
      .sort({ dueDate: 1 })
      .limit(6)
      .lean(),
    LeadActivity.find({ occurredAt: { $gte: new Date(now - 7 * 86400000) } })
      .sort({ occurredAt: -1 })
      .limit(8)
      .populate("leadId", "name isActive isArchived")
      .populate("createdBy", "name")
      .lean()
      .then((rows) =>
        rows.filter((a) => a.leadId?.isActive && !a.leadId?.isArchived),
      ),
    getProjectAttention(now),
  ]);

  const gross = (q) => (q.total || 0) * (1 + (q.pricing?.vatRate ?? 20) / 100);
  const awaitingValue = awaitingQuotes.reduce((s, q) => s + gross(q), 0);
  const overdueInvoiceTotal = overdueInvoices.reduce(
    (s, i) => s + (i.total || 0),
    0,
  );
  const overdueScheduleTotal = overdueSchedule.reduce(
    (s, p) => s + (p.amount || 0),
    0,
  );
  const dueWeekTotal = dueThisWeek.reduce((s, p) => s + (p.amount || 0), 0);
  const lateProjects = projectAttention.filter((r) => r.finishLate).length;
  const staleQuotes = awaitingQuotes.filter(
    (q) => q.sentAt && now - new Date(q.sentAt) > 7 * 86400000,
  );

  // One prioritised list of things to do today
  const attention = [
    ...overdueInvoices.slice(0, 4).map((i) => ({
      key: `inv-${i._id}`,
      tone: "bad",
      label: "Overdue invoice",
      title: `${i.invoiceNumber} · ${i.client?.name || ""}`,
      meta: `${formatMoney(i.total)} · due ${relativeDays(i.dueDate)}`,
      href: `/admin/invoicing/${i._id}/preview`,
    })),
    ...urgentTickets.map((t) => ({
      key: `t-${t._id}`,
      tone: "bad",
      label: `${t.priority} ticket`,
      title: `${t.ticketNumber} · ${t.title}`,
      meta: `${t.user?.name || "Unknown client"} · opened ${relativeDays(t.createdAt)}`,
      href: `/admin/tickets/${t._id}`,
    })),
    ...staleQuotes.slice(0, 4).map((q) => ({
      key: `q-${q._id}`,
      tone: "warn",
      label: "Quote to chase",
      title: `${q.title || `Quote #${q.quoteNumber}`} · ${q.client?.name || ""}`,
      meta: `${formatMoney(gross(q))} · sent ${relativeDays(q.sentAt)} · ${q.viewCount ? `viewed ${q.viewCount}×` : "not opened yet"}`,
      href: `/admin/quoting/${q._id}/edit`,
    })),
    ...agingLeads.map((l) => ({
      key: `l-${l._id}`,
      tone: l.agingDays >= 7 ? "warn" : "neutral",
      label: "Lead waiting",
      title: l.name,
      meta: `${l.agingDays} days without contact · ${l.stage}`,
      href: `/admin/crm?lead=${l._id}`,
    })),
  ];

  const greeting =
    now.getHours() < 12
      ? "Good morning"
      : now.getHours() < 18
        ? "Good afternoon"
        : "Good evening";

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow={now.toLocaleDateString("en-GB", {
          weekday: "long",
          day: "numeric",
          month: "long",
        })}
        title={`${greeting}${session.user.name ? `, ${session.user.name.split(" ")[0]}` : ""}`}
        description="What needs attention across sales, money, sites and support."
        actions={
          <>
            <LinkButton href="/admin/reports">Reports</LinkButton>
            <LinkButton href="/admin/quoting/create" variant="primary">
              New quote
            </LinkButton>
          </>
        }
      />

      <StatGrid columns={5}>
        <Stat
          label="Open leads"
          value={openLeads}
          hint={`${overdueActivities} overdue follow-ups`}
          tone={overdueActivities ? "warn" : "info"}
          href="/admin/crm"
        />
        <Stat
          label="Quotes awaiting reply"
          value={awaitingQuotes.length}
          hint={`${compactCurrency(awaitingValue)} · ${staleQuotes.length} over a week`}
          tone="clay"
          href="/admin/quoting/history"
        />
        <Stat
          label="Overdue money"
          value={formatMoney(overdueInvoiceTotal + overdueScheduleTotal)}
          hint={`${overdueInvoices.length} invoices · ${overdueSchedule.length} schedule items`}
          tone={
            overdueInvoices.length + overdueSchedule.length ? "bad" : "good"
          }
          href="/admin/reports"
        />
        <Stat
          label="Projects on site"
          value={ongoingCount}
          hint={
            lateProjects
              ? `${lateProjects} past finish date`
              : "All on programme"
          }
          tone={lateProjects ? "warn" : "olive"}
          href="/admin/projects"
        />
        <Stat
          label="Open tickets"
          value={openTickets}
          hint={
            urgentTickets.length
              ? `${urgentTickets.length} high priority`
              : "None high priority"
          }
          tone={urgentTickets.length ? "bad" : "neutral"}
          href="/admin/tickets"
        />
      </StatGrid>

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
        <div className="min-w-0 space-y-4">
          <Panel
            title="Needs attention"
            description="Overdue money, urgent tickets, quotes to chase and leads waiting"
            padded={false}
          >
            {attention.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[#7A807B]">
                All clear — nothing urgent right now.
              </p>
            ) : (
              <ul className="divide-y divide-[#EDE9E0]">
                {attention.map((item) => (
                  <li key={item.key}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-3 px-5 py-3 hover:bg-[#FAF8F4]"
                    >
                      <Badge tone={item.tone} className="w-28 justify-center">
                        {item.label}
                      </Badge>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-sm font-medium">
                          {item.title}
                        </span>
                        <span className="block truncate text-xs text-[#7A807B]">
                          {item.meta}
                        </span>
                      </span>
                      <span aria-hidden className="text-[#A3A8A4]">
                        →
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel
            title="Projects needing attention"
            description="Site tasks, changes, payments and weekly updates on live projects"
            actions={
              <LinkButton href="/admin/workforce" size="sm" variant="ghost">
                Plan workforce
              </LinkButton>
            }
            padded={false}
          >
            {projectAttention.length === 0 ? (
              <p className="px-5 py-8 text-center text-sm text-[#7A807B]">
                No projects on site.
              </p>
            ) : (
              <ul className="divide-y divide-[#EDE9E0]">
                {projectAttention.slice(0, 8).map((row) => {
                  const flags = [
                    row.finishLate && ["bad", "Finish date passed"],
                    row.late > 0 && ["bad", `${row.late} late site tasks`],
                    row.blocked > 0 && ["warn", `${row.blocked} blocked`],
                    row.changes > 0 && [
                      "warn",
                      `${row.changes} changes to review`,
                    ],
                    row.payments > 0 && [
                      "warn",
                      `${row.payments} overdue payments`,
                    ],
                    row.updateDue && ["neutral", "Weekly update due"],
                  ].filter(Boolean);
                  return (
                    <li key={String(row.project._id)}>
                      <Link
                        href={`/admin/projects/${row.project._id}`}
                        className="flex flex-col gap-2 px-5 py-3 hover:bg-[#FAF8F4] sm:flex-row sm:items-center sm:justify-between"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {row.project.name}
                          </span>
                          <span className="text-xs text-[#7A807B]">
                            {row.project.projectManager?.name ||
                              "No project manager"}
                          </span>
                        </span>
                        <span className="flex flex-wrap gap-1.5 sm:justify-end">
                          {flags.length ? (
                            flags.map(([tone, text]) => (
                              <Badge key={text} tone={tone}>
                                {text}
                              </Badge>
                            ))
                          ) : (
                            <Badge tone="good">On track</Badge>
                          )}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>
        </div>

        <div className="min-w-0 space-y-4">
          <Panel
            title="Money due this week"
            description={`${formatMoney(dueWeekTotal)} across ${dueThisWeek.length} payment stages`}
            actions={
              <LinkButton href="/admin/payments" size="sm" variant="ghost">
                Schedules
              </LinkButton>
            }
            padded={false}
          >
            {dueThisWeek.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[#7A807B]">
                No payment stages due in the next 7 days.
              </p>
            ) : (
              <ul className="divide-y divide-[#EDE9E0]">
                {dueThisWeek.slice(0, 6).map((p) => (
                  <li key={String(p._id)}>
                    <Link
                      href={
                        p.project?._id
                          ? `/admin/projects/${p.project._id}`
                          : `/admin/users/${p.user?._id}`
                      }
                      className="flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-[#FAF8F4]"
                    >
                      <span className="min-w-0">
                        <span className="block truncate text-sm font-medium">
                          {p.name}
                        </span>
                        <span className="block truncate text-xs text-[#7A807B]">
                          {p.project?.name || p.user?.name} ·{" "}
                          {formatShortDate(p.dueDate)}
                        </span>
                      </span>
                      <span className="text-sm font-semibold tabular-nums">
                        {formatMoney(p.amount)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <Panel title="My tasks" padded={false}>
            {myTasks.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[#7A807B]">
                No open tasks assigned to you.
              </p>
            ) : (
              <ul className="divide-y divide-[#EDE9E0]">
                {myTasks.map((task) => {
                  const overdue = task.dueDate && new Date(task.dueDate) < now;
                  return (
                    <li key={String(task._id)}>
                      <Link
                        href={
                          task.project?._id
                            ? `/admin/projects/${task.project._id}?task=${task._id}`
                            : "/admin/projects"
                        }
                        className="flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-[#FAF8F4]"
                      >
                        <span className="min-w-0">
                          <span className="block truncate text-sm font-medium">
                            {task.name}
                          </span>
                          <span className="block truncate text-xs text-[#7A807B]">
                            {task.project?.name || "No project"}
                          </span>
                        </span>
                        <span className="flex shrink-0 items-center gap-1.5">
                          {["high", "urgent"].includes(
                            String(task.priority).toLowerCase(),
                          ) && (
                            <Badge
                              status={task.priority}
                              className="capitalize"
                            >
                              {task.priority}
                            </Badge>
                          )}
                          <span
                            className={`text-xs ${overdue ? "font-semibold text-[#B42318]" : "text-[#7A807B]"}`}
                          >
                            {task.dueDate
                              ? relativeDays(task.dueDate)
                              : "No date"}
                          </span>
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel
            title="Recent CRM activity"
            description="Last 7 days"
            padded={false}
          >
            {recentActivities.length === 0 ? (
              <p className="px-5 py-6 text-sm text-[#7A807B]">
                No activity logged this week.
              </p>
            ) : (
              <ul className="divide-y divide-[#EDE9E0]">
                {recentActivities.map((a) => (
                  <li key={String(a._id)}>
                    <Link
                      href={`/admin/crm?lead=${a.leadId._id}`}
                      className="block px-5 py-2.5 hover:bg-[#FAF8F4]"
                    >
                      <span className="block text-sm">
                        <span className="font-medium">
                          {a.createdBy?.name || "System"}
                        </span>{" "}
                        <span className="text-[#4A524D]">
                          {String(a.title || a.type).toLowerCase()}
                        </span>{" "}
                        <span className="font-medium">· {a.leadId.name}</span>
                      </span>
                      <span className="text-xs text-[#7A807B]">
                        {formatDistanceToNow(new Date(a.occurredAt), {
                          addSuffix: true,
                        })}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </div>
      </div>
    </div>
  );
}
