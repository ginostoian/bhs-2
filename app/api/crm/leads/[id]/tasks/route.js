import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadTask from "@/models/LeadTask";
import Notification from "@/models/Notification";

const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin" ? session : null;
};

export async function GET(_request, { params }) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const tasks = await LeadTask.find({ leadId: params.id })
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email")
    .populate("completedBy", "name email")
    .sort({ status: 1, dueDate: 1, createdAt: -1 });
  return NextResponse.json({ tasks });
}

export async function POST(request, { params }) {
  const session = await requireAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const body = await request.json();
  if (!body.title?.trim())
    return NextResponse.json(
      { error: "Task title is required" },
      { status: 400 },
    );

  const lead = await Lead.findById(params.id);
  if (!lead)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });

  const assignedTo = body.assignedTo || lead.assignedTo || undefined;
  const dueDate = body.dueDate ? new Date(body.dueDate) : undefined;
  let remindAt = body.remindAt ? new Date(body.remindAt) : undefined;
  if (!remindAt && dueDate && Number(body.reminderOffsetHours) > 0) {
    remindAt = new Date(
      dueDate.getTime() - Number(body.reminderOffsetHours) * 60 * 60 * 1000,
    );
  }

  const task = await LeadTask.create({
    leadId: lead._id,
    title: body.title.trim(),
    description: body.description?.trim(),
    priority: body.priority || "medium",
    status: body.status || "pending",
    dueDate,
    remindAt,
    assignedTo,
    createdBy: session.user.id,
  });

  if (assignedTo) {
    await Notification.createNotification({
      recipient: assignedTo,
      recipientType: "admin",
      type: "crm_task_assigned",
      title: `Task assigned: ${task.title}`,
      message: `${lead.name}${dueDate ? ` · due ${dueDate.toLocaleString("en-GB")}` : ""}`,
      relatedId: task._id,
      relatedModel: "LeadTask",
      priority: task.priority,
      metadata: { leadId: lead._id },
    });
  }

  await task.populate("assignedTo", "name email");
  await task.populate("createdBy", "name email");
  return NextResponse.json({ success: true, task }, { status: 201 });
}
