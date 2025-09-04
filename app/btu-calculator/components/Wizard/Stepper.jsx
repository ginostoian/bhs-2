"use client";

import React from "react";

const Stepper = ({ currentStep, totalSteps, steps, onStepClick }) => {
  return (
    <div className="mb-12">
      <div className="mx-auto max-w-4xl">
        <div className="flex items-center justify-between">
          {steps.map((step, index) => (
            <div key={index} className="flex flex-col items-center">
              {/* Step Circle */}
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-medium transition-colors ${
                  index < currentStep
                    ? "border-green-500 bg-green-500 text-white"
                    : index === currentStep
                      ? "border-blue-500 bg-blue-500 text-white"
                      : "border-gray-300 bg-white text-gray-500"
                }`}
                onClick={() => onStepClick(index)}
                style={{ cursor: "pointer" }}
              >
                {index < currentStep ? (
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  index + 1
                )}
              </div>

              {/* Step Title */}
              <div className="mt-2 text-center">
                <h3
                  className={`text-sm font-medium ${
                    index <= currentStep ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </h3>
                <p
                  className={`text-xs ${
                    index <= currentStep ? "text-gray-600" : "text-gray-400"
                  }`}
                >
                  {step.description}
                </p>
              </div>

              {/* Connector Line */}
              {index < totalSteps - 1 && (
                <div
                  className={`absolute left-1/2 top-6 h-0.5 w-full -translate-y-1/2 ${
                    index < currentStep ? "bg-green-500" : "bg-gray-300"
                  }`}
                  style={{
                    width: "calc(100% - 3rem)",
                    left: "calc(50% + 1.5rem)",
                  }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Stepper;
