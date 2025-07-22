import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import { requireAdmin } from "@/libs/requireAdmin";

export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    // Find all projects that don't have projectedFinishDate field
    const projectsWithoutField = await Project.find({
      projectedFinishDate: { $exists: false },
    }).select("_id name");

    // Find all projects that have projectedFinishDate field
    const projectsWithField = await Project.find({
      projectedFinishDate: { $exists: true },
    }).select("_id name projectedFinishDate");

    return NextResponse.json({
      projectsWithoutField: projectsWithoutField.length,
      projectsWithField: projectsWithField.length,
      totalProjects: projectsWithoutField.length + projectsWithField.length,
      sampleProjectsWithField: projectsWithField.slice(0, 5),
      sampleProjectsWithoutField: projectsWithoutField.slice(0, 5),
    });
  } catch (error) {
    console.error("Check failed:", error);
    return NextResponse.json(
      { error: error.message || "Check failed" },
      { status: 500 },
    );
  }
}
