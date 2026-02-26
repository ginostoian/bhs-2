"use client";

import React from "react";
import {
  COMPLEXITY_FACTORS,
  FINISH_LEVELS,
  SITE_ACCESS_OPTIONS,
  GLAZING_LEVELS,
  DRAWINGS_STATUS_OPTIONS,
  PLANNING_STATUS_OPTIONS,
} from "../../lib/config";

const optionCard = (active) =>
  `rounded-xl border p-4 transition cursor-pointer ${
    active
      ? "border-slate-900 bg-slate-900 text-white shadow-md"
      : "border-stone-200 bg-white hover:border-stone-300"
  }`;

const OptionGrid = ({ title, options, selected, onSelect }) => (
  <section>
    <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
      {title}
    </h3>
    <div className="grid gap-3 md:grid-cols-2">
      {options.map((option) => {
        const isSelected = selected === option.id;
        return (
          <label key={option.id} className={optionCard(isSelected)}>
            <input
              type="radio"
              name={title}
              className="sr-only"
              checked={isSelected}
              onChange={() => onSelect(option.id)}
            />
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-semibold">{option.name}</div>
                <p
                  className={`mt-1 text-sm ${
                    isSelected ? "text-stone-200" : "text-stone-600"
                  }`}
                >
                  {option.description}
                </p>
              </div>
              <span
                className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                  isSelected
                    ? "border-white bg-white text-slate-900"
                    : "border-stone-300 text-transparent"
                }`}
                aria-hidden="true"
              >
                •
              </span>
            </div>
          </label>
        );
      })}
    </div>
  </section>
);

const StepSize = ({ formData, setFormData, onNext, onBack }) => {
  const setField = (field, value) =>
    setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setField("size", Number.isFinite(size) ? size : 0);
  };

  const canProceed =
    formData.size > 0 &&
    formData.complexity &&
    formData.finishLevel &&
    formData.siteAccess &&
    formData.glazingLevel &&
    formData.drawingsStatus &&
    formData.planningStatus;

  const getSizeMessage = (size) => {
    if (size <= 20) {
      return "Often utility/side-return/small rear extension scale. Small projects can cost more per m² because fixed setup costs are spread over fewer square metres.";
    }
    if (size <= 40) {
      return "Common kitchen-diner / rear extension size. This is where ballpark m² rates tend to align most closely with market examples.";
    }
    if (size <= 80) {
      return "Larger project with more economies of scale, but access/structure and glazing choices can still shift costs significantly.";
    }
    return "Substantial project. Budget risk usually increases without drawings, surveys, and a clear specification.";
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Scope and specification
        </h2>
        <p className="mt-2 text-stone-600">
          These are the biggest cost drivers homeowners can usually answer
          before drawings are complete.
        </p>
      </div>

      <div className="space-y-8">
        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            Extension Size
          </h3>

          <div className="grid gap-4 md:grid-cols-[1.2fr_1fr]">
            <div>
              <label
                htmlFor="size"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Approximate area (m²)
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="size"
                  value={formData.size || ""}
                  onChange={handleSizeChange}
                  min="1"
                  max="200"
                  placeholder="e.g. 25"
                  className="w-full rounded-xl border border-stone-300 px-4 py-3 pr-14 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
                />
                <span className="pointer-events-none absolute right-4 top-3.5 text-sm text-stone-500">
                  m²
                </span>
              </div>
              <p className="mt-2 text-xs text-stone-500">
                Use the extension floor area. For double-storey projects, enter
                the total added area across both floors if known.
              </p>
            </div>

            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-900">
                Sizing tip
              </p>
              <p className="mt-2 text-sm text-stone-600">
                If you only know rough dimensions, multiply width x depth and
                round to the nearest square metre.
              </p>
            </div>
          </div>

          {formData.size > 0 && (
            <div className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-4">
              <p className="text-sm font-medium text-blue-900">
                Size guidance for {formData.size} m²
              </p>
              <p className="mt-1 text-sm text-blue-800">
                {getSizeMessage(formData.size)}
              </p>
            </div>
          )}
        </section>

        <OptionGrid
          title="Build Complexity"
          options={COMPLEXITY_FACTORS}
          selected={formData.complexity}
          onSelect={(value) => setField("complexity", value)}
        />

        <OptionGrid
          title="Finish Level"
          options={FINISH_LEVELS}
          selected={formData.finishLevel}
          onSelect={(value) => setField("finishLevel", value)}
        />

        <OptionGrid
          title="Site Access"
          options={SITE_ACCESS_OPTIONS}
          selected={formData.siteAccess}
          onSelect={(value) => setField("siteAccess", value)}
        />

        <OptionGrid
          title="Glazing Level"
          options={GLAZING_LEVELS}
          selected={formData.glazingLevel}
          onSelect={(value) => setField("glazingLevel", value)}
        />

        <OptionGrid
          title="Drawings Status"
          options={DRAWINGS_STATUS_OPTIONS}
          selected={formData.drawingsStatus}
          onSelect={(value) => setField("drawingsStatus", value)}
        />

        <OptionGrid
          title="Planning Status"
          options={PLANNING_STATUS_OPTIONS}
          selected={formData.planningStatus}
          onSelect={(value) => setField("planningStatus", value)}
        />
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
          disabled={!canProceed}
          className={`rounded-xl px-6 py-3 text-sm font-semibold tracking-wide transition ${
            canProceed
              ? "bg-slate-900 text-white hover:bg-black"
              : "cursor-not-allowed bg-stone-200 text-stone-400"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepSize;
