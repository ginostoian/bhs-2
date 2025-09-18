"use client";

import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Plus,
  Trash2,
  Search,
  FileText,
  Edit3,
  Pencil,
  Save,
  X,
  GripVertical,
} from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

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

  // Heading state
  const [newHeadingText, setNewHeadingText] = useState("");
  const [newHeadingDescription, setNewHeadingDescription] = useState("");
  const [showAddHeading, setShowAddHeading] = useState(false);

  // New state for enhanced service addition
  const [showServiceOptions, setShowServiceOptions] = useState(false);
  const [selectedServiceOption, setSelectedServiceOption] = useState("");
  const [templateServices, setTemplateServices] = useState([]);
  const [rateCards, setRateCards] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Template Service state
  const [selectedTemplateService, setSelectedTemplateService] = useState(null);
  const [templateServiceQuantity, setTemplateServiceQuantity] = useState("");

  // Save as template state
  const [showSaveAsTemplate, setShowSaveAsTemplate] = useState(false);
  const [templateCategory, setTemplateCategory] = useState("");
  const [showSaveExistingAsTemplate, setShowSaveExistingAsTemplate] =
    useState(false);
  const [existingItemToSave, setExistingItemToSave] = useState(null);

  // Category-specific item addition state
  const [showCategoryItemOptions, setShowCategoryItemOptions] = useState(false);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState(null);
  const [categoryItemOption, setCategoryItemOption] = useState("");

  // Edit state
  const [editingItem, setEditingItem] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Category/Heading edit state
  const [editingCategory, setEditingCategory] = useState(null);
  const [editingHeading, setEditingHeading] = useState(null);
  const [editCategoryFormData, setEditCategoryFormData] = useState({});
  const [editHeadingFormData, setEditHeadingFormData] = useState({});

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
      type: "category",
      categoryName: newCategory.trim(),
      items: [],
      categoryTotal: 0,
      order: formData.services.length,
    };

    updateFormData({ services: [...formData.services, newServiceCategory] });
    setNewCategory("");
    setShowAddCategory(false);
  };

  const addHeading = () => {
    if (!newHeadingText.trim()) return;

    const newHeading = {
      type: "heading",
      headingText: newHeadingText.trim(),
      headingDescription: newHeadingDescription.trim(),
      items: [],
      order: formData.services.length,
    };

    updateFormData({ services: [...formData.services, newHeading] });
    setNewHeadingText("");
    setNewHeadingDescription("");
    setShowAddHeading(false);
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

  const addItemToCategory = () => {
    if (
      !newItemName.trim() ||
      !newItemUnit ||
      !newItemQuantity ||
      !newItemPrice ||
      selectedCategoryIndex === null
    )
      return;

    const quantity = parseFloat(newItemQuantity);
    const unitPrice = parseFloat(newItemPrice);
    const total = Math.round(quantity * unitPrice * 100) / 100;

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
      if (index === selectedCategoryIndex) {
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
    closeCategoryItemOptions();
  };

  const saveAsTemplate = async () => {
    if (
      !newItemName.trim() ||
      !newItemUnit ||
      !newItemQuantity ||
      !newItemPrice ||
      !templateCategory.trim()
    ) {
      toast.error("Please fill in all required fields including category");
      return;
    }

    try {
      const unitPrice = parseFloat(newItemPrice);

      const templateData = {
        name: newItemName.trim(),
        description: newItemDescription.trim(),
        category: templateCategory.trim(),
        unit: newItemUnit,
        pricingType: "fixed",
        fixedPrice: unitPrice,
        notes: newItemNotes.trim(),
        isActive: true,
      };

      const response = await fetch("/api/admin/quoting/template-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setTemplateServices((prev) => [...prev, newTemplate]);
        toast.success("Service saved as template successfully!");
        setShowSaveAsTemplate(false);
        setTemplateCategory("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save template service");
      }
    } catch (error) {
      console.error("Error saving template service:", error);
      toast.error("Failed to save template service");
    }
  };

  const saveExistingAsTemplate = async () => {
    if (!existingItemToSave || !templateCategory.trim()) {
      toast.error("Please fill in all required fields including category");
      return;
    }

    try {
      const templateData = {
        name: existingItemToSave.name,
        description: existingItemToSave.description || "",
        category: templateCategory.trim(),
        unit: existingItemToSave.unit,
        pricingType: "fixed",
        fixedPrice: existingItemToSave.unitPrice,
        notes: existingItemToSave.notes || "",
        isActive: true,
      };

      const response = await fetch("/api/admin/quoting/template-services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify(templateData),
      });

      if (response.ok) {
        const newTemplate = await response.json();
        setTemplateServices((prev) => [...prev, newTemplate]);
        toast.success("Service saved as template successfully!");
        setShowSaveExistingAsTemplate(false);
        setExistingItemToSave(null);
        setTemplateCategory("");
      } else {
        const errorData = await response.json();
        toast.error(errorData.message || "Failed to save template service");
      }
    } catch (error) {
      console.error("Error saving template service:", error);
      toast.error("Failed to save template service");
    }
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

  // Category edit functions
  const startEditCategory = (categoryIndex, category) => {
    setEditingCategory(categoryIndex);
    setEditCategoryFormData({
      categoryName: category.categoryName,
    });
  };

  const saveEditCategory = () => {
    if (editingCategory === null) return;

    const updatedServices = formData.services.map((service, serviceIndex) => {
      if (serviceIndex === editingCategory) {
        return {
          ...service,
          categoryName: editCategoryFormData.categoryName,
        };
      }
      return service;
    });

    updateFormData({ services: updatedServices });
    setEditingCategory(null);
    setEditCategoryFormData({});
    toast.success("Category updated successfully!");
  };

  const cancelEditCategory = () => {
    setEditingCategory(null);
    setEditCategoryFormData({});
  };

  // Heading edit functions
  const startEditHeading = (headingIndex, heading) => {
    setEditingHeading(headingIndex);
    setEditHeadingFormData({
      headingText: heading.headingText,
      headingDescription: heading.headingDescription || "",
    });
  };

  const saveEditHeading = () => {
    if (editingHeading === null) return;

    const updatedServices = formData.services.map((service, serviceIndex) => {
      if (serviceIndex === editingHeading) {
        return {
          ...service,
          headingText: editHeadingFormData.headingText,
          headingDescription: editHeadingFormData.headingDescription,
        };
      }
      return service;
    });

    updateFormData({ services: updatedServices });
    setEditingHeading(null);
    setEditHeadingFormData({});
    toast.success("Heading updated successfully!");
  };

  const cancelEditHeading = () => {
    setEditingHeading(null);
    setEditHeadingFormData({});
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

  // Handle drag and drop reordering for both categories and headings
  const handleDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const { source, destination } = result;

    // Handle service section reordering (categories and headings)
    if (result.type === "services") {
      const items = Array.from(formData.services);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      // Update order values
      const reorderedServices = items.map((item, index) => ({
        ...item,
        order: index,
      }));

      updateFormData({ services: reorderedServices });
      return;
    }

    // Handle item reordering within categories
    if (result.type === "item") {
      const sourceCategoryIndex = parseInt(
        source.droppableId.replace("category-", ""),
      );
      const destCategoryIndex = parseInt(
        destination.droppableId.replace("category-", ""),
      );

      // Only allow reordering within the same category
      if (sourceCategoryIndex !== destCategoryIndex) {
        return;
      }

      const updatedServices = formData.services.map((service, serviceIndex) => {
        if (
          serviceIndex === sourceCategoryIndex &&
          service.type === "category"
        ) {
          const items = Array.from(service.items);
          const [reorderedItem] = items.splice(source.index, 1);
          items.splice(destination.index, 0, reorderedItem);

          return {
            ...service,
            items: items,
            categoryTotal: calculateCategoryTotal(items),
          };
        }
        return service;
      });

      updateFormData({ services: updatedServices });
    }
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

  const openCategoryItemOptions = (categoryIndex) => {
    setSelectedCategoryIndex(categoryIndex);
    setShowCategoryItemOptions(true);
    setCategoryItemOption("");
  };

  const closeCategoryItemOptions = () => {
    setShowCategoryItemOptions(false);
    setSelectedCategoryIndex(null);
    setCategoryItemOption("");
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

    let updatedServices;

    // If adding to a specific category (from category header)
    if (selectedCategoryIndex !== null) {
      updatedServices = formData.services.map((cat, index) => {
        if (index === selectedCategoryIndex) {
          const updatedCategory = { ...cat, items: [...cat.items, newItem] };
          return {
            ...updatedCategory,
            categoryTotal: calculateCategoryTotal(updatedCategory.items),
          };
        }
        return cat;
      });
    } else {
      // Add to selected category or create new one (from main service options)
      let targetCategory = formData.services.find(
        (cat) => cat.categoryName === selectedTemplateService.category,
      );

      if (!targetCategory) {
        // Create new category with the item
        const newCategory = {
          categoryName: selectedTemplateService.category,
          items: [newItem],
          categoryTotal: calculateCategoryTotal([newItem]),
          type: "category",
          order: formData.services.length,
        };
        updatedServices = [...formData.services, newCategory];
      } else {
        // Add to existing category
        updatedServices = formData.services.map((cat) => {
          if (cat.categoryName === selectedTemplateService.category) {
            const updatedCategory = { ...cat, items: [...cat.items, newItem] };
            return {
              ...updatedCategory,
              categoryTotal: calculateCategoryTotal(updatedCategory.items),
            };
          }
          return cat;
        });
      }
    }

    updateFormData({ services: updatedServices });

    // Close the appropriate modal
    if (selectedCategoryIndex !== null) {
      closeCategoryItemOptions();
    } else {
      closeServiceOptions();
    }
  };

  const filteredTemplateServices = templateServices.filter(
    (service) =>
      service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8">
      {/* Enhanced Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900">
          Services & Quantities
        </h2>
        <p className="mt-2 text-lg text-gray-600">
          Add service categories and individual items with quantities and
          pricing
        </p>
        <div className="mt-4 inline-flex items-center rounded-full bg-blue-50 px-4 py-2 text-sm text-blue-700">
          <span className="mr-2">💡</span>
          Drag the grip handles to reorder categories and items
        </div>
      </div>
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

      {/* Enhanced Service Addition */}
      <div className="rounded-2xl border border-gray-200 bg-white shadow-lg">
        <div className="border-b border-gray-200 px-8 py-6">
          <h3 className="text-2xl font-bold text-gray-900">Add Services</h3>
          <p className="mt-2 text-lg text-gray-600">
            Add services from templates or create custom services
          </p>
        </div>
        <div className="p-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <button
              onClick={() => setShowAddHeading(true)}
              className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-purple-50 to-purple-100 p-8 text-gray-600 transition-all duration-200 hover:border-purple-400 hover:from-purple-100 hover:to-purple-200 hover:text-purple-700 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200">
                  <FileText className="h-8 w-8" />
                </div>
                <span className="block text-lg font-semibold">Add Heading</span>
                <span className="block text-sm text-gray-500">
                  Section title/divider
                </span>
              </div>
            </button>

            <button
              onClick={() => setShowAddCategory(true)}
              className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-green-50 to-green-100 p-8 text-gray-600 transition-all duration-200 hover:border-green-400 hover:from-green-100 hover:to-green-200 hover:text-green-700 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100 group-hover:bg-green-200">
                  <Plus className="h-8 w-8" />
                </div>
                <span className="block text-lg font-semibold">
                  Add Category
                </span>
                <span className="block text-sm text-gray-500">
                  Create new category
                </span>
              </div>
            </button>

            <button
              onClick={openServiceOptions}
              className="group relative overflow-hidden rounded-2xl border-2 border-dashed border-gray-300 bg-gradient-to-br from-blue-50 to-blue-100 p-8 text-gray-600 transition-all duration-200 hover:border-blue-400 hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 hover:shadow-lg"
            >
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
                  <FileText className="h-8 w-8" />
                </div>
                <span className="block text-lg font-semibold">
                  From Template
                </span>
                <span className="block text-sm text-gray-500">
                  Use predefined services
                </span>
              </div>
            </button>
          </div>
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

                    <div className="flex justify-between">
                      <button
                        onClick={() => setShowSaveAsTemplate(true)}
                        disabled={
                          !newItemName ||
                          !newItemUnit ||
                          !newItemQuantity ||
                          !newItemPrice
                        }
                        className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                      >
                        <Save className="mr-2 h-4 w-4" />
                        Save as Template
                      </button>

                      <div className="flex space-x-3">
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
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Services Display with Drag & Drop */}
      {formData.services.length > 0 && (
        <div className="space-y-6">
          {/* Drag & Drop Info */}
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-3">
            <div className="flex items-center space-x-2">
              <GripVertical className="h-4 w-4 text-blue-600" />
              <span className="text-sm text-blue-800">
                <strong>Tip:</strong> Drag the grip handles to reorder
                categories and items within categories.
              </span>
            </div>
          </div>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="services" type="services">
              {(provided) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  className="space-y-6"
                >
                  {formData.services.map((service, serviceIndex) => (
                    <Draggable
                      key={`service-${serviceIndex}`}
                      draggableId={`service-${serviceIndex}`}
                      index={serviceIndex}
                    >
                      {(provided, snapshot) => {
                        // Render different UI based on service type
                        if (service.type === "heading") {
                          return (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`rounded-lg border border-purple-200 bg-purple-50 transition-shadow ${
                                snapshot.isDragging ? "shadow-lg" : ""
                              }`}
                            >
                              <div className="flex items-center justify-between px-4 py-4">
                                <div className="flex items-center space-x-4">
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab text-purple-400 hover:text-purple-600 active:cursor-grabbing"
                                  >
                                    <GripVertical className="h-5 w-5" />
                                  </div>
                                  <div>
                                    <h2 className="text-xl font-bold text-purple-900">
                                      {service.headingText}
                                    </h2>
                                    {service.headingDescription && (
                                      <p className="mt-1 text-sm text-purple-700">
                                        {service.headingDescription}
                                      </p>
                                    )}
                                  </div>
                                  <span className="inline-flex items-center rounded-full bg-purple-100 px-2.5 py-0.5 text-xs font-medium text-purple-800">
                                    Heading
                                  </span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <button
                                    onClick={() =>
                                      startEditHeading(serviceIndex, service)
                                    }
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    <Pencil className="h-5 w-5" />
                                  </button>
                                  <button
                                    onClick={() => removeCategory(serviceIndex)}
                                    className="text-purple-600 hover:text-purple-800"
                                  >
                                    <Trash2 className="h-5 w-5" />
                                  </button>
                                </div>
                              </div>
                            </div>
                          );
                        }

                        // Render category UI
                        return (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`rounded-2xl border border-gray-200 bg-white shadow-lg transition-all duration-200 ${
                              snapshot.isDragging
                                ? "scale-105 shadow-2xl"
                                : "hover:shadow-xl"
                            }`}
                          >
                            <div className="flex items-center justify-between rounded-t-2xl border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
                              <div className="flex items-center space-x-4">
                                <div
                                  {...provided.dragHandleProps}
                                  className="cursor-grab rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-600 active:cursor-grabbing"
                                >
                                  <GripVertical className="h-5 w-5" />
                                </div>
                                <div>
                                  <h3 className="text-xl font-bold text-gray-900">
                                    {service.categoryName}
                                  </h3>
                                  <div className="mt-1 flex items-center space-x-4">
                                    <span className="text-sm text-gray-500">
                                      {service.items.length} item
                                      {service.items.length !== 1 ? "s" : ""}
                                    </span>
                                    <span className="text-lg font-bold text-green-600">
                                      £{(service.categoryTotal || 0).toFixed(2)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() =>
                                    openCategoryItemOptions(serviceIndex)
                                  }
                                  className="rounded-lg p-2 text-green-600 transition-colors hover:bg-green-50 hover:text-green-800"
                                  title="Add item to this category"
                                >
                                  <Plus className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() =>
                                    startEditCategory(serviceIndex, service)
                                  }
                                  className="rounded-lg p-2 text-blue-600 transition-colors hover:bg-blue-50 hover:text-blue-800"
                                  title="Edit category"
                                >
                                  <Pencil className="h-5 w-5" />
                                </button>
                                <button
                                  onClick={() => removeCategory(serviceIndex)}
                                  className="rounded-lg p-2 text-red-600 transition-colors hover:bg-red-50 hover:text-red-800"
                                  title="Delete category"
                                >
                                  <Trash2 className="h-5 w-5" />
                                </button>
                              </div>
                            </div>

                            {service.items && service.items.length > 0 && (
                              <div className="p-4">
                                <Droppable
                                  droppableId={`category-${serviceIndex}`}
                                  type="item"
                                >
                                  {(provided) => (
                                    <div
                                      {...provided.droppableProps}
                                      ref={provided.innerRef}
                                      className="space-y-3"
                                    >
                                      {service.items.map((item, itemIndex) => (
                                        <Draggable
                                          key={`item-${serviceIndex}-${itemIndex}`}
                                          draggableId={`item-${serviceIndex}-${itemIndex}`}
                                          index={itemIndex}
                                        >
                                          {(provided, snapshot) => (
                                            <div
                                              ref={provided.innerRef}
                                              {...provided.draggableProps}
                                              className={`rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all duration-200 ${
                                                snapshot.isDragging
                                                  ? "scale-105 shadow-xl"
                                                  : "hover:shadow-md"
                                              }`}
                                            >
                                              <div className="flex flex-1 items-center space-x-3">
                                                <div
                                                  {...provided.dragHandleProps}
                                                  className="cursor-grab text-gray-400 hover:text-gray-600 active:cursor-grabbing"
                                                >
                                                  <GripVertical className="h-4 w-4" />
                                                </div>
                                                <div className="flex-1">
                                                  <div className="flex items-center space-x-3">
                                                    <h4 className="font-medium text-gray-900">
                                                      {item.name}
                                                    </h4>
                                                    {item.source && (
                                                      <span
                                                        className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                                          item.source ===
                                                          "template"
                                                            ? "bg-blue-100 text-blue-800"
                                                            : "bg-gray-100 text-gray-800"
                                                        }`}
                                                      >
                                                        {item.source ===
                                                        "template"
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
                                                    <span>
                                                      Unit: {item.unit}
                                                    </span>
                                                    <span>
                                                      Quantity: {item.quantity}
                                                    </span>
                                                    <span>
                                                      Price: £
                                                      {(
                                                        item.unitPrice || 0
                                                      ).toFixed(2)}
                                                    </span>
                                                    <span className="font-medium text-gray-900">
                                                      Total: £
                                                      {(
                                                        item.total || 0
                                                      ).toFixed(2)}
                                                    </span>
                                                  </div>
                                                  {item.notes && (
                                                    <p className="mt-1 whitespace-pre-line text-sm text-gray-500">
                                                      {item.notes}
                                                    </p>
                                                  )}
                                                </div>
                                              </div>

                                              <div className="ml-3 flex items-center space-x-2">
                                                <button
                                                  onClick={() =>
                                                    startEditItem(
                                                      serviceIndex,
                                                      itemIndex,
                                                      item,
                                                    )
                                                  }
                                                  className="text-blue-600 hover:text-blue-800"
                                                  title="Edit item"
                                                >
                                                  <Edit3 className="h-4 w-4" />
                                                </button>
                                                <button
                                                  onClick={() => {
                                                    setExistingItemToSave(item);
                                                    setShowSaveExistingAsTemplate(
                                                      true,
                                                    );
                                                  }}
                                                  className="text-green-600 hover:text-green-800"
                                                  title="Save as template"
                                                >
                                                  <Save className="h-4 w-4" />
                                                </button>
                                                <button
                                                  onClick={() =>
                                                    removeItem(
                                                      serviceIndex,
                                                      itemIndex,
                                                    )
                                                  }
                                                  className="text-red-600 hover:text-red-800"
                                                  title="Delete item"
                                                >
                                                  <Trash2 className="h-4 w-4" />
                                                </button>
                                              </div>
                                            </div>
                                          )}
                                        </Draggable>
                                      ))}
                                      {provided.placeholder}
                                    </div>
                                  )}
                                </Droppable>
                              </div>
                            )}
                          </div>
                        );
                      }}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>

          {/* Grand Total */}
          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">Grand Total</h3>
              <span className="text-xl font-bold text-gray-900">
                £
                {formData.services
                  .filter((service) => service.type === "category")
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

      {/* Edit Category Modal */}
      {editingCategory !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                Edit Category
              </h2>
              <button
                onClick={cancelEditCategory}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category Name
                </label>
                <input
                  type="text"
                  value={editCategoryFormData.categoryName}
                  onChange={(e) =>
                    setEditCategoryFormData({
                      ...editCategoryFormData,
                      categoryName: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={cancelEditCategory}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={saveEditCategory}
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

      {/* Edit Heading Modal */}
      {editingHeading !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
              <h2 className="text-lg font-medium text-gray-900">
                Edit Heading
              </h2>
              <button
                onClick={cancelEditHeading}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Heading Text
                </label>
                <input
                  type="text"
                  value={editHeadingFormData.headingText}
                  onChange={(e) =>
                    setEditHeadingFormData({
                      ...editHeadingFormData,
                      headingText: e.target.value,
                    })
                  }
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Description (Optional)
                </label>
                <textarea
                  value={editHeadingFormData.headingDescription}
                  onChange={(e) =>
                    setEditHeadingFormData({
                      ...editHeadingFormData,
                      headingDescription: e.target.value,
                    })
                  }
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                  placeholder="Optional description for this section..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  onClick={cancelEditHeading}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancel
                </button>
                <button
                  onClick={saveEditHeading}
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

        {/* Add Heading Modal */}
        {showAddHeading && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Add Heading
                </h2>
                <button
                  onClick={() => setShowAddHeading(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Heading Text *
                  </label>
                  <input
                    type="text"
                    value={newHeadingText}
                    onChange={(e) => setNewHeadingText(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    placeholder="e.g., Bathroom Renovation"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description (optional)
                  </label>
                  <textarea
                    value={newHeadingDescription}
                    onChange={(e) => setNewHeadingDescription(e.target.value)}
                    rows={3}
                    className="mt-1 block w-full resize-none rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    placeholder="Brief description of this section..."
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddHeading(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addHeading}
                    disabled={!newHeadingText.trim()}
                    className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    Add Heading
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Add Category Modal */}
        {showAddCategory && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="relative w-full max-w-lg rounded-lg bg-white shadow-xl">
              <div className="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 className="text-lg font-medium text-gray-900">
                  Add Category
                </h2>
                <button
                  onClick={() => setShowAddCategory(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-4 p-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Category Name *
                  </label>
                  <input
                    type="text"
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                    placeholder="e.g., Tiling Work"
                    required
                  />
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setShowAddCategory(false)}
                    className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={addCategory}
                    disabled={!newCategory.trim()}
                    className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    Add Category
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save as Template Modal */}
        {showSaveAsTemplate && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => setShowSaveAsTemplate(false)}
              ></div>

              <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
                &#8203;
              </span>

              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Save className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Save as Template Service
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Save this service as a reusable template for future
                          quotes.
                        </p>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Template Category *
                        </label>
                        <input
                          type="text"
                          value={templateCategory}
                          onChange={(e) => setTemplateCategory(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="e.g., Plumbing, Electrical, Flooring"
                          required
                        />
                      </div>

                      <div className="mt-4 rounded-md bg-gray-50 p-3">
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Service Details:
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <strong>Name:</strong> {newItemName}
                          </p>
                          <p>
                            <strong>Description:</strong>{" "}
                            {newItemDescription || "No description"}
                          </p>
                          <p>
                            <strong>Unit:</strong> {newItemUnit}
                          </p>
                          <p>
                            <strong>Price:</strong> £{newItemPrice}
                          </p>
                          {newItemNotes && (
                            <p>
                              <strong>Notes:</strong> {newItemNotes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={saveAsTemplate}
                    disabled={!templateCategory.trim()}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Template
                  </button>
                  <button
                    onClick={() => setShowSaveAsTemplate(false)}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Save Existing Item as Template Modal */}
        {showSaveExistingAsTemplate && existingItemToSave && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={() => {
                  setShowSaveExistingAsTemplate(false);
                  setExistingItemToSave(null);
                }}
              ></div>

              <span className="hidden sm:inline-block sm:h-screen sm:align-middle">
                &#8203;
              </span>

              <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                      <Save className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                      <h3 className="text-lg font-medium leading-6 text-gray-900">
                        Save as Template Service
                      </h3>
                      <div className="mt-2">
                        <p className="text-sm text-gray-500">
                          Save this existing service as a reusable template for
                          future quotes.
                        </p>
                      </div>

                      <div className="mt-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Template Category *
                        </label>
                        <input
                          type="text"
                          value={templateCategory}
                          onChange={(e) => setTemplateCategory(e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                          placeholder="e.g., Plumbing, Electrical, Flooring"
                          required
                        />
                      </div>

                      <div className="mt-4 rounded-md bg-gray-50 p-3">
                        <h4 className="mb-2 text-sm font-medium text-gray-700">
                          Service Details:
                        </h4>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p>
                            <strong>Name:</strong> {existingItemToSave.name}
                          </p>
                          <p>
                            <strong>Description:</strong>{" "}
                            {existingItemToSave.description || "No description"}
                          </p>
                          <p>
                            <strong>Unit:</strong> {existingItemToSave.unit}
                          </p>
                          <p>
                            <strong>Price:</strong> £
                            {existingItemToSave.unitPrice}
                          </p>
                          {existingItemToSave.notes && (
                            <p>
                              <strong>Notes:</strong> {existingItemToSave.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                  <button
                    onClick={saveExistingAsTemplate}
                    disabled={!templateCategory.trim()}
                    className="inline-flex w-full justify-center rounded-md border border-transparent bg-green-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Save Template
                  </button>
                  <button
                    onClick={() => {
                      setShowSaveExistingAsTemplate(false);
                      setExistingItemToSave(null);
                    }}
                    className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Category Item Options Modal */}
        {showCategoryItemOptions && selectedCategoryIndex !== null && (
          <div className="fixed inset-0 z-50 overflow-y-auto">
            <div className="flex min-h-screen items-center justify-center p-4">
              <div
                className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
                onClick={closeCategoryItemOptions}
              ></div>

              <div className="relative w-full max-w-2xl rounded-2xl bg-white shadow-xl">
                <div className="border-b border-gray-200 px-8 py-6">
                  <h3 className="text-2xl font-bold text-gray-900">
                    Add Item to "
                    {formData.services[selectedCategoryIndex]?.categoryName}"
                  </h3>
                  <p className="mt-2 text-lg text-gray-600">
                    Choose how you want to add an item to this category
                  </p>
                </div>

                <div className="p-8">
                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    <button
                      onClick={() => setCategoryItemOption("custom")}
                      className={`group relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-gray-600 transition-all duration-200 ${
                        categoryItemOption === "custom"
                          ? "border-purple-400 bg-purple-100 text-purple-700 shadow-lg"
                          : "border-gray-300 bg-gradient-to-br from-purple-50 to-purple-100 hover:border-purple-400 hover:from-purple-100 hover:to-purple-200 hover:text-purple-700 hover:shadow-lg"
                      }`}
                    >
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-purple-100 group-hover:bg-purple-200">
                          <Edit3 className="h-8 w-8" />
                        </div>
                        <span className="block text-lg font-semibold">
                          Custom Item
                        </span>
                        <span className="block text-sm text-gray-500">
                          Create a new item manually
                        </span>
                      </div>
                    </button>

                    <button
                      onClick={() => setCategoryItemOption("template")}
                      className={`group relative overflow-hidden rounded-2xl border-2 border-dashed p-8 text-gray-600 transition-all duration-200 ${
                        categoryItemOption === "template"
                          ? "border-blue-400 bg-blue-100 text-blue-700 shadow-lg"
                          : "border-gray-300 bg-gradient-to-br from-blue-50 to-blue-100 hover:border-blue-400 hover:from-blue-100 hover:to-blue-200 hover:text-blue-700 hover:shadow-lg"
                      }`}
                    >
                      <div className="text-center">
                        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 group-hover:bg-blue-200">
                          <FileText className="h-8 w-8" />
                        </div>
                        <span className="block text-lg font-semibold">
                          From Template
                        </span>
                        <span className="block text-sm text-gray-500">
                          Use a predefined service
                        </span>
                      </div>
                    </button>
                  </div>

                  {/* Custom Item Form */}
                  {categoryItemOption === "custom" && (
                    <div className="mt-8 space-y-6">
                      <h4 className="text-xl font-semibold text-gray-900">
                        Add Custom Item
                      </h4>

                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Service Name *
                          </label>
                          <input
                            type="text"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
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
                            className={`mt-1 block w-full rounded-lg px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500 ${
                              !newItemUnit
                                ? "border-red-300"
                                : "border-gray-300"
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
                            className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
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
                              <span className="text-gray-500 sm:text-sm">
                                £
                              </span>
                            </div>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              value={newItemPrice}
                              onChange={(e) => setNewItemPrice(e.target.value)}
                              className="block w-full rounded-lg border border-gray-300 py-2 pl-7 pr-3 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
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
                          onChange={(e) =>
                            setNewItemDescription(e.target.value)
                          }
                          rows={2}
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                          placeholder="Describe what this service includes..."
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
                          className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                          placeholder="Additional notes or special instructions..."
                        />
                      </div>

                      <div className="flex justify-end space-x-3">
                        <button
                          onClick={closeCategoryItemOptions}
                          className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={addItemToCategory}
                          disabled={
                            !newItemName ||
                            !newItemUnit ||
                            !newItemQuantity ||
                            !newItemPrice
                          }
                          className="inline-flex items-center rounded-lg border border-transparent bg-purple-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:opacity-50"
                        >
                          Add to Category
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Template Service Selection */}
                  {categoryItemOption === "template" && (
                    <div className="mt-8 space-y-6">
                      <h4 className="text-xl font-semibold text-gray-900">
                        Select Template Service
                      </h4>

                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                          type="text"
                          placeholder="Search template services..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 py-2 pl-10 pr-3 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                        />
                      </div>

                      <div className="max-h-60 space-y-2 overflow-y-auto">
                        {filteredTemplateServices.map((service) => (
                          <div
                            key={service._id}
                            onClick={() => setSelectedTemplateService(service)}
                            className={`cursor-pointer rounded-lg border p-4 transition-colors ${
                              selectedTemplateService?._id === service._id
                                ? "border-blue-500 bg-blue-50"
                                : "border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50"
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex-1">
                                <h5 className="font-medium text-gray-900">
                                  {service.name}
                                </h5>
                                <p className="text-sm text-gray-600">
                                  {service.description}
                                </p>
                                <div className="mt-1 flex items-center space-x-4 text-xs text-gray-500">
                                  <span>Category: {service.category}</span>
                                  <span>Unit: {service.unit}</span>
                                  {service.pricingType === "fixed" && (
                                    <span>Price: £{service.fixedPrice}</span>
                                  )}
                                </div>
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
                              className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
                              placeholder="1.0"
                              required
                            />
                          </div>

                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={closeCategoryItemOptions}
                              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={addTemplateService}
                              disabled={!templateServiceQuantity}
                              className="inline-flex items-center rounded-lg border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                            >
                              Add to Category
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Add Item Buttons */}
      {formData.services.length > 0 && (
        <div className="fixed bottom-8 right-8 z-40 flex flex-col space-y-3">
          <button
            onClick={() => setShowAddCategory(true)}
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-green-600 shadow-lg transition-all hover:bg-green-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            title="Add Category"
          >
            <Plus className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={() => setShowAddHeading(true)}
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-purple-600 shadow-lg transition-all hover:bg-purple-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
            title="Add Heading"
          >
            <FileText className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={openServiceOptions}
            className="group flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 shadow-lg transition-all hover:bg-blue-700 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            title="Add from Template"
          >
            <FileText className="h-6 w-6 text-white" />
          </button>
        </div>
      )}
    </div>
  );
}
