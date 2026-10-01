import Link from "next/link";
import {
  formatCurrency as fmtCurrency,
  formatDate as fmtDate,
} from "@/libs/documentFormat";

// ─────────────────────────────────────────────────────────────────────────────
// Admin design system — presentational pieces (safe in server components).
// Interactive pieces (sortable table, filters, tabs) live in ./interactive.js.
// Palette: ink #202925 · olive #4D5B4B · clay #A65B43 · chalk #F4F1EA · stone #D8D2C6
// ─────────────────────────────────────────────────────────────────────────────

export const cx = (...classes) => classes.filter(Boolean).join(" ");

export const formatCurrency = fmtCurrency;
export const formatDate = fmtDate;

export const formatShortDate = (date) => {
  if (!date) return "—";
  const d = new Date(date);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: d.getFullYear() === new Date().getFullYear() ? undefined : "numeric",
  });
};

/** "3d ago", "in 5d", "today" */
export const relativeDays = (date) => {
  if (!date) return "—";
  const days = Math.round(
    (new Date(date).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) /
      86400000,
  );
  if (days === 0) return "today";
  if (days === -1) return "yesterday";
  if (days === 1) return "tomorrow";
  return days < 0 ? `${-days}d ago` : `in ${days}d`;
};

/** Whole pounds for summaries: £388,600 */
export const formatMoney = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 0,
  }).format(Math.round(Number(amount) || 0));

export const compactCurrency = (amount) => {
  const n = Number(amount) || 0;
  if (Math.abs(n) >= 1_000_000) return `£${(n / 1_000_000).toFixed(1)}m`;
  if (Math.abs(n) >= 10_000) return `£${Math.round(n / 1000)}k`;
  return formatMoney(n);
};

// ── Layout ──────────────────────────────────────────────────────────────────

/** Page title row: title, optional description/eyebrow, actions on the right. */
export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
  meta,
  back,
}) {
  return (
    <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        {back && (
          <Link
            href={back.href}
            className="mb-2 inline-flex items-center gap-1 text-xs font-medium text-[#7A807B] hover:text-[#202925]"
          >
            ← {back.label}
          </Link>
        )}
        {eyebrow && (
          <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-[#A65B43]">
            {eyebrow}
          </p>
        )}
        <h1 className="text-[26px] font-semibold leading-tight tracking-[-0.02em] text-[#202925]">
          {title}
        </h1>
        {description && (
          <p className="mt-1 max-w-2xl text-sm text-[#4A524D]">{description}</p>
        )}
        {meta && (
          <div className="mt-2 flex flex-wrap items-center gap-2">{meta}</div>
        )}
      </div>
      {actions && (
        <div className="flex flex-wrap items-center gap-2 sm:justify-end">
          {actions}
        </div>
      )}
    </header>
  );
}

/** White card with optional header row. */
export function Panel({
  title,
  description,
  actions,
  children,
  footer,
  className,
  bodyClassName,
  padded = true,
  id,
}) {
  return (
    <section
      id={id}
      className={cx("rounded-lg border border-[#D8D2C6] bg-white", className)}
    >
      {(title || actions) && (
        <header className="flex flex-wrap items-start justify-between gap-3 border-b border-[#EDE9E0] px-5 py-3.5">
          <div className="min-w-0">
            {title && (
              <h2 className="text-[15px] font-semibold text-[#202925]">
                {title}
              </h2>
            )}
            {description && (
              <p className="mt-0.5 text-xs text-[#7A807B]">{description}</p>
            )}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </header>
      )}
      <div className={cx(padded && "p-5", bodyClassName)}>{children}</div>
      {footer && (
        <footer className="border-t border-[#EDE9E0] px-5 py-3 text-sm">
          {footer}
        </footer>
      )}
    </section>
  );
}

// ── Stats ───────────────────────────────────────────────────────────────────

const TONE_ACCENT = {
  neutral: "bg-[#D8D2C6]",
  olive: "bg-[#4D5B4B]",
  good: "bg-[#2F6B3F]",
  warn: "bg-[#C68A1B]",
  bad: "bg-[#B42318]",
  info: "bg-[#2B4C7E]",
  clay: "bg-[#A65B43]",
};

/** A KPI tile. `href` makes it a link to the list it summarises. */
export function Stat({ label, value, hint, tone = "neutral", href }) {
  const body = (
    <>
      <span
        className={cx(
          "absolute inset-y-3 left-0 w-[3px] rounded-r",
          TONE_ACCENT[tone],
        )}
      />
      <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A807B]">
        {label}
      </p>
      <p className="mt-1.5 text-[22px] font-semibold tabular-nums leading-none tracking-[-0.01em] text-[#202925]">
        {value}
      </p>
      {hint && <p className="mt-1.5 text-xs text-[#7A807B]">{hint}</p>}
    </>
  );
  const className =
    "relative block rounded-lg border border-[#D8D2C6] bg-white px-4 py-3.5";
  return href ? (
    <Link
      href={href}
      className={cx(className, "transition-colors hover:border-[#4D5B4B]")}
    >
      {body}
    </Link>
  ) : (
    <div className={className}>{body}</div>
  );
}

