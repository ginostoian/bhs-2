"use client";

import React, { useState } from "react";
import Modal from "@/components/Modal";
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

const initialFormData = {
  propertyType: "",
  region: "london",
  londonZone: "zone3",
  location: "zone3",
  postcode: "",
  houseStyle: "",
  floor: "ground",
  houseSize: 0,
  bedrooms: 0,
  bathrooms: 0,
  kitchens: 1,
  receptionRooms: 1,
  coverageLevel: "",
  renovationLevel: "",
  finishLevel: "standard",
  occupancyStatus: "vacant",
  drawingsStatus: "roughScope",
  renovateKitchenCount: 0,
  renovateBathroomCount: 0,
  renovateBedroomCount: 0,
  renovateReceptionCount: 0,
  includeHallway: false,
  structuralLevel: "none",
  wallRemovalCount: 0,
  dampAllowance: false,
  rewireLevel: "none",
  heatingLevel: "none",
  plumbingLevel: "none",
  plasteringLevel: "none",
  decorationLevel: "none",
  flooringLevel: "none",
  floorFinish: "laminate",
  doorPackage: "none",
};

const steps = [
  { title: "Property", description: "Location + type" },
  { title: "House Details", description: "Size and room count" },
  { title: "Rooms", description: "Coverage and room fit-out" },
  { title: "Scope", description: "Renovation standard" },
  { title: "Structural", description: "Layout and hidden risk" },
  { title: "Systems", description: "Electrical, heating, plumbing" },
  { title: "Finishing", description: "Plaster, paint, floors, doors" },
  { title: "Review", description: "Check before calculate" },
];

const modalReset = {
  isOpen: false,
  title: "",
  message: "",
  type: "alert",
  confirmText: "OK",
};

