"use client";

import React, { useState } from "react";
import Link from "next/link";
import Modal from "@/components/Modal";
import { BOOKING_URL } from "@/libs/booking";
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
import FAQ, { renovationFaqs } from "./components/FAQ";
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

const siteUrl = "https://bhstudio.co.uk";
const pageUrl = `${siteUrl}/renovation-calculator`;

const benchmarkRows = [
  ["Light cosmetic refurbishment (per room)", "£8,000 - £20,000"],
  ["Full flat renovation", "£40,000 - £90,000"],
  ["Full terraced house renovation", "£80,000 - £200,000"],
  ["Full renovation, larger / detached home", "£150,000 - £400,000+"],
  ["Per square metre (standard to high spec)", "£1,000 - £2,500/m²"],
];

const estimateFactors = [
  {
    title: "Scope and coverage",
    body:
      "A renovation touching two rooms and a renovation touching the whole house are not on the same scale, and cost does not rise in a straight line. Once you are rewiring, re-plumbing and re-plastering throughout, the house-wide systems work dominates the budget regardless of how many rooms get a cosmetic refresh.",
  },
  {
    title: "Property age and hidden conditions",
    body:
      "London's Victorian and Edwardian stock hides the costs that wreck budgets: damp, old wiring, lath-and-plaster walls, undersized foundations, and asbestos in anything built before 2000. Older properties carry a wider estimate range because more is unknown until work starts.",
  },
  {
    title: "Systems - rewire, heating, plumbing",
    body:
      "A full rewire, a new boiler or heating system, and re-plumbing are among the largest line items in any whole-house renovation. They are easy to underestimate because they are invisible in the finished result, but if you are upgrading these, expect the estimate to climb accordingly.",
  },
  {
    title: "Structural changes",
    body:
      "Removing walls, forming open-plan space, or altering layout means steel beams, structural engineering and often building control and party wall involvement. These works usually affect both budget and programme because several trades need to coordinate around the same decisions.",
  },
  {
    title: "Where you are in London",
    body:
      "Inner-London boroughs typically run 15-30% above outer London for the same scope, driven by labour rates, access, parking and scaffold licensing. The calculator's London zone setting accounts for this.",
  },
];

const nextSteps = [
  {
    title: "Download your PDF",
    body:
      "It includes the full low/expected/high breakdown with components separated - useful for finance planning and for comparing builder quotes on identical scope.",
  },
  {
    title: "Read the guide",
    body:
      "Our guide covers room-by-room costs, hidden fees, timelines, borough variation and renovate-vs-move economics - everything between rough budget and ready to start.",
    href: `${siteUrl}/blog/home-renovation-cost-london-2026`,
    linkText: "complete 2026 home renovation cost guide",
  },
  {
    title: "Talk it through",
    body:
      "When you want a real answer for your property, book a consultation with our team. We will pressure-test the scope, budget and sequencing before anything gathers momentum - no pressure, no jargon.",
    href: `${siteUrl}/general-renovation`,
    linkText: "full home renovation team in London",
  },
];

const calculatorSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${pageUrl}#webapplication`,
      name: "Home Renovation Cost Calculator UK",
      url: pageUrl,
      applicationCategory: "FinanceApplication",
      operatingSystem: "Web",
      provider: {
        "@type": "Organization",
        name: "Better Homes Studio",
        url: siteUrl,
      },
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "GBP",
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: renovationFaqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: {
          "@type": "Answer",
          text: faq.answer,
        },
      })),
    },
    {
      "@type": "BreadcrumbList",
      "@id": `${pageUrl}#breadcrumb`,
      itemListElement: [
        {
          "@type": "ListItem",
          position: 1,
          name: "Home",
          item: siteUrl,
        },
        {
          "@type": "ListItem",
          position: 2,
          name: "Cost Guides",
          item: `${siteUrl}/tools`,
        },
        {
          "@type": "ListItem",
          position: 3,
          name: "Renovation Calculator",
          item: pageUrl,
        },
      ],
    },
  ],
};

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
              Home Renovation Cost Calculator UK
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

        <section className="mx-auto mt-14 max-w-6xl rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8 lg:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#266bf1]">
                Budget guidance
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 md:text-4xl">
                How this home renovation cost calculator works
              </h2>
            </div>
            <div className="space-y-4 text-base leading-7 text-stone-600">
              <p>
                Most renovation calculators ask for two or three inputs and
                spit out a single number, which is why so many renovation
                budgets are wrong before the first wall comes down. A full
                refurbishment cost depends on scope, the age and condition of
                the property, how much rewiring and re-plumbing is needed,
                whether walls are moving, and the finish you are aiming for. No
                early-stage tool can promise an exact figure, so an honest one
                gives you a range.
              </p>
              <p>
                This calculator works through eight short steps: property and
                location, house details, which rooms are in scope, renovation
                standard, structural changes, systems, and finishing. It returns
                a low / expected / high budget with the components most tools
                hide shown separately: core scope, room fit-out, systems
                upgrades, structural and hidden-condition allowances, finishing,
                professional fees, contingency, and VAT at 20%. It also gives a
                confidence score based on how defined your scope is, and a
                downloadable PDF you can use to compare builders on a
                like-for-like basis.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-stone-200 bg-stone-50/70 p-6 md:p-8">
            <div className="grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-start">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#266bf1]">
                  Typical London budgets
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                  2026 renovation cost benchmarks
                </h2>
                <p className="mt-4 text-base leading-7 text-stone-600">
                  Use these typical London ranges to sanity-check your result.
                  They are planning-stage figures including fees and VAT at a
                  mid-range specification.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-stone-200">
                    <thead className="bg-stone-100">
                      <tr>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                          Renovation scope
                        </th>
                        <th className="px-5 py-4 text-left text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                          Typical all-in budget (London, 2026)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-200">
                      {benchmarkRows.map(([scope, budget]) => (
                        <tr key={scope}>
                          <td className="px-5 py-4 font-medium text-stone-900">
                            {scope}
                          </td>
                          <td className="px-5 py-4 text-stone-700">{budget}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <p className="mt-5 text-base leading-7 text-stone-600">
              For room-by-room costs, borough premiums, hidden costs and what is
              driving 2026 prices, read the{" "}
              <Link
                href={`${siteUrl}/blog/home-renovation-cost-london-2026`}
                className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
              >
                full renovation cost breakdown for London
              </Link>{" "}
              in our complete 2026 guide.
            </p>
          </div>

          <div className="mt-10">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#266bf1]">
                Cost drivers
              </p>
              <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                What moves a renovation estimate up or down
              </h2>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {estimateFactors.map((factor) => (
                <article
                  key={factor.title}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <h3 className="text-lg font-semibold text-stone-950">
                    {factor.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-stone-600">
                    {factor.body}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h3 className="text-lg font-semibold text-blue-950">
                Linked project costs
              </h3>
              <p className="mt-3 text-base leading-7 text-blue-950/80">
                If your renovation also includes an extension, budget that
                separately with our{" "}
                <Link
                  href={`${siteUrl}/extension-calculator`}
                  className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
                >
                  house extension cost calculator
                </Link>
                . If the kitchen or bathrooms are a big part of the scope, the{" "}
                <Link
                  href={`${siteUrl}/kitchen-calculator`}
                  className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
                >
                  kitchen cost calculator
                </Link>{" "}
                and{" "}
                <Link
                  href={`${siteUrl}/tools/bathroom-cost-calculator`}
                  className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
                >
                  bathroom cost calculator
                </Link>{" "}
                will sharpen those line items.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#266bf1]">
                  Next steps
                </p>
                <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                  What to do with your estimate
                </h2>
              </div>
              <Link
                href={BOOKING_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center rounded-full bg-[#266bf1] px-5 text-sm font-semibold text-white transition hover:bg-[#1449B0]"
              >
                Book a consultation
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {nextSteps.map((step, index) => (
                <article
                  key={step.title}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                    {String(index + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-3 text-lg font-semibold text-stone-950">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-600">
                    {step.title === "Read the guide" ? (
                      <>
                        Our{" "}
                        <Link
                          href={step.href}
                          className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
                        >
                          {step.linkText}
                        </Link>{" "}
                        covers room-by-room costs, hidden fees, timelines,
                        borough variation and renovate-vs-move economics -
                        everything between rough budget and ready to start.
                      </>
                    ) : step.title === "Talk it through" ? (
                      <>
                        When you want a real answer for your property, book a
                        consultation with our{" "}
                        <Link
                          href={step.href}
                          className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
                        >
                          {step.linkText}
                        </Link>
                        . We will pressure-test the scope, budget and sequencing
                        before anything gathers momentum - no pressure, no
                        jargon.
                      </>
                    ) : (
                      step.body
                    )}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-base leading-7 text-stone-600">
              For the full explanation behind the ranges, hidden fees and
              borough premiums, read our{" "}
              <Link
                href={`${siteUrl}/blog/home-renovation-cost-london-2026`}
                className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
              >
                complete 2026 home renovation cost guide
              </Link>
              . For project-specific advice, talk to our{" "}
              <Link
                href={`${siteUrl}/general-renovation`}
                className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
              >
                design-and-build renovation team
              </Link>
              .
            </p>
          </div>
        </section>

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
    </div>
  );
}
