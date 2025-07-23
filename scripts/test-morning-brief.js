require("dotenv").config({ path: ".env.local" });
const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

async function testMorningBrief() {
  try {
    console.log("🧪 Testing morning brief functionality...");
    await connectMongo();

    // Define schemas inline for the script
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

    // Test the morning brief API
    console.log("\n📧 Testing morning brief API...");

    // Create a simple fetch request to test the API
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/crm/morning-brief`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // You might need to add authentication headers here
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Morning brief API test successful:");
      console.log("   Message:", data.message);
      if (data.details) {
        console.log("   Details:", JSON.stringify(data.details, null, 2));
      }
    } else {
      const errorData = await response.json();
      console.log("❌ Morning brief API test failed:");
      console.log("   Status:", response.status);
      console.log("   Error:", errorData.error);
    }
  } catch (error) {
    console.error("❌ Error testing morning brief:", error);
  } finally {
    process.exit(0);
  }
}

testMorningBrief();
