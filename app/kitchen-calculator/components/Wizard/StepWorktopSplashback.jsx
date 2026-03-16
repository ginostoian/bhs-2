"use client";

import React from "react";
import { SPLASHBACK_OPTIONS, WORKTOP_OPTIONS } from "../../lib/config";

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

export default function StepWorktopSplashback({
  formData,
  setFormData,
  onNext,
  onBack,
}) {
  const canProceed = !!formData.worktopType && !!formData.splashbackType;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Surfaces
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Pick the main surface materials
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          Worktops and splashbacks often swing budgets sharply, especially once
          fabrication and templating are involved.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Worktop type
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {WORKTOP_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.worktopType === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, worktopType: option.id }))
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Splashback type
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {SPLASHBACK_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.splashbackType === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, splashbackType: option.id }))
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
