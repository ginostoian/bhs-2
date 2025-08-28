"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save, Plus, Trash2 } from "lucide-react";
import Link from "next/link";

export default function CreateTemplatePage() {
  const router = useRouter();
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
  });

  const projectTypes = [
    "Bathroom Renovation",
    "Kitchen Renovation",
    "Electrical Rewiring",
    "Boiler Installation",
    "Full Home Renovation",
    "Home Extension",
    "Loft Conversion",
    "Garden Work",
  ];

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

    try {
      const response = await fetch("/api/admin/quoting/templates", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        router.push("/admin/quoting/templates");
      } else {
        console.error("Failed to create template");
      }
    } catch (error) {
      console.error("Error creating template:", error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/quoting/templates"
            className="inline-flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Templates
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Create Quote Template
            </h1>
            <p className="text-gray-600">
              Set up a base template for a specific project type
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Basic Information */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Basic Information
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Template Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                placeholder="e.g., Standard Bathroom Renovation"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Project Type
              </label>
              <select
                value={formData.projectType}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    projectType: e.target.value,
                  }))
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                required
              >
                <option value="">Select project type</option>
                {projectTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={3}
              className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              placeholder="Describe what this template covers... (press Enter for new lines)"
            />
          </div>
        </div>

        {/* Base Services */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">Base Services</h2>
            <button
              type="button"
              onClick={addServiceCategory}
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Category
            </button>
          </div>

          {formData.baseServices.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="mb-6 rounded-lg border border-gray-200 p-4"
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
                  className="block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Category name (e.g., Demolition, Installation)"
                  required
                />
                <button
                  type="button"
                  onClick={() => removeServiceCategory(categoryIndex)}
                  className="ml-2 inline-flex items-center rounded-md border border-red-300 bg-red-50 px-2 py-1 text-sm text-red-700 hover:bg-red-100"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {category.items.map((item, itemIndex) => (
                  <div
                    key={itemIndex}
                    className="grid grid-cols-12 items-start gap-4"
                  >
                    <div className="col-span-3">
                      <input
                        type="text"
                        value={item.name}
                        onChange={(e) => {
                          const newItems = [...category.items];
                          newItems[itemIndex] = {
                            ...item,
                            name: e.target.value,
                          };
                          updateArrayFormData("baseServices", categoryIndex, {
                            items: newItems,
                          });
                        }}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Service name"
                        required
                      />
                    </div>
                    <div className="col-span-3">
                      <textarea
                        value={item.description}
                        onChange={(e) => {
                          const newItems = [...category.items];
                          newItems[itemIndex] = {
                            ...item,
                            description: e.target.value,
                          };
                          updateArrayFormData("baseServices", categoryIndex, {
                            items: newItems,
                          });
                        }}
                        rows={2}
                        className="block w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Description (press Enter for new lines)"
                      />
                    </div>
                    <div className="col-span-2">
                      <select
                        value={item.unit}
                        onChange={(e) => {
                          const newItems = [...category.items];
                          newItems[itemIndex] = {
                            ...item,
                            unit: e.target.value,
                          };
                          updateArrayFormData("baseServices", categoryIndex, {
                            items: newItems,
                          });
                        }}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        required
                      >
                        <option value="">Unit</option>
                        {units.map((unit) => (
                          <option key={unit} value={unit}>
                            {unit}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-2">
                      <input
                        type="number"
                        step="0.01"
                        value={item.basePrice}
                        onChange={(e) => {
                          const newItems = [...category.items];
                          newItems[itemIndex] = {
                            ...item,
                            basePrice: e.target.value,
                          };
                          updateArrayFormData("baseServices", categoryIndex, {
                            items: newItems,
                          });
                        }}
                        className="block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Base price"
                        required
                      />
                    </div>
                    <div className="col-span-1">
                      <button
                        type="button"
                        onClick={() =>
                          removeServiceItem(categoryIndex, itemIndex)
                        }
                        className="inline-flex items-center rounded-md border border-red-300 bg-red-50 px-2 py-1 text-sm text-red-700 hover:bg-red-100"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="col-span-12 mt-2">
                      <textarea
                        value={item.notes}
                        onChange={(e) => {
                          const newItems = [...category.items];
                          newItems[itemIndex] = {
                            ...item,
                            notes: e.target.value,
                          };
                          updateArrayFormData("baseServices", categoryIndex, {
                            items: newItems,
                          });
                        }}
                        rows={2}
                        className="block w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Additional notes (optional) (press Enter for new lines)"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <button
                type="button"
                onClick={() => addServiceItem(categoryIndex)}
                className="mt-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                <Plus className="mr-2 h-4 w-4" />
                Add Service Item
              </button>
            </div>
          ))}
        </div>

        {/* Default Pricing */}
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h2 className="mb-4 text-lg font-medium text-gray-900">
            Default Pricing
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                VAT Rate
              </label>
              <input
                type="number"
                step="0.1"
                value={formData.defaultPricing.vatRate}
                onChange={(e) =>
                  updateFormData("defaultPricing", {
                    vatRate: parseFloat(e.target.value),
                  })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex justify-end space-x-3">
          <Link
            href="/admin/quoting/templates"
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Save className="mr-2 h-4 w-4" />
            Create Template
          </button>
        </div>
      </form>
    </div>
  );
}
