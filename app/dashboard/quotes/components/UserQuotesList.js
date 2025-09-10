"use client";

import { useState } from "react";
import {
  Calendar,
  MapPin,
  Package,
  Pound,
  Eye,
  Download,
  Clock,
} from "lucide-react";
import toast from "react-hot-toast";

const loadPDFGenerator = async () => {
  const pdfModule = await import("@/libs/quotePdfGenerator");
  return { generatePDFFromCurrentPage: pdfModule.generatePDFFromCurrentPage };
};

export default function UserQuotesList({ quotes }) {
  const [downloadingPDF, setDownloadingPDF] = useState(null);

  const handleDownloadPDF = async (quote) => {
    if (downloadingPDF === quote.id) return;

    setDownloadingPDF(quote.id);
    try {
      // Open the public quote page in a new window temporarily for PDF generation
      const publicUrl = `/quotes/${quote.publicToken}`;
      const newWindow = window.open(
        publicUrl,
        "_blank",
        "width=1200,height=800",
      );

      // Wait a moment for the page to load
      setTimeout(async () => {
        try {
          const { generatePDFFromCurrentPage } = await loadPDFGenerator();

          // Focus on the new window and generate PDF from it
          newWindow.focus();
          await generatePDFFromCurrentPage(
            "quote-content",
            `quote-${quote.quoteNumber}.pdf`,
            newWindow,
          );

          newWindow.close();
          toast.success("PDF downloaded successfully!");
        } catch (error) {
          console.error("Error downloading PDF:", error);
          toast.error("Failed to download PDF. Please try again.");
          newWindow.close();
        } finally {
          setDownloadingPDF(null);
        }
      }, 2000);
    } catch (error) {
      console.error("Error downloading PDF:", error);
      toast.error("Failed to download PDF. Please try again.");
      setDownloadingPDF(null);
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
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      draft: { color: "bg-gray-100 text-gray-800", label: "Draft" },
      pending: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
      sent: { color: "bg-blue-100 text-blue-800", label: "Sent" },
      won: { color: "bg-green-100 text-green-800", label: "Accepted" },
      lost: { color: "bg-red-100 text-red-800", label: "Declined" },
      expired: { color: "bg-gray-100 text-gray-800", label: "Expired" },
    };

    const config = statusConfig[status] || statusConfig.draft;

    return (
      <span
        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.color}`}
      >
        {config.label}
      </span>
    );
  };

  const isExpired = (validUntil) => {
    return new Date() > new Date(validUntil);
  };

  const getDaysUntilExpiry = (validUntil) => {
    const today = new Date();
    const expiryDate = new Date(validUntil);
    const diffTime = expiryDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {quotes.map((quote) => {
        const expired = isExpired(quote.validUntil);
        const daysUntilExpiry = getDaysUntilExpiry(quote.validUntil);

        return (
          <div
            key={quote.id}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {quote.title}
                  </h3>
                  {getStatusBadge(quote.status)}
                  <span className="text-sm text-gray-500">
                    #{quote.quoteNumber}
                  </span>
                </div>

                <p className="mb-4 text-gray-700">{quote.projectDescription}</p>

                <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-4">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-400" />
                    <span>{quote.projectAddress}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span>Created {formatDate(quote.createdAt)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Package className="h-4 w-4 text-gray-400" />
                    <span>
                      {quote.services?.filter(
                        (s) => s.type === "category" || !s.type,
                      ).length || 0}{" "}
                      categories
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Clock className="h-4 w-4 text-gray-400" />
                    <span>
                      {expired
                        ? "Expired"
                        : `${daysUntilExpiry} day${daysUntilExpiry !== 1 ? "s" : ""} left`}
                    </span>
                  </div>
                </div>

                {/* Validity Warning */}
                {expired ? (
                  <div className="mt-3 rounded-lg bg-red-50 p-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-red-500" />
                      <span className="text-sm font-medium text-red-800">
                        This quote has expired. Please contact us for an updated
                        quote.
                      </span>
                    </div>
                  </div>
                ) : daysUntilExpiry <= 7 ? (
                  <div className="mt-3 rounded-lg bg-yellow-50 p-3">
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-yellow-500" />
                      <span className="text-sm font-medium text-yellow-800">
                        This quote expires in {daysUntilExpiry} day
                        {daysUntilExpiry !== 1 ? "s" : ""}. Please contact us if
                        you need more time.
                      </span>
                    </div>
                  </div>
                ) : null}
              </div>

              <div className="ml-6 flex flex-col items-end space-y-4">
                <div className="text-right">
                  <div className="text-2xl font-bold text-gray-900">
                    {formatCurrency(quote.total)}
                  </div>
                  {quote.pricing?.depositRequired && (
                    <div className="text-sm text-gray-500">
                      Deposit:{" "}
                      {formatCurrency(quote.pricing.depositAmount || 0)}
                    </div>
                  )}
                </div>

                <div className="flex space-x-2">
                  <a
                    href={`/quotes/${quote.publicToken || quote.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Quote
                  </a>
                  {quote.publicToken && (
                    <button
                      onClick={() => handleDownloadPDF(quote)}
                      disabled={downloadingPDF === quote.id}
                      className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 disabled:opacity-50"
                    >
                      {downloadingPDF === quote.id ? (
                        <>
                          <div className="mr-2 h-4 w-4 animate-spin rounded-full border-b-2 border-white"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Project Summary */}
            {quote.services && quote.services.length > 0 && (
              <div className="mt-6 border-t border-gray-200 pt-4">
                <h4 className="mb-3 text-sm font-medium text-gray-900">
                  Project Summary
                </h4>
                <div className="space-y-2">
                  {quote.services
                    .filter(
                      (service) => service.type === "category" || !service.type,
                    )
                    .slice(0, 3)
                    .map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between text-sm"
                      >
                        <span className="text-gray-600">
                          {category.categoryName}
                        </span>
                        <span className="font-medium text-gray-900">
                          {formatCurrency(category.categoryTotal || 0)}
                        </span>
                      </div>
                    ))}
                  {quote.services.filter(
                    (s) => s.type === "category" || !s.type,
                  ).length > 3 && (
                    <div className="text-xs text-gray-500">
                      +
                      {quote.services.filter(
                        (s) => s.type === "category" || !s.type,
                      ).length - 3}{" "}
                      more categories
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
