"use client";

import {
  buildGanttLayout,
  formatGanttDate,
  utcDay,
} from "@/libs/ganttTimeline.mjs";

const money = (value) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value || 0);

function getInsights({
  tasks,
  adminTasks,
  milestones,
  expenses,
  payments,
  changes,
  itemPurchases,
}) {
  const today = utcDay(new Date());
  const schedule = buildGanttLayout({ tasks, milestones });
  const siteDone = tasks.filter((task) => task.status === "Done").length;
  const siteBlocked = tasks.filter((task) => task.status === "Blocked");
  const siteLate = schedule.scheduled.filter(
    (task) => task.status !== "Done" && task.end < today,
  );
  const officeOpen = adminTasks.filter((task) => task.status !== "Done");
  const officeLate = officeOpen.filter((task) => {
    const dueDate = utcDay(task.dueDate);
    return dueDate && dueDate < today;
  });
  const upcoming = schedule.milestones
    .filter(
      (milestone) =>
        milestone.status !== "Completed" && milestone.date >= today,
    )
    .sort((a, b) => a.date - b.date)[0];
  const pendingChanges = changes.filter((change) => change.status === "Review");
  const recordedExpenses = expenses.reduce(
    (sum, expense) => sum + (Number(expense.amount) || 0),
    0,
  );
  const recordedPurchases = itemPurchases.reduce(
    (sum, item) => sum + (Number(item.paidPrice) || 0),
    0,
  );
  const unpaidPayments = payments.filter(
    (payment) => payment.status !== "Paid",
  );
  return {
    siteDone,
    siteBlocked,
    siteLate,
    officeOpen,
    officeLate,
    upcoming,
    pendingChanges,
    recordedExpenses,
    recordedPurchases,
    unpaidPayments,
  };
}

function StatusBar({ label, count, total, color }) {
  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="w-24 shrink-0 text-slate-600">{label}</span>
      <div className="h-2 flex-1 rounded-full bg-slate-100">
        <div
          className={`h-2 rounded-full ${color}`}
          style={{ width: `${total ? (count / total) * 100 : 0}%` }}
        />
      </div>
      <span className="w-8 text-right font-medium text-slate-900">{count}</span>
    </div>
  );
}

