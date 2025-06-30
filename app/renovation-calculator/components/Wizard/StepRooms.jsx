"use client";

import React from "react";

const StepRooms = ({ formData, setFormData, onNext, onBack }) => {
  const handleRoomCountChange = (roomType, value) => {
    const count = parseInt(value) || 0;
    setFormData((prev) => ({ ...prev, [roomType]: count }));
  };

  const canProceed =
    formData.bedrooms > 0 && formData.bathrooms > 0 && formData.kitchens > 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Room Count</h2>
        <p className="text-lg text-gray-600">
          How many bedrooms, bathrooms, and kitchens does your property have?
        </p>
      </div>

      <div className="space-y-8">
        {/* Bedrooms */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            How many bedrooms do you have?
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="bedrooms"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Number of bedrooms
              </label>
              <input
                type="number"
                id="bedrooms"
                value={formData.bedrooms || ""}
                onChange={(e) =>
                  handleRoomCountChange("bedrooms", e.target.value)
                }
                placeholder="e.g., 3"
                min="1"
                max="10"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>
                💡 Include all bedrooms, including master bedroom, guest rooms,
                and study rooms.
              </p>
            </div>
          </div>
        </div>

        {/* Bathrooms */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            How many bathrooms do you have?
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="bathrooms"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Number of bathrooms
              </label>
              <input
                type="number"
                id="bathrooms"
                value={formData.bathrooms || ""}
                onChange={(e) =>
                  handleRoomCountChange("bathrooms", e.target.value)
                }
                placeholder="e.g., 2"
                min="1"
                max="8"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>
                💡 Include full bathrooms, en-suites, and shower rooms.
                Don&apos;t include separate toilets.
              </p>
            </div>
          </div>
        </div>

        {/* Kitchens */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            How many kitchens do you have?
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="kitchens"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Number of kitchens
              </label>
              <input
                type="number"
                id="kitchens"
                value={formData.kitchens || ""}
                onChange={(e) =>
                  handleRoomCountChange("kitchens", e.target.value)
                }
                placeholder="e.g., 1"
                min="1"
                max="3"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>
                💡 Most properties have 1 kitchen. Some larger properties may
                have a main kitchen and utility room.
              </p>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-blue-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-blue-900">
            📋 Room Summary
          </h4>
          <div className="grid grid-cols-3 gap-4 text-sm">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formData.bedrooms || 0}
              </div>
              <div className="text-blue-800">Bedrooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formData.bathrooms || 0}
              </div>
              <div className="text-blue-800">Bathrooms</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {formData.kitchens || 0}
              </div>
              <div className="text-blue-800">Kitchens</div>
            </div>
          </div>
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
          disabled={!canProceed}
          className={`rounded-lg px-6 py-3 font-medium transition-colors ${
            canProceed
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "cursor-not-allowed bg-gray-300 text-gray-500"
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepRooms;