export function StatGrid({ children, columns = 4, className }) {
  const cols = {
    2: "sm:grid-cols-2",
    3: "sm:grid-cols-3",
    4: "sm:grid-cols-2 lg:grid-cols-4",
    5: "sm:grid-cols-3 lg:grid-cols-5",
    6: "sm:grid-cols-3 lg:grid-cols-6",
  }[columns];
  return (
    <div className={cx("mb-6 grid grid-cols-2 gap-3", cols, className)}>
      {children}
    </div>
  );
}

// ── Badges ──────────────────────────────────────────────────────────────────

const BADGE_TONES = {
  neutral: "bg-[#EDE9E0] text-[#4A524D]",
  olive: "bg-[#E4E9E2] text-[#3E4A3C]",
  good: "bg-[#EEF5EF] text-[#2F6B3F]",
  warn: "bg-[#FFF4DB] text-[#8A5A00]",
  bad: "bg-[#FDF0EE] text-[#B42318]",
  info: "bg-[#E7EEF7] text-[#2B4C7E]",
  clay: "bg-[#F6E9E3] text-[#8E4A35]",
};

// One mapping for every status/stage/priority used across the models
const STATUS_TONES = {
  // quotes
  draft: "neutral",
  sent: "info",
  pending: "warn",
  won: "good",
  lost: "bad",
  expired: "neutral",
  // invoices / payments
  paid: "good",
  overdue: "bad",
  due: "warn",
  scheduled: "info",
  // projects
  "on going": "olive",
  ongoing: "olive",
  finished: "good",
  // tasks
  done: "good",
  "in progress": "info",
  blocked: "bad",
  todo: "neutral",
  // tickets
  new: "info",
  "waiting for customer": "warn",
  resolved: "good",
  closed: "neutral",
  // priorities
  low: "neutral",
  medium: "warn",
  high: "bad",
  urgent: "bad",
  critical: "bad",
  // CRM
  "new enquiry": "info",
  "in conversation": "olive",
  "qualified — awaiting quote": "warn",
  "proposal sent": "info",
  "negotiation — awaiting us": "warn",
  // changes
  review: "warn",
  accepted: "good",
  declined: "bad",
  // generic
  active: "good",
  inactive: "neutral",
  yes: "good",
  no: "neutral",
};

export const statusTone = (status) =>
  STATUS_TONES[
    String(status || "")
      .trim()
      .toLowerCase()
  ] || "neutral";

export function Badge({ children, tone, status, className }) {
  const resolved = tone || statusTone(status ?? children);
  return (
    <span
      className={cx(
        "inline-flex items-center whitespace-nowrap rounded-full px-2 py-0.5 text-[11px] font-semibold",
        BADGE_TONES[resolved] || BADGE_TONES.neutral,
        className,
      )}
    >
      {children}
    </span>
  );
}

// ── Buttons (links and buttons share styles) ────────────────────────────────

const BUTTON_VARIANTS = {
  primary: "bg-[#4D5B4B] text-white hover:bg-[#3E4A3C] border border-[#4D5B4B]",
  secondary:
    "border border-[#D8D2C6] bg-white text-[#202925] hover:bg-[#F4F1EA]",
  ghost: "text-[#4A524D] hover:bg-[#EDE9E0]",
  danger: "border border-[#F1C9C2] bg-white text-[#B42318] hover:bg-[#FDF0EE]",
};

export const buttonClass = (variant = "secondary", size = "md") =>
  cx(
    "inline-flex items-center justify-center gap-1.5 whitespace-nowrap rounded-md font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
    size === "sm" ? "h-8 px-2.5 text-xs" : "h-9 px-3.5 text-sm",
    BUTTON_VARIANTS[variant],
  );

export function LinkButton({
  href,
  variant = "secondary",
  size,
  children,
  ...props
}) {
  return (
    <Link href={href} className={buttonClass(variant, size)} {...props}>
      {children}
    </Link>
  );
}

// ── Empty state ─────────────────────────────────────────────────────────────

