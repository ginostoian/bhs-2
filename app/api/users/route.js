import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";

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

    // Fetch all users, excluding sensitive fields
    const users = await User.find(
      {},
      {
        email: 1,
        name: 1,
        role: 1,
        createdAt: 1,
        hasAccess: 1,
      },
    ).sort({ createdAt: -1 });

    return NextResponse.json({ users });
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
    const { email, name, role = "user" } = await req.json();

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

    // Create new user
    const user = await User.create({
      email: email.toLowerCase(),
      name,
      role,
    });

    return NextResponse.json(
      {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
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
