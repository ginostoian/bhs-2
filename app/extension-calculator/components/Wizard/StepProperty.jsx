"use client";

import React from "react";
import { PROPERTY_TYPES, REGIONS, LONDON_ZONES } from "../../lib/config";

const cardClass = (active) =>
  `rounded-2xl border p-4 transition-all ${
    active
      ? "border-slate-900 bg-slate-900 text-white shadow-lg shadow-slate-900/10"
      : "border-stone-200 bg-white hover:border-stone-300"
  }`;

const StepProperty = ({ formData, setFormData, onNext }) => {
  const setField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegionChange = (regionId) => {
    setFormData((prev) => {
      const next = { ...prev, region: regionId };
      if (regionId === "london") {
        next.londonZone = prev.londonZone || "zone3";
        next.location = next.londonZone;
      } else {
        next.londonZone = "";
        next.location = regionId;
      }
      return next;
    });
  };

  const handleLondonZoneChange = (zoneId) => {
    setFormData((prev) => ({
      ...prev,
      londonZone: zoneId,
      location: zoneId, // keep backward compatibility for legacy UI consumers
    }));
  };

  const canProceed =
    !!formData.propertyType &&
    !!formData.region &&
    (formData.region !== "london" || !!formData.londonZone);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Tell us about the property
        </h2>
        <p className="mt-2 text-stone-600">
          We use this to localise pricing and estimate realistic access/party
          wall allowances.
        </p>
      </div>

      <div className="space-y-8">
        <section>
          <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
            Property Type
          </h3>
          <div className="grid gap-3 md:grid-cols-2">
            {PROPERTY_TYPES.map((property) => {
              const checked = formData.propertyType === property.id;
              return (
                <label key={property.id} className={cardClass(checked)}>
                  <input
                    type="radio"
                    name="propertyType"
                    value={property.id}
                    checked={checked}
                    onChange={() => setField("propertyType", property.id)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{property.name}</div>
                      <p
                        className={`mt-1 text-sm ${
                          checked ? "text-stone-200" : "text-stone-600"
                        }`}
                      >
                        {property.description}
                      </p>
                    </div>
                    <span
                      className={`mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border ${
                        checked
                          ? "border-white bg-white text-slate-900"
                          : "border-stone-300 text-transparent"
                      }`}
                      aria-hidden="true"
                    >
                      •
                    </span>
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        <section>
          <div className="mb-3 flex items-center justify-between gap-3">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Region
            </h3>
            <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-900">
              London is our primary service area
            </span>
          </div>

          <div className="grid gap-3 md:grid-cols-2">
            {REGIONS.map((region) => {
              const checked = formData.region === region.id;
              return (
                <label key={region.id} className={cardClass(checked)}>
                  <input
                    type="radio"
                    name="region"
                    value={region.id}
                    checked={checked}
                    onChange={() => handleRegionChange(region.id)}
                    className="sr-only"
                  />
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold">{region.name}</div>
                      <p
                        className={`mt-1 text-sm ${
                          checked ? "text-stone-200" : "text-stone-600"
                        }`}
                      >
                        {region.description}
                      </p>
                    </div>
                    {region.id === "london" && (
                      <span
                        className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                          checked
                            ? "bg-white/20 text-white"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        Premium market
                      </span>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        </section>

        {formData.region === "london" && (
          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <h3 className="mb-3 text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              London Zone (Optional but recommended)
            </h3>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {LONDON_ZONES.map((zone) => (
                <label
                  key={zone.id}
                  className={`cursor-pointer rounded-xl border p-3 transition ${
                    formData.londonZone === zone.id
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-stone-200 hover:border-stone-300"
                  }`}
                >
                  <input
                    type="radio"
                    name="londonZone"
                    value={zone.id}
                    checked={formData.londonZone === zone.id}
                    onChange={() => handleLondonZoneChange(zone.id)}
                    className="sr-only"
                  />
                  <div className="font-medium">{zone.name}</div>
                  <div
                    className={`mt-1 text-xs ${
                      formData.londonZone === zone.id
                        ? "text-stone-200"
                        : "text-stone-600"
                    }`}
                  >
                    {zone.description}
                  </div>
                </label>
              ))}
            </div>
          </section>
        )}

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label
                htmlFor="postcode"
                className="mb-2 block text-sm font-medium text-stone-700"
              >
                Postcode (optional)
              </label>
              <input
                id="postcode"
                type="text"
                autoCapitalize="characters"
                placeholder="e.g. N8 8AA"
                value={formData.postcode || ""}
                onChange={(e) => setField("postcode", e.target.value.toUpperCase())}
                className="w-full rounded-xl border border-stone-300 px-4 py-3 text-stone-900 shadow-sm outline-none transition focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10"
              />
              <p className="mt-2 text-xs text-stone-500">
                Helps us refine local pricing later. You can skip this if
                you&apos;re only exploring.
              </p>
            </div>
            <div className="rounded-xl border border-stone-200 bg-stone-50 p-4">
              <p className="text-sm font-semibold text-stone-900">
                Accuracy note
              </p>
              <p className="mt-2 text-sm text-stone-600">
                This calculator is designed for early budgeting. We avoid asking
                specialist questions at this stage and widen the estimate range
                if plans are not ready yet.
              </p>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-8 flex justify-end">
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

export default StepProperty;
