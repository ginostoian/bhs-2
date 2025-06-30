"use client";

import React from "react";

const KITCHEN_TYPES = [
  {
    id: "prebuilt",
    name: "Pre-built Units",
    description: "Factory-assembled kitchen units",
  },
  {
    id: "flatpack",
    name: "Flat Pack",
    description: "Self-assembly kitchen units",
  },
  {
    id: "custom",
    name: "Custom Made",
    description: "Bespoke kitchen, made to order",
  },
];

const StepKitchenType = ({ formData, setFormData, onNext, onBack }) => {
  const handleSelect = (kitchenType) => {
    setFormData((prev) => ({ ...prev, kitchenType }));
  };

  const canProceed = !!formData.kitchenType;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Kitchen Type</h2>
        <p className="text-lg text-gray-600">
          What type of kitchen are you planning?
        </p>
      </div>
      <div className="mb-8 grid gap-4">
        {KITCHEN_TYPES.map((type) => (
          <div
            key={type.id}
            className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
              formData.kitchenType === type.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleSelect(type.id)}
          >
            <div className="flex items-start">
              <div
                className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  formData.kitchenType === type.id
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {formData.kitchenType === type.id && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <div>
                <h4 className="font-medium text-gray-900">{type.name}</h4>
                <p className="mt-1 text-sm text-gray-600">{type.description}</p>
              </div>
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

export default StepKitchenType;
