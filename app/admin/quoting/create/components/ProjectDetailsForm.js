"use client";

import { useState, useEffect } from "react";
import { FileText, CheckCircle, XCircle } from "lucide-react";

export default function ProjectDetailsForm({ formData, updateFormData }) {
  const [availableTemplates, setAvailableTemplates] = useState([]);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  // Fetch available templates when project type changes
  useEffect(() => {
    if (formData.project.type) {
      fetchTemplates(formData.project.type);
    }
  }, [formData.project.type]);

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

  const handleTemplateSelect = (template) => {
    setSelectedTemplate(template);
    // The template will be applied in the parent component
    updateFormData("template", template._id);

    // Also update the services and pricing from the template
    updateFormData("services", template.baseServices || []);
    updateFormData("pricing", {
      labourMultiplier: template.defaultPricing?.labourMultiplier || 1.0,
      materialsMultiplier: template.defaultPricing?.materialsMultiplier || 1.0,
      overheadPercentage: template.defaultPricing?.overheadPercentage || 15,
      profitPercentage: template.defaultPricing?.profitPercentage || 20,
      contingencyPercentage:
        template.defaultPricing?.contingencyPercentage || 10,
      vatRate: template.defaultPricing?.vatRate || 20,
    });
  };
  const projectTypes = [
    { value: "bathroom-renovation", label: "Bathroom Renovation" },
    { value: "kitchen-renovation", label: "Kitchen Renovation" },
    { value: "electrical-rewiring", label: "Electrical Rewiring" },
    { value: "boiler-installation", label: "Boiler Installation/Relocation" },
    { value: "full-home-renovation", label: "Full Home Renovation" },
    { value: "home-extension", label: "Home Extension" },
    { value: "loft-conversion", label: "Loft Conversion" },
    { value: "garden-work", label: "Garden Work" },
    { value: "custom", label: "Custom Project" },
  ];

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
            value={formData.project.type}
            onChange={(e) =>
              updateFormData("project", { type: e.target.value })
            }
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
        {formData.project.type && (
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
                          updateFormData("template", null);
                          updateFormData("services", []);
                          updateFormData("pricing", {
                            labourMultiplier: 1.0,
                            materialsMultiplier: 1.0,
                            overheadPercentage: 15,
                            profitPercentage: 20,
                            contingencyPercentage: 10,
                            vatRate: 20,
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
            value={formData.project.title}
            onChange={(e) =>
              updateFormData("project", { title: e.target.value })
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
            value={formData.project.description}
            onChange={(e) =>
              updateFormData("project", { description: e.target.value })
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
            value={formData.project.address}
            onChange={(e) =>
              updateFormData("project", { address: e.target.value })
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
            value={formData.project.startDate}
            onChange={(e) =>
              updateFormData("project", { startDate: e.target.value })
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
            value={formData.project.estimatedDuration}
            onChange={(e) =>
              updateFormData("project", { estimatedDuration: e.target.value })
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
