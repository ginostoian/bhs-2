"use client";

import React from "react";
import { EXTENSION_TYPES } from "../../lib/config";
import { costEngine } from "../../lib/costEngine";

const StepType = ({ formData, setFormData, onNext, onBack }) => {
  const canProceed = !!formData.extensionType;
  const previewSize = formData.size > 0 ? formData.size : 25;

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Choose your project type
        </h2>
        <p className="mt-2 text-stone-600">
          We’ll use this to apply a different build rate, timeline, and risk
          profile. Example ranges below are for a typical {previewSize} m²
          London project and will update once you enter more details.
        </p>
      </div>

      <div className="grid gap-4">
        {EXTENSION_TYPES.map((extension) => {
          const selected = formData.extensionType === extension.id;
          const range = costEngine.getCostRange(extension.id, previewSize);

          return (
            <label
              key={extension.id}
              className={`cursor-pointer rounded-2xl border p-5 transition-all ${
                selected
                  ? "border-slate-900 bg-slate-900 text-white shadow-xl shadow-slate-900/10"
                  : "border-stone-200 bg-white hover:border-stone-300"
              }`}
            >
              <input
                type="radio"
                name="extensionType"
                value={extension.id}
                checked={selected}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, extensionType: extension.id }))
                }
                className="sr-only"
              />

              <div className="grid gap-4 md:grid-cols-[1.2fr_1fr] md:items-start">
                <div>
                  <div className="flex items-center gap-3">
                    <span
                      className={`inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                        selected
                          ? "border-white bg-white text-slate-900"
                          : "border-stone-300 text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      •
                    </span>
                    <h3 className="text-xl font-semibold">{extension.name}</h3>
                  </div>
                  <p
                    className={`mt-2 text-sm ${
                      selected ? "text-stone-200" : "text-stone-600"
                    }`}
                  >
                    {extension.description}
                  </p>
                </div>

                <div
                  className={`rounded-xl border p-4 ${
                    selected
                      ? "border-white/20 bg-white/10"
                      : "border-stone-200 bg-stone-50"
                  }`}
                >
                  <p
                    className={`text-xs font-semibold uppercase tracking-[0.18em] ${
                      selected ? "text-stone-200" : "text-stone-500"
                    }`}
                  >
                    Typical Range (Ballpark)
                  </p>
                  <p className="mt-2 text-lg font-semibold">
                    {costEngine.formatCurrency(range.min)} -{" "}
                    {costEngine.formatCurrency(range.max)}
                  </p>
                  <p
                    className={`mt-2 text-xs ${
                      selected ? "text-stone-200" : "text-stone-600"
                    }`}
                  >
                    Includes contingency + VAT assumptions. Final range narrows
                    once you add specs and planning status.
                  </p>
                </div>
              </div>
            </label>
          );
        })}
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

export default StepType;
