import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import {
  processDueEmails,
  getEmailAutomationStats,
  initializeEmailAutomation,
} from "@/libs/crmEmailAutomation";
import EmailAutomation from "@/models/EmailAutomation";
import Lead from "@/models/Lead";

// POST - Process due emails (triggered by cron job or manual request)
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { action } = body;

    if (action === "process_due_emails") {
      const result = await processDueEmails();

      return NextResponse.json({
        success: true,
        message: `Processed ${result.processed} email automations`,
        result,
      });
    }

    if (action === "initialize_all_automations") {
      const result = await initializeAllAutomations();

      return NextResponse.json({
        success: true,
        message: `Initialized ${result.initialized} email automations`,
        result,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Error processing email automation:", error);
    return NextResponse.json(
      { error: "Failed to process email automation" },
      { status: 500 },
    );
  }
}

/**
 * Initialize email automation for all leads that don't have it
 */
async function initializeAllAutomations() {
  try {
    // Find all active leads
    const leads = await Lead.find({
      isActive: true,
      isArchived: false,
    });

    let initialized = 0;
    let skipped = 0;
    let errors = 0;

    for (const lead of leads) {
      try {
        // Check if lead already has email automation
        const existingAutomation = await EmailAutomation.findOne({
          leadId: lead._id,
        });

        if (existingAutomation) {
          skipped++;
          continue;
        }

        // Initialize email automation for this lead
        await initializeEmailAutomation(lead._id, lead.stage);
        initialized++;
      } catch (error) {
        console.error(`Error initializing automation for ${lead.name}:`, error);
        errors++;
      }
    }

    return {
      initialized,
      skipped,
      errors,
      total: leads.length,
    };
  } catch (error) {
    console.error("Error initializing all automations:", error);
    throw error;
  }
}

// GET - Get email automation statistics
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const stats = await getEmailAutomationStats();

    // Add reply statistics
    const leadsReplied = await EmailAutomation.countDocuments({
      leadReplied: true,
    });

    stats.leadsReplied = leadsReplied;

    // Get detailed lead lists for each stage
    const leadDetails = await EmailAutomation.aggregate([
      {
        $lookup: {
          from: "leads",
          localField: "leadId",
          foreignField: "_id",
          as: "lead",
        },
      },
      {
        $unwind: "$lead",
      },
      {
        $project: {
          _id: 1,
          leadId: 1,
          currentStage: 1,
          isActive: 1,
          leadReplied: 1,
          pausedReason: 1,
          lastActivity: 1,
          nextEmailDue: 1,
          emailsSent: "$stageData.lead.emailsSent",
          leadName: "$lead.name",
          leadEmail: "$lead.email",
          leadValue: "$lead.value",
          leadStage: "$lead.stage",
        },
      },
      {
        $sort: { lastActivity: -1 },
      },
    ]);

    // Group leads by stage
    const leadsByStage = {};
    leadDetails.forEach((item) => {
      const stage = item.currentStage;
      if (!leadsByStage[stage]) {
        leadsByStage[stage] = [];
      }
      leadsByStage[stage].push(item);
    });

    // Get recent email history
    const recentEmails = await EmailAutomation.aggregate([
      {
        $unwind: "$emailHistory",
      },
      {
        $lookup: {
          from: "leads",
          localField: "leadId",
          foreignField: "_id",
          as: "lead",
        },
      },
      {
        $unwind: "$lead",
      },
      {
        $project: {
          emailType: "$emailHistory.emailType",
          sentAt: "$emailHistory.sentAt",
          success: "$emailHistory.success",
          subject: "$emailHistory.subject",
          leadName: "$lead.name",
          leadEmail: "$lead.email",
          stage: "$currentStage",
        },
      },
      {
        $sort: { sentAt: -1 },
      },
      {
        $limit: 20, // Show last 20 emails
      },
    ]);

    return NextResponse.json({
      success: true,
      stats: {
        ...stats,
        leadsByStage,
        recentEmails,
      },
    });
  } catch (error) {
    console.error("Error getting email automation stats:", error);
    return NextResponse.json(
      { error: "Failed to get email automation stats" },
      { status: 500 },
    );
  }
}
