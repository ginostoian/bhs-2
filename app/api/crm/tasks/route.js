import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import LeadTask from "@/models/LeadTask";

export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const { searchParams } = new URL(request.url);
  const query = {};
  const scope = searchParams.get("scope") || "mine";
  if (scope === "mine") query.assignedTo = session.user.id;
  if (searchParams.get("assignedTo"))
    query.assignedTo = searchParams.get("assignedTo");
  if (searchParams.get("status")) query.status = searchParams.get("status");
  if (searchParams.get("priority"))
    query.priority = searchParams.get("priority");
  if (searchParams.get("window") === "overdue")
    query.dueDate = { $lt: new Date() };
  if (searchParams.get("window") === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(end.getDate() + 1);
    query.dueDate = { $gte: start, $lt: end };
  }
  const tasks = await LeadTask.find(query)
    .populate("leadId", "name email stage leadScore")
    .populate("assignedTo", "name email")
    .sort({ status: 1, dueDate: 1, priority: -1 })
    .limit(250);
  return NextResponse.json({ tasks });
}
