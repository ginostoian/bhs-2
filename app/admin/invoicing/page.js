"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import InvoicingDashboard from "./components/InvoicingDashboard";

export default function InvoicingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 justify-between">
            <div className="flex items-center">
              <FileText className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <h1 className="text-2xl font-bold text-gray-900">Invoicing</h1>
                <p className="text-sm text-gray-500">
                  Manage and track your invoices
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/invoicing/create"
                className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                <Plus className="mr-2 h-4 w-4" />
                Create Invoice
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <InvoicingDashboard />
      </div>
    </div>
  );
}
