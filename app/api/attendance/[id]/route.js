import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Attendance from "@/models/Attendance";

export const dynamic = "force-dynamic";

const ALLOWED_FIELDS = new Set([
  "worker",
  "project",
  "projectName",
  "date",
  "status",
  "shiftType",
  "hours",
  "notes",
]);

export async function PATCH(req, { params }) {
  try {
    const session = await requireAdmin(req);
    await connectMongoose();
    const body = await req.json();
    const updates = Object.fromEntries(
      Object.entries(body).filter(([key]) => ALLOWED_FIELDS.has(key)),
    );

    if (updates.date !== undefined) {
      const date = new Date(updates.date);
      if (Number.isNaN(date.getTime())) {
        return NextResponse.json({ error: "Invalid date" }, { status: 400 });
      }
      date.setUTCHours(0, 0, 0, 0);
      updates.date = date;
    }
    if (updates.hours !== undefined) {
      updates.hours = Number(updates.hours);
      if (
        !Number.isFinite(updates.hours) ||
        updates.hours < 0 ||
        updates.hours > 24
      ) {
        return NextResponse.json(
          { error: "Hours must be between 0 and 24" },
          { status: 400 },
        );
      }
    }
    if (updates.project) {
      updates.projectName = null;
    } else if (updates.projectName?.trim()) {
      updates.project = null;
      updates.projectName = updates.projectName.trim();
    } else if ("project" in updates || "projectName" in updates) {
      return NextResponse.json(
        { error: "Choose an existing project or enter a one-off project" },
        { status: 400 },
      );
    }
    if (typeof updates.notes === "string") updates.notes = updates.notes.trim();
    updates.updatedBy = session?.user?.id;
    const doc = await Attendance.findByIdAndUpdate(params.id, updates, {
      new: true,
      runValidators: true,
    })
      .populate("worker", "name position email")
      .populate("project", "name type user");
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ attendance: doc });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const res = await Attendance.findByIdAndDelete(params.id);
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 },
    );
  }
}
