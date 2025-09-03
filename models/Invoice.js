import mongoose from "mongoose";

const InvoiceSchema = new mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      unique: true,
      // Not required since it's auto-generated in pre-save middleware
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },

    // Client Information
    client: {
      name: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },

    // Line Items with the requested structure
    lineItems: [
      {
        serviceName: {
          type: String,
          required: true,
        },
        priceExclVat: {
          type: Number,
          required: true,
          min: 0,
        },
        vatRate: {
          type: Number,
          required: true,
          default: 20, // 20% default VAT rate
        },
        type: {
          type: String,
          required: true,
          enum: ["Labour", "Material"],
        },
        quantity: {
          type: Number,
          required: true,
          min: 0,
          default: 1,
        },
        // Total VAT included - calculated field
        totalVatIncluded: {
          type: Number,
          required: true,
          min: 0,
        },
        // For template saving
        isTemplate: {
          type: Boolean,
          default: false,
        },
        templateName: {
          type: String,
          trim: true,
        },
        // Order for reordering functionality
        order: {
          type: Number,
          default: 0,
        },
      },
    ],

    // Financial totals
    subtotal: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    totalVat: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    total: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },

    // Invoice status
    status: {
      type: String,
      enum: ["draft", "sent", "paid"],
      default: "draft",
      index: true,
    },

    // Due date (optional)
    dueDate: {
      type: Date,
    },

    // Issue date
    issueDate: {
      type: Date,
      default: Date.now,
    },

    // User linking for dashboard integration
    linkedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      index: true,
    },

    // Lead linking (if created from CRM lead)
    linkedLead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      index: true,
    },

    // Admin who created/modified
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lastModifiedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Payment information
    paymentDate: {
      type: Date,
    },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "cash", "card", "cheque", "other"],
    },
    paymentReference: {
      type: String,
      trim: true,
    },

    // Notes
    notes: {
      type: String,
      trim: true,
    },

    // Public viewing token for shareable links
    publicToken: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
    },

    // Terms and conditions
    terms: {
      type: String,
      default:
        "Payment due within 30 days of invoice date. Late payment charges may apply.",
    },
  },
  {
    timestamps: true,
  },
);

// Pre-save middleware to generate invoice number and public token
InvoiceSchema.pre("save", async function (next) {
  // Generate invoice number if new
  if (this.isNew && !this.invoiceNumber) {
    const year = new Date().getFullYear();
    const existingInvoices = await this.constructor
      .find({
        invoiceNumber: { $regex: `^INV-${year}` },
      })
      .sort({ invoiceNumber: -1 })
      .limit(1);

    let invoiceNumber;
    if (existingInvoices.length > 0) {
      const lastNumber = parseInt(
        existingInvoices[0].invoiceNumber.split("-").pop(),
      );
      const nextNumber = (lastNumber + 1).toString().padStart(4, "0");
      invoiceNumber = `INV-${year}-${nextNumber}`;
    } else {
      invoiceNumber = `INV-${year}-0001`;
    }
    this.invoiceNumber = invoiceNumber;
  }

  // Generate public token if not exists
  if (!this.publicToken) {
    this.publicToken = `inv_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // Calculate totals
  this.calculateTotals();

  next();
});

// Method to calculate totals
InvoiceSchema.methods.calculateTotals = function () {
  let subtotal = 0;
  let totalVat = 0;

  this.lineItems.forEach((item) => {
    const lineSubtotal = item.priceExclVat * item.quantity;
    const lineVat = lineSubtotal * (item.vatRate / 100);
    const lineTotal = lineSubtotal + lineVat;

    // Update the item's total
    item.totalVatIncluded = parseFloat(lineTotal.toFixed(2));

    subtotal += lineSubtotal;
    totalVat += lineVat;
  });

  this.subtotal = parseFloat(subtotal.toFixed(2));
  this.totalVat = parseFloat(totalVat.toFixed(2));
  this.total = parseFloat((subtotal + totalVat).toFixed(2));
};

// Method to update status
InvoiceSchema.methods.updateStatus = function (newStatus, userId) {
  this.status = newStatus;
  this.lastModifiedBy = userId;

  if (newStatus === "paid" && !this.paymentDate) {
    this.paymentDate = new Date();
  }

  return this.save();
};

// Method to add line item
InvoiceSchema.methods.addLineItem = function (lineItem) {
  // Set order to the next available position
  const maxOrder = Math.max(
    ...this.lineItems.map((item) => item.order || 0),
    0,
  );
  lineItem.order = maxOrder + 1;

  this.lineItems.push(lineItem);
  this.calculateTotals();
  return this.save();
};

// Method to reorder line items
InvoiceSchema.methods.reorderLineItems = function (newOrder) {
  // newOrder should be an array of line item IDs in the desired order
  newOrder.forEach((itemId, index) => {
    const item = this.lineItems.id(itemId);
    if (item) {
      item.order = index;
    }
  });

  // Sort line items by order
  this.lineItems.sort((a, b) => a.order - b.order);
  return this.save();
};

// Indexes for better query performance
InvoiceSchema.index({ status: 1, createdAt: -1 });
InvoiceSchema.index({ linkedUser: 1, status: 1 });
InvoiceSchema.index({ linkedLead: 1 });
InvoiceSchema.index({ createdBy: 1, createdAt: -1 });
InvoiceSchema.index({ dueDate: 1, status: 1 });
InvoiceSchema.index({ publicToken: 1 });

// Virtual for overdue status
InvoiceSchema.virtual("isOverdue").get(function () {
  if (this.status === "paid" || !this.dueDate) return false;
  return new Date() > this.dueDate;
});

// Virtual for days until due/overdue
InvoiceSchema.virtual("daysToDue").get(function () {
  if (!this.dueDate || this.status === "paid") return null;
  const today = new Date();
  const diffTime = this.dueDate - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Static method to find invoices by status
InvoiceSchema.statics.findByStatus = function (status) {
  return this.find({ status })
    .populate("linkedUser", "name email")
    .populate("linkedLead", "name email")
    .populate("createdBy", "name email")
    .sort({ createdAt: -1 });
};

// Static method to find overdue invoices
InvoiceSchema.statics.findOverdue = function () {
  return this.find({
    status: { $in: ["sent"] },
    dueDate: { $lt: new Date() },
  })
    .populate("linkedUser", "name email")
    .populate("linkedLead", "name email")
    .sort({ dueDate: 1 });
};

export default mongoose.models.Invoice ||
  mongoose.model("Invoice", InvoiceSchema);
