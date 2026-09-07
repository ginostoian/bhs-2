import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  CircleHelp,
  CreditCard,
  FileText,
  FolderOpen,
  MessageSquareText,
} from "lucide-react";
import {
  ClientPrimaryLink,
  ClientSectionHeading,
} from "@/components/client-portal/ClientPage";

export function formatClientDate(value) {
  if (!value) return "Date not set";
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export function formatClientCurrency(value) {
  return new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

function EmptyRow({ message }) {
  return (
    <div className="flex min-h-24 items-center justify-center border border-dashed border-[#d8d4ca] bg-white/45 px-5 text-center text-xs leading-5 text-[#7c8682]">
      {message}
    </div>
  );
}

function ListRow({ icon: Icon, title, detail, href, trailing }) {
  return (
    <Link
      href={href}
      className="group flex min-h-[68px] items-center gap-3 border-b border-[#e5e2da] px-1 py-3 text-[#202925] last:border-b-0 hover:text-[#202925]"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center bg-[#f0eee8] text-[#43504b]">
        <Icon
          aria-hidden="true"
          className="h-[17px] w-[17px]"
          strokeWidth={1.6}
        />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-xs font-semibold text-[#202925]">
          {title}
        </span>
        <span className="mt-1 block truncate text-[11px] text-[#7c8682]">
          {detail}
        </span>
      </span>
      {trailing ? (
        <span className="shrink-0 text-right text-xs font-semibold text-[#202925]">
          {trailing}
        </span>
      ) : null}
      <ArrowRight
        aria-hidden="true"
        className="h-4 w-4 shrink-0 text-[#9aa19e] transition-transform group-hover:translate-x-0.5 group-hover:text-[#4D5B4B]"
      />
    </Link>
  );
}

export default function ClientOverview({
  firstName,
  project,
  recentDocuments,
  upcomingPayment,
  openRequest,
}) {
  const progress = Math.max(0, Math.min(100, project?.progress || 0));

  return (
    <div>
      <div className="mb-7 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[34px] font-semibold leading-[1.05] tracking-[-0.04em] text-[#202925] sm:text-[44px]">
            {getGreeting()}, {firstName}
          </h1>
          <p className="mt-3 text-sm leading-6 text-[#4D5B4B] sm:text-base">
            Here&apos;s what&apos;s happening with your project.
          </p>
        </div>
        <ClientPrimaryLink href="/dashboard/project">
          View project details
        </ClientPrimaryLink>
      </div>

      <section className="border border-[#D8D2C6] bg-[#F4F1EA] px-5 py-6 sm:px-7 sm:py-7">
        <div className="grid gap-7 lg:grid-cols-[minmax(0,0.9fr)_minmax(360px,1.1fr)] lg:items-end">
          <div>
            <p className="text-sm font-semibold text-[#202925]">
              Project progress
            </p>
            <h2 className="mt-6 text-2xl font-medium tracking-[-0.025em] text-[#202925]">
              {project?.name || "Your renovation project"}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs">
              <span className="inline-flex items-center gap-2 font-medium text-[#267448]">
                <span className="h-2 w-2 rounded-full bg-[#2d955c]" />
                {project?.status || "Not started"}
              </span>
              {project?.projectedFinishDate ? (
                <span className="inline-flex items-center gap-1.5 text-[#4D5B4B]">
                  <CalendarDays aria-hidden="true" className="h-3.5 w-3.5" />
                  Target {formatClientDate(project.projectedFinishDate)}
                </span>
              ) : null}
            </div>
          </div>
          <div>
            <div className="mb-3 flex items-end justify-between gap-4">
              <span className="text-xs font-medium text-[#4D5B4B]">
                Overall completion
              </span>
              <span className="text-3xl font-medium tracking-[-0.035em] text-[#202925]">
                {progress}%
              </span>
            </div>
            <div
              className="h-1.5 overflow-hidden rounded-full bg-[#e5e2da]"
              role="progressbar"
              aria-label="Project progress"
              aria-valuemin="0"
              aria-valuemax="100"
              aria-valuenow={progress}
            >
              <div
                className="h-full rounded-full bg-[#4D5B4B]"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </section>

      <div className="mt-9 grid gap-8 xl:grid-cols-[1.1fr_0.9fr_0.9fr] xl:divide-x xl:divide-[#D8D2C6]">
        <section className="min-w-0 xl:pr-8">
          <ClientSectionHeading
            title="Recent documents"
            actionHref="/dashboard/quotes"
          />
          {recentDocuments.length ? (
            <div className="border-y border-[#D8D2C6]">
              {recentDocuments.map((document) => (
                <ListRow
                  key={`${document.href}-${document.id}`}
                  icon={FileText}
                  title={document.title}
                  detail={document.detail}
                  href={document.href}
                />
              ))}
            </div>
          ) : (
            <EmptyRow message="Documents shared with you will appear here." />
          )}
        </section>

        <section className="min-w-0 xl:px-8">
          <ClientSectionHeading
            title="Upcoming payments"
            actionHref="/dashboard/payments"
          />
          {upcomingPayment ? (
            <div className="border-y border-[#D8D2C6]">
              <ListRow
                icon={CreditCard}
                title={upcomingPayment.name}
                detail={`Due ${formatClientDate(upcomingPayment.dueDate)}`}
                trailing={formatClientCurrency(upcomingPayment.amount)}
                href="/dashboard/payments"
              />
            </div>
          ) : (
            <EmptyRow message="You have no upcoming payments." />
          )}
        </section>

        <section className="min-w-0 xl:pl-8">
          <ClientSectionHeading
            title="Open requests"
            actionHref={
              openRequest?.type === "change"
                ? "/dashboard/changes"
                : "/dashboard/tickets"
            }
          />
          {openRequest ? (
            <div className="border-y border-[#D8D2C6]">
              <ListRow
                icon={MessageSquareText}
                title={openRequest.title}
                detail={openRequest.detail}
                href={openRequest.href}
              />
            </div>
          ) : (
            <EmptyRow message="You have no open changes or support requests." />
          )}
        </section>
      </div>

      <section className="relative mt-9 overflow-hidden border border-[#D8D2C6] bg-[#f4f1e9] px-5 py-6 sm:px-7">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#d8d4ca] bg-[#F4F1EA] text-[#202925]">
              <CircleHelp
                aria-hidden="true"
                className="h-5 w-5"
                strokeWidth={1.6}
              />
            </span>
            <div>
              <h2 className="text-base font-semibold text-[#202925]">
                Need help?
              </h2>
              <p className="mt-1 text-xs leading-5 text-[#4D5B4B]">
                Our team is here to help with any questions about your project.
              </p>
            </div>
          </div>
          <Link
            href="/dashboard/tickets/new"
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-md border border-[#4D5B4B] bg-transparent px-4 text-xs font-semibold text-[#4D5B4B] transition-colors hover:bg-[#4D5B4B] hover:text-white"
          >
            Contact support
            <ArrowRight aria-hidden="true" className="h-4 w-4" />
          </Link>
        </div>
        <FolderOpen
          aria-hidden="true"
          className="absolute -bottom-10 right-20 h-36 w-36 rotate-[-8deg] text-[#dcd7cc]/45"
          strokeWidth={0.55}
        />
      </section>
    </div>
  );
}
