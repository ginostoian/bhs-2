import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import ItemPurchase from "@/models/ItemPurchase";
import Store from "@/models/Store";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * PUT /api/projects/[projectId]/item-purchases/[itemId]
 * Update an item purchase
 */
export async function PUT(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId, itemId } = params;

    if (!itemId || itemId === "undefined") {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

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

    // Check if store exists, create if it doesn't
    let storeDoc = await Store.findOne({ name: store }).lean();
    if (!storeDoc) {
      storeDoc = await Store.create({ name: store });
    }

    // Calculate trade discount
    const calculatedTradeDiscount = parsedQuotedPrice - parsedPaidPrice;

    // Update item purchase
    const itemPurchase = await ItemPurchase.findOneAndUpdate(
      { _id: itemId, project: projectId },
      {
        itemName,
        store,
        quotedPrice: parsedQuotedPrice,
        paidPrice: parsedPaidPrice,
        tradeDiscount: calculatedTradeDiscount,
        purchaseDate: new Date(purchaseDate),
        deliveryDate: deliveryDate ? new Date(deliveryDate) : undefined,
        notes,
      },
      { new: true, runValidators: true },
    );

    if (!itemPurchase) {
      return NextResponse.json(
        { error: "Item purchase not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ itemPurchase });
  } catch (error) {
    console.error("Error updating item purchase:", error);

    // Handle authentication errors
    if (
      error.message === "Authentication required" ||
      error.message === "Admin access required"
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to update item purchase" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/projects/[projectId]/item-purchases/[itemId]
 * Delete an item purchase
 */
export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { projectId, itemId } = params;

    if (!itemId || itemId === "undefined") {
      return NextResponse.json({ error: "Invalid item ID" }, { status: 400 });
    }

    const itemPurchase = await ItemPurchase.findOneAndDelete({
      _id: itemId,
      project: projectId,
    });

    if (!itemPurchase) {
      return NextResponse.json(
        { error: "Item purchase not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting item purchase:", error);

    // Handle authentication errors
    if (
      error.message === "Authentication required" ||
      error.message === "Admin access required"
    ) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    return NextResponse.json(
      { error: "Failed to delete item purchase" },
      { status: 500 },
    );
  }
}
