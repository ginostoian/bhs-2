"use client";

import React from "react";

const StepElectricsPlumbing = ({ formData, setFormData, onNext, onBack }) => {
  const handleToggle = (field) => (value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };
  const canProceed =
    typeof formData.rewire === "boolean" &&
    typeof formData.relocateBoiler === "boolean";

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Electrics & Plumbing
        </h2>
        <p className="text-lg text-gray-600">
          Does your kitchen need a rewire or boiler relocation?
        </p>
      </div>
      <div className="mb-8 space-y-8">
        {/* Rewire */}
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            Does the kitchen need a rewire?
          </h3>
          <div className="flex gap-4">
            <button
              className={`rounded-lg px-6 py-3 font-medium transition-colors ${formData.rewire === true ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              onClick={() => handleToggle("rewire")(true)}
            >
              Yes
            </button>
            <button
              className={`rounded-lg px-6 py-3 font-medium transition-colors ${formData.rewire === false ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              onClick={() => handleToggle("rewire")(false)}
            >
              No
            </button>
          </div>
        </div>
        {/* Boiler relocation */}
        <div>
          <h3 className="mb-2 text-xl font-semibold text-gray-900">
            Does the boiler need to be relocated?
          </h3>
          <div className="flex gap-4">
            <button
              className={`rounded-lg px-6 py-3 font-medium transition-colors ${formData.relocateBoiler === true ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              onClick={() => handleToggle("relocateBoiler")(true)}
            >
              Yes
            </button>
            <button
              className={`rounded-lg px-6 py-3 font-medium transition-colors ${formData.relocateBoiler === false ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700 hover:bg-gray-300"}`}
              onClick={() => handleToggle("relocateBoiler")(false)}
            >
              No
            </button>
          </div>
        </div>
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

export default StepElectricsPlumbing;
