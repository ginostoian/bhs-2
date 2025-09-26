import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Store from "@/models/Store";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/stores
 * Get all active stores
 */
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const stores = await Store.find({ isActive: true })
      .sort({ name: 1 })
      .lean();

    return NextResponse.json({ stores });
  } catch (error) {
    console.error("Error fetching stores:", error);

    // Handle authentication errors
    if (
      error.message === "Authentication required" ||
      error.message === "Admin access required"
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch stores" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/stores
 * Create a new store
 */
export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { name, color } = await req.json();

    if (!name) {
      return NextResponse.json(
        { error: "Store name is required" },
        { status: 400 },
      );
    }

    // Check if store already exists
    const existingStore = await Store.findOne({ name }).lean();
    if (existingStore) {
      return NextResponse.json(
        { error: "Store already exists" },
        { status: 400 },
      );
    }

    const store = await Store.create({
      name,
      color: color || "#6B7280",
    });

    return NextResponse.json({ store }, { status: 201 });
  } catch (error) {
    console.error("Error creating store:", error);

    // Handle authentication errors
    if (
      error.message === "Authentication required" ||
      error.message === "Admin access required"
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to create store" },
      { status: 500 },
    );
  }
}
