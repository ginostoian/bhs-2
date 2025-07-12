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
      console.log("CreateLeadModal - Full API response:", response);
      const adminUsers =
        response.users?.filter((user) => user.role === "admin") || [];
      console.log("CreateLeadModal - Fetched admins:", adminUsers);
      console.log("CreateLeadModal - All users from response:", response.users);
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
      // Clean up the form data before submission
      const cleanFormData = {
        ...formData,
        // Convert empty string to null for assignedTo
        assignedTo: formData.assignedTo || null,
        // Convert empty string to null for customSource if source is "Other"
        customSource:
          formData.source === "Other" ? formData.customSource || null : null,
        // Convert empty string to null for customProjectType
        customProjectType: formData.customProjectType || null,
        // Ensure value is a number or null
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
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <h3 className="mb-4 text-lg font-bold">Create New Lead</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Basic Information */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">
                <span className="label-text">Name *</span>
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Email *</span>
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className="input input-bordered w-full"
                required
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Phone</span>
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange("phone", e.target.value)}
                className="input input-bordered w-full"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Address</span>
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                className="input input-bordered w-full"
              />
            </div>
          </div>

          {/* Lead Classification */}
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="label">
                <span className="label-text">Stage</span>
              </label>
              <select
                value={formData.stage}
                onChange={(e) => handleInputChange("stage", e.target.value)}
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
            </div>

            <div>
              <label className="label">
                <span className="label-text">Value (£)</span>
              </label>
              <input
                type="number"
                value={formData.value}
                onChange={(e) => handleInputChange("value", e.target.value)}
                className="input input-bordered w-full"
                min="0"
                step="1000"
              />
            </div>

            <div>
              <label className="label">
                <span className="label-text">Budget</span>
              </label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange("budget", e.target.value)}
                className="crm-select"
              >
                <option value="£">£ (0-10k)</option>
                <option value="££">££ (10k-25k)</option>
                <option value="£££">£££ (25k-50k)</option>
                <option value="££££">££££ (50k+)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <div>
              <label className="label">
                <span className="label-text">Client Health</span>
              </label>
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
            </div>

            <div>
              <label className="label">
                <span className="label-text">Source</span>
              </label>
              <select
                value={formData.source}
                onChange={(e) => handleInputChange("source", e.target.value)}
                className="crm-select"
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
            <div>
              <label className="label">
                <span className="label-text">Custom Source</span>
              </label>
              <input
                type="text"
                value={formData.customSource}
                onChange={(e) =>
                  handleInputChange("customSource", e.target.value)
                }
                className="input input-bordered w-full"
                placeholder="Enter custom source"
              />
            </div>
          )}

          {/* Project Types */}
          <div>
            <label className="label">
              <span className="label-text">Project Types</span>
            </label>
            <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
              {PROJECT_TYPES.map((type) => (
                <label key={type} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.projectTypes.includes(type)}
                    onChange={(e) =>
                      handleProjectTypeChange(type, e.target.checked)
                    }
                    className="checkbox checkbox-sm"
                  />
                  <span className="text-sm">{type}</span>
                </label>
              ))}
            </div>
          </div>

          {formData.projectTypes.includes("Custom") && (
            <div>
              <label className="label">
                <span className="label-text">Custom Project Type</span>
              </label>
              <input
                type="text"
                value={formData.customProjectType}
                onChange={(e) =>
                  handleInputChange("customProjectType", e.target.value)
                }
                className="input input-bordered w-full"
                placeholder="Enter custom project type"
              />
            </div>
          )}

          {/* Assignment */}
          <div>
            <label className="label">
              <span className="label-text">Assign To</span>
            </label>
            <select
              value={formData.assignedTo}
              onChange={(e) => handleInputChange("assignedTo", e.target.value)}
              className="crm-select"
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

          {/* Modal Actions */}
          <div className="modal-action">
            <CRMButton
              type="button"
              onClick={onClose}
              variant="outline"
              disabled={submitting}
            >
              Cancel
            </CRMButton>
            <CRMButton
              type="submit"
              variant="primary"
              disabled={submitting}
              loading={submitting}
            >
              {submitting ? "Creating..." : "Create Lead"}
            </CRMButton>
          </div>
        </form>
      </div>
    </div>
  );
}
