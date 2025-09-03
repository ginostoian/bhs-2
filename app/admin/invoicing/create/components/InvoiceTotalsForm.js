"use client";

import { useState, useEffect, useCallback } from "react";

export default function InvoiceTotalsForm({ formData, markSectionComplete }) {
  const [totals, setTotals] = useState({
    subtotal: 0,
    totalVat: 0,
    total: 0,
  });

  useEffect(() => {
    // Always mark this section as complete since it's just a review
    markSectionComplete("totals");

    // Calculate totals
    calculateTotals();
  }, [formData.lineItems, calculateTotals, markSectionComplete]);

  const calculateTotals = useCallback(() => {
    let subtotal = 0;
    let totalVat = 0;

    formData.lineItems.forEach((item) => {
      const itemSubtotal = item.priceExclVat * item.quantity;
      const itemVat = itemSubtotal * (item.vatRate / 100);

      subtotal += itemSubtotal;
      totalVat += itemVat;
    });

    const total = subtotal + totalVat;

    setTotals({
      subtotal: parseFloat(subtotal.toFixed(2)),
      totalVat: parseFloat(totalVat.toFixed(2)),
      total: parseFloat(total.toFixed(2)),
    });
  }, [formData.lineItems]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not set";
    return new Date(dateString).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Invoice Summary */}
      <div className="rounded-lg bg-gray-50 p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Invoice Summary
        </h3>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Client Information */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              Client Information
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>
                <strong>Name:</strong> {formData.client.name}
              </div>
              <div>
                <strong>Email:</strong> {formData.client.email}
              </div>
              <div>
                <strong>Phone:</strong> {formData.client.phone}
              </div>
              <div>
                <strong>Address:</strong> {formData.client.address}
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-gray-700">
              Invoice Details
            </h4>
            <div className="space-y-1 text-sm text-gray-600">
              <div>
                <strong>Title:</strong> {formData.title}
              </div>
              <div>
                <strong>Due Date:</strong> {formatDate(formData.dueDate)}
              </div>
              {formData.notes && (
                <div>
                  <strong>Notes:</strong> {formData.notes}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Line Items Summary */}
      <div>
        <h3 className="mb-4 text-lg font-medium text-gray-900">Line Items</h3>
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Service Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Price (excl. VAT)
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  VAT Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Type
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Quantity
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Total (inc. VAT)
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {formData.lineItems.map((item, index) => (
                <tr
                  key={item.id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {item.serviceName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {formatCurrency(item.priceExclVat)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {item.vatRate}%
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.type === "Labour"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {item.type}
                    </span>
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {item.quantity}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {formatCurrency(item.totalVatIncluded)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Totals */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Invoice Totals
        </h3>

        <div className="space-y-3">
          <div className="flex items-center justify-between border-b border-gray-200 py-2">
            <span className="text-sm text-gray-600">Subtotal (excl. VAT):</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(totals.subtotal)}
            </span>
          </div>

          <div className="flex items-center justify-between border-b border-gray-200 py-2">
            <span className="text-sm text-gray-600">Total VAT:</span>
            <span className="text-sm font-medium text-gray-900">
              {formatCurrency(totals.totalVat)}
            </span>
          </div>

          <div className="flex items-center justify-between border-t-2 border-gray-300 py-3">
            <span className="text-lg font-medium text-gray-900">
              Total Amount:
            </span>
            <span className="text-lg font-bold text-gray-900">
              {formatCurrency(totals.total)}
            </span>
          </div>
        </div>
      </div>

      {/* VAT Breakdown */}
      {formData.lineItems.length > 0 && (
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-3 text-sm font-medium text-gray-700">
            VAT Breakdown
          </h4>
          <div className="space-y-2">
            {[...new Set(formData.lineItems.map((item) => item.vatRate))].map(
              (rate) => {
                const itemsWithThisRate = formData.lineItems.filter(
                  (item) => item.vatRate === rate,
                );
                const rateSubtotal = itemsWithThisRate.reduce(
                  (sum, item) => sum + item.priceExclVat * item.quantity,
                  0,
                );
                const rateVat = rateSubtotal * (rate / 100);

                return (
                  <div key={rate} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      VAT @ {rate}% on {formatCurrency(rateSubtotal)}:
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatCurrency(rateVat)}
                    </span>
                  </div>
                );
              },
            )}
          </div>
        </div>
      )}

      {/* Terms and Conditions */}
      {formData.terms && (
        <div className="rounded-lg bg-gray-50 p-4">
          <h4 className="mb-2 text-sm font-medium text-gray-700">
            Terms and Conditions
          </h4>
          <p className="whitespace-pre-wrap text-sm text-gray-600">
            {formData.terms}
          </p>
        </div>
      )}

      {/* Ready to Create */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <div className="flex items-start">
          <div className="flex-shrink-0">
            <svg
              className="h-5 w-5 text-blue-400"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              Ready to Create Invoice
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                Review the information above and click &quot;Create
                Invoice&quot; to generate your invoice. The invoice will be
                saved as a draft and you can edit it or send it to the client.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
