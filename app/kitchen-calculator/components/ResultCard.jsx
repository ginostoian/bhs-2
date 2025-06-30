"use client";

import React from "react";
import Link from "next/link";

const ResultCard = ({
  calculationResult,
  formData,
  onRecalculate,
  onModifySelections,
}) => {
  const formatCurrency = (amount) => {
    if (!amount || isNaN(amount)) return "£0";
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getKitchenTypeName = (id) => {
    const types = {
      prebuilt: "Pre-built Units",
      flatpack: "Flat Pack",
      custom: "Custom Made",
    };
    return types[id] || id;
  };

  const getWorktopTypeName = (id) => {
    const types = {
      stone: "Stone",
      marble: "Marble",
      wood: "Wood",
      mdf: "MDF",
      other: "Other",
    };
    return types[id] || id;
  };

  const getFlooringTypeName = (id) => {
    const types = {
      wood: "Wood",
      tiles: "Tiles",
      lvt: "LVT",
      other: "Other",
    };
    return types[id] || id;
  };

  // Safe calculation for kitchen renovation cost
  const getKitchenUnitsCost = () => {
    const breakdown = calculationResult?.breakdown || {};
    const adjustedCost = breakdown.adjustedCost || 0;
    const worktopCost = breakdown.worktopCost || 0;
    const splashbackCost = breakdown.splashbackCost || 0;
    const rewireCost = breakdown.rewireCost || 0;
    const boilerRelocationCost = breakdown.boilerRelocationCost || 0;

    return Math.max(
      0,
      adjustedCost -
        worktopCost -
        splashbackCost -
        rewireCost -
        boilerRelocationCost,
    );
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
          <h2 className="mb-2 text-3xl font-bold">
            Your Kitchen Renovation Cost Estimate
          </h2>
          <p className="text-blue-100">
            {formData.kitchenSize || 0} m² Kitchen -{" "}
            {getKitchenTypeName(formData.kitchenType)}
          </p>
          <p className="text-blue-100">
            {formData.address || "Address not provided"}
          </p>
        </div>

        {/* Main Cost Display */}
        <div className="p-6">
          <div className="mb-8 text-center">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {formatCurrency(calculationResult?.total)}
            </div>
            <p className="text-gray-600">Total estimated cost including VAT</p>
            <p className="mt-1 text-sm text-gray-500">
              {formatCurrency(calculationResult?.costPerSqm)} per square metre
            </p>
          </div>

          {/* Cost Breakdown */}
          <div className="mb-8 grid gap-6 md:grid-cols-2">
            <div className="rounded-lg bg-gray-50 p-4">
              <h3 className="mb-3 font-semibold text-gray-900">
                Cost Breakdown
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Kitchen Renovation:</span>
                  <span>{formatCurrency(getKitchenUnitsCost())}</span>
                </div>
                {calculationResult?.breakdown?.worktopCost > 0 && (
                  <div className="flex justify-between">
                    <span>
                      Worktop ({getWorktopTypeName(formData.worktopType)}):
                    </span>
                    <span>
                      {formatCurrency(calculationResult.breakdown.worktopCost)}
                    </span>
                  </div>
                )}
                {calculationResult?.breakdown?.splashbackCost > 0 && (
                  <div className="flex justify-between">
                    <span>Splashback:</span>
                    <span>
                      {formatCurrency(
                        calculationResult.breakdown.splashbackCost,
                      )}
                    </span>
                  </div>
                )}
                {calculationResult?.breakdown?.flooringCost > 0 && (
                  <div className="flex justify-between">
                    <span>
                      Flooring ({getFlooringTypeName(formData.flooringType)}):
                    </span>
                    <span>
                      {formatCurrency(calculationResult.breakdown.flooringCost)}
                    </span>
                  </div>
                )}
                {calculationResult?.breakdown?.rewireCost > 0 && (
                  <div className="flex justify-between">
                    <span>Electrical Rewire:</span>
                    <span>
                      {formatCurrency(calculationResult.breakdown.rewireCost)}
                    </span>
                  </div>
                )}
                {calculationResult?.breakdown?.boilerRelocationCost > 0 && (
                  <div className="flex justify-between">
                    <span>Boiler Relocation:</span>
                    <span>
                      {formatCurrency(
                        calculationResult.breakdown.boilerRelocationCost,
                      )}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Contingency:</span>
                  <span>
                    {formatCurrency(calculationResult?.breakdown?.contingency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (20%):</span>
                  <span>
                    {formatCurrency(calculationResult?.breakdown?.vat)}
                  </span>
                </div>
                <div className="border-t pt-2 font-semibold">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{formatCurrency(calculationResult?.total)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-blue-50 p-4">
              <h3 className="mb-3 font-semibold text-blue-900">
                Project Timeline
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Estimated Duration:</span>
                  <span className="font-medium">3-6 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span>Planning & Design:</span>
                  <span>1-2 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span>Installation:</span>
                  <span>2-4 weeks</span>
                </div>
              </div>

              <div className="mt-4 rounded bg-blue-100 p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Timeline may vary based on kitchen size
                  and complexity.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Link
              href="/contact"
              className="flex items-center justify-center rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
            >
              Get Free Quote
            </Link>
            <button
              onClick={onModifySelections}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Modify Selections
            </button>
            <button
              onClick={onRecalculate}
              className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Start Over
            </button>
          </div>

          {/* Additional Info */}
          <div className="rounded-lg bg-gray-50 p-4">
            <h3 className="mb-3 font-semibold text-gray-900">
              What&apos;s Included
            </h3>
            <div className="grid gap-4 text-sm text-gray-600 md:grid-cols-2">
              <ul className="space-y-1">
                <li>• Kitchen units and installation</li>
                <li>• Worktop and splashback</li>
                <li>• Flooring materials and fitting</li>
                <li>• Electrical work (if required)</li>
              </ul>
              <ul className="space-y-1">
                <li>• Plumbing connections</li>
                <li>• Waste removal</li>
                <li>• Professional installation</li>
                <li>• VAT and contingency</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
