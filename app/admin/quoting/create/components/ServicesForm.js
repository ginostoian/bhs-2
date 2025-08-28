"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import { Plus, Trash2, Search, FileText, Edit3, Save, X } from "lucide-react";

export default function ServicesForm({
  formData,
  updateFormData,
  isEditing = false,
  originalData = null,
}) {
  const [newCategory, setNewCategory] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemPrice, setNewItemPrice] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showAddCategory, setShowAddCategory] = useState(false);
  const [showAddItem, setShowAddItem] = useState(false);

  // New state for enhanced service addition
  const [showServiceOptions, setShowServiceOptions] = useState(false);
  const [selectedServiceOption, setSelectedServiceOption] = useState("");
  const [templateServices, setTemplateServices] = useState([]);
  const [rateCards, setRateCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Template Service state
  const [selectedTemplateService, setSelectedTemplateService] = useState(null);
  const [templateServiceQuantity, setTemplateServiceQuantity] = useState("");

  // Edit state
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  const isUsingTemplate = formData.template && formData.services.length > 0;

  useEffect(() => {
    fetchTemplateServices();
    fetchRateCards();
  }, []);

  // Initialize services with existing data when editing
  useEffect(() => {
    if (isEditing && originalData && formData.services.length === 0) {
      // Pre-populate services with existing data
      const servicesWithCalculations = (originalData.services || []).map(
        (cat) => ({
          ...cat,
          items: cat.items.map((item) => ({
            ...item,
            total: Math.round(item.quantity * item.unitPrice * 100) / 100,
          })),
          categoryTotal: calculateCategoryTotal(cat.items),
        }),
      );

      updateFormData({ services: servicesWithCalculations });
    }
  }, [isEditing, originalData, formData.services.length, updateFormData]);

  const fetchTemplateServices = async () => {
    try {
      const response = await fetch(
        "/api/admin/quoting/template-services?isActive=true",
        {
          credentials: "include",
        },
      );
      if (response.ok) {
        const data = await response.json();
        setTemplateServices(data);
      }
    } catch (error) {
      console.error("Error fetching template services:", error);
    }
  };

  const fetchRateCards = async () => {
    try {
      const response = await fetch("/api/admin/quoting/rates?isActive=true", {
        credentials: "include",
      });
      if (response.ok) {
        const data = await response.json();
        setRateCards(data);
      }
    } catch (error) {
      console.error("Error fetching rate cards:", error);
    }
  };

  const addCategory = () => {
    if (!newCategory.trim()) return;

    const newServiceCategory = {
      categoryName: newCategory.trim(),
      items: [],
    };

    updateFormData({ services: [...formData.services, newServiceCategory] });
    setNewCategory("");
    setShowAddCategory(false);
  };

  const removeCategory = (categoryIndex) => {
    updateFormData({
      services: formData.services.filter((_, index) => index !== categoryIndex),
    });
  };

  const addItem = () => {
    if (
      !newItemName.trim() ||
      !newItemUnit ||
      !newItemQuantity ||
      !newItemPrice
    )
      return;

    // Check if selectedCategory is valid
    if (selectedCategory === "" || selectedCategory === undefined) {
      console.error("No category selected");
      toast.error("Please select a category first");
      return;
    }

    const quantity = parseFloat(newItemQuantity);
    const unitPrice = parseFloat(newItemPrice);
    const total = Math.round(quantity * unitPrice * 100) / 100; // Simple calculation with precision fix

    const newItem = {
      name: newItemName.trim(),
      description: newItemDescription.trim(),
      unit: newItemUnit,
      quantity: quantity,
      unitPrice: unitPrice,
      notes: newItemNotes.trim(),
      total: total,
    };

    const updatedServices = formData.services.map((cat, index) => {
      if (index === parseInt(selectedCategory)) {
        const updatedCategory = { ...cat, items: [...cat.items, newItem] };
        return {
          ...updatedCategory,
          categoryTotal: calculateCategoryTotal(updatedCategory.items),
        };
      }
      return cat;
    });
    updateFormData({ services: updatedServices });

    // Reset form
    setNewItemName("");
    setNewItemDescription("");
    setNewItemUnit("");
    setNewItemQuantity("");
    setNewItemPrice("");
    setNewItemNotes("");
    setShowAddItem(false);
  };

  const removeItem = (categoryIndex, itemIndex) => {
    const updatedServices = formData.services.map((cat, catIndex) => {
      if (catIndex === categoryIndex) {
        const updatedCategory = {
          ...cat,
          items: cat.items.filter((_, itemIdx) => itemIdx !== itemIndex),
        };
        return {
          ...updatedCategory,
          categoryTotal: calculateCategoryTotal(updatedCategory.items),
        };
      }
      return cat;
    });
    updateFormData({ services: updatedServices });
  };

  const startEditItem = (categoryIndex, itemIndex, item) => {
    setEditingItem({ categoryIndex, itemIndex });
    setEditFormData({
      name: item.name,
      description: item.description,
      unit: item.unit,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      notes: item.notes || "",
    });
  };

  const saveEditItem = () => {
    if (!editingItem) return;

    const { categoryIndex, itemIndex } = editingItem;
    const updatedServices = formData.services.map((cat, catIndex) => {
      if (catIndex === categoryIndex) {
        const updatedCategory = {
          ...cat,
          items: cat.items.map((item, itemIdx) => {
            if (itemIdx === itemIndex) {
              const total =
                Math.round(
                  editFormData.quantity * editFormData.unitPrice * 100,
                ) / 100;
              return {
                ...item,
                ...editFormData,
                total: total,
              };
            }
            return item;
          }),
        };
        return {
          ...updatedCategory,
          categoryTotal: calculateCategoryTotal(updatedCategory.items),
        };
      }
      return cat;
    });

    // Update the form data with recalculated totals
    updateFormData({ services: updatedServices });
    setEditingItem(null);
    setEditFormData({});
    toast.success("Service updated successfully!");
  };

  const cancelEditItem = () => {
    setEditingItem(null);
    setEditFormData({});
  };

  const updateItemQuantity = (categoryIndex, itemIndex, newQuantity) => {
    const updatedServices = formData.services.map((cat, catIndex) => {
      if (catIndex === categoryIndex) {
        const updatedCategory = {
          ...cat,
          items: cat.items.map((item, itemIdx) => {
            if (itemIdx === itemIndex) {
              const quantity = parseFloat(newQuantity);
              const unitPrice = item.unitPrice;
              const total = Math.round(quantity * unitPrice * 100) / 100;

              return {
                ...item,
                quantity: quantity,
                total: total,
              };
            }
            return item;
          }),
        };
        return {
          ...updatedCategory,
          categoryTotal: calculateCategoryTotal(updatedCategory.items),
        };
      }
      return cat;
    });
    updateFormData({ services: updatedServices });
  };

  const updateItemPrice = (categoryIndex, itemIndex, newPrice) => {
    const updatedServices = formData.services.map((cat, catIndex) => {
      if (catIndex === categoryIndex) {
        const updatedCategory = {
          ...cat,
          items: cat.items.map((item, itemIdx) => {
            if (itemIdx === itemIndex) {
              const quantity = item.quantity;
              const unitPrice = parseFloat(newPrice);
              const total = Math.round(quantity * unitPrice * 100) / 100;

              return {
                ...item,
                unitPrice: unitPrice,
                total: total,
              };
            }
            return item;
          }),
        };
        return {
          ...updatedCategory,
          categoryTotal: calculateCategoryTotal(updatedCategory.items),
        };
      }
      return cat;
    });
    updateFormData({ services: updatedServices });
  };

  // Calculate category totals
  const calculateCategoryTotal = (items) => {
    if (!items || !Array.isArray(items)) return 0;
    return items.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  // Update services with calculated totals
  const updateServicesWithTotals = (services) => {
    return services.map((cat) => ({
      ...cat,
      categoryTotal: calculateCategoryTotal(cat.items),
    }));
  };

  // Recalculate all totals for all services
  const recalculateAllTotals = () => {
    const updatedServices = formData.services.map((category) => ({
      ...category,
      items: category.items.map((item) => ({
        ...item,
        total:
          Math.round((item.quantity || 0) * (item.unitPrice || 0) * 100) / 100,
      })),
      categoryTotal: calculateCategoryTotal(
        category.items.map((item) => ({
          ...item,
          total:
            Math.round((item.quantity || 0) * (item.unitPrice || 0) * 100) /
            100,
        })),
      ),
    }));

    updateFormData({ services: updatedServices });
  };

  // Enhanced service addition methods
  const openServiceOptions = () => {
    setShowServiceOptions(true);
    setSelectedServiceOption("");
  };

  const closeServiceOptions = () => {
    setShowServiceOptions(false);
    setSelectedServiceOption("");
    setSelectedTemplateService(null);
    setTemplateServiceQuantity("");
  };

  // Template Service method
  const addTemplateService = () => {
    if (!selectedTemplateService || !templateServiceQuantity) return;

    const quantity = parseFloat(templateServiceQuantity);
    let price = 0;
    let description = selectedTemplateService.description || "";

    if (selectedTemplateService.pricingType === "fixed") {
      price = selectedTemplateService.fixedPrice;
    } else if (selectedTemplateService.pricingType === "calculated") {
      // Calculate price from rate cards
      const tradesperson = rateCards.find(
        (r) => r._id === selectedTemplateService.calculationConfig.tradesperson,
      );
      const material = selectedTemplateService.calculationConfig.material
        ? rateCards.find(
            (r) => r._id === selectedTemplateService.calculationConfig.material,
          )
        : null;

      if (tradesperson) {
        price = tradesperson.price * quantity;
        if (material) {
          const materialQty =
            selectedTemplateService.calculationConfig.defaultMaterialQuantity ||
            0;
          price += material.price * materialQty;
        }
      }
    }

    const newItem = {
      name: selectedTemplateService.name,
      description: description,
      unit: selectedTemplateService.unit,
      quantity: quantity,
      unitPrice: price,
      notes: selectedTemplateService.notes || "",
      total: quantity * price,
      source: "template",
      templateServiceId: selectedTemplateService._id,
    };

    // Add to selected category or create new one
    let targetCategory = formData.services.find(
      (cat) => cat.categoryName === selectedTemplateService.category,
    );
    if (!targetCategory) {
      targetCategory = {
        categoryName: selectedTemplateService.category,
        items: [],
      };
      updateFormData({ services: [...formData.services, targetCategory] });
    }

    const updatedServices = formData.services.map((cat) => {
      if (cat.categoryName === targetCategory.categoryName) {
        const updatedCategory = { ...cat, items: [...cat.items, newItem] };
        return {
          ...updatedCategory,
          categoryTotal: calculateCategoryTotal(updatedCategory.items),
        };
      }
      return cat;
    });
    updateFormData({ services: updatedServices });

    closeServiceOptions();
  };

  const filteredTemplateServices = templateServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">
          Services & Quantities
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Add service categories and individual items with quantities and
          pricing.
        </p>
        {isUsingTemplate && (
          <div className="mt-3 rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 rounded-full bg-blue-600"></div>
                <span className="text-sm text-blue-800">
                  Template services loaded. You can modify quantities, add new
                  items, or remove existing ones.
                </span>
              </div>
              <button
                onClick={recalculateAllTotals}
                className="inline-flex items-center rounded-md border border-blue-300 bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800 hover:bg-blue-200"
              >
                Recalculate Totals
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Service Addition Options */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-900">Add New Service</h3>
          <button
            onClick={openServiceOptions}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Add Service
          </button>
        </div>
      </div>

      {/* Service Options Modal */}
      {showServiceOptions && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
              onClick={closeServiceOptions}
            ></div>

            <div className="relative w-full max-w-4xl rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Add New Service
                </h2>
                <button
                  onClick={closeServiceOptions}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <span className="sr-only">Close</span>
                  <svg
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
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

              <div className="p-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                  {/* Option 1: Template Service */}
                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      selectedServiceOption === "template"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedServiceOption("template")}
                  >
                    <div className="flex items-center space-x-3">
                      <FileText className="h-8 w-8 text-blue-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Template Service
                        </h3>
                        <p className="text-sm text-gray-600">
                          Use predefined service templates
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Option 3: Custom Service */}
                  <div
                    className={`cursor-pointer rounded-lg border-2 p-4 transition-all ${
                      selectedServiceOption === "custom"
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                    onClick={() => setSelectedServiceOption("custom")}
                  >
                    <div className="flex items-center space-x-3">
                      <Edit3 className="h-8 w-8 text-purple-600" />
                      <div>
                        <h3 className="font-medium text-gray-900">
                          Custom Service
                        </h3>
                        <p className="text-sm text-gray-600">Manual input</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Template Service Form */}
                {selectedServiceOption === "template" && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Select Template Service
                    </h3>

                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search template services..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="block w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      />
                    </div>

                    <div className="max-h-60 space-y-2 overflow-y-auto">
                      {filteredTemplateServices.map((service) => (
                        <div
                          key={service._id}
                          className={`cursor-pointer rounded-lg border p-3 transition-all ${
                            selectedTemplateService?._id === service._id
                              ? "border-blue-500 bg-blue-50"
                              : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                          }`}
                          onClick={() => setSelectedTemplateService(service)}
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-medium text-gray-900">
                                {service.name}
                              </h4>
                              <p className="text-sm text-gray-600">
                                {service.category} • {service.unit}
                              </p>
                              {service.description && (
                                <p className="mt-1 text-xs text-gray-500">
                                  {service.description}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              {service.pricingType === "fixed" ? (
                                <span className="text-sm font-medium text-green-600">
                                  £{service.fixedPrice?.toFixed(2)}/
                                  {service.unit}
                                </span>
                              ) : (
                                <span className="text-sm font-medium text-blue-600">
                                  Calculated
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {selectedTemplateService && (
                      <div className="space-y-4">
                        <div className="rounded-lg border border-green-200 bg-green-50 p-3">
                          <div className="flex items-center space-x-2">
                            <div className="h-2 w-2 rounded-full bg-green-600"></div>
                            <span className="text-sm text-green-800">
                              Selected: {selectedTemplateService.name}
                            </span>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Quantity *
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={templateServiceQuantity}
                            onChange={(e) =>
                              setTemplateServiceQuantity(e.target.value)
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            placeholder="1.0"
                            required
                          />
                        </div>

                        <div className="flex justify-end space-x-3">
                          <button
                            onClick={closeServiceOptions}
                            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={addTemplateService}
                            disabled={!templateServiceQuantity}
                            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                          >
                            Add Template Service
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Custom Service Form */}
                {selectedServiceOption === "custom" && (
                  <div className="mt-6 space-y-4">
                    <h3 className="text-lg font-medium text-gray-900">
                      Add Custom Service
                    </h3>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Service Name *
                        </label>
                        <input
                          type="text"
                          value={newItemName}
                          onChange={(e) => setNewItemName(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="e.g., Custom Installation"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Unit *
                        </label>
                        <select
                          value={newItemUnit}
                          onChange={(e) => setNewItemUnit(e.target.value)}
                          className={`mt-1 block w-full rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
                            !newItemUnit ? "border-red-300" : "border-gray-300"
                          }`}
                          required
                        >
                          <option value="">Select unit</option>
                          <option value="sqm">sqm</option>
                          <option value="linear m">linear m</option>
                          <option value="piece">piece</option>
                          <option value="set">set</option>
                          <option value="day">day</option>
                          <option value="hour">hour</option>
                          <option value="job">job</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Quantity *
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          min="0"
                          value={newItemQuantity}
                          onChange={(e) => setNewItemQuantity(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="1.0"
                          required
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Price per Unit *
                        </label>
                        <div className="relative mt-1">
                          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <span className="text-gray-500 sm:text-sm">£</span>
                          </div>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(e.target.value)}
                            className="block w-full rounded-md border border-gray-300 py-2 pl-7 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                            placeholder="0.00"
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Description
                      </label>
                      <textarea
                        value={newItemDescription}
                        onChange={(e) => setNewItemDescription(e.target.value)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Describe what this service includes... (press Enter for new lines)"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Notes
                      </label>
                      <textarea
                        value={newItemNotes}
                        onChange={(e) => setNewItemNotes(e.target.value)}
                        rows={2}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="Additional notes or special instructions... (press Enter for new lines)"
                      />
                    </div>

                    <div className="flex justify-end space-x-3">
                      <button
                        onClick={closeServiceOptions}
                        className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={addItem}
                        disabled={
                          !newItemName ||
                          !newItemUnit ||
                          !newItemQuantity ||
                          !newItemPrice
                        }
                        className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        Add Custom Service
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Existing Services Display */}
      {formData.services.length > 0 && (
        <div className="space-y-6">
          {formData.services.map((category, categoryIndex) => (
            <div
              key={categoryIndex}
              className="rounded-lg border border-gray-200 bg-white"
            >
              <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3">
                <div className="flex items-center space-x-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {category.categoryName}
                  </h3>
                  <span className="text-sm font-medium text-gray-600">
                    Total: £{(category.categoryTotal || 0).toFixed(2)}
                  </span>
                </div>
                <button
                  onClick={() => removeCategory(categoryIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>

              {category.items.length > 0 && (
                <div className="p-4">
                  <div className="space-y-3">
                    {category.items &&
                      Array.isArray(category.items) &&
                      category.items.map((item, itemIndex) => {
                        return (
                          <div
                            key={itemIndex}
                            className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 p-3"
                          >
                            <div className="flex-1">
                              <div className="flex items-center space-x-3">
                                <h4 className="font-medium text-gray-900">
                                  {item.name}
                                </h4>
                                {item.source && (
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                      item.source === "template"
                                        ? "bg-blue-100 text-blue-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {item.source === "template"
                                      ? "Template"
                                      : "Custom"}
                                  </span>
                                )}
                              </div>
                              {item.description && (
                                <p className="mt-1 whitespace-pre-line text-sm text-gray-600">
                                  {item.description}
                                </p>
                              )}
                              <div className="mt-2 flex items-center space-x-4 text-sm text-gray-500">
                                <span>Unit: {item.unit}</span>
                                <span>Quantity: {item.quantity}</span>
                                <span>
                                  Price: £{(item.unitPrice || 0).toFixed(2)}
                                </span>
                                <span className="font-medium text-gray-900">
                                  Total: £{(item.total || 0).toFixed(2)}
                                </span>
                              </div>
                              {item.notes && (
                                <p className="mt-1 whitespace-pre-line text-sm text-gray-500">
                                  {item.notes}
                                </p>
                              )}
                            </div>

                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() =>
                                  startEditItem(categoryIndex, itemIndex, item)
                                }
                                className="text-blue-600 hover:text-blue-800"
                              >
                                <Edit3 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() =>
                                  removeItem(categoryIndex, itemIndex)
                                }
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Grand Total */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Grand Total</h3>
              <span className="text-xl font-bold text-gray-900">
                £
                {formData.services
                  .reduce(
                    (sum, category) => sum + (category.categoryTotal || 0),
                    0,
                  )
                  .toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Edit Service Modal */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-2xl rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                Edit Service
              </h2>
              <button
                onClick={cancelEditItem}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Service Name
                </label>
                <input
                  type="text"
                  value={editFormData.name}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, name: e.target.value })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  value={editFormData.description}
                  onChange={(e) =>
                    setEditFormData({
                      ...editFormData,
                      description: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit
                  </label>
                  <select
                    value={editFormData.unit}
                    onChange={(e) =>
                      setEditFormData({ ...editFormData, unit: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  >
                    <option value="">Select unit</option>
                    <option value="sqm">sqm</option>
                    <option value="linear m">linear m</option>
                    <option value="job">job</option>
                    <option value="day">day</option>
                    <option value="hour">hour</option>
                    <option value="piece">piece</option>
                    <option value="set">set</option>
                    <option value="m2">m2</option>
                    <option value="m3">m3</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.quantity}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        quantity: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Unit Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={editFormData.unitPrice}
                    onChange={(e) =>
                      setEditFormData({
                        ...editFormData,
                        unitPrice: parseFloat(e.target.value) || 0,
                      })
                    }
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notes
                </label>
                <textarea
                  value={editFormData.notes}
                  onChange={(e) =>
                    setEditFormData({ ...editFormData, notes: e.target.value })
                  }
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={cancelEditItem}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={saveEditItem}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700"
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Legacy Add Category/Item Forms (kept for backward compatibility) */}
      <div className="space-y-6">
        <div className="rounded-lg border border-gray-200 bg-white p-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-900">
              Add New Category
            </h3>
            <button
              onClick={() => setShowAddCategory(!showAddCategory)}
              className="text-blue-600 hover:text-blue-800"
            >
              {showAddCategory ? "Cancel" : "Add Category"}
            </button>
          </div>

          {showAddCategory && (
            <div className="mt-4 flex space-x-2">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Category name"
                className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <button
                onClick={addCategory}
                disabled={!newCategory.trim()}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
              >
                Add
              </button>
            </div>
          )}
        </div>

        {formData.services.length > 0 && (
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                Add New Item
              </h3>
              <button
                onClick={() => setShowAddItem(!showAddItem)}
                className="text-blue-600 hover:text-blue-800"
              >
                {showAddItem ? "Cancel" : "Add Item"}
              </button>
            </div>

            {showAddItem && (
              <div className="mt-4 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      required
                    >
                      <option value="">Select category</option>
                      {formData.services.map((cat, catIndex) => (
                        <option key={catIndex} value={catIndex}>
                          {cat.categoryName}
                        </option>
                      ))}
                    </select>
                    {formData.services.length === 0 && (
                      <p className="mt-1 text-xs text-red-600">
                        Please add a category first before adding items
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Item Name
                    </label>
                    <input
                      type="text"
                      value={newItemName}
                      onChange={(e) => setNewItemName(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="Item name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={newItemDescription}
                      onChange={(e) => setNewItemDescription(e.target.value)}
                      rows={3}
                      className="mt-1 block w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="Description (press Enter for new lines)"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Unit
                    </label>
                    <select
                      value={newItemUnit}
                      onChange={(e) => setNewItemUnit(e.target.value)}
                      className={`mt-1 block w-full rounded-md px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
                        !newItemUnit ? "border-red-300" : "border-gray-300"
                      }`}
                      required
                    >
                      <option value="">Select unit</option>
                      <option value="sqm">sqm</option>
                      <option value="linear m">linear m</option>
                      <option value="piece">piece</option>
                      <option value="set">set</option>
                      <option value="day">day</option>
                      <option value="hour">hour</option>
                      <option value="job">job</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Quantity
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={newItemQuantity}
                      onChange={(e) => setNewItemQuantity(e.target.value)}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                      placeholder="1.0"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Price per Unit
                    </label>
                    <div className="relative mt-1">
                      <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                        <span className="text-gray-500 sm:text-sm">£</span>
                      </div>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={newItemPrice}
                        onChange={(e) => setNewItemPrice(e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 py-2 pl-7 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Notes
                  </label>
                  <textarea
                    value={newItemNotes}
                    onChange={(e) => setNewItemNotes(e.target.value)}
                    rows={2}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="Additional notes... (press Enter for new lines)"
                  />
                </div>

                <div className="flex justify-end">
                  <button
                    onClick={addItem}
                    disabled={
                      !selectedCategory ||
                      !newItemName ||
                      !newItemUnit ||
                      !newItemQuantity ||
                      !newItemPrice
                    }
                    className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                  >
                    Add Item
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
