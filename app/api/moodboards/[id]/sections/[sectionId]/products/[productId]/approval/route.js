import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import MoodboardProduct from "@/models/MoodboardProduct";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';


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

    const moodboardProduct = await MoodboardProduct.findById(params.productId);
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
    await moodboardProduct.populate("product");

    return NextResponse.json({ product: moodboardProduct });
  } catch (error) {
    console.error("Error updating product approval:", error);
    return NextResponse.json(
      { error: "Failed to update product approval" },
      { status: 500 },
    );
  }
}
