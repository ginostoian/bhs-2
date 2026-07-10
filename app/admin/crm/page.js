"use client";

import dynamic from "next/dynamic";
import { useDeferredValue, useMemo, useState } from "react";
import useSWR from "swr";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { Archive, BarChart3, CheckSquare2, Mail, Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import { CRM_STAGE_CONFIG, CRM_STAGES } from "@/libs/crmStages";
import CRMButton from "@/components/CRMButton";
import ArchivedLeadCard from "./components/ArchivedLeadCard";
import FilterBar from "./components/FilterBar";
import LeadCard from "./components/LeadCard";
import LossPreventionBar from "./components/LossPreventionBar";

const CreateLeadModal = dynamic(() => import("./components/CreateLeadModal"));
const LeadDetailModal = dynamic(() => import("./components/LeadDetailModal"));
const PAGE_SIZE = 20;

const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});
const initialPages = Object.fromEntries(CRM_STAGES.map((stage) => [stage, 1]));

const buildParams = (stage, page, filters) => {
  const params = new URLSearchParams({
    stage,
    page: String(page),
    limit: String(PAGE_SIZE),
  });
  for (const [key, value] of Object.entries(filters))
    if (value && key !== "view") params.set(key, value);
  if (["mine", "hot", "aging", "unassigned"].includes(filters.view))
    params.set("view", filters.view);
  return params;
};

const removeLead = (data, leadId) => {
  if (!data) return data;
  const stages = Object.fromEntries(
    Object.entries(data.stages).map(([stage, item]) => [
      stage,
      {
        ...item,
        leads: item.leads.filter((lead) => (lead.id || lead._id) !== leadId),
      },
    ]),
  );
  return { ...data, stages };
};

const moveLead = (data, leadId, targetStage, replacement) => {
  if (!data) return data;
  let moving = replacement;
  const stages = {};
  for (const [stage, item] of Object.entries(data.stages)) {
    const found = item.leads.find((lead) => (lead.id || lead._id) === leadId);
    if (found && !moving) moving = found;
    stages[stage] = {
      ...item,
      leads: item.leads.filter((lead) => (lead.id || lead._id) !== leadId),
    };
  }
  if (moving)
    stages[targetStage] = {
      ...stages[targetStage],
      leads: [{ ...moving, stage: targetStage }, ...stages[targetStage].leads],
    };
  return { ...data, stages };
};

