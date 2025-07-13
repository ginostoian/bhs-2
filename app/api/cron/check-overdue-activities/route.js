import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";
import { sendEmail } from "@/libs/emailService";
import { notifyAdmins } from "@/libs/notificationService";

/**
 * POST /api/cron/check-overdue-activities
 * Cron job endpoint to check for overdue activities and send notifications
 * This should be called by Vercel Cron daily at 9 AM
 */
export async function POST(req) {
  try {
    console.log("🔔 Starting overdue activities check...");

    // Connect to MongoDB
    await connectMongo();

    const now = new Date();
    const notificationsSent = [];

    // First, let's get all leads to debug what's in the database
    const allLeads = await Lead.find({
      isActive: true,
      isArchived: false,
    })
      .populate("assignedTo", "name email")
      .populate("activities.createdBy", "name email");

    console.log(`📊 Total leads found: ${allLeads.length}`);

    // Debug: Log all activities with due dates
    let totalActivitiesWithDueDates = 0;
    allLeads.forEach((lead) => {
      console.log(`\n🔍 Checking lead: ${lead.name} (${lead._id})`);
      console.log(`   Total activities: ${lead.activities.length}`);

      // Log all activities for debugging
      lead.activities.forEach((activity, index) => {
        console.log(`   Activity ${index + 1}: ${activity.title}`);
        console.log(`     - Due date: ${activity.dueDate}`);
        console.log(`     - Due date type: ${typeof activity.dueDate}`);
        console.log(
          `     - Has dueDate property: ${activity.hasOwnProperty("dueDate")}`,
        );
        console.log(`     - Status: ${activity.status}`);
      });

      const activitiesWithDueDates = lead.activities.filter(
        (activity) => activity.dueDate,
      );
      if (activitiesWithDueDates.length > 0) {
        console.log(
          `✅ Lead ${lead.name} has ${activitiesWithDueDates.length} activities with due dates:`,
        );
        activitiesWithDueDates.forEach((activity) => {
          const dueDate = new Date(activity.dueDate);
          const isOverdue = dueDate < now;
          console.log(
            `  - Activity: ${activity.title}, Due: ${dueDate.toISOString()}, Status: ${activity.status}, Overdue: ${isOverdue}`,
          );
        });
        totalActivitiesWithDueDates += activitiesWithDueDates.length;
      } else {
        console.log(`❌ Lead ${lead.name} has no activities with due dates`);
      }
    });
    console.log(
      `📊 Total activities with due dates: ${totalActivitiesWithDueDates}`,
    );

    // Find all leads with overdue activities
    const leadsWithOverdueActivities = await Lead.find({
      isActive: true,
      isArchived: false,
      "activities.dueDate": { $lt: now },
      $or: [
        { "activities.status": { $ne: "done" } },
        { "activities.status": { $exists: false } },
      ],
    })
      .populate("assignedTo", "name email")
      .populate("activities.createdBy", "name email");

    console.log(
      `📊 Found ${leadsWithOverdueActivities.length} leads with overdue activities`,
    );

    for (const lead of leadsWithOverdueActivities) {
      // Get overdue activities for this lead
      const overdueActivities = lead.activities.filter(
        (activity) =>
          activity.dueDate &&
          new Date(activity.dueDate) < now &&
          activity.status !== "done",
      );

      if (overdueActivities.length === 0) continue;

      // Send notification to the assigned admin
      if (lead.assignedTo) {
        try {
          const emailContent = generateOverdueActivitiesEmail(
            lead,
            overdueActivities,
            now,
          );

          await sendEmail({
            to: lead.assignedTo.email,
            subject: `⚠️ Overdue Activities Alert - ${overdueActivities.length} activities for ${lead.name}`,
            html: emailContent,
          });

          notificationsSent.push({
            leadId: lead._id.toString(),
            leadName: lead.name,
            adminEmail: lead.assignedTo.email,
            adminName: lead.assignedTo.name,
            overdueCount: overdueActivities.length,
            success: true,
          });

          console.log(
            `✅ Overdue activities notification sent to ${lead.assignedTo.email} for lead ${lead.name}`,
          );

          // Also send notification to all admins in the app
          try {
            await notifyAdmins({
              type: "system_alert",
              title: `⚠️ Overdue Activities Alert - ${lead.name}`,
              message: `${overdueActivities.length} activities are overdue for lead ${lead.name}. Assigned admin: ${lead.assignedTo.name}`,
              priority: "high",
              metadata: {
                leadId: lead._id.toString(),
                leadName: lead.name,
                overdueCount: overdueActivities.length,
                assignedAdmin: lead.assignedTo.name,
                overdueActivities: overdueActivities.map((a) => ({
                  title: a.title,
                  type: a.type,
                  dueDate: a.dueDate,
                })),
              },
            });
            console.log(
              `✅ Admin notifications sent for overdue activities in lead ${lead.name}`,
            );
          } catch (notificationError) {
            console.error(
              `❌ Failed to send admin notifications for lead ${lead.name}:`,
              notificationError,
            );
          }
        } catch (error) {
          console.error(
            `❌ Failed to send notification to ${lead.assignedTo.email}:`,
            error,
          );
          notificationsSent.push({
            leadId: lead._id.toString(),
            leadName: lead.name,
            adminEmail: lead.assignedTo.email,
            adminName: lead.assignedTo.name,
            overdueCount: overdueActivities.length,
            success: false,
            error: error.message,
          });
        }
      } else {
        console.log(
          `⚠️ Lead ${lead.name} has overdue activities but no assigned admin`,
        );
      }
    }

    console.log(
      `🎉 Overdue activities check complete! Sent ${notificationsSent.filter((n) => n.success).length} notifications`,
    );

    return NextResponse.json({
      success: true,
      message: `Overdue activities check complete! Sent ${notificationsSent.filter((n) => n.success).length} notifications`,
      totalLeadsChecked: allLeads.length,
      totalActivitiesWithDueDates,
      leadsWithOverdueActivities: leadsWithOverdueActivities.length,
      notificationsSent,
      timestamp: new Date().toISOString(),
      debug: {
        now: now.toISOString(),
        totalLeads: allLeads.length,
        totalActivitiesWithDueDates,
      },
    });
  } catch (error) {
    console.error("❌ Error checking overdue activities:", error);
    return NextResponse.json(
      { error: "Failed to check overdue activities", details: error.message },
      { status: 500 },
    );
  }
}

