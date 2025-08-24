"use client";

import Link from "next/link";
import { ArrowLeft, Edit } from "lucide-react";

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
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Edit Quote</h1>
          <p className="text-gray-600">#{quoteId} - Edit quote details</p>
        </div>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <Edit className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          Edit functionality coming soon
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          The ability to edit existing quotes will be implemented in a future
          update.
        </p>
        <div className="mt-6">
          <Link
            href={`/admin/quoting/${quoteId}/preview`}
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            View Quote
          </Link>
        </div>
      </div>
    </div>
  );
}
