"use client";

import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import apiClient from "@/libs/api";
import CRMButton from "@/components/CRMButton";

const STAGE_COLORS = {
  Lead: "bg-blue-50 text-blue-700",
  "Never replied": "bg-gray-50 text-gray-700",
  Qualified: "bg-green-50 text-green-700",
  "Proposal Sent": "bg-yellow-50 text-yellow-700",
  Negotiations: "bg-orange-50 text-orange-700",
  Won: "bg-emerald-50 text-emerald-700",
  Lost: "bg-red-50 text-red-700",
};

export default function CRMReportsPage() {
  const [data, setData] = useState(null); // Stores the full reports object
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState("30"); // days

  const fetchReports = useCallback(async () => {
    try {
      setLoading(true);
      const response = await apiClient.get(`/crm/reports?dateRange=${dateRange}`);
      setData(response);
    } catch (error) {
      console.error("Error fetching reports:", error);
      toast.error("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchReports();
  }, [fetchReports]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      maximumFractionDigits: 0,
    }).format(amount || 0);
  };

  if (loading && !data) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="loading loading-spinner loading-lg text-blue-600"></div>
      </div>
    );
  }

  // Calculate some derived metrics for display
  const totalLeads = data?.pipeline?.totalCount || 0;
  const pipelineValue = data?.pipeline?.totalValue || 0;
  const winRate = data?.performance?.funnel?.total > 0 
    ? ((data.performance.funnel.won / data.performance.funnel.total) * 100).toFixed(1)
    : 0;
  
  // Forecast: Simple weighted calculation
  // 10% of Lead Value + 30% of Qualified + 50% Proposal + 80% Negotiations
  const getForecastValue = () => {
    const s = data?.pipeline?.byStage || {};
    return (
      (s.Lead?.value || 0) * 0.10 +
      (s["Never replied"]?.value || 0) * 0.05 +
      (s.Qualified?.value || 0) * 0.30 +
      (s["Proposal Sent"]?.value || 0) * 0.50 +
      (s.Negotiations?.value || 0) * 0.80
    );
  };

  // Helper for Client Health Color
  const getHealthColor = (health) => {
    switch(health?.toLowerCase()) {
      case "excellent": return "bg-emerald-500";
      case "good": return "bg-green-500";
      case "fair": return "bg-yellow-500";
      case "poor": return "bg-orange-500";
      case "critical": return "bg-red-500";
      default: return "bg-gray-300";
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between sticky top-0 z-10 bg-white/80 backdrop-blur-md py-4 px-1 rounded-xl border border-gray-100/50 shadow-sm transition-all">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Performance Analytics</h1>
          <p className="text-gray-500 mt-1 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Real-time pipeline insights
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="appearance-none pl-4 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-700 shadow-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all cursor-pointer hover:border-blue-300"
              disabled={loading}
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last Quarter</option>
              <option value="365">Last Year</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
            </div>
          </div>
          
          <CRMButton onClick={fetchReports} disabled={loading} variant="secondary" className="!p-2.5">
            <svg className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
          </CRMButton>
        </div>
      </div>

      {/* Top Level Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Leads */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-blue-600" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
          </div>
          <p className="text-sm font-semibold leading-6 text-gray-500">Active Pipeline</p>
          <div className="mt-2 flex items-baseline gap-x-2">
            <span className="text-4xl font-bold tracking-tight text-gray-900">{totalLeads}</span>
            <span className="text-sm text-gray-500">leads</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-green-600 bg-green-50 w-fit px-2 py-1 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            Live Snapshot
          </div>
        </div>

        {/* Pipeline Value */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-green-600" fill="currentColor" viewBox="0 0 24 24"><path d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"/></svg>
          </div>
          <p className="text-sm font-semibold leading-6 text-gray-500">Pipeline Value</p>
          <div className="mt-2 flex items-baseline gap-x-2">
            <span className="text-4xl font-bold tracking-tight text-gray-900">{formatCurrency(pipelineValue)}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-gray-500">
             Total potential revenue
          </div>
        </div>

        {/* Weighted Forecast */}
        <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-50 to-white p-6 shadow-sm ring-1 ring-indigo-100 transition-all hover:shadow-md hover:-translate-y-1">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-24 h-24 text-indigo-600" fill="currentColor" viewBox="0 0 24 24"><path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM9 17H7v-7h2v7zm4 0h-2V7h2v10zm4 0h-2v-4h2v4z"/></svg>
          </div>
          <p className="text-sm font-semibold leading-6 text-indigo-900">Weighted Forecast</p>
          <div className="mt-2 flex items-baseline gap-x-2">
            <span className="text-4xl font-bold tracking-tight text-indigo-600">{formatCurrency(getForecastValue())}</span>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs font-medium text-indigo-600 bg-indigo-100/50 w-fit px-2 py-1 rounded-full">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            Probability Weighted
          </div>
        </div>

        {/* Win Rate */}
        <div className="group relative overflow-hidden rounded-2xl bg-white p-6 shadow-sm ring-1 ring-gray-900/5 transition-all hover:shadow-md hover:-translate-y-1">
          <p className="text-sm font-semibold leading-6 text-gray-500">Win Rate ({dateRange}d)</p>
           <div className="mt-2 flex items-baseline gap-x-2">
            <span className="text-4xl font-bold tracking-tight text-gray-900">{winRate}%</span>
          </div>
           {/* Mini progress bar */}
           <div className="mt-4 w-full bg-gray-100 rounded-full h-1.5">
              <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: `${winRate}%` }}></div>
           </div>
           <div className="mt-2 text-xs text-gray-400">
              Based on created leads
           </div>
        </div>
      </div>

      {/* Main Grid: Pipeline Breakdown & Agent Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Pipeline Breakdown Table */}
        <div className="lg:col-span-2 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden">
           <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Pipeline Breakdown</h3>
           </div>
           <div className="overflow-x-auto">
             <table className="w-full text-left text-sm text-gray-500">
               <thead className="bg-gray-50/50 text-xs uppercase text-gray-700 font-semibold">
                 <tr>
                   <th className="px-6 py-4">Stage</th>
                   <th className="px-6 py-4 text-center">Count</th>
                   <th className="px-6 py-4 text-right">Value</th>
                   <th className="px-6 py-4 text-center">Avg. Age</th>
                 </tr>
               </thead>
               <tbody className="divide-y divide-gray-100">
                 {Object.entries(data?.pipeline?.byStage || {}).map(([stage, stats]) => (
                   <tr key={stage} className="hover:bg-gray-50/50 transition-colors">
                     <td className="px-6 py-4">
                        <span className={`inline-flex items-center rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset ${STAGE_COLORS[stage] || 'bg-gray-50 text-gray-600'} bg-opacity-10 ring-opacity-20`}>
                          {stage}
                        </span>
                     </td>
                     <td className="px-6 py-4 text-center font-medium text-gray-900">{stats.count}</td>
                     <td className="px-6 py-4 text-right font-medium text-gray-900">{formatCurrency(stats.value)}</td>
                     <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center gap-1 ${
                            stats.avgAging > 14 ? 'text-red-600 font-bold' : 
                            stats.avgAging > 7 ? 'text-orange-600' : 'text-gray-600'
                        }`}>
                            {stats.avgAging}d
                            {stats.avgAging > 7 && <span className="w-1.5 h-1.5 rounded-full bg-current"></span>}
                        </span>
                     </td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>

        {/* Agent Leaderboard */}
        <div className="rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm overflow-hidden flex flex-col">
            <div className="px-6 py-5 border-b border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">Top Performers</h3>
              <p className="text-xs text-gray-500 mt-1">Leads created in last {dateRange} days</p>
           </div>
           <div className="flex-1 overflow-y-auto max-h-[400px]">
                <div className="divide-y divide-gray-100">
                    {data?.performance?.byAgent?.map((agent, index) => (
                        <div key={index} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                            <div className="flex items-center gap-3">
                                <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ring-2 ring-white shadow-sm
                                    ${index === 0 ? 'bg-yellow-100 text-yellow-700' : 
                                      index === 1 ? 'bg-gray-100 text-gray-700' : 
                                      index === 2 ? 'bg-orange-50 text-orange-700' : 'bg-blue-50 text-blue-700'
                                    }`}>
                                    {index + 1}
                                </div>
                                <div>
                                    <p className="text-sm font-semibold text-gray-900">{agent.name}</p>
                                    <p className="text-xs text-gray-500">{agent.count} leads</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm font-bold text-gray-900">{agent.wonCount} Wins</p>
                                <p className="text-xs text-gray-400">{formatCurrency(agent.value)}</p>
                            </div>
                        </div>
                    ))}
                    {(!data?.performance?.byAgent || data.performance.byAgent.length === 0) && (
                        <div className="p-8 text-center text-gray-400 text-sm">No agent activity found</div>
                    )}
                </div>
           </div>
        </div>
      </div>

      {/* Value & Economics Section - New! */}
      <h2 className="text-xl font-bold text-gray-900 pt-4">Value Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {/* Deal Economics Card */}
           <div className="md:col-span-1 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm p-6 flex flex-col justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Deal Economics</h3>
                    <p className="text-xs text-gray-500 mb-6">Based on {data?.performance?.economics?.wonCount} won deals</p>
                    
                    <div className="space-y-6">
                        <div>
                            <p className="text-sm font-medium text-gray-500">Average Deal Size</p>
                            <p className="text-3xl font-bold text-gray-900 mt-1">
                                {formatCurrency(data?.performance?.economics?.avgDealSize)}
                            </p>
                        </div>
                        
                        <div className="pt-6 border-t border-gray-100">
                             <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-medium text-gray-600">Total Won</span>
                                <span className="text-sm font-bold text-green-600">{formatCurrency(data?.performance?.economics?.totalWon)}</span>
                             </div>
                             <div className="flex justify-between items-center">
                                <span className="text-sm font-medium text-gray-600">Total Lost</span>
                                <span className="text-sm font-bold text-red-600">{formatCurrency(data?.performance?.economics?.totalLost)}</span>
                             </div>
                        </div>
                    </div>
                </div>
           </div>

           {/* Client Health Distribution */}
           <div className="md:col-span-2 rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Pipeline Health (Value Risk)</h3>
                <div className="space-y-5">
                    {data?.performance?.health?.map((health) => {
                         const totalHealthValue = data.performance.health.reduce((acc, h) => acc + h.value, 0);
                         const percentage = totalHealthValue > 0 ? (health.value / totalHealthValue) * 100 : 0;
                         return (
                            <div key={health._id} className="relative">
                                <div className="flex justify-between items-center mb-1.5 text-sm">
                                    <div className="flex items-center gap-2">
                                         <div className={`w-2 h-2 rounded-full ${getHealthColor(health._id)}`}></div>
                                         <span className="font-medium text-gray-700 capitalize">{health._id || 'Unknown'}</span>
                                    </div>
                                    <span className="text-gray-900 font-semibold">{formatCurrency(health.value)} <span className="text-gray-400 font-normal">({health.count} leads)</span></span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2.5 overflow-hidden">
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ${getHealthColor(health._id)}`} 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                         );
                    })}
                     {(!data?.performance?.health || data.performance.health.length === 0) && (
                        <div className="text-center text-gray-400 py-8">No active leads with health data</div>
                    )}
                </div>
           </div>
      </div>

       {/* Source & Project Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {/* Source Performance */}
           <div className="rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Lead Sources</h3>
                <div className="space-y-4">
                    {data?.performance?.bySource?.map((source) => {
                         const max = Math.max(...(data.performance.bySource.map(s => s.count) || [0]));
                         const percentage = max > 0 ? (source.count / max) * 100 : 0;
                         return (
                            <div key={source._id} className="relative">
                                <div className="flex justify-between items-center mb-1 text-sm">
                                    <span className="font-medium text-gray-700">{source._id}</span>
                                    <span className="text-gray-500">{source.count} leads ({source.wonCount} won)</span>
                                </div>
                                <div className="w-full bg-gray-100 rounded-full h-2">
                                    <div 
                                        className="bg-purple-500 h-2 rounded-full transition-all duration-500" 
                                        style={{ width: `${percentage}%` }}
                                    ></div>
                                </div>
                            </div>
                         );
                    })}
                </div>
           </div>

           {/* Project Type Performance */}
           <div className="rounded-2xl border border-gray-100 bg-white/50 backdrop-blur-sm shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-6">Project Types</h3>
                 <div className="space-y-4">
                    {data?.performance?.byType?.map((type) => (
                        <div key={type._id} className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100 shadow-sm">
                             <span className="font-medium text-gray-700 text-sm">{type._id}</span>
                             <div className="text-right">
                                 <div className="text-sm font-bold text-gray-900">{formatCurrency(type.value)}</div>
                                 <div className="text-xs text-gray-500">{type.count} leads</div>
                             </div>
                        </div>
                    ))}
                 </div>
           </div>
      </div>

    </div>
  );
}
