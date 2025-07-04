const mongoose = require("mongoose");

// MongoDB connection string - you'll need to set this
const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/bhstudio";

// Define schemas inline for simplicity
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  projectStatus: String,
  createdAt: Date,
});

const projectSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  name: String,
  description: String,
  type: String,
  status: String,
  startDate: Date,
  location: String,
  priority: String,
  progress: Number,
  tags: [String],
});

const User = mongoose.model("User", userSchema);
const Project = mongoose.model("Project", projectSchema);

/**
 * Migration script to create Project records for users with "On Going" status
 * Run this script to populate the projects table with existing users
 */
async function createProjectsForUsers() {
  try {
    console.log("🔗 Connecting to MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    console.log("📋 Finding users with 'On Going' status...");
    const ongoingUsers = await User.find({ projectStatus: "On Going" });
    console.log(`Found ${ongoingUsers.length} users with 'On Going' status`);

    let createdCount = 0;
    let skippedCount = 0;

    for (const user of ongoingUsers) {
      // Check if project already exists for this user
      const existingProject = await Project.findOne({ user: user._id });

      if (existingProject) {
        console.log(
          `⏭️  Project already exists for ${user.name || user.email} - skipping`,
        );
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
        tags: ["migrated"],
      };

      const project = await Project.create(projectData);
      console.log(
        `✅ Created project for ${user.name || user.email}: ${project.name}`,
      );
      createdCount++;
    }

    console.log("\n📊 Migration Summary:");
    console.log(`- Total users with 'On Going' status: ${ongoingUsers.length}`);
    console.log(`- Projects created: ${createdCount}`);
    console.log(`- Projects skipped (already existed): ${skippedCount}`);

    if (createdCount > 0) {
      console.log("\n🎉 Migration completed successfully!");
      console.log(
        "You can now view projects in the admin panel at /admin/projects",
      );
    } else {
      console.log(
        "\nℹ️  No new projects were created (all users already have projects)",
      );
    }
  } catch (error) {
    console.error("❌ Migration failed:", error);
  } finally {
    await mongoose.disconnect();
    process.exit(0);
  }
}

// Run the migration
createProjectsForUsers();
