import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import Employee from "@/models/Employee";
import TaskStatusUpdate from "@/models/TaskStatusUpdate";
import { requireAuth } from "@/libs/requireAdmin";
import { notifyTaskStatusUpdateRequest } from "@/libs/notificationService";

/**
 * POST /api/employee/tasks/[taskId]/status-update
 * Submit task status update request for admin approval (employee only)
 */
export async function POST(req, { params }) {
  try {
    await connectMongoose();
    const { taskId } = params;
    const body = await req.json();

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

    // Find the task
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Check if task is assigned to this employee
    if (
      !task.assignedTo ||
      task.assignedTo.toString() !== employee._id.toString()
    ) {
      return NextResponse.json(
        { error: "You can only update tasks assigned to you" },
        { status: 403 },
      );
    }

    // Validate status
    const validStatuses = ["Scheduled", "Blocked", "In Progress", "Done"];
    if (!validStatuses.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Check if the requested status is different from current status
    if (body.status === task.status) {
      return NextResponse.json(
        {
          error:
            "The requested status is the same as the current status. No update needed.",
        },
        { status: 400 },
      );
    }

    // Check if there's already a pending request for this task
    const existingRequest = await TaskStatusUpdate.findOne({
      task: taskId,
      requestedBy: employee._id,
      requestStatus: "pending",
    });

    if (existingRequest) {
      return NextResponse.json(
        {
          error:
            "You already have a pending status update request for this task",
        },
        { status: 409 },
      );
    }

    // Create status update request
    const statusUpdate = await TaskStatusUpdate.create({
      task: taskId,
      requestedBy: employee._id,
      currentStatus: task.status,
      requestedStatus: body.status,
      employeeNotes: body.notes || "",
    });

    // Populate the request before returning
    await statusUpdate.populate("task", "name description");
    await statusUpdate.populate("requestedBy", "name position");

    // Send notification to admins
    try {
      await notifyTaskStatusUpdateRequest(
        {
          _id: task._id,
          title: task.name,
          currentStatus: task.status, // Current status
          status: body.status, // Requested status
        },
        {
          name: employee.name,
          position: employee.position,
          notes: body.notes || null,
        },
      );
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      message: "Status update request submitted for admin approval",
      statusUpdate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to submit status update request" },
      { status: 500 },
    );
  }
}
