"use client";

import { useState, useEffect, useMemo } from "react";
import { FileText, CheckCircle, XCircle } from "lucide-react";
import { getProjectTypes } from "@/libs/formatProjectType";

export default function ProjectDetailsForm({
  formData,
  updateFormData,
  isEditing = false,
  originalData = null,
}) {
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [allTemplates, setAllTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [showAllTemplates, setShowAllTemplates] = useState(false);
  const [loadingAllTemplates, setLoadingAllTemplates] = useState(false);

  // Ensure formData has the required structure
  const safeFormData = useMemo(
    () => ({
      project: formData.project || {},
      client: formData.client || {},
      projectAddress: formData.projectAddress || "",
      warrantyInformation: formData.warrantyInformation || "",
      leadTime: formData.leadTime || "",
      validUntil: formData.validUntil || "",
      internalNotes: formData.internalNotes || "",
      specialInstructions: formData.specialInstructions || "",
      title: formData.title || "",
      services: formData.services || [],
      pricing: formData.pricing || {
        depositRequired: false,
        depositAmount: 0,
        depositPercentage: 0,
      },
      template: formData.template || null,
    }),
    [formData],
  );

  // Initialize form with existing data when editing
  useEffect(() => {
    if (isEditing && originalData && !safeFormData.project?.type) {
      // Pre-populate form with existing data
      updateFormData({
        project: {
          type: originalData.projectType || "",
          description: originalData.projectDescription || "",
          startDate: originalData.startDate || "",
          estimatedDuration: originalData.estimatedDuration || "",
          title: originalData.title || "",
          address: originalData.projectAddress || "",
        },
        client: originalData.client || {},
        projectAddress: originalData.projectAddress || "",
        warrantyInformation: originalData.warrantyInformation || "",
        leadTime: originalData.leadTime || "",
        validUntil: originalData.validUntil || "",
        internalNotes: originalData.internalNotes || "",
        specialInstructions: originalData.specialInstructions || "",
        title: originalData.title || "",
        pricing: {
          depositRequired: originalData.pricing?.depositRequired || false,
          depositAmount: originalData.pricing?.depositAmount || 0,
          depositPercentage: originalData.pricing?.depositPercentage || 0,
        },
      });
    }
  }, [isEditing, originalData, updateFormData]);

  // Fetch available templates when project type changes
  useEffect(() => {
    if (safeFormData.project && safeFormData.project.type) {
      fetchTemplates(safeFormData.project.type);
    }
  }, [safeFormData.project?.type]);

  const fetchTemplates = async (projectType) => {
    setLoadingTemplates(true);
    try {
      const response = await fetch(
        `/api/admin/quoting/templates?projectType=${projectType}`,
      );
      if (response.ok) {
        const templates = await response.json();
        setAvailableTemplates(templates);
      }
    } catch (error) {
      console.error("Error fetching templates:", error);
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchAllTemplates = async () => {
    setLoadingAllTemplates(true);
    try {
      const response = await fetch(`/api/admin/quoting/templates`);
      if (response.ok) {
        const templates = await response.json();
        setAllTemplates(templates);
      }
    } catch (error) {
      console.error("Error fetching all templates:", error);
    } finally {
      setLoadingAllTemplates(false);
    }
  };

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // Only set the template ID - the QuoteBuilder will handle the transformation
    updateFormData({
      template: template._id,
    });
  };

  const handleAddTemplate = (template) => {
    // This will add the template services to existing services rather than replacing them
    // We'll let the QuoteBuilder handle this logic through a new method
    updateFormData({
      addTemplate: template._id, // Special key to indicate we want to add, not replace
    });
  };
  const projectTypes = getProjectTypes();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Project Details</h2>
        <p className="mt-1 text-sm text-gray-500">
          Please provide information about the project and its requirements.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <label
            htmlFor="project-type"
            className="block text-sm font-medium text-gray-700"
          >
            Project Type *
          </label>
          <select
            id="project-type"
            value={safeFormData.project?.type || ""}
            onChange={(e) => {
              updateFormData({
                project: {
                  ...safeFormData.project,
                  type: e.target.value,
                },
              });
            }}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            required
          >
            <option value="">Select project type</option>
            {projectTypes.map((type) => (
              <option key={type.value} value={type.value}>
                {type.label}
              </option>
            ))}
          </select>
        </div>

        {/* Template Selection */}
        {safeFormData.project?.type && (
          <div className="md:col-span-2">
            <label className="mb-3 block text-sm font-medium text-gray-700">
              Available Templates
            </label>
            {loadingTemplates ? (
              <div className="flex items-center justify-center py-4">
                <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                <span className="ml-2 text-sm text-gray-500">
                  Loading templates...
                </span>
              </div>
            ) : availableTemplates.length > 0 ? (
              <div className="space-y-3">
                {availableTemplates.map((template) => (
                  <div
                    key={template._id}
                    className={`cursor-pointer rounded-lg border p-4 transition-all ${
                      selectedTemplate?._id === template._id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <FileText className="h-5 w-5 text-blue-600" />
                        <div>
                          <h4 className="font-medium text-gray-900">
                            {template.name}
                          </h4>
                          <p className="text-sm text-gray-600">
                            {template.description || "No description"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {selectedTemplate?._id === template._id ? (
                          <CheckCircle className="h-5 w-5 text-green-600" />
                        ) : (
                          <XCircle className="h-5 w-5 text-gray-400" />
                        )}
                      </div>
                    </div>
                    {template.baseServices && (
                      <div className="mt-2 text-xs text-gray-500">
                        {template.baseServices.length} service categories
                        available
                      </div>
                    )}
                  </div>
                ))}
                {selectedTemplate && (
                  <div className="mt-3 rounded-lg border border-green-200 bg-green-50 p-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-green-800">
                          Template &quot;{selectedTemplate.name}&quot; selected.
                          Services and pricing will be pre-filled.
                        </span>
                      </div>
                      <button
                        onClick={() => {
                          setSelectedTemplate(null);
                          updateFormData({
                            template: null,
                            services: [],
                          });
                        }}
                        className="text-xs text-red-600 underline hover:text-red-800"
                      >
                        Clear Template
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 text-center text-sm text-gray-500">
                No templates available for this project type.
                <br />
                <span className="text-xs">
                  You can create a template first or proceed without one.
                </span>
                <div className="mt-2">
                  <a
                    href="/admin/quoting/templates/create"
                    className="inline-flex items-center text-xs text-blue-600 underline hover:text-blue-800"
                  >
                    <FileText className="mr-1 h-3 w-3" />
                    Create New Template
                  </a>
                </div>
              </div>
            )}

            {/* Browse All Templates */}
            <div className="mt-6 border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-md font-medium text-gray-900">
                    Browse All Templates
                  </h4>
                  <p className="text-sm text-gray-500">
                    Add services from any template to your quote
                  </p>
                </div>
                <button
                  onClick={() => {
                    setShowAllTemplates(!showAllTemplates);
                    if (!showAllTemplates && allTemplates.length === 0) {
                      fetchAllTemplates();
                    }
                  }}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  {showAllTemplates ? "Hide" : "Browse"} All Templates
                </button>
              </div>

              {showAllTemplates && (
                <div className="mt-4">
                  {loadingAllTemplates ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-blue-600"></div>
                      <span className="ml-2 text-sm text-gray-500">
                        Loading all templates...
                      </span>
                    </div>
                  ) : allTemplates.length > 0 ? (
                    <div className="space-y-3">
                      {allTemplates.map((template) => {
                        const isCurrentProjectType =
                          template.projectType === safeFormData.project?.type;
                        const isAlreadySelected =
                          selectedTemplate?._id === template._id;

                        return (
                          <div
                            key={template._id}
                            className={`rounded-lg border p-4 transition-all ${
                              isAlreadySelected
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <FileText className="h-5 w-5 text-blue-600" />
                                <div>
                                  <div className="flex items-center space-x-2">
                                    <h4 className="font-medium text-gray-900">
                                      {template.name}
                                    </h4>
                                    <span
                                      className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                        isCurrentProjectType
                                          ? "bg-green-100 text-green-800"
                                          : "bg-gray-100 text-gray-800"
                                      }`}
                                    >
                                      {template.projectType.replace("-", " ")}
                                    </span>
                                    {isCurrentProjectType && (
                                      <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                        Current Type
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600">
                                    {template.description || "No description"}
                                  </p>
                                  {template.baseServices && (
                                    <p className="text-xs text-gray-500">
                                      {template.baseServices.length} service
                                      categories
                                    </p>
                                  )}
                                </div>
                              </div>
                              <div className="flex space-x-2">
                                {!isAlreadySelected && (
                                  <>
                                    <button
                                      onClick={() =>
                                        handleTemplateSelect(template)
                                      }
                                      className="inline-flex items-center rounded-md border border-blue-600 bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
                                    >
                                      Use as Base
                                    </button>
                                    <button
                                      onClick={() =>
                                        handleAddTemplate(template)
                                      }
                                      className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-1 text-xs font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                                    >
                                      Add Services
                                    </button>
                                  </>
                                )}
                                {isAlreadySelected && (
                                  <span className="inline-flex items-center text-xs text-green-600">
                                    <CheckCircle className="mr-1 h-4 w-4" />
                                    Selected as Base
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-8 text-center text-sm text-gray-500">
                      No templates found.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        <div>
          <label
            htmlFor="project-title"
            className="block text-sm font-medium text-gray-700"
          >
            Project Title *
          </label>
          <input
            type="text"
            id="project-title"
            value={safeFormData.title || ""}
            onChange={(e) =>
              updateFormData({
                title: e.target.value,
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Master Bathroom Renovation"
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="project-description"
            className="block text-sm font-medium text-gray-700"
          >
            Project Description *
          </label>
          <textarea
            id="project-description"
            rows={4}
            value={safeFormData.project?.description || ""}
            onChange={(e) =>
              updateFormData({
                project: {
                  ...safeFormData.project,
                  description: e.target.value,
                },
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Please describe the project requirements, scope of work, and any specific details..."
            required
          />
        </div>

        <div className="md:col-span-2">
          <label
            htmlFor="project-address"
            className="block text-sm font-medium text-gray-700"
          >
            Project Address *
          </label>
          <textarea
            id="project-address"
            rows={3}
            value={safeFormData.project?.address || ""}
            onChange={(e) =>
              updateFormData({
                project: {
                  ...safeFormData.project,
                  address: e.target.value,
                },
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="Full address where the work will be carried out"
            required
          />
        </div>

        <div>
          <label
            htmlFor="project-start-date"
            className="block text-sm font-medium text-gray-700"
          >
            Preferred Start Date
          </label>
          <input
            type="date"
            id="project-start-date"
            value={safeFormData.project?.startDate || ""}
            onChange={(e) =>
              updateFormData({
                project: {
                  ...safeFormData.project,
                  startDate: e.target.value,
                },
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
          />
        </div>

        <div>
          <label
            htmlFor="project-duration"
            className="block text-sm font-medium text-gray-700"
          >
            Estimated Duration *
          </label>
          <input
            type="text"
            id="project-duration"
            value={safeFormData.project?.estimatedDuration || ""}
            onChange={(e) =>
              updateFormData({
                project: {
                  ...safeFormData.project,
                  estimatedDuration: e.target.value,
                },
              })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., 2-3 weeks, 1 month"
            required
          />
        </div>
      </div>
    </div>
  );
}
