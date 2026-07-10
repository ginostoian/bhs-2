import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import LeadActivity from "@/models/LeadActivity";

const isAdmin = async () =>
  (await getServerSession(authOptions))?.user?.role === "admin";

export async function PATCH(request, { params }) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const body = await request.json();
  const allowed = [
    "title",
    "description",
    "status",
    "contactMade",
    "dueDate",
    "attachments",
    "metadata",
  ];
  const updates = Object.fromEntries(
    allowed
      .filter((field) => body[field] !== undefined)
      .map((field) => [field, body[field]]),
  );
  if (updates.dueDate) updates.dueDate = new Date(updates.dueDate);
  const activity = await LeadActivity.findOneAndUpdate(
    { _id: params.activityId, leadId: params.id },
    { $set: updates },
    { new: true, runValidators: true },
  ).populate("createdBy", "name email");
  if (!activity)
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  return NextResponse.json({ success: true, activity });
}

export async function DELETE(_request, { params }) {
  if (!(await isAdmin()))
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const activity = await LeadActivity.findOneAndDelete({
    _id: params.activityId,
    leadId: params.id,
  });
  if (!activity)
    return NextResponse.json({ error: "Activity not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
