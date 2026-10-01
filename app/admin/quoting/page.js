import Link from "next/link";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";
import {
  Badge,
  LinkButton,
  PageHeader,
  Panel,
  Stat,
  StatGrid,
  Table,
  compactCurrency,
  formatMoney,
  formatShortDate,
  percent,
  relativeDays,
} from "@/components/admin/ui";

export const dynamic = "force-dynamic";

const gross = (q) => (q.total || 0) * (1 + (q.pricing?.vatRate ?? 20) / 100);

/**
 * Quoting overview: pipeline numbers across ALL quotes (the previous version
 * computed them from the five most recent quotes only), quotes needing a
 * follow-up, and recent activity.
 */
export default async function QuotingPage() {
  await connectMongo();
  const now = new Date();
  const quotes = await Quote.find({})
    .select(
      "quoteNumber title status total pricing.vatRate client.name sentAt createdAt updatedAt viewCount lastViewed",
    )
    .sort({ updatedAt: -1 })
    .lean();

  const by = (status) => quotes.filter((q) => q.status === status);
  const awaiting = quotes.filter((q) => ["sent", "pending"].includes(q.status));
  const won = by("won");
  const decided = won.length + by("lost").length + by("expired").length;
  const sum = (rows) => rows.reduce((s, q) => s + gross(q), 0);
  const chase = awaiting
    .filter((q) => q.sentAt && now - new Date(q.sentAt) > 5 * 86400000)
    .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
  const toRow = (q) => ({ ...q, _id: String(q._id), value: gross(q) });

  return (
    <div className="pb-12">
      <PageHeader
        eyebrow="Pricing & quotes"
        title="Quoting"
        description="Pipeline across every quote, what to chase, and the latest activity."
        actions={
          <>
            <LinkButton href="/admin/quoting/history">All quotes</LinkButton>
            <LinkButton href="/admin/quoting/create" variant="primary">
              New quote
            </LinkButton>
          </>
        }
      />

      <StatGrid columns={5}>
        <Stat
          label="Awaiting reply"
          value={awaiting.length}
          hint={compactCurrency(sum(awaiting))}
          tone="info"
          href="/admin/quoting/history"
        />
        <Stat
          label="Won"
          value={won.length}
          hint={compactCurrency(sum(won))}
          tone="good"
        />
        <Stat
          label="Win rate"
          value={percent(decided ? won.length / decided : null)}
          hint={`${decided} decided (won, lost or expired)`}
          tone="olive"
        />
        <Stat
          label="Drafts"
          value={by("draft").length}
          hint="Not sent yet"
          tone="neutral"
        />
        <Stat
          label="All quotes"
          value={quotes.length}
          hint={compactCurrency(sum(quotes))}
          tone="neutral"
        />
      </StatGrid>

      <div className="mb-4 grid gap-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <Panel
          title="To chase"
          description="Sent more than 5 days ago without a decision"
          padded={false}
        >
          <Table
            rows={chase.slice(0, 8).map(toRow)}
            empty={
              <p className="px-5 py-6 text-sm text-[#7A807B]">
                Nothing to chase — every sent quote is recent or decided.
              </p>
            }
            columns={[
              {
                header: "Quote",
                render: (q) => (
                  <Link
                    href={`/admin/quoting/${q._id}/edit`}
                    className="font-medium hover:underline"
                  >
                    {q.title || `#${q.quoteNumber}`}
                    <span className="block text-xs font-normal text-[#7A807B]">
                      #{q.quoteNumber} · {q.client?.name}
                    </span>
                  </Link>
                ),
              },
              { header: "Sent", render: (q) => relativeDays(q.sentAt) },
              {
                header: "Views",
                render: (q) =>
                  q.viewCount ? (
                    `${q.viewCount} view${q.viewCount === 1 ? "" : "s"}${q.lastViewed ? ` · last ${relativeDays(q.lastViewed)}` : ""}`
                  ) : (
                    <Badge tone="warn">Not opened</Badge>
                  ),
              },
              {
                header: "Value",
                align: "right",
                render: (q) => formatMoney(q.value),
              },
            ]}
          />
        </Panel>
        <Panel
          title="Pricing library"
          description="What the quote builder draws on"
        >
          <ul className="space-y-1 text-sm">
            {[
              [
                "/admin/quoting/templates",
                "Quote templates",
                "Whole quotes to start from",
              ],
              [
                "/admin/quoting/template-services",
                "Template services",
                "Reusable priced line items",
              ],
              [
                "/admin/quoting/rates",
                "Rate cards",
                "Labour and material rates",
              ],
              [
                "/admin/renovation-calculator-rates",
                "Renovation calculator rates",
                "Public calculator pricing",
              ],
              [
                "/admin/extension-calculator-rates",
                "Extension calculator rates",
                "Public calculator pricing",
              ],
            ].map(([href, title, sub]) => (
              <li key={href}>
                <Link
                  href={href}
                  className="flex items-center justify-between rounded-md px-2 py-2 hover:bg-[#F4F1EA]"
                >
                  <span>
                    <span className="block font-medium">{title}</span>
                    <span className="block text-xs text-[#7A807B]">{sub}</span>
                  </span>
                  <span aria-hidden className="text-[#A3A8A4]">
                    →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel
        title="Recently updated"
        actions={
          <LinkButton href="/admin/quoting/history" size="sm" variant="ghost">
            All quotes →
          </LinkButton>
        }
        padded={false}
      >
        <Table
          rows={quotes.slice(0, 10).map(toRow)}
          columns={[
            {
              header: "Quote",
              render: (q) => (
                <Link
                  href={`/admin/quoting/${q._id}/edit`}
                  className="font-medium hover:underline"
                >
                  {q.title || `#${q.quoteNumber}`}
                  <span className="block text-xs font-normal text-[#7A807B]">
                    #{q.quoteNumber}
                  </span>
                </Link>
              ),
            },
            { header: "Client", render: (q) => q.client?.name || "—" },
            {
              header: "Status",
              render: (q) => (
                <Badge status={q.status} className="capitalize">
                  {q.status}
                </Badge>
              ),
            },
            { header: "Updated", render: (q) => formatShortDate(q.updatedAt) },
            {
              header: "Value",
              align: "right",
              render: (q) => formatMoney(q.value),
            },
          ]}
        />
      </Panel>
    </div>
  );
}
