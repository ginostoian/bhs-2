import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "../../../../libs/mongoose";
import User from "../../../../models/User";
import Project from "../../../../models/Project";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';


export async function POST() {
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

    console.log("📋 Finding users with 'On Going' status...");
    const ongoingUsers = await User.find({ projectStatus: "On Going" }).lean();
    console.log(`Found ${ongoingUsers.length} users with 'On Going' status`);

    if (ongoingUsers.length === 0) {
      return NextResponse.json({
        success: true,
        summary: { totalUsers: 0, projectsCreated: 0, projectsSkipped: 0 },
        results: [],
      });
    }

    // Get all existing project user IDs in one go
    const userIds = ongoingUsers.map(u => u._id);
    const existingProjects = await Project.find({ user: { $in: userIds } }, { user: 1 }).lean();
    const existingUserIdsWithProjects = new Set(existingProjects.map(p => p.user.toString()));

    const usersToCreateFor = ongoingUsers.filter(u => !existingUserIdsWithProjects.has(u._id.toString()));
    const skippedCount = ongoingUsers.length - usersToCreateFor.length;

    const results = ongoingUsers.map(user => {
      const exists = existingUserIdsWithProjects.has(user._id.toString());
      return {
        user: user.name || user.email,
        status: exists ? "skipped" : "created",
        reason: exists ? "Project already exists" : null
      };
    });

    // Create missing projects in parallel
    const createdProjects = await Promise.all(usersToCreateFor.map(async (user) => {
      const projectData = {
        user: user._id,
        name: `${user.name || "Project"} - On Going`,
        description: `Project for ${user.name || user.email}`,
        type: "General Renovation", // More realistic default
        status: "On Going",
        startDate: user.createdAt || new Date(),
        location: "Not specified",
        priority: "medium",
        progress: 0,
        tags: ["auto-created"],
      };
      return Project.create(projectData);
    }));

    console.log(`✅ Created ${createdProjects.length} new projects`);

    return NextResponse.json({
      success: true,
      summary: {
        totalUsers: ongoingUsers.length,
        projectsCreated: createdProjects.length,
        projectsSkipped: skippedCount,
      },
      results: results,
    });
  } catch (error) {
    console.error("❌ Failed to create projects:", error);
    return NextResponse.json(
      { error: "Failed to create projects", details: error.message },
      { status: 500 },
    );
  }
}
