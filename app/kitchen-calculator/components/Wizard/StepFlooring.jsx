"use client";

import React from "react";
import { DECORATION_OPTIONS, FLOORING_OPTIONS } from "../../lib/config";

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

export default function StepFlooring({ formData, setFormData, onNext, onBack }) {
  const canProceed = !!formData.flooringType && !!formData.decorationLevel;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Flooring & Decoration
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Decide what happens to the floor and walls
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          Many kitchen budgets miss the floor finish and final decorating even
          though they are usually part of a complete installed project.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Flooring
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {FLOORING_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.flooringType === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, flooringType: option.id }))
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Decoration level
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {DECORATION_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.decorationLevel === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, decorationLevel: option.id }))
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
