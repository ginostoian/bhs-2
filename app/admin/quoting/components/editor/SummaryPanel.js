"use client";

import { formatCurrency } from "@/libs/documentFormat";
import { calculateQuoteTotals } from "@/libs/quoteTerms";
import { lineTotal } from "./quoteModel";
import { Card, cx, inputClass } from "./ui";

const Row = ({ label, value, strong, muted }) => (
  <div className="flex items-baseline justify-between gap-3 py-1.5 text-sm">
    <span className={muted ? "text-[#7A807B]" : "text-[#4A524D]"}>{label}</span>
    <span className={cx("tabular-nums", strong && "font-semibold")}>
      {value}
    </span>
  </div>
);

export default function SummaryPanel({ quote, set, showCosts, onToggleCosts }) {
  // Totals are computed from live line totals (quantity × rate)
  const totals = calculateQuoteTotals({
    ...quote,
    services: quote.services.map((service) => ({
      ...service,
      items: (service.items || []).map((item) => ({
        ...item,
        total: lineTotal(item),
      })),
    })),
  });
  const pricing = quote.pricing;
  const depositMode =
    Number(pricing.depositPercentage) > 0 ? "percent" : "amount";
  const sectionCount = quote.services.filter(
    (s) => s.type !== "heading",
  ).length;

  const setPricing = (key, value) => set(["pricing", key], value);

  return (
    <Card title="Summary" bodyClassName="p-4 pt-2">
      <Row
        label={`${totals.lines} line${totals.lines === 1 ? "" : "s"} · ${sectionCount} section${sectionCount === 1 ? "" : "s"}`}
        value=""
        muted
      />
      <Row label="Subtotal" value={formatCurrency(totals.subtotal)} />
      <div className="flex items-center justify-between gap-3 py-1.5 text-sm">
        <label htmlFor="vat-rate" className="text-[#4A524D]">
          VAT
        </label>
        <div className="flex items-center gap-2">
          <select
            id="vat-rate"
            value={pricing.vatRate ?? 20}
            onChange={(e) => setPricing("vatRate", Number(e.target.value))}
            className={cx(inputClass, "h-8 w-[76px] py-0 text-xs")}
          >
            <option value={20}>20%</option>
            <option value={5}>5%</option>
            <option value={0}>0%</option>
          </select>
          <span className="tabular-nums">{formatCurrency(totals.vat)}</span>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between rounded bg-[#4D5B4B] px-3 py-2.5 text-white">
        <span className="text-sm font-semibold">Total inc. VAT</span>
        <span className="text-lg font-bold tabular-nums">
          {formatCurrency(totals.total)}
        </span>
      </div>

      {/* Deposit */}
      <div className="mt-4 border-t border-[#EDE9E0] pt-3">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">Deposit to book</span>
          <input
            type="checkbox"
            checked={!!pricing.depositRequired}
            onChange={(e) => setPricing("depositRequired", e.target.checked)}
            className="h-4 w-4 accent-[#4D5B4B]"
          />
        </label>
        {pricing.depositRequired && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex shrink-0 overflow-hidden border border-[#D8D2C6] text-xs">
              {[
                ["amount", "£"],
                ["percent", "%"],
              ].map(([mode, label]) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => {
                    if (mode === depositMode) return;
                    if (mode === "percent") {
                      setPricing("depositPercentage", 10);
                    } else {
                      setPricing("depositPercentage", 0);
                      setPricing("depositAmount", totals.deposit);
                    }
                  }}
                  className={cx(
                    "h-8 w-8",
                    mode === depositMode
                      ? "bg-[#4D5B4B] text-white"
                      : "bg-white text-[#4A524D] hover:bg-[#F4F1EA]",
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <input
              type="number"
              min={0}
              step={depositMode === "percent" ? 1 : 50}
              value={
                depositMode === "percent"
                  ? pricing.depositPercentage
                  : (pricing.depositAmount ?? 0)
              }
              onChange={(e) =>
                setPricing(
                  depositMode === "percent"
                    ? "depositPercentage"
                    : "depositAmount",
                  Math.max(0, Number(e.target.value) || 0),
                )
              }
              aria-label={
                depositMode === "percent"
                  ? "Deposit percentage"
                  : "Deposit amount"
              }
              className={cx(
                inputClass,
                "h-8 w-20 min-w-0 flex-1 py-0 text-right tabular-nums",
              )}
            />
            <span className="w-24 shrink-0 text-right text-sm font-semibold tabular-nums text-[#A65B43]">
              {formatCurrency(totals.deposit)}
            </span>
          </div>
        )}
      </div>

      {/* Internal economics */}
      <div className="mt-4 border-t border-[#EDE9E0] pt-3">
        <label className="flex items-center justify-between gap-3 text-sm">
          <span className="font-medium">
            Costs & margin{" "}
            <span className="text-xs font-normal text-[#A65B43]">internal</span>
          </span>
          <input
            type="checkbox"
            checked={showCosts}
            onChange={onToggleCosts}
            className="h-4 w-4 accent-[#4D5B4B]"
          />
        </label>
        {showCosts && (
          <div className="mt-1">
            {totals.costedLines === 0 ? (
              <p className="py-1.5 text-xs text-[#7A807B]">
                Add a cost price to rows (the Cost column) to see margin.
              </p>
            ) : (
              <>
                <Row
                  label={`Cost (${totals.costedLines}/${totals.lines} rows)`}
                  value={formatCurrency(totals.cost)}
                />
                <Row
                  label="Gross profit"
                  value={formatCurrency(totals.profit)}
                  strong
                />
                <Row
                  label="Margin"
                  value={
                    totals.margin === null
                      ? "—"
                      : `${totals.margin.toFixed(1)}%`
                  }
                  strong
                />
              </>
            )}
          </div>
        )}
      </div>
    </Card>
  );
}
