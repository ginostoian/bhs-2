import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import ProjectChange from "@/models/ProjectChange";
import Project from "@/models/Project";

/**
 * Individual Project Change API Route
 * Handles GET, PUT, DELETE operations for specific project changes
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
    const { projectId, changeId } = params;

    // Get project change
    const change = await ProjectChange.findById(changeId)
      .populate("user", "name email")
      .populate("decidedBy", "name")
      .lean();

    if (!change) {
      return new Response(JSON.stringify({ error: "Change not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    return new Response(JSON.stringify({ change }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching project change:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectMongoose();
    const { projectId, changeId } = params;
    const body = await request.json();

    // Get project change
    const change = await ProjectChange.findById(changeId);
    if (!change) {
      return new Response(JSON.stringify({ error: "Change not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

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

    // Check if user is admin or project owner
    const isAdmin = session.user.role === "admin";
    const isProjectOwner = project.user._id.toString() === session.user.id;

    if (!isAdmin && !isProjectOwner) {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Update fields based on user role
    if (isAdmin) {
      // Admins can update all fields
      if (body.name !== undefined) change.name = body.name;
      if (body.description !== undefined) change.description = body.description;
      if (body.cost !== undefined) change.cost = body.cost;
      if (body.type !== undefined) change.type = body.type;
      if (body.includedInPaymentPlan !== undefined)
        change.includedInPaymentPlan = body.includedInPaymentPlan;
      if (body.adminNotes !== undefined) change.adminNotes = body.adminNotes;
      if (body.status !== undefined) {
        change.status = body.status;
        if (body.status !== "Review") {
          change.decisionDate = new Date();
          change.decidedBy = session.user.id;
        }
      }
    } else {
      // Project owners can only update status to Accept/Decline
      if (body.status && ["Accepted", "Declined"].includes(body.status)) {
        change.status = body.status;
        change.decisionDate = new Date();
        change.decidedBy = session.user.id;
      }
    }

    await change.save();

    // Populate the updated change for response
    await change.populate("user", "name email");
    await change.populate("decidedBy", "name");

    return new Response(JSON.stringify({ change }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error updating project change:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    // Only admins can delete project changes
    if (session.user.role !== "admin") {
      return new Response(JSON.stringify({ error: "Access denied" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    await connectMongoose();
    const { changeId } = params;

    // Get project change
    const change = await ProjectChange.findById(changeId);
    if (!change) {
      return new Response(JSON.stringify({ error: "Change not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    await ProjectChange.findByIdAndDelete(changeId);

    return new Response(
      JSON.stringify({ message: "Change deleted successfully" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error deleting project change:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
