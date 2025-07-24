require("dotenv").config({ path: ".env.local" });
const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

async function testApiQuery() {
  try {
    console.log("🧪 Testing the exact API query for aging leads...");
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
      createdAt: Date,
      lastContactDate: Date,
    });

    const Lead = mongoose.models.Lead || mongoose.model("Lead", leadSchema);

    // Use the EXACT same query as the API
    console.log("🔍 Running API query...");
    const agingLeads = await Lead.find({
      agingDays: { $gte: 2 },
      stage: { $nin: ["Won", "Lost"] },
      isActive: true,
      isArchived: false,
      $or: [{ agingPaused: false }, { agingPaused: { $exists: false } }],
    }).sort({ agingDays: -1 });

    console.log(`📊 API Query Results:`);
    console.log(`   Aging leads found: ${agingLeads.length}`);

    if (agingLeads.length > 0) {
      console.log(`\n📋 Aging Leads Details:`);
      agingLeads.forEach((lead, index) => {
        console.log(
          `   ${index + 1}. "${lead.name}" (${lead.email}) - Stage: ${lead.stage} - Aging: ${lead.agingDays} days - Paused: ${lead.agingPaused}`,
        );
      });
    } else {
      console.log(`\n❌ No aging leads found with API query!`);

      // Let's debug by checking each condition separately
      console.log(`\n🔍 Debugging query conditions:`);

      const allLeads = await Lead.find({});
      console.log(`   Total leads in database: ${allLeads.length}`);

      const withAgingDays = await Lead.find({ agingDays: { $gte: 2 } });
      console.log(`   Leads with agingDays >= 2: ${withAgingDays.length}`);

      const notWonLost = await Lead.find({ stage: { $nin: ["Won", "Lost"] } });
      console.log(`   Leads not Won/Lost: ${notWonLost.length}`);

      const isActive = await Lead.find({ isActive: true });
      console.log(`   Active leads: ${isActive.length}`);

      const notArchived = await Lead.find({ isArchived: false });
      console.log(`   Non-archived leads: ${notArchived.length}`);

      const notPaused = await Lead.find({ agingPaused: false });
      console.log(`   Non-paused leads: ${notPaused.length}`);

      // Check for leads that might be missing the agingPaused field
      const withoutAgingPaused = await Lead.find({
        agingPaused: { $exists: false },
      });
      console.log(
        `   Leads without agingPaused field: ${withoutAgingPaused.length}`,
      );

      if (withoutAgingPaused.length > 0) {
        console.log(`\n⚠️ Found leads without agingPaused field:`);
        withoutAgingPaused.forEach((lead, index) => {
          console.log(
            `   ${index + 1}. "${lead.name}" (${lead.email}) - Stage: ${lead.stage} - Aging: ${lead.agingDays} days`,
          );
        });
      }
    }
  } catch (error) {
    console.error("❌ Error testing API query:", error);
  } finally {
    process.exit(0);
  }
}

testApiQuery();
