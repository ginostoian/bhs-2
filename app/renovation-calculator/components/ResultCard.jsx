"use client";

import React from "react";
import Link from "next/link";
import PDFDownload from "./PDFDownload";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

function BreakdownRow({ label, value, strong = false }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-lg px-1 py-1">
      <span className={strong ? "font-semibold text-stone-900" : "text-stone-700"}>
        {label}
      </span>
      <span
        className={`text-right ${strong ? "font-semibold text-stone-900" : "text-stone-800"}`}
      >
        {value}
      </span>
    </div>
  );
}

function DetailSection({ title, items, valueKey = "total" }) {
  if (!items?.length) return null;

  return (
    <section className="rounded-2xl border border-stone-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
        {title}
      </h3>
      <div className="space-y-2">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm"
          >
            <div>
              <div className="font-medium text-stone-900">{item.name}</div>
              {item.quantity > 1 && (
                <div className="text-xs text-stone-500">Quantity: {item.quantity}</div>
              )}
            </div>
            <div className="font-semibold text-stone-900">
              {formatCurrency(item[valueKey] || 0)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function ResultCard({
  calculationResult,
  formData,
  onRecalculate,
  onModifySelections,
}) {
  const { breakdown, ranges, timeline } = calculationResult;
  const isLondon = calculationResult.serviceArea?.isLondon;

  return (
    <div className="mx-auto max-w-6xl">
      <div className="overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-2xl shadow-stone-900/5">
        <div className="border-b border-stone-200 bg-gradient-to-br from-stone-100 via-white to-stone-50 px-6 py-8 md:px-8">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr] lg:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-stone-500">
                Ballpark Renovation Budget
              </p>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900 md:text-4xl">
                {formData.houseSize} m² home refurbishment
              </h2>
              <p className="mt-2 text-stone-600">
                {isLondon ? "London" : "UK regional"} estimate with room
                allowances, systems, structural risk, finishing, contingency,
                and VAT shown separately.
              </p>

              {!isLondon && (
                <div className="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
                  Better Homes Studio primarily serves London. Non-London
                  outputs are provided as a budgeting benchmark only.
                </div>
              )}
            </div>

            <div className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white">
              <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
                Expected Budget
              </div>
              <div className="mt-2 text-4xl font-semibold tracking-tight">
                {formatCurrency(ranges.expected)}
              </div>
              <div className="mt-2 text-sm text-stone-200">
                Range: {formatCurrency(ranges.low)} - {formatCurrency(ranges.high)}
              </div>
              <div className="mt-1 text-sm text-stone-300">
                Expected: {formatCurrency(calculationResult.rangePerSqm.expected)} /m²
              </div>
              <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-emerald-300"
                  style={{ width: `${calculationResult.confidenceScore}%` }}
                />
              </div>
              <div className="mt-2 text-xs text-stone-300">
                Confidence score: {calculationResult.confidenceScore}/100
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 p-6 md:p-8 xl:grid-cols-[1.35fr_1fr]">
          <div className="space-y-6">
            <section className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Cost Breakdown
                </h3>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700">
                  Transparent line items
                </span>
              </div>

              <div className="space-y-2 text-sm">
                <BreakdownRow
                  label={`Core scope allowance (${breakdown.impactedArea} m² affected)`}
                  value={formatCurrency(breakdown.coreScopeAdjusted)}
                  strong
                />
                <BreakdownRow label="Room fit-out" value={formatCurrency(breakdown.roomFitout)} />
                <BreakdownRow
                  label="Structural works"
                  value={formatCurrency(breakdown.structuralWorks)}
                />
                <BreakdownRow label="Systems" value={formatCurrency(breakdown.systemsWorks)} />
                <BreakdownRow
                  label="Finishing"
                  value={formatCurrency(breakdown.finishingWorks)}
                />
                <BreakdownRow
                  label="Professional fees"
                  value={formatCurrency(breakdown.professionalFees)}
                />
                <BreakdownRow
                  label="Statutory fees"
                  value={formatCurrency(breakdown.statutoryFees)}
                />
                <BreakdownRow
                  label="Subtotal before contingency"
                  value={formatCurrency(breakdown.subtotalBeforeContingency)}
                />
                <BreakdownRow
                  label={`Contingency (${Math.round(breakdown.contingencyRate * 100)}%)`}
                  value={formatCurrency(breakdown.contingency)}
                />
                <BreakdownRow
                  label="Subtotal ex VAT"
                  value={formatCurrency(breakdown.subtotalExVat)}
                  strong
                />
                <BreakdownRow
                  label={`VAT (${Math.round(breakdown.vatRate * 100)}%)`}
                  value={formatCurrency(breakdown.vat)}
                />
                <div className="mt-3 rounded-xl border border-slate-900 bg-slate-900 px-4 py-3 text-white">
                  <div className="flex items-center justify-between text-sm font-semibold">
                    <span>Total expected budget</span>
                    <span>{formatCurrency(breakdown.total)}</span>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-xs text-stone-500">
                VAT is applied conservatively to the subtotal so the result is
                useful for planning rather than artificially low.
              </p>
            </section>

            <DetailSection title="Room Fit-Out" items={breakdown.roomLineItems} />
            <DetailSection
              title="Structural Allowances"
              items={breakdown.structuralLineItems}
            />
            <DetailSection title="Systems" items={breakdown.systemsLineItems} />
            <DetailSection title="Finishing" items={breakdown.finishingLineItems} />
            <DetailSection title="Fees Included" items={breakdown.feeLineItems} valueKey="cost" />
          </div>

          <aside className="space-y-6">
            <section className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                Programme Range
              </h3>
              <div className="mt-4 space-y-2 text-sm">
                <BreakdownRow
                  label="Pre-construction"
                  value={`${timeline.planning.min}-${timeline.planning.max} weeks`}
                />
                <BreakdownRow
                  label="Construction"
                  value={`${timeline.build.min}-${timeline.build.max} weeks`}
                />
                <BreakdownRow
                  label="Typical total"
                  value={`${timeline.total.min}-${timeline.total.max} weeks`}
                  strong
                />
              </div>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                How to use this estimate
              </h3>
              <ul className="mt-3 space-y-2 text-sm text-stone-700">
                <li>Use the expected figure for early budget planning.</li>
                <li>Use the high figure when checking affordability.</li>
                <li>Refine the range once the room schedule is more detailed.</li>
              </ul>
            </section>

            <section className="rounded-2xl border border-stone-200 bg-white p-5">
              <div className="grid gap-3">
                <Link
                  href="/contact"
                  className="rounded-xl bg-slate-900 px-5 py-3 text-center text-sm font-semibold text-white transition hover:bg-black"
                >
                  Book a Free Cost Review
                </Link>
                <button
                  onClick={onModifySelections}
                  className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
                >
                  Edit Answers
                </button>
                <button
                  onClick={onRecalculate}
                  className="rounded-xl border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
                >
                  Start New Estimate
                </button>
              </div>
            </section>
          </aside>
        </div>

        <div className="border-t border-stone-200 bg-stone-50/60 px-6 py-6 md:px-8">
          <PDFDownload calculationResult={calculationResult} formData={formData} />
        </div>
      </div>
    </div>
  );
}
