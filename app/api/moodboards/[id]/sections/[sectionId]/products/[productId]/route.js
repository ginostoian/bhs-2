import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import MoodboardProduct from "@/models/MoodboardProduct";
import Product from "@/models/Product";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * PUT /api/moodboards/[id]/sections/[sectionId]/products/[productId]
 * Update a moodboard product
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
    const {
      quantity, customPrice, customTitle, customSupplier, customCategory,
      customImageUrl, customProductUrl, notes, order, isActive,
    } = body;

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

    // Update fields
    if (quantity !== undefined) moodboardProduct.quantity = quantity;
    if (customPrice !== undefined) moodboardProduct.customPrice = customPrice;
    if (customTitle !== undefined) moodboardProduct.customTitle = customTitle;
    if (customSupplier !== undefined) moodboardProduct.customSupplier = customSupplier;
    if (customCategory !== undefined) moodboardProduct.customCategory = customCategory;
    if (customImageUrl !== undefined) moodboardProduct.customImageUrl = customImageUrl;
    if (customProductUrl !== undefined) moodboardProduct.customProductUrl = customProductUrl;
    if (notes !== undefined) moodboardProduct.notes = notes;
    if (order !== undefined) moodboardProduct.order = order;
    if (isActive !== undefined) moodboardProduct.isActive = isActive;

    await moodboardProduct.save();
    await moodboardProduct.populate({ path: "product", model: Product });

    return NextResponse.json({ product: moodboardProduct });
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/moodboards/[id]/sections/[sectionId]/products/[productId]
 * Delete a moodboard product (admin only)
 */
export async function DELETE(request, { params }) {
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

    await MoodboardProduct.findByIdAndDelete(params.productId);

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 },
    );
  }
}
