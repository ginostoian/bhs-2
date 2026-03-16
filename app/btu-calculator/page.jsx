"use client";

import React, { useState } from "react";
import Stepper from "./components/Wizard/Stepper";
import StepRoomDetails from "./components/Wizard/StepRoomDetails";
import StepInsulation from "./components/Wizard/StepInsulation";
import StepHeatingType from "./components/Wizard/StepHeatingType";
import StepFinish from "./components/Wizard/StepFinish";
import ResultCard from "./components/ResultCard";
import FAQ from "../../components/FAQ";
import Modal from "@/components/Modal";
import { calculateBTU } from "./lib/btuEngine";

const BTUCalculator = () => {
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
    roomLength: 0,
    roomWidth: 0,
    roomHeight: 0,
    roomType: "",
    insulationLevel: "",
    windowCount: 0,
    doorCount: 0,
    heatingType: "",
    outsideWallCount: 0,
  });

  const steps = [
    { title: "Room Details", description: "Enter room dimensions and type" },
    { title: "Insulation", description: "Assess insulation and openings" },
    { title: "Heating Type", description: "Choose your heating system" },
    { title: "Review", description: "Review your details" },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Calculate BTU
      try {
        const result = calculateBTU(formData);
        setCalculationResult(result);
        setShowResults(true);
        window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (error) {
        console.error("Calculation error:", error);
        setModalState({
          isOpen: true,
          title: "Calculation Error",
          message:
            "There was an error calculating your BTU requirements. Please try again.",
          type: "alert",
          confirmText: "OK",
        });
      }
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
          <StepRoomDetails
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
          />
        );
      case 1:
        return (
          <StepInsulation
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 2:
        return (
          <StepHeatingType
            formData={formData}
            setFormData={setFormData}
            onNext={handleNext}
            onBack={handleBack}
          />
        );
      case 3:
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
            BTU Calculator
          </h1>
          <p className="mx-auto max-w-2xl text-xl text-gray-600">
            Calculate the perfect BTU output for heating your room with gas or
            electric radiators. Get accurate heating requirements based on room
            size, insulation, and heating type.
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

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-8 space-y-6">
                {/* Progress Info */}
                <div className="rounded-lg bg-white p-6 shadow-lg">
                  <h4 className="mb-4 font-semibold text-gray-900">
                    Your Progress
                  </h4>
                  <div className="space-y-2 text-sm">
                    {formData.roomLength > 0 && formData.roomWidth > 0 && (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>
                          Room: {formData.roomLength}m × {formData.roomWidth}m
                        </span>
                      </div>
                    )}
                    {formData.roomType && (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Room type: {formData.roomType}</span>
                      </div>
                    )}
                    {formData.insulationLevel && (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Insulation: {formData.insulationLevel}</span>
                      </div>
                    )}
                    {formData.heatingType && (
                      <div className="flex items-center">
                        <div className="mr-2 h-2 w-2 rounded-full bg-green-500"></div>
                        <span>Heating: {formData.heatingType}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Quick Tips */}
                <div className="rounded-lg bg-blue-50 p-6">
                  <h4 className="mb-3 font-semibold text-blue-900">
                    💡 BTU Calculation Tips
                  </h4>
                  <ul className="space-y-2 text-sm text-blue-800">
                    <li>• Measure room dimensions accurately</li>
                    <li>• Consider insulation quality</li>
                    <li>• Factor in windows and doors</li>
                    <li>• Choose appropriate heating type</li>
                    <li>• Add 10-20% for safety margin</li>
                  </ul>
                </div>

                {/* BTU Info */}
                <div className="rounded-lg bg-yellow-50 p-6">
                  <h4 className="mb-3 font-semibold text-yellow-900">
                    🔥 What is BTU?
                  </h4>
                  <p className="text-sm text-yellow-800">
                    BTU (British Thermal Unit) measures heating power. Higher
                    BTU means more heating capacity. Our calculator helps you
                    find the right radiator size for your space.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="mx-auto mt-14 max-w-4xl rounded-2xl border border-gray-200 bg-white p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900">
            BTU calculator for radiators and room heating decisions
          </h2>
          <p className="mt-4 leading-7 text-gray-700">
            Our BTU calculator helps you estimate the heating output needed for
            a room before choosing a radiator. By using room dimensions,
            insulation, window count, and heating type, this radiator BTU
            calculator gives a more useful result than guessing from radiator
            size alone.
          </p>
          <p className="mt-4 leading-7 text-gray-700">
            If you are comparing gas or electric radiators, replacing old
            units, or planning a room upgrade, this BTU calculator for
            radiators gives you a solid starting point. It helps you avoid
            undersized heating, while also reducing the risk of paying for more
            output than the room actually needs.
          </p>
        </section>

        {/* FAQ Section */}
        <FAQ
          content={[
            {
              question: "What is BTU and why is it important for heating?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    BTU (British Thermal Unit) is a measurement of thermal
                    energy. In heating, it tells you how much heat a radiator
                    can produce. One BTU is the amount of energy needed to heat
                    one pound of water by one degree Fahrenheit.
                  </p>
                  <p>
                    For radiators, BTU ratings help you choose the right size.
                    Too small and your room won&apos;t get warm enough. Too
                    large and you&apos;ll waste energy and money. Our calculator
                    finds the perfect BTU for your specific room.
                  </p>
                </div>
              ),
            },
            {
              question: "How do I measure my room for BTU calculation?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Measure the length, width, and height of your room in
                    metres. For irregular rooms, break them into rectangular
                    sections and calculate each separately.
                  </p>
                  <p>
                    Don&apos;t forget to measure ceiling height as it affects
                    the volume of air to be heated. Standard UK ceiling height
                    is 2.4m, but older properties may have higher ceilings.
                  </p>
                </div>
              ),
            },
            {
              question:
                "What&apos;s the difference between gas and electric radiators?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Gas radiators are connected to your central heating system
                    and use gas to heat water that flows through them.
                    They&apos;re more cost-effective for whole-house heating but
                    require plumbing installation.
                  </p>
                  <p>
                    Electric radiators plug into your electrical system and heat
                    up independently. They&apos;re easier to install and perfect
                    for individual room heating, but typically cost more to run.
                  </p>
                </div>
              ),
            },
            {
              question: "How does insulation affect BTU requirements?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Good insulation significantly reduces BTU requirements.
                    Well-insulated rooms retain heat better, so you need less
                    heating power. Poor insulation means heat escapes quickly,
                    requiring higher BTU radiators.
                  </p>
                  <p>
                    Modern homes with cavity wall insulation, double glazing,
                    and loft insulation need 20-30% less BTU than older, poorly
                    insulated properties.
                  </p>
                </div>
              ),
            },
            {
              question: "Should I add extra BTU for safety margin?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Yes, it&apos;s recommended to add 10-20% to your calculated
                    BTU for a safety margin. This accounts for heat loss through
                    windows, doors, and unexpected factors like drafts.
                  </p>
                  <p>
                    However, don&apos;t oversize too much. Radiators that are
                    too powerful can make rooms uncomfortably hot and waste
                    energy. Our calculator includes appropriate safety margins.
                  </p>
                </div>
              ),
            },
            {
              question: "How many radiators do I need for my room?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    You can achieve your total BTU requirement with one large
                    radiator or multiple smaller ones. Consider room layout,
                    furniture placement, and aesthetic preferences.
                  </p>
                  <p>
                    Multiple radiators provide more even heat distribution. For
                    example, a 2000 BTU requirement could be met with one 2000
                    BTU radiator or two 1000 BTU radiators placed strategically.
                  </p>
                </div>
              ),
            },
            {
              question: "Do windows and doors affect BTU calculations?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Yes, windows and doors are major sources of heat loss.
                    Single-glazed windows lose much more heat than double or
                    triple glazing. External doors also contribute to heat loss.
                  </p>
                  <p>
                    Our calculator accounts for the number of windows and doors
                    in your room. More openings mean higher BTU requirements to
                    compensate for heat loss.
                  </p>
                </div>
              ),
            },
            {
              question: "What room types need different BTU calculations?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Different rooms have different heating needs. Living rooms
                    and bedrooms typically need moderate heating, while
                    bathrooms often need higher BTU for quick warm-up and
                    comfort.
                  </p>
                  <p>
                    Kitchens generate heat from cooking, so they may need less
                    heating. Our calculator adjusts BTU requirements based on
                    your room type for optimal comfort.
                  </p>
                </div>
              ),
            },
            {
              question: "How do I choose between different radiator styles?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    Once you know your BTU requirement, you can choose from
                    various radiator styles: panel radiators, column radiators,
                    towel radiators, or designer radiators. All can provide the
                    same BTU output.
                  </p>
                  <p>
                    Consider your room&apos;s style, available wall space, and
                    whether you need the radiator to double as a towel warmer or
                    design feature.
                  </p>
                </div>
              ),
            },
            {
              question: "Can I use this calculator for underfloor heating?",
              answer: (
                <div className="space-y-2 leading-relaxed">
                  <p>
                    This calculator is designed for radiators, but the BTU
                    principles apply to underfloor heating too. However,
                    underfloor heating has different installation requirements
                    and heat distribution patterns.
                  </p>
                  <p>
                    For underfloor heating, consider consulting a heating
                    specialist as the calculations involve floor construction,
                    pipe spacing, and heat output per square metre.
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

export default BTUCalculator;
