"use client";

import React from "react";
import { HOUSE_TYPES, FLOOR_OPTIONS } from "../../lib/config";

const StepHouseDetails = ({ formData, setFormData, onNext, onBack }) => {
  const handleHouseTypeChange = (houseType) => {
    setFormData((prev) => ({ ...prev, houseType }));
  };

  const handleFloorChange = (floor) => {
    setFormData((prev) => ({ ...prev, floor }));
  };

  const handleHouseSizeChange = (e) => {
    const size = parseInt(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, houseSize: size }));
  };

  const isFlat =
    formData.propertyType === "flat" || formData.propertyType === "maisonette";
  const canProceed =
    formData.houseType && formData.houseSize > 0 && (!isFlat || formData.floor);

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">House Details</h2>
        <p className="text-lg text-gray-600">
          Tell us about your house type and size
        </p>
      </div>

      <div className="space-y-8">
        {/* House Type Selection */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            What type of house is it?
          </h3>
          <div className="grid gap-4">
            {HOUSE_TYPES.map((houseType) => (
              <div
                key={houseType.id}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.houseType === houseType.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleHouseTypeChange(houseType.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.houseType === houseType.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.houseType === houseType.id && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {houseType.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {houseType.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floor Selection (only for flats) */}
        {isFlat && (
          <div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Which floor is your flat on?
            </h3>
            <div className="grid gap-4">
              {FLOOR_OPTIONS.map((floor) => (
                <div
                  key={floor.id}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    formData.floor === floor.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleFloorChange(floor.id)}
                >
                  <div className="flex items-start">
                    <div
                      className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        formData.floor === floor.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.floor === floor.id && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {floor.name}
                      </h4>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* House Size Input */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            What is the approximate size of your house?
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="houseSize"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Total floor area in square meters
              </label>
              <input
                type="number"
                id="houseSize"
                value={formData.houseSize || ""}
                onChange={handleHouseSizeChange}
                placeholder="e.g., 120"
                min="20"
                max="1000"
                className="w-full rounded-lg border border-gray-300 px-4 py-3 text-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-200"
              />
            </div>
            <div className="text-sm text-gray-600">
              <p>
                💡 Tip: You can find this information on your property deeds or
                by measuring each room.
              </p>
              <p>
                Typical sizes: 1-bed flat (40-60m²), 2-bed house (70-90m²),
                3-bed house (100-130m²)
              </p>
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

export default StepHouseDetails;
