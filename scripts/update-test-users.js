import connectMongoose from "../libs/mongoose.js";
import User from "../models/User.js";

async function updateTestUsers() {
  try {
    await connectMongoose();

    // Get all users
    const users = await User.find({}).select("name email lastLoginAt").lean();
    console.log("Current users:");
    users.forEach((user) => {
      console.log(
        `${user.name || "Unknown"} (${user.email}): ${user.lastLoginAt || "Never"}`,
      );
    });

    if (users.length === 0) {
      console.log("No users found");
      return;
    }

    // Update first user to have a recent login (1 day ago)
    const recentUser = users[0];
    await User.findByIdAndUpdate(recentUser._id, {
      lastLoginAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
    });
    console.log(`✅ Updated ${recentUser.email} to have recent login`);

    // Update second user to have an old login (15 days ago) - should show as inactive
    if (users.length > 1) {
      const oldUser = users[1];
      await User.findByIdAndUpdate(oldUser._id, {
        lastLoginAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000), // 15 days ago
      });
      console.log(`✅ Updated ${oldUser.email} to have old login (inactive)`);
    }

    // Update third user to have no lastLoginAt (should show as inactive)
    if (users.length > 2) {
      const neverUser = users[2];
      await User.findByIdAndUpdate(neverUser._id, {
        $unset: { lastLoginAt: 1 },
      });
      console.log(
        `✅ Updated ${neverUser.email} to have no lastLoginAt (inactive)`,
      );
    }

    console.log("\nUpdated users:");
    const updatedUsers = await User.find({})
      .select("name email lastLoginAt")
      .lean();
    updatedUsers.forEach((user) => {
      console.log(
        `${user.name || "Unknown"} (${user.email}): ${user.lastLoginAt || "Never"}`,
      );
    });
  } catch (error) {
    console.error("Error updating test users:", error);
  } finally {
    process.exit(0);
  }
}

updateTestUsers();
