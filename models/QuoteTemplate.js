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
    baseStructure: [
      {
        categoryName: {
          type: String,
          required: true,
        },
        categoryTotal: {
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
            notes: {
              type: String,
            },
          },
        ],
      },
    ],
    defaultSettings: {
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
      depositRange: {
        min: {
          type: Number,
          default: 300,
        },
        max: {
          type: Number,
          default: 1000,
        },
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

export default mongoose.models.QuoteTemplate ||
  mongoose.model("QuoteTemplate", QuoteTemplateSchema);
