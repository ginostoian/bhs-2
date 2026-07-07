import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import User from "@/models/User";

export const dynamic = "force-dynamic";

/**
 * PUT /api/admin/users/[userId]/password
 * Set a new password for a user account (admin only).
 */
export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);

    const { userId } = params;
    const { newPassword, confirmPassword } = await req.json();

    if (!newPassword || !confirmPassword) {
      return NextResponse.json(
        { error: "New password and confirmation are required" },
        { status: 400 },
      );
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: "New password must be at least 8 characters long" },
        { status: 400 },
      );
    }

    if (newPassword !== confirmPassword) {
      return NextResponse.json(
        { error: "Password confirmation does not match" },
        { status: 400 },
      );
    }

    await connectMongoose();

    const user = await User.findById(userId).select("+password");
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (user.password) {
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return NextResponse.json(
          { error: "New password must be different from the current password" },
          { status: 400 },
        );
      }
    }

    user.password = await bcrypt.hash(newPassword, 12);
    await user.save();

    return NextResponse.json({
      message: "Password updated successfully",
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("PUT /api/admin/users/[userId]/password error:", error);

    const status =
      error.message === "Authentication required" ||
      error.message === "Admin access required"
        ? 401
        : 500;

    return NextResponse.json(
      { error: error.message || "Failed to update password" },
      { status },
    );
  }
}
