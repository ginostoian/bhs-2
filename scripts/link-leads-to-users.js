require("dotenv").config({ path: ".env.local" });
const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

async function linkLeadsToUsers() {
  try {
    console.log("🔗 Starting lead-to-user linking process...");
    await connectMongo();

    // Define schemas inline for the script
    const leadSchema = new mongoose.Schema({
      name: String,
      email: String,
      linkedUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      isActive: { type: Boolean, default: true },
      isArchived: { type: Boolean, default: false },
    });

    const userSchema = new mongoose.Schema({
      name: String,
      email: String,
    });

    const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);
    const User = mongoose.models.User || mongoose.model("User", userSchema);

    // Get all active leads
    const leads = await Lead.find({ isActive: true, isArchived: false });
    console.log(`📊 Found ${leads.length} active leads`);

    // Get all users
    const users = await User.find({});
    console.log(`👥 Found ${users.length} users`);

    // Create email to user mapping
    const userEmailMap = {};
    users.forEach((user) => {
      userEmailMap[user.email.toLowerCase()] = user._id;
    });

    let linkedCount = 0;
    let alreadyLinkedCount = 0;
    let noUserFoundCount = 0;

    for (const lead of leads) {
      const leadEmail = lead.email.toLowerCase();

      if (lead.linkedUser) {
        alreadyLinkedCount++;
        console.log(`✅ Lead "${lead.name}" already linked to user`);
        continue;
      }

      if (userEmailMap[leadEmail]) {
        lead.linkedUser = userEmailMap[leadEmail];
        await lead.save();
        linkedCount++;
        console.log(
          `🔗 Linked lead "${lead.name}" to user with email ${leadEmail}`,
        );
      } else {
        noUserFoundCount++;
        console.log(
          `❌ No user found for lead "${lead.name}" with email ${leadEmail}`,
        );
      }
    }

    console.log("\n📈 Linking Summary:");
    console.log(`   Total leads: ${leads.length}`);
    console.log(`   Already linked: ${alreadyLinkedCount}`);
    console.log(`   Newly linked: ${linkedCount}`);
    console.log(`   No user found: ${noUserFoundCount}`);

    // Show some examples of linked leads
    console.log("\n🔍 Sample of linked leads:");
    const sampleLeads = await Lead.find({
      linkedUser: { $exists: true, $ne: null },
      isActive: true,
      isArchived: false,
    })
      .populate("linkedUser", "name email")
      .limit(5);

    sampleLeads.forEach((lead) => {
      console.log(
        `   - "${lead.name}" (${lead.email}) → ${lead.linkedUser.name} (${lead.linkedUser.email})`,
      );
    });
  } catch (error) {
    console.error("❌ Error linking leads to users:", error);
  } finally {
    process.exit(0);
  }
}

linkLeadsToUsers();
