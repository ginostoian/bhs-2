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
import FAQ from "../../components/FAQ";
import Modal from "@/components/Modal";
import { costEngine } from "./lib/costEngine";

const initialFormData = {
  propertyType: "",
  region: "",
  londonZone: "",
  location: "",
  postcode: "",
  extensionType: "",
  size: 0,
  complexity: "",
  finishLevel: "standard",
  siteAccess: "standard",
  glazingLevel: "standard",
  drawingsStatus: "noPlansYet",
  planningStatus: "unknown",
  additionalFeatures: [],
  planningServices: [],
};

const steps = [
  { title: "Property", description: "Location + property context" },
  { title: "Project Type", description: "Extension category" },
  { title: "Specification", description: "Size and key cost drivers" },
  { title: "Extras & Fees", description: "Optional items and fee selections" },
  { title: "Review", description: "Check inputs before calculating" },
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

export default function ExtensionCalculator() {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [modalState, setModalState] = useState(modalReset);
  const [formData, setFormData] = useState(initialFormData);

  let livePreview = null;
  try {
    if (formData.extensionType && formData.size > 0) {
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
      console.error("Calculation error:", error);
      setModalState({
        isOpen: true,
        title: "Calculation Error",
        message:
          error?.message ||
          "There was an error calculating your estimate. Please review your answers and try again.",
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
          <StepFinish formData={formData} onNext={handleNext} onBack={handleBack} />
        );
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
              <svg
                className="h-4 w-4"
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
              London-first pricing tool
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
              Extension Cost Calculator
            </h1>
            <p className="mt-4 max-w-2xl text-lg leading-relaxed text-stone-600">
              A transparent budgeting tool for early-stage extension projects.
              We show a low / expected / high range and separate build cost,
              extras, fees, contingency, and VAT to help homeowners plan
              realistically.
            </p>
          </div>

          <div className="rounded-2xl border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
              Why this is different
            </p>
            <ul className="mt-4 space-y-2 text-sm text-stone-700">
              <li>Quantity-based extras (not misleading flat fees)</li>
              <li>Auto fee allowances if you haven&apos;t got plans yet</li>
              <li>Confidence score based on drawings/planning certainty</li>
              <li>Lead PDF includes next-step advice and budget checklist</li>
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
                <Diagram extensionType={formData.extensionType} size={formData.size} />
              </div>

              <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-stone-500">
                  Progress
                </h3>
                <div className="mt-4 space-y-2 text-sm text-stone-700">
                  <ProgressRow
                    done={!!formData.propertyType}
                    label="Property type selected"
                  />
                  <ProgressRow
                    done={!!formData.region}
                    label="Region selected"
                  />
                  <ProgressRow
                    done={!!formData.extensionType}
                    label="Project type selected"
                  />
                  <ProgressRow
                    done={formData.size > 0}
                    label={formData.size > 0 ? `Size entered: ${formData.size} m²` : "Size not entered yet"}
                  />
                  <ProgressRow
                    done={!!formData.complexity}
                    label="Complexity selected"
                  />
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
                      {formatCurrency(livePreview.rangePerSqm.expected)} /m²
                      expected
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
                    Select project type and enter size to see a live budget
                    preview while you complete the form.
                  </p>
                )}
              </div>

              <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-amber-900">
                  Best Use of This Tool
                </h3>
                <ul className="mt-3 space-y-2 text-sm text-amber-900">
                  <li>Use the high range when planning finance.</li>
                  <li>Bring the PDF to architect / builder conversations.</li>
                  <li>Refine again after survey and drawings are ready.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <section className="mx-auto mt-14 max-w-4xl rounded-2xl border border-stone-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-stone-900">
            Extension cost calculator for realistic London project planning
          </h2>
          <p className="mt-4 leading-7 text-stone-700">
            This extension cost calculator is built for homeowners who need a
            more realistic starting budget before they move into planning,
            drawings, or detailed builder quotes. It helps you compare house
            extension cost ranges by size, type, finish level, and professional
            fees instead of relying on oversimplified online averages.
          </p>
          <p className="mt-4 leading-7 text-stone-700">
            Whether you are looking at a single storey extension, double
            storey extension, or a more complex scheme, the calculator makes it
            easier to understand likely extension cost in London and to budget
            properly for extras, contingency, and VAT from the start.
          </p>
        </section>

        <div className="mt-12">
          <FAQ
            content={[
              {
                question: "How accurate is this extension calculator?",
                answer: (
                  <div className="space-y-2 leading-relaxed">
                    <p>
                      It is designed for early budgeting, not a final quote. The
                      tool gives a low / expected / high range and widens that
                      range when you don&apos;t yet have plans or confirmed
                      planning status.
                    </p>
                    <p>
                      Accuracy improves significantly once you have measured or
                      architect drawings and a site survey.
                    </p>
                  </div>
                ),
              },
              {
                question: "Why do you show a range instead of one exact price?",
                answer: (
                  <div className="space-y-2 leading-relaxed">
                    <p>
                      Exact pricing before surveys and drawings is usually
                      misleading. Build cost depends on structural details,
                      access, specification, and hidden site conditions.
                    </p>
                    <p>
                      A transparent range is more trustworthy and more useful for
                      budgeting decisions.
                    </p>
                  </div>
                ),
              },
              {
                question: "Does the estimate include VAT and contingency?",
                answer: (
                  <div className="space-y-2 leading-relaxed">
                    <p>
                      Yes. The result screen clearly separates base build cost,
                      extras, professional/statutory fees, contingency, and VAT.
                    </p>
                    <p>
                      We apply VAT conservatively to the subtotal so you don&apos;t
                      under-budget at the planning stage.
                    </p>
                  </div>
                ),
              },
              {
                question: "What if I don&apos;t know planning or structural details yet?",
                answer: (
                  <div className="space-y-2 leading-relaxed">
                    <p>
                      That&apos;s normal. The calculator is built for homeowners
                      at an early stage. If you leave planning/professional fees
                      unselected, it automatically includes sensible allowances
                      based on your answers.
                    </p>
                  </div>
                ),
              },
              {
                question: "Do you only work in London?",
                answer: (
                  <div className="space-y-2 leading-relaxed">
                    <p>
                      Better Homes Studio primarily serves London, so London is
                      the main pricing focus of this tool (including a zone
                      option).
                    </p>
                    <p>
                      We also include other UK regions so homeowners can still
                      use the calculator for budgeting comparisons.
                    </p>
                  </div>
                ),
              },
              {
                question: "What should I do after getting my estimate?",
                answer: (
                  <div className="space-y-2 leading-relaxed">
                    <p>
                      Download the PDF, compare the expected and high ranges,
                      then speak to an architect/designer or builder with your
                      rough brief. Once you have plans, update the calculator and
                      request a survey-based quote.
                    </p>
                  </div>
                ),
              },
            ]}
          />
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

function ProgressRow({ done, label }) {
  return (
    <div className="flex items-center gap-2">
      <span
        className={`inline-block h-2 w-2 rounded-full ${
          done ? "bg-emerald-500" : "bg-stone-300"
        }`}
      />
      <span className={done ? "text-stone-800" : "text-stone-500"}>{label}</span>
    </div>
  );
}
