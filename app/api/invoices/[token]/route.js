import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Invoice from "@/models/Invoice";

// Force dynamic rendering for this route to prevent caching issues
export const dynamic = "force-dynamic";

// GET - Public invoice viewing (no authentication required)
export async function GET(request, { params }) {
  try {
    console.log("=== PUBLIC INVOICE API REQUEST ===");
    console.log("Token:", params?.token);
    console.log("Environment:", process.env.NODE_ENV);

    await connectMongo();
    console.log("MongoDB connected successfully");

    const { token } = params;

    if (!token) {
      console.log("❌ No token provided");
      return NextResponse.json({ error: "Invalid token" }, { status: 400 });
    }

    console.log("Searching for invoice with token:", token);
    const invoice = await Invoice.findOne({ publicToken: token })
      .populate("linkedUser", "name email")
      .populate("linkedLead", "name email");

    if (!invoice) {
      console.log("❌ Invoice not found for token:", token);
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    console.log("✅ Invoice found:", {
      id: invoice._id,
      invoiceNumber: invoice.invoiceNumber,
      status: invoice.status,
      hasDueDate: !!invoice.dueDate,
    });

    // Only return invoices that are sent or paid (not drafts)
    if (invoice.status === "draft") {
      console.log("❌ Invoice is draft, not available for public viewing");
      return NextResponse.json(
        { error: "Invoice not available" },
        { status: 404 },
      );
    }

    // Calculate virtual properties manually since they don't serialize
    console.log("Calculating virtual properties...");
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

    console.log("Virtual properties calculated:", { isOverdue, daysToDue });

    // Remove sensitive information
    console.log("Building public invoice object...");
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

    console.log("✅ Successfully prepared invoice response");
    return NextResponse.json({ invoice: publicInvoice });
  } catch (error) {
    console.error("=== PUBLIC INVOICE API ERROR ===");
    console.error("Error details:", {
      message: error.message,
      stack: error.stack,
      name: error.name,
      token: params?.token,
    });
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 },
    );
  }
}
