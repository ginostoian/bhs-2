import mongoose from "mongoose";

const QuoteTemplateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
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
    version: {
      type: String,
      required: true,
      default: "1.0.0",
    },
    baseServices: [
      {
        category: {
          type: String,
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
            unit: {
              type: String,
              required: true,
            },
            basePrice: {
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
    defaultPricing: {
      vatRate: {
        type: Number,
        default: 20,
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
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
    previousVersions: [
      {
        version: String,
        data: mongoose.Schema.Types.Mixed,
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
  },
  {
    timestamps: true,
  },
);

// Clear any existing model and create a fresh one
if (mongoose.models.QuoteTemplate) {
  delete mongoose.models.QuoteTemplate;
}

export default mongoose.model("QuoteTemplate", QuoteTemplateSchema);
