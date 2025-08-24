import mongoose from "mongoose";

const QuoteSchema = new mongoose.Schema(
  {
    quoteNumber: {
      type: String,
      required: true,
      unique: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    projectType: {
      type: String,
      required: true,
      enum: [
        "bathroom-renovation",
        "kitchen-renovation",
        "electrical-rewiring",
        "boiler-installation",
        "full-home-renovation",
        "home-extension",
        "loft-conversion",
        "garden-work",
        "custom",
      ],
    },
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
      postcode: {
        type: String,
        required: true,
      },
    },
    projectAddress: {
      type: String,
      required: true,
    },
    projectDescription: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
    },
    estimatedDuration: {
      type: String,
      required: true,
    },
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "QuoteTemplate",
    },
    services: [
      {
        categoryName: {
          type: String,
          required: true,
        },
        categoryTotal: {
          type: Number,
          required: true,
        },
        items: [
          {
            name: {
              type: String,
              required: true,
            },
            description: {
              type: String,
              required: true,
            },
            quantity: {
              type: Number,
              required: true,
            },
            unit: {
              type: String,
              required: true,
            },
            unitPrice: {
              type: Number,
              required: true,
            },
            total: {
              type: Number,
              required: true,
            },
            notes: {
              type: String,
            },
          },
        ],
      },
    ],
    costBreakdown: {
      subtotal: {
        type: Number,
        required: true,
      },
      labourCost: {
        type: Number,
        required: true,
      },
      materialsCost: {
        type: Number,
        required: true,
      },
      overheads: {
        type: Number,
        required: true,
      },
      profit: {
        type: Number,
        required: true,
      },
      contingency: {
        type: Number,
        required: true,
      },
      vat: {
        type: Number,
        required: true,
      },
      total: {
        type: Number,
        required: true,
      },
    },
    calculationSettings: {
      labourMultiplier: {
        type: Number,
        default: 1.0,
      },
      materialsMultiplier: {
        type: Number,
        default: 1.0,
      },
      overheadPercentage: {
        type: Number,
        default: 15,
      },
      profitPercentage: {
        type: Number,
        default: 20,
      },
      contingencyPercentage: {
        type: Number,
        default: 10,
      },
      vatRate: {
        type: Number,
        default: 20,
      },
      depositRequired: {
        type: Boolean,
        default: true,
      },
      depositAmount: {
        type: Number,
        default: 0,
      },
      depositPercentage: {
        type: Number,
        default: 0,
      },
    },
    paymentTerms: {
      deposit: {
        type: Number,
        required: true,
      },
      milestones: [
        {
          description: String,
          percentage: Number,
          trigger: String,
        },
      ],
    },
    termsAndConditions: {
      type: String,
      required: true,
    },
    warrantyInformation: {
      type: String,
      required: true,
    },
    leadTime: {
      type: String,
      required: true,
      default: "2 weeks notice required",
    },
    status: {
      type: String,
      required: true,
      enum: ["draft", "pending", "sent", "won", "lost", "expired"],
      default: "draft",
    },
    validUntil: {
      type: Date,
      required: true,
    },
    sentAt: {
      type: Date,
    },
    clientResponse: {
      type: String,
      enum: ["pending", "accepted", "rejected", "negotiating"],
      default: "pending",
    },
    version: {
      type: String,
      default: "1.0.0",
    },
    revisionHistory: [
      {
        version: String,
        changes: String,
        modifiedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        modifiedAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],
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
    shareableLink: {
      type: String,
    },
    internalNotes: {
      type: String,
    },
    specialInstructions: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

// Virtual for formatted quote number
QuoteSchema.virtual("formattedQuoteNumber").get(function () {
  return `#${this.quoteNumber}`;
});

// Virtual for total excluding VAT
QuoteSchema.virtual("totalExcludingVat").get(function () {
  return this.costBreakdown.total - this.costBreakdown.vat;
});

// Virtual for deposit amount
QuoteSchema.virtual("depositAmount").get(function () {
  if (this.calculationSettings.depositAmount > 0) {
    return this.calculationSettings.depositAmount;
  }
  if (this.calculationSettings.depositPercentage > 0) {
    return (
      (this.costBreakdown.total * this.calculationSettings.depositPercentage) /
      100
    );
  }
  return 0;
});

// Ensure virtuals are serialized
QuoteSchema.set("toJSON", { virtuals: true });
QuoteSchema.set("toObject", { virtuals: true });

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