const formatCurrency = (amount) =>
  new Intl.NumberFormat("en-GB", {
    style: "currency",
    currency: "GBP",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount || 0);

function ProgressRow({ done, label }) {
  return (
    <div className={`flex items-center gap-3 ${done ? "text-stone-900" : "text-stone-400"}`}>
      <span
        className={`inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-semibold ${
          done ? "bg-emerald-500 text-white" : "bg-stone-200 text-stone-500"
        }`}
      >
        {done ? "✓" : ""}
      </span>
      <span>{label}</span>
    </div>
  );
}

export default function RenovationCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [modalState, setModalState] = useState(modalReset);
  const [formData, setFormData] = useState(initialFormData);

  let livePreview = null;
  try {
    if (
      formData.propertyType &&
      formData.houseStyle &&
      formData.houseSize > 0 &&
      formData.coverageLevel &&
      formData.renovationLevel
    ) {
      livePreview = costEngine.calculateTotalCost(formData);
    }
  } catch (_error) {
    livePreview = null;
  }

  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
      scrollTop();
      return;
    }

    try {
      const result = costEngine.calculateTotalCost(formData);
      setCalculationResult(result);
      setShowResults(true);
      scrollTop();
    } catch (error) {
      setModalState({
        isOpen: true,
        title: "Calculation Error",
        message:
          error?.message ||
          "There was an error calculating your estimate. Please review the form and try again.",
        type: "alert",
        confirmText: "OK",
      });
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
      scrollTop();
    }
  };

  const handleRecalculate = () => {
    setShowResults(false);
    setCurrentStep(0);
    setCalculationResult(null);
    setFormData(initialFormData);
    scrollTop();
  };

  const handleModifySelections = () => {
    setShowResults(false);
    setCurrentStep(steps.length - 1);
    scrollTop();
  };

  const handleStepClick = (stepIndex) => {
    setCurrentStep(stepIndex);
    scrollTop();
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <StepProperty formData={formData} setFormData={setFormData} onNext={handleNext} />;
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
        return <StepFinish formData={formData} onNext={handleNext} onBack={handleBack} />;
      default:
        return null;
    }
  };

  if (showResults && calculationResult) {
    return (
      <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#f8fafc,_#f5f5f4_55%,_#e7e5e4)] py-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="mb-6">
            <button
              onClick={handleModifySelections}
              className="inline-flex items-center gap-2 rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-700 transition hover:border-stone-400 hover:bg-stone-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Edit Inputs
            </button>
          </div>

          <ResultCard
            calculationResult={calculationResult}
            formData={formData}
            onRecalculate={handleRecalculate}
            onModifySelections={handleModifySelections}
          />
        </div>

        <Modal
          isOpen={modalState.isOpen}
          onClose={() => setModalState(modalReset)}
          title={modalState.title}
          message={modalState.message}
          confirmText={modalState.confirmText}
          type={modalState.type}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_#fff,_#f8fafc_35%,_#f5f5f4_70%)] py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 grid gap-6 rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-2xl shadow-stone-900/5 backdrop-blur md:grid-cols-[1.3fr_1fr] md:p-8">
          <div>
            <div className="inline-flex items-center rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
              London-first renovation pricing
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
              Home Renovation Cost Calculator
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
              A ballpark budgeting tool for refurbishments and full-home
              renovations. It separates core scope, room fit-out, systems,
              structural risk, finishing, fees, contingency, and VAT.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              What makes this more useful
            </p>
            <ul className="mt-4 space-y-2 text-sm text-stone-700">
              <li>Scope-based pricing instead of random flat room fees</li>
              <li>Room fit-out and house-wide works shown separately</li>
              <li>Confidence score based on how defined the scope is</li>
              <li>PDF includes budgeting guidance and comparison tips</li>
            </ul>
          </div>
        </div>

        <Stepper
          currentStep={currentStep}
          totalSteps={steps.length}
          steps={steps}
          onStepClick={handleStepClick}
        />

        <div className="grid gap-8 lg:grid-cols-[1.5fr_0.8fr]">
          <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8">
            {renderStep()}
          </div>

          <aside className="space-y-6">
            <div className="sticky top-8 space-y-6">
              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Progress
                </h3>
                <div className="mt-4 space-y-2 text-sm">
                  <ProgressRow done={!!formData.propertyType} label="Property type selected" />
                  <ProgressRow done={!!formData.region} label="Region selected" />
                  <ProgressRow done={!!formData.houseStyle} label="House style selected" />
                  <ProgressRow
                    done={formData.houseSize > 0}
                    label={
                      formData.houseSize > 0
                        ? `Size entered: ${formData.houseSize} m²`
                        : "Size not entered yet"
                    }
                  />
                  <ProgressRow done={!!formData.coverageLevel} label="Coverage selected" />
                  <ProgressRow done={!!formData.renovationLevel} label="Scope selected" />
                </div>
              </div>

              <div className="rounded-2xl border border-slate-900 bg-slate-900 p-5 text-white shadow-xl shadow-slate-900/15">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-300">
                  Live Estimate Preview
                </h3>
                {livePreview ? (
                  <>
                    <div className="mt-4 text-xs uppercase tracking-[0.14em] text-stone-300">
                      Expected budget
                    </div>
                    <div className="mt-1 text-3xl font-semibold tracking-tight">
                      {formatCurrency(livePreview.ranges.expected)}
                    </div>
                    <p className="mt-2 text-sm text-stone-200">
                      {formatCurrency(livePreview.ranges.low)} -{" "}
                      {formatCurrency(livePreview.ranges.high)}
                    </p>
                    <p className="mt-1 text-sm text-stone-300">
                      {formatCurrency(livePreview.rangePerSqm.expected)} /m² expected
                    </p>
                    <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-emerald-300"
                        style={{ width: `${livePreview.confidenceScore}%` }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-stone-300">
                      Confidence: {livePreview.confidenceScore}/100
                    </p>
                  </>
                ) : (
                  <p className="mt-3 text-sm text-stone-300">
                    Complete the key scope inputs to see a live renovation budget
                    preview.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-900">
                  Best use of this tool
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-amber-900">
                  <li>Use the high range when planning finance.</li>
                  <li>Use the PDF to compare builders on the same scope.</li>
                  <li>Re-run once the room schedule is more detailed.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-12">
          <FAQ />
        </div>
      </div>

      <Modal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(modalReset)}
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        type={modalState.type}
      />
    </div>
  );
}
