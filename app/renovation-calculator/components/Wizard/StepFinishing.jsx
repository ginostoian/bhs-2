"use client";

import React from "react";
import { FLOOR_TYPES } from "../../lib/config";

const StepFinishing = ({ formData, setFormData, onNext, onBack }) => {
  const handleToggle = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleFloorTypeChange = (floorType) => {
    setFormData((prev) => ({ ...prev, floorType }));
  };

  const canProceed = true; // This step is optional

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Finishing Touches
        </h2>
        <p className="text-lg text-gray-600">
          What finishing work do you need for walls, doors, and floors?
        </p>
      </div>

      <div className="space-y-8">
        {/* Wall and Ceiling Work */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Wall and Ceiling Finishing
          </h3>
          <div className="space-y-4">
            {/* Skim Walls */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.skimWalls
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("skimWalls")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.skimWalls
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.skimWalls && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Skim walls</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Apply a thin layer of plaster to create smooth walls
                  </p>
                </div>
              </div>
            </div>

            {/* Skim Ceilings */}
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.skimCeilings
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("skimCeilings")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.skimCeilings
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.skimCeilings && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Skim ceilings</h4>
                  <p className="mt-1 text-sm text-gray-600">
                    Apply a thin layer of plaster to create smooth ceilings
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Doors and Frames */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Are you replacing doors and frames?
          </h3>
          <div className="space-y-4">
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.replaceDoors
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("replaceDoors")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.replaceDoors
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.replaceDoors && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Yes, replace doors and frames
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    New internal doors, door frames, and external doors
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Flooring */}
        <div>
          <h3 className="mb-4 text-xl font-semibold text-gray-900">
            Are you replacing the floors?
          </h3>
          <div className="space-y-4">
            <div
              className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                formData.replaceFloors
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleToggle("replaceFloors")}
            >
              <div className="flex items-start">
                <div
                  className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                    formData.replaceFloors
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {formData.replaceFloors && (
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">
                    Yes, replace floors
                  </h4>
                  <p className="mt-1 text-sm text-gray-600">
                    New flooring throughout the property
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Floor Type Selection (conditional) */}
        {formData.replaceFloors && (
          <div>
            <h3 className="mb-4 text-xl font-semibold text-gray-900">
              What type of flooring do you want?
            </h3>
            <div className="grid gap-4">
              {FLOOR_TYPES.map((floorType) => (
                <div
                  key={floorType.id}
                  className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                    formData.floorType === floorType.id
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                  onClick={() => handleFloorTypeChange(floorType.id)}
                >
                  <div className="flex items-start">
                    <div
                      className={`mr-3 mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                        formData.floorType === floorType.id
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.floorType === floorType.id && (
                        <div className="h-2 w-2 rounded-full bg-white"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900">
                        {floorType.name}
                      </h4>
                      <p className="mt-1 text-sm text-gray-600">
                        {floorType.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Information about finishing work */}
        <div className="rounded-lg bg-blue-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-blue-900">
            🎨 About Finishing Work
          </h4>
          <div className="space-y-2 text-sm text-blue-800">
            <p>
              <strong>Skimming:</strong> Creates smooth surfaces for painting
            </p>
            <p>
              <strong>Doors:</strong> New doors improve security and aesthetics
            </p>
            <p>
              <strong>Flooring:</strong> Different materials have varying costs
              and durability
            </p>
            <p>
              <strong>Timeline:</strong> Finishing work is typically done last
            </p>
          </div>
        </div>

        {/* Summary */}
        <div className="rounded-lg bg-gray-50 p-6">
          <h4 className="mb-3 text-lg font-semibold text-gray-900">
            📋 Finishing Summary
          </h4>
          <div className="space-y-2 text-sm text-gray-700">
            {formData.skimWalls && <p>• Wall skimming planned</p>}
            {formData.skimCeilings && <p>• Ceiling skimming planned</p>}
            {formData.replaceDoors && (
              <p>• Door and frame replacement planned</p>
            )}
            {formData.replaceFloors ? (
              <p>
                • Floor replacement planned (
                {formData.floorType
                  ? FLOOR_TYPES.find((f) => f.id === formData.floorType)?.name
                  : "Type not selected"}
                )
              </p>
            ) : (
              <p>• No floor replacement planned</p>
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

export default StepFinishing;
