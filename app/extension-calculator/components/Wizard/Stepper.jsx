"use client";

import React from "react";

const Stepper = ({ currentStep, totalSteps, steps }) => {
  return (
    <div className="mx-auto mb-8 w-full max-w-4xl">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <div key={index} className="flex items-center">
            {/* Step circle */}
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                index < currentStep
                  ? "border-blue-600 bg-blue-600 text-white"
                  : index === currentStep
                    ? "border-blue-600 bg-blue-600 text-white"
                    : "border-gray-300 bg-white text-gray-500"
              }`}
            >
              {index < currentStep ? (
                <svg
                  className="h-5 w-5"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              ) : (
                <span className="text-sm font-medium">{index + 1}</span>
              )}
            </div>

            {/* Step label */}
            <div className="ml-3 hidden sm:block">
              <p
                className={`text-sm font-medium ${
                  index <= currentStep ? "text-gray-900" : "text-gray-500"
                }`}
              >
                {step.title}
              </p>
              <p className="text-xs text-gray-500">{step.description}</p>
            </div>

            {/* Connector line */}
            {index < steps.length - 1 && (
              <div
                className={`mx-4 h-0.5 flex-1 ${
                  index < currentStep ? "bg-blue-600" : "bg-gray-300"
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Mobile step indicator */}
      <div className="mt-4 text-center sm:hidden">
        <p className="text-sm font-medium text-gray-900">
          Step {currentStep + 1} of {totalSteps}
        </p>
        <p className="text-xs text-gray-500">{steps[currentStep]?.title}</p>
      </div>
    </div>
  );
};

export default Stepper;
