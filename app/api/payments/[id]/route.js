import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";
import { requireAuth } from "@/libs/requireAdmin";

/**
 * GET /api/payments/[id]
 * Get a specific payment
 */
export async function GET(req, { params }) {
  try {
    // Verify authentication
    const session = await requireAuth(req);

    // Connect to MongoDB
    await connectMongoose();

    // Fetch payment
    const payment = await Payment.findById(params.id)
      .populate("user", "name email")
      .lean();

    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Check if user owns this payment or is admin
    if (
      payment.user._id.toString() !== session.user.id &&
      session.user.role !== "admin"
    ) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Convert to plain object
    const paymentData = {
      ...payment,
      id: payment._id.toString(),
      _id: undefined,
      user: {
        ...payment.user,
        id: payment.user._id.toString(),
        _id: undefined,
      },
    };

    return NextResponse.json({ payment: paymentData });
  } catch (error) {
    console.error("GET /api/payments/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payment" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/payments/[id]
 * Update a payment (admin only)
 */
export async function PUT(req, { params }) {
  try {
    // Verify admin access
    const session = await requireAuth(req);

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Parse request body
    const { name, project, dueDate, amount, status } = await req.json();

    // Connect to MongoDB
    await connectMongoose();

    // Find and update payment
    const payment = await Payment.findById(params.id);
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    // Update fields if provided
    if (name !== undefined) payment.name = name;
    if (project !== undefined) payment.project = project || null;
    if (dueDate !== undefined) payment.dueDate = new Date(dueDate);
    if (amount !== undefined) payment.amount = parseFloat(amount);
    if (status !== undefined) payment.status = status;

    // Update status based on due date if not manually set to Paid
    if (status !== "Paid") {
      payment.updateStatus();
    }

    await payment.save();

    // Populate user and project info for response
    await payment.populate([
      { path: "user", select: "name email" },
      { path: "project", select: "name status", strictPopulate: false },
    ]);

    return NextResponse.json({
      payment: {
        id: payment.id,
        paymentNumber: payment.order,
        name: payment.name,
        dueDate: payment.dueDate,
        status: payment.status,
        order: payment.order,
        user: payment.user,
        project: payment.project,
        createdAt: payment.createdAt,
      },
    });
  } catch (error) {
    console.error("PUT /api/payments/[id] error:", error);

    // Provide more specific error messages
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Duplicate payment number detected. Please try again." },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { error: error.message || "Failed to update payment" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/payments/[id]
 * Delete a payment (admin only)
 */
export async function DELETE(req, { params }) {
  try {
    // Verify admin access
    const session = await requireAuth(req);

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Connect to MongoDB
    await connectMongoose();

    // Find and delete payment
    const payment = await Payment.findById(params.id);
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    await Payment.findByIdAndDelete(params.id);

    return NextResponse.json({ message: "Payment deleted successfully" });
  } catch (error) {
    console.error("DELETE /api/payments/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete payment" },
      { status: 500 },
    );
  }
}

/**
 * PATCH /api/payments/[id]
 * Reorder payments (admin only)
 */
export async function PATCH(req, { params }) {
  try {
    // Verify admin access
    const session = await requireAuth(req);

    if (session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Admin access required" },
        { status: 403 },
      );
    }

    // Parse request body
    const { newOrder } = await req.json();

    if (newOrder === undefined) {
      return NextResponse.json(
        { error: "newOrder is required" },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectMongoose();

    // Find payment
    const payment = await Payment.findById(params.id);
    if (!payment) {
      return NextResponse.json({ error: "Payment not found" }, { status: 404 });
    }

    const oldOrder = payment.order;
    payment.order = newOrder;
    await payment.save();

    // Reorder other payments if necessary
    if (oldOrder !== newOrder) {
      if (oldOrder < newOrder) {
        // Moving down - decrease order of payments between old and new
        await Payment.updateMany(
          {
            user: payment.user,
            order: { $gt: oldOrder, $lte: newOrder },
            _id: { $ne: payment._id },
          },
          { $inc: { order: -1 } },
        );
      } else {
        // Moving up - increase order of payments between new and old
        await Payment.updateMany(
          {
            user: payment.user,
            order: { $gte: newOrder, $lt: oldOrder },
            _id: { $ne: payment._id },
          },
          { $inc: { order: 1 } },
        );
      }
    }

    return NextResponse.json({ message: "Payment reordered successfully" });
  } catch (error) {
    console.error("PATCH /api/payments/[id] error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reorder payment" },
      { status: 500 },
    );
  }
}