export default function ProjectInsights({
  project,
  tasks = [],
  adminTasks = [],
  milestones = [],
  expenses = [],
  payments = [],
  changes = [],
  itemPurchases = [],
  compact = false,
  onNavigate,
}) {
  const insight = getInsights({
    tasks,
    adminTasks,
    milestones,
    expenses,
    payments,
    changes,
    itemPurchases,
  });
  const siteRows = [
    ["Scheduled", "bg-slate-400"],
    ["In Progress", "bg-blue-600"],
    ["Blocked", "bg-red-500"],
    ["Done", "bg-emerald-600"],
  ];
  const attention = [
    {
      label: "Site tasks past planned finish",
      count: insight.siteLate.length,
      tab: "tasks",
    },
    {
      label: "Blocked site tasks",
      count: insight.siteBlocked.length,
      tab: "tasks",
    },
    {
      label: "Overdue admin tasks",
      count: insight.officeLate.length,
      tab: "admin-tasks",
    },
    {
      label: "Changes awaiting a decision",
      count: insight.pendingChanges.length,
      tab: "changes",
    },
  ];
  const cards = [
    {
      label: "Site tasks complete",
      value: `${insight.siteDone}/${tasks.length}`,
      tab: "tasks",
    },
    {
      label: "Open admin tasks",
      value: insight.officeOpen.length,
      tab: "admin-tasks",
    },
    {
      label: "Next milestone",
      value: insight.upcoming
        ? formatGanttDate(insight.upcoming.date)
        : "None scheduled",
      detail: insight.upcoming?.name,
      tab: "milestones",
    },
    {
      label: "Recorded expenses",
      value: money(insight.recordedExpenses),
      tab: "expenses",
    },
  ];

  const exportCSV = () => {
    const lines = [
      ["Project", project.name],
      ["Site tasks", tasks.length],
      ["Site tasks done", insight.siteDone],
      ["Site tasks past planned finish", insight.siteLate.length],
      ["Blocked site tasks", insight.siteBlocked.length],
      ["Open admin tasks", insight.officeOpen.length],
      ["Overdue admin tasks", insight.officeLate.length],
      ["Pending changes", insight.pendingChanges.length],
      ["Project budget GBP", project.budget ?? ""],
      ["Recorded expenses GBP", insight.recordedExpenses],
      ["Recorded item purchases GBP", insight.recordedPurchases],
      ["Unpaid payment plan items", insight.unpaidPayments.length],
    ];
    const csv = lines
      .map((row) =>
        row
          .map((cell) => {
            const value = String(cell ?? "");
            const safeValue = /^[=+\-@]/.test(value) ? `'${value}` : value;
            return `"${safeValue.replaceAll('"', '""')}"`;
          })
          .join(","),
      )
      .join("\r\n");
    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8" }),
    );
    const link = document.createElement("a");
    link.href = url;
    link.download = `project-report-${project.id}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className={compact ? "mb-8 space-y-5" : "space-y-7"}>
      {!compact && (
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">
              Project report
            </h2>
            <p className="text-sm text-slate-500">
              A snapshot of recorded tasks, dates and costs. Refresh after
              making changes in another tab.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => window.location.reload()}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
            >
              Refresh
            </button>
            <button
              type="button"
              onClick={exportCSV}
              className="rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-700"
            >
              Export CSV
            </button>
          </div>
        </div>
      )}
      <div className="grid gap-px overflow-hidden rounded-lg border border-slate-200 bg-slate-200 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <button
            key={card.label}
            type="button"
            onClick={() => onNavigate(card.tab)}
            className="bg-white p-4 text-left hover:bg-slate-50"
          >
            <span className="block text-xs font-medium uppercase tracking-wide text-slate-500">
              {card.label}
            </span>
            <strong className="mt-2 block text-xl font-semibold text-slate-900">
              {card.value}
            </strong>
            {card.detail && (
              <span className="mt-1 block truncate text-xs text-slate-600">
                {card.detail}
              </span>
            )}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-2">
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Needs attention
          </h3>
          <div className="divide-y divide-slate-100">
            {attention.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => onNavigate(item.tab)}
                className="flex w-full items-center justify-between py-2.5 text-left text-sm hover:text-blue-700"
              >
                <span className="text-slate-700">{item.label}</span>
                <span
                  className={`rounded px-2 py-0.5 font-semibold ${item.count ? "bg-amber-50 text-amber-800" : "bg-slate-100 text-slate-500"}`}
                >
                  {item.count}
                </span>
              </button>
            ))}
          </div>
        </section>
        <section className="rounded-lg border border-slate-200 bg-white p-5">
          <h3 className="mb-4 text-base font-semibold text-slate-900">
            Site task status
          </h3>
          <div className="space-y-3">
            {siteRows.map(([status, color]) => (
              <StatusBar
                key={status}
                label={status}
                color={color}
                total={tasks.length}
                count={tasks.filter((task) => task.status === status).length}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-500">
            Completion counts site tasks only; it is not a measure of overall
            project completion.
          </p>
        </section>
      </div>
      {!compact && (
        <div className="grid gap-5 lg:grid-cols-2">
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Office work & decisions
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt>Admin tasks completed</dt>
                <dd className="font-medium">
                  {adminTasks.length - insight.officeOpen.length}/
                  {adminTasks.length}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Changes awaiting review</dt>
                <dd className="font-medium">{insight.pendingChanges.length}</dd>
              </div>
              <div className="flex justify-between">
                <dt>Unpaid payment plan items</dt>
                <dd className="font-medium">{insight.unpaidPayments.length}</dd>
              </div>
            </dl>
          </section>
          <section className="rounded-lg border border-slate-200 bg-white p-5">
            <h3 className="mb-4 text-base font-semibold text-slate-900">
              Recorded amounts
            </h3>
            <dl className="space-y-3 text-sm">
              <div className="flex justify-between">
                <dt>Project budget</dt>
                <dd className="font-medium">
                  {project.budget == null ? "Not set" : money(project.budget)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Expenses</dt>
                <dd className="font-medium">
                  {money(insight.recordedExpenses)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Item purchases paid price</dt>
                <dd className="font-medium">
                  {money(insight.recordedPurchases)}
                </dd>
              </div>
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              Purchases may also appear in expenses. These amounts are shown
              separately and are not added together.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
