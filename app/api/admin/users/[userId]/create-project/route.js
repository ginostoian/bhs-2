import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import Project from "@/models/Project";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function POST(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Unauthorized - Admin access required" },
        { status: 401 },
      );
    }

    await connectMongoose();

    const { userId } = params;
    const body = await request.json();

    // Validate user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Extract project data from request body
    const {
      name,
      description,
      type,
      location,
      budget,
      priority = "medium",
      startDate,
      projectedFinishDate,
    } = body;

    // Validate required fields
    if (!name || !type) {
      return NextResponse.json(
        { error: "Project name and type are required" },
        { status: 400 },
      );
    }

    // Create project data
    const projectData = {
      user: userId,
      name: name.trim(),
      description:
        description?.trim() || `Project for ${user.name || user.email}`,
      type: type.trim(),
      status: "On Going",
      startDate: startDate ? new Date(startDate) : new Date(),
      location: location?.trim() || user.address || "Not specified",
      budget: budget ? parseFloat(budget) : null,
      priority,
      progress: 0,
      projectedFinishDate: projectedFinishDate
        ? new Date(projectedFinishDate)
        : null,
      tags: ["manual-created"],
    };

    // Create the project
    const project = await Project.create(projectData);

    // Update user status to "On Going" if they were a "Lead"
    if (user.projectStatus === "Lead") {
      await User.findByIdAndUpdate(userId, { projectStatus: "On Going" });
    }

    // Populate the project with user data for response
    const populatedProject = await Project.findById(project._id)
      .populate("user", "name email")
      .lean();

    console.log(
      `✅ Created project for ${user.name || user.email}: ${project.name}`,
    );

    return NextResponse.json({
      success: true,
      project: {
        id: populatedProject._id.toString(),
        name: populatedProject.name,
        description: populatedProject.description,
        type: populatedProject.type,
        status: populatedProject.status,
        startDate: populatedProject.startDate,
        completionDate: populatedProject.completionDate,
        location: populatedProject.location,
        budget: populatedProject.budget,
        priority: populatedProject.priority,
        progress: populatedProject.progress,
        projectedFinishDate: populatedProject.projectedFinishDate,
        createdAt: populatedProject.createdAt,
        updatedAt: populatedProject.updatedAt,
        user: populatedProject.user
          ? {
              id: populatedProject.user._id.toString(),
              name: populatedProject.user.name,
              email: populatedProject.user.email,
            }
          : null,
        projectManager: null,
      },
    });
  } catch (error) {
    console.error("❌ Failed to create project:", error);
    return NextResponse.json(
      { error: "Failed to create project", details: error.message },
      { status: 500 },
    );
  }
}
