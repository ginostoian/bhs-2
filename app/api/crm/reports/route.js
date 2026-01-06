import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User"; // Ensure User model is registered

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const dateRange = searchParams.get("dateRange") || "30";
    
    // Calculate date filter
    const days = parseInt(dateRange);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Common Match Stage (Active leads created within range)
    // Note: For pipeline SNAPSHOT, usually you want all active leads. 
    // But for "Performance reports" (conversion, source), you want time-bound.
    // Let's return TWO sets of data: 
    // 1. Current Pipeline (All active leads, ignore date)
    // 2. Performance (Leads created in date range)
    
    // Aggregation 1: Current Pipeline Snapshot (All active leads)
    const pipelineStats = await Lead.aggregate([
      { $match: { isActive: true, isArchived: false } },
      {
        $group: {
          _id: "$stage",
          count: { $sum: 1 },
          value: { $sum: "$value" },
          avgAging: { $avg: "$agingDays" }
        }
      }
    ]);

    // Aggregation 2: Performance metrics (Time-bound)
    const performanceMatch = {
      isActive: true, 
      isArchived: false,
      createdAt: { $gte: startDate }
    };

    // Source Performance
    const sourceStats = await Lead.aggregate([
      { $match: performanceMatch },
      {
        $group: {
          _id: { $ifNull: ["$customSource", "$source"] }, // Handle custom source
          count: { $sum: 1 },
          value: { $sum: "$value" },
          wonCount: {
            $sum: { $cond: [{ $eq: ["$stage", "Won"] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Project Type Performance
    // Note: projectTypes is an array. We need to unwind.
    const typeStats = await Lead.aggregate([
      { $match: performanceMatch },
      { $unwind: "$projectTypes" }, // Split array entries
      {
        $group: {
          _id: "$projectTypes",
          count: { $sum: 1 },
          value: { $sum: "$value" },
          wonCount: {
             $sum: { $cond: [{ $eq: ["$stage", "Won"] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Agent Performance
    const agentStats = await Lead.aggregate([
      { $match: performanceMatch },
      {
        $group: {
          _id: "$assignedTo",
          count: { $sum: 1 },
          value: { $sum: "$value" },
          wonCount: {
             $sum: { $cond: [{ $eq: ["$stage", "Won"] }, 1, 0] }
          }
        }
      },
       // Lookup user details
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent"
        }
      },
      { $unwind: { path: "$agent", preserveNullAndEmptyArrays: true } },
      {
        $project: {
          name: { $ifNull: ["$agent.name", "Unassigned"] },
          email: { $ifNull: ["$agent.email", ""] },
          count: 1,
          value: 1,
          wonCount: 1
        }
      },
      { $sort: { count: -1 } }
    ]);

    // Overall Conversion Funnel (Time-bound)
    // Simple funnel: Lead (Total) -> Qualified -> Won
    const funnelStats = await Lead.aggregate([
      { $match: performanceMatch },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          qualified: {
             $sum: { 
               $cond: [
                 { $in: ["$stage", ["Qualified", "Proposal Sent", "Negotiations", "Won", "Lost"]] }, // Assuming any stage past specific point implies qualification? 
                 // Actually, simpler logic: "Qualified" stage OR deeper.
                 // Let's rely on the exact stage names for now or use the pre-defined list in FE.
                 // A safer way: Count specifically by stages
                 1, 0 
               ]
             }
          },
          won: {
             $sum: { $cond: [{ $eq: ["$stage", "Won"] }, 1, 0] }
          }
        }
      }
    ]);

    // Format pipeline stats into a map for easy FE consumption
    const pipelineMap = {};
    let totalPipelineValue = 0;
    let totalActiveLeads = 0;
    
    pipelineStats.forEach(stat => {
      pipelineMap[stat._id] = {
        count: stat.count,
        value: stat.value,
        avgAging: Math.round(stat.avgAging || 0)
      };
      totalPipelineValue += stat.value;
      totalActiveLeads += stat.count;
    });

    // Aggregation 3: Deal Value & Health Metrics
    // Client Health Breakdown
    const healthStats = await Lead.aggregate([
      { $match: { ...performanceMatch, stage: { $nin: ["Won", "Lost"] } } }, // Only active leads for health
      {
        $group: {
          _id: "$clientHealth",
          count: { $sum: 1 },
          value: { $sum: "$value" }
        }
      }
    ]);

    // Won/Lost Analysis (Time-bound)
    const outcomeStats = await Lead.aggregate([
      { 
        $match: { 
          isActive: true, 
          isArchived: false,
          createdAt: { $gte: startDate }, // Time bound
          stage: { $in: ["Won", "Lost"] }
        } 
      },
      {
        $group: {
          _id: "$stage",
          count: { $sum: 1 },
          totalValue: { $sum: "$value" },
          avgValue: { $avg: "$value" }
        }
      }
    ]);
    
    // Process outcome stats
    const wonStat = outcomeStats.find(s => s._id === "Won") || { count: 0, totalValue: 0, avgValue: 0 };
    const lostStat = outcomeStats.find(s => s._id === "Lost") || { count: 0, totalValue: 0, avgValue: 0 };

    return NextResponse.json({
      pipeline: {
        byStage: pipelineMap,
        totalValue: totalPipelineValue,
        totalCount: totalActiveLeads
      },
      performance: {
        bySource: sourceStats,
        byType: typeStats,
        byAgent: agentStats,
        funnel: funnelStats[0] || { total: 0, qualified: 0, won: 0 },
        dateRange: days,
        health: healthStats,
        economics: {
          avgDealSize: wonStat.avgValue || 0,
          totalWon: wonStat.totalValue || 0,
          totalLost: lostStat.totalValue || 0,
          wonCount: wonStat.count || 0
        }
      }
    });

  } catch (error) {
    console.error("Error generating CRM reports:", error);
    return NextResponse.json(
      { error: "Failed to generate reports" },
      { status: 500 }
    );
  }
}
