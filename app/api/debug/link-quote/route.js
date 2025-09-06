import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { quoteId, userId } = await request.json();

    if (!quoteId || !userId) {
      return NextResponse.json(
        { error: "Missing quoteId or userId" },
        { status: 400 },
      );
    }

    // Find and update the quote to link it to the user
    const quote = await Quote.findById(quoteId);

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Update the linkedUser field
    quote.linkedUser = userId;

    // Save the quote - this will trigger the pre-save middleware to generate publicToken if needed
    const updatedQuote = await quote.save();

    return NextResponse.json({
      success: true,
      message: "Quote linked successfully",
      quote: {
        id: updatedQuote._id.toString(),
        title: updatedQuote.title,
        status: updatedQuote.status,
        linkedUser: updatedQuote.linkedUser?.toString(),
        publicToken: updatedQuote.publicToken,
        clientName: updatedQuote.client?.name,
        clientEmail: updatedQuote.client?.email,
      },
    });
  } catch (error) {
    console.error("Link quote error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
