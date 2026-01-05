import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/projects
 * List all projects (admin only)
 * Supports pagination with ?page=1&limit=10
 */
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const page = parseInt(searchParams.get("page"));
    const limit = parseInt(searchParams.get("limit")) || 10;

    // Build filter
    const filter = {};
    if (status) {
      filter.status = status;
    }

    // If page is provided, use pagination
    if (page) {
      const skip = (page - 1) * limit;

      const [projects, total] = await Promise.all([
        Project.find(filter)
          .populate("user", "name email")
          .populate("projectManager", "name position")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit),
        Project.countDocuments(filter),
      ]);

      return NextResponse.json({
        projects,
        pagination: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      });
    }

    // Legacy behavior: return all projects
    const projects = await Project.find(filter)
      .populate("user", "name email")
      .populate("projectManager", "name position")
      .sort({ createdAt: -1 });

    return NextResponse.json({ projects });
  } catch (error) {
    console.error("Error in GET /api/projects:", error);
    const status = error.message === "Authentication required" ? 401 : 403;
    return NextResponse.json(
      { error: error.message || "Failed to fetch projects" },
      { status: status === 403 && !error.message ? 500 : status },
    );
  }
}

/**
 * POST /api/projects
 * Create a new project (admin only)
 */
export async function POST(req) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    await connectMongoose();
    // Validate required fields
    if (!body.user || !body.name || !body.type) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    // Ensure user exists
    const user = await User.findById(body.user);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    // Create project
    const project = await Project.create({
      user: user._id,
      name: body.name,
      description: body.description,
      type: body.type,
      status: body.status || "On Going",
      startDate: body.startDate,
      location: body.location,
      budget: body.budget,
      priority: body.priority,
      projectManager: body.projectManager,
      notes: body.notes,
      tags: body.tags,
    });
    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create project" },
      { status: 500 },
    );
  }
}
