import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import TaskSection from "@/models/TaskSection";
import Employee from "@/models/Employee";
import User from "@/models/User";
import { requireAdmin, requireAuth } from "@/libs/requireAdmin";
import { notifyTaskAssignment } from "@/libs/notificationService";

/**
 * PATCH /api/tasks/[taskId]
 * Update task status, assignment, or attachments (admin or assigned employee)
 */
export async function PATCH(req, { params }) {
  try {
    await connectMongoose();
    const { taskId } = params;
    const body = await req.json();
    // Get current user (admin or employee)
    let session;
    try {
      session = await requireAdmin(req);
    } catch {
      // Not admin, check if employee
      session = await requireAuth(req);
    }
    // Find task
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    // If not admin, only allow assigned employee to update
    if (session.user.role !== "admin") {
      if (!task.assignedTo || task.assignedTo.toString() !== session.user.id) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 });
      }
    }
    // Store the previous assignment to check if it changed
    const previousAssignedTo = task.assignedTo;

    // Update allowed fields
    if (body.status) task.status = body.status;
    if (body.assignedTo !== undefined) task.assignedTo = body.assignedTo;
    if (body.attachments) task.attachments = body.attachments;
    if (body.name) task.name = body.name;
    if (body.description) task.description = body.description;
    if (body.section !== undefined) task.section = body.section;
    if (body.estimatedDuration !== undefined)
      task.estimatedDuration = body.estimatedDuration;
    if (body.startDate) task.startDate = body.startDate;
    if (body.priority) task.priority = body.priority;
    if (body.notes) task.notes = body.notes;
    if (body.tags) task.tags = body.tags;
    if (body.order !== undefined) task.order = body.order;
    await task.save();

    // Populate the task before returning
    await task.populate("assignedTo", "name position");
    await task.populate("section", "name color icon");

    // Send notification if task was assigned to a new employee
    if (
      body.assignedTo !== undefined &&
      body.assignedTo &&
      (!previousAssignedTo ||
        previousAssignedTo.toString() !== body.assignedTo.toString())
    ) {
      try {
        // Find the employee to get their email
        const employee = await Employee.findById(body.assignedTo);
        if (employee) {
          // Find the corresponding User record
          const user = await User.findOne({
            email: employee.email,
            role: "employee",
          });
          if (user) {
            await notifyTaskAssignment(user._id, {
              _id: task._id,
              title: task.name,
            });
          }
        }
      } catch (notificationError) {
        console.error(
          "Failed to send task assignment notification:",
          notificationError,
        );
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update task" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/tasks/[taskId]
 * Full task update (admin only)
 */
export async function PUT(req, { params }) {
  try {
    await connectMongoose();
    const { taskId } = params;
    const body = await req.json();

    // Require admin access for full updates
    await requireAdmin(req);

    // Find task
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }

    // Store the previous assignment to check if it changed
    const previousAssignedTo = task.assignedTo;

    // Update all fields, handling null values for ObjectId fields
    Object.assign(task, body);

    // Handle null values for ObjectId fields
    if (body.assignedTo === null) task.assignedTo = null;
    if (body.section === null) task.section = null;

    await task.save();

    // Populate the task before returning
    await task.populate("assignedTo", "name position");
    await task.populate("section", "name color icon");

    // Send notification if task was assigned to a new employee
    if (
      body.assignedTo &&
      (!previousAssignedTo ||
        previousAssignedTo.toString() !== body.assignedTo.toString())
    ) {
      try {
        // Find the employee to get their email
        const employee = await Employee.findById(body.assignedTo);
        if (employee) {
          // Find the corresponding User record
          const user = await User.findOne({
            email: employee.email,
            role: "employee",
          });
          if (user) {
            await notifyTaskAssignment(user._id, {
              _id: task._id,
              title: task.name,
            });
          }
        }
      } catch (notificationError) {
        console.error(
          "Failed to send task assignment notification:",
          notificationError,
        );
        // Don't fail the request if notification fails
      }
    }

    return NextResponse.json({ task });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update task" },
      { status: 500 },
    );
  }
}
