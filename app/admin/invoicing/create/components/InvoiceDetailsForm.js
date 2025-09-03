"use client";

import { useState, useEffect } from "react";

export default function InvoiceDetailsForm({
  formData,
  updateFormData,
  markSectionComplete,
  markSectionIncomplete,
  goToNextSection,
}) {
  useEffect(() => {
    const isValid = !!formData.title;

    if (isValid) {
      markSectionComplete("details");
    } else {
      markSectionIncomplete("details");
    }
  }, [formData.title, markSectionComplete, markSectionIncomplete]);

  const handleInputChange = (field, value) => {
    // Update top-level fields directly
    updateFormData(field, value);
  };

  const isFormValid = !!formData.title;

  // Get today's date in YYYY-MM-DD format for min date
  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Invoice Title *
          </label>
          <input
            type="text"
            required
            value={formData.title}
            onChange={(e) => handleInputChange("title", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="e.g., Bathroom Renovation Services, Monthly Maintenance, etc."
          />
          <p className="mt-1 text-xs text-gray-500">
            This will appear as the main heading on your invoice
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Due Date
          </label>
          <input
            type="date"
            value={formData.dueDate}
            onChange={(e) => handleInputChange("dueDate", e.target.value)}
            min={today}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
          />
          <p className="mt-1 text-xs text-gray-500">
            Leave empty if no specific due date is required
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Invoice Notes
          </label>
          <textarea
            rows={3}
            value={formData.notes}
            onChange={(e) => handleInputChange("notes", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Any additional notes or special instructions for this invoice..."
          />
          <p className="mt-1 text-xs text-gray-500">
            These notes will appear on the invoice (optional)
          </p>
        </div>

        <div className="sm:col-span-2">
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Terms and Conditions
          </label>
          <textarea
            rows={4}
            value={formData.terms}
            onChange={(e) => handleInputChange("terms", e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Payment terms and conditions..."
          />
          <p className="mt-1 text-xs text-gray-500">
            Standard payment terms and conditions for this invoice
          </p>
        </div>
      </div>

      {/* Continue Button */}
      <div className="flex justify-end border-t border-gray-200 pt-6">
        <button
          onClick={goToNextSection}
          disabled={!isFormValid}
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue to Line Items
        </button>
      </div>
    </div>
  );
}
