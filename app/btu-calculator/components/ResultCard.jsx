"use client";

import React from "react";

const ResultCard = ({
  calculationResult,
  formData,
  onRecalculate,
  onModifySelections,
}) => {
  if (!calculationResult) return null;

  const { totalBTU, radiatorRecommendations, costEstimate, adjustments } =
    calculationResult;

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-8 text-center">
        <h1 className="mb-4 text-4xl font-bold text-gray-900">
          Your BTU Calculation Results
        </h1>
        <p className="text-xl text-gray-600">
          Perfect heating solution for your {formData.roomType.toLowerCase()}
        </p>
      </div>

      {/* Main Result */}
      <div className="mb-8 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 p-8 text-white">
        <div className="text-center">
          <h2 className="mb-2 text-2xl font-semibold">
            Recommended BTU Output
          </h2>
          <div className="mb-2 text-6xl font-bold">
            {totalBTU.toLocaleString()}
          </div>
          <p className="text-blue-100">
            BTU (British Thermal Units) required for optimal heating
          </p>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Left Column - Radiator Recommendations */}
        <div className="space-y-6">
          {/* Radiator Options */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              🔥 Radiator Recommendations
            </h3>
            <div className="space-y-4">
              {radiatorRecommendations.map((option, index) => (
                <div
                  key={index}
                  className={`rounded-lg border-2 p-4 ${
                    index === 0
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 bg-gray-50"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium text-gray-900">{option.type}</h4>
                    {index === 0 && (
                      <span className="rounded-full bg-blue-500 px-2 py-1 text-xs text-white">
                        Recommended
                      </span>
                    )}
                  </div>
                  <p className="mb-2 text-sm text-gray-600">
                    {option.description}
                  </p>
                  <p className="text-xs text-gray-500">{option.placement}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Cost Estimate */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              💰 Cost Estimate
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Radiator Cost:</span>
                <span className="font-medium">
                  £{costEstimate.radiatorCost.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Installation:</span>
                <span className="font-medium">
                  £{costEstimate.installationCost.toLocaleString()}
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total Estimated Cost:</span>
                  <span className="text-blue-600">
                    £{costEstimate.totalCost.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
            <p className="mt-3 text-xs text-gray-500">
              *Costs are estimates and may vary based on specific requirements
              and location
            </p>
          </div>
        </div>

        {/* Right Column - Calculation Details */}
        <div className="space-y-6">
          {/* Room Summary */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              📏 Room Summary
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span className="font-medium">{formData.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Dimensions:</span>
                <span className="font-medium">
                  {formData.roomLength}m × {formData.roomWidth}m ×{" "}
                  {formData.roomHeight}m
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Area:</span>
                <span className="font-medium">
                  {calculationResult.roomArea.toFixed(1)} m²
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume:</span>
                <span className="font-medium">
                  {calculationResult.roomVolume.toFixed(1)} m³
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Heating Type:</span>
                <span className="font-medium">{formData.heatingType}</span>
              </div>
            </div>
          </div>

          {/* Calculation Breakdown */}
          <div className="rounded-lg bg-white p-6 shadow-lg">
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              🧮 Calculation Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Base BTU:</span>
                <span className="font-medium">
                  {calculationResult.baseBTU.toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type Factor:</span>
                <span className="font-medium">×{adjustments.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Insulation Factor:</span>
                <span className="font-medium">×{adjustments.insulation}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Windows Heat Loss:</span>
                <span className="font-medium">+{adjustments.windows} BTU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Doors Heat Loss:</span>
                <span className="font-medium">+{adjustments.doors} BTU</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">External Walls:</span>
                <span className="font-medium">
                  +{adjustments.externalWalls} BTU
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Occupancy:</span>
                <span className="font-medium">
                  +{adjustments.occupancy} BTU
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Appliances:</span>
                <span className="font-medium">
                  +{adjustments.appliances} BTU
                </span>
              </div>
              <div className="border-t pt-3">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total BTU:</span>
                  <span className="text-blue-600">
                    {totalBTU.toLocaleString()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="rounded-lg bg-green-50 p-6">
            <h3 className="mb-4 text-xl font-semibold text-green-900">
              🚀 Next Steps
            </h3>
            <ul className="space-y-2 text-sm text-green-800">
              <li>
                • Research radiators with {totalBTU.toLocaleString()} BTU output
              </li>
              <li>• Get quotes from heating specialists</li>
              <li>• Consider professional installation</li>
              <li>• Check local building regulations</li>
              <li>• Plan for any electrical or plumbing work</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:justify-center">
        <button
          onClick={onModifySelections}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Modify Selections
        </button>
        <button
          onClick={onRecalculate}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Calculate Another Room
        </button>
      </div>

      {/* Professional Consultation CTA */}
      <div className="mt-8 rounded-lg bg-blue-50 p-6 text-center">
        <h3 className="mb-2 text-xl font-semibold text-blue-900">
          Need Professional Help?
        </h3>
        <p className="mb-4 text-blue-800">
          Our heating specialists can help you choose the perfect radiators and
          handle the installation
        </p>
        <button className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700">
          Get Professional Consultation
        </button>
      </div>
    </div>
  );
};

export default ResultCard;
