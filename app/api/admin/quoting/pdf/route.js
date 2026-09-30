import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { pdfFilename, renderQuotePdf } from "@/libs/pdf/render";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// POST - Render an unsaved quote (quote builder preview) as a PDF for admins
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { quote } = await request.json();
    if (!quote || typeof quote !== "object") {
      return NextResponse.json({ error: "Invalid quote" }, { status: 400 });
    }

    const pdf = await renderQuotePdf(quote);
    const filename = pdfFilename("quote", quote.quoteNumber || "draft");

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
