"use client";

import React from "react";
import { PROPERTY_TYPES, LONDON_ZONES } from "../../lib/config";

const StepProperty = ({ formData, setFormData, onNext }) => {
  const handlePropertyTypeChange = (propertyType) => {
    setFormData((prev) => ({ ...prev, propertyType }));
  };

  const handleLocationChange = (location) => {
    setFormData((prev) => ({ ...prev, location }));
  };

  const canProceed = formData.propertyType && formData.location;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Tell us about your property
        </h2>
        <p className="text-lg text-gray-600">
          This helps us provide a more accurate cost estimate for your extension
        </p>
      </div>

      <div className="space-y-8">
        {/* Property Type Selection */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            What type of property do you have?
          </h3>
          <div className="grid gap-4">
            {PROPERTY_TYPES.map((property) => (
              <div
                key={property.id}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.propertyType === property.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handlePropertyTypeChange(property.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.propertyType === property.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.propertyType === property.id && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {property.name}
                    </h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {property.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Location Selection */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Where is your property located?
          </h3>
          <div className="grid gap-4">
            {LONDON_ZONES.map((zone) => (
              <div
                key={zone.id}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.location === zone.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleLocationChange(zone.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.location === zone.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.location === zone.id && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{zone.name}</h4>
                    <p className="mt-1 text-sm text-gray-600">
                      {zone.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 flex justify-end">
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

export default StepProperty;
