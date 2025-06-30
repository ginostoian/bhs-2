"use client";

import React from "react";

const StepFinish = ({ formData, onNext, onBack }) => {
  return (
    <div className="mx-auto max-w-2xl">
      <div className="mb-8 text-center">
        <h2 className="mb-4 text-3xl font-bold text-gray-900">
          Review Your Details
        </h2>
        <p className="text-lg text-gray-600">
          Please review your selections before finishing.
        </p>
      </div>
      <div className="mb-8 rounded-lg bg-gray-50 p-6 shadow">
        <ul className="space-y-3 text-base text-gray-800">
          <li>
            <strong>Address:</strong> {formData.address}
          </li>
          <li>
            <strong>Property Type:</strong> {formData.propertyType}
          </li>
          <li>
            <strong>Location:</strong> {formData.location}
          </li>
          <li>
            <strong>Kitchen Size:</strong> {formData.kitchenSize} sqm
          </li>
          <li>
            <strong>Kitchen Type:</strong> {formData.kitchenType}
          </li>
          <li>
            <strong>Worktop Type:</strong> {formData.worktopType}
          </li>
          <li>
            <strong>Splashback Type:</strong> {formData.splashbackType}
          </li>
          <li>
            <strong>Flooring Type:</strong> {formData.flooringType}
          </li>
          <li>
            <strong>Rewire Needed:</strong>{" "}
            {formData.rewire === true
              ? "Yes"
              : formData.rewire === false
                ? "No"
                : "-"}
          </li>
          <li>
            <strong>Boiler Relocation:</strong>{" "}
            {formData.relocateBoiler === true
              ? "Yes"
              : formData.relocateBoiler === false
                ? "No"
                : "-"}
          </li>
        </ul>
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
          className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
        >
          Finish
        </button>
      </div>
    </div>
  );
};

export default StepFinish;
