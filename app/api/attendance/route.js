import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Attendance from "@/models/Attendance";

export const dynamic = "force-dynamic";

const ATTENDANCE_STATUSES = new Set([
  "Present",
  "Sick",
  "Holiday",
  "Unavailable",
]);

function normalizeAttendanceDate(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

function buildAttendanceDocument(entry, userId) {
  const date = normalizeAttendanceDate(entry.date);
  const hours = Number(entry.hours);
  const projectName = entry.projectName?.trim();

  if (!entry.worker || !date) {
    throw new Error("Employee and a valid date are required");
  }
  if (!entry.project && !projectName) {
    throw new Error("Choose an existing project or enter a one-off project");
  }
  if (!Number.isFinite(hours) || hours < 0 || hours > 24) {
    throw new Error("Hours must be between 0 and 24");
  }
  if (entry.status && !ATTENDANCE_STATUSES.has(entry.status)) {
    throw new Error("Invalid attendance status");
  }

  return {
    worker: entry.worker,
    project: entry.project || undefined,
    projectName: entry.project ? undefined : projectName,
    date,
    status: entry.status || "Present",
    shiftType: entry.shiftType || "custom",
    hours,
    notes: entry.notes?.trim() || undefined,
    createdBy: userId,
    updatedBy: userId,
  };
}

// GET /api/attendance?start=&end=&projectId=&workerId=&status=&page=&limit=
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    const projectId = searchParams.get("projectId");
    const workerId = searchParams.get("workerId");
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    const filter = {};
    if (projectId) filter.project = projectId;
    if (workerId) filter.worker = workerId;
    if (status) filter.status = status;
    if (start || end) {
      filter.date = {};
      if (start) filter.date.$gte = new Date(start);
      if (end) filter.date.$lte = new Date(end);
    }

    const skip = (page - 1) * limit;

    // Optimize queries with lean() and only select needed fields
    const [items, total] = await Promise.all([
      Attendance.find(filter)
        .populate("worker", "name position email")
        .populate("project", "name type user")
        .sort({ date: -1 })
        .skip(skip)
        .limit(limit)
        .lean() // Convert to plain JS objects for better performance
        .exec(),
      Attendance.countDocuments(filter),
    ]);

    return NextResponse.json({ items, total, page, limit });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch attendance" },
      { status: 500 },
    );
  }
}

// POST /api/attendance (single or bulk)
// Body: { entries: [{ worker, project, date, status, shiftType, hours, notes }] }
export async function POST(req) {
  try {
    const session = await requireAdmin(req);
    await connectMongoose();

    const body = await req.json();
    const entries = Array.isArray(body?.entries) ? body.entries : [body];
    if (!entries.length) {
      return NextResponse.json(
        { error: "No entries provided" },
        { status: 400 },
      );
    }

    const docs = entries.map((entry) =>
      buildAttendanceDocument(entry, session?.user?.id),
    );

    // Use ordered: false to continue on duplicates
    const created = await Attendance.insertMany(docs, { ordered: false });
    return NextResponse.json({ created }, { status: 201 });
  } catch (error) {
    // Handle bulk write errors gracefully
    if (error?.writeErrors) {
      const createdCount = error.result?.nInserted || 0;
      return NextResponse.json(
        {
          warning: "Some entries could not be created due to duplicates",
          createdCount,
        },
        { status: 207 },
      );
    }
    const isValidationError = [
      "required",
      "valid date",
      "Choose an existing",
      "Hours must",
      "Invalid attendance",
    ].some((message) => error.message?.includes(message));
    return NextResponse.json(
      { error: error.message || "Failed to create attendance" },
      { status: isValidationError ? 400 : 500 },
    );
  }
}
