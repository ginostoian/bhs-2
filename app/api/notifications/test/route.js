import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import {
  sendWelcomeEmail,
  sendDocumentAddedEmail,
  sendPaymentDueEmail,
  sendProjectStatusUpdateEmail,
  sendUserInactivityEmail,
} from "@/libs/emailService";

/**
 * POST /api/notifications/test
 * Send test notifications for admin testing
 */
export async function POST(request) {
  try {
    // Check authentication and admin access
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { userId, type } = await request.json();

    if (!userId || !type) {
      return NextResponse.json(
        { message: "User ID and notification type are required" },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectMongoose();

    // Find the user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Send test notification based on type
    let emailResult;

    switch (type) {
      case "welcome":
        emailResult = await sendWelcomeEmail(user.email, user.name);
        break;

      case "document":
        emailResult = await sendDocumentAddedEmail(
          user.email,
          user.name,
          "test",
          "Test Document",
          "This is a test document",
          "test-id",
        );
        break;

      case "payment":
        emailResult = await sendPaymentDueEmail(
          user.email,
          user.name,
          "Test Payment",
          "$100.00",
          new Date().toLocaleDateString(),
          false,
        );
        break;

      case "project":
        emailResult = await sendProjectStatusUpdateEmail(
          user.email,
          user.name,
          "Planning",
          "In Progress",
        );
        break;

      case "inactivity":
        emailResult = await sendUserInactivityEmail(
          user.email,
          user.name,
          new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
          10,
        );
        break;

      default:
        return NextResponse.json(
          { message: "Invalid notification type" },
          { status: 400 },
        );
    }

    if (!emailResult.success) {
      return NextResponse.json(
        { message: `Failed to send email: ${emailResult.error}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      message: "Test notification sent successfully",
      type,
      user: user.email,
    });
  } catch (error) {
    console.error("Error sending test notification:", error);
    return NextResponse.json(
      { message: "Failed to send test notification" },
      { status: 500 },
    );
  }
}
