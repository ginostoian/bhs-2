"use client";

import { useState, useEffect } from "react";
import { Copy, Download, ArrowLeft } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
// Dynamic import to avoid build-time serialization issues
const loadPDFGenerator = async () => {
  const { generatePrintOptimizedPDF, generatePDFFromCurrentPage, generateVectorPDF } = await import("@/libs/htmlQuotePdfGenerator");
  return { generatePrintOptimizedPDF, generatePDFFromCurrentPage, generateVectorPDF };
};

export default function PublicQuotePage({ params }) {
  const { id: quoteId } = params;
  const [quote, setQuote] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

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
            projectType: "bathroom-renovation",
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
            pricing: {
              depositRequired: true,
              depositAmount: 1000,
              vatRate: 20,
            },
            termsAndConditions:
              "Standard BH Studio terms and conditions apply. All work is guaranteed and insured. Payment terms: deposit required, then weekly payments until completion.",
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

  const handleDownloadPDF = async () => {
    if (!quote || downloadingPDF) return;

    setDownloadingPDF(true);
    try {
      // Load PDF generator dynamically
      const { generatePDFFromCurrentPage } = await loadPDFGenerator();
      
      // Use the page capture approach with enhanced settings
      await generatePDFFromCurrentPage(
        "quote-content",
        `quote-${quote.quoteNumber || quote.id}.pdf`,
      );
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
    <div className="mt-10 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Better Homes</h1>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={copyToClipboard}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Copy className="mr-2 h-4 w-4" />
                {copied ? "Copied!" : "Copy Link"}
              </button>
              <button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" />
                {downloadingPDF ? "Generating..." : "Export PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Quote Content */}
      <div
        id="quote-content"
        className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8"
        style={{
          pageBreakInside: "avoid",
          breakInside: "avoid",
        }}
      >
        <div className="space-y-6">
          {/* Company Header */}
          <div className="no-break rounded-xl border-0 bg-gradient-to-r from-blue-600 to-blue-800 p-8 text-white shadow-lg">
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
          <div className="no-break rounded-xl border border-gray-200 bg-white p-8 shadow-sm">
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
                        {formatCurrency(
                          category.items?.reduce(
                            (total, item) =>
                              total + (item.customerTotal || item.total || 0),
                            0,
                          ) || 0,
                        )}
                      </span>
                    </div>

                    {/* Services Table */}
                    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
                      {/* Table Container with Horizontal Scroll on Mobile */}
                      <div className="overflow-x-auto">
                        <div className="min-w-[600px]">
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
                                        <p className="whitespace-pre-line text-xs text-gray-600">
                                          {item.description}
                                        </p>
                                      )}
                                      {item.notes && (
                                        <div className="mt-1 text-xs text-blue-700">
                                          <span className="font-medium">
                                            Notes:
                                          </span>{" "}
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
                                      {formatCurrency(
                                        item.customerUnitPrice ||
                                          item.unitPrice,
                                      )}
                                    </span>
                                  </div>

                                  {/* Total */}
                                  <div className="col-span-3">
                                    <span className="font-bold text-gray-900">
                                      {formatCurrency(
                                        item.customerTotal || item.total,
                                      )}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cost Summary */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-100 px-8 py-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Cost Summary
              </h3>
              <p className="mt-1 text-gray-600">
                Simple breakdown of services and VAT
              </p>
            </div>
            <div className="p-6">
              {/* Single Column - Customer-Facing Costs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600">
                    Services Subtotal:
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(
                      quote.services?.reduce(
                        (total, category) =>
                          total +
                          (category.items?.reduce(
                            (catTotal, item) =>
                              catTotal +
                              (item.customerTotal || item.total || 0),
                            0,
                          ) || 0),
                        0,
                      ) || 0,
                    )}
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-gray-100 py-2">
                  <span className="font-medium text-gray-600">
                    VAT ({quote.pricing?.vatRate || 20}%):
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(
                      (quote.services?.reduce(
                        (total, category) =>
                          total +
                          (category.items?.reduce(
                            (catTotal, item) =>
                              catTotal +
                              (item.customerTotal || item.total || 0),
                            0,
                          ) || 0),
                        0,
                      ) || 0) *
                        ((quote.pricing?.vatRate || 20) / 100),
                    )}
                  </span>
                </div>
              </div>

              {/* Total - Full Width (Services + VAT only) */}
              <div className="mt-6 flex items-center justify-between rounded-lg border-t-2 border-gray-300 bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4">
                <span className="text-xl font-bold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-blue-600">
                  {formatCurrency(
                    (quote.services?.reduce(
                      (total, category) =>
                        total +
                        (category.items?.reduce(
                          (catTotal, item) =>
                            catTotal + (item.customerTotal || item.total || 0),
                          0,
                        ) || 0),
                      0,
                    ) || 0) *
                      (1 + (quote.pricing?.vatRate || 20) / 100),
                  )}
                </span>
              </div>

              {/* Deposit Information */}
              {quote.pricing?.depositRequired && (
                <div className="mt-4 rounded-lg border border-amber-200 bg-gradient-to-r from-amber-50 to-yellow-50 p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">💰</span>
                      <span className="font-semibold text-amber-900">
                        Deposit Required:
                      </span>
                    </div>
                    <span className="text-xl font-bold text-amber-900">
                      {formatCurrency(quote.pricing.depositAmount || 0)}
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
                      "Standard BH Studio terms and conditions apply. All work is guaranteed and insured. Payment terms: deposit required, then weekly payments until completion."}
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

          {/* Comprehensive Terms & Conditions */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-6">
              <h3 className="text-2xl font-semibold text-gray-900">
                Comprehensive Terms & Conditions
              </h3>
              <p className="mt-1 text-gray-600">
                Detailed terms and project standards
              </p>
            </div>
            <div className="p-8">
              <div className="space-y-6 text-sm text-gray-700">
                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    General Terms
                  </h4>
                  <div className="space-y-2">
                    <p>
                      Any new services Building control might require are not
                      included and will be subject to a new quote.
                    </p>
                    <p>
                      Any extra services not mentioned in this quote will be
                      subject to a new quote. Please read the quote carefully to
                      see what is included.
                    </p>
                    <p>
                      Any unexpected work or additional tasks as well as any
                      damage to materials/items will be the responsibility of
                      the client. We do not open packages upon delivery. We will
                      open packages only during installation. We do not take any
                      responsibility for any damaged items.
                    </p>
                    <p>
                      This quote is for labour and building materials only. All
                      items on the Client to Supply list are to be purchased by
                      the client. In the situation that we take care of ordering
                      materials on your behalf, the price of the materials will
                      be invoiced before we purchase them.
                    </p>
                    <p>
                      Parking permits if needed, to be supplied by the client.
                    </p>
                    <p>
                      We also offer a design and supply service. If you are
                      interested please ask us more about it and we will walk
                      through what that entails.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    Bathroom Installation Standards
                  </h4>
                  <p className="mb-2">
                    The quote includes standard installation of (unless
                    otherwise specified):
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      Standard pattern tiling with standard ceramic tiles. The
                      quote does not cover for complete mosaic tiling, complete
                      herringbone style pattern or border patterns, cement tiles
                      on walls and/or floor or any other tiles which require
                      special installation or sealing as these are more time
                      consuming and would influence the cost. If this is
                      something you would like, please let us know.
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
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    Kitchen Fitting Standards
                  </h4>
                  <p className="mb-2">
                    The quote includes standard installation of (unless
                    otherwise specified):
                  </p>
                  <ul className="ml-6 list-disc space-y-1">
                    <li>
                      Hob/oven installation: install new hob/oven in same
                      location and like for like as existing
                    </li>
                    <li>
                      Sink installation: install new sink in same location
                      overmounted on worktop
                    </li>
                    <li>
                      Worktop installation: install 2 runs of worktop - laminate
                      or wooden worktop (not composite, not stone)
                    </li>
                    <li>Taps on sink</li>
                    <li>
                      Tile splashback with standard tiles up to wall units
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
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
                      Installation of wooden doors - same size as existing,
                      original frames unless quoted differently
                    </li>
                    <li>
                      Installation of radiators - same position and
                      approximately the same size unless quoted differently
                    </li>
                  </ul>
                </div>

                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    Project Scheduling & Deposits
                  </h4>
                  <div className="space-y-2">
                    <p>
                      Start date is subject to availability. We will work with
                      you to find a suitable start date but usually we need 10
                      days from the agreement to be able to start.
                    </p>
                    <p>
                      To book the start date agreed upon we require a small
                      deposit. Depending on the size of the project this ranges
                      between £300 - £1,000.
                    </p>
                    <p>
                      All start dates are flexible (1 - 3 days) for both ends
                      (the company or the client). This is so that if something
                      unexpected happens and you need to postpone the start date
                      for a couple of days you wouldn&apos;t lose your deposit.
                    </p>
                  </div>
                </div>

                <div>
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
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
                  <h4 className="mb-3 text-lg font-semibold text-gray-900">
                    Radiator Work Disclaimer
                  </h4>
                  <p>
                    Upon radiators removal and reinstallation (in order to paint
                    behind them) we will bleed the radiators. We do not take any
                    responsibility for any fault your boiler might show as
                    removal and reinstallation of radiators should not break a
                    boiler system. In the rare cases when boilers do show
                    errors, remedial works are not included in the price shown
                    above.
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
