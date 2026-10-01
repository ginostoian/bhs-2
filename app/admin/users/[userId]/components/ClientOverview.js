import Link from "next/link";
import {
  Badge,
  LinkButton,
  Panel,
  Stat,
  StatGrid,
  formatMoney,
  formatShortDate,
} from "@/components/admin/ui";

// Server-rendered summary of everything linked to a client: money, sales
// history (leads, quotes), delivery (projects) and support (tickets).

function LinkedList({ title, items, empty, action, render }) {
  return (
    <Panel
      title={
        <span>
          {title} <span className="text-[#A3A8A4]">{items.length}</span>
        </span>
      }
      actions={action}
      padded={false}
    >
      {items.length === 0 ? (
        <p className="px-5 py-4 text-sm text-[#7A807B]">{empty}</p>
      ) : (
        <ul className="divide-y divide-[#EDE9E0]">
          {items.slice(0, 6).map((item) => (
            <li key={item.id}>{render(item)}</li>
          ))}
          {items.length > 6 && (
            <li className="px-5 py-2 text-xs text-[#7A807B]">
              + {items.length - 6} more
            </li>
          )}
        </ul>
      )}
    </Panel>
  );
}

const Row = ({ href, title, sub, right }) => (
  <Link
    href={href}
    className="flex items-center justify-between gap-3 px-5 py-2.5 hover:bg-[#FAF8F4]"
  >
    <span className="min-w-0">
      <span className="block truncate text-sm font-medium text-[#202925]">
        {title}
      </span>
      {sub && (
        <span className="block truncate text-xs text-[#7A807B]">{sub}</span>
      )}
    </span>
    <span className="flex shrink-0 items-center gap-2 text-sm tabular-nums">
      {right}
    </span>
  </Link>
);

const EmailMatch = ({ show }) =>
  show ? (
    <span
      title="Matched by email address — not explicitly linked"
      className="text-[10px] text-[#A3A8A4]"
    >
      by email
    </span>
  ) : null;

export default function ClientOverview({ userId, records }) {
  if (!records) return null;
  const { summary, leads, quotes, invoices, projects, tickets } = records;
  const newQuoteHref = `/admin/quoting/create`;

  return (
    <div className="mb-8">
      <StatGrid>
        <Stat
          label="Contract value"
          value={formatMoney(summary.contract)}
          hint={`${formatMoney(summary.paid)} paid on schedule`}
          tone="olive"
        />
        <Stat
          label="Unpaid invoices"
          value={formatMoney(summary.outstandingInvoices)}
          hint={
            summary.overdueInvoices
              ? `${formatMoney(summary.overdueInvoices)} overdue`
              : "Nothing overdue"
          }
          tone={summary.overdueInvoices ? "bad" : "neutral"}
        />
        <Stat
          label="Quotes"
          value={quotes.length}
          hint={`${quotes.filter((q) => q.status === "won").length} won`}
          tone="info"
        />
        <Stat
          label="Open tickets"
          value={summary.openTickets}
          tone={summary.openTickets ? "warn" : "neutral"}
        />
      </StatGrid>

      <div className="grid gap-4 lg:grid-cols-2 2xl:grid-cols-3">
        <LinkedList
          title="Projects"
          items={projects}
          empty="No projects yet."
          render={(p) => (
            <Row
              href={`/admin/projects/${p.id}`}
              title={p.name}
              sub={`${formatShortDate(p.startDate)} → ${formatShortDate(p.finishDate)}`}
              right={<Badge status={p.status}>{p.status}</Badge>}
            />
          )}
        />
        <LinkedList
          title="Quotes"
          items={quotes}
          empty="No quotes for this client."
          action={
            <LinkButton href={newQuoteHref} size="sm">
              New quote
            </LinkButton>
          }
          render={(q) => (
            <Row
              href={`/admin/quoting/${q.id}/edit`}
              title={q.title || `Quote #${q.number}`}
              sub={`#${q.number} · ${formatShortDate(q.date)}`}
              right={
                <>
                  <EmailMatch show={q.matchedByEmail} />
                  {formatMoney(q.gross)}
                  <Badge status={q.status} className="capitalize">
                    {q.status}
                  </Badge>
                </>
              }
            />
          )}
        />
        <LinkedList
          title="Invoices"
          items={invoices}
          empty="No invoices for this client."
          action={
            <LinkButton href="/admin/invoicing/create" size="sm">
              New invoice
            </LinkButton>
          }
          render={(i) => (
            <Row
              href={`/admin/invoicing/${i.id}/preview`}
              title={i.title || i.number}
              sub={`${i.number}${i.dueDate ? ` · due ${formatShortDate(i.dueDate)}` : ""}`}
              right={
                <>
                  <EmailMatch show={i.matchedByEmail} />
                  {formatMoney(i.total)}
                  <Badge status={i.status} className="capitalize">
                    {i.status}
                  </Badge>
                </>
              }
            />
          )}
        />
        <LinkedList
          title="CRM leads"
          items={leads}
          empty="Not linked to a CRM lead."
          render={(l) => (
            <Row
              href={`/admin/crm?lead=${l.id}`}
              title={l.name}
              sub={`${l.source || "Unknown source"} · ${formatShortDate(l.createdAt)}`}
              right={
                <>
                  <EmailMatch show={l.matchedByEmail} />
                  {l.value ? formatMoney(l.value) : null}
                  <Badge status={l.stage}>{l.stage}</Badge>
                </>
              }
            />
          )}
        />
        <LinkedList
          title="Tickets"
          items={tickets}
          empty="No support tickets."
          render={(t) => (
            <Row
              href={`/admin/tickets/${t.id}`}
              title={t.title}
              sub={`${t.number} · ${formatShortDate(t.createdAt)}`}
              right={
                <>
                  <Badge status={t.priority}>{t.priority}</Badge>
                  <Badge status={t.status}>{t.status}</Badge>
                </>
              }
            />
          )}
        />
      </div>
    </div>
  );
}
