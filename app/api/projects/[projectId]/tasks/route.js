import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";
import TaskSection from "@/models/TaskSection";
import Project from "@/models/Project";
import Employee from "@/models/Employee";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/projects/[projectId]/tasks
 * List all tasks for a project (admin only)
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;
    const tasks = await Task.find({ project: projectId })
      .populate("assignedTo", "name position")
      .populate("section", "name color icon")
      .sort({ "section.order": 1, order: 1 });
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch tasks" },
      { status: 401 },
    );
  }
}

/**
 * POST /api/projects/[projectId]/tasks
 * Create a new task for a project (admin only)
 */
export async function POST(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;
    const body = await req.json();
    // Validate required fields
    if (!body.section || !body.name) {
      return NextResponse.json(
        { error: "Section and task name are required" },
        { status: 400 },
      );
    }
    // Ensure project and section exist
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    const section = await TaskSection.findById(body.section);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }
    // Get next order
    const order = await Task.getNextOrder(body.section);
    // Optionally validate assigned employee
    let assignedTo = null;
    if (body.assignedTo) {
      const employee = await Employee.findById(body.assignedTo);
      if (!employee) {
        return NextResponse.json(
          { error: "Assigned employee not found" },
          { status: 404 },
        );
      }
      assignedTo = employee._id;
    }
    // Create task
    const task = await Task.create({
      project: projectId,
      section: body.section,
      name: body.name,
      description: body.description,
      status: body.status || "Scheduled",
      assignedTo,
      estimatedDuration: body.estimatedDuration,
      dueDate: body.dueDate,
      priority: body.priority,
      order,
      notes: body.notes,
      tags: body.tags,
    });

    // Populate the task before returning
    await task.populate("assignedTo", "name position");
    await task.populate("section", "name color icon");

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create task" },
      { status: 500 },
    );
  }
}
