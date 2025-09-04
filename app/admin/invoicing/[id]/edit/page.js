"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import apiClient from "@/libs/api";
import InvoiceEditForm from "./components/InvoiceEditForm";

export default function EditInvoicePage() {
  const params = useParams();
  const router = useRouter();
  const invoiceId = params.id;

  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (invoiceId) {
      fetchInvoice();
    }
  }, [invoiceId]);

  const fetchInvoice = async () => {
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
  };

  const handleSave = async (updatedData) => {
    try {
      const response = await apiClient.put(
        `/admin/invoicing/${invoiceId}`,
        updatedData,
      );
      if (response.success) {
        toast.success("Invoice updated successfully!");
        setInvoice(response.invoice);
        return true;
      }
    } catch (error) {
      console.error("Error updating invoice:", error);
      toast.error("Failed to update invoice");
      return false;
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
                  Edit Invoice #{invoice.invoiceNumber}
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Link
                href={`/admin/invoicing/${invoiceId}/preview`}
                className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Preview
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <InvoiceEditForm invoice={invoice} onSave={handleSave} />
      </div>
    </div>
  );
}
