import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";

export async function GET(request, { params }) {
  try {
    await connectMongo();
    const { id } = params;

    // Find the quote by publicToken (for public access) or by MongoDB ID (for admin access)
    let quote;

    // First try to find by publicToken
    quote = await Quote.findOne({ publicToken: id }).lean();

    // If not found by publicToken, try by MongoDB ID (for backward compatibility)
    if (!quote) {
      try {
        quote = await Quote.findById(id).lean();
      } catch (error) {
        // Not a valid MongoDB ObjectId, continue
      }
    }

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Return the quote data
    return NextResponse.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote", details: error.message },
      { status: 500 },
    );
  }
}
