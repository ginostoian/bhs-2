import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import AdminTask from "@/models/AdminTask";
import Project from "@/models/Project";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";
import { sendEmailWithRetry } from "@/libs/emailService";

/**
 * GET /api/projects/[projectId]/admin-tasks
 * List all admin tasks for a project (admin only)
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;
    const tasks = await AdminTask.find({ project: projectId })
      .populate("assignedTo", "name email role")
      .sort({ order: 1 });
    return NextResponse.json({ tasks });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin tasks" },
      { status: 401 },
    );
  }
}

/**
 * POST /api/projects/[projectId]/admin-tasks
 * Create a new admin task for a project (admin only)
 */
export async function POST(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;
    const body = await req.json();

    // Validate required fields
    if (!body.name || !body.assignedTo || !body.dueDate) {
      return NextResponse.json(
        { error: "Task name, assigned admin, and due date are required" },
        { status: 400 },
      );
    }

    // Ensure project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Validate assigned admin user
    const assignedAdmin = await User.findById(body.assignedTo);
    if (!assignedAdmin || assignedAdmin.role !== "admin") {
      return NextResponse.json(
        { error: "Assigned user must be an admin" },
        { status: 400 },
      );
    }

    // Get next order
    const order = await AdminTask.getNextOrder(projectId);

    // Create admin task
    const task = await AdminTask.create({
      project: projectId,
      name: body.name,
      description: body.description,
      assignedTo: body.assignedTo,
      priority: body.priority || "medium",
      dueDate: new Date(body.dueDate),
      status: body.status || "Scheduled",
      order,
      notes: body.notes,
      tags: body.tags || [],
    });

    // Populate the task before returning
    await task.populate("assignedTo", "name email role");

    // Send notification to assigned admin
    try {
      const emailResult = await sendEmailWithRetry({
        to: assignedAdmin.email,
        subject: `New Admin Task Assigned: ${task.name}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">New Admin Task Assigned</h2>
            <p>Hello ${assignedAdmin.name || assignedAdmin.email},</p>
            <p>You have been assigned a new admin task:</p>
            
            <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="margin-top: 0; color: #1e293b;">${task.name}</h3>
              ${task.description ? `<p style="color: #64748b;">${task.description}</p>` : ""}
              
              <div style="display: flex; gap: 20px; margin-top: 15px;">
                <div>
                  <strong style="color: #475569;">Priority:</strong>
                  <span style="color: #64748b; text-transform: capitalize;">${task.priority}</span>
                </div>
                <div>
                  <strong style="color: #475569;">Due Date:</strong>
                  <span style="color: #64748b;">${task.dueDate.toLocaleDateString("en-GB")}</span>
                </div>
              </div>
              
              <div style="margin-top: 15px;">
                <strong style="color: #475569;">Project:</strong>
                <span style="color: #64748b;">${project.name}</span>
              </div>
            </div>
            
            <p style="color: #64748b; font-size: 14px;">
              Please log into the admin panel to view and manage this task.
            </p>
            
            <hr style="border: none; border-top: 1px solid #e2e8f0; margin: 30px 0;">
            <p style="color: #94a3b8; font-size: 12px;">
              This is an automated notification from the BH Studio admin system.
            </p>
          </div>
        `,
        text: `
New Admin Task Assigned

Hello ${assignedAdmin.name || assignedAdmin.email},

You have been assigned a new admin task:

Task: ${task.name}
${task.description ? `Description: ${task.description}` : ""}
Priority: ${task.priority}
Due Date: ${task.dueDate.toLocaleDateString("en-GB")}
Project: ${project.name}

Please log into the admin panel to view and manage this task.

This is an automated notification from the BH Studio admin system.
        `,
        metadata: {
          type: "admin_task_assigned",
          taskName: task.name,
          projectName: project.name,
          dueDate: task.dueDate.toISOString(),
          priority: task.priority,
          description: task.description,
          adminName: assignedAdmin.name,
          adminEmail: assignedAdmin.email,
        },
      });

      if (!emailResult.success) {
        console.error(
          "Failed to send admin task notification:",
          emailResult.error,
        );
      } else {
        console.log(
          `✅ Admin task notification sent to ${assignedAdmin.email}`,
        );
      }
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({ task }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create admin task" },
      { status: 500 },
    );
  }
}
