"use client";

import { useState } from "react";
import {
  ExternalLink,
  Download,
  Calendar,
  Clock,
  CheckCircle,
  AlertTriangle,
  FileText,
} from "lucide-react";
import toast from "react-hot-toast";

// Dynamic PDF generator loading
const loadPDFGenerator = async () => {
  const { generatePDFFromCurrentPage } = await import(
    "@/libs/htmlQuotePdfGenerator"
  );
  return { generatePDFFromCurrentPage };
};

export default function UserInvoicesList({ invoices }) {
  const [downloadingPDF, setDownloadingPDF] = useState(null);

  const handleDownloadPDF = async (invoice) => {
    if (downloadingPDF === invoice.id) return;

    setDownloadingPDF(invoice.id);
    try {
      // Open the public invoice page in a new window temporarily for PDF generation
      const publicUrl = `/invoices/${invoice.publicToken}`;
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
            "invoice-content",
            `invoice-${invoice.invoiceNumber}.pdf`,
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

  const getStatusBadge = (status, isOverdue) => {
    let colorClass = "";
    let icon = null;
    let text = "";

    if (isOverdue) {
      colorClass = "bg-red-100 text-red-800 border-red-200";
      icon = <AlertTriangle className="mr-1 h-4 w-4" />;
      text = "Overdue";
    } else {
      switch (status) {
        case "sent":
          colorClass = "bg-blue-100 text-blue-800 border-blue-200";
          icon = <Clock className="mr-1 h-4 w-4" />;
          text = "Pending Payment";
          break;
        case "paid":
          colorClass = "bg-green-100 text-green-800 border-green-200";
          icon = <CheckCircle className="mr-1 h-4 w-4" />;
          text = "Paid";
          break;
        default:
          colorClass = "bg-gray-100 text-gray-800 border-gray-200";
          text = status.charAt(0).toUpperCase() + status.slice(1);
      }
    }

    return (
      <span
        className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${colorClass}`}
      >
        {icon}
        {text}
      </span>
    );
  };

  const getDaysUntilDue = (dueDate) => {
    if (!dueDate) return null;
    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      {invoices.map((invoice) => {
        const daysUntilDue = getDaysUntilDue(invoice.dueDate);
        const isOverdue = invoice.isOverdue;

        return (
          <div
            key={invoice.id}
            className="rounded-xl bg-white p-6 shadow-sm ring-1 ring-gray-200 transition-shadow hover:shadow-md"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="mb-2 flex items-center space-x-3">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Invoice #{invoice.invoiceNumber}
                  </h3>
                  {getStatusBadge(invoice.status, isOverdue)}
                </div>

                <p className="mb-2 text-gray-700">{invoice.title}</p>

                <div className="grid grid-cols-1 gap-4 text-sm text-gray-600 md:grid-cols-3">
                  <div className="flex items-center">
                    <Calendar className="mr-2 h-4 w-4 text-gray-400" />
                    <span>Issued: {formatDate(invoice.issueDate)}</span>
                  </div>

                  {invoice.dueDate && (
                    <div className="flex items-center">
                      <Clock className="mr-2 h-4 w-4 text-gray-400" />
                      <span
                        className={isOverdue ? "font-medium text-red-600" : ""}
                      >
                        Due: {formatDate(invoice.dueDate)}
                        {daysUntilDue !== null &&
                          !isOverdue &&
                          daysUntilDue <= 7 && (
                            <span className="ml-1 text-orange-600">
                              (
                              {daysUntilDue === 0
                                ? "Today"
                                : `${daysUntilDue} days`}
                              )
                            </span>
                          )}
                      </span>
                    </div>
                  )}

                  <div className="flex items-center">
                    <FileText className="mr-2 h-4 w-4 text-gray-400" />
                    <span>
                      {invoice.lineItems.length} line item
                      {invoice.lineItems.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                </div>

                {invoice.notes && (
                  <div className="mt-3 rounded-lg bg-gray-50 p-3">
                    <p className="text-sm text-gray-700">{invoice.notes}</p>
                  </div>
                )}

                {isOverdue && (
                  <div className="mt-3 rounded-lg border border-red-200 bg-red-50 p-3">
                    <div className="flex items-center">
                      <AlertTriangle className="mr-2 h-4 w-4 text-red-500" />
                      <p className="text-sm text-red-700">
                        This invoice is overdue. Please contact Better Homes to
                        arrange payment.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="ml-6 flex flex-col items-end">
                <div className="mb-4 text-right">
                  <p className="text-sm text-gray-500">Total Amount</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(invoice.total)}
                  </p>
                </div>

                <div className="flex w-full max-w-xs flex-col space-y-2">
                  <a
                    href={`/invoices/${invoice.publicToken}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" />
                    View Invoice
                  </a>

                  <button
                    onClick={() => handleDownloadPDF(invoice)}
                    disabled={downloadingPDF === invoice.id}
                    className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Download className="mr-2 h-4 w-4" />
                    {downloadingPDF === invoice.id
                      ? "Downloading..."
                      : "Download PDF"}
                  </button>
                </div>
              </div>
            </div>

            {/* Line Items Summary */}
            <div className="mt-4 border-t border-gray-200 pt-4">
              <h4 className="mb-2 text-sm font-medium text-gray-900">
                Invoice Breakdown
              </h4>
              <div className="space-y-1">
                {invoice.lineItems.slice(0, 3).map((item, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.serviceName} ({item.type})
                    </span>
                    <span className="text-gray-900">
                      {formatCurrency(item.totalVatIncluded)}
                    </span>
                  </div>
                ))}
                {invoice.lineItems.length > 3 && (
                  <div className="text-sm text-gray-500">
                    +{invoice.lineItems.length - 3} more item
                    {invoice.lineItems.length - 3 !== 1 ? "s" : ""}...
                  </div>
                )}
              </div>

              <div className="mt-3 border-t border-gray-100 pt-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal (excl. VAT):</span>
                  <span className="text-gray-900">
                    {formatCurrency(invoice.subtotal)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">VAT:</span>
                  <span className="text-gray-900">
                    {formatCurrency(invoice.totalVat)}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-medium">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-gray-900">
                    {formatCurrency(invoice.total)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
