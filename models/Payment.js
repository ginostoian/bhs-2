import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";
import EmailPreference from "./EmailPreference";
import { sendPaymentDueEmail } from "@/libs/emailService";

/**
 * Payment Schema
 * Handles payment tracking for users with automatic status updates
 */
const paymentSchema = mongoose.Schema(
  {
    // Reference to the user who owns this payment
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true, // Index for faster queries when fetching user's payments
    },
    // Payment number (auto-incremented per user)
    paymentNumber: {
      type: Number,
      required: false, // Will be auto-assigned in pre-save middleware
      sparse: true, // Allow multiple documents without this field
    },
    // Name of the payment (e.g., "1st Instalment", "Deposit")
    name: {
      type: String,
      required: true,
    },
    // Date when payment is due
    dueDate: {
      type: Date,
      required: true,
    },
    // Payment amount
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Payment status (Scheduled, Due, Paid)
    status: {
      type: String,
      enum: ["Scheduled", "Due", "Paid"],
      default: "Scheduled",
    },
    // Order for drag-and-drop functionality
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // Track if status change email has been sent
    statusChangeEmailSent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
paymentSchema.plugin(toJSON);

// Compound index for user and order to ensure proper ordering
paymentSchema.index({ user: 1, order: 1 });

// Index for user and paymentNumber (no uniqueness constraint)
paymentSchema.index({ user: 1, paymentNumber: 1 }, { unique: false });

// Pre-validate middleware to auto-assign payment number if not provided
paymentSchema.pre("validate", async function (next) {
  try {
    if (!this.paymentNumber) {
      // Get the highest payment number for this user
      const lastPayment = await this.constructor
        .findOne({ user: this.user })
        .sort({ order: -1 });

      this.paymentNumber = lastPayment ? lastPayment.order + 1 : 1;
    }

    // Auto-assign order if not provided
    if (this.order === 0) {
      const lastPayment = await this.constructor
        .findOne({ user: this.user })
        .sort({ order: -1 });

      this.order = lastPayment ? lastPayment.order + 1 : 1;
    }

    // Ensure payment number matches order
    if (this.paymentNumber !== this.order) {
      this.paymentNumber = this.order;
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Pre-save middleware to handle status change notifications
paymentSchema.pre("save", async function (next) {
  try {
    // Check if status is changing from Scheduled to Due
    if (this.isModified("status") && this.status === "Due") {
      const previousStatus = this._original?.status || "Scheduled";

      if (previousStatus === "Scheduled" && !this.statusChangeEmailSent) {
        // Send email notification for status change
        try {
          const emailEnabled = await EmailPreference.isEmailEnabled(
            this.user,
            "payments",
          );

          if (emailEnabled) {
            // Populate user info if not already populated
            if (!this.populated("user")) {
              await this.populate("user", "name email");
            }

            await sendPaymentDueEmail(
              this.user.email,
              this.user.name,
              this.name,
              this.amount,
              this.dueDate,
              false, // not overdue
            );

            console.log(
              `✅ Payment status change email sent to ${this.user.email} for payment: ${this.name}`,
            );

            // Mark that status change email has been sent
            this.statusChangeEmailSent = true;
          }
        } catch (emailError) {
          console.error(
            `Failed to send payment status change email to user ${this.user}:`,
            emailError,
          );
          // Don't fail the save operation if email fails
        }
      }
    }

    next();
  } catch (error) {
    next(error);
  }
});

// Method to update status based on due date
paymentSchema.methods.updateStatus = function () {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dueDate = new Date(this.dueDate);
  dueDate.setHours(0, 0, 0, 0);

  if (this.status !== "Paid") {
    if (dueDate <= today) {
      this.status = "Due";
    } else {
      this.status = "Scheduled";
    }
  }

  return this.status;
};

// Static method to update all payment statuses
paymentSchema.statics.updateAllStatuses = async function () {
  const payments = await this.find({ status: { $ne: "Paid" } });

  for (const payment of payments) {
    const oldStatus = payment.status;
    payment.updateStatus();

    // Only save if status actually changed
    if (oldStatus !== payment.status) {
      await payment.save();
    }
  }
};

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
