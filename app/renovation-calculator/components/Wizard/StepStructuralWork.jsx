"use client";

import React from "react";

const StepStructuralWork = ({ formData, setFormData, onNext, onBack }) => {
  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const canProceed = true; // This step is optional

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Structural Work
        </h2>
        <p className="text-lg text-gray-600">
          Are you planning any structural changes to your property?
        </p>
      </div>

      <div className="space-y-8">
        {/* Wall Removal Question */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Are you planning to remove any walls?
          </h3>
          <div className="space-y-4">
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.removeWalls
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("removeWalls")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.removeWalls
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.removeWalls && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Yes, I want to remove walls
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    This includes non-load bearing walls and potentially
                    structural walls
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Structural Walls Question (conditional) */}
        {formData.removeWalls && (
          <div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              Are any of the walls you want to remove structural (load-bearing)?
            </h3>
            <div className="space-y-4">
              <div
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.structuralWalls
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleToggle("structuralWalls")}
              >
                <div className="flex items-start">
                  <div
                    className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.structuralWalls
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.structuralWalls && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Yes, some walls are structural
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      This will require structural engineering and steel beams
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Warning for structural work */}
            {formData.structuralWalls && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-amber-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-amber-800">
                      Important: Structural Work Required
                    </h3>
                    <div className="mt-2 text-sm text-amber-700">
                      <p>Removing structural walls requires:</p>
                      <ul className="mt-1 list-inside list-disc">
                        <li>Structural engineer assessment</li>
                        <li>Building regulations approval</li>
                        <li>Steel beam installation</li>
                        <li>Additional costs and timeline</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Information about structural work */}
        <div className="rounded-lg bg-blue-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-blue-900">
            🏗️ About Structural Work
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Non-load bearing walls:</strong> Can be removed without
              major structural work
            </p>
            <p>
              <strong>Load-bearing walls:</strong> Support the structure and
              require engineering
            </p>
            <p>
              <strong>Steel beams:</strong> Often needed to replace structural
              walls
            </p>
            <p>
              <strong>Building regulations:</strong> Required for structural
              changes
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-gray-900">
            📋 Structural Work Summary
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            {formData.removeWalls ? (
              <>
                <p>• Wall removal planned</p>
                {formData.structuralWalls && (
                  <p>
                    • Structural walls will be removed (requires engineering)
                  </p>
                )}
              </>
            ) : (
              <p>• No structural changes planned</p>
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

export default StepStructuralWork;
