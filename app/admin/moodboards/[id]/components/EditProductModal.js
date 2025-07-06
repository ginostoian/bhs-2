"use client";

import { useState, useEffect } from "react";

/**
 * Edit Product Modal Component
 * Form for editing existing products
 */
export default function EditProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    customTitle: "",
    customPrice: "",
    quantity: 1,
    customSupplier: "",
    customCategory: "",
    customImageUrl: "",
    customProductUrl: "",
    notes: "",
  });

  // Update form when product changes
  useEffect(() => {
    if (product) {
      setFormData({
        customTitle: product.customTitle || product.product?.name || "",
        customPrice: (
          product.customPrice ||
          product.product?.price ||
          0
        ).toString(),
        quantity: product.quantity || 1,
        customSupplier:
          product.customSupplier || product.product?.supplier || "",
        customCategory:
          product.customCategory || product.product?.category || "",
        customImageUrl:
          product.customImageUrl || product.product?.imageUrl || "",
        customProductUrl:
          product.customProductUrl || product.product?.productUrl || "",
        notes: product.notes || "",
      });
    }
  }, [product, isOpen]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.customTitle) {
      alert("Please enter a product title");
      return;
    }

    if (!formData.customPrice || isNaN(parseFloat(formData.customPrice))) {
      alert("Please enter a valid price");
      return;
    }

    const submitData = {
      customTitle: formData.customTitle,
      customPrice: parseFloat(formData.customPrice),
      quantity: parseInt(formData.quantity),
      customSupplier: formData.customSupplier,
      customCategory: formData.customCategory,
      customImageUrl: formData.customImageUrl,
      customProductUrl: formData.customProductUrl,
      notes: formData.notes,
    };

    onSubmit(submitData);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-2xl rounded-lg bg-white shadow-xl">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Edit Product
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg
                className="h-6 w-6"
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

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Product Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Product Title *
              </label>
              <input
                type="text"
                name="customTitle"
                value={formData.customTitle}
                onChange={handleChange}
                placeholder="Enter product name"
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            {/* Price and Quantity */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Price (inc. VAT) *
                </label>
                <input
                  type="number"
                  name="customPrice"
                  value={formData.customPrice}
                  onChange={handleChange}
                  placeholder="0.00"
                  step="0.01"
                  min="0"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Quantity
                </label>
                <input
                  type="number"
                  name="quantity"
                  value={formData.quantity}
                  onChange={handleChange}
                  placeholder="1"
                  min="1"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Category and Supplier */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <input
                  type="text"
                  name="customCategory"
                  value={formData.customCategory}
                  onChange={handleChange}
                  placeholder="e.g., Kitchen Appliances"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Supplier
                </label>
                <input
                  type="text"
                  name="customSupplier"
                  value={formData.customSupplier}
                  onChange={handleChange}
                  placeholder="e.g., John Lewis"
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* URLs */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Product URL
                </label>
                <input
                  type="url"
                  name="customProductUrl"
                  value={formData.customProductUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Image URL
                </label>
                <input
                  type="url"
                  name="customImageUrl"
                  value={formData.customImageUrl}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows={3}
                placeholder="Additional notes about this product..."
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6">
              <button
                type="button"
                onClick={onClose}
                className="rounded-md bg-gray-100 px-4 py-2 text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
