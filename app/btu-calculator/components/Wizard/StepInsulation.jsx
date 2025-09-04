"use client";

import React from "react";

const INSULATION_LEVELS = [
  {
    id: "Excellent",
    name: "Excellent",
    description: "Modern insulation, double/triple glazing, well-sealed",
    icon: "🏠",
  },
  {
    id: "Good",
    name: "Good",
    description: "Some insulation, double glazing, reasonably sealed",
    icon: "🏡",
  },
  {
    id: "Average",
    name: "Average",
    description: "Basic insulation, some double glazing, average sealing",
    icon: "🏘️",
  },
  {
    id: "Poor",
    name: "Poor",
    description: "Minimal insulation, single glazing, drafty",
    icon: "🏚️",
  },
];

const StepInsulation = ({ formData, setFormData, onNext, onBack }) => {
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleInsulationChange = (insulationLevel) => {
    setFormData((prev) => ({ ...prev, insulationLevel }));
  };

  const canProceed =
    formData.insulationLevel &&
    formData.windowCount >= 0 &&
    formData.doorCount >= 0 &&
    formData.outsideWallCount >= 0;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Insulation & Openings
        </h2>
        <p className="text-lg text-gray-600">
          Tell us about your room&apos;s insulation and openings for accurate
          heat loss calculation
        </p>
      </div>

      <div className="space-y-8">
        {/* Insulation Level */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            How well insulated is your room?
          </h3>
          <div className="grid gap-3">
            {INSULATION_LEVELS.map((level) => (
              <div
                key={level.id}
                className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                  formData.insulationLevel === level.id
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleInsulationChange(level.id)}
              >
                <div className="flex items-start">
                  <div
                    className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                      formData.insulationLevel === level.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {formData.insulationLevel === level.id && (
                      <div className="h-2 w-2 rounded-full bg-white"></div>
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="mr-3 text-2xl">{level.icon}</span>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {level.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {level.description}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Windows and Doors */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Windows and Doors
          </h3>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Number of Windows
              </label>
              <input
                type="number"
                min="0"
                value={formData.windowCount || ""}
                onChange={(e) =>
                  handleInputChange(
                    "windowCount",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Include all windows in the room
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Number of Doors
              </label>
              <input
                type="number"
                min="0"
                value={formData.doorCount || ""}
                onChange={(e) =>
                  handleInputChange("doorCount", parseInt(e.target.value) || 0)
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Include all doors in the room
              </p>
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                External Walls
              </label>
              <input
                type="number"
                min="0"
                max="4"
                value={formData.outsideWallCount || ""}
                onChange={(e) =>
                  handleInputChange(
                    "outsideWallCount",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="0"
              />
              <p className="mt-1 text-xs text-gray-500">
                Walls facing outside (0-4)
              </p>
            </div>
          </div>
        </div>

        {/* Heat Loss Information */}
        <div className="rounded-lg bg-blue-50 p-4">
          <h4 className="mb-2 font-semibold text-blue-900">
            🔥 Heat Loss Factors
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Windows:</strong> Major source of heat loss, especially
              single glazing
            </p>
            <p>
              <strong>Doors:</strong> Can create drafts and heat loss
            </p>
            <p>
              <strong>External Walls:</strong> More external walls = more heat
              loss
            </p>
            <p>
              <strong>Insulation:</strong> Better insulation significantly
              reduces heat loss
            </p>
          </div>
        </div>

        {/* Insulation Tips */}
        <div className="rounded-lg bg-green-50 p-4">
          <h4 className="mb-2 font-semibold text-green-900">
            💡 Insulation Tips
          </h4>
          <ul className="space-y-1 text-sm text-green-800">
            <li>• Double glazing can reduce heat loss by 50%</li>
            <li>• Cavity wall insulation saves 15-20% on heating</li>
            <li>• Loft insulation prevents 25% of heat loss</li>
            <li>• Draught-proofing is a cost-effective improvement</li>
          </ul>
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

export default StepInsulation;
