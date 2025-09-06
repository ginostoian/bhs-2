import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";

export async function GET(request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const quoteId = searchParams.get("id") || "68bc567ff5d0308066473869";

    // Find the specific quote
    const quote = await Quote.findById(quoteId).lean();

    if (!quote) {
      return NextResponse.json({
        found: false,
        quoteId,
        message: "Quote not found",
      });
    }

    return NextResponse.json({
      found: true,
      quoteId,
      quote: {
        id: quote._id.toString(),
        title: quote.title,
        status: quote.status,
        linkedUser: quote.linkedUser?.toString(),
        publicToken: quote.publicToken,
        clientName: quote.client?.name,
        clientEmail: quote.client?.email,
        quoteNumber: quote.quoteNumber,
        createdAt: quote.createdAt,
        updatedAt: quote.updatedAt,
      },
    });
  } catch (error) {
    console.error("Check quote error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
