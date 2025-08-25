"use client";

import { useState, useEffect } from "react";
import { X, Save, Calculator, DollarSign } from "lucide-react";

export default function EditTemplateServiceModal({
  templateService,
  onClose,
  onSuccess,
}) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    unit: "",
    pricingType: "fixed",
    fixedPrice: "",
    calculationConfig: {
      tradesperson: "",
      material: "",
      defaultQuantity: "",
      defaultMaterialQuantity: "",
    },
    notes: "",
    isActive: true,
  });

  const [loading, setLoading] = useState(false);
  const [rateCards, setRateCards] = useState([]);
  const [tradespeople, setTradespeople] = useState([]);
  const [materials, setMaterials] = useState([]);

  useEffect(() => {
    if (templateService) {
      setFormData({
        name: templateService.name || "",
        description: templateService.description || "",
        category: templateService.category || "",
        unit: templateService.unit || "",
        pricingType: templateService.pricingType || "fixed",
        fixedPrice: templateService.fixedPrice || "",
        calculationConfig: {
          tradesperson:
            templateService.calculationConfig?.tradesperson?._id || "",
          material: templateService.calculationConfig?.material?._id || "",
          defaultQuantity:
            templateService.calculationConfig?.defaultQuantity || "",
          defaultMaterialQuantity:
            templateService.calculationConfig?.defaultMaterialQuantity || "",
        },
        notes: templateService.notes || "",
        isActive:
          templateService.isActive !== undefined
            ? templateService.isActive
            : true,
      });
    }
    fetchRateCards();
  }, [templateService]);

  const fetchRateCards = async () => {
    try {
      const response = await fetch("/api/admin/quoting/rates?isActive=true", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRateCards(data);
        setTradespeople(data.filter((r) => r.type === "tradesperson"));
        setMaterials(data.filter((r) => r.type === "material"));
      }
    } catch (error) {
      console.error("Error fetching rate cards:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Clean and validate the data before sending
      const cleanedData = {
        ...formData,
        // Ensure numeric fields are numbers or undefined (not empty strings)
        fixedPrice:
          formData.pricingType === "fixed" &&
          formData.fixedPrice &&
          formData.fixedPrice !== ""
            ? parseFloat(formData.fixedPrice)
            : undefined,
        calculationConfig: {
          tradesperson:
            formData.calculationConfig.tradesperson &&
            formData.calculationConfig.tradesperson !== ""
              ? formData.calculationConfig.tradesperson
              : undefined,
          material:
            formData.calculationConfig.material &&
            formData.calculationConfig.material !== ""
              ? formData.calculationConfig.material
              : undefined,
          defaultQuantity:
            formData.calculationConfig.defaultQuantity &&
            formData.calculationConfig.defaultQuantity !== ""
              ? parseFloat(formData.calculationConfig.defaultQuantity)
              : undefined,
          defaultMaterialQuantity:
            formData.calculationConfig.defaultMaterialQuantity &&
            formData.calculationConfig.defaultMaterialQuantity !== ""
              ? parseFloat(formData.calculationConfig.defaultMaterialQuantity)
              : undefined,
        },
      };

      // Remove undefined and empty string fields to avoid validation issues
      Object.keys(cleanedData).forEach((key) => {
        if (cleanedData[key] === undefined || cleanedData[key] === "") {
          delete cleanedData[key];
        }
      });

      // Clean calculationConfig separately
      if (cleanedData.calculationConfig) {
        Object.keys(cleanedData.calculationConfig).forEach((key) => {
          if (
            cleanedData.calculationConfig[key] === undefined ||
            cleanedData.calculationConfig[key] === ""
          ) {
            delete cleanedData.calculationConfig[key];
          }
        });

        // Remove calculationConfig if it's empty
        if (Object.keys(cleanedData.calculationConfig).length === 0) {
          delete cleanedData.calculationConfig;
        }
      }

      console.log("Sending data:", cleanedData);

      const response = await fetch(
        `/api/admin/quoting/template-services/${templateService._id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          credentials: "include",
          body: JSON.stringify(cleanedData),
        },
      );

      if (response.ok) {
        const updatedTemplateService = await response.json();
        onSuccess(updatedTemplateService);
      } else {
        const errorData = await response.json();
        console.error("Failed to update template service:", errorData);
        alert(
          `Failed to update template service: ${errorData.error || "Unknown error"}`,
        );
      }
    } catch (error) {
      console.error("Error updating template service:", error);
      alert(
        "Error updating template service. Please check the console for details.",
      );
    } finally {
      setLoading(false);
    }
  };

  const updateFormData = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const updateCalculationConfig = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      calculationConfig: { ...prev.calculationConfig, [field]: value },
    }));
  };

  const commonCategories = [
    "Installation",
    "Painting",
    "Electrical",
    "Plumbing",
    "Carpentry",
    "Tiling",
    "Flooring",
    "Plastering",
    "Demolition",
    "General Building",
    "Landscaping",
    "Roofing",
  ];

  const commonUnits = [
    "sqm",
    "linear m",
    "piece",
    "set",
    "m2",
    "m3",
    "roll",
    "box",
    "pack",
    "day",
    "hour",
    "job",
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        ></div>

        <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
            <h2 className="text-lg font-medium text-gray-900">
              Edit Template Service
            </h2>
            <button
              onClick={onClose}
              className="rounded-md p-1 text-gray-400 hover:text-gray-600"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Service Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => updateFormData("name", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="e.g., Skirting Installation, Wall Painting"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => updateFormData("category", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    {commonCategories.map((category) => (
                      <option key={category} value={category}>
                        {category}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit *
                  </label>
                  <select
                    value={formData.unit}
                    onChange={(e) => updateFormData("unit", e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  >
                    <option value="">Select unit</option>
                    {commonUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Pricing Type *
                  </label>
                  <div className="mt-1 flex space-x-4">
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="fixed"
                        checked={formData.pricingType === "fixed"}
                        onChange={(e) =>
                          updateFormData("pricingType", e.target.value)
                        }
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex items-center text-sm">
                        <DollarSign className="mr-1 h-4 w-4" />
                        Fixed Price
                      </span>
                    </label>
                    <label className="flex items-center">
                      <input
                        type="radio"
                        value="calculated"
                        checked={formData.pricingType === "calculated"}
                        onChange={(e) =>
                          updateFormData("pricingType", e.target.value)
                        }
                        className="mr-2 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="flex items-center text-sm">
                        <Calculator className="mr-1 h-4 w-4" />
                        Calculated
                      </span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Fixed Pricing */}
              {formData.pricingType === "fixed" && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-900">
                    Fixed Price
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Price per {formData.unit || "unit"} *
                      </label>
                      <div className="relative mt-1">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                          <span className="text-gray-500 sm:text-sm">£</span>
                        </div>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.fixedPrice}
                          onChange={(e) =>
                            updateFormData(
                              "fixedPrice",
                              parseFloat(e.target.value) || "",
                            )
                          }
                          className="block w-full rounded-md border border-gray-300 py-2 pl-7 pr-3 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="0.00"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Calculated Pricing */}
              {formData.pricingType === "calculated" && (
                <div className="rounded-lg border border-gray-200 bg-blue-50 p-4">
                  <h3 className="mb-3 text-sm font-medium text-gray-900">
                    Calculation Setup
                  </h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tradesperson *
                      </label>
                      <select
                        value={formData.calculationConfig.tradesperson}
                        onChange={(e) =>
                          updateCalculationConfig(
                            "tradesperson",
                            e.target.value,
                          )
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        required
                      >
                        <option value="">Select tradesperson</option>
                        {tradespeople.map((tradesperson) => (
                          <option
                            key={tradesperson._id}
                            value={tradesperson._id}
                          >
                            {tradesperson.name} (£{tradesperson.price}/
                            {tradesperson.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Material (Optional)
                      </label>
                      <select
                        value={formData.calculationConfig.material}
                        onChange={(e) =>
                          updateCalculationConfig("material", e.target.value)
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      >
                        <option value="">No material</option>
                        {materials.map((material) => (
                          <option key={material._id} value={material._id}>
                            {material.name} (£{material.price}/{material.unit})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Default Quantity
                      </label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.calculationConfig.defaultQuantity}
                        onChange={(e) =>
                          updateCalculationConfig(
                            "defaultQuantity",
                            parseFloat(e.target.value) || "",
                          )
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="1.0"
                      />
                    </div>

                    {formData.calculationConfig.material && (
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Default Material Quantity
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={
                            formData.calculationConfig.defaultMaterialQuantity
                          }
                          onChange={(e) =>
                            updateCalculationConfig(
                              "defaultMaterialQuantity",
                              parseFloat(e.target.value) || "",
                            )
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="0.1"
                        />
                      </div>
                    )}
                  </div>
                  <p className="mt-2 text-xs text-blue-700">
                    Price will be calculated as: (Tradesperson Rate × Quantity)
                    + (Material Price × Material Quantity)
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) =>
                      updateFormData("description", e.target.value)
                    }
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="Describe what this service includes... (press Enter for new lines)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => updateFormData("notes", e.target.value)}
                    rows={3}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="Additional notes or special instructions..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <select
                  value={formData.isActive}
                  onChange={(e) =>
                    updateFormData("isActive", e.target.value === "true")
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                >
                  <option value={true}>Active</option>
                  <option value={false}>Inactive</option>
                </select>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <Save className="mr-2 h-4 w-4" />
                {loading ? "Updating..." : "Update Template Service"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
