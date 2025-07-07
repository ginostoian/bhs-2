import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import {
  notifyUserRegistration,
  notifyEmployeeCreation,
  notifyTaskAssignment,
  notifySystemAlert,
} from "@/libs/notificationService";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * POST /api/test-notifications
 * Test endpoint to create sample notifications (admin only)
 */
export async function POST(req) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    const body = await req.json();
    const { testType } = body;

    let result;

    switch (testType) {
      case "user_registration":
        result = await notifyUserRegistration({
          name: "Test User",
          email: "test@example.com",
        });
        break;

      case "employee_creation":
        result = await notifyEmployeeCreation({
          name: "Test Employee",
          email: "employee@example.com",
          position: "Developer",
        });
        break;

      case "task_assignment":
        result = await notifyTaskAssignment(session.user.id, {
          _id: "test-task-id",
          title: "Test Task",
        });
        break;

      case "system_alert":
        result = await notifySystemAlert("This is a test system alert", "high");
        break;

      default:
        return NextResponse.json(
          { error: "Invalid test type" },
          { status: 400 },
        );
    }

    return NextResponse.json({
      message: `Test notification created successfully`,
      result,
    });
  } catch (error) {
    console.error("Test notification error:", error);
    return NextResponse.json(
      { error: "Failed to create test notification" },
      { status: 500 },
    );
  }
}
