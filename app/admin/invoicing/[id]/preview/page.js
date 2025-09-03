"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  Edit,
  Download,
  Copy,
  ExternalLink,
  Send,
  CheckCircle,
  Clock,
  AlertTriangle,
  Link as LinkIcon,
  Search,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/libs/api";

const loadPDFGenerator = async () => {
  const { generatePDFFromCurrentPage, generateVectorPDF } = await import(
    "@/libs/htmlQuotePdfGenerator"
  );
  return {
    generatePDFFromCurrentPage,
    generateVectorPDF,
  };
};

export default function InvoicePreviewPage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [copied, setCopied] = useState(false);

  // Linking modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isLinking, setIsLinking] = useState(false);

  const fetchInvoice = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/admin/invoicing/${invoiceId}`);
      setInvoice(response.invoice);
    } catch (error) {
      console.error("Error fetching invoice:", error);
      toast.error("Failed to load invoice");
      router.push("/admin/invoicing");
    } finally {
      setLoading(false);
    }
  }, [invoiceId, router]);

  useEffect(() => {
    fetchInvoice();
  }, [fetchInvoice]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount || 0);
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
      icon = <AlertTriangle className="mr-1.5 h-3 w-3" />;
    } else {
      switch (status) {
        case "draft":
          colorClass = "bg-gray-100 text-gray-800 border-gray-200";
          icon = <Clock className="mr-1.5 h-3 w-3" />;
          break;
        case "sent":
          colorClass = "bg-blue-100 text-blue-800 border-blue-200";
          icon = <Send className="mr-1.5 h-3 w-3" />;
          break;
        case "paid":
          colorClass = "bg-green-100 text-green-800 border-green-200";
          icon = <CheckCircle className="mr-1.5 h-3 w-3" />;
          break;
        default:
          colorClass = "bg-gray-100 text-gray-800 border-gray-200";
          icon = <Clock className="mr-1.5 h-3 w-3" />;
      }
    }

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-xs font-medium ${colorClass}`}
      >
        {icon}
        {isOverdue
          ? "Overdue"
          : status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  const copyShareLink = async () => {
    if (!invoice?.publicToken) return;

    try {
      const publicUrl = `${window.location.origin}/invoices/${invoice.publicToken}`;
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success("Public link copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const handleDownloadPDF = async () => {
    if (!invoice || downloadingPDF) return;

    setDownloadingPDF(true);
    try {
      const { generatePDFFromCurrentPage } = await loadPDFGenerator();
      await generatePDFFromCurrentPage(
        "invoice-content",
        `invoice-${invoice.invoiceNumber}.pdf`,
      );
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      const response = await apiClient.put(`/admin/invoicing/${invoiceId}`, {
        status: newStatus,
      });

      if (response.success) {
        setInvoice((prev) => ({ ...prev, status: newStatus }));
        toast.success(`Invoice marked as ${newStatus}`);
      }
    } catch (error) {
      console.error("Error updating invoice status:", error);
      toast.error("Failed to update invoice status");
    }
  };

  // Search for users to link invoice to
  const searchClients = useCallback(async () => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    try {
      setIsSearching(true);
      const response = await apiClient.get(
        `/admin/invoicing/clients/search?q=${encodeURIComponent(searchQuery)}&limit=10`,
      );
      // Only show users (not leads) for linking
      const userResults = response.clients.filter(
        (client) => client.type === "user",
      );
      setSearchResults(userResults);
    } catch (error) {
      console.error("Error searching users:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    if (!searchQuery || searchQuery.length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(searchClients, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, searchClients]);

  const handleLinkToUser = async (userId) => {
    try {
      setIsLinking(true);
      const response = await apiClient.patch(`/admin/invoicing/${invoiceId}`, {
        linkToUser: userId,
      });

      if (response.success) {
        setInvoice(response.invoice);
        setShowLinkModal(false);
        setSearchQuery("");
        setSearchResults([]);
        toast.success("Invoice linked to user successfully!");
      }
    } catch (error) {
      console.error("Error linking invoice:", error);
      toast.error("Failed to link invoice to user");
    } finally {
      setIsLinking(false);
    }
  };

  const handleUnlinkInvoice = async () => {
    try {
      setIsLinking(true);
      const response = await apiClient.patch(`/admin/invoicing/${invoiceId}`, {
        clearLinks: true,
      });

      if (response.success) {
        setInvoice(response.invoice);
        toast.success("Invoice unlinked successfully!");
      }
    } catch (error) {
      console.error("Error unlinking invoice:", error);
      toast.error("Failed to unlink invoice");
    } finally {
      setIsLinking(false);
    }
  };

  if (loading) {
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
          <h1 className="text-2xl font-bold text-gray-900">
            Invoice not found
          </h1>
          <Link
            href="/admin/invoicing"
            className="mt-4 inline-flex items-center text-blue-600 hover:text-blue-500"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Invoices
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center">
              <Link
                href="/admin/invoicing"
                className="flex items-center text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Invoices
              </Link>
              <div className="ml-6">
                <h1 className="text-2xl font-bold text-gray-900">
                  Invoice Preview
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {getStatusBadge(invoice.status, invoice.isOverdue)}
            </div>
          </div>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="border-b border-gray-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Status Update Buttons */}
              {invoice.status === "draft" && (
                <button
                  onClick={() => handleStatusUpdate("sent")}
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Mark as Sent
                </button>
              )}
              {invoice.status === "sent" && (
                <button
                  onClick={() => handleStatusUpdate("paid")}
                  className="inline-flex items-center rounded-md border border-transparent bg-green-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                >
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Mark as Paid
                </button>
              )}
            </div>

            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/invoicing/${invoiceId}/edit`}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit Invoice
              </Link>

              {/* Link/Unlink User Button */}
              {invoice.linkedUser ? (
                <button
                  onClick={handleUnlinkInvoice}
                  disabled={isLinking}
                  className="inline-flex items-center rounded-md border border-orange-300 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-700 shadow-sm hover:bg-orange-100 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  {isLinking
                    ? "Unlinking..."
                    : `Unlink from ${invoice.linkedUser?.name || "User"}`}
                </button>
              ) : (
                <button
                  onClick={() => setShowLinkModal(true)}
                  className="inline-flex items-center rounded-md border border-blue-300 bg-blue-50 px-3 py-2 text-sm font-medium text-blue-700 shadow-sm hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <LinkIcon className="mr-2 h-4 w-4" />
                  Link to User
                </button>
              )}

              {invoice.status !== "draft" && (
                <button
                  onClick={copyShareLink}
                  className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <Copy className="mr-2 h-4 w-4" />
                  {copied ? "Copied!" : "Copy Link"}
                </button>
              )}

              <button
                onClick={handleDownloadPDF}
                disabled={downloadingPDF}
                className="inline-flex items-center rounded-md border border-transparent bg-purple-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Download className="mr-2 h-4 w-4" />
                {downloadingPDF ? "Generating..." : "Export PDF"}
              </button>

              {invoice.status !== "draft" && (
                <a
                  href={`/invoices/${invoice.publicToken}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View Public
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Content - Same as public page but in admin layout */}
      <div className="mx-auto max-w-4xl px-4 py-8 pt-12 sm:px-6 lg:px-8">
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
                  {(invoice.lineItems || []).map((item, index) => (
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
                  {formatDate(invoice.dueDate)}.
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

      {/* Link User Modal */}
      {showLinkModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-screen items-center justify-center p-4">
            <div
              className="fixed inset-0 bg-black bg-opacity-25"
              onClick={() => setShowLinkModal(false)}
            ></div>

            <div className="relative w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">
                  Link Invoice to User
                </h3>
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="mb-4">
                <label className="mb-2 block text-sm font-medium text-gray-700">
                  Search for user by name or email
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Type to search users..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 pl-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                </div>
              </div>

              {/* Search Results */}
              {searchQuery.length >= 2 && (
                <div className="max-h-60 overflow-y-auto">
                  {isSearching ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="h-5 w-5 animate-spin rounded-full border-2 border-blue-500 border-t-transparent"></div>
                      <span className="ml-2 text-sm text-gray-500">
                        Searching...
                      </span>
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2">
                      {searchResults.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleLinkToUser(user.id)}
                          disabled={isLinking}
                          className="w-full rounded-md border border-gray-200 p-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          <div className="flex items-center">
                            <User className="mr-3 h-4 w-4 text-gray-400" />
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {user.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {user.email}
                              </div>
                              {user.phone && (
                                <div className="text-sm text-gray-500">
                                  {user.phone}
                                </div>
                              )}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="py-4 text-center text-sm text-gray-500">
                      No users found matching &quot;{searchQuery}&quot;
                    </div>
                  )}
                </div>
              )}

              {searchQuery.length < 2 && (
                <div className="py-4 text-center text-sm text-gray-500">
                  Type at least 2 characters to search for users
                </div>
              )}

              <div className="mt-6 flex justify-end space-x-3">
                <button
                  onClick={() => setShowLinkModal(false)}
                  className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
