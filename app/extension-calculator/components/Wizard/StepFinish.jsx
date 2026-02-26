"use client";

import React from "react";
import {
  PROPERTY_TYPES,
  EXTENSION_TYPES,
  REGIONS,
  LONDON_ZONES,
  COMPLEXITY_FACTORS,
  FINISH_LEVELS,
  SITE_ACCESS_OPTIONS,
  GLAZING_LEVELS,
  DRAWINGS_STATUS_OPTIONS,
  PLANNING_STATUS_OPTIONS,
  ADDITIONAL_FEATURE_OPTIONS,
  PLANNING_SERVICE_OPTIONS,
} from "../../lib/config";
import { costEngine } from "../../lib/costEngine";

const lookupName = (arr, id) => arr.find((item) => item.id === id)?.name || id || "Not set";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

const StepFinish = ({ formData, onNext, onBack }) => {
  let preview = null;
  try {
    if (formData.extensionType && formData.size > 0) {
      preview = costEngine.calculateTotalCost(formData);
    }
  } catch (_error) {
    preview = null;
  }

  const extras = Array.isArray(formData.additionalFeatures)
    ? formData.additionalFeatures
    : [];
  const planningServices = Array.isArray(formData.planningServices)
    ? formData.planningServices
    : [];

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Review before calculating
        </h2>
        <p className="mt-2 text-stone-600">
          Check the inputs below. We’ll generate a transparent budget range with
          build cost, extras, fees, contingency, and VAT shown separately.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.35fr_1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Project Summary
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryItem label="Property type" value={lookupName(PROPERTY_TYPES, formData.propertyType)} />
              <SummaryItem label="Region" value={lookupName(REGIONS, formData.region || formData.location)} />
              {formData.region === "london" && (
                <SummaryItem label="London zone" value={lookupName(LONDON_ZONES, formData.londonZone)} />
              )}
              <SummaryItem label="Postcode" value={formData.postcode || "Not provided"} />
              <SummaryItem label="Extension type" value={lookupName(EXTENSION_TYPES, formData.extensionType)} />
              <SummaryItem label="Size" value={formData.size ? `${formData.size} m²` : "Not set"} />
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Cost Drivers
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <SummaryItem label="Complexity" value={lookupName(COMPLEXITY_FACTORS, formData.complexity)} />
              <SummaryItem label="Finish level" value={lookupName(FINISH_LEVELS, formData.finishLevel)} />
              <SummaryItem label="Site access" value={lookupName(SITE_ACCESS_OPTIONS, formData.siteAccess)} />
              <SummaryItem label="Glazing level" value={lookupName(GLAZING_LEVELS, formData.glazingLevel)} />
              <SummaryItem label="Drawings status" value={lookupName(DRAWINGS_STATUS_OPTIONS, formData.drawingsStatus)} />
              <SummaryItem label="Planning status" value={lookupName(PLANNING_STATUS_OPTIONS, formData.planningStatus)} />
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Selected Extras
            </h3>
            {extras.length > 0 ? (
              <div className="space-y-2">
                {extras.map((feature, index) => {
                  const id = typeof feature === "string" ? feature : feature.id;
                  const quantity = typeof feature === "string" ? 1 : feature.quantity;
                  const cfg = ADDITIONAL_FEATURE_OPTIONS.find((f) => f.id === id);
                  if (!cfg) return null;
                  return (
                    <div
                      key={`${id}-${index}`}
                      className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3 text-sm"
                    >
                      <div>
                        <div className="font-medium text-stone-900">{cfg.name}</div>
                        <div className="text-xs text-stone-500">
                          {cfg.unit === "fixed"
                            ? "Fixed allowance"
                            : `${quantity} ${cfg.unitLabel}`}
                        </div>
                      </div>
                      <div className="font-semibold text-stone-900">
                        {formatCurrency(
                          cfg.unitCost * (cfg.unit === "fixed" ? 1 : Number(quantity) || 1),
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-sm text-stone-600">
                No optional extras selected. That&apos;s fine, the calculator will
                still include a realistic base build and fee allowance.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Planning / Professional Fees (Manual Selection)
            </h3>
            {planningServices.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {planningServices.map((id) => (
                  <span
                    key={id}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-900"
                  >
                    {lookupName(PLANNING_SERVICE_OPTIONS, id)}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-sm text-stone-600">
                None selected. We&apos;ll auto-include recommended allowances
                based on your planning and drawings status.
              </p>
            )}
          </section>
        </div>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-300">
              Estimate Preview
            </h3>
            {preview ? (
              <>
                <div className="mt-4">
                  <div className="text-xs uppercase tracking-[0.14em] text-stone-300">
                    Expected budget
                  </div>
                  <div className="mt-1 text-3xl font-semibold tracking-tight">
                    {formatCurrency(preview.ranges.expected)}
                  </div>
                  <div className="mt-2 text-sm text-stone-200">
                    Range: {formatCurrency(preview.ranges.low)} -{" "}
                    {formatCurrency(preview.ranges.high)}
                  </div>
                  <div className="mt-1 text-sm text-stone-300">
                    {formatCurrency(preview.rangePerSqm.expected)} /m² expected
                  </div>
                </div>

                <div className="mt-5 rounded-xl border border-white/15 bg-white/5 p-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-stone-300">Confidence</span>
                    <span className="font-semibold">{preview.confidenceScore}/100</span>
                  </div>
                  <div className="mt-2 h-2 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-emerald-300"
                      style={{ width: `${preview.confidenceScore}%` }}
                    />
                  </div>
                  <p className="mt-2 text-xs text-stone-300">
                    Confidence improves when measured/architect plans are
                    available and planning status is known.
                  </p>
                </div>

                <div className="mt-5 rounded-xl border border-white/15 bg-white/5 p-4 text-sm">
                  <div className="font-semibold">Indicative timeline</div>
                  <div className="mt-2 flex justify-between text-stone-200">
                    <span>Planning / pre-construction</span>
                    <span>
                      {preview.timeline.planning.min}-{preview.timeline.planning.max} weeks
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between text-stone-200">
                    <span>Build programme</span>
                    <span>
                      {preview.timeline.build.min}-{preview.timeline.build.max} weeks
                    </span>
                  </div>
                  <div className="mt-1 flex justify-between font-semibold">
                    <span>Total typical programme</span>
                    <span>
                      {preview.timeline.total.min}-{preview.timeline.total.max} weeks
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <p className="mt-3 text-sm text-stone-300">
                Add your extension type and size to preview the estimate here.
              </p>
            )}
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              What happens next
            </h4>
            <ol className="mt-3 space-y-2 text-sm text-stone-700">
              <li>1. We calculate a line-item ballpark budget range.</li>
              <li>2. You can request a PDF by email (lead capture + download).</li>
              <li>
                3. London leads can book a survey/cost review with your inputs
                pre-filled.
              </li>
            </ol>
          </section>
        </aside>
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-black"
        >
          Calculate Budget Range
        </button>
      </div>
    </div>
  );
};

function SummaryItem({ label, value }) {
  return (
    <div className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
      <div className="text-xs font-semibold uppercase tracking-wide text-stone-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-stone-900">{value}</div>
    </div>
  );
}

export default StepFinish;
