"use client";

import React from "react";

const StepRenovationScope = ({ formData, setFormData, onNext, onBack }) => {
  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const canProceed =
    formData.renovateBathrooms ||
    formData.renovateKitchen ||
    formData.renovateBedrooms;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Renovation Scope
        </h2>
        <p className="text-lg text-gray-600">
          Which rooms are you planning to renovate?
        </p>
      </div>

      <div className="space-y-8">
        {/* Room Renovation Selection */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Select the rooms you want to renovate:
          </h3>
          <div className="space-y-4">
            {/* Bathrooms */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.renovateBathrooms
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("renovateBathrooms")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.renovateBathrooms
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.renovateBathrooms && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Bathrooms ({formData.bathrooms}{" "}
                    {formData.bathrooms === 1 ? "bathroom" : "bathrooms"})
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Full bathroom renovation including fixtures, tiling, and
                    plumbing
                  </p>
                </div>
              </div>
            </div>

            {/* Kitchen */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.renovateKitchen
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("renovateKitchen")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.renovateKitchen
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.renovateKitchen && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Kitchen ({formData.kitchens}{" "}
                    {formData.kitchens === 1 ? "kitchen" : "kitchens"})
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Complete kitchen renovation including cabinets, worktops,
                    and appliances
                  </p>
                </div>
              </div>
            </div>

            {/* Bedrooms */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.renovateBedrooms
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("renovateBedrooms")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.renovateBedrooms
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.renovateBedrooms && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Bedrooms ({formData.bedrooms}{" "}
                    {formData.bedrooms === 1 ? "bedroom" : "bedrooms"})
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Bedroom renovation including flooring, painting, and storage
                    solutions
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wallpaper Question */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Are the walls currently wallpapered?
          </h3>
          <div className="space-y-4">
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.wallpapered
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("wallpapered")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.wallpapered
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.wallpapered && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Yes, walls are wallpapered
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    This will add wallpaper removal costs to your estimate
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-blue-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-blue-900">
            🏠 Renovation Summary
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            {formData.renovateBathrooms && (
              <p>
                • {formData.bathrooms}{" "}
                {formData.bathrooms === 1 ? "Bathroom" : "Bathrooms"}
              </p>
            )}
            {formData.renovateKitchen && (
              <p>
                • {formData.kitchens}{" "}
                {formData.kitchens === 1 ? "Kitchen" : "Kitchens"}
              </p>
            )}
            {formData.renovateBedrooms && (
              <p>
                • {formData.bedrooms}{" "}
                {formData.bedrooms === 1 ? "Bedroom" : "Bedrooms"}
              </p>
            )}
            {formData.wallpapered && <p>• Wallpaper removal required</p>}
            {!formData.renovateBathrooms &&
              !formData.renovateKitchen &&
              !formData.renovateBedrooms && (
                <p>• No rooms selected for renovation</p>
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

export default StepRenovationScope;
