import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/admin/users
 * Get all admin users (admin only)
 */
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const admins = await User.find({ role: "admin" })
      .select("name email role")
      .sort({ name: 1 });

    return NextResponse.json({ admins });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch admin users" },
      { status: 401 },
    );
  }
}
