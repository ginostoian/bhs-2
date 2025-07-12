"use client";

import { useState, useEffect } from "react";
import apiClient from "@/libs/api";
import CRMButton from "@/components/CRMButton";

export default function FilterBar({ filters, setFilters }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      setLoading(true);
      const response = await apiClient.get("/admin/check-users");
      console.log("FilterBar - Full API response:", response);
      const adminUsers =
        response.users?.filter((user) => user.role === "admin") || [];
      console.log("FilterBar - Fetched admins:", adminUsers);
      console.log("FilterBar - All users from response:", response.users);
      setAdmins(adminUsers);
    } catch (error) {
      console.error("Error fetching admins:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const clearFilters = () => {
    setFilters({
      search: "",
      assignedTo: "",
      source: "",
      projectType: "",
    });
  };

  const hasActiveFilters = Object.values(filters).some((value) => value !== "");

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-5">
        {/* Search */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Search
          </label>
          <input
            type="text"
            placeholder="Name, email, phone..."
            value={filters.search}
            onChange={(e) => handleFilterChange("search", e.target.value)}
            className="input input-bordered input-sm w-full"
          />
        </div>

        {/* Assigned To */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Assigned To
          </label>
          <select
            value={filters.assignedTo}
            onChange={(e) => handleFilterChange("assignedTo", e.target.value)}
            className="crm-select"
            disabled={loading}
          >
            <option value="">All</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name || admin.email}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Source
          </label>
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange("source", e.target.value)}
            className="crm-select"
          >
            <option value="">All Sources</option>
            <option value="Houzz">Houzz</option>
            <option value="MyBuilder">MyBuilder</option>
            <option value="Recommendation">Recommendation</option>
            <option value="Google">Google</option>
            <option value="Meta Ads">Meta Ads</option>
            <option value="Google Ads">Google Ads</option>
            <option value="Referral">Referral</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Project Type */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Project Type
          </label>
          <select
            value={filters.projectType}
            onChange={(e) => handleFilterChange("projectType", e.target.value)}
            className="crm-select"
          >
            <option value="">All Types</option>
            <option value="Bathroom renovation">Bathroom renovation</option>
            <option value="Kitchen renovation">Kitchen renovation</option>
            <option value="Extension">Extension</option>
            <option value="Home renovation">Home renovation</option>
            <option value="Loft Conversion">Loft Conversion</option>
            <option value="Commercial">Commercial</option>
          </select>
        </div>

        {/* Clear Filters */}
        <div className="flex items-end">
          <CRMButton
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            variant="outline"
            className="w-full py-1 text-sm"
            style={{ minHeight: "32px", fontSize: "0.875rem" }}
          >
            Clear Filters
          </CRMButton>
        </div>
      </div>
    </div>
  );
}
