"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import ProjectDetailsForm from "../../../create/components/ProjectDetailsForm";
import ServicesForm from "../../../create/components/ServicesForm";
import QuotePreview from "../../../create/components/QuotePreview";
import { ChevronLeft, ChevronRight, Save, History } from "lucide-react";

const STEPS = [
  {
    id: "project-details",
    title: "Project Details",
    component: ProjectDetailsForm,
  },
  { id: "services", title: "Services & Items", component: ServicesForm },
  { id: "preview", title: "Preview & Save", component: QuotePreview },
];

export default function QuoteEditWizard({ quoteId }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [originalQuote, setOriginalQuote] = useState(null);
  const [editedQuote, setEditedQuote] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [showVersionHistory, setShowVersionHistory] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadQuote();
  }, [quoteId]);

  const loadQuote = async () => {
    try {
      const response = await fetch(`/api/admin/quoting/${quoteId}`);
      if (!response.ok) {
        throw new Error("Failed to load quote");
      }
      const result = await response.json();
      if (result.success) {
        setOriginalQuote(result.quote);

        // Transform database data to form data structure
        const formData = {
          project: {
            type: result.quote.projectType || "",
            description: result.quote.projectDescription || "",
            startDate: result.quote.startDate || "",
            estimatedDuration: result.quote.estimatedDuration || "",
            title: result.quote.title || "",
            address: result.quote.projectAddress || "",
          },
          client: result.quote.client || {},
          projectAddress: result.quote.projectAddress || "",
          warrantyInformation: result.quote.warrantyInformation || "",
          leadTime: result.quote.leadTime || "",
          validUntil: result.quote.validUntil || "",
          internalNotes: result.quote.internalNotes || "",
          specialInstructions: result.quote.specialInstructions || "",
          title: result.quote.title || "",
          services: result.quote.services || [],
          pricing: result.quote.pricing || {
            depositRequired: false,
            depositAmount: 0,
            depositPercentage: 0,
          },
          template: result.quote.template || null,
        };

        setEditedQuote(formData);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error loading quote:", error);
      toast.error("Failed to load quote");
    }
  };

  const handleQuoteUpdate = (updatedData) => {
    console.log("handleQuoteUpdate called with:", updatedData);
    console.log("Current editedQuote:", editedQuote);

    setEditedQuote((prev) => {
      const updated = { ...prev };

      // Handle nested updates properly
      Object.keys(updatedData).forEach((key) => {
        if (
          typeof updatedData[key] === "object" &&
          updatedData[key] !== null &&
          !Array.isArray(updatedData[key])
        ) {
          updated[key] = { ...updated[key], ...updatedData[key] };
        } else {
          updated[key] = updatedData[key];
        }
      });

      console.log("Updated quote:", updated);
      return updated;
    });

    // Delay the change check to ensure state is updated
    setTimeout(() => {
      checkForChanges();
    }, 0);
  };

  const checkForChanges = () => {
    if (!originalQuote || !editedQuote) return;

    // Transform original quote to form structure for comparison
    const originalFormData = {
      title: originalQuote.title,
      project: {
        type: originalQuote.projectType,
        description: originalQuote.projectDescription,
        startDate: originalQuote.startDate,
        estimatedDuration: originalQuote.estimatedDuration,
        title: originalQuote.title,
        address: originalQuote.projectAddress,
      },
      client: originalQuote.client,
      projectAddress: originalQuote.projectAddress,
      warrantyInformation: originalQuote.warrantyInformation,
      leadTime: originalQuote.leadTime,
      validUntil: originalQuote.validUntil,
      internalNotes: originalQuote.internalNotes,
      specialInstructions: originalQuote.specialInstructions,
      services: originalQuote.services,
      pricing: originalQuote.pricing || {
        depositRequired: false,
        depositAmount: 0,
        depositPercentage: 0,
      },
      template: originalQuote.template,
    };

    const changes =
      JSON.stringify(originalFormData) !== JSON.stringify(editedQuote);
    setHasChanges(changes);
  };

  const getChangesSummary = () => {
    if (!originalQuote || !editedQuote) return {};

    const changes = {};

    // Compare project details
    if (originalQuote.title !== editedQuote.title)
      changes.title = { from: originalQuote.title, to: editedQuote.title };
    if (originalQuote.projectType !== editedQuote.project?.type)
      changes.projectType = {
        from: originalQuote.projectType,
        to: editedQuote.project?.type,
      };
    if (originalQuote.projectDescription !== editedQuote.project?.description)
      changes.projectDescription = {
        from: originalQuote.projectDescription,
        to: editedQuote.project?.description,
      };
    if (
      originalQuote.estimatedDuration !== editedQuote.project?.estimatedDuration
    )
      changes.estimatedDuration = {
        from: originalQuote.estimatedDuration,
        to: editedQuote.project?.estimatedDuration,
      };

    // Compare client details
    if (
      JSON.stringify(originalQuote.client) !==
      JSON.stringify(editedQuote.client)
    ) {
      changes.client = { from: originalQuote.client, to: editedQuote.client };
    }

    // Compare services
    if (
      JSON.stringify(originalQuote.services) !==
      JSON.stringify(editedQuote.services)
    ) {
      changes.services = {
        from: originalQuote.services,
        to: editedQuote.services,
      };
    }

    // Compare other fields
    if (originalQuote.startDate !== editedQuote.project?.startDate)
      changes.startDate = {
        from: originalQuote.startDate,
        to: editedQuote.project?.startDate,
      };
    if (originalQuote.validUntil !== editedQuote.validUntil)
      changes.validUntil = {
        from: originalQuote.validUntil,
        to: editedQuote.validUntil,
      };
    if (originalQuote.warrantyInformation !== editedQuote.warrantyInformation)
      changes.warrantyInformation = {
        from: originalQuote.warrantyInformation,
        to: editedQuote.warrantyInformation,
      };
    if (originalQuote.leadTime !== editedQuote.leadTime)
      changes.leadTime = {
        from: originalQuote.leadTime,
        to: editedQuote.leadTime,
      };

    return changes;
  };

  const saveChanges = async () => {
    try {
      const changes = getChangesSummary();

      // Transform form data back to database structure
      const databaseData = {
        title: editedQuote.title,
        projectType: editedQuote.project.type,
        projectDescription: editedQuote.project.description,
        startDate: editedQuote.project.startDate,
        estimatedDuration: editedQuote.project.estimatedDuration,
        projectAddress: editedQuote.project.address,
        client: editedQuote.client,
        warrantyInformation: editedQuote.warrantyInformation,
        leadTime: editedQuote.leadTime,
        validUntil: editedQuote.validUntil,
        internalNotes: editedQuote.internalNotes,
        specialInstructions: editedQuote.specialInstructions,
        services: editedQuote.services,
        pricing: editedQuote.pricing,
        template: editedQuote.template,
        revisionHistory: [
          ...(originalQuote.revisionHistory || []),
          {
            version:
              `${parseFloat(originalQuote.version || "1.0") + 0.1}`.slice(0, 4),
            changes: JSON.stringify(changes),
            modifiedBy: "current-user", // This should come from auth context
            modifiedAt: new Date().toISOString(),
          },
        ],
        version: `${parseFloat(originalQuote.version || "1.0") + 0.1}`.slice(
          0,
          4,
        ),
        lastModifiedBy: "current-user", // This should come from auth context
      };

      const response = await fetch(`/api/admin/quoting/${quoteId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(databaseData),
      });

      if (!response.ok) {
        throw new Error("Failed to save changes");
      }

      const result = await response.json();
      if (result.success) {
        toast.success("Quote updated successfully");
        setOriginalQuote(result.quote);

        // Transform the updated quote back to form data structure
        const updatedFormData = {
          project: {
            type: result.quote.projectType || "",
            description: result.quote.projectDescription || "",
            startDate: result.quote.startDate || "",
            estimatedDuration: result.quote.estimatedDuration || "",
            title: result.quote.title || "",
            address: result.quote.projectAddress || "",
          },
          client: result.quote.client || {},
          projectAddress: result.quote.projectAddress || "",
          warrantyInformation: result.quote.warrantyInformation || "",
          leadTime: result.quote.leadTime || "",
          validUntil: result.quote.validUntil || "",
          internalNotes: result.quote.internalNotes || "",
          specialInstructions: result.quote.specialInstructions || "",
          title: result.quote.title || "",
          services: result.quote.services || [],
          pricing: result.quote.pricing || {
            depositRequired: false,
            depositAmount: 0,
            depositPercentage: 0,
          },
          template: result.quote.template || null,
        };

        setEditedQuote(updatedFormData);
        setHasChanges(false);
        router.push(`/admin/quoting/${quoteId}/preview`);
      }
    } catch (error) {
      console.error("Error saving changes:", error);
      toast.error("Failed to save changes");
    }
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

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading quote...</p>
        </div>
      </div>
    );
  }

  const CurrentStepComponent = STEPS[currentStep].component;

  return (
    <div className="space-y-8">
      {/* Header with Version History */}
      <div className="flex items-center justify-between rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Edit Quote #{originalQuote?.quoteNumber}
          </h1>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
            v{originalQuote?.version || "1.0"}
          </span>
        </div>
        <button
          onClick={() => setShowVersionHistory(!showVersionHistory)}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <History className="mr-2 h-4 w-4" />
          Version History
        </button>
      </div>

      {/* Version History Modal */}
      {showVersionHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-2xl rounded-lg border border-gray-200 bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between border-b border-gray-200 pb-4">
              <h3 className="text-xl font-semibold text-gray-900">
                📋 Quote Version History
              </h3>
              <button
                onClick={() => setShowVersionHistory(false)}
                className="rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              >
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="max-h-96 space-y-3 overflow-y-auto">
              {(originalQuote?.revisionHistory || []).map((revision, index) => (
                <div
                  key={index}
                  className="rounded-lg border border-gray-200 bg-gray-50 p-4"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-800">
                        Version {revision.version}
                      </span>
                      <span className="text-sm text-gray-600">
                        {new Date(revision.modifiedAt).toLocaleDateString(
                          "en-GB",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="mb-3">
                    <span className="text-sm text-gray-600">
                      <strong>Modified by:</strong>{" "}
                      {revision.modifiedBy || "Unknown"}
                    </span>
                  </div>

                  {revision.changes && (
                    <div className="rounded border border-gray-200 bg-white p-3">
                      <h4 className="mb-2 text-sm font-medium text-gray-900">
                        Changes Made:
                      </h4>
                      <div className="space-y-2 text-sm text-gray-700">
                        {Object.entries(JSON.parse(revision.changes)).map(
                          ([field, change], changeIndex) => (
                            <div
                              key={changeIndex}
                              className="flex items-start space-x-2"
                            >
                              <span className="mt-1 h-2 w-2 rounded-full bg-blue-500"></span>
                              <div>
                                <span className="font-medium">{field}:</span>
                                <div className="ml-2 text-gray-600">
                                  <div className="text-red-500 line-through">
                                    {change.from || "Not set"}
                                  </div>
                                  <div className="text-green-600">
                                    {change.to || "Not set"}
                                  </div>
                                </div>
                              </div>
                            </div>
                          ),
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}

              {(!originalQuote?.revisionHistory ||
                originalQuote.revisionHistory.length === 0) && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-8 text-center">
                  <div className="mb-2 text-gray-400">
                    <svg
                      className="mx-auto h-12 w-12"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm text-gray-500">
                    No previous versions found
                  </p>
                  <p className="mt-1 text-xs text-gray-400">
                    This is the first version of this quote
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 border-t border-gray-200 pt-4 text-center">
              <button
                onClick={() => setShowVersionHistory(false)}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Progress Bar */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>
              Step {currentStep + 1} of {STEPS.length}
            </span>
            <span>
              {Math.round(((currentStep + 1) / STEPS.length) * 100)}% Complete
            </span>
          </div>
          <div className="h-3 rounded-full bg-gray-200">
            <div
              className="h-3 rounded-full bg-blue-600 transition-all duration-300"
              style={{ width: `${((currentStep + 1) / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Step Navigation */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {STEPS.map((step, index) => (
              <button
                key={step.id}
                onClick={() => setCurrentStep(index)}
                className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                  index === currentStep
                    ? "border border-blue-200 bg-blue-100 text-blue-700"
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-700"
                }`}
              >
                {step.title}
              </button>
            ))}
          </div>

          {hasChanges && (
            <div className="flex items-center space-x-3">
              <span className="text-sm font-medium text-orange-600">
                ⚠️ Unsaved changes
              </span>
              <button
                onClick={saveChanges}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Save className="mr-2 h-4 w-4" />
                Save Changes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Current Step Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-8">
        <CurrentStepComponent
          formData={editedQuote}
          updateFormData={handleQuoteUpdate}
          isEditing={true}
          originalData={originalQuote}
        />
      </div>

      {/* Navigation Buttons */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="flex items-center justify-between">
          <button
            onClick={prevStep}
            disabled={currentStep === 0}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ChevronLeft className="mr-2 h-4 w-4" />
            Previous
          </button>

          <div className="flex items-center space-x-3">
            {currentStep < STEPS.length - 1 ? (
              <button
                onClick={nextStep}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </button>
            ) : (
              <button
                onClick={saveChanges}
                disabled={!hasChanges}
                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Save className="mr-2 h-4 w-4" />
                Save & Finish
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
