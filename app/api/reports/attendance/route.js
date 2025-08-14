import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Attendance from "@/models/Attendance";

export const dynamic = "force-dynamic";

// GET /api/reports/attendance?start=&end=
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { searchParams } = new URL(req.url);
    const start = searchParams.get("start");
    const end = searchParams.get("end");

    const match = {};
    if (start) match.date = { ...(match.date || {}), $gte: new Date(start) };
    if (end) match.date = { ...(match.date || {}), $lte: new Date(end) };

    const pipeline = [
      { $match: match },
      {
        $group: {
          _id: "$worker",
          days: { $sum: { $cond: [{ $eq: ["$status", "Present"] }, 1, 0] } },
          hours: { $sum: { $ifNull: ["$hours", 0] } },
          projectIds: { $addToSet: "$project" },
          customProjectNames: { $addToSet: "$projectName" },
        },
      },
      {
        $lookup: {
          from: "employees",
          localField: "_id",
          foreignField: "_id",
          as: "worker",
        },
      },
      { $unwind: "$worker" },
      {
        $lookup: {
          from: "projects",
          localField: "projectIds",
          foreignField: "_id",
          as: "projectsData",
        },
      },
      {
        $project: {
          worker: {
            _id: "$worker._id",
            name: "$worker.name",
            type: "$worker.type",
          },
          days: 1,
          hours: 1,
          projects: {
            $concatArrays: [
              // Regular project names from lookup
              {
                $map: {
                  input: "$projectsData",
                  as: "p",
                  in: "$$p.name",
                },
              },
              // Custom project names (filter out null values)
              {
                $filter: {
                  input: "$customProjectNames",
                  as: "customName",
                  cond: { $ne: ["$$customName", null] },
                },
              },
            ],
          },
        },
      },
      { $sort: { days: -1 } },
    ];

    const rows = await Attendance.aggregate(pipeline);
    return NextResponse.json({ rows });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to generate report" },
      { status: 500 },
    );
  }
}
