import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Invoice from "@/models/Invoice";
import mongoose from "mongoose";

// GET - Fetch a specific invoice
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Validate ID parameter
    if (!params.id || params.id === "undefined") {
      return NextResponse.json(
        { error: "Invalid invoice ID" },
        { status: 400 },
      );
    }

    const invoice = await Invoice.findById(params.id)
      .populate("linkedUser", "name email phone address")
      .populate("linkedLead", "name email phone address")
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email");

    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    return NextResponse.json({ invoice });
  } catch (error) {
    console.error("Error fetching invoice:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoice" },
      { status: 500 },
    );
  }
}

// PUT - Update an invoice
export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    if (!params.id || params.id === "undefined") {
      return NextResponse.json(
        { error: "Invalid invoice ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    const invoice = await Invoice.findById(params.id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Update fields
    Object.keys(body).forEach((key) => {
      if (
        key !== "_id" &&
        key !== "invoiceNumber" &&
        key !== "createdBy" &&
        key !== "createdAt"
      ) {
        invoice[key] = body[key];
      }
    });

    // Update modification tracking
    invoice.lastModifiedBy = session.user.id;

    await invoice.save();

    // Populate before returning
    await invoice.populate([
      { path: "linkedUser", select: "name email phone address" },
      { path: "linkedLead", select: "name email phone address" },
      { path: "createdBy", select: "name email" },
      { path: "lastModifiedBy", select: "name email" },
    ]);

    return NextResponse.json({
      success: true,
      invoice,
      message: "Invoice updated successfully",
    });
  } catch (error) {
    console.error("Error updating invoice:", error);
    return NextResponse.json(
      { error: "Failed to update invoice", details: error.message },
      { status: 500 },
    );
  }
}

// DELETE - Delete an invoice
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    if (!params.id || params.id === "undefined") {
      return NextResponse.json(
        { error: "Invalid invoice ID" },
        { status: 400 },
      );
    }

    const invoice = await Invoice.findById(params.id);
    if (!invoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Only allow deletion of draft invoices
    if (invoice.status !== "draft") {
      return NextResponse.json(
        { error: "Can only delete draft invoices" },
        { status: 400 },
      );
    }

    await Invoice.findByIdAndDelete(params.id);

    return NextResponse.json({
      success: true,
      message: "Invoice deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting invoice:", error);
    return NextResponse.json(
      { error: "Failed to delete invoice" },
      { status: 500 },
    );
  }
}

// PATCH - Update specific fields like linking
export async function PATCH(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    if (!params.id || params.id === "undefined") {
      return NextResponse.json(
        { error: "Invalid invoice ID" },
        { status: 400 },
      );
    }

    const body = await request.json();

    // Handle specific patch operations
    const updateData = { lastModifiedBy: session.user.id };

    // Link to user
    if (body.linkToUser) {
      if (!mongoose.Types.ObjectId.isValid(body.linkToUser)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
      }
      updateData.linkedUser = body.linkToUser;
      updateData.linkedLead = null; // Clear lead link if linking to user
    }

    // Link to lead
    if (body.linkToLead) {
      if (!mongoose.Types.ObjectId.isValid(body.linkToLead)) {
        return NextResponse.json({ error: "Invalid lead ID" }, { status: 400 });
      }
      updateData.linkedLead = body.linkToLead;
      updateData.linkedUser = null; // Clear user link if linking to lead
    }

    // Clear all links
    if (body.clearLinks) {
      updateData.linkedUser = null;
      updateData.linkedLead = null;
    }

    const updatedInvoice = await Invoice.findByIdAndUpdate(
      params.id,
      updateData,
      { new: true, runValidators: true },
    );

    if (!updatedInvoice) {
      return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
    }

    // Populate before returning
    await updatedInvoice.populate([
      { path: "linkedUser", select: "name email phone address" },
      { path: "linkedLead", select: "name email phone address" },
      { path: "createdBy", select: "name email" },
      { path: "lastModifiedBy", select: "name email" },
    ]);

    return NextResponse.json({
      success: true,
      invoice: updatedInvoice,
      message: "Invoice linking updated successfully",
    });
  } catch (error) {
    console.error("Error updating invoice linking:", error);
    return NextResponse.json(
      { error: "Failed to update invoice linking", details: error.message },
      { status: 500 },
    );
  }
}
