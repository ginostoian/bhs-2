import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import LeadTask from "@/models/LeadTask";

const sessionOrResponse = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin" ? session : null;
};

export async function PATCH(request, { params }) {
  const session = await sessionOrResponse();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const body = await request.json();
  const allowed = [
    "title",
    "description",
    "status",
    "priority",
    "dueDate",
    "remindAt",
    "assignedTo",
  ];
  const updates = Object.fromEntries(
    allowed
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]]),
  );
  if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
  if (updates.remindAt) updates.remindAt = new Date(updates.remindAt);
  if (updates.status === "completed") {
    updates.completedAt = new Date();
    updates.completedBy = session.user.id;
  } else if (updates.status) {
    updates.completedAt = null;
    updates.completedBy = null;
  }
  const task = await LeadTask.findOneAndUpdate(
    { _id: params.taskId, leadId: params.id },
    { $set: updates },
    { new: true, runValidators: true },
  )
    .populate("assignedTo", "name email")
    .populate("createdBy", "name email");
  if (!task)
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json({ success: true, task });
}

export async function DELETE(_request, { params }) {
  const session = await sessionOrResponse();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const task = await LeadTask.findOneAndDelete({
    _id: params.taskId,
    leadId: params.id,
  });
  if (!task)
    return NextResponse.json({ error: "Task not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
