import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Moodboard from "@/models/Moodboard";
import User from "@/models/User";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';


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

    // If admin and userId specified, get that user's moodboards
    if (session.user.role === "admin" && userId) {
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
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const body = await request.json();
    const { userId, name, description, projectType, notes } = body;

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
    });

    await moodboard.save();

    // Populate user data for response
    await moodboard.populate("user", "name email");

    return NextResponse.json({ moodboard }, { status: 201 });
  } catch (error) {
    console.error("Error creating moodboard:", error);
    return NextResponse.json(
      { error: "Failed to create moodboard" },
      { status: 500 },
    );
  }
}
