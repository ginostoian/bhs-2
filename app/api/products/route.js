import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Product from "@/models/Product";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

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
    const brand = searchParams.get("brand");
    const catalogueCategory = searchParams.get("catalogueCategory");
    const search = searchParams.get("search");
    const active = searchParams.get("active");
    const sort = searchParams.get("sort") || "name";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    let query = {};

    // Filter by category
    if (category) {
      query.category = category;
    }

    // Filter by supplier
    if (supplier) {
      query.supplier = supplier;
    }

    if (brand) {
      query.brand = brand;
    }

    if (catalogueCategory) {
      query.catalogueCategory = catalogueCategory;
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
          { brand: { $regex: search, $options: "i" } },
          { catalogueCategory: { $regex: search, $options: "i" } },
          { tags: { $in: [new RegExp(search, "i")] } },
        ],
      };
    }

    const sortQuery =
      sort === "updated"
        ? { updatedAt: -1 }
        : sort === "price"
          ? { price: 1, name: 1 }
          : { name: 1 };

    const totalCount = await Product.countDocuments(query);
    const products = await Product.find(query)
      .sort(sortQuery)
      .skip((page - 1) * limit)
      .limit(limit);

    return NextResponse.json({ products, totalCount });
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
      slug,
      brand,
      catalogueCategory,
      catalogueEnabled,
      stockStatus,
      gallery,
      finish,
      material,
      leadTimeDays,
      variants,
      isActive,
    } = body;

    // Validate required fields
    if (
      !name ||
      !imageUrl ||
      !supplier ||
      !category ||
      price === undefined ||
      price === null ||
      Number.isNaN(Number(price))
    ) {
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
      productUrl: productUrl || undefined,
      price: parseFloat(price),
      supplier,
      category,
      sku,
      tags: tags || [],
      specifications: specifications || {},
      slug: slug || undefined,
      brand,
      catalogueCategory: catalogueCategory || undefined,
      catalogueEnabled,
      stockStatus,
      gallery: Array.isArray(gallery) ? gallery : [],
      finish: finish || undefined,
      material: material || undefined,
      leadTimeDays:
        leadTimeDays === undefined || leadTimeDays === null || leadTimeDays === ""
          ? undefined
          : parseInt(leadTimeDays, 10),
      variants: Array.isArray(variants) ? variants : [],
      isActive,
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
