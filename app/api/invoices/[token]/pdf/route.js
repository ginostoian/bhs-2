import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Invoice from "@/models/Invoice";
import { pdfFilename, renderInvoicePdf } from "@/libs/pdf/render";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Render the public invoice as a paginated, vector PDF
export async function GET(request, { params }) {
  try {
    await connectMongo();
    const { token } = params;

    const invoice = token
      ? await Invoice.findOne({ publicToken: token }).lean()
      : null;

    // Drafts are never public (matches /api/invoices/[token])
    if (!invoice || invoice.status === "draft") {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const isOverdue =
      invoice.status !== "paid" &&
      !!invoice.dueDate &&
      new Date() > new Date(invoice.dueDate);

    const pdf = await renderInvoicePdf({ ...invoice, isOverdue });
    const filename = pdfFilename("invoice", invoice.invoiceNumber || token);

    return new Response(Buffer.from(pdf), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
        "Cache-Control": "no-store",
      },
    });
  } catch (error) {
    console.error("Error generating invoice PDF:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
