"use client";

import React, { useState } from "react";
import Stepper from "./components/Wizard/Stepper";
import StepProperty from "./components/Wizard/StepProperty";
import StepType from "./components/Wizard/StepType";
import StepSize from "./components/Wizard/StepSize";
import StepExtras from "./components/Wizard/StepExtras";
import StepFinish from "./components/Wizard/StepFinish";
import ResultCard from "./components/ResultCard";
import Diagram from "./components/Diagram";
import { costEngine } from "./lib/costEngine";

const ExtensionCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [formData, setFormData] = useState({
    propertyType: "",
    location: "",
    extensionType: "",
    size: 0,
    complexity: "",
    additionalFeatures: [],
    planningServices: [],
  });

  const steps = [
    { title: "Property", description: "Tell us about your property" },
    { title: "Extension Type", description: "Choose your extension type" },
    { title: "Size & Complexity", description: "Enter size and complexity" },
    { title: "Additional Features", description: "Select extra features" },
    { title: "Review", description: "Review your details" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      // Calculate cost
      try {
        const result = costEngine.calculateTotalCost(formData);
        setCalculationResult(result);
        setShowResults(true);
      } catch (error) {
        console.error("Calculation error:", error);
        alert("There was an error calculating your cost. Please try again.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setCurrentStep(0);
    setCalculationResult(null);
  };

  const handleModifySelections = () => {
    setShowResults(false);
    // Go back to the last step (review step)
    setCurrentStep(steps.length - 1);
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <StepProperty
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <StepType
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <StepSize
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepExtras
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <StepFinish
            formData={formData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      default:
        return null;
    }
  };

  if (showResults) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4">
          {/* Back to Calculator Button */}
          <div className="mb-6">
            <button
              onClick={handleModifySelections}
              className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
            >
              <svg
                className="mr-2 h-4 w-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              Modify Selections
            </button>
          </div>

          <ResultCard
            calculationResult={calculationResult}
            formData={formData}
            onRecalculate={handleRecalculate}
            onModifySelections={handleModifySelections}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Extension Cost Calculator
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Get an accurate estimate for your house extension project. Our
            calculator takes into account your property type, location, and
            specific requirements.
          </p>
        </div>

        {/* Stepper */}
        <Stepper
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
          onStepClick={handleStepClick}
        />

        {/* Main Content */}
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            {/* Wizard Steps */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-8 shadow-lg">
                {renderStep()}
              </div>
            </div>

            {/* Sidebar with Diagram */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 rounded-lg bg-white p-6 shadow-lg">
                <Diagram
                  extensionType={formData.extensionType}
                  size={formData.size}
                />

                {/* Progress Info */}
                <div className="mt-6 rounded-lg bg-blue-50 p-4">
                  <h4 className="mb-2 font-semibold text-blue-900">
                    Your Progress
                  </h4>
                  <div className="space-y-2 text-sm">
                    {formData.propertyType && (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Property type selected</span>
                      </div>
                    )}
                    {formData.location && (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Location confirmed</span>
                      </div>
                    )}
                    {formData.extensionType && (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Extension type chosen</span>
                      </div>
                    )}
                    {formData.size > 0 && (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Size: {formData.size} m²</span>
                      </div>
                    )}
                    {formData.complexity && (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Complexity assessed</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="mt-6 rounded-lg bg-yellow-50 p-4">
                  <h4 className="mb-2 font-semibold text-yellow-900">
                    Quick Tips
                  </h4>
                  <ul className="space-y-1 text-sm text-yellow-800">
                    <li>• Measure your extension area accurately</li>
                    <li>• Consider planning permission requirements</li>
                    <li>• Factor in additional features you want</li>
                    <li>• Get multiple quotes for comparison</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExtensionCalculator;
