"use client";

import { useState, useEffect, createElement } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Eye,
  Calculator,
  User,
  MapPin,
  Package,
} from "lucide-react";

import ClientInfoForm from "./ClientInfoForm";
import ProjectDetailsForm from "./ProjectDetailsForm";
import ServicesForm from "./ServicesForm";
import PricingForm from "./PricingForm";
import QuotePreview from "./QuotePreview";

const SECTIONS = [
  {
    id: "client",
    title: "Client Information",
    component: ClientInfoForm,
    icon: User,
    description: "Customer details and contact information",
  },
  {
    id: "project",
    title: "Project Details",
    component: ProjectDetailsForm,
    icon: MapPin,
    description: "Project type, description, and location",
  },
  {
    id: "services",
    title: "Services & Items",
    component: ServicesForm,
    icon: Package,
    description: "Add and organize your services",
  },
  {
    id: "pricing",
    title: "Pricing & Totals",
    component: PricingForm,
    icon: Calculator,
    description: "Review pricing and calculations",
  },
];

export default function QuoteBuilder() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("client");
  const [completedSections, setCompletedSections] = useState(new Set());
  const [formData, setFormData] = useState({
    // Quote Title (top-level)
    title: "",

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
      description: "",
      address: "",
      startDate: "",
      estimatedDuration: "",
    },

    // Services
    services: [],

    // Pricing
    pricing: {
      depositRequired: true,
      depositAmount: 0,
      depositPercentage: 0,
    },

    // Template
    template: null,

    // User/Lead/Project linking
    linkedUser: null,
    linkedLead: null,
    linkedProject: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [quoteId, setQuoteId] = useState(null);
  const [isDraftSaved, setIsDraftSaved] = useState(false);

  // Load default template when project type is selected
  useEffect(() => {
    if (formData.project.type && !formData.template) {
      loadDefaultTemplate(formData.project.type);
    }
  }, [formData.project.type]);

  // Reset draft saved state when form data changes significantly
  useEffect(() => {
    if (isDraftSaved) {
      setIsDraftSaved(false);
    }
  }, [formData.client?.name, formData.project?.address, formData.services]);

  // Apply template when template ID is set manually
  useEffect(() => {
    if (formData.template && formData.services.length === 0) {
      // Template was selected but services not yet applied, fetch and apply the template
      fetchAndApplyTemplate(formData.template);
    }
  }, [formData.template]);

  // Handle adding additional template services
  useEffect(() => {
    if (formData.addTemplate) {
      // Add template services to existing services
      fetchAndAddTemplate(formData.addTemplate);
      // Clear the addTemplate flag
      updateFormData({
        addTemplate: null,
      });
    }
  }, [formData.addTemplate]);

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

  const fetchAndApplyTemplate = async (templateId) => {
    try {
      const response = await fetch(
        `/api/admin/quoting/templates/${templateId}`,
      );
      if (response.ok) {
        const template = await response.json();
        applyTemplate(template);
      }
    } catch (error) {
      console.error("Error fetching template:", error);
    }
  };

  const fetchAndAddTemplate = async (templateId) => {
    try {
      const response = await fetch(
        `/api/admin/quoting/templates/${templateId}`,
      );
      if (response.ok) {
        const template = await response.json();
        addTemplateServices(template);
      }
    } catch (error) {
      console.error("Error fetching template to add:", error);
    }
  };

  const applyTemplate = (template) => {
    if (!template) return;

    // Transform template services to match quote service structure
    // Deep clone template data to completely break references
    const templateCopy = JSON.parse(
      JSON.stringify(template.baseServices || []),
    );

    const servicesWithPricing = templateCopy.map((category) => {
      const items = category.items.map((item) => {
        // Ensure we convert to number properly
        let unitPrice = 0;
        if (item.basePrice !== null && item.basePrice !== undefined) {
          unitPrice = Number(item.basePrice);
          if (isNaN(unitPrice)) {
            console.warn(
              "Could not convert basePrice to number:",
              item.basePrice,
            );
            unitPrice = 0;
          }
        }

        const total = unitPrice; // Since quantity is 1 initially

        // Create a completely new object with ONLY the properties we want
        const transformedItem = {
          name: String(item.name || ""),
          description: String(item.description || ""),
          unit: String(item.unit || ""),
          quantity: 1, // Default quantity
          unitPrice: unitPrice, // Map basePrice to unitPrice (DO NOT include basePrice)
          total: total, // Initial total
          notes: String(item.notes || ""),
          source: "template", // Mark as template source
        };

        return transformedItem;
      });

      // Calculate category total
      const categoryTotal = items.reduce((sum, item) => sum + item.total, 0);

      return {
        type: "category", // Set type as category
        categoryName: String(category.category || ""), // Map category to categoryName
        items: items,
        categoryTotal: categoryTotal,
        order: 0, // Will be set properly when added to services
      };
    });

    setFormData((prev) => {
      // Set proper order values for template services
      const servicesWithOrder = servicesWithPricing.map((service, index) => ({
        ...service,
        order: index,
      }));

      const newData = {
        ...prev,
        template: template._id,
        services: servicesWithOrder,
        pricing: {
          ...prev.pricing,
          depositRequired: template.defaultPricing?.depositRequired || false,
          depositAmount: template.defaultPricing?.depositAmount || 0,
          depositPercentage: template.defaultPricing?.depositPercentage || 0,
        },
      };

      return newData;
    });

    toast.success(`Template "${template.name}" applied successfully!`);
  };

  const addTemplateServices = (template) => {
    if (!template) return;

    // Transform template services to match quote service structure
    const templateCopy = JSON.parse(
      JSON.stringify(template.baseServices || []),
    );

    const newServicesWithPricing = templateCopy.map((category) => {
      const items = category.items.map((item) => {
        // Ensure we convert to number properly
        let unitPrice = 0;
        if (item.basePrice !== null && item.basePrice !== undefined) {
          unitPrice = Number(item.basePrice);
          if (isNaN(unitPrice)) {
            console.warn(
              "Could not convert basePrice to number:",
              item.basePrice,
            );
            unitPrice = 0;
          }
        }

        const total = unitPrice; // Since quantity is 1 initially

        // Create a completely new object with ONLY the properties we want
        const transformedItem = {
          name: String(item.name || ""),
          description: String(item.description || ""),
          unit: String(item.unit || ""),
          quantity: 1, // Default quantity
          unitPrice: unitPrice, // Map basePrice to unitPrice
          total: total, // Initial total
          notes: String(item.notes || ""),
          source: "template", // Mark as template source
        };

        return transformedItem;
      });

      // Calculate category total
      const categoryTotal = items.reduce((sum, item) => sum + item.total, 0);

      return {
        type: "category", // Set type as category
        categoryName: String(category.category || ""), // Map category to categoryName
        items: items,
        categoryTotal: categoryTotal,
        order: 0, // Will be set properly when added to services
      };
    });

    setFormData((prev) => {
      // Add new services to existing services
      const currentServices = prev.services || [];
      const currentMaxOrder = Math.max(
        ...currentServices.map((s) => s.order || 0),
        -1,
      );

      // Set proper order values for new template services
      const servicesWithOrder = newServicesWithPricing.map(
        (service, index) => ({
          ...service,
          order: currentMaxOrder + 1 + index,
        }),
      );

      const newData = {
        ...prev,
        services: [...currentServices, ...servicesWithOrder],
      };

      return newData;
    });

    toast.success(`Template "${template.name}" services added successfully!`);
  };

  const updateFormData = (section, data) => {
    setFormData((prev) => {
      // Handle both calling patterns:
      // 1. updateFormData("client", { name: "John" })
      // 2. updateFormData({ client: { name: "John" } })

      if (typeof section === "object" && !data) {
        // Pattern 2: updateFormData({ client: { name: "John" } })
        const updates = section;
        let newState = { ...prev };

        Object.keys(updates).forEach((key) => {
          if (Array.isArray(updates[key])) {
            newState[key] = updates[key];
          } else if (
            typeof updates[key] === "object" &&
            updates[key] !== null
          ) {
            newState[key] = { ...newState[key], ...updates[key] };
          } else {
            newState[key] = updates[key];
          }
        });

        return newState;
      } else {
        // Pattern 1: updateFormData("client", { name: "John" })
        return {
          ...prev,
          [section]: Array.isArray(data) ? data : { ...prev[section], ...data },
        };
      }
    });
  };

  const switchSection = (sectionId) => {
    setActiveSection(sectionId);
  };

  const markSectionComplete = (sectionId) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]));
  };

  const getSectionStatus = (sectionId) => {
    if (completedSections.has(sectionId)) return "completed";
    if (activeSection === sectionId) return "active";
    return "pending";
  };

  const isSectionValid = (sectionId) => {
    switch (sectionId) {
      case "client":
        return formData.client.name && formData.client.email;
      case "project":
        return formData.project.type && formData.title;
      case "services":
        return formData.services.length > 0;
      case "pricing":
        return true;
      default:
        return false;
    }
  };

  const canGenerateQuote = () => {
    return SECTIONS.every((section) => isSectionValid(section.id));
  };

  const handleSaveDraft = async () => {
    setIsLoading(true);
    try {
      // Basic validation - check if we have at least some essential data
      if (!formData.client?.name || !formData.project?.address) {
        toast.error(
          "Please fill in client name and project address before saving draft",
        );
        return;
      }

      // Calculate built-in prices for each service item
      const servicesWithTotals = formData.services.map((category) => {
        const itemsWithTotals = category.items.map((item) => ({
          ...item,
          total:
            Math.round((item.quantity || 1) * (item.unitPrice || 0) * 100) /
            100,
        }));

        // Calculate category total
        const categoryTotal = itemsWithTotals.reduce(
          (sum, item) => sum + item.total,
          0,
        );

        return {
          ...category,
          items: itemsWithTotals,
          categoryTotal: Math.round(categoryTotal * 100) / 100,
        };
      });

      // Calculate the simple total (only from categories, not headings)
      let total = 0;
      if (servicesWithTotals && servicesWithTotals.length > 0) {
        servicesWithTotals.forEach((service) => {
          // Only calculate totals for categories, not headings
          if (service.type === "category" || !service.type) {
            // !service.type for backward compatibility
            service.items.forEach((item) => {
              total += item.total;
            });
          }
        });
      }

      // Create the draft quote object
      const draftQuote = {
        title: formData.title || "Draft Quote",
        projectType: formData.project.type || "custom",
        client: formData.client,
        projectAddress: formData.project.address,
        projectDescription:
          formData.project.description || "Draft project description",
        startDate: formData.project.startDate,
        estimatedDuration: formData.project.estimatedDuration || "TBD",
        services: servicesWithTotals,
        total: total,
        pricing: formData.pricing || {
          depositRequired: false,
          depositAmount: 0,
          depositPercentage: 0,
          vatRate: 20,
        },
        paymentTerms: {
          deposit: formData.pricing?.depositAmount || 0,
          milestones: [],
        },
        termsAndConditions: "Draft - terms to be finalized",
        warrantyInformation: "Draft - warranty information to be finalized",
        leadTime: "Draft - lead time to be finalized",
        validUntil: new Date(
          Date.now() + 30 * 24 * 60 * 60 * 1000,
        ).toISOString(),
        status: "draft", // Explicitly set as draft
      };

      // Only include linkedUser and linkedLead if they have valid values
      if (
        formData.linkedUser &&
        typeof formData.linkedUser === "string" &&
        formData.linkedUser.length === 24
      ) {
        draftQuote.linkedUser = formData.linkedUser;
      }
      if (
        formData.linkedLead &&
        typeof formData.linkedLead === "string" &&
        formData.linkedLead.length === 24
      ) {
        draftQuote.linkedLead = formData.linkedLead;
      }
      if (
        formData.linkedProject &&
        typeof formData.linkedProject === "string" &&
        formData.linkedProject.length === 24
      ) {
        draftQuote.project = formData.linkedProject;
      }

      // Save quote to database via API
      const response = await fetch("/api/admin/quoting", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(draftQuote),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save draft quote");
      }

      const result = await response.json();
      if (!result.success) {
        throw new Error(result.error || "Failed to save draft quote");
      }

      toast.success("Quote saved as draft successfully!");
      setIsDraftSaved(true);

      // Optionally redirect to the quote or stay on the form
      // You can uncomment the next line if you want to redirect to the saved quote
      // router.push(`/admin/quoting/${result.quote._id}`);
    } catch (error) {
      console.error("Error saving draft quote:", error);
      toast.error(error.message || "Error saving quote as draft");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateQuote = async () => {
    setIsLoading(true);
    try {
      // Calculate built-in prices for each service item
      // Calculate simple total from services
      const servicesWithTotals = formData.services.map((category) => {
        const itemsWithTotals = category.items.map((item) => ({
          ...item,
          total:
            Math.round((item.quantity || 1) * (item.unitPrice || 0) * 100) /
            100,
        }));

        // Calculate category total
        const categoryTotal = itemsWithTotals.reduce(
          (sum, item) => sum + item.total,
          0,
        );

        return {
          ...category,
          items: itemsWithTotals,
          categoryTotal: Math.round(categoryTotal * 100) / 100,
        };
      });

      // Calculate the simple total (only from categories, not headings)
      let total = 0;
      if (servicesWithTotals && servicesWithTotals.length > 0) {
        servicesWithTotals.forEach((service) => {
          // Only calculate totals for categories, not headings
          if (service.type === "category" || !service.type) {
            // !service.type for backward compatibility
            service.items.forEach((item) => {
              total += item.total;
            });
          }
        });
      }

      // Create the complete quote object
      const completeQuote = {
        title: formData.title || "Untitled Project",
        projectType: formData.project.type || "custom",
        client: formData.client,
        projectAddress: formData.project.address,
        projectDescription: formData.project.description,
        startDate: formData.project.startDate,
        estimatedDuration: formData.project.estimatedDuration,
        services: servicesWithTotals,
        total: total,
        pricing: formData.pricing,
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

      // Only include linkedUser and linkedLead if they have valid values
      if (
        formData.linkedUser &&
        typeof formData.linkedUser === "string" &&
        formData.linkedUser.length === 24
      ) {
        completeQuote.linkedUser = formData.linkedUser;
      }
      if (
        formData.linkedLead &&
        typeof formData.linkedLead === "string" &&
        formData.linkedLead.length === 24
      ) {
        completeQuote.linkedLead = formData.linkedLead;
      }
      if (
        formData.linkedProject &&
        typeof formData.linkedProject === "string" &&
        formData.linkedProject.length === 24
      ) {
        completeQuote.project = formData.linkedProject;
      }

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

  const activeComponent = SECTIONS.find(
    (s) => s.id === activeSection,
  )?.component;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Enhanced Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => router.push("/admin/quoting")}
                className="inline-flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Quotes
              </button>
              <div className="h-8 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  Create Quote
                </h1>
                <p className="mt-1 text-lg text-gray-600">
                  {formData.title || "New quote"}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-sm text-gray-500">Quote Total</div>
                <div className="text-2xl font-bold text-gray-900">
                  £{formData.total?.toFixed(2) || "0.00"}
                </div>
              </div>
              <div className="h-8 w-px bg-gray-300"></div>
              <div className="flex space-x-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={isLoading}
                  className={`inline-flex items-center rounded-xl px-6 py-3 text-sm font-semibold shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 ${
                    isDraftSaved
                      ? "border-2 border-green-300 bg-green-50 text-green-700 hover:bg-green-100 focus:ring-green-500"
                      : "border-2 border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-gray-50 focus:ring-blue-500"
                  }`}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {isDraftSaved ? "Draft Saved ✓" : "Save Draft"}
                </button>

                <button
                  onClick={handleGenerateQuote}
                  disabled={isLoading || !canGenerateQuote()}
                  className="inline-flex items-center rounded-xl bg-gradient-to-r from-green-600 to-green-700 px-6 py-3 text-sm font-semibold text-white shadow-lg transition-all hover:from-green-700 hover:to-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
                >
                  <Eye className="mr-2 h-4 w-4" />
                  Generate Quote
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex min-h-screen">
        {/* Enhanced Sidebar Navigation */}
        <div className="w-80 overflow-y-auto border-r border-gray-200 bg-white shadow-lg">
          <div className="p-6">
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                Quote Sections
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Complete each section to build your quote
              </p>
            </div>
            <nav className="space-y-3">
              {SECTIONS.map((section) => {
                const Icon = section.icon;
                const status = getSectionStatus(section.id);
                const isValid = isSectionValid(section.id);

                return (
                  <button
                    key={section.id}
                    onClick={() => switchSection(section.id)}
                    className={`group flex w-full items-start rounded-xl border-2 p-5 text-left transition-all duration-200 ${
                      status === "active"
                        ? "border-blue-500 bg-blue-50 shadow-md ring-2 ring-blue-200"
                        : status === "completed"
                          ? "border-green-300 bg-green-50 shadow-sm hover:border-green-400"
                          : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50 hover:shadow-sm"
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div
                        className={`flex h-10 w-10 items-center justify-center rounded-full transition-all ${
                          status === "completed"
                            ? "bg-green-500 text-white shadow-lg"
                            : status === "active"
                              ? "bg-blue-500 text-white shadow-lg"
                              : isValid
                                ? "bg-gray-100 text-gray-600 group-hover:bg-gray-200"
                                : "bg-gray-100 text-gray-400"
                        }`}
                      >
                        {status === "completed" ? (
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
                          <Icon className="h-5 w-5" />
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex-1">
                      <h3 className="text-sm font-semibold text-gray-900">
                        {section.title}
                      </h3>
                      <p className="mt-1 text-xs text-gray-500">
                        {section.description}
                      </p>
                      {status === "completed" && (
                        <div className="mt-2 text-xs font-medium text-green-600">
                          ✓ Completed
                        </div>
                      )}
                      {!isValid && status !== "completed" && (
                        <div className="mt-2 text-xs font-medium text-red-500">
                          ⚠ Required fields missing
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </nav>

            {/* Quote Summary */}
            {formData.services.length > 0 && (
              <div className="mt-6 rounded-lg bg-gray-50 p-4">
                <h3 className="mb-2 text-sm font-medium text-gray-900">
                  Quote Summary
                </h3>
                <div className="space-y-1 text-sm text-gray-600">
                  <div className="flex justify-between">
                    <span>Services:</span>
                    <span>
                      {formData.services.reduce(
                        (total, cat) => total + cat.items.length,
                        0,
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Categories:</span>
                    <span>{formData.services.length}</span>
                  </div>
                  <div className="flex justify-between border-t border-gray-200 pt-2 font-medium text-gray-900">
                    <span>Total:</span>
                    <span>
                      £
                      {formData.services
                        .reduce(
                          (total, cat) => total + (cat.categoryTotal || 0),
                          0,
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Enhanced Main Content */}
        <div className="flex-1 overflow-auto bg-gradient-to-br from-gray-50 to-gray-100">
          <div className="mx-auto max-w-6xl p-8">
            <div className="rounded-2xl bg-white shadow-xl">
              <div className="p-8">
                {activeComponent &&
                  createElement(activeComponent, {
                    formData,
                    updateFormData,
                    onComplete: () => markSectionComplete(activeSection),
                    quoteId,
                  })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
