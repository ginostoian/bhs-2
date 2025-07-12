const connectMongo = require("../libs/mongoose");
const Lead = require("../models/Lead");

async function updateLeadAging() {
  try {
    console.log("Starting lead aging update...");
    await connectMongo();

    // Get all active, non-archived leads
    const leads = await Lead.find({
      isActive: true,
      isArchived: false,
    });

    console.log(`Found ${leads.length} leads to update`);

    let updatedCount = 0;
    const now = new Date();

    for (const lead of leads) {
      const lastContact = lead.lastContactDate || lead.createdAt;
      const diffTime = Math.abs(now - lastContact);
      const newAgingDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      // Only update if aging has changed
      if (newAgingDays !== lead.agingDays) {
        lead.agingDays = newAgingDays;
        await lead.save();
        updatedCount++;

        if (updatedCount % 10 === 0) {
          console.log(`Updated ${updatedCount} leads...`);
        }
      }
    }

    console.log(`✅ Lead aging update complete! Updated ${updatedCount} leads`);

    // Log aging statistics
    const agingStats = await Lead.aggregate([
      {
        $match: {
          isActive: true,
          isArchived: false,
          stage: { $nin: ["Won", "Lost"] },
        },
      },
      {
        $group: {
          _id: null,
          avgAging: { $avg: "$agingDays" },
          maxAging: { $max: "$agingDays" },
          leadsOver7Days: {
            $sum: { $cond: [{ $gte: ["$agingDays", 7] }, 1, 0] },
          },
          leadsOver14Days: {
            $sum: { $cond: [{ $gte: ["$agingDays", 14] }, 1, 0] },
          },
        },
      },
    ]);

    if (agingStats.length > 0) {
      const stats = agingStats[0];
      console.log("📊 Aging Statistics:");
      console.log(`   Average aging: ${Math.round(stats.avgAging)} days`);
      console.log(`   Maximum aging: ${stats.maxAging} days`);
      console.log(`   Leads over 7 days: ${stats.leadsOver7Days}`);
      console.log(`   Leads over 14 days: ${stats.leadsOver14Days}`);
    }
  } catch (error) {
    console.error("❌ Error updating lead aging:", error);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

// Run the function
updateLeadAging();
