"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { getProjectTypes } from "@/libs/formatProjectType";

export default function EditTemplatePage() {
  const params = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    projectType: "",
    baseServices: [
      {
        category: "",
        items: [
          {
            name: "",
            description: "",
            unit: "",
            basePrice: "",
            notes: "",
          },
        ],
      },
    ],
    defaultPricing: {
      vatRate: 20,
    },
    isActive: true,
  });

  const projectTypes = getProjectTypes();

  const units = [
    "sqm",
    "linear m",
    "job",
    "day",
    "hour",
    "piece",
    "set",
    "m2",
    "m3",
  ];

  useEffect(() => {
    if (params.id) {
      fetchTemplate();
    }
  }, [params.id]);

  const fetchTemplate = async () => {
    try {
      const response = await fetch(`/api/admin/quoting/templates/${params.id}`);
      if (response.ok) {
        const template = await response.json();
        setFormData({
          name: template.name,
          description: template.description,
          projectType: template.projectType,
          baseServices: template.baseServices.map((category) => ({
            category: category.category,
            items: category.items.map((item) => ({
              name: item.name,
              description: item.description,
              unit: item.unit,
              basePrice: item.basePrice.toString(),
              notes: item.notes || "",
            })),
          })),
          defaultPricing: {
            vatRate: template.defaultPricing?.vatRate || 20,
          },
          isActive: template.isActive !== false,
        });
      } else if (response.status === 404) {
        setError("Template not found");
      } else {
        setError("Failed to load template");
      }
    } catch (error) {
      console.error("Error fetching template:", error);
      setError("Failed to load template");
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (section, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: { ...prev[section], ...data },
    }));
  };

  const updateArrayFormData = (section, index, data) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].map((item, i) =>
        i === index ? { ...item, ...data } : item,
      ),
    }));
  };

  const addServiceCategory = () => {
    setFormData((prev) => ({
      ...prev,
      baseServices: [
        ...prev.baseServices,
        {
          category: "",
          items: [
            {
              name: "",
              description: "",
              unit: "",
              basePrice: "",
              notes: "",
            },
          ],
        },
      ],
    }));
  };

  const removeServiceCategory = (index) => {
    setFormData((prev) => ({
      ...prev,
      baseServices: prev.baseServices.filter((_, i) => i !== index),
    }));
  };

  const addServiceItem = (categoryIndex) => {
    setFormData((prev) => ({
      ...prev,
      baseServices: prev.baseServices.map((category, i) =>
        i === categoryIndex
          ? {
              ...category,
              items: [
                ...category.items,
                {
                  name: "",
                  description: "",
                  unit: "",
                  basePrice: "",
                  notes: "",
                },
              ],
            }
          : category,
      ),
    }));
  };

  const removeServiceItem = (categoryIndex, itemIndex) => {
    setFormData((prev) => ({
      ...prev,
      baseServices: prev.baseServices.map((category, i) =>
        i === categoryIndex
          ? {
              ...category,
              items: category.items.filter((_, j) => j !== itemIndex),
            }
          : category,
      ),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    // Validate required fields
    if (!formData.name.trim()) {
      alert("Template name is required");
      setSaving(false);
      return;
    }

    if (!formData.description.trim()) {
      alert("Template description is required");
      setSaving(false);
      return;
    }

    if (!formData.projectType) {
      alert("Project type is required");
      setSaving(false);
      return;
    }

    // Validate service categories and items
    for (let i = 0; i < formData.baseServices.length; i++) {
      const category = formData.baseServices[i];
      if (!category.category.trim()) {
        alert(`Category name is required for category ${i + 1}`);
        setSaving(false);
        return;
      }

      for (let j = 0; j < category.items.length; j++) {
        const item = category.items[j];
        if (
          !item.name.trim() ||
          !item.description.trim() ||
          !item.unit ||
          !item.basePrice
        ) {
          alert(
            `All fields are required for service item ${j + 1} in category "${category.category}"`,
          );
          setSaving(false);
          return;
        }
      }
    }

    try {
      // Transform the data to match the model exactly
      const transformedData = {
        name: formData.name,
        description: formData.description,
        projectType: formData.projectType,
        baseServices: formData.baseServices.map((category) => ({
          category: category.category,
          items: category.items.map((item) => ({
            name: item.name,
            description: item.description,
            unit: item.unit,
            basePrice: parseFloat(item.basePrice) || 0,
            notes: item.notes || "",
          })),
        })),
        defaultPricing: {
          vatRate: formData.defaultPricing.vatRate,
        },
        isActive: formData.isActive,
      };

      const response = await fetch(
        `/api/admin/quoting/templates/${params.id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(transformedData),
        },
      );

      if (response.ok) {
        router.push("/admin/quoting/templates");
      } else {
        const errorData = await response.json();
        console.error("Failed to update template:", errorData);
        alert(
          `Failed to update template: ${errorData.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error updating template:", error);
      alert(`Error updating template: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-2 text-sm text-gray-500">Loading template...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/quoting/templates"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
        </div>
        <div className="rounded-lg border border-red-200 bg-red-50 p-12 text-center">
          <h3 className="text-lg font-medium text-red-900">Error</h3>
          <p className="mt-2 text-sm text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/quoting/templates"
            className="inline-flex items-center text-blue-600 hover:text-blue-800"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Template</h1>
            <p className="text-sm text-gray-500">
              Update template settings and services
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            href={`/admin/quoting/templates/${params.id}/view`}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Eye className="mr-2 h-4 w-4" />
            View Template
          </Link>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Basic Information
            </h2>
          </div>
          <div className="space-y-4 px-6 py-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Template Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                  placeholder="e.g., Standard Bathroom Renovation"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Project Type *
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) =>
                    setFormData({ ...formData, projectType: e.target.value })
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
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                rows={3}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                placeholder="Describe what this template covers..."
                required
              />
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  VAT Rate (%)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="100"
                  value={formData.defaultPricing.vatRate}
                  onChange={(e) =>
                    updateFormData("defaultPricing", {
                      vatRate: parseFloat(e.target.value) || 0,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.isActive ? "active" : "inactive"}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isActive: e.target.value === "active",
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Base Services */}
        <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <div>
              <h2 className="text-lg font-medium text-gray-900">
                Base Services
              </h2>
              <p className="text-sm text-gray-500">
                Define the services included in this template
              </p>
            </div>
            <button
              type="button"
              onClick={addServiceCategory}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </button>
          </div>
          <div className="space-y-6 px-6 py-4">
            {formData.baseServices.map((category, categoryIndex) => (
              <div
                key={categoryIndex}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <div className="mb-4 flex items-center justify-between">
                  <input
                    type="text"
                    value={category.category}
                    onChange={(e) =>
                      updateArrayFormData("baseServices", categoryIndex, {
                        category: e.target.value,
                      })
                    }
                    className="border-none bg-transparent p-0 text-lg font-medium placeholder-gray-400 focus:outline-none focus:ring-0"
                    placeholder="Category Name (e.g., Plumbing, Electrical)"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => removeServiceCategory(categoryIndex)}
                    className="text-red-600 hover:text-red-800"
                    title="Remove Category"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="space-y-4">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="rounded-lg border border-gray-300 bg-white p-4"
                    >
                      <div className="mb-4 flex items-start justify-between">
                        <h4 className="text-md font-medium text-gray-900">
                          Service Item {itemIndex + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() =>
                            removeServiceItem(categoryIndex, itemIndex)
                          }
                          className="text-red-600 hover:text-red-800"
                          title="Remove Item"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Service Name *
                          </label>
                          <input
                            type="text"
                            value={item.name}
                            onChange={(e) => {
                              const updatedItems = [...category.items];
                              updatedItems[itemIndex] = {
                                ...item,
                                name: e.target.value,
                              };
                              updateArrayFormData(
                                "baseServices",
                                categoryIndex,
                                {
                                  items: updatedItems,
                                },
                              );
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            placeholder="e.g., Install new toilet"
                            required
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Unit *
                          </label>
                          <select
                            value={item.unit}
                            onChange={(e) => {
                              const updatedItems = [...category.items];
                              updatedItems[itemIndex] = {
                                ...item,
                                unit: e.target.value,
                              };
                              updateArrayFormData(
                                "baseServices",
                                categoryIndex,
                                {
                                  items: updatedItems,
                                },
                              );
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            required
                          >
                            <option value="">Select unit</option>
                            {units.map((unit) => (
                              <option key={unit} value={unit}>
                                {unit}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Base Price (£) *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={item.basePrice}
                            onChange={(e) => {
                              const updatedItems = [...category.items];
                              updatedItems[itemIndex] = {
                                ...item,
                                basePrice: e.target.value,
                              };
                              updateArrayFormData(
                                "baseServices",
                                categoryIndex,
                                {
                                  items: updatedItems,
                                },
                              );
                            }}
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Description *
                        </label>
                        <textarea
                          value={item.description}
                          onChange={(e) => {
                            const updatedItems = [...category.items];
                            updatedItems[itemIndex] = {
                              ...item,
                              description: e.target.value,
                            };
                            updateArrayFormData("baseServices", categoryIndex, {
                              items: updatedItems,
                            });
                          }}
                          rows={2}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          placeholder="Describe what this service includes..."
                          required
                        />
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Notes (Optional)
                        </label>
                        <textarea
                          value={item.notes}
                          onChange={(e) => {
                            const updatedItems = [...category.items];
                            updatedItems[itemIndex] = {
                              ...item,
                              notes: e.target.value,
                            };
                            updateArrayFormData("baseServices", categoryIndex, {
                              items: updatedItems,
                            });
                          }}
                          rows={2}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 sm:text-sm"
                          placeholder="Additional notes or requirements..."
                        />
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() => addServiceItem(categoryIndex)}
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Service Item
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/quoting/templates"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Save className="mr-2 h-4 w-4" />
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
}
