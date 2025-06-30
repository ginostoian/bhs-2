"use client";

import React from "react";

const StepSystems = ({ formData, setFormData, onNext, onBack }) => {
  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const canProceed = true; // This step is optional

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Systems & Services
        </h2>
        <p className="text-lg text-gray-600">
          Do you need to update your electrical or heating systems?
        </p>
      </div>

      <div className="space-y-8">
        {/* Electrical Rewiring */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Do you need to rewire the house?
          </h3>
          <div className="space-y-4">
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.rewire
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("rewire")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.rewire
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.rewire && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Yes, full house rewire needed
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Complete electrical system upgrade including consumer unit,
                    sockets, and lighting
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Heating System */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Do you need to replace the heating system?
          </h3>
          <div className="space-y-4">
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.replaceHeating
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("replaceHeating")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.replaceHeating
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.replaceHeating && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Yes, replace heating system
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    New boiler, radiators, and heating controls
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Information about systems */}
        <div className="rounded-lg bg-blue-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-blue-900">
            ⚡ About Electrical & Heating Systems
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Rewiring:</strong> Recommended for properties over 25
              years old
            </p>
            <p>
              <strong>Heating:</strong> Modern boilers are more efficient and
              cost-effective
            </p>
            <p>
              <strong>Safety:</strong> Both systems must meet current building
              regulations
            </p>
            <p>
              <strong>Certification:</strong> Work must be carried out by
              qualified professionals
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-gray-900">
            📋 Systems Summary
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            {formData.rewire ? (
              <p>• Full house rewire planned</p>
            ) : (
              <p>• No electrical rewiring planned</p>
            )}
            {formData.replaceHeating ? (
              <p>• Heating system replacement planned</p>
            ) : (
              <p>• No heating system replacement planned</p>
            )}
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
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default StepSystems;
