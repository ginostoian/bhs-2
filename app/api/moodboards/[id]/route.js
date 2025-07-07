import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Moodboard from "@/models/Moodboard";
import MoodboardSection from "@/models/MoodboardSection";
import MoodboardProduct from "@/models/MoodboardProduct";
import EmailPreference from "@/models/EmailPreference";
import { sendMoodboardStatusUpdateEmail } from "@/libs/emailService";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * GET /api/moodboards/[id]
 * Get a specific moodboard with sections and products
 */
export async function GET(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const moodboard = await Moodboard.findById(params.id).populate(
      "user",
      "name email",
    );

    if (!moodboard) {
      return NextResponse.json(
        { error: "Moodboard not found" },
        { status: 404 },
      );
    }

    // Check access - users can only see their own moodboards
    if (
      session.user.role === "user" &&
      moodboard.user._id.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get sections with products
    const sections = await MoodboardSection.find({
      moodboard: params.id,
      isActive: true,
    })
      .populate({
        path: "products",
        match: { isActive: true },
        populate: "product",
        options: { sort: { order: 1 } },
      })
      .sort({ order: 1 });

    return NextResponse.json({ moodboard, sections });
  } catch (error) {
    console.error("Error fetching moodboard:", error);
    return NextResponse.json(
      { error: "Failed to fetch moodboard" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/moodboards/[id]
 * Update a moodboard (admin only)
 */
export async function PUT(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const body = await request.json();
    const { name, description, projectType, notes, status, isActive } = body;

    const moodboard = await Moodboard.findById(params.id).populate(
      "user",
      "name email",
    );
    if (!moodboard) {
      return NextResponse.json(
        { error: "Moodboard not found" },
        { status: 404 },
      );
    }

    // Store old status for comparison
    const oldStatus = moodboard.status;

    // Update fields
    if (name !== undefined) moodboard.name = name;
    if (description !== undefined) moodboard.description = description;
    if (projectType !== undefined) moodboard.projectType = projectType;
    if (notes !== undefined) moodboard.notes = notes;
    if (status !== undefined) moodboard.status = status;
    if (isActive !== undefined) moodboard.isActive = isActive;

    await moodboard.save();

    // Send email notification if status changed
    if (status !== undefined && oldStatus !== status) {
      try {
        // Check if user has email notifications enabled for documents (moodboards fall under this category)
        const emailEnabled = await EmailPreference.isEmailEnabled(
          moodboard.user._id,
          "documents",
        );

        if (emailEnabled) {
          await sendMoodboardStatusUpdateEmail(
            moodboard.user.email,
            moodboard.user.name,
            moodboard.name,
            oldStatus,
            status,
          );
          console.log(
            `✅ Moodboard status update email sent to ${moodboard.user.email}`,
          );
        }
      } catch (emailError) {
        console.error(
          "Failed to send moodboard status update email:",
          emailError,
        );
        // Don't fail the moodboard update if email fails
      }
    }

    return NextResponse.json({ moodboard });
  } catch (error) {
    console.error("Error updating moodboard:", error);
    return NextResponse.json(
      { error: "Failed to update moodboard" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/moodboards/[id]
 * Delete a moodboard (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const moodboard = await Moodboard.findById(params.id);
    if (!moodboard) {
      return NextResponse.json(
        { error: "Moodboard not found" },
        { status: 404 },
      );
    }

    // Delete related sections and products
    await MoodboardSection.deleteMany({ moodboard: params.id });
    await MoodboardProduct.deleteMany({ moodboard: params.id });
    await Moodboard.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Moodboard deleted successfully" });
  } catch (error) {
    console.error("Error deleting moodboard:", error);
    return NextResponse.json(
      { error: "Failed to delete moodboard" },
      { status: 500 },
    );
  }
}
