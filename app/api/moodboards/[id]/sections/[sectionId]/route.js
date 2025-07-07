import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import mongoose from "mongoose";
import MoodboardSection from "@/models/MoodboardSection";
import Moodboard from "@/models/Moodboard";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';


/**
 * PUT /api/moodboards/[id]/sections/[sectionId]
 * Update a section (admin only)
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
    const {
      name,
      description,
      color,
      icon,
      isCollapsed,
      notes,
      order,
      isActive,
    } = body;

    const section = await MoodboardSection.findById(params.sectionId);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Verify section belongs to the moodboard
    if (section.moodboard.toString() !== params.id) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Update fields
    if (name !== undefined) section.name = name;
    if (description !== undefined) section.description = description;
    if (color !== undefined) section.color = color;
    if (icon !== undefined) section.icon = icon;
    if (isCollapsed !== undefined) section.isCollapsed = isCollapsed;
    if (notes !== undefined) section.notes = notes;
    if (order !== undefined) section.order = order;
    if (isActive !== undefined) section.isActive = isActive;

    await section.save();

    // Get updated section with products using aggregation
    const populatedSections = await MoodboardSection.aggregate([
      { $match: { _id: new mongoose.Types.ObjectId(params.sectionId) } },
      {
        $lookup: {
          from: "moodboardproducts",
          localField: "_id",
          foreignField: "section",
          as: "products",
        },
      },
      { $unwind: { path: "$products", preserveNullAndEmptyArrays: true } },
      { $match: { "products.isActive": { $ne: false } } },
      {
        $lookup: {
          from: "products",
          localField: "products.product",
          foreignField: "_id",
          as: "products.productData",
        },
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          description: { $first: "$description" },
          color: { $first: "$color" },
          icon: { $first: "$icon" },
          order: { $first: "$order" },
          isCollapsed: { $first: "$isCollapsed" },
          notes: { $first: "$notes" },
          products: { $push: "$products" },
        },
      },
    ]);

    const populatedSection = populatedSections[0];

    const sectionWithProducts = {
      id: populatedSection?._id?.toString() || "",
      name: populatedSection?.name || "",
      description: populatedSection?.description || "",
      color: populatedSection?.color || "#3B82F6",
      icon: populatedSection?.icon || "📋",
      order: populatedSection?.order || 0,
      isCollapsed: populatedSection?.isCollapsed || false,
      notes: populatedSection?.notes || "",
      products: (populatedSection?.products || [])
        .filter(
          (product) => product && product._id && product.isActive !== false,
        )
        .map((product) => ({
          id: product._id?.toString() || "",
          quantity: product.quantity || 1,
          approvalStatus: product.approvalStatus || "approved",
          userComment: product.userComment || "",
          adminComment: product.adminComment || "",
          order: product.order || 0,
          customPrice: product.customPrice || null,
          notes: product.notes || "",
          product: product.productData?.[0]
            ? {
                id: product.productData[0]._id?.toString() || "",
                name: product.productData[0].name || "",
                description: product.productData[0].description || "",
                imageUrl: product.productData[0].imageUrl || "",
                productUrl: product.productData[0].productUrl || "",
                price: product.productData[0].price || 0,
                supplier: product.productData[0].supplier || "",
                category: product.productData[0].category || "",
              }
            : null,
        }))
        .sort((a, b) => (a.order || 0) - (b.order || 0)),
    };

    return NextResponse.json({ section: sectionWithProducts });
  } catch (error) {
    console.error("Error updating section:", error);
    return NextResponse.json(
      { error: "Failed to update section" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/moodboards/[id]/sections/[sectionId]
 * Delete a section (admin only)
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

    const section = await MoodboardSection.findById(params.sectionId);
    if (!section) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Verify section belongs to the moodboard
    if (section.moodboard.toString() !== params.id) {
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    // Delete section and all its products
    await MoodboardSection.findByIdAndDelete(params.sectionId);

    return NextResponse.json({ message: "Section deleted successfully" });
  } catch (error) {
    console.error("Error deleting section:", error);
    return NextResponse.json(
      { error: "Failed to delete section" },
      { status: 500 },
    );
  }
}
