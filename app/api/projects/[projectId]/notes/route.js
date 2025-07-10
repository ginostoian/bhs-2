import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import ProjectNote from "@/models/ProjectNote";
import Project from "@/models/Project";

/**
 * GET /api/projects/[projectId]/notes
 * Get all notes for a project with optional filtering
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectMongoose();
    const { projectId } = params;
    const { searchParams } = new URL(request.url);

    // Get filter parameters
    const tag = searchParams.get("tag");
    const important = searchParams.get("important");
    const search = searchParams.get("search");

    // Build filters object
    const filters = {};
    if (tag) filters.tag = tag;
    if (important !== null) filters.important = important === "true";
    if (search) filters.search = search;

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get notes with filters
    const notes = await ProjectNote.getProjectNotes(projectId, filters);

    return new Response(JSON.stringify({ notes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching project notes:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

/**
 * POST /api/projects/[projectId]/notes
 * Create a new note for a project
 */
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectMongoose();
    const { projectId } = params;
    const body = await request.json();

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create new note
    const note = new ProjectNote({
      project: projectId,
      title: body.title,
      content: body.content,
      tags: body.tags || [],
      customTag: body.customTag,
      isImportant: body.isImportant || false,
      attachments: body.attachments || [],
      createdBy: session.user.id,
    });

    await note.save();

    // Populate createdBy field
    await note.populate("createdBy", "name email role");

    return new Response(JSON.stringify({ note }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating project note:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
