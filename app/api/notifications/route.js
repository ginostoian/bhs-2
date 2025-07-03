import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Notification from "@/models/Notification";

/**
 * GET /api/notifications
 * Get user's notifications
 */
export async function GET(req) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    // Get query parameters
    const { searchParams } = new URL(req.url);
    const limit = parseInt(searchParams.get("limit")) || 20;
    const offset = parseInt(searchParams.get("offset")) || 0;
    const unreadOnly = searchParams.get("unread") === "true";

    // Build query
    const query = { user: session.user.id };
    if (unreadOnly) {
      query.isRead = false;
    }

    // Fetch notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          ...doc,
          id: doc._id.toString(),
          _id: undefined,
        })),
      );

    // Get total count for pagination
    const totalCount = await Notification.countDocuments(query);
    const unreadCount = await Notification.getUnreadCount(session.user.id);

    return NextResponse.json({
      notifications,
      pagination: {
        total: totalCount,
        limit,
        offset,
        hasMore: offset + limit < totalCount,
      },
      unreadCount,
    });
  } catch (error) {
    console.error("GET /api/notifications error:", error);
    return NextResponse.json(
      { error: "Failed to fetch notifications" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/notifications
 * Create a new notification (admin only)
 */
export async function POST(req) {
  try {
    // Get user session
    const session = await getServerSession(authOptions);
    if (!session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Parse request body
    const {
      userId,
      type,
      title,
      message,
      relatedId,
      relatedModel,
      priority,
      metadata,
    } = await req.json();

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectMongoose();

    // Create notification
    const notification = await Notification.createNotification({
      user: userId,
      type,
      title,
      message,
      relatedId,
      relatedModel,
      priority: priority || "medium",
      metadata: metadata || {},
    });

    return NextResponse.json({
      notification: {
        ...notification.toJSON(),
        id: notification._id.toString(),
        _id: undefined,
      },
    });
  } catch (error) {
    console.error("POST /api/notifications error:", error);
    return NextResponse.json(
      { error: "Failed to create notification" },
      { status: 500 },
    );
  }
}
