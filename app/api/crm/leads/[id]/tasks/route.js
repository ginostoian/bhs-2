import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

// GET - Fetch tasks for a lead
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined") {
      return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
    }

    const lead = await Lead.findById(params.id)
      .populate("tasks.assignedTo", "name email")
      .populate("tasks.createdBy", "name email")
      .select("tasks");

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ tasks: lead.tasks });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return NextResponse.json(
      { error: "Failed to fetch tasks" },
      { status: 500 },
    );
  }
}

// POST - Add a new task to a lead
export async function POST(request, { params }) {
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

    const body = await request.json();
    const { title, description, status, priority, dueDate, assignedTo } = body;

    if (!title) {
      return NextResponse.json(
        { error: "Task title is required" },
        { status: 400 },
      );
    }

    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    const task = {
      title,
      description,
      status: "pending",
      priority: priority || "medium",
      dueDate: dueDate ? new Date(dueDate) : null,
      assignedTo,
      createdBy: session.user.id,
    };

    await lead.addTask(task);

    // Populate the new task
    await lead.populate("tasks.assignedTo", "name email");
    await lead.populate("tasks.createdBy", "name email");

    const newTask = lead.tasks[lead.tasks.length - 1];

    return NextResponse.json({ success: true, task: newTask }, { status: 201 });
  } catch (error) {
    console.error("Error adding task:", error);
    return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
  }
}

// PATCH - Update a task (e.g., mark as done)
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
    const { taskId } = params;
    if (!taskId) {
      return NextResponse.json({ error: "Task ID required" }, { status: 400 });
    }

    const body = await request.json();
    const lead = await Lead.findById(params.id);
    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }
    const task = lead.tasks.id(taskId);
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
