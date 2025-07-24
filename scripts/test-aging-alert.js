require("dotenv").config({ path: ".env.local" });
const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

async function testAgingAlert() {
  try {
    console.log("🧪 Testing aging alert functionality...");
    await connectMongo();

    // Define schemas inline for the script
    const leadSchema = new mongoose.Schema({
      name: String,
      email: String,
      stage: String,
      agingDays: Number,
      agingPaused: Boolean,
      isActive: Boolean,
      isArchived: Boolean,
    });

    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
      role: String,
    });

    const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    // Get all active leads first
    const allLeads = await Lead.find({ isActive: true, isArchived: false });
    console.log(`📊 Found ${allLeads.length} total active leads`);

    // Check aging leads manually
    const agingLeads = allLeads.filter(
      (lead) =>
        (lead.agingDays || 0) >= 2 &&
        !["Won", "Lost"].includes(lead.stage) &&
        !lead.agingPaused,
    );

    console.log(`📊 Found ${agingLeads.length} aging leads`);

    // Get all admin users
    const admins = await User.find({ role: "admin" });
    console.log(`👥 Found ${admins.length} admin users`);

    if (agingLeads.length === 0) {
      console.log("❌ No aging leads found - this is why no emails are sent!");
      return;
    }

    if (admins.length === 0) {
      console.log("❌ No admin users found - this is why no emails are sent!");
      return;
    }

    console.log(
      "✅ Both aging leads and admin users found - emails should be sent",
    );

    // Test the API endpoint
    console.log("\n📧 Testing aging alert API...");

    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/crm/notifications/aging-leads`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    if (response.ok) {
      const data = await response.json();
      console.log("✅ Aging alert API test successful:");
      console.log("   Message:", data.message);
      if (data.details) {
        console.log("   Details:", JSON.stringify(data.details, null, 2));
      }
    } else {
      const errorData = await response.json();
      console.log("❌ Aging alert API test failed:");
      console.log("   Status:", response.status);
      console.log("   Error:", errorData.error);
    }
  } catch (error) {
    console.error("❌ Error testing aging alert:", error);
  } finally {
    process.exit(0);
  }
}

testAgingAlert();
