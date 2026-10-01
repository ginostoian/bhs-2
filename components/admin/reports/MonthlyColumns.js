"use client";

import { useState } from "react";
import { compactCurrency, formatCurrency } from "@/components/admin/ui";

/**
 * Single-series monthly column chart with a hover tooltip and a table view.
 * months: [{ key, label, year, [valueKey]: number, ...tooltipFields }]
 * tooltip: [{ key, label, money? }] extra rows shown on hover and in the table.
 */
export default function MonthlyColumns({
  months,
  valueKey,
  valueLabel,
  money = true,
  tooltip = [],
  height = 180,
}) {
  const [hover, setHover] = useState(null);
  const [showTable, setShowTable] = useState(false);
  const max = Math.max(...months.map((m) => m[valueKey] || 0), 0);
  const niceMax = niceCeil(max);
  const ticks = [0, niceMax / 2, niceMax];
  const fmt = (v) => (money ? compactCurrency(v) : String(Math.round(v)));
  const fmtFull = (v) => (money ? formatCurrency(v) : String(v));

  const width = 100 / months.length;
  return (
    <div>
      <div
        className="relative"
        style={{ height: height + 24 }}
        onMouseLeave={() => setHover(null)}
      >
        {/* Grid + y ticks */}
        {ticks.map((t) => (
          <div
            key={t}
            className="absolute inset-x-0 flex items-center"
            style={{ bottom: 24 + (niceMax ? (t / niceMax) * height : 0) }}
          >
            <span className="w-12 shrink-0 pr-2 text-right text-[10px] tabular-nums text-[#A3A8A4]">
              {fmt(t)}
            </span>
            <span className="h-px flex-1 bg-[#EDE9E0]" />
          </div>
        ))}
        {/* Columns */}
        <div
          className="absolute bottom-6 left-12 right-0 flex items-end"
          style={{ height }}
        >
          {/* Tooltip */}
          {hover !== null && (
            <div
              className="pointer-events-none absolute top-0 z-10 min-w-[160px] -translate-x-1/2 rounded-md border border-[#D8D2C6] bg-white px-3 py-2 text-xs shadow-[0_8px_24px_rgba(32,41,37,0.12)]"
              style={{
                left: `${Math.min(Math.max((hover + 0.5) * width, 12), 88)}%`,
              }}
            >
              <p className="font-semibold text-[#202925]">
                {months[hover].label} {months[hover].year}
              </p>
              <p className="mt-1 flex justify-between gap-4">
                <span className="flex items-center gap-1.5 text-[#4A524D]">
                  <span className="h-2 w-2 rounded-sm bg-[#4D5B4B]" />{" "}
                  {valueLabel}
                </span>
                <span className="font-semibold tabular-nums">
                  {fmtFull(months[hover][valueKey] || 0)}
                </span>
              </p>
              {tooltip.map((t) => (
                <p
                  key={t.key}
                  className="flex justify-between gap-4 text-[#7A807B]"
                >
                  <span>{t.label}</span>
                  <span className="tabular-nums">
                    {t.money === false
                      ? months[hover][t.key] || 0
                      : formatCurrency(months[hover][t.key] || 0)}
                  </span>
                </p>
              ))}
            </div>
          )}

          {months.map((m, i) => {
            const v = m[valueKey] || 0;
            const h = niceMax ? (v / niceMax) * height : 0;
            return (
              <button
                key={m.key}
                type="button"
                aria-label={`${m.label} ${m.year}: ${fmtFull(v)}`}
                onMouseEnter={() => setHover(i)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="group relative flex h-full items-end justify-center focus:outline-none"
                style={{ width: `${width}%` }}
              >
                <span
                  className={`block w-[min(24px,60%)] rounded-t-[4px] transition-colors ${
                    hover === i ? "bg-[#202925]" : "bg-[#4D5B4B]"
                  } ${v === 0 ? "opacity-0" : ""}`}
                  style={{ height: Math.max(h, v > 0 ? 2 : 0) }}
                />
              </button>
            );
          })}
        </div>
        {/* X labels */}
        <div className="absolute bottom-0 left-12 right-0 flex">
          {months.map((m) => (
            <span
              key={m.key}
              className="text-center text-[10px] text-[#7A807B]"
              style={{ width: `${width}%` }}
            >
              {m.label}
            </span>
          ))}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setShowTable((s) => !s)}
        className="mt-2 text-xs font-medium text-[#4D5B4B] underline underline-offset-2"
      >
        {showTable ? "Hide table" : "Show as table"}
      </button>
      {showTable && (
        <table className="mt-2 w-full text-xs">
          <thead>
            <tr className="text-left text-[#7A807B]">
              <th className="py-1 font-semibold">Month</th>
              <th className="py-1 text-right font-semibold">{valueLabel}</th>
              {tooltip.map((t) => (
                <th key={t.key} className="py-1 text-right font-semibold">
                  {t.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {months.map((m) => (
              <tr key={m.key} className="border-t border-[#EDE9E0]">
                <td className="py-1">
                  {m.label} {m.year}
                </td>
                <td className="py-1 text-right tabular-nums">
                  {fmtFull(m[valueKey] || 0)}
                </td>
                {tooltip.map((t) => (
                  <td key={t.key} className="py-1 text-right tabular-nums">
                    {t.money === false
                      ? m[t.key] || 0
                      : formatCurrency(m[t.key] || 0)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function niceCeil(value) {
  if (value <= 0) return 1;
  const exp = Math.pow(10, Math.floor(Math.log10(value)));
  const f = value / exp;
  const nice = f <= 1 ? 1 : f <= 2 ? 2 : f <= 2.5 ? 2.5 : f <= 5 ? 5 : 10;
  return nice * exp;
}
