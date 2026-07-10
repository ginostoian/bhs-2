import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import LeadNote from "@/models/LeadNote";
import LeadTask from "@/models/LeadTask";
import EmailAutomation from "@/models/EmailAutomation";
import { enrichCRMHistory } from "@/libs/crmHistoryServer";

export async function GET(_request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const [lead, activities, notes, tasks, automation] = await Promise.all([
    Lead.findById(params.id)
      .select("versionHistory")
      .populate("versionHistory.changedBy", "name email")
      .lean(),
    LeadActivity.find({ leadId: params.id })
      .populate("createdBy", "name email")
      .lean(),
    LeadNote.find({ leadId: params.id })
      .populate("createdBy", "name email")
      .lean(),
    LeadTask.find({ leadId: params.id })
      .populate("assignedTo", "name email")
      .lean(),
    EmailAutomation.findOne({ leadId: params.id }).lean(),
  ]);
  if (!lead)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const history = await enrichCRMHistory(lead.versionHistory || []);

  const timeline = [
    ...activities.map((item) => ({
      kind: "activity",
      at: item.occurredAt || item.createdAt,
      item,
    })),
    ...notes.map((item) => ({ kind: "note", at: item.createdAt, item })),
    ...tasks.map((item) => ({ kind: "task", at: item.createdAt, item })),
    ...history.map((item) => ({
      kind: "history",
      at: item.changedAt,
      item,
    })),
    ...(automation?.emailHistory || []).map((item) => ({
      kind: "email",
      at: item.sentAt,
      item,
    })),
  ].sort((a, b) => new Date(b.at) - new Date(a.at));
  return NextResponse.json({ timeline });
}
