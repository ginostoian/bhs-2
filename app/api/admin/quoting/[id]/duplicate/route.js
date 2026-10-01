import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";
import {
  EDITABLE_QUOTE_FIELDS,
  generateQuoteNumber,
  normalizeServices,
} from "@/libs/quoteService";

// POST - Copy a quote into a new draft (new number, no link, no tracking)
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user?.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    await connectMongo();
    const source = await Quote.findById(params.id).lean();
    if (!source) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const copy = {};
    for (const key of EDITABLE_QUOTE_FIELDS) {
      if (source[key] !== undefined) copy[key] = source[key];
    }
    // Fresh subdocument ids for the copy
    const { services, total } = normalizeServices(
      JSON.parse(
        JSON.stringify(source.services || [], (k, v) =>
          k === "_id" ? undefined : v,
        ),
      ),
    );

    const quote = await Quote.create({
      ...copy,
      services,
      total,
      title: `${source.title} (copy)`,
      status: "draft",
      clientResponse: "pending",
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      quoteNumber: await generateQuoteNumber(Quote),
      createdBy: session.user.id,
      lastModifiedBy: session.user.id,
    });

    return NextResponse.json({ success: true, quote: quote.toJSON() });
  } catch (error) {
    console.error("Error duplicating quote:", error);
    return NextResponse.json(
      { error: "Failed to duplicate quote", details: error.message },
      { status: 500 },
    );
  }
}
