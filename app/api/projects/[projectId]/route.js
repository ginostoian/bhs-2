import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/projects/[projectId]
 * Get a specific project (admin only)
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;

    const project = await Project.findById(projectId)
      .populate("user", "name email projectStatus")
      .populate("projectManager", "name position");

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ project });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch project" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/projects/[projectId]
 * Update a specific project (admin only)
 */
export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;
    const body = await req.json();

    // Find the project
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Track if status is being changed to Finished
    const isChangingToFinished =
      body.status === "Finished" && project.status !== "Finished";

    // Update the project
    const updateData = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined)
      updateData.description = body.description;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.status !== undefined) updateData.status = body.status;
    if (body.location !== undefined) updateData.location = body.location;
    if (body.budget !== undefined) updateData.budget = body.budget;
    if (body.priority !== undefined) updateData.priority = body.priority;
    if (body.projectManager !== undefined)
      updateData.projectManager = body.projectManager;
    if (body.notes !== undefined) updateData.notes = body.notes;
    if (body.tags !== undefined) updateData.tags = body.tags;

    // If changing to Finished, set completion date
    if (isChangingToFinished) {
      updateData.completionDate = new Date();
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      updateData,
      { new: true, runValidators: true },
    )
      .populate("user", "name email projectStatus")
      .populate("projectManager", "name position");

    // If project status changed to Finished, also update user's projectStatus
    if (isChangingToFinished && updatedProject.user) {
      await User.findByIdAndUpdate(updatedProject.user._id, {
        projectStatus: "Finished",
      });
    }

    return NextResponse.json({ project: updatedProject });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update project" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/projects/[projectId]
 * Delete a specific project (admin only)
 */
export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;

    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    await Project.findByIdAndDelete(projectId);

    return NextResponse.json({ message: "Project deleted successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete project" },
      { status: 500 },
    );
  }
}
