import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import EmailPreference from "@/models/EmailPreference";
import { sendUserInactivityEmail } from "@/libs/emailService";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * POST /api/admin/user-activity/check-inactive
 * Check for inactive users and send notifications (admin only)
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
    const { daysThreshold = 10, sendNotifications = true } = body;

    // Calculate the cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

    // Find users who haven't logged in since the cutoff date
    const inactiveUsers = await User.find({
      lastLoginAt: { $lt: cutoffDate },
      role: { $ne: "admin" }, // Don't include admins
    }).lean();

    console.log(
      `Found ${inactiveUsers.length} users inactive for ${daysThreshold}+ days`,
    );

    const notificationResults = [];

    if (sendNotifications) {
      // Send inactivity notifications to admins
      for (const user of inactiveUsers) {
        try {
          const result = await sendUserInactivityEmail(
            user.email,
            user.name,
            user.lastLoginAt,
            daysThreshold,
          );

          notificationResults.push({
            userId: user._id.toString(),
            userEmail: user.email,
            userName: user.name,
            lastLoginAt: user.lastLoginAt,
            daysInactive: Math.floor(
              (new Date() - new Date(user.lastLoginAt)) / (1000 * 60 * 60 * 24),
            ),
            success: result.success,
            error: result.error,
          });

          if (result.success) {
            console.log(`✅ Inactivity notification sent for ${user.email}`);
          } else {
            console.error(
              `❌ Failed to send inactivity notification for ${user.email}:`,
              result.error,
            );
          }
        } catch (error) {
          console.error(
            `Error sending inactivity notification for ${user.email}:`,
            error,
          );
          notificationResults.push({
            userId: user._id.toString(),
            userEmail: user.email,
            userName: user.name,
            lastLoginAt: user.lastLoginAt,
            daysInactive: Math.floor(
              (new Date() - new Date(user.lastLoginAt)) / (1000 * 60 * 60 * 24),
            ),
            success: false,
            error: error.message,
          });
        }
      }
    }

    return NextResponse.json({
      message: "User activity check completed",
      statistics: {
        totalUsers: await User.countDocuments({ role: { $ne: "admin" } }),
        inactiveUsers: inactiveUsers.length,
        daysThreshold,
        notificationsSent: notificationResults.filter((r) => r.success).length,
        notificationsFailed: notificationResults.filter((r) => !r.success)
          .length,
      },
      inactiveUsers: inactiveUsers.map((user) => ({
        id: user._id.toString(),
        email: user.email,
        name: user.name,
        lastLoginAt: user.lastLoginAt,
        daysInactive: Math.floor(
          (new Date() - new Date(user.lastLoginAt)) / (1000 * 60 * 60 * 24),
        ),
        projectStatus: user.projectStatus,
      })),
      notificationResults,
    });
  } catch (error) {
    console.error("Error checking user activity:", error);
    return NextResponse.json(
      { error: "Failed to check user activity" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/admin/user-activity
 * Get user activity statistics (admin only)
 */
export async function GET(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const daysThreshold = parseInt(searchParams.get("days")) || 10;

    // Calculate the cutoff date
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysThreshold);

    // Get user activity statistics
    const totalUsers = await User.countDocuments({ role: { $ne: "admin" } });
    const activeUsers = await User.countDocuments({
      lastLoginAt: { $gte: cutoffDate },
      role: { $ne: "admin" },
    });
    const inactiveUsers = await User.countDocuments({
      lastLoginAt: { $lt: cutoffDate },
      role: { $ne: "admin" },
    });

    // Get users who haven't logged in at all (no lastLoginAt field)
    const neverLoggedIn = await User.countDocuments({
      lastLoginAt: { $exists: false },
      role: { $ne: "admin" },
    });

    return NextResponse.json({
      statistics: {
        totalUsers,
        activeUsers,
        inactiveUsers,
        neverLoggedIn,
        daysThreshold,
        activityRate:
          totalUsers > 0 ? ((activeUsers / totalUsers) * 100).toFixed(1) : 0,
      },
      cutoffDate: cutoffDate.toISOString(),
    });
  } catch (error) {
    console.error("Error getting user activity statistics:", error);
    return NextResponse.json(
      { error: "Failed to get user activity statistics" },
      { status: 500 },
    );
  }
}
