"use client";

import React from "react";
import {
  LONDON_ZONES,
  PROPERTY_TYPES,
  REGION_OPTIONS,
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

export default function StepProperty({ formData, setFormData, onNext }) {
  const canProceed = !!formData.propertyType && !!formData.region;

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
          Property Context
        </p>
        <h2 className="mt-2 text-3xl font-semibold tracking-tight text-stone-900">
          Start with the property and location
        </h2>
        <p className="mt-3 max-w-2xl text-base leading-relaxed text-stone-600">
          London remains the main pricing focus. Other UK regions are included
          as a budgeting benchmark so homeowners can still get a useful early
          estimate.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            What type of property is it?
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {PROPERTY_TYPES.map((property) => (
              <SelectCard
                key={property.id}
                checked={formData.propertyType === property.id}
                title={property.name}
                description={property.description}
                onChange={() =>
                  setFormData((prev) => ({ ...prev, propertyType: property.id }))
                }
              />
            ))}
          </div>
        </section>

        <section>
          <h3 className="mb-4 text-lg font-semibold text-stone-900">
            Where is the property?
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            {REGION_OPTIONS.map((region) => (
              <SelectCard
                key={region.id}
                checked={formData.region === region.id}
                title={region.name}
                description={region.description}
                onChange={() =>
                  setFormData((prev) => ({
                    ...prev,
                    region: region.id,
                    location: region.id === "london" ? prev.londonZone || "zone3" : region.id,
                    londonZone: region.id === "london" ? prev.londonZone || "zone3" : "",
                  }))
                }
              />
            ))}
          </div>
        </section>

        {formData.region === "london" && (
          <section>
            <h3 className="mb-4 text-lg font-semibold text-stone-900">
              Which London zone is closest?
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              {LONDON_ZONES.map((zone) => (
                <SelectCard
                  key={zone.id}
                  checked={formData.londonZone === zone.id}
                  title={zone.name}
                  description={zone.description}
                  onChange={() =>
                    setFormData((prev) => ({
                      ...prev,
                      londonZone: zone.id,
                      location: zone.id,
                    }))
                  }
                />
              ))}
            </div>
          </section>
        )}

        <section>
          <label
            htmlFor="postcode"
            className="mb-2 block text-sm font-medium text-stone-700"
          >
            Postcode (optional)
          </label>
          <input
            id="postcode"
            type="text"
            value={formData.postcode || ""}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, postcode: e.target.value.toUpperCase() }))
            }
            placeholder="e.g. N16 8XX"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-stone-900 outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
          />
          <p className="mt-2 text-sm text-stone-500">
            Useful for follow-up context. It does not need to be exact.
          </p>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
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
