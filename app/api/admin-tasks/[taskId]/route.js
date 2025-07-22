import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import AdminTask from "@/models/AdminTask";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";
import { sendEmailWithRetry } from "@/libs/emailService";
import Project from "@/models/Project";

/**
 * PATCH /api/admin-tasks/[taskId]
 * Update an admin task (admin only)
 */
export async function PATCH(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { taskId } = params;
    const body = await req.json();

    // Find the task
    const task = await AdminTask.findById(taskId);
    if (!task) {
      return NextResponse.json(
        { error: "Admin task not found" },
        { status: 404 },
      );
    }

    // Get the original task to check for changes
    const originalTask = await AdminTask.findById(taskId).populate(
      "assignedTo",
      "name email role",
    );

    // Validate assigned admin if being changed
    if (body.assignedTo) {
      const assignedAdmin = await User.findById(body.assignedTo);
      if (!assignedAdmin || assignedAdmin.role !== "admin") {
        return NextResponse.json(
          { error: "Assigned user must be an admin" },
          { status: 400 },
        );
      }
    }

    // Update the task
    const updatedTask = await AdminTask.findByIdAndUpdate(
      taskId,
      {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && {
          description: body.description,
        }),
        ...(body.assignedTo && { assignedTo: body.assignedTo }),
        ...(body.priority && { priority: body.priority }),
        ...(body.dueDate && { dueDate: new Date(body.dueDate) }),
        ...(body.status && { status: body.status }),
        ...(body.notes !== undefined && { notes: body.notes }),
        ...(body.tags && { tags: body.tags }),
      },
      { new: true },
    ).populate("assignedTo", "name email role");

    // Send notifications for important changes
    try {
      // If assignment changed, notify the new assignee
      if (
        body.assignedTo &&
        originalTask.assignedTo?._id.toString() !== body.assignedTo
      ) {
        const newAssignee = await User.findById(body.assignedTo);
        const project = await Project.findById(updatedTask.project);

        if (newAssignee && project) {
          const emailResult = await sendEmailWithRetry({
            to: newAssignee.email,
            subject: `Admin Task Reassigned: ${updatedTask.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Admin Task Reassigned</h2>
                <p>Hello ${newAssignee.name || newAssignee.email},</p>
                <p>You have been assigned an admin task:</p>
                
                <div style="background-color: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1e293b;">${updatedTask.name}</h3>
                  ${updatedTask.description ? `<p style="color: #64748b;">${updatedTask.description}</p>` : ""}
                  
                  <div style="display: flex; gap: 20px; margin-top: 15px;">
                    <div>
                      <strong style="color: #475569;">Priority:</strong>
                      <span style="color: #64748b; text-transform: capitalize;">${updatedTask.priority}</span>
                    </div>
                    <div>
                      <strong style="color: #475569;">Due Date:</strong>
                      <span style="color: #64748b;">${updatedTask.dueDate.toLocaleDateString("en-GB")}</span>
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
              </div>
            `,
            text: `
Admin Task Reassigned

Hello ${newAssignee.name || newAssignee.email},

You have been assigned an admin task:

Task: ${updatedTask.name}
${updatedTask.description ? `Description: ${updatedTask.description}` : ""}
Priority: ${updatedTask.priority}
Due Date: ${updatedTask.dueDate.toLocaleDateString("en-GB")}
Project: ${project.name}

Please log into the admin panel to view and manage this task.
            `,
            metadata: {
              type: "admin_task_reassigned",
              taskName: updatedTask.name,
              projectName: project.name,
              dueDate: updatedTask.dueDate.toISOString(),
              priority: updatedTask.priority,
              adminName: newAssignee.name,
              adminEmail: newAssignee.email,
            },
          });

          if (emailResult.success) {
            console.log(
              `✅ Admin task reassignment notification sent to ${newAssignee.email}`,
            );
          }
        }
      }

      // If status changed to "Done", notify project manager or admin
      if (body.status === "Done" && originalTask.status !== "Done") {
        const project = await Project.findById(updatedTask.project).populate(
          "projectManager",
          "name email",
        );
        const adminEmail =
          project?.projectManager?.email || process.env.SUPPORT_EMAIL;

        if (adminEmail) {
          const emailResult = await sendEmailWithRetry({
            to: adminEmail,
            subject: `Admin Task Completed: ${updatedTask.name}`,
            html: `
              <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #16a34a;">Admin Task Completed</h2>
                <p>The following admin task has been marked as completed:</p>
                
                <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                  <h3 style="margin-top: 0; color: #1e293b;">${updatedTask.name}</h3>
                  ${updatedTask.description ? `<p style="color: #64748b;">${updatedTask.description}</p>` : ""}
                  
                  <div style="margin-top: 15px;">
                    <strong style="color: #475569;">Completed by:</strong>
                    <span style="color: #64748b;">${updatedTask.assignedTo?.name || updatedTask.assignedTo?.email}</span>
                  </div>
                  
                  <div style="margin-top: 15px;">
                    <strong style="color: #475569;">Project:</strong>
                    <span style="color: #64748b;">${project?.name || "Unknown"}</span>
                  </div>
                </div>
              </div>
            `,
            text: `
Admin Task Completed

The following admin task has been marked as completed:

Task: ${updatedTask.name}
${updatedTask.description ? `Description: ${updatedTask.description}` : ""}
Completed by: ${updatedTask.assignedTo?.name || updatedTask.assignedTo?.email}
Project: ${project?.name || "Unknown"}
            `,
            metadata: {
              type: "admin_task_completed",
              taskName: updatedTask.name,
              projectName: project?.name,
              completedBy:
                updatedTask.assignedTo?.name || updatedTask.assignedTo?.email,
            },
          });

          if (emailResult.success) {
            console.log(
              `✅ Admin task completion notification sent to ${adminEmail}`,
            );
          }
        }
      }
    } catch (notificationError) {
      console.error("Failed to send update notification:", notificationError);
      // Don't fail the request if notification fails
    }

    return NextResponse.json({ task: updatedTask });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update admin task" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/admin-tasks/[taskId]
 * Delete an admin task (admin only)
 */
export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { taskId } = params;

    const task = await AdminTask.findByIdAndDelete(taskId);
    if (!task) {
      return NextResponse.json(
        { error: "Admin task not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Admin task deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete admin task" },
      { status: 500 },
    );
  }
}
