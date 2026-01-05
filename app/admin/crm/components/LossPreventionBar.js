"use client";

import { useState, useEffect } from "react";
import apiClient from "@/libs/api";

export default function LossPreventionBar() {
  const [stats, setStats] = useState({ agingCount: 0, stagnantCount: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await apiClient.get("/crm/stats");
      setStats(response);
    } catch (error) {
      console.error("Error fetching CRM stats:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading || (stats.agingCount === 0 && stats.stagnantCount === 0)) {
    return null;
  }

  return (
    <div className="mb-2 rounded-xl border border-red-100 bg-red-50/50 backdrop-blur-sm p-3 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-100/80 text-red-600 shadow-sm">
            <svg
              className="h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-red-900">
              Action Required
            </h3>
            <p className="text-xs text-red-600/80">
              Incoming leads that need attention immediately.
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          {stats.agingCount > 0 && (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/60 border border-red-100 shadow-sm">
              <span className="text-xl font-bold text-red-600">
                {stats.agingCount}
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-red-900">Aging</span>
                <span className="text-[10px] text-red-500">
                  {">"} 7d inactive
                </span>
              </div>
            </div>
          )}
          {stats.stagnantCount > 0 && (
            <div className="flex items-center gap-3 px-3 py-1.5 rounded-lg bg-white/60 border border-orange-100 shadow-sm">
              <span className="text-xl font-bold text-orange-600">
                {stats.stagnantCount}
              </span>
              <div className="flex flex-col leading-none">
                <span className="text-[10px] font-bold uppercase tracking-wider text-orange-900">
                  Stagnant
                </span>
                <span className="text-[10px] text-orange-500">
                  {">"} 14d in Lead
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
