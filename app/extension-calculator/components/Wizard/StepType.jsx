"use client";

import React from "react";
import { EXTENSION_TYPES } from "../../lib/config";

const StepType = ({ formData, setFormData, onNext, onBack }) => {
  const handleExtensionTypeChange = (extensionType) => {
    setFormData((prev) => ({ ...prev, extensionType }));
  };

  const canProceed = formData.extensionType;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          What type of extension are you planning?
        </h2>
        <p className="text-lg text-gray-600">
          Choose the type that best describes your project
        </p>
      </div>

      <div className="grid gap-6">
        {EXTENSION_TYPES.map((extension) => (
          <div
            key={extension.id}
            className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
              formData.extensionType === extension.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleExtensionTypeChange(extension.id)}
          >
            <div className="flex items-start">
              <div
                className={`mr-4 mt-0.5 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                  formData.extensionType === extension.id
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {formData.extensionType === extension.id && (
                  <div className="h-3 w-3 rounded-full bg-white"></div>
                )}
              </div>
              <div className="flex-1">
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {extension.name}
                </h3>
                <p className="mb-3 text-gray-600">{extension.description}</p>

                {/* Additional details based on extension type */}
                <div className="space-y-1 text-sm text-gray-500">
                  {extension.id === "singleStorey" && (
                    <>
                      <p>• Typically 8-12 weeks to complete</p>
                      <p>• Average cost: £2,500 per square metre</p>
                      <p>• Perfect for kitchen extensions, living rooms</p>
                    </>
                  )}
                  {extension.id === "doubleStorey" && (
                    <>
                      <p>• Typically 12-16 weeks to complete</p>
                      <p>• Average cost: £3,200 per square metre</p>
                      <p>• Great for adding bedrooms and living space</p>
                    </>
                  )}
                  {extension.id === "basement" && (
                    <>
                      <p>• Typically 16-20 weeks to complete</p>
                      <p>• Average cost: £4,500 per square metre</p>
                      <p>• Ideal for creating additional living space</p>
                    </>
                  )}
                  {extension.id === "loft" && (
                    <>
                      <p>• Typically 10-14 weeks to complete</p>
                      <p>• Average cost: £2,800 per square metre</p>
                      <p>• Perfect for adding bedrooms or home office</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
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

export default StepType;
