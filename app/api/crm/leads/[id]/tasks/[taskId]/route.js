import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// PATCH - Update a single task (e.g., mark as done)
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined" || params.id === "null") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }
    if (!params.taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 });
    }

    const body = await request.json();
    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    const task = lead.tasks.id(params.taskId);
    if (!task) {
      return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    if (body.status) {
      task.status = body.status;
      if (body.status === "completed") {
        task.completedAt = new Date();
      }
    }
    if (body.priority) {
      task.priority = body.priority;
    }
    await lead.save();
    await lead.populate("tasks.assignedTo", "name email");
    await lead.populate("tasks.createdBy", "name email");
    return NextResponse.json({ success: true, task }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json(
      { error: "Failed to update task" },
      { status: 500 },
    );
  }
}
