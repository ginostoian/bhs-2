"use client";

import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";

const CRM_STAGES = [
  "Lead",
  "Never replied",
  "Qualified",
  "Proposal Sent",
  "Negotiations",
  "Won",
  "Lost",
];

export default function CRMReportsPage() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // days
  const [selectedStage, setSelectedStage] = useState("all");
  const [lastUpdated, setLastUpdated] = useState(null);

  useEffect(() => {
    fetchLeads();
  }, [dateRange]);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      console.log(`Fetching leads for last ${dateRange} days`);
      const response = await apiClient.get(`/crm/leads?dateRange=${dateRange}`);
      console.log("API Response:", response);
      setLeads(response.leads || []);
      setLastUpdated(new Date());
    } catch (error) {
      console.error("Error fetching leads:", error);
      toast.error("Failed to fetch leads");
    } finally {
      setLoading(false);
    }
  };

  // Calculate pipeline metrics
  const getPipelineMetrics = () => {
    const stageCounts = {};
    const stageValues = {};
    let totalLeads = 0;
    let totalValue = 0;

    CRM_STAGES.forEach((stage) => {
      const stageLeads = leads.filter((lead) => lead.stage === stage);
      stageCounts[stage] = stageLeads.length;
      stageValues[stage] = stageLeads.reduce(
        (sum, lead) => sum + (lead.value || 0),
        0,
      );
      totalLeads += stageLeads.length;
      totalValue += stageValues[stage];
    });

    return { stageCounts, stageValues, totalLeads, totalValue };
  };

  // Calculate conversion rates
  const getConversionRates = () => {
    const { stageCounts } = getPipelineMetrics();
    const totalLeads =
      stageCounts["Lead"] +
      stageCounts["Never replied"] +
      stageCounts["Qualified"];
    const qualifiedLeads =
      stageCounts["Qualified"] +
      stageCounts["Proposal Sent"] +
      stageCounts["Negotiations"] +
      stageCounts["Won"] +
      stageCounts["Lost"];
    const wonLeads = stageCounts["Won"];

    return {
      leadToQualified:
        totalLeads > 0 ? ((qualifiedLeads / totalLeads) * 100).toFixed(1) : 0,
      qualifiedToWon:
        qualifiedLeads > 0 ? ((wonLeads / qualifiedLeads) * 100).toFixed(1) : 0,
      overallConversion:
        totalLeads > 0 ? ((wonLeads / totalLeads) * 100).toFixed(1) : 0,
    };
  };

  // Get aging leads (2+ days) - exclude paused leads
  const getAgingLeads = () => {
    return leads.filter(
      (lead) =>
        lead.agingDays >= 2 &&
        !["Won", "Lost"].includes(lead.stage) &&
        !lead.agingPaused,
    );
  };

  // Get source performance
  const getSourcePerformance = () => {
    const sourceStats = {};
    leads.forEach((lead) => {
      const source =
        lead.source === "Other" && lead.customSource
          ? lead.customSource
          : lead.source;
      if (!sourceStats[source]) {
        sourceStats[source] = { count: 0, value: 0, won: 0 };
      }
      sourceStats[source].count++;
      sourceStats[source].value += lead.value || 0;
      if (lead.stage === "Won") {
        sourceStats[source].won++;
      }
    });
    return sourceStats;
  };

  // Get project type performance
  const getProjectTypePerformance = () => {
    const projectStats = {};
    leads.forEach((lead) => {
      const types = [
        ...(lead.projectTypes || []),
        lead.customProjectType,
      ].filter(Boolean);
      types.forEach((type) => {
        if (!projectStats[type]) {
          projectStats[type] = { count: 0, value: 0, won: 0 };
        }
        projectStats[type].count++;
        projectStats[type].value += lead.value || 0;
        if (lead.stage === "Won") {
          projectStats[type].won++;
        }
      });
    });
    return projectStats;
  };

  // Get average days in each stage
  const getAverageDaysInStage = () => {
    const stageDays = {};
    CRM_STAGES.forEach((stage) => {
      const stageLeads = leads.filter((lead) => lead.stage === stage);
      if (stageLeads.length > 0) {
        const totalDays = stageLeads.reduce(
          (sum, lead) => sum + (lead.agingDays || 0),
          0,
        );
        stageDays[stage] = (totalDays / stageLeads.length).toFixed(1);
      } else {
        stageDays[stage] = 0;
      }
    });
    return stageDays;
  };

  const { stageCounts, stageValues, totalLeads, totalValue } =
    getPipelineMetrics();
  const conversionRates = getConversionRates();
  const agingLeads = getAgingLeads();
  const sourcePerformance = getSourcePerformance();
  const projectTypePerformance = getProjectTypePerformance();
  const averageDaysInStage = getAverageDaysInStage();

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
  };

  if (loading) {
    return (
      <div className="flex min-h-96 items-center justify-center">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            CRM Reports & Analytics
          </h1>
          <p className="text-gray-600">
            Comprehensive insights into your lead pipeline
            {dateRange && (
              <span className="ml-2 font-medium text-blue-600">
                • Last {dateRange} days ({totalLeads} leads)
              </span>
            )}
          </p>
          {lastUpdated && (
            <p className="text-sm text-gray-500">
              Last updated: {lastUpdated.toLocaleString()}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="crm-select"
            disabled={loading}
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last 365 days</option>
          </select>
          {loading && (
            <div className="loading loading-spinner loading-sm"></div>
          )}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <div className="stat rounded-lg bg-white shadow">
          <div className="stat-title">Total Leads</div>
          <div className="stat-value text-primary">{totalLeads}</div>
          <div className="stat-desc">Active leads in pipeline</div>
        </div>

        <div className="stat rounded-lg bg-white shadow">
          <div className="stat-title">Pipeline Value</div>
          <div className="stat-value text-green-600">
            {formatCurrency(totalValue)}
          </div>
          <div className="stat-desc">Total potential value</div>
        </div>

        <div className="stat rounded-lg bg-white shadow">
          <div className="stat-title">Conversion Rate</div>
          <div className="stat-value text-blue-600">
            {conversionRates.overallConversion}%
          </div>
          <div className="stat-desc">Lead to Won</div>
        </div>

        <div className="stat rounded-lg bg-white shadow">
          <div className="stat-title">Aging Leads</div>
          <div className="stat-value text-orange-600">{agingLeads.length}</div>
          <div className="stat-desc">2+ days without contact</div>
        </div>
      </div>

      {/* No Data Message */}
      {totalLeads === 0 && !loading && (
        <div className="rounded-lg bg-blue-50 p-6 text-center">
          <div className="mb-2 text-blue-600">
            <svg
              className="mx-auto h-12 w-12"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-lg font-medium text-blue-900">
            No leads found
          </h3>
          <p className="text-blue-700">
            No leads were created in the last {dateRange} days. Try selecting a
            longer time period or check if leads exist in your system.
          </p>
        </div>
      )}

      {/* Pipeline Overview */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Pipeline by Stage</h3>
          <div className="space-y-3">
            {CRM_STAGES.map((stage) => (
              <div key={stage} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                  <span className="font-medium">{stage}</span>
                </div>
                <div className="text-right">
                  <div className="font-semibold">{stageCounts[stage]}</div>
                  <div className="text-sm text-gray-500">
                    {formatCurrency(stageValues[stage])}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-lg bg-white p-6 shadow">
          <h3 className="mb-4 text-lg font-semibold">Conversion Rates</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Lead → Qualified</span>
              <span className="font-semibold text-blue-600">
                {conversionRates.leadToQualified}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Qualified → Won</span>
              <span className="font-semibold text-green-600">
                {conversionRates.qualifiedToWon}%
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Overall Conversion</span>
              <span className="font-semibold text-purple-600">
                {conversionRates.overallConversion}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Source Performance */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Source Performance</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Source</th>
                <th>Leads</th>
                <th>Value</th>
                <th>Won</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(sourcePerformance).map(([source, stats]) => (
                <tr key={source}>
                  <td className="font-medium">{source}</td>
                  <td>{stats.count}</td>
                  <td>{formatCurrency(stats.value)}</td>
                  <td>{stats.won}</td>
                  <td>
                    {stats.count > 0
                      ? ((stats.won / stats.count) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Project Type Performance */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Project Type Performance</h3>
        <div className="overflow-x-auto">
          <table className="table table-zebra w-full">
            <thead>
              <tr>
                <th>Project Type</th>
                <th>Leads</th>
                <th>Value</th>
                <th>Won</th>
                <th>Win Rate</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(projectTypePerformance).map(([type, stats]) => (
                <tr key={type}>
                  <td className="font-medium">{type}</td>
                  <td>{stats.count}</td>
                  <td>{formatCurrency(stats.value)}</td>
                  <td>{stats.won}</td>
                  <td>
                    {stats.count > 0
                      ? ((stats.won / stats.count) * 100).toFixed(1)
                      : 0}
                    %
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Aging Leads */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Aging Leads (2+ days)</h3>
        {agingLeads.length === 0 ? (
          <p className="text-gray-500">No aging leads found</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table table-zebra w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Stage</th>
                  <th>Days</th>
                  <th>Value</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                {agingLeads.map((lead) => (
                  <tr key={lead.id}>
                    <td className="font-medium">{lead.name}</td>
                    <td>{lead.email}</td>
                    <td>
                      <span className="badge badge-outline">{lead.stage}</span>
                    </td>
                    <td className="font-semibold text-orange-600">
                      {lead.agingDays}
                    </td>
                    <td>{formatCurrency(lead.value)}</td>
                    <td>{lead.assignedTo?.name || "Unassigned"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Average Days in Stage */}
      <div className="rounded-lg bg-white p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Average Days in Stage</h3>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4 lg:grid-cols-7">
          {CRM_STAGES.map((stage) => (
            <div key={stage} className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {averageDaysInStage[stage]}
              </div>
              <div className="text-sm text-gray-500">{stage}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
