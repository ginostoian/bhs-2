"use client";

import React, { useState } from "react";
import Link from "next/link";
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

const siteUrl = "https://bhstudio.co.uk";
const pageUrl = `${siteUrl}/extension-calculator`;

const calculatorFaqs = [
  {
    question: "How accurate is this extension calculator?",
    answer:
      "It is designed for early budgeting, not a final quote. The tool gives a low / expected / high range and widens that range when you don't yet have plans or confirmed planning status. Accuracy improves significantly once you have measured or architect drawings and a site survey.",
  },
  {
    question: "Why do you show a range instead of one exact price?",
    answer:
      "Exact pricing before surveys and drawings is usually misleading. Build cost depends on structural details, access, specification, and hidden site conditions. A transparent range is more trustworthy and more useful for budgeting decisions.",
  },
  {
    question: "Does the estimate include VAT and contingency?",
    answer:
      "Yes. The result screen clearly separates base build cost, extras, professional/statutory fees, contingency, and VAT. VAT is applied to taxable costs such as build work, extras, professional fees and contingency; statutory fees are shown separately.",
  },
  {
    question: "What if I don't know planning or structural details yet?",
    answer:
      "That's normal. The calculator is built for homeowners at an early stage. If you leave planning/professional fees unselected, it automatically includes sensible allowances based on your answers.",
  },
  {
    question: "Do you only work in London?",
    answer:
      "Better Homes primarily serves London, so London is the main pricing focus of this tool, including a zone option. We also include other UK regions so homeowners can still use the calculator for budgeting comparisons.",
  },
  {
    question: "What should I do after getting my estimate?",
    answer:
      "Download the PDF, compare the expected and high ranges, then speak to an architect/designer or builder with your rough brief. Once you have plans, update the calculator and request a survey-based quote.",
  },
  {
    question: "How much does a house extension cost per square metre in the UK?",
    answer:
      "In London, extension construction costs typically run £2,500 to £4,500 per square metre in 2026 depending on specification, with inner boroughs at a 15-30% premium. Outside London, rates are generally lower. Remember that per-square-metre figures usually exclude VAT, professional fees and fit-out - this calculator includes them so your budget is realistic from the start.",
  },
  {
    question: "Is this calculator free, and do I have to give my details?",
    answer:
      "The calculator is free and you can see your low/expected/high estimate on screen without entering any contact details. If you'd like the full PDF breakdown with the budget checklist, we ask for your name and email so we can send it to you.",
  },
];

const calculatorSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${pageUrl}#webapplication`,
      name: "House Extension Cost Calculator UK",
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
      mainEntity: calculatorFaqs.map((faq) => ({
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
          name: "Extension Calculator",
          item: pageUrl,
        },
      ],
    },
  ],
};

const faqContent = calculatorFaqs.map((faq) => ({
  question: faq.question,
  answer: <p>{faq.answer}</p>,
}));

const benchmarkRows = [
  ["Side return extension", "£35,000 - £60,000"],
  ["Single-storey rear extension", "£50,000 - £95,000"],
  ["Wraparound (L-shaped) extension", "£75,000 - £140,000"],
  ["Kitchen extension with fit-out", "£80,000 - £160,000"],
  ["Double-storey extension", "£100,000 - £200,000+"],
];

const estimateFactors = [
  {
    title: "Size and type",
    body:
      "Cost doesn't scale evenly with floor area. A double-storey extension shares foundations and roof between two floors, so its per-square-metre rate is lower than a single-storey, but the total project is bigger. Wraparounds carry the most structural work per square metre because two external walls come out.",
  },
  {
    title: "Specification",
    body:
      "The same shell can vary by £1,000+ per square metre depending on finish: standard plaster-and-paint at the low end; underfloor heating, bi-folds and engineered flooring mid-range; bespoke joinery, Crittall-style glazing and stone worktops at the top. Our calculator's complexity setting is a proxy for this, so be honest with it.",
  },
  {
    title: "Access and party walls",
    body:
      "Terraced houses, which make up much of London's stock, usually mean tighter access, more hand-balling of materials, scaffold licences and party wall agreements with one or both neighbours. These are real costs that flat-fee calculators ignore; this tool allows for them based on your property type.",
  },
  {
    title: "Where you are in London",
    body:
      "Inner-London boroughs typically run 15-30% above outer London for the same build, driven by labour rates, access logistics and parking/scaffold licensing. The calculator's London zone option accounts for this.",
  },
];

