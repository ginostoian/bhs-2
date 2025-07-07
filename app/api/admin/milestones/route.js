import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Milestone from "../../../../models/Milestone.js";
import Project from "../../../../models/Project.js";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';


// GET /api/admin/milestones?projectId=xxx
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    await connectMongoose();
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { error: "Project ID is required" },
        { status: 400 },
      );
    }

    // Verify project exists and user has access
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get milestones for the project
    const milestones = await Milestone.getProjectMilestones(projectId);

    return NextResponse.json({ milestones });
  } catch (error) {
    console.error("Error fetching milestones:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}

// POST /api/admin/milestones
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.role || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    await connectMongoose();
    const body = await request.json();
    const { projectId, name, description, date, type, color, icon, notes } =
      body;

    if (!projectId || !name || !date) {
      return NextResponse.json(
        { error: "Project ID, name, and date are required" },
        { status: 400 },
      );
    }

    // Verify project exists
    const project = await Project.findById(projectId);
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Get next order number
    const order = await Milestone.getNextOrder(projectId);

    // Create milestone
    const milestone = new Milestone({
      project: projectId,
      name,
      description,
      date: new Date(date),
      type: type || "Custom",
      color: color || "#3B82F6",
      icon: icon || "🎯",
      notes,
      order,
    });

    await milestone.save();

    return NextResponse.json({ milestone }, { status: 201 });
  } catch (error) {
    console.error("Error creating milestone:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
