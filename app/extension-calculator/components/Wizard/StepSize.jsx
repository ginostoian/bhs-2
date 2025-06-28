"use client";

import React from "react";
import { COMPLEXITY_FACTORS } from "../../lib/config";

const StepSize = ({ formData, setFormData, onNext, onBack }) => {
  const handleSizeChange = (e) => {
    const size = parseInt(e.target.value) || 0;
    setFormData((prev) => ({ ...prev, size }));
  };

  const handleComplexityChange = (complexity) => {
    setFormData((prev) => ({ ...prev, complexity }));
  };

  const canProceed = formData.size > 0 && formData.complexity;

  // Get size category for display
  const getSizeCategory = (size) => {
    if (size <= 20) return "Small";
    if (size <= 40) return "Medium";
    if (size <= 100) return "Large";
    return "Extra Large";
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          How big is your extension?
        </h2>
        <p className="text-lg text-gray-600">
          Tell us the size and complexity of your project
        </p>
      </div>

      <div className="space-y-8">
        {/* Size Input */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            What&apos;s the size of your extension?
          </h3>
          <div className="space-y-4">
            <div>
              <label
                htmlFor="size"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Size in square metres
              </label>
              <div className="relative">
                <input
                  type="number"
                  id="size"
                  value={formData.size || ""}
                  onChange={handleSizeChange}
                  min="1"
                  max="200"
                  className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-blue-500 focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., 25"
                />
                <div className="absolute right-3 top-3 text-gray-500">m²</div>
              </div>
            </div>

            {formData.size > 0 && (
              <div className="rounded-lg bg-blue-50 p-4">
                <p className="text-sm text-blue-800">
                  <strong>Size Category:</strong>{" "}
                  {getSizeCategory(formData.size)}({formData.size} m²)
                </p>
                <p className="mt-1 text-xs text-blue-600">
                  {formData.size <= 20 &&
                    "Small extensions are great for adding a utility room or small kitchen extension"}
                  {formData.size > 20 &&
                    formData.size <= 40 &&
                    "Medium extensions are perfect for kitchen-diners or additional living space"}
                  {formData.size > 40 &&
                    formData.size <= 100 &&
                    "Large extensions can accommodate multiple rooms and significant living space"}
                  {formData.size > 100 &&
                    "Extra large extensions are substantial projects that can transform your home"}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Complexity Selection */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            How complex is your project?
          </h3>
          <div className="grid gap-4">
            {COMPLEXITY_FACTORS.map((complexity) => (
              <div
                key={complexity.id}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.complexity === complexity.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleComplexityChange(complexity.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.complexity === complexity.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.complexity === complexity.id && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {complexity.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {complexity.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-between">
        <button
          onClick={onBack}
          className="rounded-lg bg-gray-100 px-6 py-3 font-medium text-gray-700 transition-colors hover:bg-gray-200"
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

export default StepSize;
