import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Attendance from "@/models/Attendance";
import Employee from "@/models/Employee";
import Project from "@/models/Project";

export const dynamic = "force-dynamic";

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

    const docs = entries.map((e) => {
      const doc = {
        worker: e.worker,
        date: e.date,
        status: e.status || "Present",
        shiftType: e.shiftType || "full",
        hours: e.hours,
        notes: e.notes,
        createdBy: session?.user?.id,
        updatedBy: session?.user?.id,
      };

      // Add either project reference or custom project name
      if (e.project) {
        doc.project = e.project;
      } else if (e.projectName) {
        doc.projectName = e.projectName;
      }

      return doc;
    });

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
    return NextResponse.json(
      { error: error.message || "Failed to create attendance" },
      { status: 500 },
    );
  }
}
