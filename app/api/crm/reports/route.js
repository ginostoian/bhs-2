import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import LeadTask from "@/models/LeadTask";
import EmailAutomation from "@/models/EmailAutomation";
import {
  CRM_STAGES,
  getStageProbability,
  normalizeCRMStage,
} from "@/libs/crmStages";

const DAY = 24 * 60 * 60 * 1000;
const FUNNEL_STAGES = CRM_STAGES.filter((stage) => stage !== "Lost");
const valueOf = (lead) => Number(lead.estimatedValue || lead.value || 0);
const percent = (part, total) =>
  total ? Math.round((part / total) * 1000) / 10 : 0;
const delta = (current, previous) =>
  previous
    ? Math.round(((current - previous) / previous) * 1000) / 10
    : current
      ? 100
      : 0;
const median = (values) => {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2
    ? sorted[middle]
    : (sorted[middle - 1] + sorted[middle]) / 2;
};
const outcomeDate = (lead) =>
  lead.winLossDate ||
  [...(lead.versionHistory || [])]
    .reverse()
    .find(
      (entry) =>
        entry.field === "stage" &&
        ["Won", "Lost"].includes(normalizeCRMStage(entry.newValue)),
    )?.changedAt;

const stageJourney = (lead) => {
  const stages = new Set([normalizeCRMStage(lead.stage)]);
  for (const change of lead.versionHistory || []) {
    if (change.field === "stage")
      stages.add(normalizeCRMStage(change.newValue));
  }
  return stages;
};

