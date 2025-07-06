import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import mongoose from "mongoose";
import MoodboardSection from "@/models/MoodboardSection";
import Moodboard from "@/models/Moodboard";

/**
 * GET /api/moodboards/[id]/sections
 * Get all sections for a moodboard
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

    // Check if moodboard exists and user has access
    const moodboard = await Moodboard.findById(params.id);
    if (!moodboard) {
      return NextResponse.json(
        { error: "Moodboard not found" },
        { status: 404 },
      );
    }

    if (
      session.user.role === "user" &&
      moodboard.user.toString() !== session.user.id
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const sections = await MoodboardSection.aggregate([
      {
        $match: {
          moodboard: new mongoose.Types.ObjectId(params.id),
          isActive: true,
        },
      },
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
      { $sort: { order: 1 } },
    ]);

    // Process sections data
    const sectionsData = sections
      .filter((section) => section && section._id) // Filter out any undefined sections
      .map((section) => ({
        id: section._id?.toString() || "",
        name: section.name || "",
        description: section.description || "",
        color: section.color || "#3B82F6",
        icon: section.icon || "📋",
        order: section.order || 0,
        isCollapsed: section.isCollapsed || false,
        notes: section.notes || "",
        products: (section.products || [])
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
      }));

    return NextResponse.json({ sections: sectionsData });
  } catch (error) {
    console.error("Error fetching sections:", error);
    return NextResponse.json(
      { error: "Failed to fetch sections" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/moodboards/[id]/sections
 * Create a new section (admin only)
 */
export async function POST(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const body = await request.json();
    const { name, description, color, icon, isCollapsed, notes } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: "Section name is required" },
        { status: 400 },
      );
    }

    // Check if moodboard exists
    const moodboard = await Moodboard.findById(params.id);
    if (!moodboard) {
      return NextResponse.json(
        { error: "Moodboard not found" },
        { status: 404 },
      );
    }

    // Get next order number
    const nextOrder = await MoodboardSection.getNextOrder(params.id);

    // Create new section
    const section = new MoodboardSection({
      moodboard: params.id,
      name,
      description,
      color: color || "#3B82F6",
      icon: icon || "📋",
      isCollapsed: isCollapsed || false,
      notes,
      order: nextOrder,
    });

    await section.save();

    // Return section with empty products array for frontend consistency
    const sectionWithProducts = {
      ...section.toObject(),
      id: section._id.toString(),
      _id: undefined,
      products: [],
    };

    return NextResponse.json({ section: sectionWithProducts }, { status: 201 });
  } catch (error) {
    console.error("Error creating section:", error);
    return NextResponse.json(
      { error: "Failed to create section" },
      { status: 500 },
    );
  }
}
