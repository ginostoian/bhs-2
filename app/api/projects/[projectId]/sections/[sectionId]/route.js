import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import TaskSection from "@/models/TaskSection";
import Task from "@/models/Task";
import Project from "@/models/Project";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * PUT /api/projects/[projectId]/sections/[sectionId]
 * Update a section (admin only)
 */
export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId, sectionId } = params;
    const body = await req.json();

    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Section name is required" },
        { status: 400 },
      );
    }

    // Ensure project and section exist
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const section = await TaskSection.findById(sectionId);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Update section
    const updatedSection = await TaskSection.findByIdAndUpdate(
      sectionId,
      {
        name: body.name,
        description: body.description,
        color: body.color,
        icon: body.icon,
        notes: body.notes,
      },
      { new: true, runValidators: true },
    );

    return NextResponse.json({ section: updatedSection });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update section" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/projects/[projectId]/sections/[sectionId]
 * Delete a section (admin only)
 */
export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId, sectionId } = params;

    // Ensure project and section exist
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    const section = await TaskSection.findById(sectionId);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // First, delete all tasks in this section
    await Task.deleteMany({ section: sectionId });

    // Then soft delete the section by setting isActive to false
    await TaskSection.findByIdAndUpdate(sectionId, { isActive: false });

    return NextResponse.json({
      message: "Section and all its tasks deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete section" },
      { status: 500 },
    );
  }
}
