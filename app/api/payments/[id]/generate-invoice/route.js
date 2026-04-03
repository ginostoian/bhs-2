import { NextResponse } from "next/server";
import mongoose from "mongoose";
import connectMongoose from "@/libs/mongoose";
import { requireAuth } from "@/libs/requireAdmin";
import Payment from "@/models/Payment";
import Invoice from "@/models/Invoice";

export async function POST(req, { params }) {
  try {
    const session = await requireAuth(req);

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    if (!mongoose.Types.ObjectId.isValid(params.id)) {
      return NextResponse.json(
        { error: "Invalid payment ID" },
        { status: 400 },
      );
    }

    await connectMongoose();

    const payment = await Payment.findById(params.id)
      .populate("user", "name email phone address")
      .populate({ path: "project", select: "name status", strictPopulate: false });

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const existingInvoice = await Invoice.findOne({ sourcePayment: payment._id });
    if (existingInvoice) {
      return NextResponse.json({
        success: true,
        existing: true,
        invoice: existingInvoice.toJSON(),
        message: "Invoice already exists for this payment",
      });
    }

    const missingFields = ["name", "email", "phone", "address"].filter(
      (field) => !payment.user?.[field],
    );

    if (missingFields.length > 0) {
      return NextResponse.json(
        {
          error:
            "Cannot generate invoice because the linked user is missing required client details",
          missingFields,
        },
        { status: 400 },
      );
    }

    const title = payment.project?.name
      ? `${payment.project.name} - ${payment.name}`
      : payment.name;

    const invoice = await Invoice.create({
      title,
      client: {
        name: payment.user.name,
        email: payment.user.email,
        phone: payment.user.phone,
        address: payment.user.address,
      },
      lineItems: [
        {
          serviceName: payment.name,
          priceExclVat: payment.amount,
          vatRate: 0,
          type: "Labour",
          quantity: 1,
          totalVatIncluded: payment.amount,
        },
      ],
      dueDate: payment.dueDate,
      linkedUser: payment.user._id,
      project: payment.project?._id || null,
      sourcePayment: payment._id,
      notes: `Automatically generated from payment row #${payment.order}.`,
      status: "draft",
      createdBy: session.user.id,
      lastModifiedBy: session.user.id,
    });

    return NextResponse.json(
      {
        success: true,
        existing: false,
        invoice: invoice.toJSON(),
        message: "Invoice generated successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    if (error.code === 11000) {
      const existingInvoice = await Invoice.findOne({ sourcePayment: params.id });
      if (existingInvoice) {
        return NextResponse.json({
          success: true,
          existing: true,
          invoice: existingInvoice.toJSON(),
          message: "Invoice already exists for this payment",
        });
      }
    }

    console.error("POST /api/payments/[id]/generate-invoice error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to generate invoice" },
      { status: 500 },
    );
  }
}
