import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Project from "@/models/Project";
import { requireAdmin } from "@/libs/requireAdmin";

export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    console.log(
      "Starting migration to add projectedFinishDate to all projects...",
    );

    // Find all projects that don't have projectedFinishDate field
    const projectsWithoutField = await Project.find({
      projectedFinishDate: { $exists: false },
    });

    console.log(
      `Found ${projectsWithoutField.length} projects without projectedFinishDate field`,
    );

    if (projectsWithoutField.length === 0) {
      console.log("All projects already have projectedFinishDate field");
      return NextResponse.json({
        message: "All projects already have projectedFinishDate field",
        updatedCount: 0,
      });
    }

    // Update all projects to add the projectedFinishDate field with null value
    const result = await Project.updateMany(
      { projectedFinishDate: { $exists: false } },
      { $set: { projectedFinishDate: null } },
    );

    console.log(
      `Updated ${result.modifiedCount} projects with projectedFinishDate field`,
    );

    // Verify the update
    const projectsAfterUpdate = await Project.find({
      projectedFinishDate: { $exists: false },
    });

    console.log(
      `Projects without projectedFinishDate after update: ${projectsAfterUpdate.length}`,
    );

    return NextResponse.json({
      message: "Migration completed successfully!",
      updatedCount: result.modifiedCount,
      remainingWithoutField: projectsAfterUpdate.length,
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      { error: error.message || "Migration failed" },
      { status: 500 },
    );
  }
}
