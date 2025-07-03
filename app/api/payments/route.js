import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";
import { requireAuth } from "@/libs/requireAdmin";
import Notification from "@/models/Notification";

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
    const requestBody = await req.json();
    console.log("Payment creation request body:", requestBody);

    const { userId, user, name, dueDate, amount, status } = requestBody;

    // Handle both userId and user field names
    const targetUserId = userId || user;

    // Validate required fields
    if (!targetUserId || !name || !dueDate || amount === undefined) {
      console.log("Validation failed:", {
        targetUserId,
        name,
        dueDate,
        amount,
      });
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
      user: targetUserId,
      name,
      dueDate: new Date(dueDate),
      amount: parsedAmount,
      status: status || "Scheduled",
    });

    // Populate user info for response
    await payment.populate("user", "name email");

    // Create notification for the user
    try {
      const dueDateObj = new Date(dueDate);
      const daysUntilDue = Math.ceil(
        (dueDateObj - new Date()) / (1000 * 60 * 60 * 24),
      );

      if (daysUntilDue <= 7) {
        // If payment is due within 7 days, create a due notification
        await Notification.createNotification({
          user: targetUserId,
          type: "payment_due",
          title: "Payment Due Soon",
          message: `Payment "${name}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}.`,
          relatedId: payment._id,
          relatedModel: "Payment",
          priority: "high",
          metadata: {
            paymentName: name,
            dueDate: dueDateObj.toISOString(),
            isOverdue: false,
            daysUntilDue,
          },
        });
      }

      // Also create a payment plan updated notification
      await Notification.createNotification({
        user: targetUserId,
        type: "payment_plan_updated",
        title: "Payment Plan Updated",
        message: "A new payment plan has been created for your project.",
        relatedId: payment._id,
        relatedModel: "Payment",
        priority: "medium",
        metadata: {
          planName: name,
          changeType: "created",
        },
      });
    } catch (notificationError) {
      console.error("Failed to create notification:", notificationError);
      // Don't fail the payment creation if notification fails
    }

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
