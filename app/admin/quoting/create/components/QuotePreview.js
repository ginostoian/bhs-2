"use client";

import { useState } from "react";
import { Copy, ExternalLink, Download } from "lucide-react";
import toast from "react-hot-toast";

export default function QuotePreview({ formData, quoteId }) {
  const [copied, setCopied] = useState(false);

  // Calculate totals
  const subtotal = formData.services.reduce(
    (sum, category) => sum + (category.categoryTotal || 0),
    0,
  );

  const labourCost = subtotal * 0.6 * formData.pricing.labourMultiplier;
  const materialsCost = subtotal * 0.4 * formData.pricing.materialsMultiplier;
  const baseSubtotal = labourCost + materialsCost;
  const overheads = baseSubtotal * (formData.pricing.overheadPercentage / 100);
  const profit = baseSubtotal * (formData.pricing.profitPercentage / 100);
  const contingency =
    baseSubtotal * (formData.pricing.contingencyPercentage / 100);
  const vat =
    (baseSubtotal + overheads + profit + contingency) *
    (formData.pricing.vatRate / 100);
  const total = baseSubtotal + overheads + profit + contingency + vat;

  const shareableLink = quoteId ? `/quotes/${quoteId}` : "/quotes/temp-id";

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}${shareableLink}`,
      );
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-medium text-gray-900">Quote Preview</h2>
        <p className="mt-1 text-sm text-gray-500">
          Review your quote before generating. This is how it will appear to
          your client.
        </p>
      </div>

      {/* Company Header */}
      <div className="rounded-xl border-0 bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-lg">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white">Better Homes</h1>
          <p className="mt-2 text-xl text-blue-100">
            Professional Home Renovation Services
          </p>
          <div className="mt-4 flex justify-center space-x-6 text-sm text-blue-200">
            <span>London, UK</span>
            <span>•</span>
            <span>VAT Registered</span>
            <span>•</span>
            <span>Fully Insured</span>
            <span>•</span>
            <span>5 Star Rated</span>
          </div>
        </div>
      </div>

      {/* Quote Details */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              Client Information
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Name:</strong> {formData.client.name}
              </p>
              <p>
                <strong>Email:</strong> {formData.client.email}
              </p>
              <p>
                <strong>Phone:</strong> {formData.client.phone}
              </p>
              <p>
                <strong>Address:</strong> {formData.client.address}
              </p>
              <p>
                <strong>Postcode:</strong> {formData.client.postcode}
              </p>
            </div>
          </div>

          <div>
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              Project Details
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <strong>Project:</strong> {formData.project.title}
              </p>
              <p>
                <strong>Type:</strong>{" "}
                {formData.project.type
                  .replace(/-/g, " ")
                  .replace(/\b\w/g, (l) => l.toUpperCase())}
              </p>
              <p>
                <strong>Address:</strong> {formData.project.address}
              </p>
              <p>
                <strong>Duration:</strong> {formData.project.estimatedDuration}
              </p>
              {formData.project.startDate && (
                <p>
                  <strong>Start Date:</strong>{" "}
                  {new Date(formData.project.startDate).toLocaleDateString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {formData.project.description && (
          <div className="mt-6">
            <h3 className="mb-3 text-lg font-medium text-gray-900">
              Project Description
            </h3>
            <p className="text-sm text-gray-600">
              {formData.project.description}
            </p>
          </div>
        )}
      </div>

      {/* Services Breakdown */}
      <div className="overflow-hidden rounded-xl border-0 bg-white shadow-lg">
        <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4">
          <h3 className="text-xl font-semibold text-gray-800">
            Services & Costs
          </h3>
        </div>
        <div className="p-6">
          {formData.services.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-8 last:mb-0">
              <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                <h4 className="text-lg font-semibold text-blue-900">
                  {category.categoryName}
                </h4>
                <span className="rounded-lg bg-white px-4 py-2 text-xl font-bold text-blue-700 shadow-sm">
                  {formatCurrency(category.categoryTotal)}
                </span>
              </div>

              {/* Table Header */}
              <div className="mb-3 overflow-hidden rounded-lg border border-gray-200 bg-white">
                <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3">
                  <div className="grid grid-cols-12 gap-4 text-sm font-semibold text-gray-700">
                    <div className="col-span-5">Service Item</div>
                    <div className="col-span-2">Quantity</div>
                    <div className="col-span-2">Unit Price</div>
                    <div className="col-span-3">Total</div>
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
                        <div className="col-span-5">
                          <div className="space-y-1">
                            <h5 className="font-medium text-gray-900">
                              {item.name}
                            </h5>
                            {item.description && (
                              <p className="whitespace-pre-line text-xs text-gray-600">
                                {item.description}
                              </p>
                            )}
                            {item.notes && (
                              <div className="mt-1 text-xs text-blue-700">
                                <span className="font-medium">Notes:</span>{" "}
                                <span className="whitespace-pre-line">
                                  {item.notes}
                                </span>
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
                            {formatCurrency(item.unitPrice)}
                          </span>
                        </div>

                        {/* Total */}
                        <div className="col-span-3">
                          <span className="font-bold text-gray-900">
                            {formatCurrency(item.total)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cost Summary */}
      <div className="rounded-xl border-0 bg-white p-6 shadow-lg">
        <div className="-mx-6 -mt-6 mb-6 rounded-t-lg bg-gradient-to-r from-gray-50 to-gray-100 px-4 py-3">
          <h3 className="text-xl font-semibold text-gray-800">Cost Summary</h3>
        </div>

        <div className="grid grid-cols-1 gap-8 min-[760px]:grid-cols-2">
          {/* Left Column - Basic Costs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">
                Services Subtotal:
              </span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(subtotal)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">
                Labour Cost:
              </span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(labourCost)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">
                Materials Cost:
              </span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(materialsCost)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">
                Base Subtotal:
              </span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(baseSubtotal)}
              </span>
            </div>
          </div>

          {/* Right Column - Additional Costs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">
                Overheads ({formData.pricing.overheadPercentage}%):
              </span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(overheads)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">
                Profit ({formData.pricing.profitPercentage}%):
              </span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(profit)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">
                Contingency ({formData.pricing.contingencyPercentage}%):
              </span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(contingency)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">
                VAT ({formData.pricing.vatRate}%):
              </span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(vat)}
              </span>
            </div>
          </div>
        </div>

        {/* Total - Full Width, Separate from the grid */}
        <div className="flex items-center justify-between border-t-2 border-gray-200 pt-6">
          <span className="text-2xl font-bold text-gray-900">Total:</span>
          <span className="rounded-xl bg-blue-50 px-6 py-3 text-2xl font-bold text-blue-600 shadow-sm">
            {formatCurrency(total)}
          </span>
        </div>

        {/* Deposit Information - Full Width */}
        {formData.pricing.depositRequired && (
          <div className="mt-6 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-blue-100 p-5">
            <div className="flex items-center justify-between">
              <span className="text-lg font-semibold text-blue-900">
                Deposit Required:
              </span>
              <span className="rounded-lg border border-blue-200 bg-white px-5 py-2 text-xl font-bold text-blue-900 shadow-sm">
                {formatCurrency(
                  formData.pricing.depositAmount > 0
                    ? formData.pricing.depositAmount
                    : (total * formData.pricing.depositPercentage) / 100,
                )}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Terms & Conditions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Terms & Conditions
        </h3>

        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="mb-2 font-medium text-gray-900">Payment Terms</h4>
            <p>
              {formData.pricing.depositRequired
                ? `A deposit of ${formatCurrency(formData.pricing.depositAmount > 0 ? formData.pricing.depositAmount : (total * formData.pricing.depositPercentage) / 100)} is required to secure your booking. The remaining balance is due upon completion of the project.`
                : "Payment is due upon completion of the project."}
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">Project Timeline</h4>
            <p>
              We typically require 2 weeks notice to start a project. The
              estimated duration for this project is{" "}
              {formData.project.estimatedDuration}.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">Warranty</h4>
            <p>
              All our work comes with a comprehensive workmanship guarantee
              covering our work from 1 year to 10 years depending on the project
              type and materials used.
            </p>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">Special Notes</h4>
            <p>
              Please ensure all special requirements are clearly communicated.
              For example, if installing an exposed shower mixer, this should be
              mentioned clearly so that the customer does not think it&apos;s
              concealed.
            </p>
          </div>
        </div>
      </div>

      {/* Shareable Link */}
      {quoteId && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <h3 className="mb-4 text-lg font-medium text-gray-900">
            Shareable Link
          </h3>

          <div className="flex items-center space-x-3">
            <input
              type="text"
              value={`${window.location.origin}${shareableLink}`}
              readOnly
              className="flex-1 rounded-md border border-gray-300 bg-gray-50 px-3 py-2 text-sm"
            />
            <button
              onClick={copyToClipboard}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <Copy className="mr-2 h-4 w-4" />
              {copied ? "Copied!" : "Copy"}
            </button>
            <a
              href={shareableLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              View
            </a>
          </div>

          <p className="mt-2 text-sm text-gray-500">
            This link can be shared with your client to view the quote online.
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">Next Steps</h3>

        <div className="space-y-3">
          <p className="text-sm text-gray-600">
            Once you&apos;re satisfied with the quote, click &quot;Generate
            Quote&quot; to save it to the database and create a shareable link.
          </p>

          <div className="flex items-center space-x-3">
            <Download className="h-5 w-5 text-gray-400" />
            <span className="text-sm text-gray-600">
              PDF export functionality will be available after quote generation
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
