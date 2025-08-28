"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import QuoteEditWizard from "./components/QuoteEditWizard";

export default function EditQuotePage({ params }) {
  const { id: quoteId } = params;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin/quoting/history"
          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to History
        </Link>
      </div>

      {/* Quote Edit Wizard */}
      <QuoteEditWizard quoteId={quoteId} />
    </div>
  );
}
