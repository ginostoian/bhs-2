"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";

export default function ServicesForm({ formData, updateFormData }) {
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newItemName, setNewItemName] = useState("");
  const [newItemDescription, setNewItemDescription] = useState("");
  const [newItemQuantity, setNewItemQuantity] = useState("");
  const [newItemUnit, setNewItemUnit] = useState("");
  const [newItemUnitPrice, setNewItemUnitPrice] = useState("");
  const [newItemNotes, setNewItemNotes] = useState("");

  const units = [
    { value: "sqm", label: "Square Meters (sqm)" },
    { value: "linear-m", label: "Linear Meters (m)" },
    { value: "day", label: "Days" },
    { value: "hour", label: "Hours" },
    { value: "piece", label: "Piece" },
    { value: "job", label: "Job" },
  ];

  const addCategory = () => {
    if (!newCategoryName.trim()) return;

    const newCategory = {
      categoryName: newCategoryName.trim(),
      categoryTotal: 0,
      items: [],
    };

    updateFormData("services", [...formData.services, newCategory]);
    setNewCategoryName("");
  };

  const removeCategory = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    updateFormData("services", updatedServices);
  };

  const addItem = (categoryIndex) => {
    if (
      !newItemName.trim() ||
      !newItemQuantity ||
      !newItemUnitPrice ||
      !newItemUnit
    )
      return;

    const quantity = parseFloat(newItemQuantity);
    const unitPrice = parseFloat(newItemUnitPrice);
    const total = quantity * unitPrice;

    const newItem = {
      name: newItemName.trim(),
      description: newItemDescription.trim(),
      quantity,
      unit: newItemUnit,
      unitPrice,
      total,
      notes: newItemNotes.trim(),
    };

    const updatedServices = [...formData.services];
    updatedServices[categoryIndex].items.push(newItem);

    // Recalculate category total
    updatedServices[categoryIndex].categoryTotal = updatedServices[
      categoryIndex
    ].items.reduce((sum, item) => sum + item.total, 0);

    updateFormData("services", updatedServices);

    // Reset form
    setNewItemName("");
    setNewItemDescription("");
    setNewItemQuantity("");
    setNewItemUnit("");
    setNewItemUnitPrice("");
    setNewItemNotes("");
  };

  const removeItem = (categoryIndex, itemIndex) => {
    const updatedServices = [...formData.services];
    updatedServices[categoryIndex].items.splice(itemIndex, 1);

    // Recalculate category total
    updatedServices[categoryIndex].categoryTotal = updatedServices[
      categoryIndex
    ].items.reduce((sum, item) => sum + item.total, 0);

    updateFormData("services", updatedServices);
  };

  const updateItem = (categoryIndex, itemIndex, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[categoryIndex].items[itemIndex][field] = value;

    // Recalculate item total if quantity or unit price changed
    if (field === "quantity" || field === "unitPrice") {
      const item = updatedServices[categoryIndex].items[itemIndex];
      item.total = item.quantity * item.unitPrice;
    }

    // Recalculate category total
    updatedServices[categoryIndex].categoryTotal = updatedServices[
      categoryIndex
    ].items.reduce((sum, item) => sum + item.total, 0);

    updateFormData("services", updatedServices);
  };

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
      </div>

      {/* Add New Category */}
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <h3 className="mb-3 text-sm font-medium text-gray-900">
          Add New Category
        </h3>
        <div className="flex space-x-3">
          <input
            type="text"
            value={newCategoryName}
            onChange={(e) => setNewCategoryName(e.target.value)}
            placeholder="Category name (e.g., Demolition & Preparation)"
            className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
          />
          <button
            onClick={addCategory}
            disabled={!newCategoryName.trim()}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            <Plus className="mr-1 h-4 w-4" />
            Add Category
          </button>
        </div>
      </div>

      {/* Service Categories */}
      {formData.services.map((category, categoryIndex) => (
        <div
          key={categoryIndex}
          className="rounded-lg border border-gray-200 bg-white"
        >
          <div className="border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900">
                {category.categoryName}
              </h3>
              <div className="flex items-center space-x-3">
                <span className="text-lg font-bold text-blue-600">
                  £{category.categoryTotal.toFixed(2)}
                </span>
                <button
                  onClick={() => removeCategory(categoryIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Add New Item */}
          <div className="border-b border-gray-200 bg-gray-50 p-4">
            <h4 className="mb-3 text-sm font-medium text-gray-900">
              Add New Item
            </h4>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
              <input
                type="text"
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder="Item name"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 md:col-span-2"
              />
              <input
                type="text"
                value={newItemDescription}
                onChange={(e) => setNewItemDescription(e.target.value)}
                placeholder="Description"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 md:col-span-2"
              />
              <input
                type="number"
                value={newItemQuantity}
                onChange={(e) => setNewItemQuantity(e.target.value)}
                placeholder="Qty"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <select
                value={newItemUnit}
                onChange={(e) => setNewItemUnit(e.target.value)}
                className={`rounded-md border px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 ${
                  !newItemUnit ? "border-red-300" : "border-gray-300"
                }`}
                required
              >
                <option value="">Unit *</option>
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
              <input
                type="number"
                value={newItemUnitPrice}
                onChange={(e) => setNewItemUnitPrice(e.target.value)}
                placeholder="Unit price (£)"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500"
              />
              <input
                type="text"
                value={newItemNotes}
                onChange={(e) => setNewItemNotes(e.target.value)}
                placeholder="Special notes"
                className="rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 md:col-span-2"
              />
            </div>
            <div className="mt-3">
              <button
                onClick={() => addItem(categoryIndex)}
                disabled={
                  !newItemName.trim() ||
                  !newItemQuantity ||
                  !newItemUnitPrice ||
                  !newItemUnit
                }
                className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50"
              >
                <Plus className="mr-1 h-4 w-4" />
                Add Item
              </button>
            </div>
          </div>

          {/* Items List */}
          <div className="p-4">
            {category.items.length === 0 ? (
              <p className="py-4 text-center text-gray-500">
                No items added yet
              </p>
            ) : (
              <div className="overflow-hidden rounded-lg border border-gray-200">
                {/* Table Header */}
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                    <div className="col-span-4">Service Item</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Unit Price</div>
                    <div className="col-span-2">Total</div>
                    <div className="col-span-2">Actions</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {category.items.map((item, itemIndex) => (
                    <div
                      key={itemIndex}
                      className="px-4 py-3 transition-colors duration-150 hover:bg-gray-50"
                    >
                      <div className="grid grid-cols-12 items-center gap-4 text-sm">
                        {/* Service Item */}
                        <div className="col-span-4">
                          <div className="space-y-1">
                            <h5 className="font-medium text-gray-900">
                              {item.name}
                            </h5>
                            {item.description && (
                              <p className="text-xs text-gray-600">
                                {item.description}
                              </p>
                            )}
                            {item.notes && (
                              <div className="mt-1 text-xs text-blue-700">
                                <span className="font-medium">Notes:</span>{" "}
                                {item.notes}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Quantity */}
                        <div className="col-span-2">
                          <span className="text-gray-700">
                            {item.quantity} {item.unit}
                          </span>
                        </div>

                        {/* Unit Price */}
                        <div className="col-span-2">
                          <span className="font-medium text-gray-700">
                            £{item.unitPrice.toFixed(2)}
                          </span>
                        </div>

                        {/* Total */}
                        <div className="col-span-2">
                          <span className="font-bold text-gray-900">
                            £{item.total.toFixed(2)}
                          </span>
                        </div>

                        {/* Actions */}
                        <div className="col-span-2">
                          <button
                            onClick={() => removeItem(categoryIndex, itemIndex)}
                            className="rounded p-1 text-red-600 transition-colors duration-150 hover:bg-red-50 hover:text-red-800"
                            title="Remove item"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}

      {formData.services.length === 0 && (
        <div className="py-8 text-center">
          <p className="text-gray-500">No service categories added yet.</p>
          <p className="mt-1 text-sm text-gray-400">
            Start by adding a service category above.
          </p>
        </div>
      )}
    </div>
  );
}
