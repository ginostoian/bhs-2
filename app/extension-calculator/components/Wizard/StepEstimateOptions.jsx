"use client";

import React from "react";
import { FITTINGS_OPTIONS, VAT_TREATMENT_OPTIONS } from "../../lib/config";

function SelectCard({ checked, title, description, onChange }) {
  return (
    <label
      className={`block cursor-pointer rounded-2xl border p-4 transition ${
        checked
          ? "border-slate-900 bg-slate-50 shadow-sm"
          : "border-stone-200 bg-white hover:border-stone-300"
      }`}
    >
      <input type="radio" checked={checked} onChange={onChange} className="sr-only" />
      <div className="flex items-start gap-3">
        <span
          className={`mt-0.5 inline-flex h-5 w-5 rounded-full border-2 ${
            checked ? "border-slate-900 bg-slate-900" : "border-stone-300"
          }`}
        >
          {checked && <span className="m-auto h-2 w-2 rounded-full bg-white" />}
        </span>
        <span>
          <span className="block font-semibold text-stone-900">{title}</span>
          <span className="mt-1 block text-sm text-stone-600">{description}</span>
        </span>
      </div>
    </label>
  );
}

const StepEstimateOptions = ({ formData, setFormData, onNext, onBack }) => {
  const includeFittings = Boolean(formData.includeFittings);
  const vatTreatment = formData.vatTreatment || "standard";

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Estimate options
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          What should the budget include?
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          By default we price the <strong>structural build and construction materials</strong>.
          You can optionally add a ballpark for the internal finishes and fit-out items you&apos;ll
          buy (including any fit-out extras you selected).
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Fixtures, fittings &amp; finishes
          </h3>
          <div className="grid gap-4">
            {FITTINGS_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={includeFittings === (option.id === "included")}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    includeFittings: option.id === "included",
                  }))
                }
              />
            ))}
          </div>
          {!includeFittings && (
            <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
              <p className="font-semibold">Excluded at this setting:</p>
              <p className="mt-1">
                Internal floor coverings and finishes, plus fit-out extras such as the kitchen,
                bathrooms, bi-fold doors, bespoke joinery and premium flooring. Their installation
                and the structural build are still included — only the supplied product cost is
                left out so you can add your own budgets.
              </p>
            </div>
          )}
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">VAT treatment</h3>
          <div className="grid gap-4 md:grid-cols-3">
            {VAT_TREATMENT_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={vatTreatment === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, vatTreatment: option.id }))
                }
              />
            ))}
          </div>
        </section>
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
          Review Estimate
        </button>
      </div>
    </div>
  );
};

export default StepEstimateOptions;
