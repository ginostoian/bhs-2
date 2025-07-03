import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";
import { requireAuth } from "@/libs/requireAdmin";

/**
 * GET /api/payments
 * Get payments for the authenticated user
 */
export async function GET(req) {
  try {
    // Verify authentication
    const session = await requireAuth(req);

    // Connect to MongoDB
    await connectMongoose();

    // Get query parameters for filtering
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");

    // Build query filter
    const filter = { user: session.user.id };
    if (status) filter.status = status;

    // Fetch user's payments and convert to plain objects
    const payments = await Payment.find(filter)
      .sort({ order: 1, paymentNumber: 1 })
      .populate("user", "name email")
      .lean()
      .then((docs) =>
        docs.map((doc) => ({
          ...doc,
          id: doc._id.toString(),
          _id: undefined,
          user: doc.user
            ? {
                ...doc.user,
                id: doc.user._id.toString(),
                _id: undefined,
              }
            : doc.user,
        })),
      );

    // Update statuses based on due dates
    for (const payment of payments) {
      const paymentDoc = await Payment.findById(payment.id);
      if (paymentDoc) {
        paymentDoc.updateStatus();
        if (paymentDoc.isModified()) {
          await paymentDoc.save();
          payment.status = paymentDoc.status;
        }
      }
    }

    return NextResponse.json({ payments });
  } catch (error) {
    console.error("GET /api/payments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch payments" },
      { status: 401 },
    );
  }
}

/**
 * POST /api/payments
 * Create a new payment (admin only)
 */
export async function POST(req) {
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
    const { userId, name, dueDate, amount, status } = await req.json();

    // Validate required fields
    if (!userId || !name || !dueDate || amount === undefined) {
      return NextResponse.json(
        { error: "userId, name, dueDate, and amount are required" },
        { status: 400 },
      );
    }

    // Validate amount
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount < 0) {
      return NextResponse.json(
        { error: "Amount must be a valid positive number" },
        { status: 400 },
      );
    }

    // Validate status
    const validStatuses = ["Scheduled", "Due", "Paid"];
    if (status && !validStatuses.includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Connect to MongoDB
    await connectMongoose();

    // Create payment
    const payment = await Payment.create({
      user: userId,
      name,
      dueDate: new Date(dueDate),
      amount: parsedAmount,
      status: status || "Scheduled",
    });

    // Populate user info for response
    await payment.populate("user", "name email");

    return NextResponse.json(
      {
        payment: {
          id: payment.id,
          paymentNumber: payment.paymentNumber,
          name: payment.name,
          dueDate: payment.dueDate,
          status: payment.status,
          order: payment.order,
          user: payment.user,
          createdAt: payment.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("POST /api/payments error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create payment" },
      { status: 500 },
    );
  }
}
