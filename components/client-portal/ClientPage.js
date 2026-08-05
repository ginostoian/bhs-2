import Link from "next/link";
import { ArrowRight, Inbox } from "lucide-react";

export function ClientPageHeader({ title, description, action, meta }) {
  return (
    <div className="mb-8 flex flex-col gap-5 border-b border-[#dedbd2] pb-7 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0">
        <h1 className="text-[30px] font-semibold leading-[1.08] tracking-[-0.035em] text-[#17231f] sm:text-[36px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2.5 max-w-2xl text-sm leading-6 text-[#66716d] sm:text-[15px]">
            {description}
          </p>
        ) : null}
      </div>
      {action || meta ? (
        <div className="flex shrink-0 items-center gap-3">
          {meta ? (
            <div className="border-l-2 border-[#1559d6] pl-3">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-[#7c8682]">
                {meta.label}
              </p>
              <p className="mt-1 text-lg font-semibold text-[#17231f]">
                {meta.value}
              </p>
            </div>
          ) : null}
          {action}
        </div>
      ) : null}
    </div>
  );
}

export function ClientPrimaryLink({ href, children, className = "" }) {
  return (
    <Link
      href={href}
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-md bg-[#1559d6] px-4 text-xs font-semibold text-white transition-colors hover:bg-[#104dbd] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1559d6] focus-visible:ring-offset-2 ${className}`}
    >
      {children}
      <ArrowRight aria-hidden="true" className="h-4 w-4" />
    </Link>
  );
}

export function ClientEmptyState({
  title,
  description,
  action,
  icon: Icon = Inbox,
}) {
  return (
    <div className="border border-[#dedbd2] bg-[#fbfaf7] px-6 py-14 text-center sm:px-10">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#efede6] text-[#52605b]">
        <Icon aria-hidden="true" className="h-5 w-5" strokeWidth={1.6} />
      </div>
      <h2 className="mt-5 text-lg font-semibold text-[#17231f]">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#66716d]">
        {description}
      </p>
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}

export function ClientSectionHeading({
  title,
  actionHref,
  actionLabel = "View all",
}) {
  return (
    <div className="mb-4 flex items-center justify-between gap-4">
      <h2 className="text-base font-semibold tracking-[-0.01em] text-[#17231f]">
        {title}
      </h2>
      {actionHref ? (
        <Link
          href={actionHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1559d6] hover:text-[#104dbd]"
        >
          {actionLabel}
          <ArrowRight aria-hidden="true" className="h-3.5 w-3.5" />
        </Link>
      ) : null}
    </div>
  );
}
