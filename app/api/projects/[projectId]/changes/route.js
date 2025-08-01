import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import ProjectChange from "@/models/ProjectChange";
import Project from "@/models/Project";
import User from "@/models/User";

/**
 * Project Changes API Route
 * Handles CRUD operations for project changes/extra costs
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectMongoose();
    const { projectId } = params;

    // Verify project exists and user has access
    const project = await Project.findById(projectId)
      .populate("user", "name email")
      .lean();

    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Check if user is admin or project owner
    const isAdmin = session.user.role === "admin";
    const isProjectOwner = project.user._id.toString() === session.user.id;

    if (!isAdmin && !isProjectOwner) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Get project changes
    const changes = await ProjectChange.getProjectChanges(projectId);

    return new Response(JSON.stringify({ changes }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching project changes:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Only admins can create project changes
    if (session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectMongoose();
    const { projectId } = params;
    const body = await request.json();

    // Verify project exists
    const project = await Project.findById(projectId)
      .populate("user", "name email")
      .lean();

    if (!project) {
      return new Response(JSON.stringify({ error: "Project not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Create new project change
    const projectChange = new ProjectChange({
      project: projectId,
      user: project.user._id,
      name: body.name,
      description: body.description,
      cost: body.cost,
      type: body.type,
      includedInPaymentPlan: body.includedInPaymentPlan || "Not Included",
      adminNotes: body.adminNotes,
    });

    await projectChange.save();

    // Populate the saved change for response
    await projectChange.populate("user", "name email");

    return new Response(JSON.stringify({ change: projectChange }), {
      status: 201,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating project change:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
