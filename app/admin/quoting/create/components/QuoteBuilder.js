"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ChevronLeft,
  ChevronRight,
  Save,
  Eye,
  Download,
  Share2,
} from "lucide-react";

import ClientInfoForm from "./ClientInfoForm";
import ProjectDetailsForm from "./ProjectDetailsForm";
import ServicesForm from "./ServicesForm";
import PricingForm from "./PricingForm";
import QuotePreview from "./QuotePreview";

const STEPS = [
  { id: "client", title: "Client Information", component: ClientInfoForm },
  { id: "project", title: "Project Details", component: ProjectDetailsForm },
  { id: "services", title: "Services & Quantities", component: ServicesForm },
  { id: "pricing", title: "Pricing & Calculations", component: PricingForm },
  { id: "preview", title: "Preview & Generate", component: QuotePreview },
];

export default function QuoteBuilder() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    // Client Information
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
      postcode: "",
    },

    // Project Details
    project: {
      type: "",
      title: "",
      description: "",
      address: "",
      startDate: "",
      estimatedDuration: "",
    },

    // Services
    services: [],

    // Pricing
    pricing: {
      labourMultiplier: 1.0,
      materialsMultiplier: 1.0,
      overheadPercentage: 15,
      profitPercentage: 20,
      contingencyPercentage: 10,
      vatRate: 20,
      depositRequired: true,
      depositAmount: 0,
      depositPercentage: 0,
    },

    // Template
    template: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [quoteId, setQuoteId] = useState(null);

  // Load default template when project type is selected
  useEffect(() => {
    if (formData.project.type && !formData.template) {
      loadDefaultTemplate(formData.project.type);
    }
  }, [formData.project.type]);

  const loadDefaultTemplate = async (projectType) => {
    try {
      const response = await fetch(
        `/api/admin/quoting/templates?projectType=${projectType}`,
      );
      if (response.ok) {
        const templates = await response.json();
        if (templates.length > 0) {
          // Use the first template found for this project type
          const template = templates[0];
          applyTemplate(template);
        }
      }
    } catch (error) {
      console.error("Error loading template:", error);
    }
  };

  const applyTemplate = (template) => {
    if (!template) return;

    // Ensure template services have customer pricing fields initialized
    const servicesWithCustomerPricing = (template.baseServices || []).map(
      (category) => ({
        ...category,
        items: category.items.map((item) => ({
          ...item,
          customerUnitPrice: item.unitPrice || 0,
          customerTotal: item.total || 0,
        })),
      }),
    );

    setFormData((prev) => ({
      ...prev,
      template: template._id,
      services: servicesWithCustomerPricing,
      pricing: {
        ...prev.pricing,
        labourMultiplier: template.defaultPricing?.labourMultiplier || 1.0,
        materialsMultiplier:
          template.defaultPricing?.materialsMultiplier || 1.0,
        overheadPercentage: template.defaultPricing?.overheadPercentage || 15,
        profitPercentage: template.defaultPricing?.profitPercentage || 20,
        contingencyPercentage:
          template.defaultPricing?.contingencyPercentage || 10,
        vatRate: template.defaultPricing?.vatRate || 20,
      },
    }));

    toast.success(`Template "${template.name}" applied successfully!`);
  };

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: Array.isArray(data) ? data : { ...prev[section], ...data },
    }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 0: // Client Info
        return formData.client.name && formData.client.email;
      case 1: // Project Details
        return formData.project.type && formData.project.title;
      case 2: // Services
        return formData.services.length > 0;
      case 3: // Pricing
        return true;
      default:
        return true;
    }
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      // Save as draft
      toast.success("Quote saved as draft");
    } catch (error) {
      toast.error("Error saving quote");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuote = async () => {
    setIsLoading(true);
    try {
      // Calculate built-in prices for each service item
      const servicesWithCustomerPricing = formData.services.map((category) => ({
        ...category,
        items: category.items.map((item) => {
          // Calculate margins for this specific service item
          const itemSubtotal = item.total;
          const itemOverheads =
            itemSubtotal * (formData.pricing.overheadPercentage / 100);
          const itemProfit =
            itemSubtotal * (formData.pricing.profitPercentage / 100);
          const itemContingency =
            itemSubtotal * (formData.pricing.contingencyPercentage / 100);

          // Calculate customer-facing prices
          const customerUnitPrice =
            item.unitPrice +
            (itemOverheads + itemProfit + itemContingency) / item.quantity;
          const customerTotal =
            item.total + itemOverheads + itemProfit + itemContingency;

          return {
            ...item,
            customerUnitPrice: Math.round(customerUnitPrice * 100) / 100, // Round to 2 decimal places
            customerTotal: Math.round(customerTotal * 100) / 100, // Round to 2 decimal places
          };
        }),
      }));

      // Calculate the base total from raw service costs
      let baseTotal = 0;
      if (
        servicesWithCustomerPricing &&
        servicesWithCustomerPricing.length > 0
      ) {
        servicesWithCustomerPricing.forEach((category) => {
          category.items.forEach((item) => {
            baseTotal += item.total; // Use raw total, not customer total
          });
        });
      }

      // Apply pricing multipliers and percentages to the base total
      const labourCost = baseTotal * 0.6 * formData.pricing.labourMultiplier;
      const materialsCost =
        baseTotal * 0.4 * formData.pricing.materialsMultiplier;
      const subtotal = labourCost + materialsCost;
      const overheads = subtotal * (formData.pricing.overheadPercentage / 100);
      const profit = subtotal * (formData.pricing.profitPercentage / 100);
      const contingency =
        subtotal * (formData.pricing.contingencyPercentage / 100);
      const vat =
        (subtotal + overheads + profit + contingency) *
        (formData.pricing.vatRate / 100);
      const calculatedTotal = subtotal + overheads + profit + contingency + vat;

      // Create the complete quote object
      const completeQuote = {
        title: formData.project.title || "Untitled Project",
        projectType: formData.project.type || "general-renovation",
        client: formData.client,
        projectAddress: formData.project.address,
        projectDescription: formData.project.description,
        startDate: formData.project.startDate,
        estimatedDuration: formData.project.estimatedDuration,
        services: servicesWithCustomerPricing,
        costBreakdown: {
          subtotal: baseTotal,
          labourCost: labourCost,
          materialsCost: materialsCost,
          overheads: overheads,
          profit: profit,
          contingency: contingency,
          vat: vat,
          total: calculatedTotal,
        },
        calculationSettings: formData.pricing,
        paymentTerms: {
          deposit: formData.pricing.depositAmount || 0,
          milestones: [],
        },
        termsAndConditions:
          "Standard BH Studio terms and conditions apply. All work is guaranteed and insured. Payment terms: deposit required, then weekly payments until completion.",
        warrantyInformation:
          "All our work comes with a comprehensive workmanship guarantee covering our work from 1 year to 10 years depending on the project type and materials used.",
        leadTime: "We typically require 2 weeks notice to start a project.",
        validUntil: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      };

      // Save quote to database via API
      const response = await fetch("/api/admin/quoting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(completeQuote),
      });

      if (!response.ok) {
        throw new Error("Failed to save quote to database");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to save quote");
      }

      setQuoteId(result.quote._id);
      toast.success("Quote generated successfully!");

      // Redirect to quote history after a short delay
      setTimeout(() => {
        router.push("/admin/quoting/history");
      }, 1500);
    } catch (error) {
      console.error("Error generating quote:", error);
      toast.error("Error generating quote");
    } finally {
      setIsLoading(false);
    }
  };

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
      {/* Progress Bar */}
      <div className="border-b border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            {STEPS.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
                    index <= currentStep
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
                    index + 1
                  )}
                </div>
                <span
                  className={`ml-2 text-sm font-medium ${
                    index <= currentStep ? "text-blue-600" : "text-gray-500"
                  }`}
                >
                  {step.title}
                </span>
                {index < STEPS.length - 1 && (
                  <ChevronRight className="ml-4 h-4 w-4 text-gray-400" />
                )}
              </div>
            ))}
          </div>

          <div className="text-sm text-gray-500">
            Step {currentStep + 1} of {STEPS.length}
          </div>
        </div>
      </div>

      {/* Form Content */}
      <div className="p-6">
        <CurrentStepComponent
          formData={formData}
          updateFormData={updateFormData}
          onNext={nextStep}
          onPrev={prevStep}
          quoteId={quoteId}
        />
      </div>

      {/* Navigation */}
      <div className="border-t border-gray-200 bg-gray-50 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {currentStep > 0 && (
              <button
                onClick={prevStep}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ChevronLeft className="-ml-1 mr-2 h-4 w-4" />
                Previous
              </button>
            )}

            <button
              onClick={handleSaveDraft}
              disabled={isLoading}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Save className="-ml-1 mr-2 h-4 w-4" />
              Save Draft
            </button>
          </div>

          <div className="flex items-center space-x-3">
            {currentStep < STEPS.length - 1 && (
              <button
                onClick={nextStep}
                disabled={!canProceed()}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                Next
                <ChevronRight className="-ml-1 mr-2 h-4 w-4" />
              </button>
            )}

            {currentStep === STEPS.length - 1 && (
              <button
                onClick={handleGenerateQuote}
                disabled={isLoading || !canProceed()}
                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <Eye className="-ml-1 mr-2 h-4 w-4" />
                Generate Quote
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
