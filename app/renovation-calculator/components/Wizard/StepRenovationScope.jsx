"use client";

import React from "react";
import {
  DRAWINGS_STATUS_OPTIONS,
  FINISH_LEVEL_OPTIONS,
  OCCUPANCY_OPTIONS,
  RENOVATION_LEVEL_OPTIONS,
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

export default function StepRenovationScope({
  formData,
  setFormData,
  onNext,
  onBack,
}) {
  const canProceed =
    !!formData.renovationLevel &&
    !!formData.finishLevel &&
    !!formData.occupancyStatus &&
    !!formData.drawingsStatus;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Scope Quality
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Define the refurbishment standard
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          These four choices help the calculator separate a cosmetic refresh
          from a genuine full-house refurbishment and also judge how wide the
          budget range needs to be.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Which scope best describes the project?
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {RENOVATION_LEVEL_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.renovationLevel === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, renovationLevel: option.id }))
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            What finish level are you aiming for?
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {FINISH_LEVEL_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.finishLevel === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, finishLevel: option.id }))
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Will the property be occupied during the works?
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            {OCCUPANCY_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.occupancyStatus === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, occupancyStatus: option.id }))
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            How defined is the scope today?
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {DRAWINGS_STATUS_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.drawingsStatus === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, drawingsStatus: option.id }))
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
