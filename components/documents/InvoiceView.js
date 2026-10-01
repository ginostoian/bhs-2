"use client";

import {
  company,
  formatCurrency,
  formatDate,
  invoiceStatusLabel,
} from "@/libs/documentFormat";
import {
  DocumentHeader,
  DocumentShell,
  DocumentToolbar,
  Eyebrow,
  Paragraphs,
  SectionTitle,
  StatusPill,
  TotalsBox,
} from "./DocumentParts";

// Web rendition of libs/pdf/InvoiceDocument.js — keep the two in step.

const GRID = "sm:grid sm:grid-cols-[1fr_70px_40px_100px_44px_110px] sm:gap-3";

const TypeLabel = ({ type }) => (
  <span
    className={`text-xs font-medium ${
      type === "Labour" ? "text-[#4D5B4B]" : "text-[#A65B43]"
    }`}
  >
    {type}
  </span>
);

const PartyCard = ({ title, name, lines }) => (
  <div className="rounded border border-[#E6E1D7] p-4">
    <Eyebrow className="mb-2 text-[#4D5B4B]">{title}</Eyebrow>
    <p className="font-bold">{name}</p>
    {lines.filter(Boolean).map((line, i) => (
      <p
        key={i}
        className="mt-0.5 whitespace-pre-line break-words text-sm text-[#4A524D]"
      >
        {line}
      </p>
    ))}
  </div>
);

export default function InvoiceView({ invoice, toolbarProps }) {
  const reference = invoice.invoiceNumber;
  const client = invoice.client || {};
  const status = invoiceStatusLabel(invoice);
  const isPaid = invoice.status === "paid";
  const lineItems = [...(invoice.lineItems || [])].sort(
    (a, b) => (a.order || 0) - (b.order || 0),
  );

  return (
    <DocumentShell
      toolbar={
        <DocumentToolbar title={`Invoice ${reference}`} {...toolbarProps} />
      }
      footerText={`${company.name} · Invoice ${reference}`}
    >
      <DocumentHeader
        label="INVOICE"
        reference={`No. ${reference}`}
        badge={<StatusPill label={status} />}
        meta={[
          { label: "Issue date", value: formatDate(invoice.issueDate) || "—" },
          {
            label: "Due date",
            value: formatDate(invoice.dueDate) || "On receipt",
            danger: invoice.isOverdue,
          },
          {
            label: "Amount due",
            value: formatCurrency(isPaid ? 0 : invoice.total),
          },
        ]}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        <PartyCard
          title="Bill to"
          name={client.name}
          lines={[client.address, client.email, client.phone]}
        />
        <PartyCard
          title="From"
          name={company.name}
          lines={[company.location, company.phone, company.website]}
        />
      </div>

      <SectionTitle
        eyebrow="Services"
        title={invoice.title || "Invoice details"}
      />

      <div className="overflow-hidden rounded-t">
        <div
          className={`hidden bg-[#4D5B4B] px-3 py-2.5 text-[10px] font-bold uppercase tracking-[0.1em] text-white ${GRID}`}
        >
          <span>Service</span>
          <span>Type</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Price ex. VAT</span>
          <span className="text-right">VAT</span>
          <span className="text-right">Total inc. VAT</span>
        </div>
        <div className="h-0.5 bg-[#4D5B4B] sm:hidden" />
        <ul>
          {lineItems.map((item, i) => (
            <li
              key={i}
              className={`border-b border-[#E6E1D7] px-1 py-3 text-sm sm:items-center sm:px-3 ${GRID} ${
                i % 2 === 1 ? "sm:bg-[#F4F1EA]" : ""
              }`}
            >
              {/* Mobile layout */}
              <div className="sm:hidden">
                <div className="flex items-start justify-between gap-3">
                  <p className="font-medium">{item.serviceName}</p>
                  <p className="shrink-0 font-bold">
                    {formatCurrency(item.totalVatIncluded)}
                  </p>
                </div>
                <p className="mt-1 text-[13px] text-[#7A807B]">
                  <TypeLabel type={item.type} />
                  {" · "}
                  {item.quantity} × {formatCurrency(item.priceExclVat)} +{" "}
                  {item.vatRate}% VAT
                </p>
              </div>
              {/* Desktop columns */}
              <span className="hidden font-medium sm:block">
                {item.serviceName}
              </span>
              <span className="hidden sm:block">
                <TypeLabel type={item.type} />
              </span>
              <span className="hidden text-right text-[#4A524D] sm:block">
                {item.quantity}
              </span>
              <span className="hidden text-right text-[#4A524D] sm:block">
                {formatCurrency(item.priceExclVat)}
              </span>
              <span className="hidden text-right text-[#4A524D] sm:block">
                {item.vatRate}%
              </span>
              <span className="hidden text-right font-bold sm:block">
                {formatCurrency(item.totalVatIncluded)}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <TotalsBox
        rows={[
          {
            label: "Subtotal (ex. VAT)",
            value: formatCurrency(invoice.subtotal),
          },
          { label: "VAT", value: formatCurrency(invoice.totalVat) },
        ]}
        grandLabel={isPaid ? "Total paid" : "Total due"}
        grandValue={formatCurrency(invoice.total)}
      />

      {invoice.isOverdue && (
        <div className="mt-6 border-l-[3px] border-[#B42318] bg-[#FDF0EE] px-4 py-3 text-[#B42318]">
          <p className="font-bold">This invoice is overdue</p>
          <p className="mt-0.5 text-sm">
            Payment was due on {formatDate(invoice.dueDate)}. Please contact us
            to arrange payment.
          </p>
        </div>
      )}

      {invoice.notes && (
        <>
          <SectionTitle eyebrow="Notes" title="Additional information" />
          <Paragraphs text={invoice.notes} />
        </>
      )}

      {invoice.terms && (
        <>
          <SectionTitle eyebrow="Terms" title="Terms & conditions" />
          <Paragraphs text={invoice.terms} className="text-sm" />
        </>
      )}

      <div className="mt-9 border-t border-[#E6E1D7] pt-5 text-center">
        <p className="font-bold">Thank you for your business</p>
        <p className="mt-0.5 text-sm text-[#4A524D]">
          {company.name} · {company.location}
        </p>
      </div>
    </DocumentShell>
  );
}
