import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Moodboard from "@/models/Moodboard";
import User from "@/models/User";
import EmailPreference from "@/models/EmailPreference";
import { sendMoodboardCreatedEmail } from "@/libs/emailService";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * GET /api/moodboards
 * Get moodboards - users see their own, admins see all
 */
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    let query = {};

    // If admin or designer and userId specified, get that user's moodboards
    if (
      (session.user.role === "admin" || session.user.role === "designer") &&
      userId
    ) {
      query.user = userId;
    }
    // If regular user, only get their own moodboards
    else if (session.user.role === "user") {
      query.user = session.user.id;
    }

    const moodboards = await Moodboard.find(query)
      .populate("user", "name email")
      .sort({ updatedAt: -1 });

    return NextResponse.json({ moodboards });
  } catch (error) {
    console.error("Error fetching moodboards:", error);
    return NextResponse.json(
      { error: "Failed to fetch moodboards" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/moodboards
 * Create a new moodboard (admin only)
 */
export async function POST(request) {
  try {
    // Check authentication and admin/designer role
    const session = await getServerSession(authOptions);
    if (
      !session ||
      (session.user.role !== "admin" && session.user.role !== "designer")
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const body = await request.json();
    const { userId, name, description, projectType, notes, project } = body;

    // Validate required fields
    if (!userId || !name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Create new moodboard
    const moodboard = new Moodboard({
      user: userId,
      name,
      description,
      projectType,
      notes,
      project: project || null,
    });

    await moodboard.save();

    // Populate user data for response
    await moodboard.populate("user", "name email");

    // Send email notification to the user (async, don't wait for it)
    try {
      // Check if user has email notifications enabled for documents (moodboards fall under this category)
      const emailEnabled = await EmailPreference.isEmailEnabled(
        userId,
        "documents",
      );

      if (emailEnabled) {
        await sendMoodboardCreatedEmail(
          user.email,
          user.name,
          name,
          description,
          projectType,
        );
        console.log(`✅ Moodboard creation email sent to ${user.email}`);
      }
    } catch (emailError) {
      console.error("Failed to send moodboard creation email:", emailError);
      // Don't fail the moodboard creation if email fails
    }

    return NextResponse.json({ moodboard }, { status: 201 });
  } catch (error) {
    console.error("Error creating moodboard:", error);
    return NextResponse.json(
      { error: "Failed to create moodboard" },
      { status: 500 },
    );
  }
}
