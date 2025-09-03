"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import InvoiceBuilder from "./components/InvoiceBuilder";

export default function CreateInvoicePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <Link
              href="/admin/invoicing"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Invoices
            </Link>
            <div className="ml-6">
              <h1 className="text-2xl font-bold text-gray-900">
                Create Invoice
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <InvoiceBuilder />
      </div>
    </div>
  );
}
