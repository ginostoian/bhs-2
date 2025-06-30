"use client";

import React from "react";

const WORKTOP_TYPES = [
  { id: "stone", name: "Stone" },
  { id: "marble", name: "Marble" },
  { id: "wood", name: "Wood" },
  { id: "mdf", name: "MDF" },
  { id: "other", name: "Other" },
];

const SPLASHBACK_TYPES = [
  { id: "tiles", name: "Tiles" },
  { id: "glass", name: "Glass" },
  { id: "metal", name: "Metal" },
  { id: "other", name: "Other" },
];

const StepWorktopSplashback = ({ formData, setFormData, onNext, onBack }) => {
  const handleWorktopSelect = (worktopType) => {
    setFormData((prev) => ({ ...prev, worktopType }));
  };
  const handleSplashbackSelect = (splashbackType) => {
    setFormData((prev) => ({ ...prev, splashbackType }));
  };
  const canProceed = formData.worktopType && formData.splashbackType;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Worktop & Splashback
        </h2>
        <p className="text-lg text-gray-600">
          Select your preferred worktop and splashback materials.
        </p>
      </div>
      <div className="mb-8">
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Worktop Type
        </h3>
        <div className="mb-6 grid gap-4">
          {WORKTOP_TYPES.map((type) => (
            <div
              key={type.id}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.worktopType === type.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleWorktopSelect(type.id)}
            >
              <div className="flex items-center">
                <div
                  className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.worktopType === type.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.worktopType === type.id && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="font-medium text-gray-900">{type.name}</span>
              </div>
            </div>
          ))}
        </div>
        <h3 className="mb-4 text-xl font-semibold text-gray-900">
          Splashback Type
        </h3>
        <div className="grid gap-4">
          {SPLASHBACK_TYPES.map((type) => (
            <div
              key={type.id}
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.splashbackType === type.id
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSplashbackSelect(type.id)}
            >
              <div className="flex items-center">
                <div
                  className={`mr-3 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.splashbackType === type.id
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.splashbackType === type.id && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="font-medium text-gray-900">{type.name}</span>
              </div>
            </div>
          ))}
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

export default StepWorktopSplashback;
