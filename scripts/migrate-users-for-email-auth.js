const dotenv = require("dotenv");
const connectMongoose = require("../libs/mongoose.js");
const User = require("../models/User.js");

// Load environment variables
dotenv.config({ path: ".env.local" });

/**
 * Migration script to prepare existing users for email authentication
 * This script ensures all existing users have the proper structure
 * and can be safely linked with Google OAuth accounts
 */
async function migrateUsers() {
  try {
    console.log("🔗 Starting user migration for email authentication...");

    // Connect to MongoDB
    await connectMongoose();
    console.log("✅ Connected to MongoDB");

    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users to process`);

    let updatedCount = 0;
    let skippedCount = 0;

    for (const user of users) {
      let needsUpdate = false;
      const updates = {};

      // Ensure email is lowercase
      if (user.email && user.email !== user.email.toLowerCase()) {
        updates.email = user.email.toLowerCase();
        needsUpdate = true;
      }

      // Ensure user has a role (default to "user")
      if (!user.role) {
        updates.role = "user";
        needsUpdate = true;
      }

      // Ensure user has projectStatus (default to "Lead")
      if (!user.projectStatus) {
        updates.projectStatus = "Lead";
        needsUpdate = true;
      }

      // Update user if needed
      if (needsUpdate) {
        await User.updateOne({ _id: user._id }, { $set: updates });
        updatedCount++;
        console.log(`✅ Updated user: ${user.email}`);
      } else {
        skippedCount++;
        console.log(`⏭️  Skipped user: ${user.email} (no changes needed)`);
      }
    }

    console.log("\n🎉 Migration completed!");
    console.log(`📈 Updated: ${updatedCount} users`);
    console.log(`⏭️  Skipped: ${skippedCount} users`);
    console.log(`📊 Total processed: ${users.length} users`);

    // Summary of user roles
    const roleCounts = await User.aggregate([
      { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);

    console.log("\n👥 User role distribution:");
    roleCounts.forEach(({ _id, count }) => {
      console.log(`   ${_id || "no role"}: ${count} users`);
    });
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run migration
migrateUsers();
