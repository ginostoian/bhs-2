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
    const ongoingUsers = await User.find({ projectStatus: "On Going" });
    console.log(`Found ${ongoingUsers.length} users with 'On Going' status`);

    let createdCount = 0;
    let skippedCount = 0;
    const results = [];

    for (const user of ongoingUsers) {
      // Check if project already exists for this user
      const existingProject = await Project.findOne({ user: user._id });

      if (existingProject) {
        console.log(
          `⏭️  Project already exists for ${user.name || user.email} - skipping`,
        );
        results.push({
          user: user.name || user.email,
          status: "skipped",
          reason: "Project already exists",
        });
        skippedCount++;
        continue;
      }

      // Create a new project
      const projectData = {
        user: user._id,
        name: `${user.name || "Project"} - On Going`,
        description: `Project for ${user.name || user.email}`,
        type: "renovation", // Default type
        status: "On Going",
        startDate: user.createdAt || new Date(),
        location: "Not specified",
        priority: "medium",
        progress: 0,
        tags: ["auto-created"],
      };

      const project = await Project.create(projectData);
      console.log(
        `✅ Created project for ${user.name || user.email}: ${project.name}`,
      );

      results.push({
        user: user.name || user.email,
        status: "created",
        projectName: project.name,
      });
      createdCount++;
    }

    console.log("\n📊 Migration Summary:");
    console.log(`- Total users with 'On Going' status: ${ongoingUsers.length}`);
    console.log(`- Projects created: ${createdCount}`);
    console.log(`- Projects skipped (already existed): ${skippedCount}`);

    return NextResponse.json({
      success: true,
      summary: {
        totalUsers: ongoingUsers.length,
        projectsCreated: createdCount,
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
