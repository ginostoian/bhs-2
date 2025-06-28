"use client";

import React from "react";
import {
  PROPERTY_TYPES,
  EXTENSION_TYPES,
  LONDON_ZONES,
  COMPLEXITY_FACTORS,
} from "../../lib/config";

const StepFinish = ({ formData, onNext, onBack }) => {
  const getPropertyTypeName = (id) => {
    return PROPERTY_TYPES.find((p) => p.id === id)?.name || id;
  };

  const getExtensionTypeName = (id) => {
    return EXTENSION_TYPES.find((e) => e.id === id)?.name || id;
  };

  const getLocationName = (id) => {
    return LONDON_ZONES.find((l) => l.id === id)?.name || id;
  };

  const getComplexityName = (id) => {
    return COMPLEXITY_FACTORS.find((c) => c.id === id)?.name || id;
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Review your project details
        </h2>
        <p className="text-lg text-gray-600">
          Please review the information below before we calculate your cost
        </p>
      </div>

      <div className="space-y-6 rounded-lg bg-gray-50 p-6">
        {/* Property Details */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            Property Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Property Type:</span>
              <p className="font-medium">
                {getPropertyTypeName(formData.propertyType)}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Location:</span>
              <p className="font-medium">
                {getLocationName(formData.location)}
              </p>
            </div>
          </div>
        </div>

        {/* Extension Details */}
        <div>
          <h3 className="mb-3 text-lg font-semibold text-gray-900">
            Extension Details
          </h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Extension Type:</span>
              <p className="font-medium">
                {getExtensionTypeName(formData.extensionType)}
              </p>
            </div>
            <div>
              <span className="text-gray-600">Size:</span>
              <p className="font-medium">{formData.size} m²</p>
            </div>
            <div>
              <span className="text-gray-600">Complexity:</span>
              <p className="font-medium">
                {getComplexityName(formData.complexity)}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Features */}
        {formData.additionalFeatures &&
          formData.additionalFeatures.length > 0 && (
            <div>
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Additional Features
              </h3>
              <div className="space-y-2">
                {formData.additionalFeatures.map((feature, index) => (
                  <div key={index} className="flex items-center text-sm">
                    <div className="mr-3 h-2 w-2 rounded-full bg-blue-500"></div>
                    <span className="capitalize">
                      {feature.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

        {/* Planning Services */}
        {formData.planningServices && formData.planningServices.length > 0 && (
          <div>
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              Planning & Legal Services
            </h3>
            <div className="space-y-2">
              {formData.planningServices.map((service, index) => (
                <div key={index} className="flex items-center text-sm">
                  <div className="mr-3 h-2 w-2 rounded-full bg-green-500"></div>
                  <span className="capitalize">
                    {service.replace(/([A-Z])/g, " $1").trim()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Estimated Timeline */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h3 className="mb-2 text-lg font-semibold text-blue-900">
            Estimated Timeline
          </h3>
          <p className="text-blue-800">
            Based on your {formData.extensionType} extension of {formData.size}{" "}
            m², we estimate this project will take approximately{" "}
            <strong>8-16 weeks</strong> to complete.
          </p>
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
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white transition-colors hover:bg-blue-700"
        >
          Calculate My Cost
        </button>
      </div>
    </div>
  );
};

export default StepFinish;
