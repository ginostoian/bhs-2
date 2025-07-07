import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import EmailPreference from "@/models/EmailPreference";
import User from "@/models/User";

/**
 * PUT /api/users/[id]/email-preferences
 * Update email preferences for a specific user (admin only)
 */
export async function PUT(request, { params }) {
  try {
    // Check authentication and admin access
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;
    const preferences = await request.json();

    // Connect to MongoDB
    await connectMongoose();

    // Verify user exists
    const user = await User.findById(id);
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    // Get or create email preferences for the user
    let emailPrefs = await EmailPreference.findOne({ user: id });

    if (!emailPrefs) {
      // Create new email preferences
      emailPrefs = new EmailPreference({
        user: id,
        enabled: true,
        preferences: {
          welcome: true,
          documents: true,
          payments: true,
          projectStatus: true,
          announcements: true,
          marketing: false,
        },
      });
    }

    // Update the preferences
    if (preferences.welcomeMessages !== undefined) {
      emailPrefs.preferences.welcome = preferences.welcomeMessages;
    }
    if (preferences.documentAdditions !== undefined) {
      emailPrefs.preferences.documents = preferences.documentAdditions;
    }
    if (preferences.paymentReminders !== undefined) {
      emailPrefs.preferences.payments = preferences.paymentReminders;
    }
    if (preferences.projectUpdates !== undefined) {
      emailPrefs.preferences.projectStatus = preferences.projectUpdates;
    }
    if (preferences.systemAnnouncements !== undefined) {
      emailPrefs.preferences.announcements = preferences.systemAnnouncements;
    }

    emailPrefs.lastUpdated = new Date();
    await emailPrefs.save();

    return NextResponse.json({
      message: "Email preferences updated successfully",
      preferences: {
        welcomeMessages: emailPrefs.preferences.welcome,
        documentAdditions: emailPrefs.preferences.documents,
        paymentReminders: emailPrefs.preferences.payments,
        projectUpdates: emailPrefs.preferences.projectStatus,
        systemAnnouncements: emailPrefs.preferences.announcements,
      },
    });
  } catch (error) {
    console.error("Error updating email preferences:", error);
    return NextResponse.json(
      { message: "Failed to update email preferences" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/users/[id]/email-preferences
 * Get email preferences for a specific user (admin only)
 */
export async function GET(request, { params }) {
  try {
    // Check authentication and admin access
    const session = await getServerSession(authOptions);
    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    // Connect to MongoDB
    await connectMongoose();

    // Get email preferences for the user
    const emailPrefs = await EmailPreference.findOne({ user: id });

    if (!emailPrefs) {
      return NextResponse.json({
        preferences: {
          welcomeMessages: true,
          documentAdditions: true,
          paymentReminders: true,
          projectUpdates: true,
          systemAnnouncements: true,
        },
      });
    }

    return NextResponse.json({
      preferences: {
        welcomeMessages: emailPrefs.preferences.welcome,
        documentAdditions: emailPrefs.preferences.documents,
        paymentReminders: emailPrefs.preferences.payments,
        projectUpdates: emailPrefs.preferences.projectStatus,
        systemAnnouncements: emailPrefs.preferences.announcements,
      },
    });
  } catch (error) {
    console.error("Error getting email preferences:", error);
    return NextResponse.json(
      { message: "Failed to get email preferences" },
      { status: 500 },
    );
  }
}
