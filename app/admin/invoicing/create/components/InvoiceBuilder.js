"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Save,
  Eye,
  User,
  FileText,
  Package,
  Calculator,
} from "lucide-react";

import ClientInfoForm from "./ClientInfoForm";
import InvoiceDetailsForm from "./InvoiceDetailsForm";
import LineItemsForm from "./LineItemsForm";
import InvoiceTotalsForm from "./InvoiceTotalsForm";
import apiClient from "@/libs/api";

const SECTIONS = [
  {
    id: "client",
    title: "Client Information",
    component: ClientInfoForm,
    icon: User,
    description: "Customer details and contact information",
  },
  {
    id: "details",
    title: "Invoice Details",
    component: InvoiceDetailsForm,
    icon: FileText,
    description: "Invoice title, due date, and terms",
  },
  {
    id: "lineitems",
    title: "Line Items",
    component: LineItemsForm,
    icon: Package,
    description: "Add and manage invoice line items",
  },
  {
    id: "totals",
    title: "Review & Totals",
    component: InvoiceTotalsForm,
    icon: Calculator,
    description: "Review totals and finalize invoice",
  },
];

export default function InvoiceBuilder() {
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("client");
  const [completedSections, setCompletedSections] = useState(new Set());
  const [formData, setFormData] = useState({
    // Invoice details
    title: "",
    dueDate: "",
    notes: "",
    terms:
      "Payment due within 30 days of invoice date. Late payment charges may apply.",

    // Client information
    client: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },

    // Line items
    lineItems: [],

    // Linked entities (will be set when client is selected)
    linkedUser: null,
    linkedLead: null,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [invoiceId, setInvoiceId] = useState(null);

  const updateFormData = (section, data) => {
    setFormData((prev) => {
      // If data is not an object, treat it as a direct field update
      if (typeof data !== "object" || data === null) {
        return {
          ...prev,
          [section]: data,
        };
      }

      // Otherwise, treat it as a section update
      return {
        ...prev,
        [section]: { ...prev[section], ...data },
      };
    });
  };

  const updateArrayFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: data,
    }));
  };

  const markSectionComplete = useCallback((sectionId) => {
    setCompletedSections((prev) => new Set([...prev, sectionId]));
  }, []);

  const markSectionIncomplete = useCallback((sectionId) => {
    setCompletedSections((prev) => {
      const newSet = new Set(prev);
      newSet.delete(sectionId);
      return newSet;
    });
  }, []);

  const validateSection = (sectionId) => {
    switch (sectionId) {
      case "client":
        return !!(
          formData.client.name &&
          formData.client.email &&
          formData.client.phone &&
          formData.client.address
        );
      case "details":
        return !!formData.title;
      case "lineitems":
        return formData.lineItems.length > 0;
      case "totals":
        return true; // Always valid for review
      default:
        return false;
    }
  };

  const handleGenerateInvoice = async () => {
    setIsLoading(true);
    try {
      // Calculate totals for each line item and clean up the data
      const lineItemsWithTotals = formData.lineItems.map((item) => {
        const subtotal = item.priceExclVat * item.quantity;
        const vat = subtotal * (item.vatRate / 100);
        const totalVatIncluded = subtotal + vat;

        // Remove the temporary 'id' and 'order' fields that are only used for UI
        const { id, order, ...cleanItem } = item;

        return {
          ...cleanItem,
          totalVatIncluded: parseFloat(totalVatIncluded.toFixed(2)),
        };
      });

      // Calculate overall totals
      const subtotal = lineItemsWithTotals.reduce((sum, item) => {
        return sum + item.priceExclVat * item.quantity;
      }, 0);

      const totalVat = lineItemsWithTotals.reduce((sum, item) => {
        const itemSubtotal = item.priceExclVat * item.quantity;
        const itemVat = itemSubtotal * (item.vatRate / 100);
        return sum + itemVat;
      }, 0);

      const total = subtotal + totalVat;

      // Create the complete invoice object
      const completeInvoice = {
        title: formData.title || "Untitled Invoice",
        client: formData.client,
        lineItems: lineItemsWithTotals,
        subtotal: parseFloat(subtotal.toFixed(2)),
        totalVat: parseFloat(totalVat.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
        dueDate: formData.dueDate || null,
        notes: formData.notes || "",
        terms: formData.terms,
        status: "draft",
      };

      // Only include linkedUser and linkedLead if they have valid values
      if (
        formData.linkedUser &&
        typeof formData.linkedUser === "string" &&
        formData.linkedUser.length === 24
      ) {
        completeInvoice.linkedUser = formData.linkedUser;
      }
      if (
        formData.linkedLead &&
        typeof formData.linkedLead === "string" &&
        formData.linkedLead.length === 24
      ) {
        completeInvoice.linkedLead = formData.linkedLead;
      }

      // Save invoice to database via API
      const response = await apiClient.post(
        "/admin/invoicing",
        completeInvoice,
      );

      if (!response.success) {
        throw new Error(response.error || "Failed to save invoice");
      }

      setInvoiceId(response.invoice._id);
      toast.success(
        "Invoice created successfully! You can now preview or continue editing.",
      );

      // Remove automatic redirect to prevent conflicts with preview button
      // User can manually go back to dashboard if needed
    } catch (error) {
      console.error("Error generating invoice:", error);
      toast.error(
        error.message || "Failed to create invoice. Please try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  const canGenerateInvoice = () => {
    return (
      validateSection("client") &&
      validateSection("details") &&
      validateSection("lineitems")
    );
  };

  const ActiveComponent = SECTIONS.find(
    (section) => section.id === activeSection,
  )?.component;

  return (
    <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
      {/* Navigation Sidebar */}
      <div className="lg:col-span-1">
        <nav className="space-y-2">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isCompleted = completedSections.has(section.id);
            const isValid = validateSection(section.id);

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`w-full rounded-lg border p-4 text-left transition-colors ${
                  isActive
                    ? "border-blue-200 bg-blue-50 text-blue-900"
                    : isCompleted || isValid
                      ? "border-green-200 bg-green-50 text-green-900 hover:bg-green-100"
                      : "border-gray-200 bg-white text-gray-700 hover:bg-gray-50"
                }`}
              >
                <div className="flex items-center">
                  <Icon
                    className={`h-5 w-5 ${
                      isActive
                        ? "text-blue-600"
                        : isCompleted || isValid
                          ? "text-green-600"
                          : "text-gray-400"
                    }`}
                  />
                  <div className="ml-3">
                    <div className="flex items-center">
                      <span className="text-sm font-medium">
                        {section.title}
                      </span>
                      {(isCompleted || isValid) && (
                        <div className="ml-2 h-2 w-2 rounded-full bg-green-500"></div>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      {section.description}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button
            onClick={handleGenerateInvoice}
            disabled={!canGenerateInvoice() || isLoading}
            className="inline-flex w-full items-center justify-center rounded-md border border-transparent bg-green-600 px-4 py-3 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {isLoading ? "Creating..." : "Create Invoice"}
          </button>

          {invoiceId && (
            <>
              <button
                onClick={() => {
                  if (!invoiceId) {
                    toast.error(
                      "Invoice ID not found. Please try creating the invoice again.",
                    );
                    return;
                  }
                  router.push(`/admin/invoicing/${invoiceId}/preview`);
                }}
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Eye className="mr-2 h-4 w-4" />
                Preview Invoice
              </button>

              <button
                onClick={() => router.push("/admin/invoicing")}
                className="inline-flex w-full items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Dashboard
              </button>
            </>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:col-span-3">
        <div className="rounded-lg bg-white shadow">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              {SECTIONS.find((s) => s.id === activeSection)?.title}
            </h2>
            <p className="text-sm text-gray-500">
              {SECTIONS.find((s) => s.id === activeSection)?.description}
            </p>
          </div>

          <div className="p-6">
            {ActiveComponent && (
              <ActiveComponent
                formData={formData}
                updateFormData={updateFormData}
                updateArrayFormData={updateArrayFormData}
                markSectionComplete={markSectionComplete}
                markSectionIncomplete={markSectionIncomplete}
                goToNextSection={() => {
                  const currentIndex = SECTIONS.findIndex(
                    (s) => s.id === activeSection,
                  );
                  if (currentIndex < SECTIONS.length - 1) {
                    setActiveSection(SECTIONS[currentIndex + 1].id);
                  }
                }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
