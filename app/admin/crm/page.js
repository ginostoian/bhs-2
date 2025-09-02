"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import LeadCard from "./components/LeadCard";
import ArchivedLeadCard from "./components/ArchivedLeadCard";
import CreateLeadModal from "./components/CreateLeadModal";
import LeadDetailModal from "./components/LeadDetailModal";
import FilterBar from "./components/FilterBar";
import CRMButton from "@/components/CRMButton";

const CRM_STAGES = [
  "Lead",
  "Never replied",
  "Qualified",
  "Proposal Sent",
  "Negotiations",
  "Won",
  "Lost",
];

const STAGE_COLORS = {
  Lead: "bg-blue-50 border-blue-200",
  "Never replied": "bg-gray-50 border-gray-200",
  Qualified: "bg-green-50 border-green-200",
  "Proposal Sent": "bg-yellow-50 border-yellow-200",
  Negotiations: "bg-orange-50 border-orange-200",
  Won: "bg-emerald-50 border-emerald-200",
  Lost: "bg-red-50 border-red-200",
};

export default function CRMPage() {
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [sendingBrief, setSendingBrief] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    assignedTo: "",
    source: "",
    projectType: "",
  });
  const [archivedLeads, setArchivedLeads] = useState([]);
  const [isFinishedColumnCollapsed, setIsFinishedColumnCollapsed] =
    useState(false);

  // Fetch leads on component mount
  useEffect(() => {
    fetchLeads();
    fetchArchivedLeads();
  }, []);

  // Apply filters when leads or filters change
  useEffect(() => {
    applyFilters();
  }, [leads, filters]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      // Fetch all leads by setting a high limit to avoid pagination issues
      const response = await apiClient.get("/crm/leads?limit=1000");
      setLeads(response.leads || []);
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  const fetchArchivedLeads = async () => {
    try {
      const response = await apiClient.get("/crm/leads/archived");
      setArchivedLeads(response.leads || []);
    } catch (error) {
      console.error("Error fetching archived leads:", error);
      toast.error("Failed to fetch archived leads");
    }
  };

  const applyFilters = () => {
    let filtered = [...leads];

    // Apply search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(
        (lead) =>
          lead.name?.toLowerCase().includes(searchLower) ||
          lead.email?.toLowerCase().includes(searchLower) ||
          lead.phone?.toLowerCase().includes(searchLower) ||
          lead.address?.toLowerCase().includes(searchLower),
      );
    }

    // Apply assigned to filter
    if (filters.assignedTo) {
      filtered = filtered.filter(
        (lead) => lead.assignedTo?.id === filters.assignedTo,
      );
    }

    // Apply source filter
    if (filters.source) {
      filtered = filtered.filter((lead) => lead.source === filters.source);
    }

    // Apply project type filter
    if (filters.projectType) {
      filtered = filtered.filter(
        (lead) =>
          lead.projectTypes?.includes(filters.projectType) ||
          lead.customProjectType === filters.projectType,
      );
    }

    setFilteredLeads(filtered);
  };

  const handleCreateLead = async (leadData) => {
    try {
      const response = await apiClient.post("/crm/leads", leadData);
      console.log("✅ New lead created:", response.lead);
      setLeads((prev) => [response.lead, ...prev]);
      setShowCreateModal(false);
      toast.success("Lead created successfully");
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(error.response?.data?.error || "Failed to create lead");
    }
  };

  const handleUpdateLead = async (leadId, updates) => {
    // Guard against invalid lead ID
    if (!leadId) {
      toast.error("Invalid lead ID");
      return;
    }

    try {
      const response = await apiClient.put(`/crm/leads/${leadId}`, updates);
      setLeads((prev) =>
        prev.map((lead) => {
          const currentLeadId = String(lead.id || lead._id);
          const targetLeadId = String(leadId);
          return currentLeadId === targetLeadId ? response.lead : lead;
        }),
      );
      toast.success("Lead updated successfully");
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error(error.response?.data?.error || "Failed to update lead");
    }
  };

  const handleStageUpdate = async (leadId, newStage, comment) => {
    console.log("🔄 handleStageUpdate called:", { leadId, newStage, comment });

    // Guard against invalid lead ID
    if (!leadId) {
      console.log("❌ Invalid lead ID");
      toast.error("Invalid lead ID");
      return;
    }

    try {
      console.log("📞 Making API call to update stage");
      const response = await apiClient.put(`/crm/leads/${leadId}/stage`, {
        stage: newStage,
        comment,
      });
      console.log("✅ API response received:", response);

      setLeads((prev) =>
        prev.map((lead) => {
          const currentLeadId = String(lead.id || lead._id);
          const targetLeadId = String(leadId);
          const responseLeadId = String(response.lead.id || response.lead._id);
          console.log("🔄 Comparing lead IDs:", {
            currentLeadId,
            targetLeadId,
            responseLeadId,
            match: currentLeadId === targetLeadId,
          });
          return currentLeadId === targetLeadId ? response.lead : lead;
        }),
      );
      toast.success(`Lead moved to ${newStage}`);
    } catch (error) {
      console.error("❌ Error updating stage:", error);
      toast.error(error.response?.data?.error || "Failed to update stage");
    }
  };

  const handleLeadClick = (lead) => {
    // Guard against invalid lead
    const leadId = lead.id || lead._id;
    if (!lead || !leadId) {
      toast.error("Invalid lead data");
      return;
    }

    setSelectedLead(lead);
    setShowDetailModal(true);
  };

  const handleSendMorningBrief = async () => {
    try {
      setSendingBrief(true);
      await apiClient.post("/crm/morning-brief");
      toast.success("Morning brief sent to all admins");
    } catch (error) {
      console.error("Error sending morning brief:", error);
      toast.error("Failed to send morning brief");
    } finally {
      setSendingBrief(false);
    }
  };

  const handleArchiveLead = async (leadId) => {
    try {
      await apiClient.post(`/crm/leads/${leadId}/archive`);

      // Remove from active leads and add to archived leads
      const leadToArchive = leads.find(
        (lead) => (lead.id || lead._id) === leadId,
      );
      if (leadToArchive) {
        setLeads((prev) =>
          prev.filter((lead) => (lead.id || lead._id) !== leadId),
        );
        setArchivedLeads((prev) => [leadToArchive, ...prev]);
      }

      toast.success("Lead archived successfully");
    } catch (error) {
      console.error("Error archiving lead:", error);
      toast.error("Failed to archive lead");
    }
  };

  const handleUnarchiveLead = async (leadId) => {
    try {
      await apiClient.delete(`/crm/leads/${leadId}/archive`);

      // Remove from archived leads and add back to active leads
      const leadToUnarchive = archivedLeads.find(
        (lead) => (lead.id || lead._id) === leadId,
      );
      if (leadToUnarchive) {
        setArchivedLeads((prev) =>
          prev.filter((lead) => (lead.id || lead._id) !== leadId),
        );
        setLeads((prev) => [leadToUnarchive, ...prev]);
      }

      toast.success("Lead unarchived successfully");
    } catch (error) {
      console.error("Error unarchiving lead:", error);
      toast.error("Failed to unarchive lead");
    }
  };

  const getLeadsByStage = (stage) => {
    const stageLeads = filteredLeads.filter((lead) => lead.stage === stage);
    console.log(`📊 Found ${stageLeads.length} leads in stage: ${stage}`);
    return stageLeads;
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="min-w-0 space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CRM Dashboard</h1>
            <p className="text-gray-600">
              Manage your leads and track their progress
            </p>
          </div>
          <div className="flex gap-2">
            <CRMButton href="/admin/crm/reports" variant="outline">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                />
              </svg>
              Reports
            </CRMButton>
            <CRMButton
              onClick={handleSendMorningBrief}
              variant="secondary"
              disabled={sendingBrief}
              loading={sendingBrief}
            >
              {!sendingBrief && (
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              )}
              {sendingBrief ? "Sending..." : "Send Brief"}
            </CRMButton>

            <CRMButton
              onClick={() => setShowCreateModal(true)}
              variant="primary"
            >
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4v16m8-8H4"
                />
              </svg>
              Add Lead
            </CRMButton>
          </div>
        </div>

        {/* Filter Bar */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Kanban Board */}
        <div className="w-full overflow-x-auto">
          <div className="flex w-max gap-8">
            {CRM_STAGES.map((stage) => (
              <div
                key={stage}
                className={`min-h-96 rounded-lg border-2 ${STAGE_COLORS[stage]} w-[420px] p-4`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">{stage}</h3>
                  <span className="badge badge-neutral">
                    {getLeadsByStage(stage).length}
                  </span>
                </div>

                <div className="space-y-3">
                  {getLeadsByStage(stage).map((lead) => (
                    <LeadCard
                      key={lead.id || lead._id}
                      lead={lead}
                      onClick={() => handleLeadClick(lead)}
                      onStageUpdate={handleStageUpdate}
                      onUpdate={handleUpdateLead}
                      onArchive={handleArchiveLead}
                    />
                  ))}
                </div>
              </div>
            ))}

            {/* Finished Column (Archived Leads) */}
            <div className="min-h-96 w-[420px] rounded-lg border-2 border-gray-300 bg-gray-50 p-4">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      setIsFinishedColumnCollapsed(!isFinishedColumnCollapsed)
                    }
                    className="text-gray-600 hover:text-gray-800"
                    title={
                      isFinishedColumnCollapsed
                        ? "Expand Finished column"
                        : "Collapse Finished column"
                    }
                  >
                    {isFinishedColumnCollapsed ? "▶️" : "🔽"}
                  </button>
                  <h3 className="font-semibold text-gray-700">Finished</h3>
                </div>
                <span className="badge badge-neutral bg-gray-500">
                  {archivedLeads.length}
                </span>
              </div>

              {!isFinishedColumnCollapsed && (
                <div className="space-y-3">
                  {archivedLeads.map((lead) => (
                    <ArchivedLeadCard
                      key={lead.id || lead._id}
                      lead={lead}
                      onClick={() => handleLeadClick(lead)}
                      onUnarchive={handleUnarchiveLead}
                    />
                  ))}
                  {archivedLeads.length === 0 && (
                    <div className="py-8 text-center text-gray-500">
                      <div className="mb-2 text-4xl">📁</div>
                      <div className="text-sm">No archived leads</div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Create Lead Modal */}
        {showCreateModal && (
          <CreateLeadModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateLead}
          />
        )}

        {/* Lead Detail Modal */}
        {showDetailModal && selectedLead && (
          <LeadDetailModal
            lead={selectedLead}
            onClose={() => {
              setShowDetailModal(false);
              setSelectedLead(null);
            }}
            onUpdate={handleUpdateLead}
            onStageUpdate={handleStageUpdate}
            onRefresh={fetchLeads}
          />
        )}
      </div>
    </div>
  );
}
