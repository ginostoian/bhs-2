"use client";

import React from "react";
import { LAYOUT_OPTIONS } from "../../lib/config";

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

export default function StepKitchenSize({
  formData,
  setFormData,
  onNext,
  onBack,
}) {
  const canProceed = Number(formData.kitchenSize) >= 4 && !!formData.layoutType;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Size & Layout
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Tell us the kitchen size and shape
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          Installed kitchen cost is driven more by unit run length than floor
          area alone, so the layout matters as much as the square metres.
        </p>
      </div>

      <div className="space-y-8">
        <section className="grid gap-5 md:grid-cols-2">
          <div>
            <label
              htmlFor="kitchenSize"
              className="mb-2 block text-sm font-medium text-stone-700"
            >
              Approximate kitchen size (m²)
            </label>
            <input
              id="kitchenSize"
              type="number"
              min="4"
              step="0.5"
              value={formData.kitchenSize || ""}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  kitchenSize: Number(e.target.value) || 0,
                }))
              }
              placeholder="e.g. 12"
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
            />
          </div>
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
            <p className="font-semibold text-stone-900">Typical sizes</p>
            <p className="mt-2">Compact kitchen: 6-9 m²</p>
            <p>Family kitchen: 10-16 m²</p>
            <p>Large kitchen / diner: 17-25 m²</p>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Which layout is closest?
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {LAYOUT_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.layoutType === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, layoutType: option.id }))
                }
              />
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={!!formData.includeIsland}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, includeIsland: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-stone-300 text-slate-900 focus:ring-slate-900"
            />
            <span>
              <span className="block font-semibold text-stone-900">
                Include an island / peninsula allowance
              </span>
              <span className="mt-1 block text-sm text-stone-600">
                Adds cabinetry, worktop and install complexity.
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
