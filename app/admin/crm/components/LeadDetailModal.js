"use client";

import { useState, useEffect } from "react";
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

  useEffect(() => {
    const leadId = lead?.id || lead?._id;
    if (lead && leadId) {
      setFormData(lead);
      fetchLeadDetails();
      fetchAdmins();
    }
  }, [lead]);

  const fetchLeadDetails = async () => {
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
  };

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
    <div className="modal modal-open">
      <div className="modal-box max-h-[90vh] max-w-4xl overflow-hidden">
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-bold">Lead Details</h3>
          <CRMButton
            onClick={onClose}
            variant="outline"
            className="flex h-10 w-10 items-center justify-center rounded-full p-0"
            aria-label="Close"
          >
            <span className="text-2xl leading-none">✕</span>
          </CRMButton>
        </div>

        {/* Tabs */}
        <div className="tabs-bordered tabs mb-4 flex gap-2">
          {tabs.map((tab) => (
            <CRMButton
              key={tab.id}
              variant={activeTab === tab.id ? "primary" : "outline"}
              className={`tab flex items-center justify-center gap-2 rounded-md px-4 py-2 font-semibold ${activeTab === tab.id ? "tab-active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
              style={{
                minHeight: "40px",
                fontSize: "1.05rem",
                lineHeight: "1.2",
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </CRMButton>
          ))}
        </div>

        {/* Content */}
        <div className="max-h-[60vh] overflow-y-auto">
          {activeTab === "overview" && (
            <div className="space-y-4">
              {/* Basic Information */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Name</span>
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.name}</p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Email</span>
                  </label>
                  {editing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <p className="text-gray-900">{lead.email}</p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Phone</span>
                  </label>
                  {editing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {lead.phone || "Not provided"}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Address</span>
                  </label>
                  {editing ? (
                    <input
                      type="text"
                      value={formData.address}
                      onChange={(e) =>
                        handleInputChange("address", e.target.value)
                      }
                      className="input input-bordered w-full"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {lead.address || "Not provided"}
                    </p>
                  )}
                </div>
              </div>

              {/* Lead Classification */}
              <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Stage</span>
                  </label>
                  {editing ? (
                    <select
                      value={formData.stage}
                      onChange={(e) =>
                        handleInputChange("stage", e.target.value)
                      }
                      className="crm-select"
                    >
                      <option value="Lead">Lead</option>
                      <option value="Never replied">Never replied</option>
                      <option value="Qualified">Qualified</option>
                      <option value="Proposal Sent">Proposal Sent</option>
                      <option value="Negotiations">Negotiations</option>
                      <option value="Won">Won</option>
                      <option value="Lost">Lost</option>
                    </select>
                  ) : (
                    <span className="badge badge-primary">{lead.stage}</span>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Value</span>
                  </label>
                  {editing ? (
                    <input
                      type="number"
                      value={formData.value}
                      onChange={(e) =>
                        handleInputChange("value", e.target.value)
                      }
                      className="input input-bordered w-full"
                      min="0"
                      step="1000"
                    />
                  ) : (
                    <p className="text-gray-900">
                      {formatCurrency(lead.value)}
                    </p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Budget</span>
                  </label>
                  {editing ? (
                    <select
                      value={formData.budget}
                      onChange={(e) =>
                        handleInputChange("budget", e.target.value)
                      }
                      className="crm-select"
                    >
                      <option value="£">£ (0-10k)</option>
                      <option value="££">££ (10k-25k)</option>
                      <option value="£££">£££ (25k-50k)</option>
                      <option value="££££">££££ (50k+)</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{lead.budget}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="label">
                    <span className="label-text font-medium">
                      Client Health
                    </span>
                  </label>
                  {editing ? (
                    <select
                      value={formData.clientHealth}
                      onChange={(e) =>
                        handleInputChange("clientHealth", e.target.value)
                      }
                      className="crm-select"
                    >
                      <option value="Unknown">Unknown</option>
                      <option value="Excellent">Excellent</option>
                      <option value="Good">Good</option>
                      <option value="Fair">Fair</option>
                      <option value="Poor">Poor</option>
                    </select>
                  ) : (
                    <p className="text-gray-900">{lead.clientHealth}</p>
                  )}
                </div>

                <div>
                  <label className="label">
                    <span className="label-text font-medium">Source</span>
                  </label>
                  <p className="text-gray-900">
                    {lead.source === "Other" && lead.customSource
                      ? lead.customSource
                      : lead.source}
                  </p>
                </div>
              </div>

              {/* Project Types */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Project Types</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {lead.projectTypes?.map((type, index) => (
                    <span key={index} className="badge badge-outline">
                      {type}
                    </span>
                  ))}
                  {lead.customProjectType && (
                    <span className="badge badge-outline">
                      {lead.customProjectType}
                    </span>
                  )}
                </div>
              </div>

              {/* Assignment */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Assigned To</span>
                </label>
                {editing ? (
                  <select
                    value={formData.assignedTo || ""}
                    onChange={(e) =>
                      handleInputChange("assignedTo", e.target.value || null)
                    }
                    className="crm-select"
                  >
                    <option value="">Unassigned</option>
                    {admins.map((admin) => (
                      <option key={admin.id} value={admin.id}>
                        {admin.name || admin.email}
                      </option>
                    ))}
                  </select>
                ) : (
                  <p className="text-gray-900">
                    {lead.assignedTo
                      ? lead.assignedTo.name || lead.assignedTo.email
                      : "Unassigned"}
                  </p>
                )}
              </div>

              {/* Linked User */}
              {lead.linkedUser && (
                <div>
                  <label className="label">
                    <span className="label-text font-medium">Linked User</span>
                  </label>
                  <a
                    href={`/admin/users/${lead.linkedUser.id}`}
                    className="text-blue-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {lead.linkedUser.name || lead.linkedUser.email}
                  </a>
                </div>
              )}

              {/* Aging */}
              <div>
                <label className="label">
                  <span className="label-text font-medium">Aging</span>
                </label>
                <div className="flex items-center gap-2">
                  <p className="text-gray-900">
                    {lead.agingPaused ? "⏸️ " : ""}
                    {lead.agingDays} days since last contact
                    {lead.agingPaused && lead.agingPausedReason && (
                      <span className="ml-2 text-sm text-gray-500">
                        (Paused: {lead.agingPausedReason})
                      </span>
                    )}
                  </p>
                  <CRMButton
                    onClick={handleAgingPauseToggle}
                    disabled={isPausingAging}
                    variant="outline"
                    size="sm"
                    className="ml-2"
                  >
                    {isPausingAging ? (
                      <div className="loading loading-spinner loading-xs"></div>
                    ) : lead.agingPaused ? (
                      "▶️ Resume"
                    ) : (
                      "⏸️ Pause"
                    )}
                  </CRMButton>
                </div>
              </div>
            </div>
          )}

          {activeTab === "activities" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-gray-900">
                  Activity Timeline
                </h4>
                <div className="flex gap-2">
                  <CRMButton
                    size="sm"
                    onClick={() => setShowAddActivity((v) => !v)}
                    className="bg-blue-600 text-white hover:bg-blue-700"
                  >
                    {showAddActivity ? "Cancel" : "+ Add Activity"}
                  </CRMButton>
                  <CRMButton
                    size="sm"
                    onClick={() => setShowReplyModal(true)}
                    className="bg-green-600 text-white hover:bg-green-700"
                  >
                    📧 Mark as Replied
                  </CRMButton>
                  {/* Show resume button if automation is paused or lead has replied */}
                  {(lead.emailAutomation?.leadReplied ||
                    (lead.emailAutomation &&
                      !lead.emailAutomation.isActive)) && (
                    <CRMButton
                      size="sm"
                      onClick={handleResumeAutomation}
                      disabled={processingResume}
                      className="bg-orange-600 text-white hover:bg-orange-700"
                    >
                      {processingResume
                        ? "Resuming..."
                        : "▶️ Resume Automation"}
                    </CRMButton>
                  )}
                </div>
              </div>

              {showAddActivity && (
                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <select
                      value={newActivity.type}
                      onChange={(e) =>
                        setNewActivity((a) => ({ ...a, type: e.target.value }))
                      }
                      className="crm-select bg-white"
                    >
                      <option value="call">📞 Call</option>
                      <option value="email">📧 Email</option>
                      <option value="site_visit">🏠 Site Visit</option>
                      <option value="meeting">🤝 Meeting</option>
                      <option value="note">📝 Note</option>
                      <option value="attachment">📎 Attachment</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Activity title"
                      value={newActivity.title}
                      onChange={(e) =>
                        setNewActivity((a) => ({ ...a, title: e.target.value }))
                      }
                      className="input input-bordered bg-white"
                    />
                  </div>
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      type="datetime-local"
                      placeholder="Due date (optional)"
                      value={newActivity.dueDate}
                      onChange={(e) =>
                        setNewActivity((a) => ({
                          ...a,
                          dueDate: e.target.value,
                        }))
                      }
                      className="input input-bordered bg-white"
                    />
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="contactMade"
                        checked={newActivity.contactMade}
                        onChange={(e) =>
                          setNewActivity((a) => ({
                            ...a,
                            contactMade: e.target.checked,
                          }))
                        }
                        className="checkbox checkbox-sm"
                      />
                      <label
                        htmlFor="contactMade"
                        className="text-sm text-gray-700"
                      >
                        Contact was made with the lead (resets aging timer)
                      </label>
                    </div>
                  </div>
                  <textarea
                    placeholder="Description (optional)"
                    value={newActivity.description}
                    onChange={(e) =>
                      setNewActivity((a) => ({
                        ...a,
                        description: e.target.value,
                      }))
                    }
                    className="textarea textarea-bordered bg-white"
                    rows="3"
                  />
                  <div className="flex justify-end">
                    <CRMButton
                      size="sm"
                      onClick={handleAddActivity}
                      className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                      Save Activity
                    </CRMButton>
                  </div>
                </div>
              )}

              {activities.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mb-4 text-6xl text-gray-400">📋</div>
                  <p className="text-lg text-gray-500">
                    No activities recorded yet
                  </p>
                  <p className="text-sm text-gray-400">
                    Add your first activity to start tracking progress
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity, index) => {
                    console.log(`Rendering activity ${index}:`, {
                      id: activity._id || activity.id,
                      title: activity.title,
                      status: activity.status,
                      statusCheck: activity.status === "done",
                    });

                    const isDone = activity.status === "done";
                    const getActivityIcon = (type) => {
                      const icons = {
                        call: "📞",
                        email: "📧",
                        site_visit: "🏠",
                        meeting: "🤝",
                        note: "📝",
                        attachment: "📎",
                      };
                      return icons[type] || "📋";
                    };

                    const isOverdue =
                      activity.dueDate &&
                      new Date(activity.dueDate) < new Date();

                    return (
                      <div
                        key={index}
                        className={`relative rounded-lg border p-4 transition-all duration-200 ${
                          isDone
                            ? "border-green-200 bg-green-50 opacity-75"
                            : isOverdue
                              ? "border-red-300 bg-red-50 hover:border-red-400 hover:shadow-sm"
                              : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex flex-1 items-start space-x-3">
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${
                                isDone
                                  ? "bg-green-100 text-green-600"
                                  : "bg-blue-100 text-blue-600"
                              }`}
                            >
                              {getActivityIcon(activity.type)}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center space-x-2">
                                <h5
                                  className={`font-medium text-gray-900 ${
                                    isDone ? "text-gray-500 line-through" : ""
                                  }`}
                                >
                                  {activity.title}
                                </h5>
                                <div className="flex items-center space-x-2">
                                  <span
                                    className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                                      isDone
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-800"
                                    }`}
                                  >
                                    {isDone
                                      ? "✓ Completed"
                                      : activity.status || "pending"}
                                  </span>
                                  {activity.contactMade && (
                                    <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                                      📞 Contact
                                    </span>
                                  )}
                                </div>
                              </div>
                              {activity.description && (
                                <p
                                  className={`mb-2 text-sm ${
                                    isDone
                                      ? "text-gray-400 line-through"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {activity.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span>
                                  By{" "}
                                  {activity.createdBy?.name ||
                                    activity.createdBy?.email}
                                </span>
                                <span>•</span>
                                <span>{formatDate(activity.date)}</span>
                                {activity.dueDate && (
                                  <>
                                    <span>•</span>
                                    <span
                                      className={
                                        new Date(activity.dueDate) < new Date()
                                          ? "font-semibold text-red-600"
                                          : "text-gray-500"
                                      }
                                    >
                                      Due: {formatDate(activity.dueDate)}
                                      {new Date(activity.dueDate) <
                                        new Date() && " (Overdue)"}
                                    </span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {!isDone && (
                            <CRMButton
                              size="sm"
                              onClick={() =>
                                handleMarkActivityDone(
                                  activity._id || activity.id,
                                )
                              }
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              Mark Done
                            </CRMButton>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "notes" && (
            <div className="space-y-4">
              <h4 className="flex items-center justify-between font-semibold">
                Notes
                <CRMButton size="sm" onClick={() => setShowAddNote((v) => !v)}>
                  {showAddNote ? "Cancel" : "Add Note"}
                </CRMButton>
              </h4>
              {showAddNote && (
                <div className="mb-2 flex flex-col gap-2">
                  <input
                    type="text"
                    placeholder="Note title"
                    value={newNote.title}
                    onChange={(e) =>
                      setNewNote((n) => ({ ...n, title: e.target.value }))
                    }
                    className="input input-bordered"
                  />
                  <textarea
                    placeholder="Note content"
                    value={newNote.content}
                    onChange={(e) =>
                      setNewNote((n) => ({ ...n, content: e.target.value }))
                    }
                    className="textarea textarea-bordered"
                  />
                  <CRMButton size="sm" onClick={handleAddNote}>
                    Save Note
                  </CRMButton>
                </div>
              )}
              {notes.length === 0 ? (
                <p className="text-gray-500">No notes recorded</p>
              ) : (
                <div className="space-y-3">
                  {notes.map((note, index) => (
                    <div key={index} className="rounded bg-gray-50 p-3">
                      <div className="mb-2 flex items-center justify-between">
                        <span className="text-sm font-semibold text-gray-900">
                          {note.title ||
                            note.content?.slice(0, 32) ||
                            "Untitled"}
                        </span>
                        <span className="text-sm text-gray-500">
                          {formatDate(note.createdAt)}
                        </span>
                        {note.isImportant && (
                          <span className="badge badge-warning badge-sm">
                            Important
                          </span>
                        )}
                      </div>
                      <p className="text-gray-900">{note.content}</p>
                      <p className="mt-2 text-xs text-gray-500">
                        By: {note.createdBy?.name || note.createdBy?.email}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "tasks" && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h4 className="text-xl font-semibold text-gray-900">Tasks</h4>
                <CRMButton
                  size="sm"
                  onClick={() => setShowAddTask((v) => !v)}
                  className="bg-purple-600 text-white hover:bg-purple-700"
                >
                  {showAddTask ? "Cancel" : "+ Add Task"}
                </CRMButton>
              </div>

              {showAddTask && (
                <div className="space-y-3 rounded-lg bg-gray-50 p-4">
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                    <input
                      type="text"
                      placeholder="Task title"
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask((t) => ({ ...t, title: e.target.value }))
                      }
                      className="input input-bordered bg-white"
                    />
                    <select
                      value={newTask.priority}
                      onChange={(e) =>
                        setNewTask((t) => ({ ...t, priority: e.target.value }))
                      }
                      className="crm-select bg-white"
                    >
                      <option value="low">🟢 Low Priority</option>
                      <option value="medium">🟡 Medium Priority</option>
                      <option value="high">🟠 High Priority</option>
                      <option value="urgent">🔴 Urgent</option>
                    </select>
                  </div>
                  <textarea
                    placeholder="Task description (optional)"
                    value={newTask.description}
                    onChange={(e) =>
                      setNewTask((t) => ({ ...t, description: e.target.value }))
                    }
                    className="textarea textarea-bordered bg-white"
                    rows="3"
                  />
                  <div className="flex justify-end">
                    <CRMButton
                      size="sm"
                      onClick={handleAddTask}
                      className="bg-purple-600 text-white hover:bg-purple-700"
                    >
                      Save Task
                    </CRMButton>
                  </div>
                </div>
              )}

              {tasks.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="mb-4 text-6xl text-gray-400">✅</div>
                  <p className="text-lg text-gray-500">No tasks assigned yet</p>
                  <p className="text-sm text-gray-400">
                    Add your first task to start organizing work
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {tasks.map((task, index) => {
                    const isCompleted = task.status === "completed";
                    const getPriorityColor = (priority) => {
                      const colors = {
                        low: "bg-green-100 text-green-800",
                        medium: "bg-yellow-100 text-yellow-800",
                        high: "bg-orange-100 text-orange-800",
                        urgent: "bg-red-100 text-red-800",
                      };
                      return colors[priority] || "bg-gray-100 text-gray-800";
                    };

                    const getStatusColor = (status) => {
                      const colors = {
                        completed: "bg-green-100 text-green-800",
                        overdue: "bg-red-100 text-red-800",
                        in_progress: "bg-blue-100 text-blue-800",
                        pending: "bg-gray-100 text-gray-800",
                      };
                      return colors[status] || "bg-gray-100 text-gray-800";
                    };

                    return (
                      <div
                        key={index}
                        className={`relative rounded-lg border p-4 transition-all duration-200 ${
                          isCompleted
                            ? "border-green-200 bg-green-50 opacity-75"
                            : "border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex flex-1 items-start space-x-3">
                            <div
                              className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-lg ${
                                isCompleted
                                  ? "bg-green-100 text-green-600"
                                  : "bg-purple-100 text-purple-600"
                              }`}
                            >
                              {isCompleted ? "✅" : "📋"}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="mb-1 flex items-center space-x-2">
                                <h5
                                  className={`font-medium text-gray-900 ${
                                    isCompleted
                                      ? "text-gray-500 line-through"
                                      : ""
                                  }`}
                                >
                                  {task.title}
                                </h5>
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${getStatusColor(task.status)}`}
                                >
                                  {task.status === "completed"
                                    ? "✓ Completed"
                                    : task.status || "pending"}
                                </span>
                              </div>
                              {task.description && (
                                <p
                                  className={`mb-2 text-sm ${
                                    isCompleted
                                      ? "text-gray-400 line-through"
                                      : "text-gray-600"
                                  }`}
                                >
                                  {task.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 text-xs text-gray-500">
                                <span
                                  className={`inline-flex items-center rounded-full px-2 py-1 font-medium ${getPriorityColor(task.priority)}`}
                                >
                                  {task.priority} priority
                                </span>
                                {task.dueDate && (
                                  <>
                                    <span>•</span>
                                    <span>Due {formatDate(task.dueDate)}</span>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>
                          {!isCompleted && (
                            <CRMButton
                              size="sm"
                              onClick={() =>
                                handleMarkTaskDone(task._id || task.id)
                              }
                              className="bg-green-600 text-white hover:bg-green-700"
                            >
                              Mark Done
                            </CRMButton>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === "history" && (
            <div className="space-y-4">
              <h4 className="font-semibold">Version History</h4>
              {console.log("Version history:", lead.versionHistory)}
              {lead.versionHistory?.length === 0 ? (
                <p className="text-gray-500">No changes recorded</p>
              ) : (
                <div className="space-y-3">
                  {lead.versionHistory?.map((change, index) => (
                    <div
                      key={index}
                      className="border-l-4 border-gray-300 pl-4"
                    >
                      <div className="flex items-center justify-between">
                        <h5 className="font-medium">{change.field}</h5>
                        <span className="text-sm text-gray-500">
                          {formatDate(change.changedAt)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        {change.oldValue} → {change.newValue}
                      </p>
                      {change.comment && (
                        <p className="mt-1 text-xs text-gray-500">
                          {change.comment}
                        </p>
                      )}
                      <p className="text-xs text-gray-500">
                        By:{" "}
                        {change.changedBy?.name ||
                          change.changedBy?.email ||
                          "Unknown"}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-action">
          {activeTab === "overview" && (
            <>
              {editing ? (
                <>
                  <CRMButton
                    onClick={() => setEditing(false)}
                    variant="outline"
                  >
                    Cancel
                  </CRMButton>
                  <CRMButton onClick={handleSave} variant="primary">
                    Save Changes
                  </CRMButton>
                </>
              ) : (
                <>
                  <CRMButton onClick={() => setEditing(true)} variant="primary">
                    Edit Lead
                  </CRMButton>
                  <CRMButton
                    onClick={handleDeleteLead}
                    variant="outline"
                    className="border-red-600 text-red-600 hover:bg-red-50"
                  >
                    Delete Lead
                  </CRMButton>
                </>
              )}
            </>
          )}
          <CRMButton onClick={onClose} variant="outline">
            Close
          </CRMButton>
        </div>
      </div>

      {/* Pause Reason Modal */}
      {showPauseReasonModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="mb-4 text-lg font-bold">Pause Aging Timer</h3>
            <p className="mb-4 text-gray-600">
              Please provide a reason for pausing the aging timer (optional):
            </p>
            <textarea
              value={pauseReason}
              onChange={(e) => setPauseReason(e.target.value)}
              placeholder="e.g., Customer asked to call back in 3 months"
              className="textarea textarea-bordered mb-4 w-full"
              rows={3}
            />
            <div className="modal-action">
              <CRMButton
                onClick={() => {
                  setShowPauseReasonModal(false);
                  setPauseReason("");
                }}
                variant="outline"
              >
                Cancel
              </CRMButton>
              <CRMButton
                onClick={handlePauseReasonSubmit}
                variant="primary"
                disabled={isPausingAging}
                loading={isPausingAging}
              >
                {isPausingAging ? "Pausing..." : "Pause Aging"}
              </CRMButton>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {showReplyModal && (
        <div className="modal modal-open">
          <div className="modal-box max-w-md">
            <h3 className="mb-4 text-lg font-bold">Mark Lead as Replied</h3>
            <p className="mb-4 text-gray-600">
              This will pause the email automation and reset the aging timer for{" "}
              {lead.name}.
            </p>

            <div className="space-y-4">
              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Reply Subject (optional)
                  </span>
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
                  placeholder="e.g., Re: Kitchen Renovation Quote"
                  className="input input-bordered w-full"
                />
              </div>

              <div>
                <label className="label">
                  <span className="label-text font-medium">
                    Reply Content (optional)
                  </span>
                </label>
                <textarea
                  value={replyData.replyContent}
                  onChange={(e) =>
                    setReplyData((prev) => ({
                      ...prev,
                      replyContent: e.target.value,
                    }))
                  }
                  placeholder="Brief description of what the lead replied with..."
                  className="textarea textarea-bordered w-full"
                  rows={4}
                />
              </div>
            </div>

            <div className="modal-action">
              <CRMButton
                onClick={() => {
                  setShowReplyModal(false);
                  setReplyData({ replySubject: "", replyContent: "" });
                }}
                variant="outline"
              >
                Cancel
              </CRMButton>
              <CRMButton
                onClick={handleLeadReply}
                variant="primary"
                disabled={processingReply}
                loading={processingReply}
              >
                {processingReply ? "Processing..." : "Mark as Replied"}
              </CRMButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
