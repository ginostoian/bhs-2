import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Notification from "@/models/Notification";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';


/**
 * POST /api/notifications/mark-read
 * Mark notifications as read
 */
export async function POST(req) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse request body
    const { notificationIds, markAll } = await req.json();

    // Connect to MongoDB
    await connectMongoose();

    // Determine recipient type based on user role
    let recipientType = "user";
    if (session.user.role === "admin") {
      recipientType = "admin";
    } else if (session.user.role === "employee") {
      recipientType = "employee";
    }

    let result;

    if (markAll) {
      // Mark all notifications as read
      result = await Notification.updateMany(
        {
          recipient: session.user.id,
          recipientType: recipientType,
          isRead: false,
        },
        {
          $set: { isRead: true },
        },
      );
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      result = await Notification.updateMany(
        {
          _id: { $in: notificationIds },
          recipient: session.user.id,
          recipientType: recipientType,
        },
        {
          $set: { isRead: true },
        },
      );
    } else {
      return NextResponse.json(
        { error: "No notification IDs provided" },
        { status: 400 },
      );
    }

    // Get updated unread count
    const unreadCount = await Notification.countDocuments({
      recipient: session.user.id,
      recipientType: recipientType,
      isRead: false,
    });

    return NextResponse.json({
      success: true,
      modifiedCount: result.modifiedCount,
      unreadCount,
    });
  } catch (error) {
    console.error("POST /api/notifications/mark-read error:", error);
    return NextResponse.json(
      { error: "Failed to mark notifications as read" },
      { status: 500 },
    );
  }
}
