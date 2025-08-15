"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function ArchivedLeadCard({ lead, onClick, onUnarchive }) {
  const [isUnarchiving, setIsUnarchiving] = useState(false);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const getBudgetColor = (budget) => {
    const colors = {
      "£": "text-green-600",
      "££": "text-blue-600",
      "£££": "text-orange-600",
      "££££": "text-red-600",
    };
    return colors[budget] || "text-gray-600";
  };

  const getClientHealthColor = (health) => {
    const colors = {
      Excellent: "text-emerald-600",
      Good: "text-green-600",
      Fair: "text-yellow-600",
      Poor: "text-red-600",
      Unknown: "text-gray-600",
    };
    return colors[health] || "text-gray-600";
  };

  const handleUnarchive = async () => {
    const leadId = lead.id || lead._id;
    if (!leadId) {
      toast.error("Invalid lead ID");
      return;
    }

    setIsUnarchiving(true);
    try {
      await onUnarchive(leadId);
      toast.success("Lead unarchived successfully");
    } catch (error) {
      console.error("Error unarchiving lead:", error);
      toast.error("Failed to unarchive lead");
    } finally {
      setIsUnarchiving(false);
    }
  };

  const formatDate = (date) => {
    if (!date) return "Unknown";
    const now = new Date();
    const archiveDate = new Date(date);
    const diffTime = Math.abs(now - archiveDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.ceil(diffDays / 30)} months ago`;

    return archiveDate.toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div
      className="w-full cursor-pointer rounded-lg border border-gray-300 bg-gray-50 p-5 shadow-sm transition-all duration-200 hover:border-gray-400 hover:shadow-lg"
      onClick={() => {
        const leadId = lead.id || lead._id;
        if (!lead || !leadId) {
          return;
        }
        onClick();
      }}
    >
      {/* Header with Archived Badge */}
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 truncate text-lg font-semibold text-gray-700">
            {lead.name}
          </h4>
          <p className="mb-2 truncate text-sm text-gray-500">{lead.email}</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-gray-200 px-2 py-1 text-xs font-medium text-gray-700">
              {lead.stage}
            </span>
            <span className="inline-flex items-center rounded-full bg-orange-100 px-2 py-1 text-xs font-medium text-orange-800">
              📁 Archived
            </span>
          </div>

          {/* Archive Info */}
          <div className="mt-2 text-xs text-gray-500">
            <div>Archived: {formatDate(lead.archivedAt)}</div>
            {lead.archivedBy && (
              <div>By: {lead.archivedBy.name || lead.archivedBy.email}</div>
            )}
          </div>
        </div>
      </div>

      {/* Key Information Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span className="text-gray-400">📞</span>
            <span className="truncate">{lead.phone}</span>
          </div>
        )}

        {lead.value > 0 && (
          <div className="flex items-center gap-2 text-sm font-medium text-green-600">
            <span>💰</span>
            <span>{formatCurrency(lead.value)}</span>
          </div>
        )}
      </div>

      {/* Address - Full Width */}
      {lead.address && (
        <div className="mb-4 flex items-start gap-2 text-sm text-gray-500">
          <span className="mt-0.5 text-gray-400">📍</span>
          <span className="truncate">{lead.address}</span>
        </div>
      )}

      {/* Project Types */}
      {lead.projectTypes && lead.projectTypes.length > 0 && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {lead.projectTypes.slice(0, 3).map((type, index) => (
              <span
                key={index}
                className="badge badge-outline badge-sm bg-gray-100 text-xs"
              >
                {type}
              </span>
            ))}
            {lead.projectTypes.length > 3 && (
              <span className="badge badge-outline badge-sm bg-gray-100 text-xs">
                +{lead.projectTypes.length - 3}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Metrics Row */}
      <div className="mb-4 grid grid-cols-3 gap-3">
        <div className="text-center">
          <div className={`text-xs font-medium ${getBudgetColor(lead.budget)}`}>
            {lead.budget}
          </div>
          <div className="text-xs text-gray-400">Budget</div>
        </div>
        <div className="text-center">
          <div
            className={`text-xs font-medium ${getClientHealthColor(lead.clientHealth)}`}
          >
            {lead.clientHealth}
          </div>
          <div className="text-xs text-gray-400">Health</div>
        </div>
        <div className="text-center">
          <div className="text-xs font-medium text-gray-500">{lead.source}</div>
          <div className="text-xs text-gray-400">Source</div>
        </div>
      </div>

      {/* Assignment and Linked User */}
      <div className="mb-4 space-y-2">
        {lead.assignedTo && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
              {lead.assignedTo.name?.charAt(0) || "A"}
            </div>
            <span className="truncate text-sm text-gray-600">
              {lead.assignedTo.name}
            </span>
          </div>
        )}

        {lead.linkedUser && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-xs font-medium text-white">
              👤
            </div>
            <a
              href={`/admin/users/${lead.linkedUser.id || lead.linkedUser._id}`}
              className="truncate text-sm text-green-600 hover:text-green-700 hover:underline"
              onClick={(e) => e.stopPropagation()}
              title={lead.linkedUser.name || lead.linkedUser.email}
            >
              {lead.linkedUser.name || lead.linkedUser.email || "Linked User"}
            </a>
          </div>
        )}
      </div>

      {/* Unarchive Button */}
      <div className="border-t border-gray-200 pt-3">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleUnarchive();
          }}
          disabled={isUnarchiving}
          className="w-full rounded-md bg-blue-100 px-3 py-2 text-sm font-medium text-blue-700 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          title="Unarchive this lead"
        >
          {isUnarchiving ? (
            <div className="flex items-center justify-center gap-2">
              <div className="loading loading-spinner loading-xs"></div>
              Unarchiving...
            </div>
          ) : (
            "📂 Unarchive"
          )}
        </button>
      </div>
    </div>
  );
}
