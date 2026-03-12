"use client";

import React from "react";
import { FLOOR_OPTIONS, HOUSE_STYLE_OPTIONS } from "../../lib/config";

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

function NumberField({ label, value, min = 0, max = 999, onChange, helper }) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-stone-700">{label}</label>
      <input
        type="number"
        min={min}
        max={max}
        value={value || ""}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
      />
      {helper && <p className="mt-2 text-sm text-stone-500">{helper}</p>}
    </div>
  );
}

export default function StepHouseDetails({
  formData,
  setFormData,
  onNext,
  onBack,
}) {
  const isFlat =
    formData.propertyType === "flat" || formData.propertyType === "maisonette";
  const canProceed =
    !!formData.houseStyle &&
    formData.houseSize >= 20 &&
    (!isFlat || !!formData.floor);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          House Details
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Give the calculator some structure
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          Older properties and flats usually carry extra cost risk, so this
          step helps the estimate reflect real-world London refurbishment work.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            What kind of building is it?
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {HOUSE_STYLE_OPTIONS.map((style) => (
              <SelectCard
                key={style.id}
                checked={formData.houseStyle === style.id}
                title={style.name}
                description={style.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, houseStyle: style.id }))
                }
              />
            ))}
          </div>
        </section>

        {isFlat && (
          <section>
            <h3 className="mb-4 text-lg font-semibold text-stone-900">
              Which floor is it on?
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {FLOOR_OPTIONS.map((floor) => (
                <SelectCard
                  key={floor.id}
                  checked={formData.floor === floor.id}
                  title={floor.name}
                  description="Used to reflect access, carry-in and waste logistics."
                  onChange={() =>
                    setFormData((prev) => ({ ...prev, floor: floor.id }))
                  }
                />
              ))}
            </div>
          </section>
        )}

        <section className="grid gap-5 md:grid-cols-2">
          <NumberField
            label="Approximate internal size (m²)"
            value={formData.houseSize}
            min={20}
            max={1000}
            onChange={(houseSize) => setFormData((prev) => ({ ...prev, houseSize }))}
            helper="If you only know it roughly, that is fine. Early estimates are still useful."
          />
          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-4 text-sm text-stone-600">
            <p className="font-semibold text-stone-900">Typical sizes</p>
            <p className="mt-2">1-bed flat: 40-60 m²</p>
            <p>2-bed house: 70-95 m²</p>
            <p>3-bed house: 95-130 m²</p>
            <p>4-bed house: 130-180 m²</p>
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            How many rooms does the property have?
          </h3>
          <div className="grid gap-5 md:grid-cols-2">
            <NumberField
              label="Bedrooms"
              value={formData.bedrooms}
              min={0}
              max={12}
              onChange={(bedrooms) => setFormData((prev) => ({ ...prev, bedrooms }))}
            />
            <NumberField
              label="Bathrooms / shower rooms"
              value={formData.bathrooms}
              min={0}
              max={8}
              onChange={(bathrooms) => setFormData((prev) => ({ ...prev, bathrooms }))}
            />
            <NumberField
              label="Kitchens"
              value={formData.kitchens}
              min={0}
              max={3}
              onChange={(kitchens) => setFormData((prev) => ({ ...prev, kitchens }))}
            />
            <NumberField
              label="Reception / living spaces"
              value={formData.receptionRooms}
              min={0}
              max={6}
              onChange={(receptionRooms) =>
                setFormData((prev) => ({ ...prev, receptionRooms }))
              }
            />
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
