import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import { CRM_STAGES, normalizeCRMStage } from "@/libs/crmStages";
import { updateEmailAutomationStage } from "@/libs/crmEmailAutomation";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const { leadIds, action, value } = await request.json();
  if (!Array.isArray(leadIds) || !leadIds.length)
    return NextResponse.json(
      { error: "Select at least one lead" },
      { status: 400 },
    );

  if (action === "assign") {
    await Lead.updateMany(
      { _id: { $in: leadIds } },
      { $set: { assignedTo: value || null } },
    );
  } else if (action === "tag") {
    await Lead.updateMany(
      { _id: { $in: leadIds } },
      { $addToSet: { tags: value } },
    );
  } else if (action === "archive") {
    await Lead.updateMany(
      { _id: { $in: leadIds } },
      {
        $set: {
          isArchived: true,
          archivedAt: new Date(),
          archivedBy: session.user.id,
        },
      },
    );
  } else if (action === "stage") {
    const stage = normalizeCRMStage(value);
    if (!CRM_STAGES.includes(stage))
      return NextResponse.json({ error: "Invalid stage" }, { status: 400 });
    const leads = await Lead.find({ _id: { $in: leadIds } });
    for (const lead of leads) {
      await lead.updateStage(stage, session.user.id, "Bulk stage change");
      await updateEmailAutomationStage(lead._id, stage);
    }
  } else {
    return NextResponse.json(
      { error: "Unsupported bulk action" },
      { status: 400 },
    );
  }
  return NextResponse.json({ success: true, updated: leadIds.length });
}
