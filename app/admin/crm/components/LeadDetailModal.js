"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import CRMButton from "@/components/CRMButton";

export default function LeadDetailModal({
  lead,
  onClose,
  onUpdate,
  onStageUpdate,
  onRefresh,
}) {
  // Helper function to get lead ID
  const getLeadId = () => lead?.id || lead?._id;
  const [activeTab, setActiveTab] = useState("overview");
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState(lead);
  const [activities, setActivities] = useState([]);
  const [notes, setNotes] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [admins, setAdmins] = useState([]);
  const [isPausingAging, setIsPausingAging] = useState(false);
  const [showPauseReasonModal, setShowPauseReasonModal] = useState(false);
  const [pauseReason, setPauseReason] = useState("");

  // Add state for showing add forms
  const [showAddNote, setShowAddNote] = useState(false);
  const [showAddTask, setShowAddTask] = useState(false);
  const [showAddActivity, setShowAddActivity] = useState(false);

  // Add state for new note/task/activity
  const [newNote, setNewNote] = useState({ title: "", content: "" });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    priority: "medium",
  });
  const [newActivity, setNewActivity] = useState({
    type: "call",
    title: "",
    description: "",
    contactMade: false,
    dueDate: "",
  });

  // Reply tracking state
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyData, setReplyData] = useState({
    replySubject: "",
    replyContent: "",
  });
  const [processingReply, setProcessingReply] = useState(false);
  const [processingResume, setProcessingResume] = useState(false);

  // Debugging logs
  useEffect(() => {
    console.log("Activities:", activities);
    console.log(
      "Activities with status:",
      activities.map((a) => ({
        id: a._id || a.id,
        title: a.title,
        status: a.status,
      })),
    );
    console.log("Notes:", notes);
    console.log("Tasks:", tasks);
  }, [activities, notes, tasks]);

  const fetchLeadDetails = useCallback(async () => {
    const leadId = lead?.id || lead?._id;
    if (!lead || !leadId) return;
    try {
      setLoading(true);
      const leadId = lead.id || lead._id;
      const [activitiesRes, notesRes, tasksRes] = await Promise.all([
        apiClient.get(`/crm/leads/${leadId}/activities`),
        apiClient.get(`/crm/leads/${leadId}/notes`),
        apiClient.get(`/crm/leads/${leadId}/tasks`),
      ]);

      setActivities(activitiesRes.activities || []);
      setNotes(notesRes.notes || []);
      setTasks(tasksRes.tasks || []);
    } catch (error) {
      console.error("Error fetching lead details:", error);
    } finally {
      setLoading(false);
    }
  }, [lead]);

  useEffect(() => {
    const leadId = lead?.id || lead?._id;
    if (lead && leadId) {
      setFormData(lead);
      fetchLeadDetails();
      fetchAdmins();
    }
  }, [lead, fetchLeadDetails]);

  const fetchAdmins = async () => {
    try {
      const response = await apiClient.get("/admin/check-users");
      console.log("Full API response:", response);
      const adminUsers =
        response.users?.filter((user) => user.role === "admin") || [];
      console.log("Fetched admins:", adminUsers);
      console.log("All users from response:", response.users);
      setAdmins(adminUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    // Guard against invalid lead ID
    const leadId = lead.id || lead._id;
    if (!leadId) {
      toast.error("Invalid lead ID");
      return;
    }

    try {
      await onUpdate(leadId, formData);
      setEditing(false);
    } catch (error) {
      console.error("Error updating lead:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const tabs = [
    { id: "overview", label: "Overview", icon: "📋" },
    { id: "activities", label: "Activities", icon: "📞" },
    { id: "notes", label: "Notes", icon: "📝" },
    { id: "tasks", label: "Tasks", icon: "✅" },
    { id: "history", label: "History", icon: "🕒" },
  ];

  // Add Note handler
  const handleAddNote = async () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;
    try {
      await apiClient.post(`/crm/leads/${getLeadId()}/notes`, newNote);
      setNewNote({ title: "", content: "" });
      setShowAddNote(false);
      fetchLeadDetails();
    } catch (e) {
      toast.error("Failed to add note");
    }
  };

  // Add Task handler
  const handleAddTask = async () => {
    if (!newTask.title.trim()) return;
    try {
      await apiClient.post(`/crm/leads/${getLeadId()}/tasks`, newTask);
      setNewTask({ title: "", description: "", priority: "medium" });
      setShowAddTask(false);
      fetchLeadDetails();
    } catch (e) {
      toast.error("Failed to add task");
    }
  };

  // Add Activity handler
  const handleAddActivity = async () => {
    if (!newActivity.title.trim()) return;
    try {
      await apiClient.post(`/crm/leads/${getLeadId()}/activities`, newActivity);
      setNewActivity({
        type: "call",
        title: "",
        description: "",
        contactMade: false,
        dueDate: "",
      });
      setShowAddActivity(false);
      fetchLeadDetails();
    } catch (e) {
      toast.error("Failed to add activity");
    }
  };

  const handleAgingPauseToggle = async () => {
    if (!getLeadId()) return;

    if (lead.agingPaused) {
      // Resuming aging - no reason needed
      await performAgingToggle(null);
    } else {
      // Pausing aging - show reason modal
      setShowPauseReasonModal(true);
    }
  };

  const performAgingToggle = async (reason) => {
    setIsPausingAging(true);
    try {
      const response = await apiClient.post(
        `/crm/leads/${getLeadId()}/aging-pause`,
        {
          reason: reason || undefined,
        },
      );

      // Update the lead data
      if (onUpdate) {
        await onUpdate(getLeadId(), {
          agingPaused: response.lead.agingPaused,
          agingPausedAt: response.lead.agingPausedAt,
          agingPausedReason: response.lead.agingPausedReason,
          agingDays: response.lead.agingDays,
        });
      }

      toast.success(response.message);
    } catch (error) {
      console.error("Error toggling aging pause:", error);
      toast.error("Failed to toggle aging pause");
    } finally {
      setIsPausingAging(false);
      setShowPauseReasonModal(false);
      setPauseReason("");
    }
  };

  const handlePauseReasonSubmit = async () => {
    await performAgingToggle(pauseReason);
  };

  const handleMarkTaskDone = async (taskId) => {
    console.log("Marking task as done:", taskId);
    try {
      const response = await apiClient.patch(
        `/crm/leads/${getLeadId()}/tasks/${taskId}`,
        {
          status: "completed",
        },
      );
      console.log("Task update response:", response);
      fetchLeadDetails();
    } catch (e) {
      console.error("Error marking task as done:", e);
      toast.error("Failed to mark task as done");
    }
  };

  const handleDeleteLead = async () => {
    if (
      !confirm(
        "Are you sure you want to delete this lead? This action cannot be undone.",
      )
    )
      return;

    try {
      await apiClient.delete(`/crm/leads/${getLeadId()}`);
      toast.success("Lead deleted successfully");
      onClose();
      // Trigger a refresh of the leads list
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error("Error deleting lead:", error);
      toast.error("Failed to delete lead");
    }
  };

  const handleMarkActivityDone = async (activityId) => {
    console.log("Marking activity as done:", activityId);
    try {
      const response = await apiClient.patch(
        `/crm/leads/${getLeadId()}/activities/${activityId}`,
        {
          status: "done",
        },
      );
      console.log("Activity update response:", response);
      console.log("Updated activity from response:", response.activity);
      console.log("Activity status from response:", response.activity?.status);
      fetchLeadDetails();
    } catch (e) {
      console.error("Error marking activity as done:", e);
      toast.error("Failed to mark activity as done");
    }
  };

  const handleLeadReply = async () => {
    try {
      setProcessingReply(true);

      const response = await apiClient.post(`/crm/leads/${getLeadId()}/reply`, {
        replySubject: replyData.replySubject,
        replyContent: replyData.replyContent,
      });

      toast.success("Lead reply processed successfully!");

      // Reset form and close modal
      setReplyData({ replySubject: "", replyContent: "" });
      setShowReplyModal(false);

      // Refresh lead details
      fetchLeadDetails();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error processing lead reply:", error);
      toast.error(
        error.response?.data?.error || "Failed to process lead reply",
      );
    } finally {
      setProcessingReply(false);
    }
  };

  const handleResumeAutomation = async () => {
    try {
      setProcessingResume(true);

      const response = await apiClient.post(
        `/crm/leads/${getLeadId()}/resume-automation`,
        {
          reason: "Manual resume by admin",
        },
      );

      toast.success("Email automation resumed successfully!");

      // Refresh lead details
      fetchLeadDetails();
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error("Error resuming automation:", error);
      toast.error(error.response?.data?.error || "Failed to resume automation");
    } finally {
      setProcessingResume(false);
    }
  };
  
 return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="relative flex h-full max-h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5">
        
        {/* Header - Glassmorphic */}
        <div className="flex-none border-b border-gray-100 bg-white/80 backdrop-blur-md p-6">
          <div className="flex items-start justify-between gap-4">
             <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 mb-1">
                    <h2 className="text-2xl font-bold text-gray-900 truncate">{lead.name}</h2>
                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-800">
                         {lead.stage}
                    </span>
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-500">
                     <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        {lead.email}
                     </span>
                     {lead.phone && (
                        <span className="flex items-center gap-1.5">
                            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                            {lead.phone}
                        </span>
                     )}
                     <span className="flex items-center gap-1.5">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                        Last updated {new Date(lead.updatedAt).toLocaleDateString('en-GB')}
                     </span>
                </div>
             </div>

             <div className="flex items-center gap-2">
                  <CRMButton
                    onClick={() => setEditing(!editing)}
                    variant="outline"
                    className="flex h-8 items-center gap-2 border-gray-200 hover:bg-gray-100 text-xs font-medium px-3"
                  >
                    <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                    {editing ? "Done" : "Edit"}
                  </CRMButton>
                  <CRMButton
                    onClick={onClose}
                    variant="outline"
                    className="flex h-8 w-8 items-center justify-center rounded-full p-0 border-gray-200 hover:bg-gray-100"
                    aria-label="Close"
                  >
                    <span className="text-xl leading-none text-gray-500">×</span>
                  </CRMButton>
             </div>
          </div>
          
           {/* Tabs */}
          <div className="mt-6 flex space-x-1 rounded-xl bg-gray-100/50 p-1">
             {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-medium leading-5 transition-all
                        ${activeTab === tab.id 
                            ? 'bg-white shadow text-blue-700' 
                            : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
                        }`}
                >
                    <span className="text-lg">{tab.icon}</span>
                    {tab.label}
                </button>
             ))}
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30 p-6">
           {activeTab === "overview" && (
             <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6">
                {/* Main Info Column */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Basic Info Card */}
                    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-900">Lead Information</h3>

                        </div>
                         
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name</label>
                                {editing ? (
                                    <input type="text" value={formData.name} onChange={(e) => handleInputChange("name", e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                ) : (
                                    <p className="text-gray-900 font-medium">{lead.name}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email</label>
                                {editing ? (
                                    <input type="email" value={formData.email} onChange={(e) => handleInputChange("email", e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                ) : (
                                    <p className="text-gray-900 font-medium">{lead.email}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                                {editing ? (
                                    <input type="tel" value={formData.phone} onChange={(e) => handleInputChange("phone", e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                ) : (
                                    <p className="text-gray-900 font-medium">{lead.phone || "—"}</p>
                                )}
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</label>
                                {editing ? (
                                    <select value={formData.stage} onChange={(e) => handleInputChange("stage", e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                        <option value="Lead">Lead</option>
                                        <option value="Never replied">Never replied</option>
                                        <option value="Qualified">Qualified</option>
                                        <option value="Proposal Sent">Proposal Sent</option>
                                        <option value="Negotiations">Negotiations</option>
                                        <option value="Won">Won</option>
                                        <option value="Lost">Lost</option>
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-2">
                                        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium bg-gray-100 text-gray-800`}>
                                            {lead.stage}
                                        </span>
                                    </div>
                                )}
                            </div>
                             <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
                                {editing ? (
                                    <input type="text" value={formData.address} onChange={(e) => handleInputChange("address", e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                                ) : (
                                    <p className="text-gray-900 font-medium">{lead.address || "—"}</p>
                                )}
                            </div>
                        </div>
                        {editing && (
                            <div className="mt-6 flex justify-end">
                                <CRMButton onClick={handleSave} variant="primary">Save Changes</CRMButton>
                            </div>
                        )}
                    </section>
                    
                    {/* Project & Financials */}
                    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                        <h3 className="text-lg font-bold text-gray-900 mb-4">Project & Financials</h3>
                         <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Potential Value</label>
                                {editing ? (
                                    <div className="relative rounded-md shadow-sm">
                                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                          <span className="text-gray-500 sm:text-sm">£</span>
                                        </div>
                                        <input
                                          type="number"
                                          value={formData.value}
                                          onChange={(e) => handleInputChange("value", e.target.value)}
                                          className="block w-full rounded-lg border-gray-300 pl-7 focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                          placeholder="0.00"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-900 font-medium text-lg">{formatCurrency(lead.value)}</p>
                                )}
                            </div>

                             <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget Range</label>
                                {editing ? (
                                    <select value={formData.budget} onChange={(e) => handleInputChange("budget", e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                      <option value="£">£ (0-10k)</option>
                                      <option value="££">££ (10k-25k)</option>
                                      <option value="£££">£££ (25k-50k)</option>
                                      <option value="££££">££££ (50k+)</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-900 font-medium">{lead.budget}</p>
                                )}
                            </div>
                            
                            <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Health</label>
                                {editing ? (
                                    <select value={formData.clientHealth} onChange={(e) => handleInputChange("clientHealth", e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                      <option value="Unknown">Unknown</option>
                                      <option value="Excellent">Excellent</option>
                                      <option value="Good">Good</option>
                                      <option value="Fair">Fair</option>
                                      <option value="Poor">Poor</option>
                                    </select>
                                ) : (
                                    <span className={`inline-flex items-center rounded-md px-2 py-1 text-sm font-medium ring-1 ring-inset ${
                                        lead.clientHealth === 'Excellent' ? 'bg-green-50 text-green-700 ring-green-600/20' :
                                        lead.clientHealth === 'Good' ? 'bg-blue-50 text-blue-700 ring-blue-600/20' :
                                        lead.clientHealth === 'Fair' ? 'bg-yellow-50 text-yellow-700 ring-yellow-600/20' :
                                        'bg-gray-50 text-gray-600 ring-gray-500/10'
                                    }`}>
                                        {lead.clientHealth}
                                    </span>
                                )}
                            </div>
                            
                             <div className="space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</label>
                                {editing ? (
                                    <select value={formData.source} onChange={(e) => handleInputChange("source", e.target.value)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                        <option value="Other">Other</option>
                                        <option value="Houzz">Houzz</option>
                                        <option value="MyBuilder">MyBuilder</option>
                                        <option value="Recommendation">Recommendation</option>
                                        <option value="Google">Google</option>
                                        <option value="Meta Ads">Meta Ads</option>
                                        <option value="Google Ads">Google Ads</option>
                                        <option value="Referral">Referral</option>
                                    </select>
                                ) : (
                                    <p className="text-gray-900 font-medium">
                                        {lead.source === "Other" && lead.customSource ? lead.customSource : lead.source}
                                    </p>
                                )}
                                {editing && formData.source === "Other" && (
                                     <input
                                        type="text"
                                        value={formData.customSource || ""}
                                        onChange={(e) => handleInputChange("customSource", e.target.value)}
                                        className="mt-2 w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                        placeholder="Specific source..."
                                     />
                                )}
                            </div>
                             <div className="md:col-span-2 space-y-1">
                                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Project Types</label>
                                <div className="flex flex-wrap gap-2">
                                  {lead.projectTypes?.map((type, index) => (
                                    <span key={index} className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                      {type}
                                    </span>
                                  ))}
                                  {lead.customProjectType && (
                                     <span className="inline-flex items-center rounded-md bg-purple-50 px-2 py-1 text-xs font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
                                      {lead.customProjectType}
                                    </span>
                                  )}
                                  {(!lead.projectTypes?.length && !lead.customProjectType) && (
                                    <span className="text-sm text-gray-400 italic">No types selected</span>
                                  )}
                                </div>
                                {editing && (
                                    <div className="mt-3 space-y-2">
                                    <div className="grid grid-cols-2 gap-2">
                                        {["Bathroom renovation", "Kitchen renovation", "Extension", "Home renovation", "Loft Conversion", "Commercial"].map((type) => (
                                            <label key={type} className="flex items-center gap-2 text-xs">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.projectTypes?.includes(type)}
                                                    onChange={(e) => {
                                                        const current = formData.projectTypes || [];
                                                        const updated = e.target.checked 
                                                            ? [...current, type]
                                                            : current.filter(t => t !== type);
                                                        handleInputChange("projectTypes", updated);
                                                    }}
                                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-3.5 w-3.5"
                                                />
                                                <span className="text-gray-700">{type}</span>
                                            </label>
                                        ))}
                                    </div>
                                    <div className="mt-2">
                                        <input
                                            type="text"
                                            value={formData.customProjectType || ""}
                                            onChange={(e) => handleInputChange("customProjectType", e.target.value)}
                                            className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                                            placeholder="Other project type..."
                                        />
                                    </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </section>
                </div>
                
                {/* Secondary Column */}
                <div className="space-y-6">
                    {/* Assignment Card */}
                    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                         <h3 className="text-lg font-bold text-gray-900 mb-4">Assignment</h3>
                         <div className="space-y-4">
                            <div>
                                <label className="label pt-0"><span className="label-text font-medium text-gray-600">Assigned Agent</span></label>
                                {editing ? (
                                    <select value={formData.assignedTo || ""} onChange={(e) => handleInputChange("assignedTo", e.target.value || null)} className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                                        <option value="">Unassigned</option>
                                        {admins.map((admin) => (
                                            <option key={admin.id} value={admin.id}>{admin.name || admin.email}</option>
                                        ))}
                                    </select>
                                ) : (
                                    <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-200">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-white text-xs font-bold">
                                            {lead.assignedTo?.name?.charAt(0) || "?"}
                                        </div>
                                        <span className="font-medium text-gray-900">{lead.assignedTo?.name || "Unassigned"}</span>
                                    </div>
                                )}
                            </div>
                            
                            {lead.linkedUser && (
                                <div>
                                    <label className="label"><span className="label-text font-medium text-gray-600">Linked User Account</span></label>
                                    <a href={`/admin/users/${lead.linkedUser.id}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg bg-green-50 border border-green-200 hover:bg-green-100 transition-colors group">
                                         <div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-600 text-white text-xs font-bold group-hover:scale-110 transition-transform">
                                            👤
                                        </div>
                                        <span className="font-medium text-green-700">{lead.linkedUser.name || lead.linkedUser.email}</span>
                                    </a>
                                </div>
                            )}
                         </div>
                    </section>
                    
                    {/* Aging Status */}
                    <section className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
                         <div className="flex items-center justify-between mb-2">
                             <h3 className="text-lg font-bold text-gray-900">Lead Aging</h3>
                             {lead.agingDays > 7 && <span className="badge badge-error badge-sm">At Risk</span>}
                         </div>
                         <div className="text-center py-4">
                             <div className="text-4xl font-bold text-gray-900 mb-1">{lead.agingDays}</div>
                             <div className="text-sm text-gray-500 mb-4">days inactive</div>
                             
                              <div className="flex flex-col items-center gap-2">
                                   {lead.agingPaused ? (
                                        <div className="w-full bg-yellow-50 text-yellow-800 p-3 rounded-lg text-sm mb-2 border border-yellow-200">
                                            <p className="font-semibold">⏸️ Aging Paused</p>
                                            <p className="opacity-80 mt-1">{lead.agingPausedReason}</p>
                                        </div>
                                   ) : (
                                       <div className="text-xs text-gray-400 mb-2">Timer is active</div>
                                   )}
                                   
                                   <CRMButton onClick={handleAgingPauseToggle} disabled={isPausingAging} variant="outline" size="sm" className="w-full">
                                    {isPausingAging ? <span className="loading loading-spinner loading-xs"></span> : (lead.agingPaused ? "Resume Timer" : "Pause Timer")}
                                   </CRMButton>
                              </div>
                         </div>
                         
                         {/* Email Automation Status */}
                        {lead.emailAutomation && (
                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <h4 className="text-sm font-semibold text-gray-900 mb-3">Email Automation</h4>
                                <div className={`p-3 rounded-lg border ${lead.emailAutomation.isActive ? 'bg-green-50 border-green-200' : 'bg-gray-50 border-gray-200'}`}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <div className={`h-2.5 w-2.5 rounded-full ${lead.emailAutomation.isActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                                        <span className={`text-sm font-medium ${lead.emailAutomation.isActive ? 'text-green-700' : 'text-gray-600'}`}>
                                            {lead.emailAutomation.isActive ? 'Active' : 'Paused'}
                                        </span>
                                    </div>
                                    {!lead.emailAutomation.isActive && (
                                        <p className="text-xs text-gray-500 mb-2">{lead.emailAutomation.pausedReason}</p>
                                    )}
                                     {(lead.emailAutomation?.leadReplied || (!lead.emailAutomation.isActive)) && (
                                        <button 
                                            onClick={handleResumeAutomation} 
                                            disabled={processingResume}
                                            className="text-xs font-semibold text-blue-600 hover:text-blue-800 hover:underline disabled:opacity-50"
                                        >
                                            {processingResume ? "Resuming..." : "Force Resume Workflow"}
                                        </button>
                                     )}
                                </div>
                            </div>
                        )}
                    </section>
                    
                    {/* Delete Danger Zone */}
                    <div className="pt-4">
                         <button onClick={handleDeleteLead} className="w-full rounded-xl border border-red-200 bg-white px-4 py-3 text-sm font-medium text-red-600 hover:bg-red-50 hover:border-red-300 transition-colors">
                            🗑️ Delete Lead
                        </button>
                    </div>
                </div>
             </div>
           )}
           
           {/* ACTIVITIES TAB */}
           {activeTab === "activities" && (
             <div className="space-y-6">
               <div className="flex items-center justify-between">
                 <h3 className="text-lg font-bold text-gray-900">Activity Timeline</h3>
                 <div className="flex gap-2">
                   <CRMButton size="sm" onClick={() => setShowAddActivity(v => !v)}>
                     {showAddActivity ? "Cancel" : "+ Log Activity"}
                   </CRMButton>
                    <CRMButton size="sm" variant="secondary" onClick={() => setShowReplyModal(true)}>
                     📧 Log Reply
                   </CRMButton>
                 </div>
               </div>
               
               {showAddActivity && (
                 <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 animate-in slide-in-from-top-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                             <label className="block text-xs font-medium text-gray-700 mb-1">Type</label>
                             <select value={newActivity.type} onChange={(e) => setNewActivity(a => ({...a, type: e.target.value}))} className="w-full rounded-lg border-gray-300 text-sm">
                                <option value="call">📞 Call</option>
                                <option value="email">📧 Email</option>
                                <option value="site_visit">🏠 Site Visit</option>
                                <option value="meeting">🤝 Meeting</option>
                                <option value="note">📝 Note</option>
                             </select>
                        </div>
                         <div>
                             <label className="block text-xs font-medium text-gray-700 mb-1">Title</label>
                             <input type="text" value={newActivity.title} onChange={(e) => setNewActivity(a => ({...a, title: e.target.value}))} className="w-full rounded-lg border-gray-300 text-sm" placeholder="e.g. Initial consultation" />
                        </div>
                    </div>
                     <div className="mb-4">
                         <label className="block text-xs font-medium text-gray-700 mb-1">Description</label>
                         <textarea value={newActivity.description} onChange={(e) => setNewActivity(a => ({...a, description: e.target.value}))} className="w-full rounded-lg border-gray-300 text-sm" rows={2} placeholder="Details about the activity..."></textarea>
                    </div>
                     <div className="flex justify-end gap-2">
                         <CRMButton size="sm" variant="primary" onClick={handleAddActivity}>Save Activity</CRMButton>
                    </div>
                 </div>
               )}

               <div className="relative border-l-2 border-gray-200 ml-3 space-y-8 pl-6 pb-2">
                 {activities.map((activity, idx) => (
                    <div key={idx} className="relative">
                         <div className="absolute -left-[31px] bg-white rounded-full border-2 border-gray-200 p-1">
                             <span className="text-lg leading-none block">
                                 {activity.type === 'call' ? '📞' : activity.type === 'email' ? '📧' : activity.type === 'site_visit' ? '🏠' : '📝'}
                             </span>
                         </div>
                         <div className="rounded-lg border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-shadow">
                             <div className="flex justify-between items-start mb-1">
                                 <h4 className="font-semibold text-gray-900">{activity.title}</h4>
                                 <span className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleString('en-GB')}</span>
                             </div>
                             <p className="text-sm text-gray-600 whitespace-pre-wrap">{activity.description}</p>
                             <div className="mt-2 flex items-center gap-2">
                                <span className={`text-xs px-2 py-0.5 rounded-full ${activity.status === 'done' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {activity.status || 'Active'}
                                </span>
                                {(activity.status !== 'done') && (
                                     <button onClick={() => handleMarkActivityDone(activity._id || activity.id)} className="text-xs text-blue-600 hover:underline">Mark Done</button>
                                )}
                             </div>
                         </div>
                    </div>
                 ))}
                 {activities.length === 0 && <div className="text-gray-500 italic text-sm">No activities recorded yet.</div>}
               </div>
             </div>
           )}

           {/* NOTES TAB */}
           {activeTab === "notes" && (
             <div className="space-y-4">
                <div className="flex gap-2 mb-4">
                     <input type="text" value={newNote.content} onChange={(e) => setNewNote(n => ({...n, content: e.target.value, title: "Note" }))} className="flex-1 rounded-lg border-gray-300 shadow-sm text-sm" placeholder="Add a quick note..." />
                     <CRMButton onClick={handleAddNote} disabled={!newNote.content.trim()}>Add</CRMButton>
                </div>
                <div className="grid gap-4">
                     {notes.map((note, idx) => (
                         <div key={idx} className="bg-yellow-50/50 p-4 rounded-xl border border-yellow-100/50 relative group">
                             <p className="text-gray-800 text-sm whitespace-pre-wrap">{note.content}</p>
                              <div className="mt-2 flex items-center gap-2 text-xs text-gray-500">
                                  <span>{new Date(note.createdAt).toLocaleString('en-GB')}</span>
                                  <span>•</span>
                                  <span className="font-medium text-gray-700">{note.createdBy?.name || "Admin"}</span>
                              </div>
                         </div>
                     ))}
                     {notes.length === 0 && <div className="text-center py-8 text-gray-500">No notes yet.</div>}
                </div>
             </div>
           )}
           
           {/* TASKS TAB */}
           {activeTab === "tasks" && (
                <div className="space-y-4">
                   <div className="flex justify-between items-center">
                       <h3 className="font-bold">Tasks</h3>
                       <button onClick={() => setShowAddTask(v => !v)} className="text-sm text-blue-600 hover:underline">+ New Task</button>
                   </div>
                   
                   {showAddTask && (
                       <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 space-y-3">
                           <input type="text" placeholder="Task title" value={newTask.title} onChange={(e) => setNewTask(t => ({...t, title: e.target.value}))} className="w-full rounded-lg border-gray-300 text-sm" />
                           <select value={newTask.priority} onChange={(e) => setNewTask(t => ({...t, priority: e.target.value}))} className="w-full rounded-lg border-gray-300 text-sm">
                               <option value="low">Low Priority</option>
                               <option value="medium">Medium Priority</option>
                               <option value="high">High Priority</option>
                           </select>
                           <CRMButton size="sm" onClick={handleAddTask}>Create Task</CRMButton>
                       </div>
                   )}
                   
                   <div className="space-y-2">
                       {tasks.map((task, idx) => (
                           <div key={idx} className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 bg-white shadow-sm">
                               <input type="checkbox" checked={task.status === "completed"} onChange={() => handleMarkTaskDone(task._id || task.id)} className="checkbox checkbox-sm checkbox-primary" />
                               <div className="flex-1">
                                   <p className={`font-medium text-sm ${task.status === "completed" ? "line-through text-gray-400" : "text-gray-900"}`}>{task.title}</p>
                                   <span className={`text-xs px-1.5 py-0.5 rounded ${task.priority === 'high' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-600'}`}>{task.priority}</span>
                               </div>
                           </div>
                       ))}
                        {tasks.length === 0 && <div className="text-center py-8 text-gray-500">No tasks pending.</div>}
                   </div>
                </div>
           )}
           {/* HISTORY TAB */}
           {activeTab === "history" && (
            <div className="space-y-4">
              <h4 className="font-semibold text-gray-900">Version History</h4>
              {lead.versionHistory?.length === 0 ? (
                <p className="text-gray-500 text-sm">No changes recorded</p>
              ) : (
                <div className="space-y-3">
                  {lead.versionHistory?.map((change, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-gray-200 pl-4 py-1"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium text-sm text-gray-900">{change.field}</h5>
                        <span className="text-xs text-gray-400">
                          {formatDate(change.changedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        <span className="bg-red-50 text-red-600 px-1 rounded">{change.oldValue || 'Empty'}</span> 
                        <span className="mx-2">→</span>
                        <span className="bg-green-50 text-green-600 px-1 rounded">{change.newValue || 'Empty'}</span>
                      </p>
                      {change.comment && (
                        <p className="mt-1 text-xs text-gray-500 italic">
                          &quot;{change.comment}&quot;
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-1">
                        By: {change.changedBy?.name || change.changedBy?.email || "System"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
       {/* Other Modals (Pause Reason, Reply) */}
       {showPauseReasonModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
          <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Pause Aging Timer</h3>
             <textarea
                value={pauseReason}
                onChange={(e) => setPauseReason(e.target.value)}
                className="w-full rounded-lg border-gray-300 shadow-sm mb-4 text-sm"
                rows={3}
                placeholder="Reason for pausing..."
            ></textarea>
            <div className="flex justify-end gap-2">
                 <button onClick={() => setShowPauseReasonModal(false)} className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium">Cancel</button>
                 <button onClick={handlePauseReasonSubmit} className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors">Pause</button>
            </div>
          </div>
        </div>
       )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/20 backdrop-blur-sm p-4 animate-in fade-in zoom-in duration-200">
           <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl ring-1 ring-gray-900/5">
            <h3 className="mb-4 text-lg font-bold text-gray-900">Log Lead Reply</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                </label>
                <input
                  type="text"
                  value={replyData.replySubject}
                  onChange={(e) =>
                    setReplyData((prev) => ({
                      ...prev,
                      replySubject: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border-gray-300 shadow-sm text-sm"
                  placeholder="Re: Project inquiry"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Content Summary
                </label>
                <textarea
                  value={replyData.replyContent}
                  onChange={(e) =>
                    setReplyData((prev) => ({
                      ...prev,
                      replyContent: e.target.value,
                    }))
                  }
                  className="w-full rounded-lg border-gray-300 shadow-sm text-sm"
                  rows={4}
                  placeholder="Lead mentioned they are interested in..."
                ></textarea>
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setShowReplyModal(false)}
                className="px-4 py-2 text-sm text-gray-600 hover:bg-gray-100 rounded-lg font-medium"
                disabled={processingReply}
              >
                Cancel
              </button>
              <button
                onClick={handleLeadReply}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors"
                disabled={processingReply}
              >
                {processingReply ? "Processing..." : "Log Reply"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
