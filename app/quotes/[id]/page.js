"use client";

import { useState, useEffect } from "react";
import { Copy, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function PublicQuotePage({ params }) {
  const { id: quoteId } = params;
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Load quote from database API
    const fetchQuote = async () => {
      try {
        const response = await fetch(`/api/quotes/${quoteId}`);

        if (response.ok) {
          const result = await response.json();
          if (result.success) {
            setQuote(result.quote);
            setIsLoading(false);
            return;
          }
        }

        // If API call fails, fall back to mock data for demo purposes
        if (
          quoteId === "temp-id" ||
          quoteId.match(/^\d{8}$/) ||
          quoteId === "20240001" ||
          quoteId === "20240002" ||
          quoteId === "20240003"
        ) {
          setQuote({
            id: quoteId,
            quoteNumber: quoteId,
            title: "Sample Quote",
            projectType: "Bathroom Renovation",
            client: {
              name: "John Doe",
              email: "john@example.com",
              phone: "07700 900000",
              address: "123 Sample Street",
              postcode: "SW1A 1AA",
            },
            projectAddress: "123 Sample Street, London",
            projectDescription:
              "Complete bathroom renovation including new fixtures, tiling, and plumbing",
            startDate: "2024-03-01",
            estimatedDuration: "2-3 weeks",
            services: [
              {
                categoryName: "Demolition & Preparation",
                categoryTotal: 1200,
                items: [
                  {
                    name: "Remove existing bathroom",
                    description: "Strip out old fixtures, tiles, and fittings",
                    quantity: 1,
                    unit: "job",
                    unitPrice: 800,
                    total: 800,
                    notes: "Includes skip hire and disposal",
                  },
                  {
                    name: "Wall preparation",
                    description: "Remove old plaster, prepare surfaces",
                    quantity: 15,
                    unit: "sqm",
                    unitPrice: 25,
                    total: 375,
                    notes: "Ready for new plastering",
                  },
                ],
              },
              {
                categoryName: "Plumbing & Electrical",
                categoryTotal: 2800,
                items: [
                  {
                    name: "New plumbing system",
                    description: "Install new pipes, valves, and connections",
                    quantity: 1,
                    unit: "job",
                    unitPrice: 1200,
                    total: 1200,
                    notes: "Includes all necessary fittings",
                  },
                  {
                    name: "Electrical work",
                    description: "New lighting, switches, and power points",
                    quantity: 1,
                    unit: "job",
                    unitPrice: 800,
                    total: 800,
                    notes: "Part P certified installation",
                  },
                  {
                    name: "Shower installation",
                    description: "Exposed shower mixer and head",
                    quantity: 1,
                    unit: "set",
                    unitPrice: 800,
                    total: 800,
                    notes: "Exposed shower mixer - not concealed",
                  },
                ],
              },
              {
                categoryName: "Finishing",
                categoryTotal: 3200,
                items: [
                  {
                    name: "Wall tiling",
                    description: "Ceramic tiles to walls",
                    quantity: 25,
                    unit: "sqm",
                    unitPrice: 80,
                    total: 2000,
                    notes: "Includes adhesive and grout",
                  },
                  {
                    name: "Floor tiling",
                    description: "Porcelain floor tiles",
                    quantity: 8,
                    unit: "sqm",
                    unitPrice: 100,
                    total: 800,
                    notes: "Non-slip finish",
                  },
                  {
                    name: "Painting",
                    description: "Paint walls and ceiling",
                    quantity: 25,
                    unit: "sqm",
                    unitPrice: 16,
                    total: 400,
                    notes: "Mould-resistant paint",
                  },
                ],
              },
            ],
            costBreakdown: {
              subtotal: 7200,
              labourCost: 4320,
              materialsCost: 2880,
              overheads: 720,
              profit: 1080,
              contingency: 360,
              vat: 1890,
              total: 10290,
            },
            calculationSettings: {
              depositRequired: true,
              depositAmount: 1000,
              vatRate: 20,
            },
            termsAndConditions:
              "Standard BH Studio terms and conditions apply. All work is guaranteed and insured. Payment terms: deposit required, balance on completion.",
            warrantyInformation:
              "All our work comes with a comprehensive workmanship guarantee covering our work from 1 year to 10 years depending on the project type and materials used.",
            leadTime: "We typically require 2 weeks notice to start a project.",
            validUntil: "2024-02-14T10:30:00Z",
          });
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching quote:", error);
        setIsLoading(false);
      }
    };

    fetchQuote();
  }, [quoteId]);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading quote...</p>
        </div>
      </div>
    );
  }

  if (!quote) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-900">
            Quote Not Found
          </h1>
          <p className="mb-6 text-gray-600">
            The quote you&apos;re looking for doesn&apos;t exist or has been
            removed.
          </p>
          <Link
            href="/"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">BH Studio</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
                <Download className="mr-2 h-4 w-4" />
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="space-y-6">
          {/* Company Header */}
          <div className="rounded-xl border-2 border-gray-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-8 text-center shadow-sm">
            <div className="mb-4">
              <h1 className="mb-2 text-5xl font-bold text-gray-900">
                Better Homes
              </h1>
              <div className="mx-auto h-1 w-24 rounded-full bg-gradient-to-r from-blue-500 to-indigo-500"></div>
            </div>
            <p className="mb-4 text-xl font-medium text-gray-700">
              Professional Home Renovation Services
            </p>
            <div className="flex items-center justify-center space-x-6 text-sm text-gray-600">
              <span>London, UK</span>
              <span>VAT Registered</span>
              <span>Fully Insured</span>
              <span>5 Star Rated</span>
            </div>
          </div>

          {/* Quote Details */}
          <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              <div className="space-y-4">
                <h3 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
                  Client Information
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-gray-500">
                      Name:
                    </span>
                    <span className="text-gray-900">
                      {quote.client?.name || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-gray-500">
                      Email:
                    </span>
                    <span className="text-gray-900">
                      {quote.client?.email || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-gray-500">
                      Phone:
                    </span>
                    <span className="text-gray-900">
                      {quote.client?.phone || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-gray-500">
                      Address:
                    </span>
                    <span className="text-gray-900">
                      {quote.client?.address || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-gray-500">
                      Postcode:
                    </span>
                    <span className="text-gray-900">
                      {quote.client?.postcode || "N/A"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="border-b border-gray-200 pb-2 text-xl font-semibold text-gray-900">
                  Project Details
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-gray-500">
                      Project:
                    </span>
                    <span className="text-gray-900">
                      {quote.title || "Untitled Project"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-gray-500">
                      Type:
                    </span>
                    <span className="text-gray-900">
                      {quote.projectType
                        ?.replace(/-/g, " ")
                        .replace(/\b\w/g, (l) => l.toUpperCase()) || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-gray-500">
                      Address:
                    </span>
                    <span className="text-gray-900">
                      {quote.projectAddress || "N/A"}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="w-20 font-medium text-gray-500">
                      Duration:
                    </span>
                    <span className="text-gray-900">
                      {quote.estimatedDuration || "N/A"}
                    </span>
                  </div>
                  {quote.startDate && (
                    <div className="flex items-center space-x-3">
                      <span className="w-20 font-medium text-gray-500">
                        Start Date:
                      </span>
                      <span className="text-gray-900">
                        {new Date(quote.startDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {quote.projectDescription && (
              <div className="mt-8 border-t border-gray-200 pt-6">
                <h3 className="mb-3 text-xl font-semibold text-gray-900">
                  Project Description
                </h3>
                <p className="leading-relaxed text-gray-700">
                  {quote.projectDescription}
                </p>
              </div>
            )}
          </div>

          {/* Services Breakdown */}
          {quote.services && quote.services.length > 0 && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Services & Costs
                </h3>
                <p className="mt-1 text-gray-600">
                  Detailed breakdown of all services and associated costs
                </p>
              </div>
              <div className="p-8">
                {quote.services.map((category, categoryIndex) => (
                  <div key={categoryIndex} className="mb-8 last:mb-0">
                    {/* Category Header */}
                    <div className="mb-4 flex items-center justify-between rounded-lg bg-blue-50 px-4 py-3">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {category.categoryName}
                      </h4>
                      <span className="rounded-lg bg-white px-4 py-2 text-xl font-bold text-blue-600 shadow-sm">
                        {formatCurrency(category.categoryTotal)}
                      </span>
                    </div>

                    {/* Services Table */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                      {/* Table Header */}
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
                                    <p className="text-xs text-gray-600">
                                      {item.description}
                                    </p>
                                  )}
                                  {item.notes && (
                                    <div className="mt-1 text-xs text-blue-700">
                                      <span className="font-medium">
                                        Notes:
                                      </span>{" "}
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
          )}

          {/* Cost Summary */}
          {quote.costBreakdown && (
            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
              <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-100 px-8 py-6">
                <h3 className="text-2xl font-semibold text-gray-900">
                  Cost Summary
                </h3>
                <p className="mt-1 text-gray-600">
                  Complete breakdown of all costs and final total
                </p>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                  {/* Left Column - Basic Costs */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                      <span className="font-medium text-gray-600">
                        Services Subtotal:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(quote.costBreakdown.subtotal)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                      <span className="font-medium text-gray-600">
                        Labour Cost:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(quote.costBreakdown.labourCost)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                      <span className="font-medium text-gray-600">
                        Materials Cost:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(quote.costBreakdown.materialsCost)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                      <span className="font-medium text-gray-600">
                        Base Subtotal:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(quote.costBreakdown.subtotal)}
                      </span>
                    </div>
                  </div>

                  {/* Right Column - Additional Costs */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                      <span className="font-medium text-gray-600">
                        Overheads:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(quote.costBreakdown.overheads)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                      <span className="font-medium text-gray-600">Profit:</span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(quote.costBreakdown.profit)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                      <span className="font-medium text-gray-600">
                        Contingency:
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(quote.costBreakdown.contingency)}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b border-gray-100 py-2">
                      <span className="font-medium text-gray-600">
                        VAT ({quote.calculationSettings?.vatRate || 20}%):
                      </span>
                      <span className="font-semibold text-gray-900">
                        {formatCurrency(quote.costBreakdown.vat)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Total - Full Width */}
                <div className="mt-6 flex items-center justify-between rounded-lg border-t-2 border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                  <span className="text-xl font-bold text-gray-900">
                    Total:
                  </span>
                  <span className="text-2xl font-bold text-blue-600">
                    {formatCurrency(quote.costBreakdown.total)}
                  </span>
                </div>

                {/* Deposit Information */}
                {quote.calculationSettings?.depositRequired && (
                  <div className="mt-4 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">💰</span>
                        <span className="font-semibold text-amber-900">
                          Deposit Required:
                        </span>
                      </div>
                      <span className="text-xl font-bold text-amber-900">
                        {formatCurrency(
                          quote.calculationSettings.depositAmount,
                        )}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-amber-700">
                      This deposit secures your project slot and covers initial
                      materials
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Terms & Conditions */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gradient-to-r from-purple-50 to-pink-50 px-8 py-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Terms & Conditions
              </h3>
              <p className="mt-1 text-gray-600">
                Important information about your project
              </p>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
                <div className="space-y-4">
                  <h4 className="flex items-center text-lg font-semibold text-gray-900">
                    <span className="mr-2">💳</span>
                    Payment Terms
                  </h4>
                  <p className="leading-relaxed text-gray-700">
                    {quote.termsAndConditions ||
                      "Standard BH Studio terms and conditions apply. All work is guaranteed and insured. Payment terms: deposit required, balance on completion."}
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center text-lg font-semibold text-gray-900">
                    <span className="mr-2">📅</span>
                    Project Timeline
                  </h4>
                  <p className="leading-relaxed text-gray-700">
                    {quote.leadTime ||
                      "We typically require 2 weeks notice to start a project."}{" "}
                    The estimated duration for this project is{" "}
                    {quote.estimatedDuration}.
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="flex items-center text-lg font-semibold text-gray-900">
                    <span className="mr-2">🛡️</span>
                    Warranty
                  </h4>
                  <p className="leading-relaxed text-gray-700">
                    {quote.warrantyInformation ||
                      "All our work comes with a comprehensive workmanship guarantee covering our work from 1 year to 10 years depending on the project type and materials used."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="rounded-xl border border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 p-8 text-center shadow-sm">
            <p className="font-medium text-gray-600">
              This quote is valid until{" "}
              {quote.validUntil
                ? new Date(quote.validUntil).toLocaleDateString()
                : "30 days from issue"}
            </p>
            <div className="mt-4 flex items-center justify-center space-x-6 text-sm text-gray-500">
              <span>Better Homes</span>
              <span>•</span>
              <span>Professional Home Renovation Services</span>
              <span>•</span>
              <span>London, UK</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
