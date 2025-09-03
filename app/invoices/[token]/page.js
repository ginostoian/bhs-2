"use client";

import { useState, useEffect } from "react";
import {
  Download,
  Copy,
  Building,
  Calendar,
  Clock,
  AlertTriangle,
} from "lucide-react";
import toast from "react-hot-toast";

// Dynamic PDF generator loading (similar to quotes)
const loadPDFGenerator = async () => {
  const { generatePDFFromCurrentPage, generateVectorPDF } = await import(
    "@/libs/htmlQuotePdfGenerator"
  );

  return {
    generatePDFFromCurrentPage,
    generateVectorPDF,
  };
};

export default function PublicInvoicePage({ params }) {
  const { token } = params;
  const [invoice, setInvoice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [downloadingPDF, setDownloadingPDF] = useState(false);

  useEffect(() => {
    // Load invoice from database API
    const fetchInvoice = async () => {
      try {
        const response = await fetch(`/api/invoices/${token}`);

        if (response.ok) {
          const data = await response.json();
          setInvoice(data.invoice);
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching invoice:", error);
        setIsLoading(false);
      }
    };

    fetchInvoice();
  }, [token]);

  useEffect(() => {
    if (invoice) {
      setIsLoading(false);
    }
  }, [invoice]);

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
    if (!invoice || downloadingPDF) return;

    setDownloadingPDF(true);
    try {
      // Load PDF generator dynamically
      const { generatePDFFromCurrentPage } = await loadPDFGenerator();

      // Use the page capture approach with enhanced settings
      await generatePDFFromCurrentPage(
        "invoice-content",
        `invoice-${invoice.invoiceNumber || token}.pdf`,
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

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getStatusBadge = (status, isOverdue) => {
    let colorClass = "";
    let icon = null;

    if (isOverdue) {
      colorClass = "bg-red-100 text-red-800 border-red-200";
      icon = <AlertTriangle className="mr-1 h-4 w-4" />;
    } else {
      switch (status) {
        case "sent":
          colorClass = "bg-blue-100 text-blue-800 border-blue-200";
          icon = <Clock className="mr-1 h-4 w-4" />;
          break;
        case "paid":
          colorClass = "bg-green-100 text-green-800 border-green-200";
          icon = <Building className="mr-1 h-4 w-4" />;
          break;
        default:
          colorClass = "bg-gray-100 text-gray-800 border-gray-200";
      }
    }

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${colorClass}`}
      >
        {icon}
        {isOverdue
          ? "Overdue"
          : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!invoice) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-gray-400">
            <Building className="h-12 w-12" />
          </div>
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900">
            Invoice Not Found
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            The invoice you&apos;re looking for doesn&apos;t exist or is no
            longer available.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-10 min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Invoice {invoice.invoiceNumber}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                Issued on {formatDate(invoice.issueDate)}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(invoice.status, invoice.isOverdue)}
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
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" />
                {downloadingPDF ? "Generating..." : "Download PDF"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content */}
      <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
        <div id="invoice-content" className="rounded-lg bg-white shadow-lg">
          {/* Invoice Header */}
          <div className="border-b border-gray-200 px-8 py-6">
            <div className="flex justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">INVOICE</h2>
                <p className="mt-2 text-lg text-gray-600">
                  #{invoice.invoiceNumber}
                </p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">
                  Better Homes
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <p>Professional Construction Services</p>
                  <p>London, United Kingdom</p>
                </div>
              </div>
            </div>
          </div>

          {/* Invoice Details */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
              {/* Bill To */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Bill To:
                </h3>
                <div className="text-gray-700">
                  <p className="font-medium">{invoice.client.name}</p>
                  <p>{invoice.client.email}</p>
                  <p>{invoice.client.phone}</p>
                  <div className="mt-2 whitespace-pre-line">
                    {invoice.client.address}
                  </div>
                </div>
              </div>

              {/* Invoice Info */}
              <div>
                <h3 className="mb-3 text-lg font-semibold text-gray-900">
                  Invoice Details:
                </h3>
                <div className="space-y-2 text-gray-700">
                  <div className="flex justify-between">
                    <span>Invoice Date:</span>
                    <span>{formatDate(invoice.issueDate)}</span>
                  </div>
                  {invoice.dueDate && (
                    <div className="flex justify-between">
                      <span>Due Date:</span>
                      <span
                        className={
                          invoice.isOverdue ? "font-medium text-red-600" : ""
                        }
                      >
                        {formatDate(invoice.dueDate)}
                        {invoice.isOverdue && " (Overdue)"}
                      </span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span
                      className={`font-medium ${
                        invoice.status === "paid"
                          ? "text-green-600"
                          : invoice.isOverdue
                            ? "text-red-600"
                            : "text-blue-600"
                      }`}
                    >
                      {invoice.isOverdue
                        ? "Overdue"
                        : invoice.status.charAt(0).toUpperCase() +
                          invoice.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Project Title */}
            {invoice.title && (
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-gray-900">
                  {invoice.title}
                </h3>
              </div>
            )}
          </div>

          {/* Line Items */}
          <div className="px-8 py-6">
            <h3 className="mb-4 text-lg font-semibold text-gray-900">
              Services:
            </h3>
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
                    <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500">
                      Total (inc. VAT)
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                  {invoice.lineItems.map((item, index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                    >
                      <td className="px-6 py-4 text-sm font-medium text-gray-900">
                        {item.serviceName}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {formatCurrency(item.priceExclVat)}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.vatRate}%
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
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
                      <td className="px-6 py-4 text-sm text-gray-500">
                        {item.quantity}
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium text-gray-900">
                        {formatCurrency(item.totalVatIncluded)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="border-t border-gray-200 px-8 py-6">
            <div className="flex justify-end">
              <div className="w-full max-w-xs space-y-3">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Subtotal (excl. VAT):</span>
                  <span>{formatCurrency(invoice.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Total VAT:</span>
                  <span>{formatCurrency(invoice.totalVat)}</span>
                </div>
                <div className="flex justify-between border-t border-gray-200 pt-3 text-lg font-bold text-gray-900">
                  <span>Total Amount:</span>
                  <span>{formatCurrency(invoice.total)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="border-t border-gray-200 px-8 py-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Notes:
              </h3>
              <p className="whitespace-pre-wrap text-gray-700">
                {invoice.notes}
              </p>
            </div>
          )}

          {/* Terms */}
          {invoice.terms && (
            <div className="border-t border-gray-200 bg-gray-50 px-8 py-6">
              <h3 className="mb-3 text-lg font-semibold text-gray-900">
                Terms and Conditions:
              </h3>
              <p className="whitespace-pre-wrap text-sm text-gray-600">
                {invoice.terms}
              </p>
            </div>
          )}

          {/* Due Date Warning */}
          {invoice.isOverdue && (
            <div className="border-t border-red-200 bg-red-50 px-8 py-4">
              <div className="flex items-center">
                <AlertTriangle className="mr-2 h-5 w-5 text-red-400" />
                <p className="text-sm text-red-700">
                  <strong>This invoice is overdue.</strong> Payment was due on{" "}
                  {formatDate(invoice.dueDate)}. Please contact us to arrange
                  payment.
                </p>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t border-gray-200 px-8 py-6 text-center text-sm text-gray-500">
            <p>Thank you for your business!</p>
            <p className="mt-1">
              Better Homes - Professional Construction Services
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
