import Link from "next/link";
import {
  Badge,
  Bar,
  LinkButton,
  PageHeader,
  Panel,
  Stat,
  StatGrid,
  Table,
  compactCurrency,
  cx,
  formatCurrency,
  formatMoney,
  formatShortDate,
  percent,
  relativeDays,
} from "@/components/admin/ui";
import MonthlyColumns from "@/components/admin/reports/MonthlyColumns";
import {
  REPORT_RANGES,
  getBusinessReport,
} from "@/libs/reports/businessReport";

export const dynamic = "force-dynamic";
export const metadata = { title: "Business reports" };

export default async function BusinessReportsPage({ searchParams }) {
  const report = await getBusinessReport(searchParams?.range);
  const { money, sales, delivery, months, range } = report;
  const maxPipeline = Math.max(...sales.pipeline.map((s) => s.value), 1);
  const maxSource = Math.max(...sales.sources.map((s) => s.leads), 1);
  const last12 = months.reduce((s, m) => s + m.collected, 0);

  return (
    <div>
      <PageHeader
        eyebrow="Reports"
        title="Business overview"
        description={`Money, sales and delivery for ${range.label.toLowerCase()}. Figures update live from invoices, quotes, leads and projects.`}
        actions={
          <>
            <LinkButton href="/admin/crm/reports">Sales detail</LinkButton>
            <LinkButton href="/admin/reports/attendance">Attendance</LinkButton>
          </>
        }
      />

      {/* Range */}
      <nav aria-label="Report period" className="mb-6 flex flex-wrap gap-1.5">
        {Object.entries(REPORT_RANGES).map(([key, r]) => (
          <Link
            key={key}
            href={`/admin/reports?range=${key}`}
            aria-current={range.key === key ? "page" : undefined}
            className={cx(
              "rounded-full border px-3 py-1.5 text-xs font-medium",
              range.key === key
                ? "border-[#202925] bg-[#202925] text-white"
                : "border-[#D8D2C6] bg-white text-[#4A524D] hover:border-[#4D5B4B]",
            )}
          >
            {r.label}
          </Link>
        ))}
      </nav>

      {/* ── Money ─────────────────────────────────────────────────────── */}
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#A65B43]">
        Money
      </h2>
      <StatGrid>
        <Stat
          label="Collected"
          value={formatMoney(money.collected)}
          hint={`${money.collectedCount} invoices paid`}
          tone="good"
        />
        <Stat
          label="Invoiced"
          value={formatMoney(money.invoiced)}
          hint={`${money.invoicedCount} invoices issued`}
          tone="olive"
          href="/admin/invoicing"
        />
        <Stat
          label="Outstanding now"
          value={formatMoney(money.outstanding)}
          hint={
            money.overdueCount
              ? `${formatMoney(money.overdue)} overdue · ${money.overdueCount} invoices`
              : "Nothing overdue"
          }
          tone={money.overdueCount ? "bad" : "neutral"}
          href="/admin/invoicing"
        />
        <Stat
          label="Due in next 30 days"
          value={formatMoney(money.forecast.d30)}
          hint="From payment schedules"
          tone="info"
          href="/admin/payments"
        />
      </StatGrid>

      <div className="mb-8 grid gap-4 xl:grid-cols-[minmax(0,2fr)_minmax(0,1fr)]">
        <Panel
          title="Cash collected by month"
          description={`Paid invoices, last 12 months · ${formatMoney(last12)} in total. Hover a month for the amount invoiced.`}
        >
          <MonthlyColumns
            months={months}
            valueKey="collected"
            valueLabel="Collected"
            tooltip={[{ key: "invoiced", label: "Invoiced" }]}
          />
        </Panel>
        <Panel
          title="Cash forecast"
          description="Unpaid stages on client payment schedules"
        >
          <dl className="space-y-3 text-sm">
            {[
              ["Next 30 days", money.forecast.d30],
              ["Next 60 days", money.forecast.d60],
              ["Next 90 days", money.forecast.d90],
            ].map(([label, value]) => (
              <div key={label} className="flex items-baseline justify-between">
                <dt className="text-[#4A524D]">{label}</dt>
                <dd className="font-semibold tabular-nums">
                  {formatMoney(value)}
                </dd>
              </div>
            ))}
            <div className="flex items-baseline justify-between border-t border-[#EDE9E0] pt-3">
              <dt className="text-[#B42318]">Past due on schedules</dt>
              <dd className="font-semibold tabular-nums text-[#B42318]">
                {formatMoney(money.overdueSchedule)}
                <span className="ml-1 text-xs font-normal">
                  ({money.overdueScheduleCount})
                </span>
              </dd>
            </div>
          </dl>
          <LinkButton href="/admin/payments" size="sm" variant="ghost">
            Open payment schedules →
          </LinkButton>
        </Panel>
      </div>

      {money.overdueInvoices.length > 0 && (
        <Panel
          title="Overdue invoices"
          description="Chase these first"
          className="mb-8"
          padded={false}
        >
          <Table
            rows={money.overdueInvoices}
            columns={[
              {
                header: "Invoice",
                render: (r) => (
                  <Link
                    href={`/admin/invoicing/${r.id}/preview`}
                    className="font-medium hover:underline"
                  >
                    {r.number}
                  </Link>
                ),
              },
              {
                header: "Client",
                render: (r) =>
                  r.clientId ? (
                    <Link
                      href={`/admin/users/${r.clientId}`}
                      className="hover:underline"
                    >
                      {r.client}
                    </Link>
                  ) : (
                    r.client
                  ),
              },
              {
                header: "Due",
                render: (r) => (
                  <span>
                    {formatShortDate(r.dueDate)}{" "}
                    <span className="text-xs text-[#B42318]">
                      ({relativeDays(r.dueDate)})
                    </span>
                  </span>
                ),
              },
              {
                header: "Amount",
                align: "right",
                render: (r) => formatCurrency(r.total),
              },
            ]}
          />
        </Panel>
      )}

      {/* ── Sales ─────────────────────────────────────────────────────── */}
      <h2 className="mb-3 text-[11px] font-bold uppercase tracking-[0.14em] text-[#A65B43]">
        Sales
      </h2>
      <StatGrid>
        <Stat
          label="New leads"
          value={sales.newLeads}
          hint={`${sales.leadsWon} won · ${sales.leadsLost} lost in period`}
          tone="info"
          href="/admin/crm"
        />
        <Stat
          label="Quotes sent"
          value={sales.quotesSent}
          hint={`${compactCurrency(sales.quotesSentValue)} inc. VAT · avg ${compactCurrency(sales.avgQuote)}`}
          tone="olive"
          href="/admin/quoting/history"
        />
        <Stat
          label="Quotes won"
          value={formatMoney(sales.quotesWonValue)}
          hint={`${sales.quotesWon} quotes · win rate ${percent(sales.quoteWinRate)}`}
          tone="good"
        />
        <Stat
          label="Open pipeline"
          value={compactCurrency(sales.pipelineValue)}
          hint={`${sales.openLeads} leads · weighted ${compactCurrency(sales.weightedPipeline)}`}
          tone="clay"
          href="/admin/crm"
        />
      </StatGrid>

      <div className="mb-4 grid gap-4 xl:grid-cols-2">
        <Panel
          title="Pipeline by stage"
          description="Open CRM leads now. Weighted = value × probability."
          padded={false}
        >
          <Table
            getRowKey={(r) => r.stage}
            rows={sales.pipeline}
            columns={[
              {
                header: "Stage",
                render: (r) => <Badge status={r.stage}>{r.stage}</Badge>,
              },
              { header: "Leads", align: "right", render: (r) => r.count },
              {
                header: "Value",
                width: "34%",
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Bar value={r.value} max={maxPipeline} />
                    </div>
                    <span className="w-16 text-right tabular-nums">
                      {compactCurrency(r.value)}
                    </span>
                  </div>
                ),
              },
              {
                header: "Weighted",
                align: "right",
                render: (r) => compactCurrency(r.weighted),
              },
            ]}
          />
        </Panel>
        <Panel
          title="Lead sources"
          description={`Leads created ${range.label.toLowerCase()} and how they converted`}
          padded={false}
        >
          <Table
            getRowKey={(r) => r.source}
            rows={sales.sources}
            columns={[
              { header: "Source", key: "source" },
              {
                header: "Leads",
                width: "30%",
                render: (r) => (
                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <Bar value={r.leads} max={maxSource} tone="clay" />
                    </div>
                    <span className="w-6 text-right tabular-nums">
                      {r.leads}
                    </span>
                  </div>
                ),
              },
              { header: "Won", align: "right", render: (r) => r.won },
              {
                header: "Conversion",
                align: "right",
                render: (r) => percent(r.conversion),
              },
              {
                header: "Won value",
                align: "right",
                render: (r) => compactCurrency(r.wonValue),
              },
            ]}
          />
        </Panel>
      </div>

      {sales.lostReasons.length > 0 && (
        <Panel title="Why leads were lost" className="mb-8">
          <ul className="flex flex-wrap gap-2">
            {sales.lostReasons.map((r) => (
              <li
                key={r.reason}
                className="rounded-full border border-[#D8D2C6] px-3 py-1 text-sm"
              >
                {r.reason}{" "}
                <span className="font-semibold tabular-nums">{r.count}</span>
              </li>
            ))}
          </ul>
        </Panel>
      )}

      {/* ── Delivery ──────────────────────────────────────────────────── */}
      <h2 className="mb-3 mt-8 text-[11px] font-bold uppercase tracking-[0.14em] text-[#A65B43]">
        Delivery
      </h2>
      <StatGrid>
        <Stat
          label="Projects on site"
          value={delivery.ongoing}
          hint={
            delivery.lateProjects
              ? `${delivery.lateProjects} past projected finish`
              : "All on programme"
          }
          tone={delivery.lateProjects ? "warn" : "olive"}
          href="/admin/projects"
        />
        <Stat
          label="Contract value on site"
          value={compactCurrency(delivery.contractOngoing)}
          hint={`${compactCurrency(delivery.collectedOngoing)} collected so far`}
          tone="olive"
        />
        <Stat
          label="Finished in period"
          value={delivery.finishedInRange}
          tone="good"
          href="/admin/finished-projects"
        />
        <Stat
          label="Open tickets"
          value={delivery.openTickets}
          hint={
            delivery.urgentTickets
              ? `${delivery.urgentTickets} high priority`
              : "None high priority"
          }
          tone={delivery.urgentTickets ? "bad" : "neutral"}
          href="/admin/tickets"
        />
      </StatGrid>

      <Panel
        title="Project profitability"
        description="Contract = client payment schedule (or budget if none). Spend = expenses & charges + item purchases logged on the project. Margin is an estimate from what has been recorded so far."
        padded={false}
      >
        <Table
          rows={delivery.projects}
          columns={[
            {
              header: "Project",
              render: (r) => (
                <div>
                  <Link
                    href={`/admin/projects/${r.id}`}
                    className="font-medium hover:underline"
                  >
                    {r.name}
                  </Link>
                  <div className="text-xs text-[#7A807B]">
                    {r.clientId ? (
                      <Link
                        href={`/admin/users/${r.clientId}`}
                        className="hover:underline"
                      >
                        {r.client}
                      </Link>
                    ) : (
                      r.client
                    )}
                  </div>
                </div>
              ),
            },
            {
              header: "Status",
              render: (r) => (
                <span className="flex flex-wrap gap-1">
                  <Badge status={r.status}>{r.status}</Badge>
                  {r.finishLate && <Badge tone="warn">Late</Badge>}
                </span>
              ),
            },
            {
              header: "Contract",
              align: "right",
              render: (r) => formatMoney(r.contract),
            },
            {
              header: "Collected",
              align: "right",
              render: (r) => (
                <span>
                  {formatMoney(r.collected)}
                  {r.overdue > 0 && (
                    <span className="block text-xs text-[#B42318]">
                      {formatMoney(r.overdue)} overdue
                    </span>
                  )}
                </span>
              ),
            },
            {
              header: "Spend",
              align: "right",
              render: (r) => (
                <span
                  title={`Expenses ${formatCurrency(r.expenses)} · purchases ${formatCurrency(r.purchases)}`}
                >
                  {formatMoney(r.spend)}
                </span>
              ),
            },
            {
              header: "Margin",
              align: "right",
              render: (r) => (
                <span
                  className={cx(
                    "font-semibold",
                    r.margin === null
                      ? "text-[#A3A8A4]"
                      : r.margin < 15
                        ? "text-[#B42318]"
                        : r.margin < 25
                          ? "text-[#8A5A00]"
                          : "text-[#2F6B3F]",
                  )}
                >
                  {r.margin === null ? "—" : `${Math.round(r.margin)}%`}
                </span>
              ),
            },
          ]}
        />
      </Panel>
      <p className="mt-3 text-xs text-[#7A807B]">
        Generated {new Date(report.generatedAt).toLocaleString("en-GB")}. Draft
        invoices are excluded; quotes are counted from when they were sent.
      </p>
    </div>
  );
}
