import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Product from "@/models/Product";

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';


/**
 * GET /api/products
 * Get all products with optional filtering
 */
export async function GET(request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Connect to MongoDB
    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const supplier = searchParams.get("supplier");
    const search = searchParams.get("search");
    const active = searchParams.get("active");

    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by supplier
    if (supplier) {
      query.supplier = supplier;
    }

    // Filter by active status
    if (active !== null) {
      query.isActive = active === "true";
    }

    // Search functionality
    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { description: { $regex: search, $options: "i" } },
          { supplier: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ],
      };
    }

    const products = await Product.find(query).sort({ name: 1 });

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
 * POST /api/products
 * Create a new product (admin only)
 */
export async function POST(request) {
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
      imageUrl,
      productUrl,
      price,
      supplier,
      category,
      sku,
      tags,
      specifications,
    } = body;

    // Validate required fields
    if (!name || !imageUrl || !productUrl || !price || !supplier || !category) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create new product
    const product = new Product({
      name,
      description,
      imageUrl,
      productUrl,
      price: parseFloat(price),
      supplier,
      category,
      sku,
      tags: tags || [],
      specifications: specifications || {},
    });

    await product.save();

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 },
    );
  }
}
