"use client";

import { useState } from "react";
import { Copy, ExternalLink, Download } from "lucide-react";
import toast from "react-hot-toast";
import {
  generatePrintOptimizedPDF,
  generateVectorPDF,
} from "@/libs/htmlQuotePdfGenerator";

export default function QuotePreview({ formData, quoteId }) {
  const [copied, setCopied] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  // Calculate simple total from services
  const subtotal = formData.services.reduce(
    (sum, category) => sum + (category.categoryTotal || 0),
    0,
  );

  // Simple VAT calculation
  const vat = subtotal * ((formData.pricing.vatRate || 20) / 100);
  const total = subtotal + vat;

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

  const handleDownloadPDF = async () => {
    if (downloadingPDF) return;

    setDownloadingPDF(true);
    try {
      // Create a quote object from formData
      const quote = {
        id: quoteId || "temp-id",
        quoteNumber: quoteId || "temp-id",
        title: formData.projectName,
        projectType: formData.projectType,
        client: formData.client,
        projectAddress: formData.projectAddress,
        projectDescription: formData.projectDescription,
        startDate: formData.startDate,
        estimatedDuration: formData.estimatedDuration,
        services: formData.services,
        total: total,
        validUntil: formData.validUntil,
        termsAndConditions: formData.termsAndConditions,
        warrantyInformation: formData.warrantyInformation,
      };

      await generatePrintOptimizedPDF(quote, `quote-${quoteId || "temp"}.pdf`);
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingPDF(false);
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
                <div className="text-sm text-blue-500">
                  Customer:{" "}
                  {formatCurrency(
                    category.items?.reduce(
                      (total, item) =>
                        total + (item.customerTotal || item.total || 0),
                      0,
                    ) || 0,
                  )}
                </div>
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
                          <div className="text-xs text-gray-500">
                            Customer:{" "}
                            {formatCurrency(
                              item.customerUnitPrice || item.unitPrice,
                            )}
                          </div>
                        </div>

                        {/* Total */}
                        <div className="col-span-3">
                          <span className="font-bold text-gray-900">
                            {formatCurrency(item.total)}
                          </span>
                          <div className="text-xs text-gray-500">
                            Customer:{" "}
                            {formatCurrency(item.customerTotal || item.total)}
                          </div>
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
              <div className="text-xs text-gray-500">
                Customer:{" "}
                {formatCurrency(
                  formData.services?.reduce(
                    (total, category) =>
                      total +
                      (category.items?.reduce(
                        (catTotal, item) =>
                          catTotal + (item.customerTotal || item.total || 0),
                        0,
                      ) || 0),
                    0,
                  ) || 0,
                )}
              </div>
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

          {/* Right Column - Additional Costs */}
          <div className="space-y-2">
            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">Total:</span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(total)}
              </span>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 py-3">
              <span className="text-sm font-medium text-gray-600">
                Customer Total:
              </span>
              <span className="rounded bg-gray-50 px-3 py-1 text-sm font-semibold text-gray-900">
                {formatCurrency(
                  (formData.services?.reduce(
                    (total, category) =>
                      total +
                      (category.items?.reduce(
                        (catTotal, item) =>
                          catTotal + (item.customerTotal || item.total || 0),
                        0,
                      ) || 0),
                    0,
                  ) || 0) *
                    (1 + (formData.pricing.vatRate || 20) / 100),
                )}
              </span>
            </div>
          </div>
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
                ? `A deposit of ${formatCurrency(formData.pricing.depositAmount > 0 ? formData.pricing.depositAmount : (total * formData.pricing.depositPercentage) / 100)} is required to secure your booking. The remaining balance is due in weekly payments until completion of the project.`
                : "Payment is due in weekly payments until completion of the project."}
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

      {/* Comprehensive Terms & Conditions */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h3 className="mb-4 text-lg font-medium text-gray-900">
          Comprehensive Terms & Conditions
        </h3>

        <div className="space-y-4 text-sm text-gray-600">
          <div>
            <h4 className="mb-2 font-medium text-gray-900">General Terms</h4>
            <div className="space-y-2">
              <p>
                Any new services Building control might require are not included
                and will be subject to a new quote.
              </p>
              <p>
                Any extra services not mentioned in this quote will be subject
                to a new quote. Please read the quote carefully to see what is
                included.
              </p>
              <p>
                Any unexpected work or additional tasks as well as any damage to
                materials/items will be the responsibility of the client. We do
                not open packages upon delivery. We will open packages only
                during installation. We do not take any responsibility for any
                damaged items.
              </p>
              <p>
                This quote is for labour and building materials only. All items
                on the Client to Supply list are to be purchased by the client.
                In the situation that we take care of ordering materials on your
                behalf, the price of the materials will be invoiced before we
                purchase them.
              </p>
              <p>Parking permits if needed, to be supplied by the client.</p>
              <p>
                We also offer a design and supply service. If you are interested
                please ask us more about it and we will walk through what that
                entails.
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">
              Bathroom Installation Standards
            </h4>
            <p className="mb-2">
              The quote includes standard installation of (unless otherwise
              specified):
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Standard pattern tiling with standard ceramic tiles. The quote
                does not cover for complete mosaic tiling, complete herringbone
                style pattern or border patterns, cement tiles on walls and/or
                floor or any other tiles which require special installation or
                sealing as these are more time consuming and would influence the
                cost. If this is something you would like, please let us know.
              </li>
              <li>Same layout for plumbing</li>
              <li>Shower tray (not wetroom kit)</li>
              <li>Floor standing toilet</li>
              <li>4 spotlights installation as standard</li>
              <li>Taps on sink</li>
              <li>Visible shower pipes</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">
              Kitchen Fitting Standards
            </h4>
            <p className="mb-2">
              The quote includes standard installation of (unless otherwise
              specified):
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Hob/oven installation: install new hob/oven in same location and
                like for like as existing
              </li>
              <li>
                Sink installation: install new sink in same location overmounted
                on worktop
              </li>
              <li>
                Worktop installation: install 2 runs of worktop - laminate or
                wooden worktop (not composite, not stone)
              </li>
              <li>Taps on sink</li>
              <li>Tile splashback with standard tiles up to wall units</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">
              Miscellaneous Standards
            </h4>
            <ul className="ml-6 list-disc space-y-1">
              <li>
                Floor levelling or repairs to subfloor if required to be
                assessed and calculated accordingly
              </li>
              <li>
                Painting refers to minor repairs and standard paint unless
                otherwise specified
              </li>
              <li>
                Installation of wooden doors - same size as existing, original
                frames unless quoted differently
              </li>
              <li>
                Installation of radiators - same position and approximately the
                same size unless quoted differently
              </li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">
              Project Scheduling & Deposits
            </h4>
            <div className="space-y-2">
              <p>
                Start date is subject to availability. We will work with you to
                find a suitable start date but usually we need 10 days from the
                agreement to be able to start.
              </p>
              <p>
                To book the start date agreed upon we require a small deposit.
                Depending on the size of the project this ranges between £300 -
                £1,000.
              </p>
              <p>
                All start dates are flexible (1 - 3 days) for both ends (the
                company or the client). This is so that if something unexpected
                happens and you need to postpone the start date for a couple of
                days you wouldn&apos;t lose your deposit.
              </p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">
              Quality Assurance
            </h4>
            <p className="mb-2">
              The above quote guarantees quality property care:
            </p>
            <ul className="ml-6 list-disc space-y-1">
              <li>Isolating floors and furniture</li>
              <li>Clean and tidy job site</li>
              <li>Cleaning at the end of the project</li>
              <li>Project completed to a very high standard</li>
            </ul>
          </div>

          <div>
            <h4 className="mb-2 font-medium text-gray-900">
              Radiator Work Disclaimer
            </h4>
            <p>
              Upon radiators removal and reinstallation (in order to paint
              behind them) we will bleed the radiators. We do not take any
              responsibility for any fault your boiler might show as removal and
              reinstallation of radiators should not break a boiler system. In
              the rare cases when boilers do show errors, remedial works are not
              included in the price shown above.
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
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Download className="mr-2 h-4 w-4" />
              {downloadingPDF ? "Generating..." : "Download PDF"}
            </button>
            <span className="text-sm text-gray-600">
              Download a PDF version of this quote
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
