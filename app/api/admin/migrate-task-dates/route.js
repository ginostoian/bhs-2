import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Task from "@/models/Task";

export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectMongoose();

    console.log("Starting task start date migration...");

    // Find all tasks that have startDate but no plannedStartDate
    const tasksToMigrate = await Task.find({
      startDate: { $exists: true, $ne: null },
      $or: [
        { plannedStartDate: { $exists: false } },
        { plannedStartDate: null },
      ],
    });

    console.log(`Found ${tasksToMigrate.length} tasks to migrate`);

    let migratedCount = 0;
    let skippedCount = 0;

    for (const task of tasksToMigrate) {
      try {
        // Move startDate to plannedStartDate
        task.plannedStartDate = task.startDate;

        // If task is "In Progress" or "Done" and has no actualStartDate,
        // set actualStartDate to the same as plannedStartDate
        if (
          (task.status === "In Progress" || task.status === "Done") &&
          !task.actualStartDate
        ) {
          task.actualStartDate = task.startDate;
        }

        // Remove the old startDate field
        task.startDate = undefined;

        await task.save();
        migratedCount++;

        if (migratedCount % 100 === 0) {
          console.log(`Migrated ${migratedCount} tasks...`);
        }
      } catch (error) {
        console.error(`Error migrating task ${task._id}:`, error.message);
        skippedCount++;
      }
    }

    console.log(`Migration completed!`);
    console.log(`- Successfully migrated: ${migratedCount} tasks`);
    console.log(`- Skipped: ${skippedCount} tasks`);

    // Verify migration
    const tasksWithOldField = await Task.find({
      startDate: { $exists: true, $ne: null },
    });
    const tasksWithNewField = await Task.find({
      plannedStartDate: { $exists: true, $ne: null },
    });

    console.log(`\nVerification:`);
    console.log(
      `- Tasks with old startDate field: ${tasksWithOldField.length}`,
    );
    console.log(
      `- Tasks with new plannedStartDate field: ${tasksWithNewField.length}`,
    );

    return NextResponse.json({
      success: true,
      message: "Task start date migration completed successfully",
      migrated: migratedCount,
      skipped: skippedCount,
      verification: {
        tasksWithOldField: tasksWithOldField.length,
        tasksWithNewField: tasksWithNewField.length,
      },
    });
  } catch (error) {
    console.error("Migration failed:", error);
    return NextResponse.json(
      { error: error.message || "Migration failed" },
      { status: 500 },
    );
  }
}
