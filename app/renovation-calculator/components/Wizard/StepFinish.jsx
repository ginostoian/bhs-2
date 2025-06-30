"use client";

import React from "react";
import {
  PROPERTY_TYPES,
  HOUSE_TYPES,
  LONDON_ZONES,
  FLOOR_TYPES,
} from "../../lib/config";

const StepFinish = ({ formData, onNext, onBack }) => {
  const getPropertyTypeName = (id) => {
    return PROPERTY_TYPES.find((p) => p.id === id)?.name || id;
  };

  const getHouseTypeName = (id) => {
    return HOUSE_TYPES.find((h) => h.id === id)?.name || id;
  };

  const getLocationName = (id) => {
    return LONDON_ZONES.find((l) => l.id === id)?.name || id;
  };

  const getFloorTypeName = (id) => {
    return FLOOR_TYPES.find((f) => f.id === id)?.name || "Not selected";
  };

  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Review Your Details
        </h2>
        <p className="text-lg text-gray-600">
          Please review your renovation project details before we calculate your
          estimate
        </p>
      </div>

      <div className="space-y-6">
        {/* Property Details */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            🏠 Property Details
          </h3>
          <div className="grid gap-3 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Property Type:</span>
              <span className="font-medium">
                {getPropertyTypeName(formData.propertyType)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Location:</span>
              <span className="font-medium">
                {getLocationName(formData.location)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">House Type:</span>
              <span className="font-medium">
                {getHouseTypeName(formData.houseType)}
              </span>
            </div>
            {(formData.propertyType === "flat" ||
              formData.propertyType === "maisonette") && (
              <div className="flex justify-between">
                <span className="text-gray-600">Floor:</span>
                <span className="font-medium">{formData.floor}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">House Size:</span>
              <span className="font-medium">{formData.houseSize}m²</span>
            </div>
          </div>
        </div>

        {/* Room Count */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            🏘️ Room Count
          </h3>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formData.bedrooms}
              </div>
              <div className="text-sm text-gray-600">Bedrooms</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formData.bathrooms}
              </div>
              <div className="text-sm text-gray-600">Bathrooms</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-600">
                {formData.kitchens}
              </div>
              <div className="text-sm text-gray-600">Kitchens</div>
            </div>
          </div>
        </div>

        {/* Renovation Scope */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            🔨 Renovation Scope
          </h3>
          <div className="space-y-2 text-sm">
            {formData.renovateBathrooms && (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>Bathrooms ({formData.bathrooms})</span>
              </div>
            )}
            {formData.renovateKitchen && (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>Kitchen ({formData.kitchens})</span>
              </div>
            )}
            {formData.renovateBedrooms && (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>Bedrooms ({formData.bedrooms})</span>
              </div>
            )}
            {formData.wallpapered && (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>Wallpaper removal</span>
              </div>
            )}
            {!formData.renovateBathrooms &&
              !formData.renovateKitchen &&
              !formData.renovateBedrooms && (
                <div className="text-gray-500">
                  No rooms selected for renovation
                </div>
              )}
          </div>
        </div>

        {/* Structural Work */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            🏗️ Structural Work
          </h3>
          <div className="space-y-2 text-sm">
            {formData.removeWalls ? (
              <>
                <div className="flex items-center">
                  <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                  <span>Wall removal</span>
                </div>
                {formData.structuralWalls && (
                  <div className="flex items-center">
                    <div className="mr-2 h-2 w-2 rounded-full bg-amber-500"></div>
                    <span>Structural walls (requires engineering)</span>
                  </div>
                )}
              </>
            ) : (
              <div className="text-gray-500">No structural changes</div>
            )}
          </div>
        </div>

        {/* Systems */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            ⚡ Systems
          </h3>
          <div className="space-y-2 text-sm">
            {formData.rewire ? (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>Full house rewire</span>
              </div>
            ) : (
              <div className="text-gray-500">No electrical rewiring</div>
            )}
            {formData.replaceHeating ? (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>Heating system replacement</span>
              </div>
            ) : (
              <div className="text-gray-500">No heating replacement</div>
            )}
          </div>
        </div>

        {/* Finishing */}
        <div className="rounded-lg border border-gray-200 p-6">
          <h3 className="mb-4 text-lg font-semibold text-gray-900">
            🎨 Finishing
          </h3>
          <div className="space-y-2 text-sm">
            {formData.skimWalls && (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>Wall skimming</span>
              </div>
            )}
            {formData.skimCeilings && (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>Ceiling skimming</span>
              </div>
            )}
            {formData.replaceDoors ? (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>Door and frame replacement</span>
              </div>
            ) : (
              <div className="text-gray-500">No door replacement</div>
            )}
            {formData.replaceFloors ? (
              <div className="flex items-center">
                <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                <span>
                  Floor replacement ({getFloorTypeName(formData.floorType)})
                </span>
              </div>
            ) : (
              <div className="text-gray-500">No floor replacement</div>
            )}
          </div>
        </div>

        {/* Disclaimer */}
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
                Important Notice
              </h3>
              <div className="mt-2 text-sm text-amber-700">
                <p>
                  This is an estimate based on the information provided. Final
                  costs may vary depending on:
                </p>
                <ul className="mt-1 list-inside list-disc">
                  <li>Site conditions and accessibility</li>
                  <li>Material choices and finishes</li>
                  <li>Planning and building regulations</li>
                  <li>Unexpected structural issues</li>
                </ul>
              </div>
            </div>
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
          Calculate Estimate
        </button>
      </div>
    </div>
  );
};

export default StepFinish;
