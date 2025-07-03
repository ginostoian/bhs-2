import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";

/**
 * POST /api/payments/update-statuses
 * Updates all payment statuses based on due dates
 * This endpoint can be called by a cron job
 */
export async function POST(req) {
  try {
    // Connect to MongoDB
    await connectMongoose();

    // Update all payment statuses
    await Payment.updateAllStatuses();

    return NextResponse.json({
      message: "Payment statuses updated successfully",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("POST /api/payments/update-statuses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update payment statuses" },
      { status: 500 },
    );
  }
}

/**
 * GET /api/payments/update-statuses
 * Updates all payment statuses and returns summary
 */
export async function GET(req) {
  try {
    // Connect to MongoDB
    await connectMongoose();

    // Get current payment counts
    const beforeCounts = {
      scheduled: await Payment.countDocuments({ status: "Scheduled" }),
      due: await Payment.countDocuments({ status: "Due" }),
      paid: await Payment.countDocuments({ status: "Paid" }),
    };

    // Update all payment statuses
    await Payment.updateAllStatuses();

    // Get updated payment counts
    const afterCounts = {
      scheduled: await Payment.countDocuments({ status: "Scheduled" }),
      due: await Payment.countDocuments({ status: "Due" }),
      paid: await Payment.countDocuments({ status: "Paid" }),
    };

    return NextResponse.json({
      message: "Payment statuses updated successfully",
      before: beforeCounts,
      after: afterCounts,
      changes: {
        scheduled: afterCounts.scheduled - beforeCounts.scheduled,
        due: afterCounts.due - beforeCounts.due,
        paid: afterCounts.paid - beforeCounts.paid,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("GET /api/payments/update-statuses error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update payment statuses" },
      { status: 500 },
    );
  }
}
