import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import TaskStatusUpdate from "@/models/TaskStatusUpdate";
import Task from "@/models/Task";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";
import {
  notifyTaskStatusApproved,
  notifyTaskStatusRejected,
} from "@/libs/notificationService";

/**
 * GET /api/admin/task-status-updates
 * Get all pending task status update requests (admin only)
 */
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const pendingRequests = await TaskStatusUpdate.getPendingRequests().lean();

    // Convert to plain objects
    const requestsData = pendingRequests.map((request) => ({
      id: request._id.toString(),
      task: request.task
        ? {
            id: request.task._id.toString(),
            name: request.task.name,
            description: request.task.description,
            project: request.task.project,
          }
        : null,
      requestedBy: request.requestedBy
        ? {
            id: request.requestedBy._id.toString(),
            name: request.requestedBy.name,
            position: request.requestedBy.position,
          }
        : null,
      reviewedBy: request.reviewedBy
        ? {
            id: request.reviewedBy._id.toString(),
            name: request.reviewedBy.name,
          }
        : null,
      currentStatus: request.currentStatus,
      requestedStatus: request.requestedStatus,
      requestStatus: request.requestStatus,
      employeeNotes: request.employeeNotes,
      adminNotes: request.adminNotes,
      requestedAt: request.requestedAt,
      reviewedAt: request.reviewedAt,
      createdAt: request.createdAt,
      updatedAt: request.updatedAt,
    }));

    return NextResponse.json({ pendingRequests: requestsData });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch pending requests" },
      { status: 401 },
    );
  }
}

/**
 * POST /api/admin/task-status-updates
 * Approve or reject a task status update request (admin only)
 */
export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const body = await req.json();

    const { requestId, action, adminNotes } = body;

    if (!requestId || !action) {
      return NextResponse.json(
        { error: "Request ID and action are required" },
        { status: 400 },
      );
    }

    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json(
        { error: "Action must be 'approve' or 'reject'" },
        { status: 400 },
      );
    }

    // Find the status update request
    const statusUpdate = await TaskStatusUpdate.findById(requestId);
    if (!statusUpdate) {
      return NextResponse.json(
        { error: "Status update request not found" },
        { status: 404 },
      );
    }

    if (statusUpdate.requestStatus !== "pending") {
      return NextResponse.json(
        { error: "Request has already been processed" },
        { status: 409 },
      );
    }

    // Get admin user info
    const session = await requireAdmin(req);

    // Update the request status
    statusUpdate.requestStatus = action === "approve" ? "approved" : "rejected";
    statusUpdate.reviewedBy = session.user.id;
    statusUpdate.reviewedAt = new Date();
    statusUpdate.adminNotes = adminNotes || "";

    await statusUpdate.save();

    // If approved, update the actual task status
    if (action === "approve") {
      const task = await Task.findById(statusUpdate.task);
      if (task) {
        task.status = statusUpdate.requestedStatus;

        // Set actual start date when status changes to "In Progress"
        if (
          statusUpdate.requestedStatus === "In Progress" &&
          !task.actualStartDate
        ) {
          task.actualStartDate = new Date();
        }

        // Set completion date when status changes to "Done"
        if (statusUpdate.requestedStatus === "Done" && !task.completionDate) {
          task.completionDate = new Date();

          // Calculate actual duration if actual start date exists
          if (task.actualStartDate) {
            const start = new Date(task.actualStartDate);
            const completion = new Date(task.completionDate);
            const diffTime = Math.abs(completion - start);
            task.actualDuration = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          }
        }

        await task.save();
      }
    }

    // Populate the updated request
    await statusUpdate.populate("task", "name description project");
    await statusUpdate.populate("requestedBy", "name position");
    await statusUpdate.populate("reviewedBy", "name");

    // Send notification to employee
    try {
      const employee = await User.findById(statusUpdate.requestedBy);

      if (employee) {
        if (action === "approve") {
          await notifyTaskStatusApproved(employee._id, {
            _id: statusUpdate.task._id,
            title: statusUpdate.task.name,
          });
        } else {
          await notifyTaskStatusRejected(
            employee._id,
            { _id: statusUpdate.task._id, title: statusUpdate.task.name },
            adminNotes,
          );
        }
      }
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({
      message: `Status update request ${action}d successfully`,
      statusUpdate,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to process status update request" },
      { status: 500 },
    );
  }
}
