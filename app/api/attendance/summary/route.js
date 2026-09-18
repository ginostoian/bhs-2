import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Attendance from "@/models/Attendance";
import mongoose from "mongoose";

export const dynamic = "force-dynamic";

// GET /api/attendance/summary?workerId=&start=&end=
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { searchParams } = new URL(req.url);
    const workerId = searchParams.get("workerId");
    const start = searchParams.get("start");
    const end = searchParams.get("end");
    if (!workerId)
      return NextResponse.json({ error: "workerId required" }, { status: 400 });

    const match = { worker: new mongoose.Types.ObjectId(workerId) };
    if (start || end) {
      match.date = {};
      if (start) match.date.$gte = new Date(start);
      if (end) match.date.$lte = new Date(end);
    }

    const rows = await Attendance.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          days: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          hours: { $sum: { $ifNull: ["$hours", 0] } },
          projectIds: { $addToSet: "$project" },
          customProjectNames: { $addToSet: "$projectName" },
        },
      },
      {
        $lookup: {
          from: "projects",
          localField: "projectIds",
          foreignField: "_id",
          as: "projects",
        },
      },
      {
        $project: {
          _id: 0,
          days: 1,
          hours: 1,
          projects: {
            $concatArrays: [
              { $map: { input: "$projects", as: "p", in: "$$p.name" } },
              {
                $filter: {
                  input: "$customProjectNames",
                  as: "name",
                  cond: {
                    $and: [
                      { $ne: ["$$name", null] },
                      { $ne: ["$$name", ""] },
                    ],
                  },
                },
              },
            ],
          },
        },
      },
    ]);

    const summary = rows[0] || { days: 0, hours: 0, projects: [] };
    return NextResponse.json({ summary });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch attendance summary" },
      { status: 500 },
    );
  }
}
