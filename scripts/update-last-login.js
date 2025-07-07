import connectMongoose from "../libs/mongoose.js";
import User from "../models/User.js";

async function updateLastLogin() {
  try {
    await connectMongoose();

    // Update all users to have a recent lastLoginAt (for testing)
    const result = await User.updateMany(
      { lastLoginAt: { $exists: false } },
      {
        lastLoginAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
      },
    );

    console.log(`✅ Updated ${result.modifiedCount} users with lastLoginAt`);

    // Show current users and their lastLoginAt
    const users = await User.find({}).select("name email lastLoginAt").lean();
    console.log("Current users and their lastLoginAt:");
    users.forEach((user) => {
      console.log(
        `${user.name} (${user.email}): ${user.lastLoginAt || "Never"}`,
      );
    });
  } catch (error) {
    console.error("Error updating lastLoginAt:", error);
  } finally {
    process.exit(0);
  }
}

updateLastLogin();
