"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import useSWR from "swr";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  Clock3,
  Download,
  Gauge,
  PoundSterling,
  Printer,
  RefreshCw,
  Target,
} from "lucide-react";
import apiClient from "@/libs/api";
import { CRM_STAGE_CONFIG, CRM_STAGES } from "@/libs/crmStages";

const TrendChart = dynamic(
  () => import("./ReportsCharts").then((module) => module.TrendChart),
  { ssr: false },
);
const LossChart = dynamic(
  () => import("./ReportsCharts").then((module) => module.LossChart),
  { ssr: false },
);
const currency = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
  maximumFractionDigits: 0,
});

function Delta({ value, suffix = "%" }) {
  const positive = value >= 0;
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold ${positive ? "text-emerald-700" : "text-rose-700"}`}
    >
      {positive ? (
        <ArrowUpRight className="h-3.5 w-3.5" />
      ) : (
        <ArrowDownRight className="h-3.5 w-3.5" />
      )}
      {Math.abs(value || 0)}
      {suffix} vs previous
    </span>
  );
}

function KPI({ label, value, detail, delta, Icon }) {
  return (
    <article className="rounded-xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-950">
            {value}
          </p>
        </div>
        <span className="rounded-lg bg-slate-100 p-2 text-slate-600">
          <Icon className="h-5 w-5" />
        </span>
      </div>
      <div className="mt-4">
        {delta !== undefined ? (
          <Delta value={delta} />
        ) : (
          <p className="text-xs text-slate-500">{detail}</p>
        )}
      </div>
    </article>
  );
}

export default function CRMReportsPage() {
  const [filters, setFilters] = useState({
    dateRange: "30",
    agent: "",
    source: "",
  });
  const query = useMemo(
    () =>
      new URLSearchParams(
        Object.entries(filters).filter(([, value]) => value),
      ).toString(),
    [filters],
  );
  const { data, mutate, isLoading } = useSWR(
    `/crm/reports?${query}`,
    (url) => apiClient.get(url),
    { keepPreviousData: true, revalidateOnFocus: false },
  );
  const { data: users } = useSWR(
    "/admin/check-users",
    (url) => apiClient.get(url),
    { revalidateOnFocus: false },
  );
  const admins = (users?.users || []).filter((user) => user.role === "admin");
  const set = (key, value) =>
    setFilters((current) => ({ ...current, [key]: value }));
  const exportCsv = () => {
    window.location.href = `/api/crm/reports?${query}&format=csv`;
  };

  if (isLoading && !data)
    return (
      <div className="grid min-h-[500px] place-items-center">
        <span className="loading loading-spinner loading-lg text-blue-600" />
      </div>
    );
  const performance = data?.performance || {};
  const pipeline = data?.pipeline || {};
  const comparison = performance.comparison || {};

  return (
    <div className="min-h-screen bg-slate-50 pb-12 text-slate-950 print:bg-white">
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-4 backdrop-blur sm:px-6 print:static">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              CRM Performance
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Conversion, velocity, effort and revenue quality
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <select
              value={filters.dateRange}
              onChange={(event) => set("dateRange", event.target.value)}
              className="rounded-lg border-slate-200 text-sm"
            >
              <option value="7">Last 7 days</option>
              <option value="30">Last 30 days</option>
              <option value="90">Last 90 days</option>
              <option value="365">Last year</option>
            </select>
            <select
              value={filters.agent}
              onChange={(event) => set("agent", event.target.value)}
              className="rounded-lg border-slate-200 text-sm"
            >
              <option value="">All owners</option>
              {admins.map((admin) => (
                <option key={admin.id} value={admin.id}>
                  {admin.name || admin.email}
                </option>
              ))}
            </select>
            <select
              value={filters.source}
              onChange={(event) => set("source", event.target.value)}
              className="rounded-lg border-slate-200 text-sm"
            >
              <option value="">All sources</option>
              {[
                "Houzz",
                "MyBuilder",
                "Recommendation",
                "Google",
                "Meta Ads",
                "Google Ads",
                "Referral",
                "Other",
              ].map((source) => (
                <option key={source}>{source}</option>
              ))}
            </select>
            <button
              onClick={() => mutate()}
              className="rounded-lg border border-slate-200 bg-white p-2 text-slate-600"
              aria-label="Refresh reports"
            >
              <RefreshCw
                className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={exportCsv}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              <Download className="h-4 w-4" />
              CSV
            </button>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700"
            >
              <Printer className="h-4 w-4" />
              PDF
            </button>
          </div>
        </div>
      </header>
      <main className="space-y-6 p-4 sm:p-6">
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KPI
            label="Open pipeline"
            value={pipeline.totalCount || 0}
            detail={`${currency.format(pipeline.totalValue)} potential value`}
            Icon={Target}
          />
          <KPI
            label="Weighted forecast"
            value={currency.format(pipeline.weightedForecast || 0)}
            detail="Stage probabilities applied server-side"
            Icon={PoundSterling}
          />
          <KPI
            label="Closed-deal win rate"
            value={`${performance.winRate || 0}%`}
            delta={comparison.winRate?.delta}
            Icon={Gauge}
          />
          <KPI
            label="Median speed to lead"
            value={`${performance.effort?.medianSpeedToLeadHours || 0}h`}
            detail={`${performance.effort?.activities || 0} activities in period`}
            Icon={Clock3}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <div>
              <h2 className="font-semibold">Lead and win trend</h2>
              <p className="mt-1 text-sm text-slate-500">
                Weekly cohort activity
              </p>
            </div>
            <div className="mt-4">
              <TrendChart data={performance.trends || []} />
            </div>
          </article>
          <article className="rounded-xl border border-slate-200 bg-white p-5">
            <h2 className="font-semibold">Why deals are lost</h2>
            <p className="mt-1 text-sm text-slate-500">
              Closed-lost outcomes in this period
            </p>
            <div className="mt-4">
              {performance.lossReasons?.length ? (
                <LossChart data={performance.lossReasons} />
              ) : (
                <div className="grid h-[280px] place-items-center text-sm text-slate-400">
                  No lost deals in this period
                </div>
              )}
            </div>
          </article>
        </section>

        <section className="grid gap-6 xl:grid-cols-2">
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-semibold">Cohort funnel</h2>
              <p className="mt-1 text-sm text-slate-500">
                Leads created in the selected period that reached each stage
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {(performance.funnel || []).map((item) => (
                <div
                  key={item.stage}
                  className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      {item.stage}
                    </p>
                    <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-full ${CRM_STAGE_CONFIG[item.stage]?.dotClass || "bg-slate-500"}`}
                        style={{ width: `${item.overallConversion}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-semibold">{item.count}</span>
                  <span className="w-14 text-right text-xs text-slate-500">
                    {item.conversionFromPrevious}%
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5">
              <h2 className="font-semibold">Stage velocity</h2>
              <p className="mt-1 text-sm text-slate-500">
                Average elapsed days before moving on
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {(performance.stageVelocity || [])
                .filter((item) => item.stage !== "Lost")
                .map((item) => (
                  <div
                    key={item.stage}
                    className="flex items-center justify-between px-5 py-3"
                  >
                    <span className="text-sm font-medium text-slate-700">
                      {item.stage}
                    </span>
                    <span className="text-sm font-semibold text-slate-950">
                      {item.averageDays}d{" "}
                      <span className="font-normal text-slate-400">
                        ({item.samples})
                      </span>
                    </span>
                  </div>
                ))}
            </div>
          </article>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <KPI
            label="New leads"
            value={comparison.newLeads?.current || 0}
            delta={comparison.newLeads?.delta}
            Icon={Target}
          />
          <KPI
            label="Wins"
            value={comparison.wins?.current || 0}
            delta={comparison.wins?.delta}
            Icon={Gauge}
          />
          <KPI
            label="Tasks completed"
            value={performance.effort?.tasksCompleted || 0}
            detail={`${performance.effort?.tasksOverdue || 0} overdue`}
            Icon={Activity}
          />
          <KPI
            label="Email engagement"
            value={`${performance.effort?.emailClicks || 0} clicks`}
            detail={`${performance.effort?.emailOpens || 0} opens · ${performance.effort?.emailReplies || 0} replies`}
            Icon={Activity}
          />
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold">Source performance</h2>
            <p className="mt-1 text-sm text-slate-500">
              Volume, conversion and deal economics
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Source</th>
                  <th className="px-5 py-3 text-right">Leads</th>
                  <th className="px-5 py-3 text-right">Wins</th>
                  <th className="px-5 py-3 text-right">Win rate</th>
                  <th className="px-5 py-3 text-right">Pipeline</th>
                  <th className="px-5 py-3 text-right">Avg won deal</th>
                  <th className="px-5 py-3 text-right">Cost / win</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(performance.bySource || []).map((source) => (
                  <tr key={source._id}>
                    <td className="px-5 py-3 font-semibold text-slate-800">
                      {source._id}
                    </td>
                    <td className="px-5 py-3 text-right">{source.count}</td>
                    <td className="px-5 py-3 text-right">{source.wonCount}</td>
                    <td className="px-5 py-3 text-right">{source.winRate}%</td>
                    <td className="px-5 py-3 text-right">
                      {currency.format(source.value)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {currency.format(source.avgDealSize)}
                    </td>
                    <td className="px-5 py-3 text-right">
                      {source.costPerWin
                        ? currency.format(source.costPerWin)
                        : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overflow-hidden rounded-xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 p-5">
            <h2 className="font-semibold">Current pipeline by stage</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3">Stage</th>
                  <th className="px-5 py-3 text-right">Count</th>
                  <th className="px-5 py-3 text-right">Value</th>
                  <th className="px-5 py-3 text-right">Avg time in stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {CRM_STAGES.map((stage) => {
                  const item = pipeline.byStage?.[stage] || {};
                  return (
                    <tr key={stage}>
                      <td className="px-5 py-3">
                        <span className="inline-flex items-center gap-2 font-semibold">
                          <span
                            className={`h-2 w-2 rounded-full ${CRM_STAGE_CONFIG[stage].dotClass}`}
                          />
                          {stage}
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {item.count || 0}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {currency.format(item.value)}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {item.avgStageDays || 0}d
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </main>
    </div>
  );
}
