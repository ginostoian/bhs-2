import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * PUT /api/users/[id]
 * Update a user (admin only)
 */
export async function PUT(req, { params }) {
  try {
    console.log("PUT /api/users/[id] - Starting update for ID:", params.id);

    // Verify admin access
    await requireAdmin(req);

    // Get user ID from params
    const { id } = params;
    console.log("User ID from params:", id);

    // Parse request body
    const body = await req.json();
    console.log("Full request body:", body);

    const { email, name, role, projectStatus } = body;
    console.log("Extracted fields:", { email, name, role, projectStatus });
    console.log(
      "Project status type:",
      typeof projectStatus,
      "value:",
      projectStatus,
    );

    // Connect to MongoDB
    await connectMongoose();

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      console.log("User not found for ID:", id);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    console.log("Existing user found:", existingUser.email);
    console.log("Current user data:", {
      email: existingUser.email,
      name: existingUser.name,
      role: existingUser.role,
      projectStatus: existingUser.projectStatus,
    });

    // Check if email is being changed and if it's already taken
    if (email && email !== existingUser.email) {
      const emailExists = await User.findOne({
        email: email.toLowerCase(),
        _id: { $ne: id }, // Exclude current user
      });
      if (emailExists) {
        console.log("Email already in use:", email);
        return NextResponse.json(
          { error: "Email already in use" },
          { status: 409 },
        );
      }
    }

    // Prepare update object - allow partial updates
    const updateData = {};
    if (email !== undefined) updateData.email = email.toLowerCase();
    if (name !== undefined) updateData.name = name;
    if (role !== undefined) updateData.role = role;
    if (projectStatus !== undefined) updateData.projectStatus = projectStatus;

    console.log("Update data being applied:", updateData);

    // Update user
    console.log("Attempting to update user with data:", updateData);

    const updatedUser = await User.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedUser) {
      console.log("Failed to update user - no user returned");
      return NextResponse.json(
        { error: "Failed to update user" },
        { status: 500 },
      );
    }

    console.log("User updated successfully:", updatedUser.email);
    console.log("Updated user data:", {
      id: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
      projectStatus: updatedUser.projectStatus,
    });

    return NextResponse.json({
      user: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.role,
        projectStatus: updatedUser.projectStatus,
        createdAt: updatedUser.createdAt,
      },
    });
  } catch (error) {
    console.error("PUT /api/users/[id] error:", error);
    console.error("Error stack:", error.stack);

    // Provide more specific error messages
    let errorMessage = "Failed to update user";
    if (error.name === "ValidationError") {
      errorMessage =
        "Validation error: " +
        Object.values(error.errors)
          .map((e) => e.message)
          .join(", ");
    } else if (error.name === "CastError") {
      errorMessage = "Invalid user ID format";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

/**
 * DELETE /api/users/[id]
 * Delete a user (admin only)
 */
export async function DELETE(req, { params }) {
  try {
    // Verify admin access
    await requireAdmin(req);

    // Get user ID from params
    const { id } = params;

    // Connect to MongoDB
    await connectMongoose();

    // Check if user exists
    const existingUser = await User.findById(id);
    if (!existingUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prevent deletion of the last admin
    if (existingUser.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return NextResponse.json(
          { error: "Cannot delete the last admin user" },
          { status: 400 },
        );
      }
    }

    // Delete user
    await User.findByIdAndDelete(id);

    return NextResponse.json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("DELETE /api/users/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete user" },
      { status: 500 },
    );
  }
}
