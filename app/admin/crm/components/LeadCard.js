"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";

export default function LeadCard({
  lead,
  onClick,
  onStageUpdate,
  onUpdate,
  onArchive,
}) {
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
    const leadId = lead.id || lead._id;
    console.log("🔄 Stage change requested:", {
      leadId,
      currentStage: lead.stage,
      newStage,
    });

    if (!leadId || newStage === lead.stage) {
      console.log("❌ Stage change skipped:", {
        leadId,
        currentStage: lead.stage,
        newStage,
      });
      return;
    }

    setIsUpdating(true);
    try {
      console.log("📞 Calling onStageUpdate with:", { leadId, newStage });
      await onStageUpdate(
        leadId,
        newStage,
        `Stage changed from ${lead.stage} to ${newStage}`,
      );
      console.log("✅ Stage update completed successfully");
    } catch (error) {
      console.error("❌ Stage update failed:", error);
      toast.error("Failed to update stage");
    } finally {
      setIsUpdating(false);
    }
  };


  return (
    <div
      className={`group relative w-full cursor-pointer rounded-xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md ${
        lead.agingDays >= 14
          ? "border-l-4 border-l-red-500"
          : lead.agingDays >= 7
            ? "border-l-4 border-l-orange-500"
            : "border-l-4 border-l-transparent"
      }`}
      onClick={() => {
        const leadId = lead.id || lead._id;
        if (!lead || !leadId) return;
        onClick();
      }}
    >
      {/* Header Info */}
      <div className="mb-3 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <h4 className="truncate text-[15px] font-semibold text-gray-900 group-hover:text-blue-600">
            {lead.name}
          </h4>
          <p className="truncate text-xs text-gray-500">{lead.email}</p>
        </div>
        {lead.value > 0 && (
          <span className="flex-shrink-0 rounded-md bg-green-50 px-2 py-1 text-xs font-semibold text-green-700">
            {formatCurrency(lead.value)}
          </span>
        )}
      </div>

      {/* Badges Row */}
      <div className="mb-4 flex flex-wrap gap-2">
        <span
          className={`inline-flex items-center rounded-md px-2 py-1 text-[11px] font-medium ${getClientHealthColor(
            lead.clientHealth,
          ).replace("text-", "text-").replace("600", "700")} bg-opacity-10 bg-gray-100 ring-1 ring-inset ring-gray-500/10`}
        >
          {lead.clientHealth} Health
        </span>
        <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-[11px] font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
          {lead.budget}
        </span>
        {lead.projectTypes?.[0] && (
          <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-[11px] font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
            {lead.projectTypes[0]}
            {lead.projectTypes.length > 1 && ` +${lead.projectTypes.length - 1}`}
          </span>
        )}
      </div>

      {/* Phone & Address & Source */}
      <div className="mb-3 space-y-1.5 border-t border-gray-50 pt-3">
        {lead.phone && (
            <div className="flex items-center text-xs text-gray-500">
                <svg className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="truncate">{lead.phone}</span>
            </div>
        )}
        {lead.address && (
             <div className="flex items-center text-xs text-gray-500">
                <svg className="mr-2 h-3.5 w-3.5 flex-shrink-0 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="truncate">{lead.address}</span>
            </div>
        )}
        <div className="flex items-center text-xs text-gray-400 bg-gray-50 rounded px-1.5 py-0.5 w-fit">
             <span className="mr-1">via</span>
             <span className="font-medium text-gray-500">
                 {lead.source === "Other" && lead.customSource ? lead.customSource : lead.source}
             </span>
        </div>
      </div>

      {/* Assignment & Quick Stage Link */}
      <div className="flex items-center justify-between border-t border-gray-50 pt-3">
        <div className="flex items-center -space-x-2">
             {lead.assignedTo ? (
                <div title={`Assigned to ${lead.assignedTo.name}`} className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white ring-2 ring-white">
                    {lead.assignedTo.name?.charAt(0) || "A"}
                </div>
             ) : (
                <div title="Unassigned" className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200 text-[10px] text-gray-500 ring-2 ring-white">?</div>
             )}
             
             {lead.linkedUser && (
                <div title={`Linked User: ${lead.linkedUser.name}`} className="flex h-6 w-6 items-center justify-center rounded-full bg-green-500 text-[10px] font-bold text-white ring-2 ring-white">
                    <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                </div>
             )}
        </div>

      {/* Quick Stage Select (Hidden by default, shown on hover/focus?) No, always visible but styled better */}
      <div className="relative pt-1" onClick={(e) => e.stopPropagation()}>
         <select
          value={lead.stage}
          onChange={(e) => handleStageChange(e.target.value)}
          disabled={isUpdating}
          className="w-full appearance-none rounded-lg border-0 bg-gray-50 py-1.5 pl-3 pr-8 text-xs font-medium text-gray-600 hover:bg-gray-100 focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50"
        >
          <option value="Lead">Lead</option>
          <option value="Never replied">Never replied</option>
          <option value="Qualified">Qualified</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Negotiations">Negotiations</option>
          <option value="Won">Won</option>
          <option value="Lost">Lost</option>
        </select>
        <div className="pointer-events-none absolute right-2 top-[calc(50%+2px)] -translate-y-1/2 text-gray-400">
             <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
             </svg>
        </div>
      </div>
      </div>
      
       {/* Aging Indicator Mini Text */}
       {(lead.agingDays > 3) && (
            <div className={`mt-2 flex items-center justify-end text-[10px] ${getAgingColor(lead.agingDays)}`}>
                <svg className="mr-1 h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {lead.agingDays}d inactive
            </div>
       )}
    </div>
  );
}
