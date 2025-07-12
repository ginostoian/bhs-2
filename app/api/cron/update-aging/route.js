import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { sendEmail } from "@/libs/emailService";

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

    // --- Send notification email to admins if any leads have agingDays >= 2 ---
    const agingLeads = await Lead.find({
      agingDays: { $gte: 2 },
      stage: { $nin: ["Won", "Lost"] },
      isActive: true,
      isArchived: false,
    })
      .populate("assignedTo", "name email")
      .sort({ agingDays: -1 });

    if (agingLeads.length > 0) {
      const admins = await User.find({ role: "admin" });
      const emailContent = generateAgingLeadsEmail(agingLeads);
      const emailPromises = admins.map((admin) =>
        sendEmail({
          to: admin.email,
          subject: `⚠️ Aging Leads Alert - ${agingLeads.length} leads need attention`,
          html: emailContent,
        }),
      );
      await Promise.all(emailPromises);
      console.log(
        `📧 Aging leads notification sent to ${admins.length} admins`,
      );
    } else {
      console.log("No aging leads found for notification.");
    }

    return NextResponse.json({
      success: true,
      message: `Lead aging update complete! Updated ${updatedCount} leads`,
      updatedCount,
      totalLeads: leads.length,
      stats: agingStats.length > 0 ? agingStats[0] : null,
      timestamp: new Date().toISOString(),
      notificationSent: agingLeads.length > 0,
      notifiedAdmins: agingLeads.length > 0 ? undefined : [],
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

// --- Helper: generateAgingLeadsEmail (copied from notifications endpoint) ---
function generateAgingLeadsEmail(agingLeads) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Aging Leads Alert</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f59e0b; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 10px 0; border-radius: 6px; }
        .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .table th, .table td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .table th { background: #f3f4f6; font-weight: bold; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-danger { background: #fee2e2; color: #991b1b; }
        .urgent { background: #fee2e2; border-left-color: #ef4444; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Aging Leads Alert</h1>
          <p>${agingLeads.length} leads need immediate attention</p>
        </div>
        
        <div class="content">
          <div class="alert">
            <h2>🚨 Action Required</h2>
            <p>You have <strong>${agingLeads.length}</strong> leads that haven't been contacted in 2+ days. These leads are at risk of being lost.</p>
          </div>

          <h3>Aging Leads (${agingLeads.length})</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Stage</th>
                <th>Days</th>
                <th>Value</th>
                <th>Assigned To</th>
              </tr>
            </thead>
            <tbody>
              ${agingLeads
                .map(
                  (lead) => `
                <tr class="${lead.agingDays >= 7 ? "urgent" : ""}">
                  <td><strong>${lead.name}</strong></td>
                  <td>${lead.email}</td>
                  <td><span class="badge badge-warning">${lead.stage}</span></td>
                  <td><span class="badge ${lead.agingDays >= 7 ? "badge-danger" : "badge-warning"}">${lead.agingDays} days</span></td>
                  <td>£${(lead.value || 0).toLocaleString()}</td>
                  <td>${lead.assignedTo?.name || "Unassigned"}</td>
                </tr>
              `,
                )
                .join("")}
            </tbody>
          </table>

          <div class="alert">
            <h3>📋 Recommended Actions</h3>
            <ul>
              <li>Contact leads that are 7+ days old immediately</li>
              <li>Schedule follow-up calls for leads 2-6 days old</li>
              <li>Update lead stages based on their responses</li>
              <li>Reassign leads if the current assignee is unavailable</li>
            </ul>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="text-align: center; color: #6b7280; font-size: 14px;">
            This alert was automatically generated by your CRM system.<br>
            <a href="${process.env.NEXTAUTH_URL}/admin/crm" style="color: #3B82F6;">View CRM Dashboard</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
