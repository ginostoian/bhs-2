"use client";

import { Copy, Download } from "lucide-react";
import { company } from "@/libs/documentFormat";

// Web counterparts of libs/pdf/components.js. Colours match the PDF palette.

export const BrandMark = ({ className = "h-8 w-8" }) => (
  <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden>
    <path
      d="M3 21v-8.5a9 9 0 0 1 18 0V21"
      stroke="#4D5B4B"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
    <path d="M8 21v-8a4 4 0 0 1 8 0v8z" fill="#C48A6A" />
    <path
      d="M2 21h20"
      stroke="#4D5B4B"
      strokeWidth="1.6"
      strokeLinecap="round"
    />
  </svg>
);

/** Grey backdrop with the document rendered as a sheet of paper. */
export const DocumentShell = ({ toolbar, footerText, children }) => (
  <div className="bg-[#EDE9E0] pb-10 pt-4 text-[#202925] sm:pb-16 sm:pt-8">
    <div className="mx-auto max-w-[860px] px-3 sm:px-6">
      {toolbar}
      <article className="rounded-md bg-white px-5 py-7 ring-1 ring-black/5 sm:px-12 sm:py-12">
        {children}
        <div className="mt-10 flex flex-col gap-1 border-t border-[#D8D2C6] pt-3 text-[11px] text-[#7A807B] sm:flex-row sm:justify-between">
          <span>{footerText}</span>
          <span>{company.website}</span>
        </div>
      </article>
    </div>
  </div>
);

export const DocumentToolbar = ({
  title,
  onCopy,
  copied,
  onDownload,
  downloading,
  children,
}) => (
  <div className="mb-4 flex items-center justify-between gap-3">
    <div className="flex min-w-0 items-center gap-2">
      <p className="truncate text-sm font-medium text-[#4A524D]">{title}</p>
      {children}
    </div>
    <div className="flex shrink-0 items-center gap-2">
      <button
        type="button"
        onClick={onCopy}
        className="inline-flex h-9 items-center gap-2 rounded-md border border-[#D8D2C6] bg-white px-3 text-sm font-medium text-[#202925] hover:bg-[#F4F1EA]"
        aria-label="Copy link"
      >
        <Copy className="h-4 w-4" />
        <span className="hidden sm:inline">
          {copied ? "Copied!" : "Copy link"}
        </span>
      </button>
      <button
        type="button"
        onClick={onDownload}
        disabled={downloading}
        className="inline-flex h-9 items-center gap-2 rounded-md bg-[#4D5B4B] px-3 text-sm font-medium text-white hover:bg-[#3E4A3C] disabled:cursor-not-allowed disabled:opacity-60"
      >
        <Download className="h-4 w-4" />
        {downloading ? "Preparing…" : "PDF"}
      </button>
    </div>
  </div>
);

/** Brand + document type, then the chalk meta strip. */
export const DocumentHeader = ({ label, reference, meta = [], badge }) => (
  <header className="mb-7">
    <div className="flex items-start justify-between gap-4 border-b-2 border-[#4D5B4B] pb-5">
      <div className="flex min-w-0 items-center gap-2.5">
        <BrandMark className="h-9 w-9 shrink-0 sm:h-11 sm:w-11" />
        <div className="min-w-0">
          <p className="text-lg font-bold leading-tight tracking-tight sm:text-[22px]">
            {company.name}
          </p>
          <p className="mt-0.5 hidden text-[11px] text-[#7A807B] sm:block">
            {company.tagline}
          </p>
        </div>
      </div>
      <div className="flex shrink-0 flex-col items-end">
        <p className="text-xl font-bold tracking-[0.18em] text-[#4D5B4B] sm:text-[28px]">
          {label}
        </p>
        {reference && (
          <p className="text-xs font-medium text-[#4A524D] sm:text-sm">
            {reference}
          </p>
        )}
        {badge && <div className="mt-1.5">{badge}</div>}
      </div>
    </div>
    {meta.length > 0 && (
      <dl className="mt-4 grid grid-cols-2 gap-x-4 gap-y-3 rounded bg-[#F4F1EA] px-4 py-3 sm:grid-cols-4">
        {meta.map((item) => (
          <div key={item.label} className="min-w-0">
            <dt className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A807B]">
              {item.label}
            </dt>
            <dd
              className={`mt-0.5 text-sm font-medium ${
                item.danger ? "text-[#B42318]" : ""
              }`}
            >
              {item.value}
            </dd>
          </div>
        ))}
      </dl>
    )}
  </header>
);

export const Eyebrow = ({ children, className = "text-[#A65B43]" }) => (
  <p
    className={`text-[10px] font-bold uppercase tracking-[0.14em] ${className}`}
  >
    {children}
  </p>
);

export const SectionTitle = ({ eyebrow, title, className = "" }) => (
  <div className={`mb-3.5 mt-9 ${className}`}>
    {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
    <h2 className="mt-0.5 text-lg !font-bold !tracking-normal">{title}</h2>
  </div>
);

export const InfoCard = ({ title, rows }) => {
  const visible = rows.filter((row) => row.value);
  return (
    <div className="rounded border border-[#E6E1D7] p-4">
      <Eyebrow className="mb-2 text-[#4D5B4B]">{title}</Eyebrow>
      {visible.length === 0 ? (
        <p className="text-sm text-[#7A807B]">—</p>
      ) : (
        <dl className="space-y-1.5">
          {visible.map((row) => (
            <div key={row.label} className="flex gap-3 text-sm">
              <dt className="w-20 shrink-0 text-[#7A807B]">{row.label}</dt>
              <dd className="min-w-0 break-words">{row.value}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
};

export const Paragraphs = ({ text, className = "text-[15px]" }) => (
  <div className="space-y-2">
    {String(text || "")
      .split(/\n{2,}/)
      .map((para) => para.trim())
      .filter(Boolean)
      .map((para, i) => (
        <p
          key={i}
          className={`whitespace-pre-line leading-relaxed text-[#4A524D] ${className}`}
        >
          {para}
        </p>
      ))}
  </div>
);

export const TotalsBox = ({ rows, grandLabel, grandValue, children }) => (
  <div className="mt-6 flex justify-end">
    <div className="w-full sm:w-80">
      {rows.map((row) => (
        <div
          key={row.label}
          className="flex justify-between border-b border-[#E6E1D7] py-2 text-sm"
        >
          <span className="text-[#4A524D]">{row.label}</span>
          <span className="font-medium">{row.value}</span>
        </div>
      ))}
      <div className="mt-3 flex items-center justify-between rounded bg-[#4D5B4B] px-4 py-3 text-white">
        <span className="text-sm font-bold">{grandLabel}</span>
        <span className="text-xl font-bold">{grandValue}</span>
      </div>
      {children}
    </div>
  </div>
);

const PILL_STYLES = {
  Paid: "bg-[#EEF5EF] text-[#2F6B3F]",
  Overdue: "bg-[#FDF0EE] text-[#B42318]",
};

export const StatusPill = ({ label }) => (
  <span
    className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.1em] ${
      PILL_STYLES[label] || "bg-[#EDE9E0] text-[#4D5B4B]"
    }`}
  >
    {label}
  </span>
);