export default function CRMPage() {
  const [filters, setFilters] = useState({
    search: "",
    assignedTo: "",
    source: "",
    projectType: "",
    view: "",
  });
  const [pages, setPages] = useState(initialPages);
  const [selectedIds, setSelectedIds] = useState(() => new Set());
  const [mobileStage, setMobileStage] = useState(CRM_STAGES[0]);
  const [selectedLead, setSelectedLead] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [sendingBrief, setSendingBrief] = useState(false);
  const deferredSearch = useDeferredValue(filters.search);
  const effectiveFilters = useMemo(
    () => ({ ...filters, search: deferredSearch }),
    [filters, deferredSearch],
  );
  const boardKey = useMemo(
    () => [
      "crm-board",
      JSON.stringify(effectiveFilters),
      JSON.stringify(pages),
    ],
    [effectiveFilters, pages],
  );

  const { data, error, isLoading, mutate } = useSWR(
    boardKey,
    async () => {
      const stageEntries = await Promise.all(
        CRM_STAGES.map(async (stage) => {
          const responses = await Promise.all(
            Array.from({ length: pages[stage] }, (_, index) =>
              apiClient.get(
                `/crm/leads/by-stage?${buildParams(stage, index + 1, effectiveFilters)}`,
              ),
            ),
          );
          return [
            stage,
            {
              leads: responses.flatMap((response) => response.leads || []),
              pagination: responses.at(-1)?.pagination,
              summary: responses[0]?.summary || { count: 0, totalValue: 0 },
            },
          ];
        }),
      );
      return { stages: Object.fromEntries(stageEntries) };
    },
    { keepPreviousData: true, revalidateOnFocus: false },
  );
  const { data: archivedData, mutate: mutateArchived } = useSWR(
    "/crm/leads/archived",
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );
  const { data: viewsData, mutate: mutateViews } = useSWR(
    "/crm/views",
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );

  const total = useMemo(
    () =>
      CRM_STAGES.reduce(
        (sum, stage) => sum + (data?.stages?.[stage]?.summary?.count || 0),
        0,
      ),
    [data],
  );
  const totalValue = useMemo(
    () =>
      CRM_STAGES.reduce(
        (sum, stage) => sum + (data?.stages?.[stage]?.summary?.totalValue || 0),
        0,
      ),
    [data],
  );

  const refresh = () => Promise.all([mutate(), mutateArchived()]);
  const selectLead = (leadId, selected) =>
    setSelectedIds((current) => {
      const next = new Set(current);
      if (selected) next.add(leadId);
      else next.delete(leadId);
      return next;
    });

  const updateStage = async (leadId, stage, comment) => {
    mutate((current) => moveLead(current, leadId, stage), false);
    try {
      const response = await apiClient.put(`/crm/leads/${leadId}/stage`, {
        stage,
        comment,
      });
      mutate(
        (current) => moveLead(current, leadId, stage, response.lead),
        false,
      );
      if ((selectedLead?.id || selectedLead?._id) === leadId)
        setSelectedLead(response.lead);
      toast.success(`Moved to ${stage}`);
    } catch (requestError) {
      await mutate();
      toast.error("Could not move lead");
      throw requestError;
    }
  };

  const updateLead = async (leadId, updates) => {
    const response = await apiClient.put(`/crm/leads/${leadId}`, updates);
    mutate(
      (current) =>
        moveLead(current, leadId, response.lead.stage, response.lead),
      false,
    );
    setSelectedLead(response.lead);
    toast.success("Lead updated");
    return response.lead;
  };

  const createLead = async (leadData) => {
    const response = await apiClient.post("/crm/leads", leadData);
    mutate(
      (current) =>
        moveLead(
          current,
          response.lead.id || response.lead._id,
          response.lead.stage,
          response.lead,
        ),
      false,
    );
    setShowCreate(false);
    toast.success("Lead created");
  };

  const archiveLead = async (leadId) => {
    await apiClient.post(`/crm/leads/${leadId}/archive`);
    mutate((current) => removeLead(current, leadId), false);
    await mutateArchived();
    toast.success("Lead archived");
  };

  const unarchiveLead = async (leadId) => {
    await apiClient.delete(`/crm/leads/${leadId}/archive`);
    await refresh();
    toast.success("Lead restored");
  };

  const runBulkAction = async (action) => {
    const leadIds = [...selectedIds];
    let value;
    if (action === "stage")
      value = window.prompt(
        `Move selected leads to:\n${CRM_STAGES.join("\n")}`,
      );
    if (action === "assign") value = window.prompt("Paste the owner user ID");
    if (action === "tag") value = window.prompt("Tag to add");
    if (["stage", "assign", "tag"].includes(action) && !value) return;
    await apiClient.post("/crm/leads/bulk", { leadIds, action, value });
    setSelectedIds(new Set());
    await refresh();
    toast.success(`${leadIds.length} leads updated`);
  };

  const saveView = async () => {
    const name = window.prompt("Name this saved view");
    if (!name) return;
    await apiClient.post("/crm/views", {
      name,
      filters: { ...filters, view: "" },
    });
    await mutateViews();
    toast.success("View saved");
  };

  const sendBrief = async () => {
    setSendingBrief(true);
    try {
      await apiClient.post("/crm/morning-brief");
      toast.success("Morning brief sent");
    } catch {
      toast.error("Could not send morning brief");
    } finally {
      setSendingBrief(false);
    }
  };

  const onDragEnd = async ({ destination, source, draggableId }) => {
    if (!destination || destination.droppableId === source.droppableId) return;
    await updateStage(
      draggableId,
      destination.droppableId,
      `Moved from ${source.droppableId} by drag and drop`,
    );
  };

  if (error)
    return (
      <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-rose-800">
        The CRM board could not be loaded.{" "}
        <button onClick={() => mutate()} className="font-semibold underline">
          Try again
        </button>
      </div>
    );

  return (
    <div className="flex h-[calc(100dvh-4rem)] min-h-[680px] w-full flex-col overflow-hidden bg-slate-50 text-slate-950 md:max-w-[calc(100vw-22rem)]">
      <header className="flex-none border-b border-slate-200 bg-white px-4 py-4 sm:px-6">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              CRM Pipeline
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage enquiries, next actions and revenue
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <CRMButton href="/admin/crm/tasks" variant="outline">
              <CheckSquare2 className="mr-2 h-4 w-4" />
              My tasks
            </CRMButton>
            <CRMButton href="/admin/crm/reports" variant="outline">
              <BarChart3 className="mr-2 h-4 w-4" />
              Reports
            </CRMButton>
            <CRMButton
              onClick={sendBrief}
              variant="outline"
              disabled={sendingBrief}
            >
              <Mail className="mr-2 h-4 w-4" />
              {sendingBrief ? "Sending…" : "Send brief"}
            </CRMButton>
            <CRMButton onClick={() => setShowCreate(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add lead
            </CRMButton>
          </div>
        </div>
        <FilterBar
          filters={filters}
          setFilters={(next) => {
            setPages(initialPages);
            setFilters(next);
          }}
          views={viewsData?.views || []}
          onSaveView={saveView}
        />
        <div className="mt-3">
          <LossPreventionBar />
        </div>
      </header>

      {selectedIds.size ? (
        <div className="flex flex-none items-center gap-2 overflow-x-auto border-b border-blue-200 bg-blue-50 px-4 py-2.5 text-sm sm:px-6">
          <span className="whitespace-nowrap font-semibold text-blue-950">
            {selectedIds.size} selected
          </span>
          <button
            onClick={() => runBulkAction("stage")}
            className="rounded-md border border-blue-200 bg-white px-3 py-1.5 font-medium text-blue-900"
          >
            Change stage
          </button>
          <button
            onClick={() => runBulkAction("assign")}
            className="rounded-md border border-blue-200 bg-white px-3 py-1.5 font-medium text-blue-900"
          >
            Assign owner
          </button>
          <button
            onClick={() => runBulkAction("tag")}
            className="rounded-md border border-blue-200 bg-white px-3 py-1.5 font-medium text-blue-900"
          >
            Add tag
          </button>
          <button
            onClick={() => runBulkAction("archive")}
            className="rounded-md border border-blue-200 bg-white px-3 py-1.5 font-medium text-blue-900"
          >
            Archive
          </button>
          <button
            onClick={() => setSelectedIds(new Set())}
            className="ml-auto rounded p-1 text-blue-900"
            aria-label="Clear selection"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      ) : null}

      <div className="flex-none border-b border-slate-200 bg-white px-4 py-2 sm:hidden">
        <label className="sr-only" htmlFor="mobile-stage">
          Pipeline stage
        </label>
        <select
          id="mobile-stage"
          value={mobileStage}
          onChange={(event) => setMobileStage(event.target.value)}
          className="w-full rounded-lg border-slate-200 text-sm"
        >
          {CRM_STAGES.map((stage) => (
            <option key={stage}>{stage}</option>
          ))}
        </select>
      </div>

      <main className="min-h-0 flex-1 overflow-x-auto overflow-y-hidden p-3 sm:p-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex h-full gap-3">
            {CRM_STAGES.map((stage) => {
              const stageData = data?.stages?.[stage];
              const config = CRM_STAGE_CONFIG[stage];
              return (
                <section
                  key={stage}
                  className={`${mobileStage === stage ? "flex" : "hidden"} h-full w-full min-w-0 flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100/70 sm:flex sm:w-[285px] sm:min-w-[285px]`}
                  aria-labelledby={`stage-${config.order}`}
                >
                  <div className="border-b border-slate-200 bg-white px-3.5 py-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex min-w-0 items-center gap-2">
                        <span
                          className={`mt-1 h-2 w-2 shrink-0 rounded-full ${config.dotClass}`}
                        />
                        <h2
                          id={`stage-${config.order}`}
                          className="text-sm font-semibold leading-tight text-slate-900"
                        >
                          {stage}
                        </h2>
                      </div>
                      <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold text-slate-600">
                        {stageData?.summary?.count || 0}
                      </span>
                    </div>
                    <p className="mt-1.5 pl-4 text-xs font-medium text-slate-500">
                      {currency.format(stageData?.summary?.totalValue || 0)}
                    </p>
                  </div>
                  <Droppable droppableId={stage}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`min-h-0 flex-1 space-y-2.5 overflow-y-auto p-2.5 ${snapshot.isDraggingOver ? "bg-blue-50" : ""}`}
                      >
                        {isLoading && !stageData
                          ? Array.from({ length: 3 }, (_, index) => (
                              <div
                                key={index}
                                className="h-44 animate-pulse rounded-xl border border-slate-200 bg-white"
                              />
                            ))
                          : null}
                        {stageData?.leads?.map((lead, index) => (
                          <Draggable
                            key={lead.id || lead._id}
                            draggableId={lead.id || lead._id}
                            index={index}
                          >
                            {(drag) => (
                              <div
                                ref={drag.innerRef}
                                {...drag.draggableProps}
                                {...drag.dragHandleProps}
                              >
                                <LeadCard
                                  lead={lead}
                                  selected={selectedIds.has(
                                    lead.id || lead._id,
                                  )}
                                  onSelect={selectLead}
                                  onClick={() => setSelectedLead(lead)}
                                  onStageUpdate={updateStage}
                                />
                              </div>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                        {stageData && !stageData.leads.length ? (
                          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500">
                            No leads in this stage
                          </div>
                        ) : null}
                        {stageData?.pagination?.hasMore ? (
                          <button
                            onClick={() =>
                              setPages((current) => ({
                                ...current,
                                [stage]: current[stage] + 1,
                              }))
                            }
                            className="w-full rounded-lg border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600"
                          >
                            Load more
                          </button>
                        ) : null}
                      </div>
                    )}
                  </Droppable>
                </section>
              );
            })}

            <section className="hidden h-full w-[285px] min-w-[285px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-slate-100/70 sm:flex">
              <button
                onClick={() => setShowArchived((value) => !value)}
                className="flex items-center justify-between border-b border-slate-200 bg-white px-3.5 py-3 text-left"
              >
                <span className="flex items-center gap-2 text-sm font-semibold">
                  <Archive className="h-4 w-4 text-slate-500" />
                  Archived
                </span>
                <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-xs font-semibold">
                  {archivedData?.leads?.length || 0}
                </span>
              </button>
              {showArchived ? (
                <div className="min-h-0 flex-1 space-y-2.5 overflow-y-auto p-2.5">
                  {(archivedData?.leads || []).map((lead) => (
                    <ArchivedLeadCard
                      key={lead.id || lead._id}
                      lead={lead}
                      onClick={() => setSelectedLead(lead)}
                      onUnarchive={unarchiveLead}
                    />
                  ))}
                </div>
              ) : (
                <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-slate-400">
                  Archived leads are collapsed
                </div>
              )}
            </section>
          </div>
        </DragDropContext>
      </main>

      <footer className="flex flex-none items-center justify-between border-t border-slate-200 bg-white px-4 py-2 text-xs text-slate-500 sm:px-6">
        <span>Total leads: {total}</span>
        <span>Total pipeline: {currency.format(totalValue)}</span>
      </footer>
      {showCreate ? (
        <CreateLeadModal
          onClose={() => setShowCreate(false)}
          onSubmit={createLead}
        />
      ) : null}
      {selectedLead ? (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onUpdate={updateLead}
          onStageUpdate={updateStage}
          onRefresh={refresh}
        />
      ) : null}
    </div>
  );
}
