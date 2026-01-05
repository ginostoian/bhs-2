"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import apiClient from "@/libs/api";
import LeadCard from "./components/LeadCard";
import ArchivedLeadCard from "./components/ArchivedLeadCard";
import CreateLeadModal from "./components/CreateLeadModal";
import LeadDetailModal from "./components/LeadDetailModal";
import FilterBar from "./components/FilterBar";
import LossPreventionBar from "./components/LossPreventionBar";
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
  // State for per-stage loading
  const [stagesData, setStagesData] = useState(
    CRM_STAGES.reduce(
      (acc, stage) => ({
        ...acc,
        [stage]: { leads: [], page: 1, hasMore: true, loading: false },
      }),
      {},
    ),
  );
  
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

  // Fetch leads for a specific stage
  const fetchStageLeads = useCallback(
    async (stage, page = 1, currentFilters = filters) => {
      try {
        setStagesData((prev) => ({
          ...prev,
          [stage]: { ...prev[stage], loading: true },
        }));

        // Build query string from filters
        const params = new URLSearchParams({
          stage,
          page,
          limit: 10,
          // Add filters if they exist
          ...(currentFilters.search && { search: currentFilters.search }),
          ...(currentFilters.assignedTo && {
            assignedTo: currentFilters.assignedTo,
          }),
          ...(currentFilters.source && { source: currentFilters.source }),
          ...(currentFilters.projectType && {
            projectType: currentFilters.projectType,
          }),
        });

        const response = await apiClient.get(
          `/crm/leads/by-stage?${params.toString()}`,
        );
        const { leads, pagination } = response;

        setStagesData((prev) => ({
          ...prev,
          [stage]: {
            leads: page === 1 ? leads : [...prev[stage].leads, ...leads],
            page,
            hasMore: pagination.hasMore,
            loading: false,
          },
        }));
      } catch (error) {
        console.error(`Error fetching leads for ${stage}:`, error);
        toast.error(`Failed to load ${stage} leads`);
        setStagesData((prev) => ({
          ...prev,
          [stage]: { ...prev[stage], loading: false },
        }));
      }
    },
    [filters],
  );

  // Fetch all stages (initial load)
  const fetchAllStages = useCallback(async () => {
    setLoading(true);
    await Promise.all(
      CRM_STAGES.map((stage) => fetchStageLeads(stage, 1, filters)),
    );
    setLoading(false);
  }, [fetchStageLeads, filters]);

  // Initial load
  useEffect(() => {
    fetchAllStages();
    fetchArchivedLeads();
  }, []); // Only run once on mount? No, filters might change.

  // Refetch when filters change
  useEffect(() => {
    // Debounce or just run?
    const timeoutId = setTimeout(() => {
      fetchAllStages();
    }, 500); // Debounce for 500ms
    return () => clearTimeout(timeoutId);
  }, [filters]); 
  // Dependency on fetchAllStages which depends on filters... so simpler dependence on [filters]
  // Ideally fetchAllStages should use the 'filters' from state, but useEffect logic needs care to avoid loops.
  // The debounced effect handles it.

  const handleLoadMore = (stage) => {
    const stageData = stagesData[stage];
    if (stageData.hasMore && !stageData.loading) {
      fetchStageLeads(stage, stageData.page + 1);
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

  const handleCreateLead = async (leadData) => {
    try {
      const response = await apiClient.post("/crm/leads", leadData);
      console.log("✅ New lead created:", response.lead);
      
      // Add to the "Lead" stage (or specified stage)
      const stage = response.lead.stage || "Lead";
      setStagesData(prev => ({
        ...prev,
        [stage]: {
          ...prev[stage],
          leads: [response.lead, ...prev[stage].leads]
        }
      }));
      
      setShowCreateModal(false);
      toast.success("Lead created successfully");
    } catch (error) {
      console.error("Error creating lead:", error);
      toast.error(error.response?.data?.error || "Failed to create lead");
    }
  };

  const handleUpdateLead = async (leadId, updates) => {
    if (!leadId) return;

    try {
      const response = await apiClient.put(`/crm/leads/${leadId}`, updates);
      
      // Update in whatever stage it is
      const updatedLead = response.lead;
      const stage = updatedLead.stage;
      
      setStagesData(prev => {
        // We need to find which stage the lead WAS in to update it correctly
        // But since we know the stage from the response... 
        // Actually, if stage changed, we should move it.
        // But handleUpdateLead is usually for non-stage updates. 
        // Let's iterate all stages to be safe or just update the specific one if we knew.
        
        const newStagesData = { ...prev };
        
        // Find and update the lead in its stage
        for (const s of CRM_STAGES) {
           const leadIndex = newStagesData[s].leads.findIndex(l => (l.id || l._id) === leadId);
           if (leadIndex !== -1) {
             // If stage changed in this update (unlikely via this handler), we might need to move it.
             // But for simplicity assume simple update.
             const newLeads = [...newStagesData[s].leads];
             newLeads[leadIndex] = updatedLead;
             newStagesData[s] = { ...newStagesData[s], leads: newLeads };
             break; 
           }
        }
        return newStagesData;
      });

      toast.success("Lead updated successfully");
    } catch (error) {
      console.error("Error updating lead:", error);
      toast.error(error.response?.data?.error || "Failed to update lead");
    }
  };

  const handleStageUpdate = async (leadId, newStage, comment) => {
    if (!leadId) return;

    try {
      const response = await apiClient.put(`/crm/leads/${leadId}/stage`, {
        stage: newStage,
        comment,
      });

      // Update state: remove from old stage, add to new stage
      const updatedLead = response.lead;
      
      setStagesData(prev => {
        const newStagesData = { ...prev };
        let found = false;
        
        // Remove from old stage
        for (const s of CRM_STAGES) {
           const leadIndex = newStagesData[s].leads.findIndex(l => (l.id || l._id) === leadId);
           if (leadIndex !== -1) {
             const oldLeads = newStagesData[s].leads.filter(l => (l.id || l._id) !== leadId);
             newStagesData[s] = { ...newStagesData[s], leads: oldLeads };
             found = true;
             break; // Found the lead
           }
        }
        
        // Add to new stage (at the top)
        if (found) {
           newStagesData[newStage] = {
             ...newStagesData[newStage],
             leads: [updatedLead, ...newStagesData[newStage].leads]
           };
        }
        
        return newStagesData;
      });

      toast.success(`Lead moved to ${newStage}`);
    } catch (error) {
      console.error("❌ Error updating stage:", error);
      // If Drag&Drop triggered this, handleDragEnd might have already optimistically updated.
      // But if this fails, we should ideally revert. handleDragEnd has its own revert logic.
      toast.error(error.response?.data?.error || "Failed to update stage");
      throw error; // Re-throw so handleDragEnd handles revert
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
      let leadToArchive = null;
      
      setStagesData(prev => {
        const newStagesData = { ...prev };
        for (const s of CRM_STAGES) {
           const leadIndex = newStagesData[s].leads.findIndex(l => (l.id || l._id) === leadId);
           if (leadIndex !== -1) {
             const [removed] = newStagesData[s].leads.splice(leadIndex, 1);
             leadToArchive = removed;
             newStagesData[s] = { ...newStagesData[s], leads: [...newStagesData[s].leads] };
             break;
           }
        }
        return newStagesData;
      });

      if (leadToArchive) {
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
        
        const stage = leadToUnarchive.stage || "Lead";
        setStagesData(prev => ({
          ...prev,
          [stage]: {
            ...prev[stage],
            leads: [leadToUnarchive, ...prev[stage].leads]
          }
        }));
      }

      toast.success("Lead unarchived successfully");
    } catch (error) {
      console.error("Error unarchiving lead:", error);
      toast.error("Failed to unarchive lead");
    }
  };

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const startStage = source.droppableId;
    const finishStage = destination.droppableId;
    const leadId = draggableId;
    const newStage = finishStage;

    console.log(`🔄 Dragged lead ${leadId} from ${startStage} to ${newStage}`);

    // If reordering within same stage
    if (startStage === finishStage) {
      // Reorder locally
      const items = Array.from(stagesData[startStage].leads);
      const [reorderedItem] = items.splice(source.index, 1);
      items.splice(destination.index, 0, reorderedItem);

      setStagesData(prev => ({
        ...prev,
        [startStage]: { ...prev[startStage], leads: items }
      }));
      return;
    }

    // Moving to different stage
    // Optimistic Update
    let movedLead = null;
    
    setStagesData(prev => {
      const sourceLeads = Array.from(prev[startStage].leads);
      const [removed] = sourceLeads.splice(source.index, 1);
      
      const destLeads = Array.from(prev[finishStage].leads);
      movedLead = { ...removed, stage: newStage };
      destLeads.splice(destination.index, 0, movedLead);
      
      return {
        ...prev,
        [startStage]: { ...prev[startStage], leads: sourceLeads },
        [finishStage]: { ...prev[finishStage], leads: destLeads }
      };
    });

    try {
      await handleStageUpdate(
        leadId,
        newStage,
        `Moved from ${startStage} to ${newStage} via drag and drop`,
      );
    } catch (error) {
      console.error("Failed to update stage:", error);
      // Revert (Simplified: just refetch or rely on component error handling from handleStageUpdate re-throw)
      toast.error("Failed to move lead - reverting");
      fetchAllStages(); // Safest revert
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[100dvh] md:h-[calc(100vh-4rem)] md:max-w-[calc(100vw-22rem)]">
      {/* Header & Controls Section - Flex-none so it takes natural height */}
      <div className="flex-none px-2 pb-4 space-y-4">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 font-display">CRM Pipeline</h1>
            <p className="text-sm text-gray-500">
              Manage your leads and track their progress
            </p>
          </div>
          <div className="flex gap-2">
            <CRMButton href="/admin/crm/reports" variant="outline" className="shadow-sm">
                <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              Reports
            </CRMButton>
            <CRMButton
              onClick={handleSendMorningBrief}
              variant="secondary"
              disabled={sendingBrief}
              loading={sendingBrief}
              className="shadow-sm"
            >
              {!sendingBrief && (
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
              )}
              {sendingBrief ? "Sending..." : "Send Brief"}
            </CRMButton>

            <CRMButton
              onClick={() => setShowCreateModal(true)}
              variant="primary"
              className="shadow-md hover:shadow-lg transition-shadow"
            >
              <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Lead
            </CRMButton>
          </div>
        </div>

        {/* Filter Bar - made slightly more compact via its component, but here we just render it */}
        <FilterBar filters={filters} setFilters={setFilters} />

        {/* Loss Prevention Bar */}
        <LossPreventionBar />
      </div>

        {/* Kanban Board Container - horizontal scroll */}
        <div className="flex-1 min-h-[300px] overflow-x-auto overflow-y-hidden pb-2 px-2">
          <DragDropContext onDragEnd={handleDragEnd}>
            <div className="flex h-full gap-4 pb-2">
              {CRM_STAGES.map((stage) => {
                const stageInfo = stagesData[stage];
                const leads = stageInfo?.leads || [];
                
                return (
                <div
                  key={stage}
                  className="flex h-full w-[85vw] sm:w-[340px] flex-shrink-0 flex-col rounded-xl bg-gray-50/50 border border-gray-200 shadow-sm backdrop-blur-xl"
                >
                  {/* Column Header */}
                  <div className={`flex items-center justify-between p-4 border-b border-gray-100 rounded-t-xl ${STAGE_COLORS[stage].split(' ')[0]}`}>
                    <div className="flex items-center gap-2">
                         <div className={`h-2 w-2 rounded-full ${STAGE_COLORS[stage].split(' ')[0].replace('bg-', 'bg-').replace('-50', '-400')}`}></div>
                        <h3 className="font-semibold text-gray-900 text-sm">{stage}</h3>
                    </div>
                    <span className="flex items-center justify-center bg-white px-2 py-0.5 rounded-full text-xs font-bold text-gray-600 shadow-sm border border-gray-100">
                      {leads.length}
                    </span>
                  </div>

                  {/* Scrollable Droppable Area */}
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`flex-1 overflow-y-auto space-y-3 p-3 transition-colors scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent ${
                          snapshot.isDraggingOver
                            ? "bg-blue-50/30"
                            : ""
                        }`}
                      >
                        {leads.map((lead, index) => (
                          <Draggable
                            key={lead.id || lead._id}
                            draggableId={lead.id || lead._id}
                            index={index}
                          >
                            {(provided, snapshot) => (
                              <div
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                style={{
                                  ...provided.draggableProps.style,
                                  opacity: snapshot.isDragging ? 0.9 : 1,
                                  transform: snapshot.isDragging ? provided.draggableProps.style.transform + " scale(1.02)" : provided.draggableProps.style.transform,
                                }}
                                className="transition-transform"
                              >
                                <LeadCard
                                  lead={lead}
                                  onClick={() => handleLeadClick(lead)}
                                  onStageUpdate={handleStageUpdate}
                                  onUpdate={handleUpdateLead}
                                  onArchive={handleArchiveLead}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        
                         {/* Load More Button */}
                        {stageInfo.hasMore && (
                            <button
                                onClick={() => handleLoadMore(stage)}
                                disabled={stageInfo.loading}
                                className="mt-2 w-full rounded-lg border border-gray-200 bg-white py-2 text-xs font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700 transition-colors"
                            >
                                {stageInfo.loading ? (
                                <span className="loading loading-spinner loading-xs"></span>
                                ) : (
                                "Load More Leads"
                                )}
                            </button>
                        )}
                      </div>
                    )}
                  </Droppable>
                </div>
              );
              })}

              {/* Finished Column (Archived Leads) */}
               <div className="flex h-full w-[85vw] sm:w-[340px] flex-shrink-0 flex-col rounded-xl bg-gray-100/50 border border-gray-200 shadow-sm backdrop-blur-xl opacity-90">
                 <div className="flex items-center justify-between p-4 border-b border-gray-200 rounded-t-xl bg-gray-100">
                    <div className="flex items-center gap-2">
                         <button
                            onClick={() => setIsFinishedColumnCollapsed(!isFinishedColumnCollapsed)}
                            className="text-gray-500 hover:text-gray-700 transition-colors"
                        >
                            {isFinishedColumnCollapsed ? (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                            ) : (
                                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                            )}
                         </button>
                        <h3 className="font-semibold text-gray-600 text-sm">Archived</h3>
                    </div>
                     <span className="flex items-center justify-center bg-gray-200 px-2 py-0.5 rounded-full text-xs font-bold text-gray-500 border border-gray-300">
                      {archivedLeads.length}
                    </span>
                 </div>

                {!isFinishedColumnCollapsed && (
                    <div className="flex-1 overflow-y-auto space-y-3 p-3 scrollbar-thin scrollbar-thumb-gray-200 scrollbar-track-transparent">
                        {archivedLeads.map((lead) => (
                        <ArchivedLeadCard
                            key={lead.id || lead._id}
                            lead={lead}
                            onClick={() => handleLeadClick(lead)}
                            onUnarchive={handleUnarchiveLead}
                        />
                        ))}
                         {archivedLeads.length === 0 && (
                            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
                                <svg className="h-12 w-12 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" /></svg>
                                <span className="text-sm">No archived leads</span>
                            </div>
                        )}
                    </div>
                )}
               </div>
            </div>
          </DragDropContext>
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
            onRefresh={fetchAllStages}
          />
        )}
      </div>

  );
}
