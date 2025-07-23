require("dotenv").config({ path: ".env.local" });
const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

async function checkLinkedUsers() {
  try {
    console.log("🔍 Checking linked users for leads...");
    await connectMongo();

    // Define schemas inline for the script
    const leadSchema = new mongoose.Schema({
      name: String,
      email: String,
      linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isActive: { type: Boolean, default: true },
      isArchived: { type: Boolean, default: false },
      stage: String,
    });

    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
    });

    const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    // Get all active leads with linked users
    const leads = await Lead.find({
      isActive: true,
      isArchived: false,
      linkedUser: { $exists: true, $ne: null },
    }).populate("linkedUser", "name email");

    console.log(`📊 Found ${leads.length} leads with linked users`);

    // Group by stage
    const leadsByStage = {};
    leads.forEach((lead) => {
      if (!leadsByStage[lead.stage]) {
        leadsByStage[lead.stage] = [];
      }
      leadsByStage[lead.stage].push(lead);
    });

    // Display leads by stage
    Object.keys(leadsByStage).forEach((stage) => {
      console.log(`\n📋 Stage: ${stage} (${leadsByStage[stage].length} leads)`);
      leadsByStage[stage].forEach((lead) => {
        const userInfo = lead.linkedUser
          ? `${lead.linkedUser.name} (${lead.linkedUser.email})`
          : "No user data";
        console.log(`   - "${lead.name}" (${lead.email}) → ${userInfo}`);
      });
    });

    // Check for leads that should have linked users but don't
    console.log("\n🔍 Checking for leads that should have linked users...");
    const allLeads = await Lead.find({ isActive: true, isArchived: false });
    const allUsers = await User.find({});

    const userEmails = allUsers.map((user) => user.email.toLowerCase());
    const leadsWithoutLinks = allLeads.filter(
      (lead) =>
        !lead.linkedUser && userEmails.includes(lead.email.toLowerCase()),
    );

    if (leadsWithoutLinks.length > 0) {
      console.log(
        `⚠️  Found ${leadsWithoutLinks.length} leads that should have linked users:`,
      );
      leadsWithoutLinks.forEach((lead) => {
        console.log(
          `   - "${lead.name}" (${lead.email}) - Stage: ${lead.stage}`,
        );
      });
    } else {
      console.log(
        "✅ All leads that should have linked users are properly linked!",
      );
    }
  } catch (error) {
    console.error("❌ Error checking linked users:", error);
  } finally {
    process.exit(0);
  }
}

checkLinkedUsers();
