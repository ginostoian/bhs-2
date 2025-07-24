require("dotenv").config({ path: ".env.local" });
const connectMongo = require("../libs/mongoose-cjs");
const mongoose = require("mongoose");

async function checkAgingLeads() {
  try {
    console.log("🔍 Checking aging leads status...");
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

    // Get all active leads
    const allLeads = await Lead.find({ isActive: true, isArchived: false });
    console.log(`📊 Found ${allLeads.length} active leads`);

    // Check aging leads (2+ days)
    const agingLeads = allLeads.filter(
      (lead) =>
        lead.agingDays >= 2 &&
        !["Won", "Lost"].includes(lead.stage) &&
        !lead.agingPaused,
    );

    console.log(`\n📈 Aging Leads Analysis:`);
    console.log(`   Total active leads: ${allLeads.length}`);
    console.log(`   Aging leads (2+ days): ${agingLeads.length}`);
    console.log(
      `   Excluded (Won/Lost): ${allLeads.filter((l) => ["Won", "Lost"].includes(l.stage)).length}`,
    );
    console.log(
      `   Excluded (Paused): ${allLeads.filter((l) => l.agingPaused).length}`,
    );

    if (agingLeads.length > 0) {
      console.log(`\n📋 Aging Leads Details:`);
      agingLeads.forEach((lead, index) => {
        console.log(
          `   ${index + 1}. "${lead.name}" (${lead.email}) - Stage: ${lead.stage} - Aging: ${lead.agingDays} days`,
        );
      });
    } else {
      console.log(
        `\n✅ No aging leads found! All leads are being managed properly.`,
      );
    }

    // Show leads by stage
    console.log(`\n📊 Leads by Stage:`);
    const stageCounts = {};
    allLeads.forEach((lead) => {
      stageCounts[lead.stage] = (stageCounts[lead.stage] || 0) + 1;
    });
    Object.keys(stageCounts).forEach((stage) => {
      console.log(`   ${stage}: ${stageCounts[stage]} leads`);
    });

    // Show aging distribution
    console.log(`\n📊 Aging Distribution:`);
    const agingDistribution = {};
    allLeads.forEach((lead) => {
      const days = lead.agingDays || 0;
      if (days < 2)
        agingDistribution["0-1 days"] =
          (agingDistribution["0-1 days"] || 0) + 1;
      else if (days < 7)
        agingDistribution["2-6 days"] =
          (agingDistribution["2-6 days"] || 0) + 1;
      else if (days < 14)
        agingDistribution["7-13 days"] =
          (agingDistribution["7-13 days"] || 0) + 1;
      else
        agingDistribution["14+ days"] =
          (agingDistribution["14+ days"] || 0) + 1;
    });
    Object.keys(agingDistribution).forEach((range) => {
      console.log(`   ${range}: ${agingDistribution[range]} leads`);
    });
  } catch (error) {
    console.error("❌ Error checking aging leads:", error);
  } finally {
    process.exit(0);
  }
}

checkAgingLeads();
