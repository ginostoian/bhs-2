"use client";

import React from "react";
import { costEngine } from "../../lib/costEngine";

const pretty = (value) =>
  String(value || "")
    .replace(/([A-Z])/g, " $1")
    .replace(/^\w/, (char) => char.toUpperCase());

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

function Row({ label, value }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-stone-600">{label}</span>
      <span className="text-right font-medium text-stone-900">{value}</span>
    </div>
  );
}

export default function StepFinish({ formData, onNext, onBack }) {
  let preview = null;

  try {
    if (formData.propertyType && formData.houseStyle && formData.houseSize > 0) {
      preview = costEngine.calculateTotalCost(formData);
    }
  } catch (_error) {
    preview = null;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Review
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Check the scope before calculating
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          The result will show a range, not a fake single “exact” number. That
          makes it more useful when you are still defining the project.
        </p>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Property summary
          </h3>
          <div className="space-y-2">
            <Row label="Property type" value={pretty(formData.propertyType)} />
            <Row label="Region" value={pretty(formData.region)} />
            {formData.londonZone && formData.region === "london" && (
              <Row label="London zone" value={pretty(formData.londonZone)} />
            )}
            <Row label="House style" value={pretty(formData.houseStyle)} />
            <Row label="Size" value={`${formData.houseSize || 0} m²`} />
          </div>
        </div>

        <div className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="mb-4 text-lg font-semibold text-stone-900">Scope summary</h3>
          <div className="space-y-2">
            <Row label="Coverage" value={pretty(formData.coverageLevel)} />
            <Row label="Renovation level" value={pretty(formData.renovationLevel)} />
            <Row label="Finish level" value={pretty(formData.finishLevel)} />
            <Row label="Occupancy" value={pretty(formData.occupancyStatus)} />
            <Row label="Scope clarity" value={pretty(formData.drawingsStatus)} />
            <Row label="Kitchens included" value={String(formData.renovateKitchenCount || 0)} />
            <Row label="Bathrooms included" value={String(formData.renovateBathroomCount || 0)} />
            <Row label="Bedrooms included" value={String(formData.renovateBedroomCount || 0)} />
            <Row label="Reception rooms included" value={String(formData.renovateReceptionCount || 0)} />
          </div>
        </div>

        {preview && (
          <div className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white">
            <div className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-300">
              Preview
            </div>
            <div className="mt-2 text-3xl font-semibold tracking-tight">
              {formatCurrency(preview.ranges.expected)}
            </div>
            <p className="mt-2 text-sm text-stone-200">
              {formatCurrency(preview.ranges.low)} - {formatCurrency(preview.ranges.high)}
            </p>
            <p className="mt-1 text-sm text-stone-300">
              {formatCurrency(preview.rangePerSqm.expected)} /m² expected
            </p>
            <p className="mt-3 text-sm text-stone-300">
              Confidence: {preview.confidenceScore}/100
            </p>
            <p className="mt-1 text-sm text-stone-300">
              Typical programme: {preview.timeline.total.min}-{preview.timeline.total.max} weeks
            </p>
          </div>
        )}
      </div>

      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="rounded-2xl border border-stone-300 bg-white px-6 py-3 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
        >
          Back
        </button>
        <button
          type="button"
          onClick={onNext}
          className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Calculate Budget
        </button>
      </div>
    </div>
  );
}
