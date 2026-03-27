import crypto from "crypto";
import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import CatalogueShare from "@/models/CatalogueShare";

export const dynamic = "force-dynamic";

function sanitizeItem(item = {}) {
  const quantity = Math.max(1, parseInt(item.quantity || 1, 10));
  const unitPrice = Number(item.unitPrice || 0);

  return {
    productId: String(item.productId || ""),
    variantId: String(item.variantId || "default"),
    quantity,
    name: String(item.name || "").trim(),
    brand: String(item.brand || "").trim(),
    productType: String(item.productType || "").trim(),
    catalogueCategory: String(item.catalogueCategory || "").trim(),
    color: String(item.color || "").trim(),
    size: String(item.size || "").trim(),
    finish: String(item.finish || "").trim(),
    sku: String(item.sku || "").trim(),
    imageUrl: String(item.imageUrl || "").trim(),
    unitPrice,
    linePrice: Number((unitPrice * quantity).toFixed(2)),
    stockStatus: String(item.stockStatus || "in_stock").trim(),
  };
}

export async function POST(request) {
  try {
    await connectMongoose();

    const body = await request.json();
    const items = Array.isArray(body.items) ? body.items.map(sanitizeItem) : [];
    const validItems = items.filter((item) => item.productId && item.name);

    if (!validItems.length) {
      return NextResponse.json(
        { error: "At least one valid product is required." },
        { status: 400 },
      );
    }

    const itemCount = validItems.reduce(
      (total, item) => total + Number(item.quantity || 0),
      0,
    );
    const totalPrice = Number(
      validItems
        .reduce((total, item) => total + Number(item.linePrice || 0), 0)
        .toFixed(2),
    );

    const token = crypto.randomBytes(10).toString("hex");

    const share = await CatalogueShare.create({
      token,
      items: validItems,
      itemCount,
      totalPrice,
    });

    const origin = new URL(request.url).origin;

    return NextResponse.json({
      id: share.id,
      token,
      itemCount,
      totalPrice,
      shareUrl: `${origin}/catalogue/share/${token}`,
    });
  } catch (error) {
    console.error("Failed to create catalogue share:", error);
    return NextResponse.json(
      { error: "Failed to create share link." },
      { status: 500 },
    );
  }
}
