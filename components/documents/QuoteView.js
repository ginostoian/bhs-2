"use client";

import { businessFacts } from "@/libs/businessFacts";
import {
  company,
  formatCurrency,
  formatDate,
  formatProjectType,
} from "@/libs/documentFormat";
import {
  DEFAULT_LEAD_TIME,
  DEFAULT_PAYMENT_TERMS,
  calculateQuoteTotals,
  quoteCategoryTotal,
  quoteTermsSections,
  usableText,
} from "@/libs/quoteTerms";
import {
  DocumentHeader,
  DocumentShell,
  DocumentToolbar,
  Eyebrow,
  InfoCard,
  Paragraphs,
  SectionTitle,
  TotalsBox,
} from "./DocumentParts";

// Web rendition of libs/pdf/QuoteDocument.js — keep the two in step.

const HeadingBlock = ({ service }) => (
  <div className="mt-5 border-l-[3px] border-[#A65B43] bg-[#F4F1EA] px-4 py-3 first:mt-0">
    <p className="text-base font-bold">{service.headingText}</p>
    {service.headingDescription && (
      <p className="mt-1 whitespace-pre-line text-sm text-[#4A524D]">
        {service.headingDescription}
      </p>
    )}
  </div>
);

const ItemText = ({ item }) => (
  <>
    <p className="font-medium">{item.name}</p>
    {item.description && (
      <p className="mt-0.5 whitespace-pre-line text-[13px] leading-snug text-[#4A524D]">
        {item.description}
      </p>
    )}
    {item.notes && (
      <p className="mt-1 whitespace-pre-line text-xs text-[#A65B43]">
        Note: {item.notes}
      </p>
    )}
  </>
);

const CategoryTable = ({ service }) => (
  <section className="mt-5 overflow-hidden rounded-t first:mt-0">
    <div className="flex items-center justify-between gap-3 bg-[#4D5B4B] px-3 py-2.5 text-white sm:px-3.5">
      <p className="font-bold">{service.categoryName}</p>
      <p className="shrink-0 font-bold">
        {formatCurrency(quoteCategoryTotal(service))}
      </p>
    </div>
    {service.description && (
      <p className="whitespace-pre-line border-b border-[#E6E1D7] bg-[#FBFAF7] px-3 py-2 text-[13px] leading-snug text-[#4A524D] sm:px-3.5">
        {service.description}
      </p>
    )}

    {/* Column labels — desktop only */}
    <div className="hidden grid-cols-[1fr_80px_100px_100px] gap-3 bg-[#F4F1EA] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.1em] text-[#7A807B] sm:grid">
      <span>Item</span>
      <span className="text-right">Qty</span>
      <span className="text-right">Unit price</span>
      <span className="text-right">Total</span>
    </div>

    <ul>
      {(service.items || []).map((item, i) => (
        <li
          key={i}
          className="border-b border-[#E6E1D7] px-1 py-3 text-sm sm:grid sm:grid-cols-[1fr_80px_100px_100px] sm:gap-3 sm:px-3.5"
        >
          <div className="min-w-0">
            <ItemText item={item} />
          </div>
          {/* Desktop columns */}
          <span className="hidden text-right text-[#4A524D] sm:block">
            {`${item.quantity ?? ""} ${item.unit ?? ""}`.trim()}
          </span>
          <span className="hidden text-right text-[#4A524D] sm:block">
            {formatCurrency(item.customerUnitPrice || item.unitPrice)}
          </span>
          <span className="hidden text-right font-bold sm:block">
            {formatCurrency(item.customerTotal || item.total)}
          </span>
          {/* Mobile summary line */}
          <div className="mt-2 flex items-baseline justify-between sm:hidden">
            <span className="text-[13px] text-[#7A807B]">
              {`${item.quantity ?? ""} ${item.unit ?? ""}`.trim()} ×{" "}
              {formatCurrency(item.customerUnitPrice || item.unitPrice)}
            </span>
            <span className="font-bold">
              {formatCurrency(item.customerTotal || item.total)}
            </span>
          </div>
        </li>
      ))}
    </ul>
  </section>
);

const KeyTerm = ({ title, text }) => (
  <div className="rounded bg-[#F4F1EA] p-4">
    <Eyebrow className="mb-1.5 text-[#4D5B4B]">{title}</Eyebrow>
    <p className="text-sm leading-relaxed text-[#4A524D]">{text}</p>
  </div>
);

