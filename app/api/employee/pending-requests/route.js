import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import TaskStatusUpdate from "@/models/TaskStatusUpdate";
import Employee from "@/models/Employee";
import { requireAuth } from "@/libs/requireAdmin";

/**
 * GET /api/employee/pending-requests
 * Get pending status update requests for the current employee
 */
export async function GET(req) {
  try {
    await connectMongoose();

    // Get current user (must be employee)
    const session = await requireAuth(req);
    if (session.user.role !== "employee") {
      return NextResponse.json(
        { error: "Employee access required" },
        { status: 403 },
      );
    }

    // Find the employee record
    const employee = await Employee.findOne({ email: session.user.email });
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    // Get pending requests for this employee
    const pendingRequests = await TaskStatusUpdate.getEmployeePendingRequests(
      employee._id,
    );

    return NextResponse.json({ pendingRequests });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch pending requests" },
      { status: 500 },
    );
  }
}
