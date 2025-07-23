import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
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

// GET - Generate morning brief data
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

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

    // Get aging leads (2+ days) - exclude paused leads
    const agingLeads = leads.filter(
      (lead) =>
        lead.agingDays >= 2 &&
        !["Won", "Lost"].includes(lead.stage) &&
        !lead.agingPaused,
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
      if (!lead.versionHistory || lead.versionHistory.length === 0)
        return false;

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

    const briefData = {
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

    return NextResponse.json({ success: true, briefData });
  } catch (error) {
    console.error("Error generating morning brief:", error);
    return NextResponse.json(
      { error: "Failed to generate morning brief" },
      { status: 500 },
    );
  }
}

// POST - Send morning brief email to all admins
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Get all admin users
    const admins = await User.find({ role: "admin" });

    // Get morning brief data
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/crm/morning-brief`,
      {
        headers: {
          Cookie: request.headers.get("cookie") || "",
        },
      },
    );

    if (!response.ok) {
      throw new Error("Failed to generate brief data");
    }

    const { briefData } = await response.json();

    // Generate email content
    const emailContent = generateMorningBriefEmail(briefData);

    // Send email to all admins with better error handling
    console.log(`📧 Sending morning brief to ${admins.length} admins:`);
    admins.forEach((admin, index) => {
      console.log(`   ${index + 1}. ${admin.name} (${admin.email})`);
    });

    const emailResults = [];
    for (const admin of admins) {
      try {
        console.log(`📤 Sending to ${admin.email}...`);
        const result = await sendEmail({
          to: admin.email,
          subject: `Morning Brief - ${new Date().toLocaleDateString("en-GB")}`,
          html: emailContent,
        });
        console.log(`✅ Successfully sent to ${admin.email}`);
        emailResults.push({ admin: admin.email, success: true, result });

        // Add a small delay between emails to avoid rate limiting
        if (admins.indexOf(admin) < admins.length - 1) {
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      } catch (error) {
        console.error(`❌ Failed to send to ${admin.email}:`, error.message);
        emailResults.push({
          admin: admin.email,
          success: false,
          error: error.message,
        });
      }
    }

    const successfulSends = emailResults.filter((r) => r.success).length;
    const failedSends = emailResults.filter((r) => !r.success).length;

    console.log(
      `📊 Email sending summary: ${successfulSends} successful, ${failedSends} failed`,
    );

    return NextResponse.json({
      success: true,
      message: `Morning brief sent to ${successfulSends} out of ${admins.length} admins`,
      details: {
        totalAdmins: admins.length,
        successfulSends,
        failedSends,
        results: emailResults,
      },
    });
  } catch (error) {
    console.error("Error sending morning brief:", error);
    return NextResponse.json(
      { error: "Failed to send morning brief" },
      { status: 500 },
    );
  }
}

function generateMorningBriefEmail(briefData) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
    }).format(amount);
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
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #3B82F6; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .metric { background: white; padding: 15px; margin: 10px 0; border-radius: 6px; border-left: 4px solid #3B82F6; }
        .metric h3 { margin: 0 0 10px 0; color: #1f2937; }
        .metric-value { font-size: 24px; font-weight: bold; color: #3B82F6; }
        .alert { background: #fef3c7; border-left-color: #f59e0b; }
        .success { background: #d1fae5; border-left-color: #10b981; }
        .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .table th, .table td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .table th { background: #f3f4f6; font-weight: bold; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .badge-primary { background: #dbeafe; color: #1e40af; }
        .badge-warning { background: #fef3c7; color: #92400e; }
        .badge-success { background: #d1fae5; color: #065f46; }
        .badge-danger { background: #fee2e2; color: #991b1b; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🌅 Morning Brief</h1>
          <p>${formatDate(new Date())}</p>
        </div>
        
        <div class="content">
          <h2>Pipeline Overview</h2>
          <div class="metric">
            <h3>Total Leads in Pipeline</h3>
            <div class="metric-value">${briefData.totalLeads}</div>
          </div>

          <h3>Leads by Stage</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Stage</th>
                <th>Count</th>
              </tr>
            </thead>
            <tbody>
              ${CRM_STAGES.map(
                (stage) => `
                <tr>
                  <td>${stage}</td>
                  <td><span class="badge badge-primary">${briefData.stageCounts[stage]}</span></td>
                </tr>
              `,
              ).join("")}
            </tbody>
          </table>

          ${
            briefData.agingLeads > 0
              ? `
            <div class="metric alert">
              <h3>⚠️ Aging Leads (2+ days)</h3>
              <div class="metric-value">${briefData.agingLeads}</div>
              <p>Leads that need immediate attention</p>
              
              ${
                briefData.agingLeadsList.length > 0
                  ? `
                <h4>Top Aging Leads:</h4>
                <table class="table">
                  <thead>
                    <tr>
                      <th>Name</th>
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
                        <td>${lead.name}</td>
                        <td><span class="badge badge-warning">${lead.stage}</span></td>
                        <td>${lead.agingDays} days</td>
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
              : `
            <div class="metric success">
              <h3>✅ No Aging Leads</h3>
              <p>All leads are being managed properly!</p>
            </div>
          `
          }

          ${
            briefData.tasksDueToday > 0
              ? `
            <div class="metric alert">
              <h3>📋 Tasks Due Today</h3>
              <div class="metric-value">${briefData.tasksDueToday}</div>
              
              <h4>Today's Tasks:</h4>
              <table class="table">
                <thead>
                  <tr>
                    <th>Task</th>
                    <th>Lead</th>
                    <th>Priority</th>
                    <th>Assigned To</th>
                  </tr>
                </thead>
                <tbody>
                  ${briefData.tasksDueTodayList
                    .map(
                      (task) => `
                    <tr>
                      <td>${task.title}</td>
                      <td>${task.leadName}</td>
                      <td><span class="badge badge-${task.priority === "urgent" ? "danger" : task.priority === "high" ? "warning" : "primary"}">${task.priority}</span></td>
                      <td>${task.assignedTo?.name || "Unassigned"}</td>
                    </tr>
                  `,
                    )
                    .join("")}
                </tbody>
              </table>
            </div>
          `
              : `
            <div class="metric success">
              <h3>✅ No Tasks Due Today</h3>
              <p>All tasks are up to date!</p>
            </div>
          `
          }

          <div class="metric">
            <h3>📈 Yesterday's Activity</h3>
            <p><strong>New Leads:</strong> ${briefData.newLeadsYesterday}</p>
            <p><strong>Won/Lost:</strong> ${briefData.wonLostYesterday}</p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;">
          
          <p style="text-align: center; color: #6b7280; font-size: 14px;">
            This email was automatically generated by your CRM system.<br>
            <a href="${process.env.NEXTAUTH_URL}/admin/crm" style="color: #3B82F6;">View CRM Dashboard</a>
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}
