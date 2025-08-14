import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Attendance from "@/models/Attendance";

export const dynamic = "force-dynamic";

// GET /api/attendance/distinct/projects?start=&end=
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const match = {};
    if (start || end) {
      match.date = {};
      if (start) match.date.$gte = new Date(start);
      if (end) match.date.$lte = new Date(end);
    }

    const rows = await Attendance.aggregate([
      { $match: match },
      { $group: { _id: "$project", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "projects",
          localField: "_id",
          foreignField: "_id",
          as: "project",
        },
      },
      { $unwind: "$project" },
      {
        $project: {
          _id: 0,
          id: "$project._id",
          name: "$project.name",
          count: 1,
        },
      },
      { $sort: { name: 1 } },
    ]);

    return NextResponse.json({ projects: rows });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch distinct projects" },
      { status: 500 },
    );
  }
}

