"use client";

import { useState, useEffect } from "react";
import { Building } from "lucide-react";
import toast from "react-hot-toast";
import { downloadPdf } from "@/libs/downloadPdf";
import InvoiceView from "@/components/documents/InvoiceView";

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
      await downloadPdf(
        `/api/invoices/${token}/pdf`,
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
    <InvoiceView
      invoice={invoice}
      toolbarProps={{
        onCopy: copyToClipboard,
        copied,
        onDownload: handleDownloadPDF,
        downloading: downloadingPDF,
      }}
    />
  );
}
