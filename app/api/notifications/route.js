import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Notification from "@/models/Notification";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';


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

    // Determine recipient type based on user role
    let recipientType = "user";
    if (session.user.role === "admin") {
      recipientType = "admin";
    } else if (session.user.role === "employee") {
      recipientType = "employee";
    }

    // Build query
    const query = { recipient: session.user.id, recipientType: recipientType };
    if (unreadOnly) {
      query.isRead = false;
    }

    // Fetch notifications
    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(offset)
      .lean();

    // Convert to plain objects with proper ID handling
    const notificationsData = notifications.map((doc) => ({
      id: doc._id.toString(),
      type: doc.type,
      title: doc.title,
      message: doc.message,
      isRead: doc.isRead,
      relatedId: doc.relatedId ? doc.relatedId.toString() : null,
      relatedModel: doc.relatedModel,
      priority: doc.priority,
      metadata: doc.metadata,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    }));

    // Get total count for pagination
    const totalCount = await Notification.countDocuments(query);
    const unreadCount = await Notification.countDocuments({
      recipient: session.user.id,
      recipientType: recipientType,
      isRead: false,
    });

    return NextResponse.json({
      notifications: notificationsData,
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
    if (session?.user?.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Parse request body
    const {
      recipientId,
      recipientType,
      type,
      title,
      message,
      relatedId,
      relatedModel,
      priority,
      metadata,
    } = await req.json();

    // Validate required fields
    if (!recipientId || !recipientType || !type || !title || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectMongoose();

    // Create notification
    const notification = await Notification.createNotificationForRecipient({
      recipient: recipientId,
      recipientType: recipientType,
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
