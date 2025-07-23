require("dotenv").config({ path: ".env.local" });
const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

async function checkAdminUsers() {
  try {
    console.log("🔍 Checking admin users...");
    await connectMongo();

    // Define user schema inline for the script
    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      role: String,
    });

    const User = mongoose.models.User || mongoose.model("User", userSchema);

    // Get all admin users
    const adminUsers = await User.find({ role: "admin" });
    console.log(`📊 Found ${adminUsers.length} admin users:`);

    adminUsers.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.name} (${user.email})`);
    });

    // Get all users by role
    const allUsers = await User.find({});
    const usersByRole = {};
    allUsers.forEach((user) => {
      if (!usersByRole[user.role]) {
        usersByRole[user.role] = [];
      }
      usersByRole[user.role].push(user);
    });

    console.log("\n📈 Users by role:");
    Object.keys(usersByRole).forEach((role) => {
      console.log(`   ${role}: ${usersByRole[role].length} users`);
    });
  } catch (error) {
    console.error("❌ Error checking admin users:", error);
  } finally {
    process.exit(0);
  }
}

checkAdminUsers();
