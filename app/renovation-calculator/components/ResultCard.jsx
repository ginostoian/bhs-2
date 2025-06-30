"use client";

import React from "react";
import Link from "next/link";
import PDFDownload from "./PDFDownload";

const ResultCard = ({
  calculationResult,
  formData,
  onRecalculate,
  onModifySelections,
}) => {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const getPropertyTypeName = (id) => {
    const types = {
      terraced: "Terraced House",
      semiDetached: "Semi-Detached House",
      detached: "Detached House",
      flat: "Flat/Apartment",
      maisonette: "Maisonette",
    };
    return types[id] || id;
  };

  const getHouseTypeName = (id) => {
    const types = {
      victorian: "Victorian",
      edwardian: "Edwardian",
      modern: "Modern",
      newBuild: "New Build",
      period: "Period Property",
    };
    return types[id] || id;
  };

  return (
    <div className="mx-auto max-w-4xl">
      <div className="overflow-hidden rounded-lg bg-white shadow-lg">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 text-white">
          <h2 className="mb-2 text-3xl font-bold">
            Your Renovation Cost Estimate
          </h2>
          <p className="text-blue-100">
            {getPropertyTypeName(formData.propertyType)} - {formData.houseSize}{" "}
            m²
          </p>
          <p className="text-blue-100">
            {getHouseTypeName(formData.houseType)}
          </p>
        </div>

        {/* Main Cost Display */}
        <div className="p-6">
          <div className="mb-8 text-center">
            <div className="mb-2 text-4xl font-bold text-gray-900">
              {formatCurrency(calculationResult.total)}
            </div>
            <p className="text-gray-600">Total estimated cost including VAT</p>
            <p className="mt-1 text-sm text-gray-500">
              {formatCurrency(calculationResult.costPerSqm)} per square metre
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
                  <span>Base Construction:</span>
                  <span>
                    {formatCurrency(calculationResult.breakdown.adjustedCost)}
                  </span>
                </div>
                {calculationResult.breakdown.wallpaperCost > 0 && (
                  <div className="flex justify-between">
                    <span>Wallpaper Removal:</span>
                    <span>
                      {formatCurrency(
                        calculationResult.breakdown.wallpaperCost,
                      )}
                    </span>
                  </div>
                )}
                {calculationResult.breakdown.structuralCost > 0 && (
                  <div className="flex justify-between">
                    <span>Structural Work:</span>
                    <span>
                      {formatCurrency(
                        calculationResult.breakdown.structuralCost,
                      )}
                    </span>
                  </div>
                )}
                {calculationResult.breakdown.electricalCost > 0 && (
                  <div className="flex justify-between">
                    <span>Electrical Work:</span>
                    <span>
                      {formatCurrency(
                        calculationResult.breakdown.electricalCost,
                      )}
                    </span>
                  </div>
                )}
                {calculationResult.breakdown.heatingCost > 0 && (
                  <div className="flex justify-between">
                    <span>Heating System:</span>
                    <span>
                      {formatCurrency(calculationResult.breakdown.heatingCost)}
                    </span>
                  </div>
                )}
                {calculationResult.breakdown.wallCeilingCost > 0 && (
                  <div className="flex justify-between">
                    <span>Wall & Ceiling Work:</span>
                    <span>
                      {formatCurrency(
                        calculationResult.breakdown.wallCeilingCost,
                      )}
                    </span>
                  </div>
                )}
                {calculationResult.breakdown.doorCost > 0 && (
                  <div className="flex justify-between">
                    <span>Doors & Frames:</span>
                    <span>
                      {formatCurrency(calculationResult.breakdown.doorCost)}
                    </span>
                  </div>
                )}
                {calculationResult.breakdown.flooringCost > 0 && (
                  <div className="flex justify-between">
                    <span>Flooring:</span>
                    <span>
                      {formatCurrency(calculationResult.breakdown.flooringCost)}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Contingency:</span>
                  <span>
                    {formatCurrency(calculationResult.breakdown.contingency)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>VAT (20%):</span>
                  <span>{formatCurrency(calculationResult.breakdown.vat)}</span>
                </div>
                <div className="border-t pt-2 font-semibold">
                  <div className="flex justify-between">
                    <span>Total:</span>
                    <span>{formatCurrency(calculationResult.total)}</span>
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
                  <span className="font-medium">4-12 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span>Planning Phase:</span>
                  <span>1-2 weeks</span>
                </div>
                <div className="flex justify-between">
                  <span>Construction:</span>
                  <span>3-10 weeks</span>
                </div>
              </div>

              <div className="mt-4 rounded bg-blue-100 p-3">
                <p className="text-xs text-blue-800">
                  <strong>Note:</strong> Timeline may vary based on scope and
                  complexity of work.
                </p>
              </div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="mb-6 grid gap-4 md:grid-cols-3">
            <Link
              href="/contact"
              className="rounded-lg bg-blue-600 px-6 py-3 text-center font-medium text-white transition-colors hover:bg-blue-700"
            >
              Get Free Consultation
            </Link>
            <button
              onClick={onRecalculate}
              className="rounded-lg border border-gray-300 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              Recalculate Cost
            </button>
            <button
              onClick={onModifySelections}
              className="rounded-lg border border-blue-300 px-6 py-3 font-medium text-blue-700 transition-colors hover:bg-blue-50"
            >
              Modify Selections
            </button>
          </div>

          {/* PDF Download Section */}
          <div className="mb-6">
            <PDFDownload
              calculationResult={calculationResult}
              formData={formData}
            />
          </div>

          {/* Additional Information */}
          <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4">
            <h4 className="mb-2 font-semibold text-yellow-800">
              Important Information
            </h4>
            <ul className="space-y-1 text-sm text-yellow-700">
              <li>• This is an estimate based on the information provided</li>
              <li>
                • Final cost may vary based on site survey and detailed design
              </li>
              <li>• Prices include VAT and typical planning costs</li>
              <li>
                • We offer free consultations to discuss your specific
                requirements
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResultCard;
