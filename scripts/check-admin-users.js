const connectMongo = require("../libs/mongoose.js");
const User = require("../models/User.js");

async function checkAdminUsers() {
  try {
    await connectMongo();

    console.log("Checking for admin users...");

    // Get all users
    const allUsers = await User.find({}).lean();
    console.log(`Total users: ${allUsers.length}`);

    // Get admin users
    const adminUsers = await User.find({ role: "admin" }).lean();
    console.log(`Admin users: ${adminUsers.length}`);

    if (adminUsers.length > 0) {
      console.log("Admin users found:");
      adminUsers.forEach((user) => {
        console.log(
          `- ${user.name || "No name"} (${user.email}) - Role: ${user.role}`,
        );
      });
    } else {
      console.log("No admin users found!");
      console.log("All users:");
      allUsers.forEach((user) => {
        console.log(
          `- ${user.name || "No name"} (${user.email}) - Role: ${user.role || "No role"}`,
        );
      });
    }

    process.exit(0);
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  }
}

checkAdminUsers();
