"use client";

import React from "react";

const HEATING_TYPES = [
  {
    id: "Gas Radiator",
    name: "Gas Radiator",
    description:
      "Connected to central heating system, cost-effective for whole house",
    icon: "🔥",
    pros: [
      "Lower running costs",
      "Whole house heating",
      "Consistent temperature",
    ],
    cons: ["Requires plumbing", "Boiler dependency", "Installation complexity"],
  },
  {
    id: "Electric Radiator",
    name: "Electric Radiator",
    description:
      "Independent heating unit, easy installation, perfect for individual rooms",
    icon: "⚡",
    pros: ["Easy installation", "Independent control", "No plumbing required"],
    cons: [
      "Higher running costs",
      "Limited to single room",
      "Electricity dependency",
    ],
  },
  {
    id: "Underfloor Heating",
    name: "Underfloor Heating",
    description: "Heated floor system, even heat distribution, luxury comfort",
    icon: "🌡️",
    pros: ["Even heat distribution", "Space saving", "Luxury comfort"],
    cons: [
      "Expensive installation",
      "Floor height increase",
      "Complex retrofitting",
    ],
  },
];

const StepHeatingType = ({ formData, setFormData, onNext, onBack }) => {
  const handleHeatingTypeChange = (heatingType) => {
    setFormData((prev) => ({ ...prev, heatingType }));
  };

  const canProceed = formData.heatingType;

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">Heating Type</h2>
        <p className="text-lg text-gray-600">
          Choose your preferred heating system type
        </p>
      </div>

      <div className="space-y-6">
        {HEATING_TYPES.map((type) => (
          <div
            key={type.id}
            className={`cursor-pointer rounded-lg border-2 p-6 transition-all ${
              formData.heatingType === type.id
                ? "border-blue-500 bg-blue-50"
                : "border-gray-200 hover:border-gray-300"
            }`}
            onClick={() => handleHeatingTypeChange(type.id)}
          >
            <div className="flex items-start">
              <div
                className={`mr-4 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                  formData.heatingType === type.id
                    ? "border-blue-500 bg-blue-500"
                    : "border-gray-300"
                }`}
              >
                {formData.heatingType === type.id && (
                  <div className="h-2 w-2 rounded-full bg-white"></div>
                )}
              </div>
              <div className="flex-1">
                <div className="mb-2 flex items-center">
                  <span className="mr-3 text-3xl">{type.icon}</span>
                  <div>
                    <h4 className="text-lg font-medium text-gray-900">
                      {type.name}
                    </h4>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </div>
                </div>

                {/* Pros and Cons */}
                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  <div>
                    <h5 className="mb-2 text-sm font-medium text-green-700">
                      ✅ Advantages
                    </h5>
                    <ul className="space-y-1">
                      {type.pros.map((pro, index) => (
                        <li key={index} className="text-xs text-green-600">
                          • {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h5 className="mb-2 text-sm font-medium text-red-700">
                      ⚠️ Considerations
                    </h5>
                    <ul className="space-y-1">
                      {type.cons.map((con, index) => (
                        <li key={index} className="text-xs text-red-600">
                          • {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Heating Type Comparison */}
      <div className="mt-8 rounded-lg bg-gray-50 p-6">
        <h4 className="mb-4 font-semibold text-gray-900">
          💡 Heating Type Comparison
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="pb-2 text-left font-medium text-gray-700">
                  Feature
                </th>
                <th className="pb-2 text-center font-medium text-gray-700">
                  Gas Radiator
                </th>
                <th className="pb-2 text-center font-medium text-gray-700">
                  Electric Radiator
                </th>
                <th className="pb-2 text-center font-medium text-gray-700">
                  Underfloor
                </th>
              </tr>
            </thead>
            <tbody className="space-y-2">
              <tr className="border-b border-gray-100">
                <td className="py-2 font-medium text-gray-700">
                  Installation Cost
                </td>
                <td className="py-2 text-center text-gray-600">Medium</td>
                <td className="py-2 text-center text-gray-600">Low</td>
                <td className="py-2 text-center text-gray-600">High</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-medium text-gray-700">Running Cost</td>
                <td className="py-2 text-center text-gray-600">Low</td>
                <td className="py-2 text-center text-gray-600">High</td>
                <td className="py-2 text-center text-gray-600">Medium</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-medium text-gray-700">
                  Installation Time
                </td>
                <td className="py-2 text-center text-gray-600">2-3 days</td>
                <td className="py-2 text-center text-gray-600">1 day</td>
                <td className="py-2 text-center text-gray-600">1-2 weeks</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-gray-700">
                  Heat Distribution
                </td>
                <td className="py-2 text-center text-gray-600">Good</td>
                <td className="py-2 text-center text-gray-600">Good</td>
                <td className="py-2 text-center text-gray-600">Excellent</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Professional Advice */}
      <div className="mt-6 rounded-lg bg-blue-50 p-4">
        <h4 className="mb-2 font-semibold text-blue-900">
          🏠 Professional Advice
        </h4>
        <p className="text-sm text-blue-800">
          Not sure which heating type is best for your home? Our heating
          specialists can assess your property and recommend the most suitable
          and cost-effective heating solution for your specific needs.
        </p>
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

export default StepHeatingType;
