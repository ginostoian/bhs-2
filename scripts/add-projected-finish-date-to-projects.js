const connectMongoose = require("../libs/mongoose.js");
const Project = require("../models/Project.js");

async function addProjectedFinishDateToProjects() {
  try {
    await connectMongoose();
    console.log("Connected to MongoDB");

    // Find all projects that don't have projectedFinishDate field
    const projectsWithoutField = await Project.find({
      projectedFinishDate: { $exists: false },
    });

    console.log(
      `Found ${projectsWithoutField.length} projects without projectedFinishDate field`,
    );

    if (projectsWithoutField.length === 0) {
      console.log("All projects already have projectedFinishDate field");
      return;
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

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
  } finally {
    process.exit(0);
  }
}

addProjectedFinishDateToProjects();
