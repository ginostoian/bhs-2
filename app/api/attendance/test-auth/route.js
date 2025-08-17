import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Attendance from "@/models/Attendance";

export const dynamic = "force-dynamic";

// GET /api/attendance/test-auth - Test authentication and attendance logic
export async function GET(req) {
  try {
    // Test 1: Check authentication
    let authStatus = "unknown";
    let userInfo = null;
    try {
      const session = await requireAdmin(req);
      authStatus = "authenticated";
      userInfo = {
        id: session.user.id,
        email: session.user.email,
        role: session.user.role,
      };
    } catch (error) {
      authStatus = `failed: ${error.message}`;
    }

    // Test 2: Test attendance query (if authenticated)
    let queryStatus = "not tested";
    let queryResult = null;

    if (authStatus === "authenticated") {
      try {
        await connectMongoose();

        // Test the exact query from the main attendance endpoint
        const start = new Date();
        start.setDate(1); // First day of current month
        const end = new Date();
        end.setMonth(end.getMonth() + 1, 0); // Last day of current month

        const filter = {
          date: {
            $gte: start,
            $lte: end,
          },
        };

        const [items, total] = await Promise.all([
          Attendance.find(filter)
            .populate("worker", "name position email")
            .populate("project", "name type user")
            .sort({ date: -1 })
            .limit(10)
            .exec(),
          Attendance.countDocuments(filter),
        ]);

        queryStatus = "success";
        queryResult = {
          itemsCount: items.length,
          total,
          sampleItem:
            items.length > 0
              ? {
                  id: items[0]._id,
                  worker: items[0].worker?.name || "No worker",
                  project:
                    items[0].project?.name ||
                    items[0].projectName ||
                    "No project",
                  date: items[0].date,
                }
              : null,
        };
      } catch (error) {
        queryStatus = `failed: ${error.message}`;
        queryResult = { error: error.stack };
      }
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      tests: {
        authentication: authStatus,
        user: userInfo,
        attendanceQuery: queryStatus,
        queryResult,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
