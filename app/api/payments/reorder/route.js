import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";
import { requireAuth } from "@/libs/requireAdmin";

/**
 * POST /api/payments/reorder
 * Reorder payments and update payment numbers (admin only)
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
    const { payments } = await req.json();

    if (!payments || !Array.isArray(payments)) {
      return NextResponse.json(
        { error: "payments array is required" },
        { status: 400 },
      );
    }

    // Connect to MongoDB
    await connectMongoose();

    // Group payments by user
    const paymentsByUser = {};
    for (const payment of payments) {
      const userId = payment.userId || payment.user;
      if (!paymentsByUser[userId]) {
        paymentsByUser[userId] = [];
      }
      paymentsByUser[userId].push(payment);
    }

    // Update each user's payments
    for (const [userId, userPayments] of Object.entries(paymentsByUser)) {
      const session = await Payment.startSession();
      try {
        await session.withTransaction(async () => {
          // Only update the order field - payment numbers will be calculated based on order
          for (let i = 0; i < userPayments.length; i++) {
            const payment = userPayments[i];
            await Payment.findByIdAndUpdate(
              payment.id,
              {
                order: i + 1,
              },
              { session },
            );
          }
        });
      } finally {
        await session.endSession();
      }
    }

    return NextResponse.json({
      message: "Payments reordered successfully",
      updatedCount: payments.length,
    });
  } catch (error) {
    console.error("POST /api/payments/reorder error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to reorder payments" },
      { status: 500 },
    );
  }
}
