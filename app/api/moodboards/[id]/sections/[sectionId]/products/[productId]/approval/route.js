import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import MoodboardProduct from "@/models/MoodboardProduct";
import EmailPreference from "@/models/EmailPreference";
import { sendProductApprovalEmail } from "@/libs/emailService";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * PUT /api/moodboards/[id]/sections/[sectionId]/products/[productId]/approval
 * Update product approval status and comments
 */
export async function PUT(request, { params }) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const body = await request.json();
    const { approvalStatus, userComment, adminComment } = body;

    const moodboardProduct = await MoodboardProduct.findById(params.productId)
      .populate("product")
      .populate({
        path: "moodboard",
        populate: { path: "user", select: "name email" },
      });

    if (!moodboardProduct) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Verify product belongs to the section and moodboard
    if (
      moodboardProduct.section.toString() !== params.sectionId ||
      moodboardProduct.moodboard.toString() !== params.id
    ) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Store old approval status for comparison
    const oldApprovalStatus = moodboardProduct.approvalStatus;

    // Update approval status (users can update their own approval)
    if (approvalStatus !== undefined) {
      moodboardProduct.approvalStatus = approvalStatus;
    }

    // Update user comment (users can add their own comments)
    if (userComment !== undefined) {
      moodboardProduct.userComment = userComment;
    }

    // Update admin comment (only admins can add admin comments)
    if (adminComment !== undefined && session.user.role === "admin") {
      moodboardProduct.adminComment = adminComment;
    }

    await moodboardProduct.save();

    // Send email notification if approval status changed (and it's a user making the change)
    if (
      approvalStatus !== undefined &&
      oldApprovalStatus !== approvalStatus &&
      session.user.role === "user"
    ) {
      try {
        // Send admin notification about product approval/decline
        await sendProductApprovalEmail(
          moodboardProduct.moodboard.user.email,
          moodboardProduct.moodboard.user.name,
          moodboardProduct.product.name,
          approvalStatus,
          userComment,
          moodboardProduct.moodboard.name,
        );
        console.log(
          `✅ Product ${approvalStatus} notification sent to admin for ${moodboardProduct.product.name}`,
        );
      } catch (emailError) {
        console.error(
          "Failed to send product approval notification:",
          emailError,
        );
        // Don't fail the approval update if email fails
      }
    }

    return NextResponse.json({ product: moodboardProduct });
  } catch (error) {
    console.error("Error updating product approval:", error);
    return NextResponse.json(
      { error: "Failed to update product approval" },
      { status: 500 },
    );
  }
}
