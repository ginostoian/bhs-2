"use client";

import React from "react";
import { STRUCTURAL_OPTIONS } from "../../lib/config";

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

export default function StepStructuralWork({
  formData,
  setFormData,
  onNext,
  onBack,
}) {
  const canProceed =
    formData.structuralLevel !== "loadBearing" || formData.wallRemovalCount > 0;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Structural Risk
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Add any layout or hidden-condition allowances
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          Structural work, steel, and hidden repair risk are where renovation
          budgets move fastest. If you are unsure, stay conservative.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Are you removing walls?
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {STRUCTURAL_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.structuralLevel === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    structuralLevel: option.id,
                    wallRemovalCount: option.id === "none" ? 0 : prev.wallRemovalCount,
                  }))
                }
              />
            ))}
          </div>
        </section>

        {formData.structuralLevel !== "none" && (
          <section>
            <label className="mb-2 block text-sm font-medium text-stone-700">
              Approximate number of openings / walls affected
            </label>
            <input
              type="number"
              min="1"
              max="8"
              value={formData.wallRemovalCount || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  wallRemovalCount: Number(e.target.value) || 0,
                }))
              }
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
            <p className="mt-2 text-sm text-stone-500">
              If you only plan to open up one kitchen / dining wall, enter `1`.
            </p>
          </section>
        )}

        <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={!!formData.dampAllowance}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, dampAllowance: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-stone-300 text-slate-900 focus:ring-slate-900"
            />
            <span>
              <span className="block font-semibold text-stone-900">
                Include a damp / hidden repair allowance
              </span>
              <span className="mt-1 block text-sm text-stone-600">
                Sensible for older London stock if floors, walls, or substructure
                may need remedial work once opened up.
              </span>
            </span>
          </label>
        </section>
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
          disabled={!canProceed}
          className={`rounded-2xl px-6 py-3 text-sm font-semibold transition ${
            canProceed
              ? "bg-slate-900 text-white hover:bg-black"
              : "cursor-not-allowed bg-stone-300 text-stone-500"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
}
