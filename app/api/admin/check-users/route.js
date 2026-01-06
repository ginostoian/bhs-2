import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "../../../../libs/mongoose";
import User from "../../../../models/User";
import Project from "../../../../models/Project";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    console.log("Session data:", session);

    if (!session) {
      return NextResponse.json(
        { error: "No session found - Please log in" },
        { status: 401 },
      );
    }

    if (!session.user) {
      return NextResponse.json(
        { error: "No user data in session" },
        { status: 401 },
      );
    }

    if (session.user.role !== "admin") {
      return NextResponse.json(
        {
          error: `Unauthorized - User role is ${session.user.role}, admin required`,
        },
        { status: 401 },
      );
    }

    await connectMongoose();

    // Fetch users and projects in parallel
    const [users, projects] = await Promise.all([
      User.find({}, { email: 1, name: 1, projectStatus: 1, role: 1 }).lean(),
      Project.find({}, { user: 1 }).lean()
    ]);

    // Grouping and processing
    const projectUserIds = new Set(projects.map((p) => p.user.toString()));
    
    // Count users by status
    const statusCounts = {};
    const ongoingUsers = [];
    const usersWithoutProjects = [];
    const usersWithProjects = [];

    for (const user of users) {
      const status = user.projectStatus || "Lead";
      statusCounts[status] = (statusCounts[status] || 0) + 1;
      
      if (user.projectStatus === "On Going") {
        const hasProject = projectUserIds.has(user._id.toString());
        ongoingUsers.push({ ...user, hasProject });
        if (!hasProject) {
          usersWithoutProjects.push(user);
        } else {
          usersWithProjects.push(user);
        }
      }
    }

    return NextResponse.json({
      success: true,
      summary: {
        totalUsers: users.length,
        statusCounts,
        totalProjects: projects.length,
        ongoingUsers: ongoingUsers.length,
        usersWithoutProjects: usersWithoutProjects.length,
        usersWithProjects: usersWithProjects.length,
      },
      users: users.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        role: u.role || "user",
        projectStatus: u.projectStatus,
      })),
      ongoingUsers: ongoingUsers.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        hasProject: u.hasProject,
      })),
      usersWithoutProjects: usersWithoutProjects.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
      })),
    });
  } catch (error) {
    console.error("❌ Failed to check users:", error);
    return NextResponse.json(
      { error: "Failed to check users", details: error.message },
      { status: 500 },
    );
  }
}