export default function QuoteView({ quote, toolbarProps, hideToolbar }) {
  const totals = calculateQuoteTotals(quote);
  const reference = quote.quoteNumber || quote._id || quote.id;
  const client = quote.client || {};
  const services = quote.services || [];
  const validUntil = formatDate(quote.validUntil) || "30 days from issue";

  return (
    <DocumentShell
      toolbar={
        hideToolbar ? null : (
          <DocumentToolbar title={`Quote ${reference}`} {...toolbarProps} />
        )
      }
      footerText={`${company.name} · Quote ${reference}`}
    >
      <DocumentHeader
        label="QUOTE"
        reference={`No. ${reference}`}
        meta={[
          {
            label: "Issued",
            value: formatDate(quote.sentAt || quote.createdAt) || "—",
          },
          { label: "Valid until", value: validUntil },
          {
            label: "Project type",
            value: formatProjectType(quote.projectType) || "—",
          },
          { label: "Duration", value: quote.estimatedDuration || "—" },
        ]}
      />

      {quote.title && (
        <p className="mb-4 text-xl font-bold tracking-tight sm:text-2xl">
          {quote.title}
        </p>
      )}

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoCard
          title="Prepared for"
          rows={[
            { label: "Name", value: client.name },
            { label: "Email", value: client.email },
            { label: "Phone", value: client.phone },
            { label: "Address", value: client.address },
            { label: "Postcode", value: client.postcode },
          ]}
        />
        <InfoCard
          title="Project"
          rows={[
            { label: "Site", value: quote.projectAddress },
            { label: "Start date", value: formatDate(quote.startDate) },
            { label: "Duration", value: quote.estimatedDuration },
          ]}
        />
      </div>

      {quote.projectDescription && (
        <>
          <SectionTitle eyebrow="Overview" title="Project description" />
          <Paragraphs text={quote.projectDescription} />
        </>
      )}

      {services.length > 0 && (
        <>
          <SectionTitle eyebrow="Scope of work" title="Services & costs" />
          <div>
            {services.map((service, i) =>
              service.type === "heading" ? (
                <HeadingBlock key={i} service={service} />
              ) : (
                <CategoryTable key={i} service={service} />
              ),
            )}
          </div>
        </>
      )}

      <TotalsBox
        rows={[
          {
            label: "Services subtotal",
            value: formatCurrency(totals.subtotal),
          },
          {
            label: `VAT (${totals.vatRate}%)`,
            value: formatCurrency(totals.vat),
          },
        ]}
        grandLabel="Total (inc. VAT)"
        grandValue={formatCurrency(totals.total)}
      >
        {quote.pricing?.depositRequired && (
          <div className="mt-3 rounded border border-[#C48A6A] px-4 py-2.5">
            <div className="flex justify-between font-bold text-[#A65B43]">
              <span>Deposit to book</span>
              <span>{formatCurrency(totals.deposit)}</span>
            </div>
            <p className="mt-0.5 text-xs text-[#4A524D]">
              Secures your project slot and covers initial materials.
            </p>
          </div>
        )}
      </TotalsBox>

      {quote.specialInstructions && (
        <>
          <SectionTitle eyebrow="From us" title="Notes" />
          <Paragraphs text={quote.specialInstructions} />
        </>
      )}

      <SectionTitle eyebrow="Good to know" title="Key terms" />
      <div className="grid gap-3 sm:grid-cols-3">
        <KeyTerm
          title="Payment"
          text={usableText(quote.termsAndConditions) || DEFAULT_PAYMENT_TERMS}
        />
        <KeyTerm
          title="Timeline"
          text={`${usableText(quote.leadTime) || DEFAULT_LEAD_TIME}${
            quote.estimatedDuration
              ? ` The estimated duration for this project is ${quote.estimatedDuration}.`
              : ""
          }`}
        />
        <KeyTerm
          title="Warranty"
          text={
            usableText(quote.warrantyInformation) || businessFacts.workmanship
          }
        />
      </div>

      <SectionTitle eyebrow="The detail" title="Terms & conditions" />
      <div className="space-y-5 text-sm leading-relaxed text-[#4A524D]">
        {quoteTermsSections.map((section) => (
          <div key={section.title}>
            <p className="mb-1 font-bold text-[#202925]">{section.title}</p>
            {section.intro && <p className="mb-1">{section.intro}</p>}
            {section.paragraphs && (
              <div className="space-y-1.5">
                {section.paragraphs.map((p) => (
                  <p key={p}>{p}</p>
                ))}
              </div>
            )}
            {section.bullets && (
              <ul className="space-y-1">
                {section.bullets.map((b) => (
                  <li key={b} className="flex gap-2">
                    <span className="text-[#A65B43]">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 rounded bg-[#F4F1EA] px-4 py-4 text-center">
        <p className="font-bold">This quote is valid until {validUntil}.</p>
        <p className="mt-1 text-sm text-[#4A524D]">
          Questions? Call{" "}
          <a
            href={`tel:${company.phone.replace(/\s/g, "")}`}
            className="font-medium text-[#4D5B4B] underline underline-offset-2"
          >
            {company.phone}
          </a>{" "}
          or visit{" "}
          <a
            href={`https://${company.website}`}
            className="font-medium text-[#4D5B4B] underline underline-offset-2"
          >
            {company.website}
          </a>
        </p>
      </div>
    </DocumentShell>
  );
}
