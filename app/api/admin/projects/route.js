import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { Project } from "@/models/index.js";

// GET /api/admin/projects - Get all projects
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access this endpoint
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    const status = searchParams.get("status");

    let query = {};
    if (userId) {
      query.user = userId;
    }
    if (status) {
      query.status = status;
    }

    const projects = await Project.find(query)
      .select("_id name type status user")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    // Convert projects to JSON and ensure _id is a string
    const projectsJson = projects.map((project) => ({
      ...project.toJSON(),
      _id: project._id.toString(),
    }));

    return NextResponse.json({ projects: projectsJson });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Failed to fetch projects" },
      { status: 500 },
    );
  }
}
