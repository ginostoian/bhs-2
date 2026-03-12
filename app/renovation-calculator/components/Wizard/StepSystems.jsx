"use client";

import React from "react";
import {
  HEATING_OPTIONS,
  PLUMBING_OPTIONS,
  REWIRE_OPTIONS,
} from "../../lib/config";

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

export default function StepSystems({ formData, setFormData, onNext, onBack }) {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Systems
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Add electrical, heating and plumbing upgrades
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          Whole-home service upgrades are usually one of the largest hidden
          costs in older refurbishments. This step prices them separately.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Electrical works
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {REWIRE_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.rewireLevel === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, rewireLevel: option.id }))
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Heating works
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {HEATING_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.heatingLevel === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, heatingLevel: option.id }))
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Plumbing works
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {PLUMBING_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.plumbingLevel === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, plumbingLevel: option.id }))
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
          className="rounded-2xl bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition hover:bg-black"
        >
          Continue
        </button>
      </div>
    </div>
  );
}
