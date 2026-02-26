"use client";

import React from "react";
import {
  ADDITIONAL_FEATURE_OPTIONS,
  PLANNING_SERVICE_OPTIONS,
} from "../../lib/config";

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

const StepExtras = ({ formData, setFormData, onNext, onBack }) => {
  const selectedFeatures = Array.isArray(formData.additionalFeatures)
    ? formData.additionalFeatures
    : [];

  const selectedFeatureMap = new Map(
    selectedFeatures
      .filter(Boolean)
      .map((item) =>
        typeof item === "string" ? [item, { id: item, quantity: 1 }] : [item.id, item],
      ),
  );

  const selectedPlanningServices = Array.isArray(formData.planningServices)
    ? formData.planningServices
    : [];

  const updateFeatures = (nextFeatures) => {
    setFormData((prev) => ({
      ...prev,
      additionalFeatures: nextFeatures,
    }));
  };

  const toggleFeature = (feature) => {
    const nextMap = new Map(selectedFeatureMap);
    if (nextMap.has(feature.id)) {
      nextMap.delete(feature.id);
    } else {
      const defaultQuantity =
        feature.unit === "per_m2"
          ? Math.min(
              feature.maxQuantity || 200,
              Math.max(
                feature.minQuantity || 1,
                prevSizeOrDefault(Number(formData.size) || 0, feature.defaultQuantity),
              ),
            )
          : feature.defaultQuantity || 1;
      nextMap.set(feature.id, {
        id: feature.id,
        quantity: defaultQuantity,
      });
    }
    updateFeatures([...nextMap.values()]);
  };

  const setFeatureQuantity = (feature, quantity) => {
    const nextMap = new Map(selectedFeatureMap);
    if (!nextMap.has(feature.id)) return;

    const min = feature.minQuantity || 1;
    const max = feature.maxQuantity || 999;
    const nextQty =
      feature.unit === "fixed"
        ? 1
        : Math.max(min, Math.min(max, Number(quantity) || min));

    nextMap.set(feature.id, {
      id: feature.id,
      quantity: nextQty,
    });
    updateFeatures([...nextMap.values()]);
  };

  const togglePlanningService = (serviceId) => {
    setFormData((prev) => ({
      ...prev,
      planningServices: prev.planningServices?.includes(serviceId)
        ? prev.planningServices.filter((id) => id !== serviceId)
        : [...(prev.planningServices || []), serviceId],
    }));
  };

  const selectedExtrasTotal = ADDITIONAL_FEATURE_OPTIONS.reduce((sum, feature) => {
    const selected = selectedFeatureMap.get(feature.id);
    if (!selected) return sum;
    const quantity = feature.unit === "fixed" ? 1 : Number(selected.quantity) || 1;
    return sum + feature.unitCost * quantity;
  }, 0);

  const selectedPlanningTotal = PLANNING_SERVICE_OPTIONS.reduce(
    (sum, service) =>
      selectedPlanningServices.includes(service.id) ? sum + service.cost : sum,
    0,
  );

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-8 rounded-2xl border border-stone-200 bg-gradient-to-br from-stone-50 to-white p-6">
        <h2 className="text-3xl font-semibold tracking-tight text-stone-900">
          Optional extras and fees
        </h2>
        <p className="mt-2 text-stone-600">
          Add only the items you know you want. If you skip planning/professional
          fees, the calculator will include a sensible allowance automatically
          based on your answers.
        </p>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_1fr]">
        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Extra Scope / Fit-out Items
            </h3>
            <div className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
              Selected: {formatCurrency(selectedExtrasTotal)}
            </div>
          </div>

          <div className="space-y-3">
            {ADDITIONAL_FEATURE_OPTIONS.map((feature) => {
              const selected = selectedFeatureMap.get(feature.id);
              const isSelected = !!selected;
              const quantity = selected?.quantity ?? feature.defaultQuantity ?? 1;
              const lineTotal = feature.unitCost * (feature.unit === "fixed" ? 1 : quantity);

              return (
                <div
                  key={feature.id}
                  className={`rounded-xl border p-4 transition ${
                    isSelected
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-stone-200 bg-white"
                  }`}
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={() => toggleFeature(feature)}
                        className="mt-1 h-4 w-4 rounded border-stone-300 text-slate-900 focus:ring-slate-900"
                      />
                      <div>
                        <div className="font-semibold">{feature.name}</div>
                        <p
                          className={`mt-1 text-sm ${
                            isSelected ? "text-stone-200" : "text-stone-600"
                          }`}
                        >
                          {feature.description}
                        </p>
                        <p
                          className={`mt-1 text-xs ${
                            isSelected ? "text-stone-300" : "text-stone-500"
                          }`}
                        >
                          {formatCurrency(feature.unitCost)}{" "}
                          {feature.unit === "fixed"
                            ? "fixed allowance"
                            : `per ${feature.unitLabel}`}
                        </p>
                      </div>
                    </label>

                    <div className="min-w-[220px]">
                      {isSelected ? (
                        <div className="rounded-lg border border-white/20 bg-white/10 p-3">
                          {feature.unit !== "fixed" && (
                            <div className="mb-3 flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() =>
                                  setFeatureQuantity(feature, Number(quantity) - 1)
                                }
                                className="h-8 w-8 rounded-lg border border-white/20 text-white transition hover:bg-white/10"
                                aria-label={`Decrease ${feature.name} quantity`}
                              >
                                -
                              </button>
                              <input
                                type="number"
                                min={feature.minQuantity || 1}
                                max={feature.maxQuantity || 999}
                                value={quantity}
                                onChange={(e) =>
                                  setFeatureQuantity(feature, e.target.value)
                                }
                                className="w-20 rounded-lg border border-white/20 bg-white/10 px-2 py-1 text-center text-white outline-none"
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setFeatureQuantity(feature, Number(quantity) + 1)
                                }
                                className="h-8 w-8 rounded-lg border border-white/20 text-white transition hover:bg-white/10"
                                aria-label={`Increase ${feature.name} quantity`}
                              >
                                +
                              </button>
                              <span className="text-xs text-stone-200">
                                {feature.unitLabel}
                              </span>
                            </div>
                          )}
                          <div className="text-sm font-semibold">
                            Line total: {formatCurrency(lineTotal)}
                          </div>
                        </div>
                      ) : (
                        <div className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-right text-sm font-medium text-stone-700">
                          {formatCurrency(feature.unitCost)}
                          <div className="text-xs font-normal text-stone-500">
                            {feature.unit === "fixed"
                              ? "typical allowance"
                              : `per ${feature.unitLabel}`}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <aside className="space-y-6">
          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                Planning & Professional Fees
              </h3>
              <div className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800">
                Selected: {formatCurrency(selectedPlanningTotal)}
              </div>
            </div>

            <p className="mb-4 text-sm text-stone-600">
              Select these if you already know what&apos;s needed. If you leave
              this blank, the calculator will apply a recommended allowance.
            </p>

            <div className="space-y-2">
              {PLANNING_SERVICE_OPTIONS.map((service) => {
                const checked = selectedPlanningServices.includes(service.id);
                return (
                  <label
                    key={service.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition ${
                      checked
                        ? "border-emerald-700 bg-emerald-900/95 text-white"
                        : "border-stone-200 bg-white hover:border-stone-300"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => togglePlanningService(service.id)}
                      className="mt-1 h-4 w-4 rounded border-stone-300 text-emerald-700 focus:ring-emerald-700"
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <div className="font-medium">{service.name}</div>
                          <p
                            className={`mt-1 text-xs ${
                              checked ? "text-stone-200" : "text-stone-600"
                            }`}
                          >
                            {service.description}
                          </p>
                        </div>
                        <div className="text-sm font-semibold">
                          {formatCurrency(service.cost)}
                        </div>
                      </div>
                      <p
                        className={`mt-1 text-[11px] uppercase tracking-wide ${
                          checked ? "text-stone-300" : "text-stone-500"
                        }`}
                      >
                        {service.category}
                      </p>
                    </div>
                  </label>
                );
              })}
            </div>
          </section>

          <section className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-900">
              Trust note
            </h4>
            <ul className="mt-3 space-y-2 text-sm text-amber-900">
              <li>We separate build cost from extras and fees.</li>
              <li>
                Quantity-based items (e.g. underfloor heating) are priced by m²
                or unit, not misleading flat amounts.
              </li>
              <li>
                You&apos;ll get a low/expected/high range because early budgets
                should reflect uncertainty.
              </li>
            </ul>
          </section>
        </aside>
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
          className="rounded-xl bg-slate-900 px-6 py-3 text-sm font-semibold tracking-wide text-white transition hover:bg-black"
        >
          Review Estimate
        </button>
      </div>
    </div>
  );
};

function prevSizeOrDefault(size, fallback) {
  return size > 0 ? size : fallback || 1;
}

export default StepExtras;
