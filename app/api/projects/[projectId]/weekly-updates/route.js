import mongoose from "mongoose";
import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Project from "@/models/Project";
import ProjectWeeklyUpdate from "@/models/ProjectWeeklyUpdate";

export const dynamic = "force-dynamic";
const allowedSchedule = new Set(["none", "at-risk", "delayed"]);
const allowedCost = new Set(["none", "possible", "confirmed"]);

function mondayUtc(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() - ((date.getUTCDay() + 6) % 7));
  return date;
}

export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    if (!mongoose.isValidObjectId(params.projectId)) return NextResponse.json({ error: "Invalid project" }, { status: 400 });
    const project = await Project.exists({ _id: params.projectId });
    if (!project) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    const updates = await ProjectWeeklyUpdate.find({ project: params.projectId })
      .sort({ weekStart: -1 }).limit(30)
      .populate("updatedBy", "name email").lean();
    return NextResponse.json({ updates });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not load updates" }, { status: 500 });
  }
}

export async function POST(req, { params }) {
  try {
    const admin = await requireAdmin(req);
    await connectMongoose();
    if (!mongoose.isValidObjectId(params.projectId)) return NextResponse.json({ error: "Invalid project" }, { status: 400 });
    if (!await Project.exists({ _id: params.projectId })) return NextResponse.json({ error: "Project not found" }, { status: 404 });
    const body = await req.json();
    const weekStart = mondayUtc(body.weekStart);
    const completed = String(body.completed || "").trim();
    const nextWeek = String(body.nextWeek || "").trim();
    if (!weekStart || !completed || !nextWeek || completed.length > 4000 || nextWeek.length > 4000 ||
      !allowedSchedule.has(body.scheduleImpact || "none") || !allowedCost.has(body.costImpact || "none")) {
      return NextResponse.json({ error: "Complete this week and next week, with valid impact levels" }, { status: 400 });
    }
    const update = await ProjectWeeklyUpdate.findOneAndUpdate(
      { project: params.projectId, weekStart },
      { $set: {
        completed, nextWeek,
        blockers: String(body.blockers || "").trim().slice(0, 4000),
        decisionsNeeded: String(body.decisionsNeeded || "").trim().slice(0, 4000),
        scheduleImpact: body.scheduleImpact || "none",
        costImpact: body.costImpact || "none",
        updatedBy: admin.user.id,
      }, $setOnInsert: { createdBy: admin.user.id } },
      { upsert: true, new: true, runValidators: true },
    ).populate("updatedBy", "name email");
    return NextResponse.json({ update });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Could not save update" }, { status: 500 });
  }
}
