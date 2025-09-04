"use client";

import React from "react";

const StepFinish = ({ formData, onNext, onBack }) => {
  const roomArea = formData.roomLength * formData.roomWidth;
  const roomVolume = roomArea * formData.roomHeight;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Review Your Details
        </h2>
        <p className="text-lg text-gray-600">
          Please review your information before calculating your BTU
          requirements
        </p>
      </div>

      <div className="space-y-6">
        {/* Room Details Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Room Details
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Length:</span>
                <span className="font-medium">{formData.roomLength}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Width:</span>
                <span className="font-medium">{formData.roomWidth}m</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Height:</span>
                <span className="font-medium">{formData.roomHeight}m</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Room Type:</span>
                <span className="font-medium">{formData.roomType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Area:</span>
                <span className="font-medium">{roomArea.toFixed(1)} m²</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Volume:</span>
                <span className="font-medium">{roomVolume.toFixed(1)} m³</span>
              </div>
            </div>
          </div>
        </div>

        {/* Insulation & Openings Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Insulation & Openings
          </h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Insulation Level:</span>
                <span className="font-medium">{formData.insulationLevel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Windows:</span>
                <span className="font-medium">{formData.windowCount}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Doors:</span>
                <span className="font-medium">{formData.doorCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">External Walls:</span>
                <span className="font-medium">{formData.outsideWallCount}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Heating Type Summary */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Heating System
          </h3>
          <div className="flex items-center">
            <span className="mr-3 text-2xl">
              {formData.heatingType === "Gas Radiator" && "🔥"}
              {formData.heatingType === "Electric Radiator" && "⚡"}
              {formData.heatingType === "Underfloor Heating" && "🌡️"}
            </span>
            <span className="text-lg font-medium">{formData.heatingType}</span>
          </div>
        </div>

        {/* Calculation Preview */}
        <div className="rounded-lg bg-blue-50 p-6">
          <h4 className="mb-3 font-semibold text-blue-900">
            🔥 BTU Calculation Preview
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              Based on your {roomArea.toFixed(1)}m²{" "}
              {formData.roomType.toLowerCase()} with{" "}
              {formData.insulationLevel.toLowerCase()} insulation, we&apos;ll
              calculate the optimal BTU output for your{" "}
              {formData.heatingType.toLowerCase()}.
            </p>
            <p>
              The calculation will consider heat loss through{" "}
              {formData.windowCount} windows, {formData.doorCount} doors, and{" "}
              {formData.outsideWallCount} external walls.
            </p>
          </div>
        </div>

        {/* Important Notes */}
        <div className="rounded-lg bg-yellow-50 p-6">
          <h4 className="mb-3 font-semibold text-yellow-900">
            ⚠️ Important Notes
          </h4>
          <ul className="space-y-2 text-sm text-yellow-800">
            <li>
              • BTU calculations are estimates based on standard conditions
            </li>
            <li>
              • Actual heating needs may vary due to specific room conditions
            </li>
            <li>
              • Consider adding 10-20% safety margin for optimal performance
            </li>
            <li>
              • Professional assessment recommended for complex installations
            </li>
            <li>
              • Local building regulations may apply to heating installations
            </li>
          </ul>
        </div>

        {/* Professional Consultation */}
        <div className="rounded-lg bg-green-50 p-6">
          <h4 className="mb-3 font-semibold text-green-900">
            🏠 Professional Consultation Available
          </h4>
          <p className="text-sm text-green-800">
            For complex heating requirements or if you&apos;re unsure about your
            BTU needs, our heating specialists offer professional consultations
            to ensure you get the perfect heating solution for your home.
          </p>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg border border-gray-300 bg-white px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-50"
        >
          Back
        </button>
        <button
          onClick={onNext}
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Calculate BTU Requirements
        </button>
      </div>
    </div>
  );
};

export default StepFinish;
