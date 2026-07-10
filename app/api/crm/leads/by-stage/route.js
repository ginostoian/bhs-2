import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadTask from "@/models/LeadTask";
import EmailAutomation from "@/models/EmailAutomation";
import {
  LEGACY_STAGE_MAP,
  CRM_STAGES,
  normalizeCRMStage,
} from "@/libs/crmStages";
import { calculateLeadScore } from "@/libs/crmScoring";

const legacyValuesFor = (stage) => [
  stage,
  ...Object.entries(LEGACY_STAGE_MAP)
    .filter(([, normalized]) => normalized === stage)
    .map(([legacy]) => legacy),
];

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin")
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const stage = normalizeCRMStage(searchParams.get("stage"));
    if (!CRM_STAGES.includes(stage))
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    const page = Math.max(1, Number(searchParams.get("page")) || 1);
    const limit = Math.min(
      50,
      Math.max(1, Number(searchParams.get("limit")) || 20),
    );
    const query = {
      stage: { $in: legacyValuesFor(stage) },
      isActive: true,
      isArchived: false,
    };

    const search = searchParams.get("search")?.trim();
    if (search)
      query.$or = ["name", "email", "phone", "address"].map((field) => ({
        [field]: { $regex: search, $options: "i" },
      }));
    if (searchParams.get("assignedTo"))
      query.assignedTo = searchParams.get("assignedTo");
    if (searchParams.get("source")) query.source = searchParams.get("source");
    if (searchParams.get("projectType"))
      query.projectTypes = searchParams.get("projectType");
    if (searchParams.get("lifecycleStatus"))
      query.lifecycleStatus = searchParams.get("lifecycleStatus");

    const view = searchParams.get("view");
    if (view === "mine") query.assignedTo = session.user.id;
    if (view === "unassigned") query.assignedTo = { $exists: false };
    if (view === "aging") query.agingDays = { $gte: 7 };
    if (view === "hot") {
      query.$and = [
        ...(query.$and || []),
        {
          $or: [
            { leadScore: { $gte: 70 } },
            { budget: "££££" },
            { clientHealth: "Excellent" },
          ],
        },
      ];
    }

    const skip = (page - 1) * limit;
    const [leads, total, valueAgg] = await Promise.all([
      Lead.find(query)
        .populate("assignedTo", "name email")
        .populate("linkedUser", "name email")
        .sort({ leadScore: -1, updatedAt: -1 })
        .skip(skip)
        .limit(limit),
      Lead.countDocuments(query),
      Lead.aggregate([
        { $match: query },
        {
          $group: {
            _id: null,
            value: { $sum: { $ifNull: ["$estimatedValue", "$value"] } },
          },
        },
      ]),
    ]);

    const leadIds = leads.map((lead) => lead._id);
    const [automations, overdueCounts] = await Promise.all([
      EmailAutomation.find({ leadId: { $in: leadIds } }),
      LeadTask.aggregate([
        {
          $match: {
            leadId: { $in: leadIds },
            status: { $ne: "completed" },
            dueDate: { $lt: new Date() },
          },
        },
        { $group: { _id: "$leadId", count: { $sum: 1 } } },
      ]),
    ]);
    const automationMap = new Map(
      automations.map((item) => [String(item.leadId), item]),
    );
    const overdueMap = new Map(
      overdueCounts.map((item) => [String(item._id), item.count]),
    );

    const leadsWithSignals = leads.map((lead) => {
      const automation = automationMap.get(String(lead._id));
      const leadObject = lead.toObject();
      leadObject.stage = normalizeCRMStage(leadObject.stage);
      leadObject.leadScore = calculateLeadScore(leadObject, automation);
      leadObject.overdueTaskCount = overdueMap.get(String(lead._id)) || 0;
      leadObject.emailAutomation = automation
        ? {
            isActive: automation.isActive,
            currentStage: normalizeCRMStage(automation.currentStage),
            leadReplied: automation.leadReplied,
            pausedAt: automation.pausedAt,
            pausedReason: automation.pausedReason,
            sequenceKey: automation.sequenceKey,
            sequenceStep: automation.sequenceStep,
            nextActionDue: automation.nextActionDue,
          }
        : null;
      return leadObject;
    });

    return NextResponse.json({
      leads: leadsWithSignals,
      pagination: { page, limit, total, hasMore: skip + leads.length < total },
      summary: { count: total, totalValue: valueAgg[0]?.value || 0 },
    });
  } catch (error) {
    console.error("Error fetching leads by stage", error);
    return NextResponse.json(
      { error: "Failed to fetch leads" },
      { status: 500 },
    );
  }
}
