"use client";

import React from "react";

const FLOORING_TYPES = [
  { id: "wood", name: "Wood" },
  { id: "tiles", name: "Tiles" },
  { id: "lvt", name: "LVT (Luxury Vinyl Tile)" },
  { id: "other", name: "Other" },
];

const StepFlooring = ({ formData, setFormData, onNext, onBack }) => {
  const handleSelect = (flooringType) => {
    setFormData((prev) => ({ ...prev, flooringType }));
  };
  const canProceed = !!formData.flooringType;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Kitchen Flooring
        </h2>
        <p className="text-lg text-gray-600">
          What type of flooring do you want in your kitchen?
        </p>
      </div>
      <div className="mb-8 grid gap-4">
        {FLOORING_TYPES.map((type) => (
          <div
            key={type.id}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              formData.flooringType === type.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleSelect(type.id)}
          >
            <div className="flex items-center">
              <div
                className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  formData.flooringType === type.id
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {formData.flooringType === type.id && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <span className="font-medium text-gray-900">{type.name}</span>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg bg-gray-200 px-6 py-3 font-medium text-gray-700 hover:bg-gray-300"
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

export default StepFlooring;