const csvResponse = (report) => {
  const rows = [["Section", "Label", "Count", "Value", "Rate"]];
  for (const [stage, item] of Object.entries(report.pipeline.byStage))
    rows.push(["Pipeline", stage, item.count, item.value, item.avgStageDays]);
  for (const item of report.performance.bySource)
    rows.push(["Source", item._id, item.count, item.value, item.winRate]);
  for (const item of report.performance.lossReasons)
    rows.push(["Loss reason", item.reason, item.count, "", item.percentage]);
  const escape = (value) => `"${String(value ?? "").replaceAll('"', '""')}"`;
  return new NextResponse(
    rows.map((row) => row.map(escape).join(",")).join("\n"),
    {
      headers: {
        "content-type": "text/csv",
        "content-disposition": "attachment; filename=crm-report.csv",
      },
    },
  );
};

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectMongo();
    const { searchParams } = new URL(request.url);
    const days = Math.min(
      730,
      Math.max(1, Number(searchParams.get("dateRange")) || 30),
    );
    const now = new Date();
    const start = new Date(now.getTime() - days * DAY);
    const previousStart = new Date(start.getTime() - days * DAY);
    const agent = searchParams.get("agent");
    const source = searchParams.get("source");
    const baseQuery = { isActive: true, isArchived: false };
    if (agent) baseQuery.assignedTo = agent;
    if (source) baseQuery.source = source;

    const [leads, activities, tasks, automations] = await Promise.all([
      Lead.find(baseQuery).populate("assignedTo", "name email").lean(),
      LeadActivity.find({
        occurredAt: { $gte: previousStart },
        ...(agent ? { createdBy: agent } : {}),
      }).lean(),
      LeadTask.find({
        createdAt: { $gte: previousStart },
        ...(agent ? { assignedTo: agent } : {}),
      }).lean(),
      EmailAutomation.find({ updatedAt: { $gte: previousStart } }).lean(),
    ]);

    const pipelineLeads = leads.filter(
      (lead) => !["Won", "Lost"].includes(normalizeCRMStage(lead.stage)),
    );
    const pipelineByStage = Object.fromEntries(
      CRM_STAGES.map((stage) => [
        stage,
        { count: 0, value: 0, avgStageDays: 0 },
      ]),
    );
    const stageAgeTotals = Object.fromEntries(
      CRM_STAGES.map((stage) => [stage, []]),
    );
    for (const lead of leads) {
      const stage = normalizeCRMStage(lead.stage);
      if (!pipelineByStage[stage]) continue;
      pipelineByStage[stage].count += 1;
      pipelineByStage[stage].value += valueOf(lead);
      const lastStageChange = [...(lead.versionHistory || [])]
        .reverse()
        .find((entry) => entry.field === "stage");
      stageAgeTotals[stage].push(
        (now - new Date(lastStageChange?.changedAt || lead.createdAt)) / DAY,
      );
    }
    for (const stage of CRM_STAGES) {
      const values = stageAgeTotals[stage];
      pipelineByStage[stage].avgStageDays = values.length
        ? Math.round(
            (values.reduce((sum, item) => sum + item, 0) / values.length) * 10,
          ) / 10
        : 0;
    }

    const periodLeads = leads.filter(
      (lead) => new Date(lead.createdAt) >= start,
    );
    const previousLeads = leads.filter(
      (lead) =>
        new Date(lead.createdAt) >= previousStart &&
        new Date(lead.createdAt) < start,
    );
    const closed = leads.filter((lead) => {
      const date = outcomeDate(lead);
      return (
        date &&
        new Date(date) >= start &&
        ["Won", "Lost"].includes(normalizeCRMStage(lead.stage))
      );
    });
    const previousClosed = leads.filter((lead) => {
      const date = outcomeDate(lead);
      return (
        date &&
        new Date(date) >= previousStart &&
        new Date(date) < start &&
        ["Won", "Lost"].includes(normalizeCRMStage(lead.stage))
      );
    });
    const won = closed.filter(
      (lead) => normalizeCRMStage(lead.stage) === "Won",
    );
    const lost = closed.filter(
      (lead) => normalizeCRMStage(lead.stage) === "Lost",
    );
    const previousWon = previousClosed.filter(
      (lead) => normalizeCRMStage(lead.stage) === "Won",
    );
    const winRate = percent(won.length, closed.length);
    const previousWinRate = percent(previousWon.length, previousClosed.length);

    const funnelCounts = Object.fromEntries(
      FUNNEL_STAGES.map((stage) => [
        stage,
        periodLeads.filter((lead) => {
          const journey = stageJourney(lead);
          return (
            stage === "New Enquiry" ||
            journey.has(stage) ||
            (stage === "Won" && normalizeCRMStage(lead.stage) === "Won")
          );
        }).length,
      ]),
    );
    const funnel = FUNNEL_STAGES.map((stage, index) => {
      const count = funnelCounts[stage];
      const previousCount = index
        ? funnelCounts[FUNNEL_STAGES[index - 1]]
        : count;
      return {
        stage,
        count,
        conversionFromPrevious: index ? percent(count, previousCount) : 100,
        overallConversion: percent(count, periodLeads.length),
      };
    });

    const velocity = Object.fromEntries(CRM_STAGES.map((stage) => [stage, []]));
    for (const lead of leads) {
      const history = (lead.versionHistory || [])
        .filter((item) => item.field === "stage")
        .sort((a, b) => new Date(a.changedAt) - new Date(b.changedAt));
      for (let index = 0; index < history.length; index += 1) {
        const stage = normalizeCRMStage(history[index].oldValue);
        if (velocity[stage])
          velocity[stage].push(
            (new Date(history[index].changedAt) -
              new Date(index ? history[index - 1].changedAt : lead.createdAt)) /
              DAY,
          );
      }
    }
    const stageVelocity = CRM_STAGES.map((stage) => ({
      stage,
      averageDays: velocity[stage].length
        ? Math.round(
            (velocity[stage].reduce((a, b) => a + b, 0) /
              velocity[stage].length) *
              10,
          ) / 10
        : 0,
      samples: velocity[stage].length,
    }));

    const weeks = Math.max(1, Math.ceil(days / 7));
    const trends = Array.from({ length: weeks }, (_, index) => {
      const bucketStart = new Date(start.getTime() + index * 7 * DAY);
      const bucketEnd = new Date(
        Math.min(now.getTime(), bucketStart.getTime() + 7 * DAY),
      );
      const created = periodLeads.filter(
        (lead) =>
          new Date(lead.createdAt) >= bucketStart &&
          new Date(lead.createdAt) < bucketEnd,
      );
      const bucketClosed = closed.filter(
        (lead) =>
          new Date(outcomeDate(lead)) >= bucketStart &&
          new Date(outcomeDate(lead)) < bucketEnd,
      );
      const bucketWon = bucketClosed.filter(
        (lead) => normalizeCRMStage(lead.stage) === "Won",
      );
      return {
        date: bucketStart.toISOString(),
        newLeads: created.length,
        wins: bucketWon.length,
        winRate: percent(bucketWon.length, bucketClosed.length),
        wonValue: bucketWon.reduce((sum, lead) => sum + valueOf(lead), 0),
      };
    });

    const group = (items, keyFn) => {
      const map = new Map();
      for (const item of items) {
        const key = keyFn(item) || "Unknown";
        if (!map.has(key)) map.set(key, []);
        map.get(key).push(item);
      }
      return map;
    };
    const bySource = [
      ...group(
        periodLeads,
        (lead) => lead.customSource || lead.source,
      ).entries(),
    ]
      .map(([_id, items]) => {
        const wins = items.filter(
          (lead) => normalizeCRMStage(lead.stage) === "Won",
        );
        const acquisitionCost = items.reduce(
          (sum, lead) => sum + Number(lead.attribution?.acquisitionCost || 0),
          0,
        );
        return {
          _id,
          count: items.length,
          value: items.reduce((sum, lead) => sum + valueOf(lead), 0),
          wonCount: wins.length,
          winRate: percent(wins.length, items.length),
          avgDealSize: wins.length
            ? wins.reduce((sum, lead) => sum + valueOf(lead), 0) / wins.length
            : 0,
          acquisitionCost,
          costPerWin:
            wins.length && acquisitionCost
              ? acquisitionCost / wins.length
              : null,
        };
      })
      .sort((a, b) => b.count - a.count);
    const byType = [
      ...group(
        periodLeads.flatMap((lead) =>
          (lead.projectTypes || ["Unknown"]).map((type) => ({
            ...lead,
            _type: type,
          })),
        ),
        (lead) => lead._type,
      ).entries(),
    ].map(([_id, items]) => ({
      _id,
      count: items.length,
      value: items.reduce((sum, lead) => sum + valueOf(lead), 0),
      wonCount: items.filter((lead) => normalizeCRMStage(lead.stage) === "Won")
        .length,
    }));
    const byAgent = [
      ...group(periodLeads, (lead) =>
        String(lead.assignedTo?._id || "unassigned"),
      ).entries(),
    ].map(([_id, items]) => ({
      _id,
      name: items[0].assignedTo?.name || "Unassigned",
      email: items[0].assignedTo?.email || "",
      count: items.length,
      value: items.reduce((sum, lead) => sum + valueOf(lead), 0),
      wonCount: items.filter((lead) => normalizeCRMStage(lead.stage) === "Won")
        .length,
    }));
    const health = [
      ...group(pipelineLeads, (lead) => lead.clientHealth).entries(),
    ].map(([_id, items]) => ({
      _id,
      count: items.length,
      value: items.reduce((sum, lead) => sum + valueOf(lead), 0),
    }));
    const lossReasons = [
      ...group(lost, (lead) => lead.winLossReason || "Not recorded").entries(),
    ]
      .map(([reason, items]) => ({
        reason,
        count: items.length,
        percentage: percent(items.length, lost.length),
        value: items.reduce((sum, lead) => sum + valueOf(lead), 0),
      }))
      .sort((a, b) => b.count - a.count);

    const currentActivities = activities.filter(
      (item) => new Date(item.occurredAt || item.createdAt) >= start,
    );
    const currentTasks = tasks.filter(
      (item) => new Date(item.createdAt) >= start,
    );
    const firstActivityByLead = new Map();
    for (const item of activities) {
      const key = String(item.leadId);
      const at = new Date(item.occurredAt || item.createdAt);
      if (!firstActivityByLead.has(key) || at < firstActivityByLead.get(key))
        firstActivityByLead.set(key, at);
    }
    const speedToLeadHours = periodLeads.flatMap((lead) =>
      firstActivityByLead.has(String(lead._id))
        ? [
            (firstActivityByLead.get(String(lead._id)) -
              new Date(lead.createdAt)) /
              (60 * 60 * 1000),
          ]
        : [],
    );
    const emailHistory = automations
      .flatMap((automation) => automation.emailHistory || [])
      .filter((item) => new Date(item.sentAt) >= start);
    const weightedForecast = pipelineLeads.reduce(
      (sum, lead) => sum + valueOf(lead) * getStageProbability(lead.stage),
      0,
    );

    const report = {
      pipeline: {
        byStage: pipelineByStage,
        totalValue: pipelineLeads.reduce((sum, lead) => sum + valueOf(lead), 0),
        totalCount: pipelineLeads.length,
        weightedForecast,
      },
      performance: {
        dateRange: days,
        winRate,
        closedCount: closed.length,
        funnel,
        stageVelocity,
        trends,
        lossReasons,
        bySource,
        byType,
        byAgent,
        health,
        economics: {
          avgDealSize: won.length
            ? won.reduce((sum, lead) => sum + valueOf(lead), 0) / won.length
            : 0,
          totalWon: won.reduce((sum, lead) => sum + valueOf(lead), 0),
          totalLost: lost.reduce((sum, lead) => sum + valueOf(lead), 0),
          wonCount: won.length,
          lostCount: lost.length,
        },
        effort: {
          activities: currentActivities.length,
          calls: currentActivities.filter((item) => item.type === "call")
            .length,
          tasksCompleted: currentTasks.filter(
            (item) => item.status === "completed",
          ).length,
          tasksOverdue: currentTasks.filter(
            (item) =>
              item.status !== "completed" &&
              item.dueDate &&
              new Date(item.dueDate) < now,
          ).length,
          emailsSent: emailHistory.filter((item) => item.success).length,
          emailOpens: automations.reduce(
            (sum, item) => sum + (item.openCount || 0),
            0,
          ),
          emailClicks: automations.reduce(
            (sum, item) => sum + (item.clickCount || 0),
            0,
          ),
          emailReplies: automations.filter(
            (item) => item.leadReplied && new Date(item.lastReplyDate) >= start,
          ).length,
          medianSpeedToLeadHours:
            Math.round(median(speedToLeadHours) * 10) / 10,
        },
        comparison: {
          newLeads: {
            current: periodLeads.length,
            previous: previousLeads.length,
            delta: delta(periodLeads.length, previousLeads.length),
          },
          wins: {
            current: won.length,
            previous: previousWon.length,
            delta: delta(won.length, previousWon.length),
          },
          winRate: {
            current: winRate,
            previous: previousWinRate,
            delta: Math.round((winRate - previousWinRate) * 10) / 10,
          },
        },
      },
    };
    if (searchParams.get("format") === "csv") return csvResponse(report);
    return NextResponse.json(report);
  } catch (error) {
    console.error("Error generating CRM reports", error);
    return NextResponse.json(
      { error: "Failed to generate reports" },
      { status: 500 },
    );
  }
}
