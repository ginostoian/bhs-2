"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import CRMButton from "@/components/CRMButton";

const PROJECT_TYPES = [
  "Bathroom renovation",
  "Kitchen renovation",
  "Extension",
  "Home renovation",
  "Loft Conversion",
  "Commercial",
];

export default function CreateLeadModal({ onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    stage: "Lead",
    value: "",
    budget: "£",
    clientHealth: "Unknown",
    source: "Other",
    customSource: "",
    projectTypes: [],
    customProjectType: "",
    assignedTo: "",
    tags: [],
  });

  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/admin/check-users");
      const adminUsers =
        response.users?.filter((user) => user.role === "admin") || [];
      setAdmins(adminUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleProjectTypeChange = (type, checked) => {
    setFormData((prev) => ({
      ...prev,
      projectTypes: checked
        ? [...prev.projectTypes, type]
        : prev.projectTypes.filter((t) => t !== type),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email) {
      toast.error("Name and email are required");
      return;
    }

    setSubmitting(true);
    try {
      const cleanFormData = {
        ...formData,
        assignedTo: formData.assignedTo || null,
        customSource:
          formData.source === "Other" ? formData.customSource || null : null,
        customProjectType: formData.customProjectType || null,
        value: formData.value ? parseFloat(formData.value) : null,
      };

      await onSubmit(cleanFormData);
    } catch (error) {
      console.error("Error creating lead:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-2 py-4 md:p-4 animate-in fade-in duration-200">
      <div className="relative flex max-h-[100dvh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-gray-900/5">
        
        {/* Header */}
        <div className="flex-none border-b border-gray-100 bg-white/80 backdrop-blur-md p-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-gray-900">Create New Lead</h3>
            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
            </button>
          </div>
        </div>

        {/* Scrollable Form Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            
            {/* Section: Basic Info */}
            <div className="space-y-4">
              <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Client Details</h4>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Phone</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="+44 7700 900000"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Address</label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => handleInputChange("address", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="123 High St, London"
                  />
                </div>
              </div>
            </div>

            {/* Section: Project Info */}
            <div className="space-y-4">
               <h4 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">Project Details</h4>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Stage</label>
                  <select
                    value={formData.stage}
                    onChange={(e) => handleInputChange("stage", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
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

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Value (£)</label>
                  <input
                    type="number"
                    value={formData.value}
                    onChange={(e) => handleInputChange("value", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    min="0"
                    step="1000"
                    placeholder="0.00"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</label>
                  <select
                    value={formData.budget}
                    onChange={(e) => handleInputChange("budget", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="£">£ (0-10k)</option>
                    <option value="££">££ (10k-25k)</option>
                    <option value="£££">£££ (25k-50k)</option>
                    <option value="££££">££££ (50k+)</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                 <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Client Health</label>
                  <select
                    value={formData.clientHealth}
                    onChange={(e) => handleInputChange("clientHealth", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="Unknown">Unknown</option>
                    <option value="Excellent">Excellent</option>
                    <option value="Good">Good</option>
                    <option value="Fair">Fair</option>
                    <option value="Poor">Poor</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Source</label>
                  <select
                    value={formData.source}
                    onChange={(e) => handleInputChange("source", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  >
                    <option value="Other">Other</option>
                    <option value="Houzz">Houzz</option>
                    <option value="MyBuilder">MyBuilder</option>
                    <option value="Recommendation">Recommendation</option>
                    <option value="Google">Google</option>
                    <option value="Meta Ads">Meta Ads</option>
                    <option value="Google Ads">Google Ads</option>
                    <option value="Referral">Referral</option>
                  </select>
                </div>
              </div>
              
              {formData.source === "Other" && (
                <div className="space-y-1 animate-in slide-in-from-top-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Source</label>
                  <input
                    type="text"
                    value={formData.customSource}
                    onChange={(e) => handleInputChange("customSource", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter custom source"
                  />
                </div>
              )}
              
               <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Project Types</label>
                <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
                  {PROJECT_TYPES.map((type) => (
                    <label key={type} className="flex items-center gap-2 p-2 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.projectTypes.includes(type)}
                        onChange={(e) => handleProjectTypeChange(type, e.target.checked)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{type}</span>
                    </label>
                  ))}
                </div>
              </div>
              
               {formData.projectTypes.includes("Custom") && (
                <div className="space-y-1 animate-in slide-in-from-top-2">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Custom Project Type</label>
                  <input
                    type="text"
                    value={formData.customProjectType}
                    onChange={(e) => handleInputChange("customProjectType", e.target.value)}
                    className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                    placeholder="Enter custom project type"
                  />
                </div>
              )}
              
              <div className="space-y-1">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Assign Agent</label>
                   <select
                      value={formData.assignedTo}
                      onChange={(e) => handleInputChange("assignedTo", e.target.value)}
                      className="w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      disabled={loading}
                    >
                      <option value="">Unassigned</option>
                      {admins.map((admin) => (
                        <option key={admin.id} value={admin.id}>
                          {admin.name || admin.email}
                        </option>
                      ))}
                    </select>
              </div>

            </div>

          </form>
        </div>
        
        {/* Footer Actions */}
        <div className="flex-none border-t border-gray-100 bg-gray-50/50 p-6 flex justify-end gap-3">
             <CRMButton
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={submitting}
            >
              Cancel
            </CRMButton>
            <CRMButton
              onClick={handleSubmit}
              variant="primary"
              disabled={submitting}
              loading={submitting}
            >
              {submitting ? "Creating..." : "Create Lead"}
            </CRMButton>
        </div>
      </div>
    </div>
  );
}
