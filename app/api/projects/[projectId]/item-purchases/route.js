import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import ItemPurchase from "@/models/ItemPurchase";
import Store from "@/models/Store";
import Project from "@/models/Project";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/projects/[projectId]/item-purchases
 * Get all item purchases for a project
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId } = params;

    // Verify project exists
    const project = await Project.findById(projectId).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Fetch item purchases
    const itemPurchases = await ItemPurchase.find({ project: projectId })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ itemPurchases });
  } catch (error) {
    console.error("Error fetching item purchases:", error);

    // Handle authentication errors
    if (
      error.message === "Authentication required" ||
      error.message === "Admin access required"
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to fetch item purchases" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/projects/[projectId]/item-purchases
 * Create a new item purchase for a project
 */
export async function POST(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId } = params;
    const requestBody = await req.json();

    const {
      itemName,
      store,
      quotedPrice,
      paidPrice,
      purchaseDate,
      deliveryDate,
      notes,
    } = requestBody;

    // Validate required fields
    if (
      !itemName ||
      !store ||
      quotedPrice === undefined ||
      paidPrice === undefined ||
      !purchaseDate
    ) {
      return NextResponse.json(
        {
          error:
            "itemName, store, quotedPrice, paidPrice, and purchaseDate are required",
        },
        { status: 400 },
      );
    }

    // Validate prices
    const parsedQuotedPrice = parseFloat(quotedPrice);
    const parsedPaidPrice = parseFloat(paidPrice);

    if (isNaN(parsedQuotedPrice) || parsedQuotedPrice < 0) {
      return NextResponse.json(
        { error: "Quoted price must be a valid positive number" },
        { status: 400 },
      );
    }

    if (isNaN(parsedPaidPrice) || parsedPaidPrice < 0) {
      return NextResponse.json(
        { error: "Paid price must be a valid positive number" },
        { status: 400 },
      );
    }

    if (parsedPaidPrice > parsedQuotedPrice) {
      return NextResponse.json(
        { error: "Paid price cannot be greater than quoted price" },
        { status: 400 },
      );
    }

    // Verify project exists
    const project = await Project.findById(projectId).lean();
    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Check if store exists, create if it doesn't
    let storeDoc = await Store.findOne({ name: store }).lean();
    if (!storeDoc) {
      storeDoc = await Store.create({ name: store });
    }

    // Get the next order number
    const lastItem = await ItemPurchase.findOne({ project: projectId })
      .sort({ order: -1 })
      .lean();
    const nextOrder = lastItem ? lastItem.order + 1 : 0;

    // Calculate trade discount
    const calculatedTradeDiscount = parsedQuotedPrice - parsedPaidPrice;

    // Create item purchase
    const itemPurchase = await ItemPurchase.create({
      project: projectId,
      itemName,
      store,
      quotedPrice: parsedQuotedPrice,
      paidPrice: parsedPaidPrice,
      tradeDiscount: calculatedTradeDiscount,
      purchaseDate: new Date(purchaseDate),
      deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
      notes,
      order: nextOrder,
    });

    return NextResponse.json({ itemPurchase }, { status: 201 });
  } catch (error) {
    console.error("Error creating item purchase:", error);

    // Handle authentication errors
    if (
      error.message === "Authentication required" ||
      error.message === "Admin access required"
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to create item purchase" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/projects/[projectId]/item-purchases
 * Update item purchases order (for drag and drop)
 */
export async function PATCH(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId } = params;
    const { itemPurchases } = await req.json();

    if (!Array.isArray(itemPurchases)) {
      return NextResponse.json(
        { error: "itemPurchases must be an array" },
        { status: 400 },
      );
    }

    // Update order for each item purchase
    const updatePromises = itemPurchases.map((item, index) =>
      ItemPurchase.updateOne(
        { _id: item._id, project: projectId },
        { order: index },
      ),
    );

    await Promise.all(updatePromises);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating item purchases order:", error);

    // Handle authentication errors
    if (
      error.message === "Authentication required" ||
      error.message === "Admin access required"
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update item purchases order" },
      { status: 500 },
    );
  }
}
