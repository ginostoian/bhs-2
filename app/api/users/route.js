import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import EmailPreference from "@/models/EmailPreference";
import { requireAdmin } from "@/libs/requireAdmin";
import {
  sendWelcomeEmail,
  sendAdminNewUserNotification,
} from "@/libs/emailService";

/**
 * GET /api/users
 * List all users (admin only)
 */
export async function GET(req) {
  try {
    // Verify admin access
    await requireAdmin(req);

    // Connect to MongoDB
    await connectMongoose();

    // Parse query params
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);
    const search = searchParams.get("search")?.trim() || "";

    // Build query
    const query = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    // Get total count for pagination
    const totalCount = await User.countDocuments(query);

    // Fetch paginated users, excluding sensitive fields
    const users = await User.find(query, {
      email: 1,
      name: 1,
      role: 1,
      projectStatus: 1,
      createdAt: 1,
      hasAccess: 1,
    })
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ users, totalCount });
  } catch (error) {
    console.error("GET /api/users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch users" },
      { status: 401 },
    );
  }
}

/**
 * POST /api/users
 * Create a new user (admin only)
 */
export async function POST(req) {
  try {
    // Verify admin access
    await requireAdmin(req);

    // Parse request body
    const {
      email,
      name,
      role = "user",
      projectStatus = "Lead",
      password,
    } = await req.json();

    // Validate required fields
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongoose();

    // Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 },
      );
    }

    // Prepare user data
    const userData = {
      email: email.toLowerCase(),
      name,
      role,
      projectStatus,
    };

    // Add password if provided
    if (password) {
      const bcrypt = require("bcryptjs");
      userData.password = await bcrypt.hash(password, 12);
    }

    // Create new user
    const user = await User.create(userData);

    // Create email preferences for the new user
    await EmailPreference.create({
      user: user._id,
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

    // Send welcome email to the new user (async, don't wait for it)
    try {
      await sendWelcomeEmail(user.email, user.name);
      console.log(`✅ Welcome email sent to ${user.email}`);
    } catch (error) {
      console.error(
        `❌ Failed to send welcome email to ${user.email}:`,
        error.message,
      );
    }

    // Send admin notification (async, don't wait for it)
    try {
      await sendAdminNewUserNotification(
        user.email,
        user.name,
        session?.user?.email || "Admin",
      );
      console.log(`✅ Admin notification sent for new user ${user.email}`);
    } catch (error) {
      console.error(
        `❌ Failed to send admin notification for ${user.email}:`,
        error.message,
      );
    }

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
          projectStatus: user.projectStatus,
          createdAt: user.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/users error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create user" },
      { status: 500 },
    );
  }
}
