import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

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

// Simple index for user and paymentNumber (no uniqueness constraint for now)
paymentSchema.index({ user: 1, paymentNumber: 1 });

// Pre-validate middleware to auto-assign payment number if not provided
paymentSchema.pre("validate", async function (next) {
  try {
    if (!this.paymentNumber) {
      // Get the highest payment number for this user
      const lastPayment = await this.constructor
        .findOne({ user: this.user })
        .sort({ paymentNumber: -1 });

      this.paymentNumber = lastPayment ? lastPayment.paymentNumber + 1 : 1;
    }

    // Auto-assign order if not provided
    if (this.order === 0) {
      const lastPayment = await this.constructor
        .findOne({ user: this.user })
        .sort({ order: -1 });

      this.order = lastPayment ? lastPayment.order + 1 : 1;
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
    payment.updateStatus();
    await payment.save();
  }
};

const Payment =
  mongoose.models.Payment || mongoose.model("Payment", paymentSchema);

export default Payment;
