import { NextResponse } from "next/server";
import { authorizeCronOrAdmin } from "@/libs/cronAuth";
import connectMongo from "@/libs/mongoose";
import LeadActivity from "@/models/LeadActivity";
import Notification from "@/models/Notification";

const run = async (request) => {
  if (!(await authorizeCronOrAdmin(request)))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const activities = await LeadActivity.find({
    status: "pending",
    dueDate: { $lte: new Date() },
    "metadata.dueNotificationSentAt": { $exists: false },
  }).populate("leadId", "name");
  let sent = 0;
  for (const activity of activities) {
    if (activity.createdBy) {
      await Notification.createNotification({
        recipient: activity.createdBy,
        recipientType: "admin",
        type: "crm_activity_due",
        title: `Activity due: ${activity.title}`,
        message: activity.leadId?.name || "CRM lead",
        relatedId: activity.leadId?._id,
        relatedModel: "Lead",
        priority: "high",
      });
      sent += 1;
    }
    activity.metadata = {
      ...(activity.metadata || {}),
      dueNotificationSentAt: new Date(),
    };
    await activity.save();
  }
  return NextResponse.json({ success: true, sent });
};
export const GET = run;
export const POST = run;
