import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Payment from "@/models/Payment";
import EmailPreference from "@/models/EmailPreference";
import Notification from "@/models/Notification";
import { sendPaymentDueEmail } from "@/libs/emailService";

/**
 * POST /api/cron/check-overdue-payments
 * Cron job endpoint to check for overdue payments and create notifications
 * This should be called by a cron service (e.g., Vercel Cron, GitHub Actions, etc.)
 */
export async function POST(req) {
  try {
    // Optional: Add authentication for cron jobs
    // const authHeader = req.headers.get("authorization");
    // if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    // Connect to MongoDB
    await connectMongoose();

    const now = new Date();
    const notificationsCreated = [];

    // Find all payments that are overdue (due date < now and status not paid/cancelled)
    const overduePayments = await Payment.find({
      dueDate: { $lt: now },
      status: { $nin: ["Paid", "Cancelled"] },
    }).populate("user", "name email");

    console.log(`Found ${overduePayments.length} overdue payments`);

    // Create notifications for overdue payments
    for (const payment of overduePayments) {
      try {
        await Notification.createNotificationForRecipient({
          recipient: payment.user._id,
          recipientType: "user",
          type: "payment_overdue",
          title: "Payment Overdue",
          message: `Payment "${payment.name}" is overdue. Please contact us to arrange payment.`,
          relatedId: payment._id,
          relatedModel: "Payment",
          priority: "urgent",
          metadata: {
            paymentName: payment.name,
            dueDate: payment.dueDate.toISOString(),
            isOverdue: true,
          },
        });

        // Send overdue payment email notification
        try {
          const emailEnabled = await EmailPreference.isEmailEnabled(
            payment.user._id,
            "payments",
          );

          if (emailEnabled) {
            await sendPaymentDueEmail(
              payment.user.email,
              payment.user.name,
              payment.name,
              payment.amount,
              payment.dueDate,
              true, // overdue
            );
            console.log(
              `✅ Overdue payment email sent to ${payment.user.email}`,
            );
          }
        } catch (emailError) {
          console.error(
            `Failed to send overdue payment email to ${payment.user.email}:`,
            emailError,
          );
        }

        notificationsCreated.push({
          paymentId: payment._id.toString(),
          userId: payment.user._id.toString(),
          userName: payment.user.name || payment.user.email,
          paymentName: payment.name,
          dueDate: payment.dueDate,
        });

        console.log(
          `Created overdue notification for payment: ${payment.name}`,
        );
      } catch (error) {
        console.error(
          `Failed to create notification for payment ${payment._id}:`,
          error,
        );
      }
    }

    // Also check for payments due within 3 days
    const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
    const upcomingPayments = await Payment.find({
      dueDate: { $gte: now, $lte: threeDaysFromNow },
      status: { $nin: ["Paid", "Cancelled"] },
    }).populate("user", "name email");

    console.log(`Found ${upcomingPayments.length} payments due within 3 days`);

    // Create notifications for upcoming payments
    for (const payment of upcomingPayments) {
      try {
        const daysUntilDue = Math.ceil(
          (payment.dueDate - now) / (1000 * 60 * 60 * 24),
        );

        // Only create notification if it's due within 3 days and not already overdue
        if (daysUntilDue <= 3 && daysUntilDue > 0) {
          await Notification.createNotificationForRecipient({
            recipient: payment.user._id,
            recipientType: "user",
            type: "payment_due",
            title: "Payment Due Soon",
            message: `Payment "${payment.name}" is due in ${daysUntilDue} day${daysUntilDue !== 1 ? "s" : ""}.`,
            relatedId: payment._id,
            relatedModel: "Payment",
            priority: "high",
            metadata: {
              paymentName: payment.name,
              dueDate: payment.dueDate.toISOString(),
              isOverdue: false,
              daysUntilDue,
            },
          });

          notificationsCreated.push({
            paymentId: payment._id.toString(),
            userId: payment.user._id.toString(),
            userName: payment.user.name || payment.user.email,
            paymentName: payment.name,
            dueDate: payment.dueDate,
            daysUntilDue,
          });

          console.log(
            `Created due notification for payment: ${payment.name} (due in ${daysUntilDue} days)`,
          );
        }
      } catch (error) {
        console.error(
          `Failed to create notification for payment ${payment._id}:`,
          error,
        );
      }
    }

    return NextResponse.json({
      success: true,
      message: "Payment notifications check completed",
      stats: {
        overduePayments: overduePayments.length,
        upcomingPayments: upcomingPayments.length,
        notificationsCreated: notificationsCreated.length,
      },
      notificationsCreated,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Failed to check overdue payments" },
      { status: 500 },
    );
  }
}
