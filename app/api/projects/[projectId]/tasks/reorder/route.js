import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * POST /api/projects/[projectId]/tasks/reorder
 * Reorder tasks within a project (admin only)
 */
export async function POST(req, { params }) {
  try {
    // Verify admin access
    await requireAdmin(req);

    // Parse request body
    const { tasks } = await req.json();

    if (!tasks || !Array.isArray(tasks)) {
      return NextResponse.json(
        { error: "tasks array is required" },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectMongoose();

    const { projectId } = params;

    // Group tasks by section
    const tasksBySection = {};
    for (const task of tasks) {
      const sectionId = task.sectionId || task.section;
      if (!tasksBySection[sectionId]) {
        tasksBySection[sectionId] = [];
      }
      tasksBySection[sectionId].push(task);
    }

    // Update each section's tasks
    for (const [sectionId, sectionTasks] of Object.entries(tasksBySection)) {
      const session = await Task.startSession();
      try {
        await session.withTransaction(async () => {
          // Update the order field for each task in this section
          for (let i = 0; i < sectionTasks.length; i++) {
            const task = sectionTasks[i];
            await Task.findByIdAndUpdate(
              task.id,
              {
                order: i + 1,
              },
              { session },
            );
          }
        });
      } finally {
        await session.endSession();
      }
    }

    return NextResponse.json({
      message: "Tasks reordered successfully",
      updatedCount: tasks.length,
    });
  } catch (error) {
    console.error("POST /api/projects/[projectId]/tasks/reorder error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reorder tasks" },
      { status: 500 },
    );
  }
}