/**
 * GET /api/cron/check-overdue-activities
 * Manual trigger for testing
 */
export async function GET(req) {
  return POST(req);
}

// Helper function to generate overdue activities email
function generateOverdueActivitiesEmail(lead, overdueActivities, now) {
  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getActivityIcon = (type) => {
    const icons = {
      call: "📞",
      email: "📧",
      site_visit: "🏠",
      meeting: "🤝",
      note: "📝",
      attachment: "📎",
    };
    return icons[type] || "📋";
  };

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Overdue Activities Alert</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #ef4444; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
        .content { background: #f9fafb; padding: 20px; border-radius: 0 0 8px 8px; }
        .alert { background: #fee2e2; border-left: 4px solid #ef4444; padding: 15px; margin: 10px 0; border-radius: 6px; }
        .table { width: 100%; border-collapse: collapse; margin: 10px 0; }
        .table th, .table td { padding: 8px; text-align: left; border-bottom: 1px solid #e5e7eb; }
        .table th { background: #f3f4f6; font-weight: bold; }
        .badge { display: inline-block; padding: 2px 8px; border-radius: 12px; font-size: 12px; font-weight: bold; }
        .badge-overdue { background: #fee2e2; color: #991b1b; }
        .lead-info { background: white; padding: 15px; border-radius: 6px; margin: 15px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>⚠️ Overdue Activities Alert</h1>
          <p>${overdueActivities.length} activities are overdue for ${lead.name}</p>
        </div>
        
        <div class="content">
          <div class="alert">
            <h2>🚨 Action Required</h2>
            <p>You have <strong>${overdueActivities.length}</strong> overdue activities for lead <strong>${lead.name}</strong>. Please review and complete these activities as soon as possible.</p>
          </div>

          <div class="lead-info">
            <h3>Lead Information</h3>
            <p><strong>Name:</strong> ${lead.name}</p>
            <p><strong>Email:</strong> ${lead.email}</p>
            <p><strong>Phone:</strong> ${lead.phone || "Not provided"}</p>
            <p><strong>Stage:</strong> ${lead.stage}</p>
            <p><strong>Value:</strong> £${(lead.value || 0).toLocaleString()}</p>
          </div>

          <h3>Overdue Activities (${overdueActivities.length})</h3>
          <table class="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Title</th>
                <th>Due Date</th>
                <th>Days Overdue</th>
                <th>Created By</th>
              </tr>
            </thead>
            <tbody>
              ${overdueActivities
                .map((activity) => {
                  const dueDate = new Date(activity.dueDate);
                  const daysOverdue = Math.ceil(
                    (now - dueDate) / (1000 * 60 * 60 * 24),
                  );
                  return `
                <tr>
                  <td>${getActivityIcon(activity.type)} ${activity.type}</td>
                  <td><strong>${activity.title}</strong></td>
                  <td><span class="badge badge-overdue">${formatDate(activity.dueDate)}</span></td>
                  <td><strong>${daysOverdue} day${daysOverdue !== 1 ? "s" : ""}</strong></td>
                  <td>${activity.createdBy?.name || activity.createdBy?.email || "Unknown"}</td>
                </tr>
              `;
                })
                .join("")}
            </tbody>
          </table>

          <div class="alert">
            <h3>📋 Recommended Actions</h3>
            <ul>
              <li>Review each overdue activity and determine if it's still relevant</li>
              <li>Complete activities that are still needed</li>
              <li>Mark activities as done if they've been completed</li>
              <li>Update due dates for activities that need to be rescheduled</li>
              <li>Consider if the lead needs additional follow-up</li>
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
