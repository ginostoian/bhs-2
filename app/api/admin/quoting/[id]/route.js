import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";
import {
  QUOTE_STATUSES,
  applyDefaultTerms,
  normalizeServices,
  pickEditableFields,
  validateForSending,
} from "@/libs/quoteService";

const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin" ? session : null;
};

const invalidId = (id) => !mongoose.Types.ObjectId.isValid(id);

// Statuses that mean the client has (or had) the quote in hand
const CLIENT_FACING = new Set(["sent", "pending", "won", "lost", "expired"]);

export async function GET(request, { params }) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (invalidId(params.id)) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    await connectMongo();
    const quote = await Quote.findById(params.id)
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .lean();

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Ensure pricing object exists for older quotes
    quote.pricing = {
      depositRequired: false,
      depositAmount: 0,
      depositPercentage: 0,
      vatRate: 20,
      ...quote.pricing,
    };

    return NextResponse.json({ success: true, quote });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote", details: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (invalidId(params.id)) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    await connectMongo();
    const quote = await Quote.findById(params.id);
    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const body = pickEditableFields(await request.json());

    if (body.status && !QUOTE_STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    if (body.services) {
      const { services, total } = normalizeServices(body.services);
      body.services = services;
      body.total = total;
    }
    if (body.client) {
      // Drafts autosave before the client is known; keep the schema happy
      body.client = {
        ...body.client,
        name: body.client.name?.trim() || "New client",
      };
    }
    if (body.title !== undefined && !String(body.title).trim()) {
      body.title = "Untitled quote";
    }

    const wasClientFacing = CLIENT_FACING.has(quote.status);
    Object.assign(quote, body);

    // Moving a quote in front of the client: validate and stamp it
    if (CLIENT_FACING.has(quote.status) && !wasClientFacing) {
      const errors = validateForSending(quote);
      if (errors.length > 0) {
        return NextResponse.json(
          { error: "Quote isn't ready to send", errors },
          { status: 422 },
        );
      }
      applyDefaultTerms(quote);
      if (!quote.sentAt) quote.sentAt = new Date();
      quote.revisionHistory.push({
        version: quote.version,
        changes: `Marked as ${quote.status}`,
        modifiedBy: session.user.id,
      });
    }

    quote.lastModifiedBy = session.user.id;
    await quote.save();
    await quote.populate([
      { path: "createdBy", select: "name email" },
      { path: "lastModifiedBy", select: "name email" },
    ]);

    return NextResponse.json({
      success: true,
      message: "Quote updated successfully",
      quote,
    });
  } catch (error) {
    console.error("Error updating quote:", error);
    const status = error.name === "ValidationError" ? 400 : 500;
    return NextResponse.json(
      { error: "Failed to update quote", details: error.message },
      { status },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (invalidId(params.id)) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    await connectMongo();
    const deletedQuote = await Quote.findByIdAndDelete(params.id);

    if (!deletedQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json(
      { error: "Failed to delete quote", details: error.message },
      { status: 500 },
    );
  }
}
