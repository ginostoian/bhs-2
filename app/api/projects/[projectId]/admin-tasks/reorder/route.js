import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import AdminTask from "@/models/AdminTask";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * POST /api/projects/[projectId]/admin-tasks/reorder
 * Reorder admin tasks for a project (admin only)
 */
export async function POST(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;
    const body = await req.json();

    if (!body.tasks || !Array.isArray(body.tasks)) {
      return NextResponse.json(
        { error: "Tasks array is required" },
        { status: 400 },
      );
    }

    // Update order for each task
    const updatePromises = body.tasks.map((taskData) =>
      AdminTask.findByIdAndUpdate(taskData.id, { order: taskData.order }),
    );

    await Promise.all(updatePromises);

    // Return updated tasks
    const updatedTasks = await AdminTask.find({ project: projectId })
      .populate("assignedTo", "name email role")
      .sort({ order: 1 });

    return NextResponse.json({ tasks: updatedTasks });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to reorder admin tasks" },
      { status: 500 },
    );
  }
}
