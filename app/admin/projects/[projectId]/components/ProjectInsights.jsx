"use client";

import {
  formatGanttDate,
} from "@/libs/ganttTimeline.mjs";
import { calculateProjectFinancials } from "@/libs/projectFinancials.mjs";
import { getProjectInsights } from "@/libs/projectInsights.mjs";

const money = (value) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(value || 0);

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
  sourceQuote = null,
  invoices = [],
  recordedLabourHours = 0,
}) {
  const insight = getProjectInsights({
    tasks,
    adminTasks,
    milestones,
    changes,
  });
  const { agreedQuote, approvedChanges, recordedExpenses, recordedPurchases, unpaidPayments, invoiceTotal, paidInvoices, estimatedBalance } = calculateProjectFinancials({
    expenses, itemPurchases, changes, payments, invoices, sourceQuote, remainingCostEstimate: project.remainingCostEstimate,
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
      value: money(recordedExpenses),
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
      ["Recorded expenses GBP", recordedExpenses],
      ["Recorded item purchases GBP", recordedPurchases],
      ["Agreed quote GBP", agreedQuote?.total ?? ""],
      ["Accepted change value GBP", approvedChanges],
      ["Project-linked invoices GBP", invoiceTotal],
      ["Paid project-linked invoices GBP", paidInvoices],
      ["Recorded labour hours", recordedLabourHours],
      ["Estimated remaining cost GBP", project.remainingCostEstimate ?? ""],
      ["Indicative balance before unrecorded costs GBP", estimatedBalance ?? ""],
      ["Unpaid payment plan items", unpaidPayments.length],
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
                <dd className="font-medium">{unpaidPayments.length}</dd>
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
              <div className="flex justify-between"><dt>Agreed quote</dt><dd className="font-medium">{agreedQuote ? money(agreedQuote.total) : "Not linked or accepted"}</dd></div>
              <div className="flex justify-between"><dt>Accepted changes</dt><dd className="font-medium">{money(approvedChanges)}</dd></div>
              <div className="flex justify-between">
                <dt>Expenses</dt>
                <dd className="font-medium">
                  {money(recordedExpenses)}
                </dd>
              </div>
              <div className="flex justify-between">
                <dt>Item purchases paid price</dt>
                <dd className="font-medium">
                  {money(recordedPurchases)}
                </dd>
              </div>
              <div className="flex justify-between"><dt>Recorded labour hours</dt><dd className="font-medium">{recordedLabourHours.toFixed(1)} h</dd></div>
              <div className="flex justify-between"><dt>Project-linked invoices</dt><dd className="font-medium">{money(invoiceTotal)}</dd></div>
              <div className="flex justify-between"><dt>Paid project-linked invoices</dt><dd className="font-medium">{money(paidInvoices)}</dd></div>
              <div className="flex justify-between"><dt>Estimated cost remaining</dt><dd className="font-medium">{project.remainingCostEstimate == null ? "Not set" : money(project.remainingCostEstimate)}</dd></div>
              <div className="flex justify-between border-t border-slate-200 pt-3"><dt>Indicative balance before unrecorded costs</dt><dd className="font-semibold">{estimatedBalance == null ? "Needs accepted quote and cost estimate" : money(estimatedBalance)}</dd></div>
            </dl>
            <p className="mt-4 text-xs text-slate-500">
              This is not profit: purchases can overlap expenses; labour hours have no agreed cost rate; invoice values are not added to payment plan values. The indicative balance uses accepted quote plus accepted changes, less recorded expenses and the manually estimated remaining cost. Confirm VAT basis and all costs before relying on it.
            </p>
          </section>
        </div>
      )}
    </div>
  );
}