export function EmptyState({
  title,
  description,
  action,
  icon: Icon,
  compact,
}) {
  return (
    <div className={cx("text-center", compact ? "px-4 py-8" : "px-6 py-14")}>
      {Icon && (
        <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#F4F1EA] text-[#7A807B]">
          <Icon className="h-5 w-5" />
        </div>
      )}
      <p className="text-sm font-semibold text-[#202925]">{title}</p>
      {description && (
        <p className="mx-auto mt-1 max-w-sm text-sm text-[#7A807B]">
          {description}
        </p>
      )}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// ── Key/value list ──────────────────────────────────────────────────────────

export function DescriptionList({ items, columns = 1 }) {
  return (
    <dl
      className={cx(
        "grid gap-x-6 gap-y-3",
        columns === 2 && "sm:grid-cols-2",
        columns === 3 && "sm:grid-cols-3",
      )}
    >
      {items
        .filter((item) => item && item.value !== undefined)
        .map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-[11px] font-semibold uppercase tracking-[0.08em] text-[#7A807B]">
              {item.label}
            </dt>
            <dd className="mt-0.5 break-words text-sm text-[#202925]">
              {item.value === null || item.value === "" ? "—" : item.value}
            </dd>
          </div>
        ))}
    </dl>
  );
}

// ── Cross-record links ──────────────────────────────────────────────────────

/** Where each kind of record lives in the admin. */
export const recordHref = (type, id) => {
  if (!id) return null;
  const s = String(id);
  switch (type) {
    case "client":
    case "user":
      return `/admin/users/${s}`;
    case "lead":
      return `/admin/crm?lead=${s}`;
    case "project":
      return `/admin/projects/${s}`;
    case "quote":
      return `/admin/quoting/${s}/edit`;
    case "invoice":
      return `/admin/invoicing/${s}/preview`;
    case "ticket":
      return `/admin/tickets/${s}`;
    case "employee":
      return `/admin/employees/${s}`;
    case "moodboard":
      return `/admin/moodboards/${s}`;
    default:
      return null;
  }
};

const RECORD_LABEL = {
  client: "Client",
  user: "Client",
  lead: "Lead",
  project: "Project",
  quote: "Quote",
  invoice: "Invoice",
  ticket: "Ticket",
  employee: "Team",
  moodboard: "Moodboard",
};

/** Small chip linking to another record, e.g. on a quote: Client · Lead · Project. */
export function RecordLink({ type, id, label, showType = true }) {
  const href = recordHref(type, id);
  const body = (
    <>
      {showType && (
        <span className="text-[10px] font-bold uppercase tracking-wide text-[#7A807B]">
          {RECORD_LABEL[type] || type}
        </span>
      )}
      <span className="truncate">{label || "Open"}</span>
    </>
  );
  const className =
    "inline-flex max-w-full items-center gap-1.5 rounded-md border border-[#D8D2C6] bg-white px-2 py-1 text-xs font-medium text-[#202925]";
  return href ? (
    <Link
      href={href}
      className={cx(className, "hover:border-[#4D5B4B] hover:bg-[#F4F1EA]")}
    >
      {body}
    </Link>
  ) : (
    <span className={className}>{body}</span>
  );
}

/** Simple horizontal bar for reports (value relative to max). */
export function Bar({ value, max, tone = "olive" }) {
  const pct = max > 0 ? Math.max(2, Math.min(100, (value / max) * 100)) : 0;
  return (
    <div className="h-2 w-full overflow-hidden rounded-full bg-[#EDE9E0]">
      <div
        className={cx("h-full rounded-full", TONE_ACCENT[tone])}
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}

/**
 * Server-safe table (no sorting). For interactive lists use DataTable from
 * ./interactive. columns: [{ key?, header, render?(row), align?, width? }]
 */
export function Table({
  columns,
  rows,
  getRowKey = (row) => row._id || row.id,
  empty,
}) {
  if (!rows.length)
    return empty || <EmptyState title="Nothing to show" compact />;
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-[#D8D2C6] bg-[#FAF8F4]">
            {columns.map((column) => (
              <th
                key={column.key || column.header}
                scope="col"
                style={{ width: column.width }}
                className={cx(
                  "whitespace-nowrap px-4 py-2.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#7A807B]",
                  column.align === "right" ? "text-right" : "text-left",
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr
              key={getRowKey(row) ?? index}
              className="border-b border-[#EDE9E0] last:border-b-0"
            >
              {columns.map((column) => (
                <td
                  key={column.key || column.header}
                  className={cx(
                    "px-4 py-2.5 align-middle text-[#202925]",
                    column.align === "right" && "text-right tabular-nums",
                  )}
                >
                  {column.render
                    ? column.render(row)
                    : (row[column.key] ?? "—")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const percent = (ratio, digits = 0) =>
  ratio === null || ratio === undefined
    ? "—"
    : `${(ratio * 100).toFixed(digits)}%`;
