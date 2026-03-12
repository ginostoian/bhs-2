"use client";

import React from "react";
import { COVERAGE_OPTIONS } from "../../lib/config";

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

function CountField({ label, value, max, onChange, helper }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">{label}</label>
      <input
        type="number"
        min="0"
        max={max}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
      {helper && <p className="mt-2 text-sm text-stone-500">{helper}</p>}
    </div>
  );
}

export default function StepRooms({ formData, setFormData, onNext, onBack }) {
  const canProceed = !!formData.coverageLevel;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Rooms & Coverage
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          How much of the home is actually being touched?
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          This is one of the biggest cost drivers. Then tell us which rooms are
          being fully refurbished so the calculator can add realistic kitchen,
          bathroom and bedroom allowances on top.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Broadly, how much of the property is affected?
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {COVERAGE_OPTIONS.map((option) => (
              <SelectCard
                key={option.id}
                checked={formData.coverageLevel === option.id}
                title={option.name}
                description={option.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, coverageLevel: option.id }))
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            How many rooms are being fully refurbished?
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <CountField
              label="Kitchens included"
              value={formData.renovateKitchenCount}
              max={formData.kitchens || 3}
              onChange={(renovateKitchenCount) =>
                setFormData((prev) => ({ ...prev, renovateKitchenCount }))
              }
              helper={`Total kitchens in property: ${formData.kitchens || 0}`}
            />
            <CountField
              label="Bathrooms included"
              value={formData.renovateBathroomCount}
              max={formData.bathrooms || 8}
              onChange={(renovateBathroomCount) =>
                setFormData((prev) => ({ ...prev, renovateBathroomCount }))
              }
              helper={`Total bathrooms in property: ${formData.bathrooms || 0}`}
            />
            <CountField
              label="Bedrooms included"
              value={formData.renovateBedroomCount}
              max={formData.bedrooms || 12}
              onChange={(renovateBedroomCount) =>
                setFormData((prev) => ({ ...prev, renovateBedroomCount }))
              }
              helper={`Total bedrooms in property: ${formData.bedrooms || 0}`}
            />
            <CountField
              label="Reception rooms included"
              value={formData.renovateReceptionCount}
              max={formData.receptionRooms || 6}
              onChange={(renovateReceptionCount) =>
                setFormData((prev) => ({ ...prev, renovateReceptionCount }))
              }
              helper={`Total reception rooms: ${formData.receptionRooms || 0}`}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              checked={!!formData.includeHallway}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, includeHallway: e.target.checked }))
              }
              className="mt-1 h-4 w-4 rounded border-stone-300 text-slate-900 focus:ring-slate-900"
            />
            <span>
              <span className="block font-semibold text-stone-900">
                Include hallway / stairs / landing
              </span>
              <span className="mt-1 block text-sm text-stone-600">
                Useful for whole-home refreshes where circulation areas are also
                being fully upgraded.
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