const nextSteps = [
  {
    number: "01",
    title: "Download your PDF",
    body:
      "It includes the full low/expected/high breakdown and a budget checklist, useful for finance conversations and for comparing builder quotes line by line.",
  },
  {
    number: "02",
    title: "Read the guide",
    body:
      "Use the guide to understand types, planning, building regs, party walls and value: everything between rough budget and ready to build.",
  },
  {
    number: "03",
    title: "Talk it through",
    body:
      "When you want a real answer for your specific property, book a feasibility consultation and pressure-test the budget before anything gathers momentum.",
  },
];

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(calculatorSchema) }}
      />
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="mb-10 grid gap-6 rounded-3xl border border-stone-200 bg-white/90 p-6 shadow-2xl shadow-stone-900/5 backdrop-blur md:grid-cols-[1.3fr_1fr] md:p-8">
          <div>
            <div className="inline-flex items-center rounded-full border border-stone-300 bg-stone-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
              London-first pricing tool
            </div>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-stone-900 md:text-5xl">
              House Extension Cost Calculator UK
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

        <section className="mx-auto mt-16 max-w-6xl">
          <div className="mb-8 max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#266bf1]">
              Budget guidance
            </p>
            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950 md:text-5xl">
              Make sense of your extension estimate
            </h2>
            <p className="mt-4 text-lg leading-8 text-stone-600">
              Use the calculator first, then use these notes to understand the
              range, the assumptions and the next step before asking for quotes.
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_0.85fr]">
            <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#266bf1] text-sm font-bold text-white">
                01
              </div>
              <h3 className="mt-5 text-2xl font-semibold tracking-tight text-stone-950">
                How this extension cost calculator works
              </h3>
              <div className="mt-4 space-y-4 text-base leading-8 text-stone-700">
                <p>
                  Most online extension calculators give you a single number,
                  which is exactly why most extension budgets go wrong. Build
                  cost depends on structure, access, specification and site
                  conditions that no early-stage tool can see, so an honest
                  calculator gives you a range, not a promise.
                </p>
                <p>
                  This tool asks for the essentials: property type, location,
                  extension type, size and complexity. It returns a low /
                  expected / high budget with professional and statutory fees,
                  contingency, and VAT at 20% broken out separately. If you
                  don&apos;t yet have drawings or confirmed planning status, it
                  widens the range and applies sensible fee allowances
                  automatically, then gives you a confidence score.
                </p>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {["Low / expected / high", "Fees + VAT separated", "PDF budget checklist"].map(
                  (item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-blue-100 bg-blue-50 px-4 py-3 text-sm font-semibold text-blue-950"
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </article>

            <article className="rounded-3xl border border-slate-900 bg-slate-900 p-6 text-white shadow-xl shadow-slate-900/15 md:p-8">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-blue-200">
                Why ranges matter
              </p>
              <h3 className="mt-4 text-2xl font-semibold tracking-tight">
                Plan with the high end before you commit.
              </h3>
              <p className="mt-4 text-base leading-8 text-stone-200">
                The expected figure is useful for orientation. The high figure is
                the number to use when checking finance, contingency and whether
                the project still makes sense if hidden conditions appear.
              </p>
              <div className="mt-6 rounded-2xl border border-white/10 bg-white/10 p-4">
                <p className="text-sm font-semibold text-white">
                  Best use of this estimate
                </p>
                <p className="mt-2 text-sm leading-6 text-stone-200">
                  Brief architects, compare builder quotes and refine the range
                  once measured drawings and a site survey are ready.
                </p>
              </div>
            </article>
          </div>

          <div className="mt-6 overflow-hidden rounded-3xl border border-stone-200 bg-white shadow-xl shadow-stone-900/5">
            <div className="grid gap-6 border-b border-stone-200 bg-stone-50 px-6 py-6 md:grid-cols-[0.9fr_1.1fr] md:px-8">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#266bf1]">
                  2026 benchmarks
                </p>
                <h3 className="mt-2 text-2xl font-semibold tracking-tight text-stone-950">
                  Typical London extension budgets
                </h3>
              </div>
              <p className="text-base leading-7 text-stone-600">
                Use these planning-stage ranges to sanity-check your result.
                Figures include build, fees and VAT at a mid-range
                specification.
              </p>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-stone-200">
                <thead className="bg-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-stone-500 md:px-8">
                      Extension type
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase tracking-[0.18em] text-stone-500 md:px-8">
                      Typical all-in budget
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {benchmarkRows.map(([type, budget]) => (
                    <tr key={type} className="transition hover:bg-blue-50/50">
                      <td className="px-6 py-4 text-base font-semibold text-stone-950 md:px-8">
                        {type}
                      </td>
                      <td className="px-6 py-4 text-base font-semibold text-[#266bf1] md:px-8">
                        {budget}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="border-t border-stone-200 px-6 py-5 text-base leading-7 text-stone-700 md:px-8">
              For per-square-metre rates, hidden costs, borough premiums and
              what&apos;s driving 2026 prices, read the{" "}
              <Link
                href={`${siteUrl}/blog/house-extension-guide-2025#extension-costs`}
                className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
              >
                full extension cost breakdown for London
              </Link>{" "}
              in our{" "}
              <Link
                href={`${siteUrl}/blog/house-extension-guide-2025`}
                className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
              >
                complete 2026 House Extension Guide
              </Link>
              .
            </p>
          </div>

          <div className="mt-10">
            <div className="max-w-3xl">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#266bf1]">
                Cost drivers
              </p>
              <h3 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                What moves an extension estimate up or down
              </h3>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {estimateFactors.map((factor) => (
                <article
                  key={factor.title}
                  className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm"
                >
                  <h4 className="text-lg font-semibold text-stone-950">
                    {factor.title}
                  </h4>
                  <p className="mt-3 text-base leading-7 text-stone-600">
                    {factor.body}
                  </p>
                </article>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-blue-100 bg-blue-50 p-6">
              <h4 className="text-lg font-semibold text-blue-950">
                Planning route and linked project costs
              </h4>
              <p className="mt-3 text-base leading-7 text-blue-950/80">
                Many single-storey rear and side return extensions qualify for
                permitted development, while larger and double-storey schemes
                usually need full planning. The{" "}
                <Link
                  href={`${siteUrl}/blog/house-extension-guide-2025#planning-permission`}
                  className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
                >
                  planning permission rules for extensions
                </Link>{" "}
                are covered in detail in our guide. If you&apos;re extending as
                part of a wider refurbishment, our{" "}
                <Link
                  href={`${siteUrl}/renovation-calculator`}
                  className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
                >
                  renovation cost calculator
                </Link>{" "}
                budgets the whole project.
              </p>
              <p className="mt-3 text-base leading-7 text-blue-950/80">
                If your project is really a kitchen transformation with an
                extension attached, run the numbers in our{" "}
                <Link
                  href={`${siteUrl}/kitchen-calculator`}
                  className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
                >
                  kitchen cost calculator
                </Link>{" "}
                too. The kitchen fit-out is often the biggest single line after
                the build itself.
              </p>
            </div>
          </div>

          <div className="mt-10 rounded-3xl border border-stone-200 bg-white p-6 shadow-xl shadow-stone-900/5 md:p-8">
            <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#266bf1]">
                  Next steps
                </p>
                <h3 className="mt-3 text-3xl font-semibold tracking-tight text-stone-950">
                  What to do with your estimate
                </h3>
              </div>
              <Link
                href={`${siteUrl}/house-extension`}
                className="inline-flex rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-black"
              >
                Speak to the design-and-build extension team
              </Link>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-3">
              {nextSteps.map((step) => (
                <article
                  key={step.number}
                  className="rounded-2xl border border-stone-200 bg-stone-50 p-5"
                >
                  <div className="text-xs font-bold uppercase tracking-[0.2em] text-[#266bf1]">
                    {step.number}
                  </div>
                  <h4 className="mt-3 text-lg font-semibold text-stone-950">
                    {step.title}
                  </h4>
                  <p className="mt-3 text-sm leading-6 text-stone-600">
                    {step.body}
                  </p>
                </article>
              ))}
            </div>
            <p className="mt-5 text-base leading-7 text-stone-700">
              Our{" "}
              <Link
                href={`${siteUrl}/blog/house-extension-guide-2025`}
                className="font-semibold text-[#266bf1] underline-offset-4 hover:underline"
              >
                complete 2026 House Extension Guide
              </Link>{" "}
              covers the detailed research between rough budget and ready to
              build.
            </p>
          </div>
        </section>

        <div className="mt-12">
          <FAQ content={faqContent} />
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
