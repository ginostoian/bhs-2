import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { sendEmail } from "@/libs/emailService";

const CRM_STAGES = [
  "Lead",
  "Never replied",
  "Qualified",
  "Proposal Sent",
  "Negotiations",
  "Won",
  "Lost",
];

/**
 * POST /api/cron/morning-brief
 * Cron job endpoint to send morning brief emails
 * This should be called by Vercel Cron at 8 AM on weekdays
 */
export async function POST(req) {
  try {
    console.log("🌅 Starting morning brief generation...");

    // Connect to database
    await connectMongo();
    console.log("✅ Connected to database");

    // Get all admin users
    const admins = await User.find({ role: "admin" });
    console.log(`📧 Found ${admins.length} admin users`);

    if (admins.length === 0) {
      console.log("⚠️ No admin users found, skipping email send");
      return NextResponse.json({
        success: true,
        message: "No admin users found, skipping email send",
      });
    }

    // Generate morning brief data
    const briefData = await generateMorningBriefData();
    console.log("📊 Generated morning brief data");

    // Generate email content
    const emailContent = generateMorningBriefEmail(briefData);
    console.log("📝 Generated email content");

    // Send email to all admins
    const emailPromises = admins.map((admin) =>
      sendEmail({
        to: admin.email,
        subject: `Morning Brief - ${new Date().toLocaleDateString("en-GB")}`,
        html: emailContent,
      }),
    );

    await Promise.all(emailPromises);
    console.log(`✅ Morning brief sent to ${admins.length} admins`);

    // Log summary
    console.log("\n📈 Morning Brief Summary:");
    console.log(`- Total Leads: ${briefData.totalLeads}`);
    console.log(`- Aging Leads: ${briefData.agingLeads}`);
    console.log(`- Tasks Due Today: ${briefData.tasksDueToday}`);
    console.log(`- New Leads Yesterday: ${briefData.newLeadsYesterday}`);
    console.log(`- Won/Lost Yesterday: ${briefData.wonLostYesterday}`);

    return NextResponse.json({
      success: true,
      message: `Morning brief sent to ${admins.length} admins`,
      briefData,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("❌ Error sending morning brief:", error);
    return NextResponse.json(
      { error: "Failed to send morning brief", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/cron/morning-brief
 * Manual trigger for testing
 */
export async function GET(req) {
  return POST(req);
}

async function generateMorningBriefData() {
  // Get all active leads
  const leads = await Lead.find({ isActive: true, isArchived: false })
    .populate("assignedTo", "name email")
    .populate("tasks.assignedTo", "name email");

  // Get all admin users
  const admins = await User.find({ role: "admin" });

  // Calculate pipeline metrics
  const stageCounts = {};
  CRM_STAGES.forEach((stage) => {
    stageCounts[stage] = leads.filter((lead) => lead.stage === stage).length;
  });

  // Get aging leads (2+ days)
  const agingLeads = leads.filter(
    (lead) => lead.agingDays >= 2 && !["Won", "Lost"].includes(lead.stage),
  );

  // Get tasks due today
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const tasksDueToday = [];
  leads.forEach((lead) => {
    lead.tasks?.forEach((task) => {
      if (task.dueDate && task.status !== "completed") {
        const dueDate = new Date(task.dueDate);
        dueDate.setHours(0, 0, 0, 0);

        if (dueDate.getTime() === today.getTime()) {
          tasksDueToday.push({
            ...task.toObject(),
            leadName: lead.name,
            leadEmail: lead.email,
            leadStage: lead.stage,
          });
        }
      }
    });
  });

  // Get new leads from yesterday
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const newLeadsYesterday = leads.filter((lead) => {
    const createdAt = new Date(lead.createdAt);
    return createdAt >= yesterday && createdAt < today;
  });

  // Get leads that moved to Won/Lost yesterday
  const wonLostYesterday = leads.filter((lead) => {
    if (!lead.versionHistory || lead.versionHistory.length === 0) return false;

    const lastStageChange = lead.versionHistory
      .filter((change) => change.field === "stage")
      .sort((a, b) => new Date(b.changedAt) - new Date(a.changedAt))[0];

    if (!lastStageChange) return false;

    const changeDate = new Date(lastStageChange.changedAt);
    return (
      changeDate >= yesterday &&
      changeDate < today &&
      ["Won", "Lost"].includes(lastStageChange.newValue)
    );
  });

  return {
    stageCounts,
    agingLeads: agingLeads.length,
    agingLeadsList: agingLeads.slice(0, 10), // Top 10 aging leads
    tasksDueToday: tasksDueToday.length,
    tasksDueTodayList: tasksDueToday.slice(0, 10), // Top 10 tasks
    newLeadsYesterday: newLeadsYesterday.length,
    wonLostYesterday: wonLostYesterday.length,
    totalLeads: leads.length,
    admins: admins.length,
  };
}

function generateMorningBriefEmail(briefData) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB");
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Morning Brief</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 800px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 12px 12px 0 0; }
        .content { background: #f9fafb; padding: 30px; border-radius: 0 0 12px 12px; }
        .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 20px; margin: 20px 0; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; text-align: center; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2em; font-weight: bold; color: #667eea; }
        .stat-label { color: #6b7280; font-size: 0.9em; margin-top: 5px; }
        .alert { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin: 20px 0; border-radius: 6px; }
        .urgent { background: #fee2e2; border-left-color: #ef4444; }
        .table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .table th, .table td { padding: 10px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .table th { background: #f3f4f6; font-weight: bold; }
        .badge { display: inline-block; padding: 4px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-danger { background: #fee2e2; color: #991b1b; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .pipeline { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .pipeline-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; }
        .pipeline-stage { text-align: center; }
        .pipeline-count { font-size: 1.5em; font-weight: bold; color: #667eea; }
        .pipeline-label { color: #6b7280; font-size: 0.8em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌅 Morning Brief</h1>
          <p>${new Date().toLocaleDateString("en-GB", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
        </div>
        
        <div class="content">
          <div class="stats-grid">
            <div class="stat-card">
              <div class="stat-number">${briefData.totalLeads}</div>
              <div class="stat-label">Total Leads</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${briefData.agingLeads}</div>
              <div class="stat-label">Aging Leads</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${briefData.tasksDueToday}</div>
              <div class="stat-label">Tasks Due Today</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">${briefData.newLeadsYesterday}</div>
              <div class="stat-label">New Yesterday</div>
            </div>
          </div>

          ${
            briefData.agingLeads > 0
              ? `
          <div class="alert ${briefData.agingLeads >= 10 ? "urgent" : ""}">
            <h3>⚠️ Aging Leads Alert</h3>
            <p>You have <strong>${briefData.agingLeads}</strong> leads that haven't been contacted in 2+ days.</p>
            ${
              briefData.agingLeadsList.length > 0
                ? `
            <table class="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Stage</th>
                  <th>Days</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                ${briefData.agingLeadsList
                  .map(
                    (lead) => `
                <tr>
                  <td><strong>${lead.name}</strong></td>
                  <td>${lead.email}</td>
                  <td><span class="badge badge-warning">${lead.stage}</span></td>
                  <td><span class="badge ${lead.agingDays >= 7 ? "badge-danger" : "badge-warning"}">${lead.agingDays} days</span></td>
                  <td>${lead.assignedTo?.name || "Unassigned"}</td>
                </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            `
                : ""
            }
          </div>
          `
              : ""
          }

          ${
            briefData.tasksDueToday > 0
              ? `
          <div class="alert">
            <h3>📋 Tasks Due Today</h3>
            <p>You have <strong>${briefData.tasksDueToday}</strong> tasks due today.</p>
            ${
              briefData.tasksDueTodayList.length > 0
                ? `
            <table class="table">
              <thead>
                <tr>
                  <th>Task</th>
                  <th>Lead</th>
                  <th>Stage</th>
                  <th>Assigned To</th>
                </tr>
              </thead>
              <tbody>
                ${briefData.tasksDueTodayList
                  .map(
                    (task) => `
                <tr>
                  <td><strong>${task.title}</strong></td>
                  <td>${task.leadName}</td>
                  <td><span class="badge badge-warning">${task.leadStage}</span></td>
                  <td>${task.assignedTo?.name || "Unassigned"}</td>
                </tr>
                `,
                  )
                  .join("")}
              </tbody>
            </table>
            `
                : ""
            }
          </div>
          `
              : ""
          }

          <div class="pipeline">
            <h3>📊 Pipeline Overview</h3>
            <div class="pipeline-grid">
              ${Object.entries(briefData.stageCounts)
                .map(
                  ([stage, count]) => `
              <div class="pipeline-stage">
                <div class="pipeline-count">${count}</div>
                <div class="pipeline-label">${stage}</div>
              </div>
              `,
                )
                .join("")}
            </div>
          </div>

          ${
            briefData.wonLostYesterday > 0
              ? `
          <div class="alert">
            <h3>🎉 Yesterday's Results</h3>
            <p><strong>${briefData.wonLostYesterday}</strong> leads were moved to Won/Lost yesterday.</p>
          </div>
          `
              : ""
          }

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="text-align: center; color: #6b7280; font-size: 14px;">
            This brief was automatically generated by your CRM system.<br>
            <a href="${process.env.NEXTAUTH_URL}/admin/crm" style="color: #667eea;">View CRM Dashboard</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
