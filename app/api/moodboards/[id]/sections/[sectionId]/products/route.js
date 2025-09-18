import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import MoodboardProduct from "@/models/MoodboardProduct";
import MoodboardSection from "@/models/MoodboardSection";
import Product from "@/models/Product";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

/**
 * GET /api/moodboards/[id]/sections/[sectionId]/products
 * Get all products in a section
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

    const products = await MoodboardProduct.find({
      section: params.sectionId,
      isActive: true,
    })
      .populate("product")
      .sort({ order: 1 });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/moodboards/[id]/sections/[sectionId]/products
 * Add a product to a section (admin only)
 */
export async function POST(request, { params }) {
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

    const body = await request.json();
    console.log("Request body:", body);
    console.log("Params:", params);

    const {
      productId,
      quantity,
      customPrice,
      notes,
      // Custom product fields
      customTitle,
      customSupplier,
      customCategory,
      customImageUrl,
      customProductUrl,
    } = body;

    // Validate required fields
    if (!productId && !customTitle) {
      console.log("Missing productId or customTitle in request");
      return NextResponse.json(
        { error: "Product ID or custom product title is required" },
        { status: 400 },
      );
    }

    // Check if section exists
    const section = await MoodboardSection.findById(params.sectionId);
    if (!section) {
      console.log("Section not found:", params.sectionId);
      return NextResponse.json({ error: "Section not found" }, { status: 404 });
    }

    let product;
    let finalProductId = productId;

    // Handle custom product creation
    if (customTitle) {
      // Create a new product in the database
      const newProduct = new Product({
        name: customTitle,
        description: notes || "",
        imageUrl:
          customImageUrl ||
          "https://via.placeholder.com/300x200?text=Custom+Product",
        productUrl: customProductUrl || "#",
        price: customPrice || 0,
        supplier: customSupplier || "Custom",
        category: customCategory || "Custom",
        isActive: true,
      });

      await newProduct.save();
      product = newProduct;
      finalProductId = newProduct._id;
      console.log("Created custom product:", newProduct._id);
    } else {
      // Use existing product
      product = await Product.findById(productId);
      if (!product) {
        console.log("Product not found:", productId);
        return NextResponse.json(
          { error: "Product not found" },
          { status: 404 },
        );
      }
    }

    // Get next order number
    const nextOrder = await MoodboardProduct.getNextOrder(params.sectionId);

    // Create new moodboard product
    const moodboardProduct = new MoodboardProduct({
      moodboard: params.id,
      section: params.sectionId,
      product: finalProductId,
      quantity: quantity || 1,
      customPrice: customTitle ? null : customPrice, // Don't use customPrice for custom products
      notes,
      order: nextOrder,
    });

    console.log("Creating moodboard product:", {
      moodboard: params.id,
      section: params.sectionId,
      product: finalProductId,
      quantity: quantity || 1,
      customPrice: customTitle ? null : customPrice,
      notes,
      order: nextOrder,
    });

    await moodboardProduct.save();
    await moodboardProduct.populate("product");

    return NextResponse.json({ product: moodboardProduct }, { status: 201 });
  } catch (error) {
    console.error("Error adding product:", error);
    return NextResponse.json(
      { error: "Failed to add product" },
      { status: 500 },
    );
  }
}
