import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Invoice from "@/models/Invoice";

// GET - Public invoice viewing (no authentication required)
export async function GET(request, { params }) {
  try {
    await connectMongo();

    const { token } = params;

    if (!token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    const invoice = await Invoice.findOne({ publicToken: token })
      .populate("linkedUser", "name email")
      .populate("linkedLead", "name email");

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Only return invoices that are sent or paid (not drafts)
    if (invoice.status === "draft") {
      return NextResponse.json(
        { error: "Invoice not available" },
        { status: 404 },
      );
    }

    // Calculate virtual properties manually since they don't serialize
    const isOverdue =
      invoice.status !== "paid" &&
      invoice.dueDate &&
      new Date() > new Date(invoice.dueDate);
    const daysToDue =
      invoice.dueDate && invoice.status !== "paid"
        ? Math.ceil(
            (new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24),
          )
        : null;

    // Remove sensitive information
    const publicInvoice = {
      invoiceNumber: invoice.invoiceNumber,
      title: invoice.title,
      client: invoice.client,
      lineItems: invoice.lineItems,
      subtotal: invoice.subtotal,
      totalVat: invoice.totalVat,
      total: invoice.total,
      status: invoice.status,
      dueDate: invoice.dueDate,
      issueDate: invoice.issueDate,
      terms: invoice.terms,
      notes: invoice.notes,
      isOverdue: isOverdue,
      daysToDue: daysToDue,
    };

    return NextResponse.json({ invoice: publicInvoice });
  } catch (error) {
    console.error("Error fetching public invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 },
    );
  }
}
