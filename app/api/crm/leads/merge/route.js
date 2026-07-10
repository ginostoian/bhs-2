import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";
import LeadNote from "@/models/LeadNote";
import LeadTask from "@/models/LeadTask";
import EmailAutomation from "@/models/EmailAutomation";

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const { primaryLeadId, duplicateLeadIds = [] } = await request.json();
  const ids = duplicateLeadIds.filter((id) => id !== primaryLeadId);
  if (!primaryLeadId || !ids.length)
    return NextResponse.json(
      { error: "Primary and duplicate leads are required" },
      { status: 400 },
    );
  const [primary, duplicates] = await Promise.all([
    Lead.findById(primaryLeadId),
    Lead.find({ _id: { $in: ids } }),
  ]);
  if (!primary || duplicates.length !== ids.length)
    return NextResponse.json(
      { error: "One or more leads were not found" },
      { status: 404 },
    );

  primary.tags = [
    ...new Set([
      ...(primary.tags || []),
      ...duplicates.flatMap((lead) => lead.tags || []),
    ]),
  ];
  primary.projectTypes = [
    ...new Set([
      ...(primary.projectTypes || []),
      ...duplicates.flatMap((lead) => lead.projectTypes || []),
    ]),
  ];
  for (const field of [
    "phone",
    "address",
    "assignedTo",
    "expectedCloseDate",
    "customProjectType",
  ]) {
    if (!primary[field])
      primary[field] = duplicates.find((lead) => lead[field])?.[field];
  }
  primary.estimatedValue = Math.max(
    primary.estimatedValue || primary.value || 0,
    ...duplicates.map((lead) => lead.estimatedValue || lead.value || 0),
  );
  primary.value = primary.estimatedValue;
  primary.versionHistory.push({
    field: "merged",
    oldValue: ids,
    newValue: primary._id,
    changedBy: session.user.id,
    comment: "Duplicate leads merged",
  });
  await primary.save();

  await Promise.all([
    LeadActivity.updateMany(
      { leadId: { $in: ids } },
      { $set: { leadId: primary._id } },
    ),
    LeadNote.updateMany(
      { leadId: { $in: ids } },
      { $set: { leadId: primary._id } },
    ),
    LeadTask.updateMany(
      { leadId: { $in: ids } },
      { $set: { leadId: primary._id } },
    ),
  ]);
  const automations = await EmailAutomation.find({
    leadId: { $in: [primary._id, ...ids] },
  });
  let primaryAutomation = automations.find(
    (item) => String(item.leadId) === String(primary._id),
  );
  if (!primaryAutomation && automations.length) {
    primaryAutomation = automations[0];
    primaryAutomation.leadId = primary._id;
  }
  if (primaryAutomation) {
    primaryAutomation.emailHistory = automations
      .flatMap((item) => item.emailHistory || [])
      .sort((a, b) => new Date(a.sentAt) - new Date(b.sentAt));
    await primaryAutomation.save();
    await EmailAutomation.deleteMany({
      _id: {
        $in: automations
          .filter((item) => String(item._id) !== String(primaryAutomation._id))
          .map((item) => item._id),
      },
    });
  }
  await Lead.updateMany(
    { _id: { $in: ids } },
    {
      $set: {
        isActive: false,
        isArchived: true,
        archivedAt: new Date(),
        archivedBy: session.user.id,
        mergedInto: primary._id,
      },
    },
  );
  return NextResponse.json({ success: true, lead: primary });
}
