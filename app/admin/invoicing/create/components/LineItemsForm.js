"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  GripVertical,
  Search,
  Save,
  Star,
  Package,
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/libs/api";

export default function LineItemsForm({
  formData,
  updateArrayFormData,
  markSectionComplete,
  markSectionIncomplete,
  goToNextSection,
}) {
  const [templates, setTemplates] = useState([]);
  const [showTemplates, setShowTemplates] = useState(false);
  const [templateSearch, setTemplateSearch] = useState("");
  const [filteredTemplates, setFilteredTemplates] = useState([]);
  const [showSaveTemplate, setShowSaveTemplate] = useState(null);
  const [templateData, setTemplateData] = useState({
    name: "",
    description: "",
    category: "General",
  });
  const [draggedItem, setDraggedItem] = useState(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  useEffect(() => {
    const isValid = formData.lineItems.length > 0;
    if (isValid) {
      markSectionComplete("lineitems");
    } else {
      markSectionIncomplete("lineitems");
    }
  }, [formData.lineItems]);

  useEffect(() => {
    // Filter templates based on search
    const filtered = templates.filter(
      (template) =>
        template.serviceName
          .toLowerCase()
          .includes(templateSearch.toLowerCase()) ||
        template.category
          .toLowerCase()
          .includes(templateSearch.toLowerCase()) ||
        (template.description &&
          template.description
            .toLowerCase()
            .includes(templateSearch.toLowerCase())),
    );
    setFilteredTemplates(filtered);
  }, [templates, templateSearch]);

  const fetchTemplates = async () => {
    try {
      const response = await apiClient.get(
        "/admin/invoicing/templates?popular=true",
      );
      setTemplates(response.templates || []);
    } catch (error) {
      console.error("Error fetching templates:", error);
    }
  };

  const addLineItem = () => {
    const newItem = {
      id: Date.now().toString(),
      serviceName: "",
      priceExclVat: 0,
      vatRate: 20,
      type: "Labour",
      quantity: 1,
      totalVatIncluded: 0,
      order: formData.lineItems.length,
    };
    updateArrayFormData("lineItems", [...formData.lineItems, newItem]);
  };

  const removeLineItem = (itemId) => {
    const updatedItems = formData.lineItems.filter(
      (item) => item.id !== itemId,
    );
    updateArrayFormData("lineItems", updatedItems);
  };

  const updateLineItem = (itemId, field, value) => {
    const updatedItems = formData.lineItems.map((item) => {
      if (item.id === itemId) {
        const updated = { ...item, [field]: value };

        // Recalculate total when price, quantity, or VAT rate changes
        if (
          field === "priceExclVat" ||
          field === "quantity" ||
          field === "vatRate"
        ) {
          const subtotal = updated.priceExclVat * updated.quantity;
          const vat = subtotal * (updated.vatRate / 100);
          updated.totalVatIncluded = parseFloat((subtotal + vat).toFixed(2));
        }

        return updated;
      }
      return item;
    });
    updateArrayFormData("lineItems", updatedItems);
  };

  const addFromTemplate = (template) => {
    const newItem = {
      id: Date.now().toString(),
      serviceName: template.serviceName,
      priceExclVat: template.priceExclVat,
      vatRate: template.vatRate,
      type: template.type,
      quantity: template.defaultQuantity,
      totalVatIncluded: 0,
      order: formData.lineItems.length,
    };

    // Calculate total
    const subtotal = newItem.priceExclVat * newItem.quantity;
    const vat = subtotal * (newItem.vatRate / 100);
    newItem.totalVatIncluded = parseFloat((subtotal + vat).toFixed(2));

    updateArrayFormData("lineItems", [...formData.lineItems, newItem]);
    setShowTemplates(false);

    // Mark template as used
    template.markAsUsed && template.markAsUsed();
    toast.success("Line item added from template");
  };

  const saveAsTemplate = async (itemId) => {
    try {
      const item = formData.lineItems.find((i) => i.id === itemId);
      if (!item || !templateData.name) {
        toast.error("Please enter a template name");
        return;
      }

      const templatePayload = {
        name: templateData.name,
        description: templateData.description,
        serviceName: item.serviceName,
        priceExclVat: item.priceExclVat,
        vatRate: item.vatRate,
        type: item.type,
        defaultQuantity: item.quantity,
        category: templateData.category,
      };

      const response = await apiClient.post(
        "/admin/invoicing/templates",
        templatePayload,
      );

      if (response.success) {
        toast.success("Template saved successfully!");
        setShowSaveTemplate(null);
        setTemplateData({ name: "", description: "", category: "General" });
        fetchTemplates(); // Refresh templates
      }
    } catch (error) {
      console.error("Error saving template:", error);
      toast.error("Failed to save template");
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, itemId) => {
    setDraggedItem(itemId);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, targetItemId) => {
    e.preventDefault();

    if (!draggedItem || draggedItem === targetItemId) {
      setDraggedItem(null);
      return;
    }

    const items = [...formData.lineItems];
    const draggedIndex = items.findIndex((item) => item.id === draggedItem);
    const targetIndex = items.findIndex((item) => item.id === targetItemId);

    // Remove dragged item and insert at target position
    const [draggedItemObj] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, draggedItemObj);

    // Update order property
    items.forEach((item, index) => {
      item.order = index;
    });

    updateArrayFormData("lineItems", items);
    setDraggedItem(null);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Add Item Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={addLineItem}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Line Item
        </button>

        <button
          onClick={() => setShowTemplates(!showTemplates)}
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Package className="mr-2 h-4 w-4" />
          Add from Template
        </button>
      </div>

      {/* Templates Panel */}
      {showTemplates && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900">
              Invoice Templates
            </h3>
            <button
              onClick={() => setShowTemplates(false)}
              className="text-gray-400 hover:text-gray-600"
            >
              ×
            </button>
          </div>

          {/* Template Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search templates..."
              value={templateSearch}
              onChange={(e) => setTemplateSearch(e.target.value)}
              className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          {/* Template List */}
          <div className="grid max-h-64 grid-cols-1 gap-2 overflow-y-auto">
            {filteredTemplates.map((template) => (
              <div
                key={template._id}
                className="flex items-center justify-between rounded-md border border-gray-200 bg-white p-3 hover:bg-gray-50"
              >
                <div className="flex-1">
                  <div className="flex items-center">
                    <h4 className="text-sm font-medium text-gray-900">
                      {template.serviceName}
                    </h4>
                    <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-800">
                      {template.category}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    {formatCurrency(template.priceExclVat)} • {template.type} •{" "}
                    {template.vatRate}% VAT
                  </p>
                  {template.description && (
                    <p className="mt-1 text-xs text-gray-400">
                      {template.description}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => addFromTemplate(template)}
                  className="ml-3 inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-1 text-xs font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  Add
                </button>
              </div>
            ))}
            {filteredTemplates.length === 0 && (
              <div className="py-4 text-center text-sm text-gray-500">
                {templateSearch
                  ? `No templates found for "${templateSearch}"`
                  : "No templates available"}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Line Items */}
      {formData.lineItems.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium text-gray-900">Line Items</h3>

          <div className="space-y-3">
            {formData.lineItems.map((item, index) => (
              <div
                key={item.id}
                draggable
                onDragStart={(e) => handleDragStart(e, item.id)}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, item.id)}
                className={`rounded-lg border border-gray-200 bg-white p-4 ${
                  draggedItem === item.id ? "opacity-50" : ""
                }`}
              >
                <div className="flex items-start space-x-4">
                  {/* Drag Handle */}
                  <div className="flex-shrink-0 cursor-move pt-2">
                    <GripVertical className="h-5 w-5 text-gray-400" />
                  </div>

                  {/* Form Fields */}
                  <div className="grid flex-1 grid-cols-1 gap-4 sm:grid-cols-6">
                    {/* Service Name */}
                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Service Name *
                      </label>
                      <input
                        type="text"
                        value={item.serviceName}
                        onChange={(e) =>
                          updateLineItem(item.id, "serviceName", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter service name"
                      />
                    </div>

                    {/* Price Excl VAT */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Price (excl. VAT) *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.priceExclVat}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "priceExclVat",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="0.00"
                      />
                    </div>

                    {/* VAT Rate */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        VAT Rate (%)
                      </label>
                      <select
                        value={item.vatRate}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "vatRate",
                            parseFloat(e.target.value),
                          )
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value={0}>0%</option>
                        <option value={5}>5%</option>
                        <option value={20}>20%</option>
                      </select>
                    </div>

                    {/* Type */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Type *
                      </label>
                      <select
                        value={item.type}
                        onChange={(e) =>
                          updateLineItem(item.id, "type", e.target.value)
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                      >
                        <option value="Labour">Labour</option>
                        <option value="Material">Material</option>
                      </select>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="mb-1 block text-xs font-medium text-gray-700">
                        Quantity *
                      </label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={item.quantity}
                        onChange={(e) =>
                          updateLineItem(
                            item.id,
                            "quantity",
                            parseFloat(e.target.value) || 0,
                          )
                        }
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="1"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-shrink-0 flex-col space-y-2">
                    {/* Total */}
                    <div className="text-right">
                      <div className="text-xs text-gray-500">
                        Total (inc. VAT)
                      </div>
                      <div className="text-sm font-medium text-gray-900">
                        {formatCurrency(item.totalVatIncluded)}
                      </div>
                    </div>

                    {/* Save as Template */}
                    <button
                      onClick={() => setShowSaveTemplate(item.id)}
                      className="text-yellow-600 hover:text-yellow-700"
                      title="Save as Template"
                    >
                      <Star className="h-4 w-4" />
                    </button>

                    {/* Remove */}
                    <button
                      onClick={() => removeLineItem(item.id)}
                      className="text-red-600 hover:text-red-700"
                      title="Remove Item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Save Template Modal */}
      {showSaveTemplate && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center px-4">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75"></div>
            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <h3 className="mb-4 text-lg font-medium text-gray-900">
                Save as Template
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Template Name *
                  </label>
                  <input
                    type="text"
                    value={templateData.name}
                    onChange={(e) =>
                      setTemplateData((prev) => ({
                        ...prev,
                        name: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Enter template name"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  <textarea
                    rows={2}
                    value={templateData.description}
                    onChange={(e) =>
                      setTemplateData((prev) => ({
                        ...prev,
                        description: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="Optional description"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Category
                  </label>
                  <input
                    type="text"
                    value={templateData.category}
                    onChange={(e) =>
                      setTemplateData((prev) => ({
                        ...prev,
                        category: e.target.value,
                      }))
                    }
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
                    placeholder="General"
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowSaveTemplate(null)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => saveAsTemplate(showSaveTemplate)}
                  className="rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                >
                  <Save className="mr-2 inline h-4 w-4" />
                  Save Template
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue Button */}
      <div className="flex justify-end border-t border-gray-200 pt-6">
        <button
          onClick={goToNextSection}
          disabled={formData.lineItems.length === 0}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to Review
        </button>
      </div>
    </div>
  );
}
