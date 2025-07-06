"use client";

import { useState, useEffect } from "react";
import ProductSearchSelector from "./ProductSearchSelector";

/**
 * Add Product Modal Component
 * Form for adding products to sections
 */
export default function AddProductModal({
  isOpen,
  onClose,
  onSubmit,
  sectionId,
  allProducts,
  categories,
  suppliers,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    productId: "",
    customTitle: "",
    customPrice: "",
    quantity: 1,
    customSupplier: "",
    customCategory: "",
    customImageUrl: "",
    customProductUrl: "",
    notes: "",
  });
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [useCustomProduct, setUseCustomProduct] = useState(false);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setFormData({
        productId: "",
        customTitle: "",
        customPrice: "",
        quantity: 1,
        customSupplier: "",
        customCategory: "",
        customImageUrl: "",
        customProductUrl: "",
        notes: "",
      });
      setSelectedProduct(null);
      setUseCustomProduct(false);
    }
  }, [isOpen]);

  // Handle product selection
  const handleProductSelect = (productId) => {
    const product = allProducts.find((p) => p.id === productId);
    setSelectedProduct(product);
    setFormData((prev) => ({
      ...prev,
      productId,
      customTitle: product?.name || "",
      customPrice: product?.price?.toString() || "",
      customSupplier: product?.supplier || "",
      customCategory: product?.category || "",
      customImageUrl: product?.imageUrl || "",
      customProductUrl: product?.productUrl || "",
    }));
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!useCustomProduct && !formData.productId) {
      alert("Please select a product or enable custom product");
      return;
    }

    if (useCustomProduct && !formData.customTitle) {
      alert("Please enter a product title");
      return;
    }

    if (!formData.customPrice || isNaN(parseFloat(formData.customPrice))) {
      alert("Please enter a valid price");
      return;
    }

    const submitData = {
      quantity: parseInt(formData.quantity),
      notes: formData.notes,
    };

    if (useCustomProduct) {
      // Custom product mode - send all custom fields
      Object.assign(submitData, {
        customTitle: formData.customTitle,
        customPrice: parseFloat(formData.customPrice),
        customSupplier: formData.customSupplier,
        customCategory: formData.customCategory,
        customImageUrl: formData.customImageUrl,
        customProductUrl: formData.customProductUrl,
      });
    } else {
      // Database product mode - only send productId and optional override fields
      Object.assign(submitData, {
        productId: formData.productId,
      });

      // Only include custom price if it's different from the original product
      if (
        selectedProduct &&
        formData.customPrice !== selectedProduct.price.toString()
      ) {
        submitData.customPrice = parseFloat(formData.customPrice);
      }
    }

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
              Add Product to Section
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
            {/* Product Selection Type */}
            <div>
              <div className="flex items-center space-x-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={!useCustomProduct}
                    onChange={() => setUseCustomProduct(false)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Select from Database
                  </span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    checked={useCustomProduct}
                    onChange={() => setUseCustomProduct(true)}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">
                    Custom Product
                  </span>
                </label>
              </div>
            </div>

            {!useCustomProduct ? (
              /* Product Selection */
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Select Product *
                </label>
                <ProductSearchSelector
                  products={allProducts}
                  categories={categories}
                  suppliers={suppliers}
                  selectedProductId={formData.productId}
                  onProductSelect={handleProductSelect}
                />
              </div>
            ) : (
              /* Custom Product Fields */
              <div className="space-y-4">
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

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="customCategory"
                      value={formData.customCategory}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select category...</option>
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Supplier
                    </label>
                    <select
                      name="customSupplier"
                      value={formData.customSupplier}
                      onChange={handleChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="">Select supplier...</option>
                      {suppliers.map((supplier) => (
                        <option key={supplier} value={supplier}>
                          {supplier}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
            )}

            {/* Override Fields (for selected products) */}
            {!useCustomProduct && selectedProduct && (
              <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
                <h4 className="mb-3 text-sm font-medium text-gray-900">
                  Override Product Details (Optional)
                </h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-gray-700">
                      Custom Title
                    </label>
                    <input
                      type="text"
                      name="customTitle"
                      value={formData.customTitle}
                      onChange={handleChange}
                      placeholder={selectedProduct.name}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Custom Price
                      </label>
                      <input
                        type="number"
                        name="customPrice"
                        value={formData.customPrice}
                        onChange={handleChange}
                        placeholder={selectedProduct.price.toString()}
                        step="0.01"
                        min="0"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        placeholder="1"
                        min="1"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

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
                {isSubmitting ? "Adding..." : "Add Product"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
