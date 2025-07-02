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

const ExtensionCalculator = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  const [modalState, setModalState] = useState({
    isOpen: false,
    title: "",
    message: "",
    type: "alert",
    confirmText: "OK",
  });
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
        setModalState({
          isOpen: true,
          title: "Calculation Error",
          message:
            "There was an error calculating your cost. Please try again.",
          type: "alert",
          confirmText: "OK",
        });
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

        {/* Modal */}
        <Modal
          isOpen={modalState.isOpen}
          onClose={() =>
            setModalState({
              isOpen: false,
              title: "",
              message: "",
              type: "alert",
              confirmText: "OK",
            })
          }
          title={modalState.title}
          message={modalState.message}
          confirmText={modalState.confirmText}
          type={modalState.type}
        />
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

        {/* FAQ Section */}
        <FAQ
          content={[
            {
              question: "How much does a house extension cost in the UK?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    House extension costs in the UK typically range from £1,500
                    to £3,000 per square metre, depending on the type of
                    extension, materials used, and location. A single-storey
                    extension usually costs between £1,500-£2,500 per m², while
                    a double-storey extension ranges from £2,000-£3,000 per m².
                  </p>
                  <p>
                    Our calculator provides accurate estimates based on your
                    specific requirements, property type, and location to help
                    you budget effectively for your project.
                  </p>
                </div>
              ),
            },
            {
              question: "Do I need planning permission for a house extension?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Many house extensions can be built under permitted
                    development rights, which don&apos;t require planning
                    permission. Single-storey rear extensions up to 4m for
                    detached houses or 3m for other properties are usually
                    permitted.
                  </p>
                  <p>
                    However, you&apos;ll need planning permission for larger
                    extensions, those in conservation areas, or if your property
                    has already been extended. Always check with your local
                    planning authority before starting work.
                  </p>
                </div>
              ),
            },
            {
              question: "How long does it take to build a house extension?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    The timeline for building a house extension varies depending
                    on size and complexity. A simple single-storey extension
                    typically takes 8-12 weeks, while a double-storey extension
                    can take 12-20 weeks.
                  </p>
                  <p>
                    Complex extensions with additional features may take 6-8
                    months. Factors affecting timeline include weather
                    conditions, material availability, and any planning
                    permission delays.
                  </p>
                </div>
              ),
            },
            {
              question: "What are the most popular types of house extensions?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    The most popular house extension types include rear
                    extensions (most common), side extensions, wrap-around
                    extensions, and loft conversions. Rear extensions are
                    favoured for creating open-plan living spaces and kitchen
                    extensions.
                  </p>
                  <p>
                    Side extensions are ideal for adding extra bedrooms or
                    expanding existing rooms. The choice depends on your
                    property layout, available space, and intended use.
                  </p>
                </div>
              ),
            },
            {
              question: "How can I finance my house extension project?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    There are several ways to finance a house extension:
                    remortgaging your property, taking out a home improvement
                    loan, using savings, or applying for a construction
                    mortgage.
                  </p>
                  <p>
                    Remortgaging is often the most cost-effective option as it
                    typically offers lower interest rates. Consider the total
                    cost including VAT, professional fees, and contingency funds
                    when planning your budget.
                  </p>
                </div>
              ),
            },
            {
              question:
                "What should I consider when designing my house extension?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    When designing your house extension, consider: the intended
                    use and functionality, natural light and ventilation, how it
                    connects to existing rooms, building regulations compliance,
                    energy efficiency, and future resale value.
                  </p>
                  <p>
                    Work with an architect or designer to create a space that
                    enhances your lifestyle while adding value to your property.
                    Consider the flow between old and new spaces.
                  </p>
                </div>
              ),
            },
            {
              question: "Are there any building regulations I need to follow?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Yes, all house extensions must comply with building
                    regulations covering structural integrity, fire safety,
                    energy efficiency, ventilation, and accessibility.
                  </p>
                  <p>
                    You&apos;ll need building control approval, which involves
                    inspections at key stages of construction. Your builder or
                    architect should handle the building control process, but
                    it&apos;s important to ensure all work meets current
                    standards.
                  </p>
                </div>
              ),
            },
            {
              question:
                "How much value does a house extension add to my property?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    A well-designed house extension can add significant value to
                    your property, typically 10-20% of your home&apos;s current
                    value. Kitchen extensions often provide the best return on
                    investment, followed by additional bedrooms and living
                    space.
                  </p>
                  <p>
                    The exact value increase depends on your location, the
                    quality of the build, and how well the extension integrates
                    with your existing property.
                  </p>
                </div>
              ),
            },
            {
              question:
                "What are the common challenges when building a house extension?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Common challenges include: managing the construction process
                    while living in the property, dealing with unexpected
                    structural issues, coordinating with contractors and
                    suppliers, managing noise and disruption, and staying within
                    budget.
                  </p>
                  <p>
                    Good planning, clear communication with your builder, and
                    having a realistic timeline can help minimise these
                    challenges.
                  </p>
                </div>
              ),
            },
            {
              question: "Should I hire an architect for my house extension?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    While not always legally required, hiring an architect is
                    highly recommended for house extensions. They can help with
                    design optimisation, planning permission applications,
                    building regulations compliance, and contractor
                    coordination.
                  </p>
                  <p>
                    Architects can also help maximise your space and ensure the
                    extension adds value to your property. For complex projects
                    or if you want a unique design, an architect is essential.
                  </p>
                </div>
              ),
            },
          ]}
        />
      </div>

      {/* Modal */}
      <Modal
        isOpen={modalState.isOpen}
        onClose={() =>
          setModalState({
            isOpen: false,
            title: "",
            message: "",
            type: "alert",
            confirmText: "OK",
          })
        }
        title={modalState.title}
        message={modalState.message}
        confirmText={modalState.confirmText}
        type={modalState.type}
      />
    </div>
  );
};

export default ExtensionCalculator;
