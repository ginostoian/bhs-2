import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import mongoose from "mongoose";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Invoice from "@/models/Invoice";
import { pdfFilename, renderInvoicePdf } from "@/libs/pdf/render";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// GET - Render any invoice (including drafts) as a PDF for admins
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid invoice ID" },
        { status: 400 },
      );
    }

    await connectMongo();
    const invoice = await Invoice.findById(params.id).lean();

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    const isOverdue =
      invoice.status !== "paid" &&
      !!invoice.dueDate &&
      new Date() > new Date(invoice.dueDate);

    const pdf = await renderInvoicePdf({ ...invoice, isOverdue });
    const filename = pdfFilename("invoice", invoice.invoiceNumber || params.id);

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
