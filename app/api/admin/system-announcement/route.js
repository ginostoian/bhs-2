import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import EmailPreference from "@/models/EmailPreference";
import { sendAnnouncementEmail } from "@/libs/emailService";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/system-announcement
 * Send system announcement to all users (admin only)
 */
export async function POST(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const body = await request.json();
    const { title, message, priority = "medium" } = body;

    // Validate required fields
    if (!title || !message) {
      return NextResponse.json(
        { error: "Title and message are required" },
        { status: 400 },
      );
    }

    // Validate priority
    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!validPriorities.includes(priority)) {
      return NextResponse.json(
        { error: "Invalid priority level" },
        { status: 400 },
      );
    }

    // Get all users with email notifications enabled for announcements
    const users = await User.find({}).lean();
    const emailResults = [];

    // Send announcement email to each user
    for (const user of users) {
      try {
        const emailEnabled = await EmailPreference.isEmailEnabled(
          user._id,
          "announcements",
        );

        if (emailEnabled) {
          const result = await sendAnnouncementEmail(
            user.email,
            user.name,
            title,
            message,
            priority,
          );

          emailResults.push({
            userId: user._id.toString(),
            userEmail: user.email,
            userName: user.name,
            success: result.success,
            error: result.error,
          });

          if (result.success) {
            console.log(`✅ System announcement sent to ${user.email}`);
          } else {
            console.error(
              `❌ Failed to send announcement to ${user.email}:`,
              result.error,
            );
          }
        } else {
          emailResults.push({
            userId: user._id.toString(),
            userEmail: user.email,
            userName: user.name,
            success: false,
            error: "Email notifications disabled",
          });
        }
      } catch (error) {
        console.error(`Error sending announcement to ${user.email}:`, error);
        emailResults.push({
          userId: user._id.toString(),
          userEmail: user.email,
          userName: user.name,
          success: false,
          error: error.message,
        });
      }
    }

    // Calculate statistics
    const totalUsers = emailResults.length;
    const successfulSends = emailResults.filter((r) => r.success).length;
    const failedSends = emailResults.filter((r) => !r.success).length;

    return NextResponse.json({
      message: "System announcement sent",
      statistics: {
        totalUsers,
        successfulSends,
        failedSends,
        successRate:
          totalUsers > 0
            ? ((successfulSends / totalUsers) * 100).toFixed(1)
            : 0,
      },
      details: emailResults,
      announcement: {
        title,
        message,
        priority,
        sentAt: new Date().toISOString(),
        sentBy: session.user.email,
      },
    });
  } catch (error) {
    console.error("Error sending system announcement:", error);
    return NextResponse.json(
      { error: "Failed to send system announcement" },
      { status: 500 },
    );
  }
}
