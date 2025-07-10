import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import ProjectNote from "@/models/ProjectNote";
import Project from "@/models/Project";

/**
 * PUT /api/projects/[projectId]/notes/[noteId]
 * Update a specific note
 */
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectMongoose();
    const { projectId, noteId } = params;
    const body = await request.json();

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find and update the note
    const note = await ProjectNote.findOneAndUpdate(
      { _id: noteId, project: projectId },
      {
        title: body.title,
        content: body.content,
        tags: body.tags || [],
        customTag: body.customTag,
        isImportant: body.isImportant || false,
        attachments: body.attachments || [],
        modifiedBy: session.user.id,
      },
      { new: true, runValidators: true },
    )
      .populate("createdBy", "name email role")
      .populate("modifiedBy", "name email role");

    if (!note) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ note }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating project note:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * DELETE /api/projects/[projectId]/notes/[noteId]
 * Delete a specific note
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectMongoose();
    const { projectId, noteId } = params;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Find and delete the note
    const note = await ProjectNote.findOneAndDelete({
      _id: noteId,
      project: projectId,
    });

    if (!note) {
      return new Response(JSON.stringify({ error: "Note not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(
      JSON.stringify({ message: "Note deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error deleting project note:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
