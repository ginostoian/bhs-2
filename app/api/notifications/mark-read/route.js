import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Notification from "@/models/Notification";

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

    let result;

    if (markAll) {
      // Mark all notifications as read
      result = await Notification.markAllAsRead(session.user.id);
    } else if (notificationIds && notificationIds.length > 0) {
      // Mark specific notifications as read
      result = await Notification.markAsRead(session.user.id, notificationIds);
    } else {
      return NextResponse.json(
        { error: "No notification IDs provided" },
        { status: 400 },
      );
    }

    // Get updated unread count
    const unreadCount = await Notification.getUnreadCount(session.user.id);

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
