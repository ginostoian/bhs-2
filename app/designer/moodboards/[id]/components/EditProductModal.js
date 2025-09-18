"use client";

import { useState, useEffect } from "react";

/**
 * Edit Product Modal Component
 * Form for editing products in a section
 */
export default function EditProductModal({
  isOpen,
  onClose,
  onSubmit,
  product,
  isSubmitting,
}) {
  const [formData, setFormData] = useState({
    quantity: 1,
    customPrice: "",
    notes: "",
    approvalStatus: "pending",
  });

  // Reset form when modal opens/closes or product changes
  useEffect(() => {
    if (isOpen && product) {
      setFormData({
        quantity: product.quantity || 1,
        customPrice: product.customPrice?.toString() || "",
        notes: product.notes || "",
        approvalStatus: product.approvalStatus || "pending",
      });
    }
  }, [isOpen, product]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();

    const productData = {
      ...formData,
      customPrice: formData.customPrice
        ? parseFloat(formData.customPrice)
        : null,
    };

    onSubmit(productData);
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-end justify-center px-4 pb-20 pt-4 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block transform overflow-hidden rounded-lg bg-white text-left align-bottom shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg sm:align-middle">
          <form onSubmit={handleSubmit}>
            <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 sm:mx-0 sm:h-10 sm:w-10">
                  <svg
                    className="h-6 w-6 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                </div>
                <div className="mt-3 w-full text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <h3 className="text-lg font-medium leading-6 text-gray-900">
                    Edit Product
                  </h3>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Update the product details for this section.
                    </p>
                  </div>
                </div>
              </div>

              {/* Product Info */}
              <div className="mt-4 rounded-lg bg-gray-50 p-4">
                <div className="flex items-center space-x-3">
                  <img
                    src={product.product?.imageUrl}
                    alt={product.product?.name}
                    className="h-12 w-12 rounded-lg object-cover"
                  />
                  <div>
                    <h4 className="font-medium text-gray-900">
                      {product.product?.name}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {product.product?.supplier} • {product.product?.category}
                    </p>
                    <p className="text-sm font-medium text-gray-900">
                      £{product.product?.price}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                {/* Quantity */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleChange}
                    min="1"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  />
                </div>

                {/* Custom Price */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Custom Price (Optional)
                  </label>
                  <div className="relative mt-1 rounded-md shadow-sm">
                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <span className="text-gray-500 sm:text-sm">£</span>
                    </div>
                    <input
                      type="number"
                      name="customPrice"
                      value={formData.customPrice}
                      onChange={handleChange}
                      min="0"
                      step="0.01"
                      placeholder="0.00"
                      className="block w-full rounded-md border border-gray-300 py-2 pl-7 pr-3 focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                    />
                  </div>
                  <p className="mt-1 text-xs text-gray-500">
                    Leave empty to use original price
                  </p>
                </div>

                {/* Approval Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Approval Status
                  </label>
                  <select
                    name="approvalStatus"
                    value={formData.approvalStatus}
                    onChange={handleChange}
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="declined">Declined</option>
                  </select>
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
                    placeholder="Add any notes about this product"
                    className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:border-purple-500 focus:outline-none focus:ring-purple-500"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex w-full justify-center rounded-md border border-transparent bg-purple-600 px-4 py-2 text-base font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 sm:ml-3 sm:w-auto sm:text-sm"
              >
                {isSubmitting ? "Updating..." : "Update Product"}
              </button>
              <button
                type="button"
                onClick={onClose}
                className="mt-3 inline-flex w-full justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-base font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 sm:ml-3 sm:mt-0 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
