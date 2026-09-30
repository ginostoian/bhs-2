import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";
import { pdfFilename, renderQuotePdf } from "@/libs/pdf/render";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Render the quote as a paginated, vector PDF
export async function GET(request, { params }) {
  try {
    await connectMongo();
    const { id } = params;

    // Same lookup as the public quote API: publicToken first, then MongoDB ID
    let quote = await Quote.findOne({ publicToken: id }).lean();
    if (!quote) {
      try {
        quote = await Quote.findById(id).lean();
      } catch (error) {
        // Not a valid MongoDB ObjectId
      }
    }

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    const pdf = await renderQuotePdf(quote);
    const filename = pdfFilename("quote", quote.quoteNumber || id);

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generating quote PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
