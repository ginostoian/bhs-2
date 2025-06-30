"use client";

import React, { useState } from "react";
import Stepper from "./components/Wizard/Stepper";
import StepProperty from "./components/Wizard/StepProperty";
import StepKitchenSize from "./components/Wizard/StepKitchenSize";
import StepKitchenType from "./components/Wizard/StepKitchenType";
import StepWorktopSplashback from "./components/Wizard/StepWorktopSplashback";
import StepFlooring from "./components/Wizard/StepFlooring";
import StepElectricsPlumbing from "./components/Wizard/StepElectricsPlumbing";
import StepFinish from "./components/Wizard/StepFinish";
import ResultCard from "./components/ResultCard";
import FAQ from "./components/FAQ";
import { calculateTotalCost } from "./lib/costEngine";
// import { costEngine } from "./lib/costEngine"; // Placeholder for future cost engine

const KitchenCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [formData, setFormData] = useState({
    address: "",
    propertyType: "",
    location: "",
    kitchenSize: 0,
    kitchenType: "",
    flooringType: "",
    worktopType: "",
    splashbackType: "",
    rewire: false,
    relocateBoiler: false,
  });

  const steps = [
    { title: "Property Details", description: "Address and property info" },
    { title: "Kitchen Size", description: "Approximate size in sqm" },
    { title: "Kitchen Type", description: "Pre-built, flat pack, or custom" },
    { title: "Worktop & Splashback", description: "Materials and finishes" },
    { title: "Flooring", description: "Type of kitchen flooring" },
    { title: "Electrics & Plumbing", description: "Rewire and boiler" },
    { title: "Review", description: "Review your details" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Calculate cost using kitchen cost engine
      const result = calculateTotalCost(formData);
      setCalculationResult(result);
      setShowResults(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setCurrentStep(0);
    setCalculationResult(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleModifySelections = () => {
    setShowResults(false);
    setCurrentStep(steps.length - 1);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          <StepKitchenSize
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <StepKitchenType
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepWorktopSplashback
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <StepFlooring
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <StepElectricsPlumbing
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
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
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900">
            Kitchen Renovation Cost Calculator
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Get an accurate estimate for your kitchen renovation project. Our
            calculator considers your kitchen size, materials, and specific
            requirements.
          </p>
        </div>

        <Stepper
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
          onStepClick={handleStepClick}
        />

        <div className="mx-auto max-w-6xl">
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-8 shadow-lg">
                {renderStep()}
              </div>
            </div>
            <div className="space-y-6">
              <div className="rounded-lg bg-white p-6 shadow-lg">
                <h3 className="mb-4 text-lg font-semibold text-gray-900">
                  Your Progress
                </h3>
                <div className="space-y-3">
                  {steps.map((step, index) => (
                    <div
                      key={index}
                      className={`flex items-center text-sm ${
                        index <= currentStep ? "text-blue-600" : "text-gray-400"
                      }`}
                    >
                      <div
                        className={`mr-3 flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                          index < currentStep
                            ? "bg-green-500 text-white"
                            : index === currentStep
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-500"
                        }`}
                      >
                        {index < currentStep ? "✓" : index + 1}
                      </div>
                      <span className="font-medium">{step.title}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-blue-900">
                  💡 Tips for Accurate Estimates
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Measure your kitchen accurately</li>
                  <li>• Consider appliance and plumbing locations</li>
                  <li>• Choose materials that fit your lifestyle</li>
                  <li>• Factor in electrical and heating work</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default KitchenCalculator;
