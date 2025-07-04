import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "../../../../libs/mongoose";
import User from "../../../../models/User";
import Project from "../../../../models/Project";

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

    // Get all users with their project status
    const users = await User.find(
      {},
      { email: 1, name: 1, projectStatus: 1 },
    ).lean();

    // Get all projects
    const projects = await Project.find({}, { user: 1, name: 1 }).lean();

    // Count users by status
    const statusCounts = users.reduce((acc, user) => {
      const status = user.projectStatus || "Lead";
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {});

    // Check which users with "On Going" status have projects
    const ongoingUsers = users.filter((u) => u.projectStatus === "On Going");
    const projectUserIds = projects.map((p) => p.user.toString());

    const usersWithoutProjects = ongoingUsers.filter(
      (u) => !projectUserIds.includes(u._id.toString()),
    );

    const usersWithProjects = ongoingUsers.filter((u) =>
      projectUserIds.includes(u._id.toString()),
    );

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
      ongoingUsers: ongoingUsers.map((u) => ({
        id: u._id.toString(),
        name: u.name,
        email: u.email,
        hasProject: projectUserIds.includes(u._id.toString()),
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
