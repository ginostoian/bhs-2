import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import TaskSection from "@/models/TaskSection";
import Project from "@/models/Project";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/projects/[projectId]/sections
 * List all sections for a project (admin only)
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;
    const sections = await TaskSection.find({
      project: projectId,
      isActive: true,
    }).sort({ order: 1, name: 1 });
    return NextResponse.json({ sections });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch sections" },
      { status: 401 },
    );
  }
}

/**
 * POST /api/projects/[projectId]/sections
 * Create a new section for a project (admin only)
 */
export async function POST(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { projectId } = params;
    const body = await req.json();
    // Validate required fields
    if (!body.name) {
      return NextResponse.json(
        { error: "Section name is required" },
        { status: 400 },
      );
    }
    // Ensure project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }
    // Get next order
    const order = await TaskSection.getNextOrder(projectId);
    // Create section
    const section = await TaskSection.create({
      project: projectId,
      name: body.name,
      description: body.description,
      color: body.color,
      icon: body.icon,
      order,
      notes: body.notes,
    });
    return NextResponse.json({ section }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create section" },
      { status: 500 },
    );
  }
}
