"use client";

import { useState, useEffect } from "react";
import apiClient from "@/libs/api";
import CRMButton from "@/components/CRMButton";

export default function FilterBar({ filters, setFilters }) {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

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
    <div className="rounded-xl border border-gray-200 bg-white/40 backdrop-blur-md p-4 shadow-sm transition-all hover:bg-white/60">
      {/* Mobile Toggle */}
      <div className="md:hidden mb-4 flex items-center justify-between">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700"
            >
                <svg className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                Filters {hasActiveFilters && <span className="ml-2 rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">Active</span>}
            </button>
            {hasActiveFilters && (
                 <button onClick={clearFilters} className="text-xs text-gray-500 hover:text-gray-700">Clear</button>
            )}
      </div>

      <div className={`grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-5 items-end ${isOpen ? 'block' : 'hidden md:grid'}`}>
        {/* Search */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Search
          </label>
          <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              </div>
              <input
                type="text"
                placeholder="Search leads..."
                value={filters.search}
                onChange={(e) => handleFilterChange("search", e.target.value)}
                className="w-full rounded-lg border-gray-200 bg-white/50 pl-10 pr-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 transition-colors shadow-sm"
              />
          </div>
        </div>

        {/* Assigned To */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Assigned To
          </label>
          <select
            value={filters.assignedTo}
            onChange={(e) => handleFilterChange("assignedTo", e.target.value)}
            className="w-full rounded-lg border-gray-200 bg-white/50 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-sm"
            disabled={loading}
          >
            <option value="">All Users</option>
            {admins.map((admin) => (
              <option key={admin.id} value={admin.id}>
                {admin.name || admin.email}
              </option>
            ))}
          </select>
        </div>

        {/* Source */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Source
          </label>
          <select
            value={filters.source}
            onChange={(e) => handleFilterChange("source", e.target.value)}
            className="w-full rounded-lg border-gray-200 bg-white/50 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-sm"
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
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Project Type
          </label>
          <select
            value={filters.projectType}
            onChange={(e) => handleFilterChange("projectType", e.target.value)}
            className="w-full rounded-lg border-gray-200 bg-white/50 px-3 py-2 text-sm text-gray-700 focus:border-blue-500 focus:bg-white focus:ring-1 focus:ring-blue-500 shadow-sm"
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
        <div>
          <button
            onClick={clearFilters}
            disabled={!hasActiveFilters}
            className={`w-full rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
                hasActiveFilters 
                ? "bg-gray-900 text-white shadow-md hover:bg-black hover:shadow-lg active:scale-95" 
                : "bg-gray-100 text-gray-400 cursor-not-allowed"
            }`}
          >
            Clear Filters
          </button>
        </div>
      </div>
    </div>
  );
}
