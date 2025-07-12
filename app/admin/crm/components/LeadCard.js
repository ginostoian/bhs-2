"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function LeadCard({ lead, onClick, onStageUpdate, onUpdate }) {
  const [isUpdating, setIsUpdating] = useState(false);

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

  const getAgingColor = (days) => {
    if (days >= 14) return "text-red-600";
    if (days >= 7) return "text-orange-600";
    return "text-gray-600";
  };

  const handleStageChange = async (newStage) => {
    if (!lead.id || newStage === lead.stage) return;

    setIsUpdating(true);
    try {
      await onStageUpdate(
        lead.id,
        newStage,
        `Stage changed from ${lead.stage} to ${newStage}`,
      );
    } catch (error) {
      toast.error("Failed to update stage");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div
      className="w-full cursor-pointer rounded-lg border border-gray-200 bg-white p-5 shadow-sm transition-all duration-200 hover:border-gray-300 hover:shadow-lg"
      onClick={() => {
        if (!lead || !lead.id) {
          return;
        }
        onClick();
      }}
    >
      {/* Header with Stage Badge */}
      <div className="mb-4 flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <h4 className="mb-1 truncate text-lg font-semibold text-gray-900">
            {lead.name}
          </h4>
          <p className="mb-2 truncate text-sm text-gray-600">{lead.email}</p>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
              {lead.stage}
            </span>
            {isUpdating && (
              <div className="loading loading-spinner loading-xs"></div>
            )}
          </div>
        </div>
      </div>

      {/* Key Information Grid */}
      <div className="mb-4 grid grid-cols-2 gap-3">
        {lead.phone && (
          <div className="flex items-center gap-2 text-sm text-gray-600">
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
        <div className="mb-4 flex items-start gap-2 text-sm text-gray-600">
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
                className="badge badge-outline badge-sm text-xs"
              >
                {type}
              </span>
            ))}
            {lead.projectTypes.length > 3 && (
              <span className="badge badge-outline badge-sm text-xs">
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
          <div className="text-xs text-gray-500">Budget</div>
        </div>
        <div className="text-center">
          <div
            className={`text-xs font-medium ${getClientHealthColor(lead.clientHealth)}`}
          >
            {lead.clientHealth}
          </div>
          <div className="text-xs text-gray-500">Health</div>
        </div>
        <div className="text-center">
          <div
            className={`text-xs font-medium ${getAgingColor(lead.agingDays)}`}
          >
            {lead.agingDays}d
          </div>
          <div className="text-xs text-gray-500">Aging</div>
        </div>
      </div>

      {/* Source */}
      <div className="mb-4">
        <div className="mb-1 text-xs text-gray-500">Source</div>
        <div className="text-sm text-gray-700">
          {lead.source === "Other" && lead.customSource
            ? lead.customSource
            : lead.source}
        </div>
      </div>

      {/* Assignment and Linked User */}
      <div className="mb-4 space-y-2">
        {lead.assignedTo && (
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white">
              {lead.assignedTo.name?.charAt(0) || "A"}
            </div>
            <span className="truncate text-sm text-gray-700">
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
              href={`/admin/users/${lead.linkedUser.id}`}
              className="truncate text-sm text-green-600 hover:text-green-700 hover:underline"
              onClick={(e) => e.stopPropagation()}
              title={lead.linkedUser.name || lead.linkedUser.email}
            >
              {lead.linkedUser.name || lead.linkedUser.email || "Linked User"}
            </a>
          </div>
        )}
      </div>

      {/* Quick Stage Change */}
      <div className="border-t border-gray-100 pt-3">
        <select
          value={lead.stage}
          onChange={(e) => handleStageChange(e.target.value)}
          onClick={(e) => e.stopPropagation()}
          className="crm-select w-full text-sm"
          disabled={isUpdating}
        >
          <option value="Lead">Lead</option>
          <option value="Never replied">Never replied</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Negotiations">Negotiations</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
      </div>
    </div>
  );
}
