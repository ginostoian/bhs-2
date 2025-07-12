import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

/**
 * POST /api/cron/update-aging
 * Cron job endpoint to update lead aging
 * This should be called by Vercel Cron daily at 2 AM
 */
export async function POST(req) {
  try {
    console.log("🔄 Starting automated lead aging update...");

    // Connect to MongoDB
    await connectMongo();

    // Get all active, non-archived leads
    const leads = await Lead.find({
      isActive: true,
      isArchived: false,
    });

    console.log(`📊 Found ${leads.length} leads to update`);

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
          console.log(`✅ Updated ${updatedCount} leads...`);
        }
      }
    }

    console.log(`🎉 Lead aging update complete! Updated ${updatedCount} leads`);

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

    let statsMessage = "";
    if (agingStats.length > 0) {
      const stats = agingStats[0];
      statsMessage = `📈 Aging Statistics: Avg ${Math.round(stats.avgAging)} days, Max ${stats.maxAging} days, ${stats.leadsOver7Days} leads over 7 days, ${stats.leadsOver14Days} leads over 14 days`;
      console.log(statsMessage);
    }

    return NextResponse.json({
      success: true,
      message: `Lead aging update complete! Updated ${updatedCount} leads`,
      updatedCount,
      totalLeads: leads.length,
      stats: agingStats.length > 0 ? agingStats[0] : null,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error updating lead aging:", error);
    return NextResponse.json(
      { error: "Failed to update lead aging", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/cron/update-aging
 * Manual trigger for testing
 */
export async function GET(req) {
  return POST(req);
}
