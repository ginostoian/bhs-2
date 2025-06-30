"use client";

import React from "react";

const StepKitchenSize = ({ formData, setFormData, onNext, onBack }) => {
  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9.]/g, "");
    setFormData((prev) => ({ ...prev, kitchenSize: value }));
  };

  const canProceed = Number(formData.kitchenSize) > 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Kitchen Size</h2>
        <p className="text-lg text-gray-600">
          Please enter the approximate size of your kitchen in square meters
          (sqm).
        </p>
      </div>
      <div className="mb-8">
        <input
          type="number"
          min="1"
          step="0.1"
          value={formData.kitchenSize}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-base focus:border-blue-500 focus:outline-none"
          placeholder="e.g. 15"
        />
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

export default StepKitchenSize;
