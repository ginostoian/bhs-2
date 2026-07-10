import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadActivity from "@/models/LeadActivity";

const getAdmin = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin" ? session : null;
};

export async function GET(_request, { params }) {
  const session = await getAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const activities = await LeadActivity.find({ leadId: params.id })
    .populate("createdBy", "name email")
    .sort({ occurredAt: -1, createdAt: -1 });
  return NextResponse.json({ activities });
}

export async function POST(request, { params }) {
  const session = await getAdmin();
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const body = await request.json();
  if (!body.type || !body.title?.trim()) {
    return NextResponse.json(
      { error: "Activity type and title are required" },
      { status: 400 },
    );
  }
  const lead = await Lead.findById(params.id);
  if (!lead)
    return NextResponse.json({ error: "Lead not found" }, { status: 404 });
  const activity = await lead.addActivity({
    type: body.type,
    title: body.title.trim(),
    description: body.description?.trim(),
    contactMade: Boolean(body.contactMade),
    dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
    occurredAt: body.occurredAt ? new Date(body.occurredAt) : new Date(),
    createdBy: session.user.id,
    attachments: body.attachments || [],
    metadata: body.metadata || {},
  });
  await activity.populate("createdBy", "name email");
  return NextResponse.json({ success: true, activity }, { status: 201 });
}
