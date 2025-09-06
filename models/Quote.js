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
        // Support for both categories and headings
        type: {
          type: String,
          enum: ["category", "heading"],
          default: "category",
        },
        categoryName: {
          type: String,
          required: function () {
            return this.type === "category";
          },
        },
        categoryTotal: {
          type: Number,
          required: function () {
            return this.type === "category";
          },
          default: 0,
        },
        // For headings
        headingText: {
          type: String,
          required: function () {
            return this.type === "heading";
          },
        },
        headingDescription: {
          type: String,
        },
        // Order for drag and drop
        order: {
          type: Number,
          default: 0,
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
            // Legacy fields - temporarily optional for migration
            customerUnitPrice: {
              type: Number,
              required: false,
            },
            customerTotal: {
              type: Number,
              required: false,
            },
            notes: {
              type: String,
            },
          },
        ],
      },
    ],
    total: {
      type: Number,
      required: true,
    },
    pricing: {
      depositRequired: {
        type: Boolean,
        default: false,
      },
      depositAmount: {
        type: Number,
        default: 0,
      },
      depositPercentage: {
        type: Number,
        default: 0,
      },
      vatRate: {
        type: Number,
        default: 20,
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

    // User linking for dashboard integration (optional)
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

    // Public viewing token for shareable links
    publicToken: {
      type: String,
      unique: true,
      sparse: true, // Allow null values but ensure uniqueness when present
    },

    // Tracking fields
    viewCount: {
      type: Number,
      default: 0,
    },
    lastViewed: {
      type: Date,
    },
    firstViewed: {
      type: Date,
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

// Pre-save middleware to generate public token
QuoteSchema.pre("save", function (next) {
  // Generate public token if not exists and status is not draft
  if (!this.publicToken && this.status !== "draft") {
    this.publicToken = `quote_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Virtual for deposit amount
QuoteSchema.virtual("depositAmount").get(function () {
  // Use new simplified pricing structure
  if (this.pricing && this.pricing.depositAmount > 0) {
    return this.pricing.depositAmount;
  }
  if (this.pricing && this.pricing.depositPercentage > 0) {
    return (this.total * this.pricing.depositPercentage) / 100;
  }

  return 0;
});

// Ensure virtuals are serialized
QuoteSchema.set("toJSON", { virtuals: true });
QuoteSchema.set("toObject", { virtuals: true });

export default mongoose.models.Quote || mongoose.model("Quote", QuoteSchema);
