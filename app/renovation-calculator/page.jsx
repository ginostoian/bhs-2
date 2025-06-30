"use client";

import React, { useState } from "react";
import Stepper from "./components/Wizard/Stepper";
import StepProperty from "./components/Wizard/StepProperty";
import StepHouseDetails from "./components/Wizard/StepHouseDetails";
import StepRooms from "./components/Wizard/StepRooms";
import StepRenovationScope from "./components/Wizard/StepRenovationScope";
import StepStructuralWork from "./components/Wizard/StepStructuralWork";
import StepSystems from "./components/Wizard/StepSystems";
import StepFinishing from "./components/Wizard/StepFinishing";
import StepFinish from "./components/Wizard/StepFinish";
import ResultCard from "./components/ResultCard";
import FAQ from "./components/FAQ";
import { costEngine } from "./lib/costEngine";

const RenovationCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [formData, setFormData] = useState({
    propertyType: "",
    location: "",
    houseType: "",
    floor: "",
    houseSize: 0,
    bedrooms: 0,
    bathrooms: 0,
    kitchens: 0,
    wallpapered: false,
    renovateBathrooms: false,
    renovateKitchen: false,
    renovateBedrooms: false,
    removeWalls: false,
    structuralWalls: false,
    rewire: false,
    replaceHeating: false,
    skimWalls: false,
    skimCeilings: false,
    replaceDoors: false,
    replaceFloors: false,
    floorType: "",
  });

  const steps = [
    { title: "Property", description: "Tell us about your property" },
    { title: "House Details", description: "House type and size" },
    { title: "Rooms", description: "Number of rooms" },
    { title: "Renovation Scope", description: "What to renovate" },
    { title: "Structural Work", description: "Walls and structural changes" },
    { title: "Systems", description: "Electrical and heating" },
    { title: "Finishing", description: "Walls, doors, and floors" },
    { title: "Review", description: "Review your details" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      // Scroll to top when moving to next step
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Calculate cost
      try {
        const result = costEngine.calculateTotalCost(formData);
        setCalculationResult(result);
        setShowResults(true);
        // Scroll to top when showing results
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Calculation error:", error);
        alert("There was an error calculating your cost. Please try again.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      // Scroll to top when going back
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setCurrentStep(0);
    setCalculationResult(null);
    // Scroll to top when starting over
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleModifySelections = () => {
    setShowResults(false);
    // Go back to the last step (review step)
    setCurrentStep(steps.length - 1);
    // Scroll to top when modifying selections
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    // Scroll to top when jumping to a step
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
          <StepHouseDetails
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <StepRooms
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
        return (
          <StepRenovationScope
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 4:
        return (
          <StepStructuralWork
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 5:
        return (
          <StepSystems
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <StepFinishing
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 7:
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
            Home Renovation Cost Calculator
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Get an accurate estimate for your home renovation project. Our
            calculator takes into account your property type, location, and
            specific renovation requirements.
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
            {/* Left Column - Wizard Steps */}
            <div className="lg:col-span-2">
              <div className="rounded-lg bg-white p-8 shadow-lg">
                {renderStep()}
              </div>
            </div>

            {/* Right Column - Progress and Info */}
            <div className="space-y-6">
              {/* Progress Card */}
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

              {/* Info Card */}
              <div className="rounded-lg bg-blue-50 p-6">
                <h3 className="mb-3 text-lg font-semibold text-blue-900">
                  💡 Tips for Accurate Estimates
                </h3>
                <ul className="space-y-2 text-sm text-blue-800">
                  <li>• Measure your rooms accurately</li>
                  <li>• Consider structural changes carefully</li>
                  <li>• Factor in electrical and plumbing work</li>
                  <li>• Include finishing materials in your budget</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <FAQ />
        </div>
      </div>
    </div>
  );
};

export default RenovationCalculator;
