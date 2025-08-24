"use client";

import Link from "next/link";
import { Plus, Settings } from "lucide-react";

export default function RateCardsPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Rate Cards</h1>
          <p className="text-gray-600">
            Manage trade day rates, material costs, and service prices
          </p>
        </div>
        <Link
          href="/admin/quoting/create"
          className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Plus className="-ml-1 mr-2 h-4 w-4" />
          Add Rate
        </Link>
      </div>

      {/* Content */}
      <div className="rounded-lg border border-gray-200 bg-white p-12 text-center">
        <Settings className="mx-auto h-12 w-12 text-gray-400" />
        <h3 className="mt-2 text-sm font-medium text-gray-900">
          No rate cards yet
        </h3>
        <p className="mt-1 text-sm text-gray-500">
          Get started by adding your first rate card for trades, materials, or
          services.
        </p>
        <div className="mt-6">
          <Link
            href="/admin/quoting/create"
            className="inline-flex items-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <Plus className="-ml-1 mr-2 h-4 w-4" />
            Add Rate
          </Link>
        </div>
      </div>
    </div>
  );
}
