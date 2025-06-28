import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

// LEAD SCHEMA is used to store the leads that are generated from the landing page.
// You would use this if your product isn't ready yet and you want to collect emails
// The <ButtonLead /> component & the /api/lead route are used to collect the emails
const leadSchema = mongoose.Schema(
  {
    email: {
      type: String,
      trim: true,
      lowercase: true,
      private: true,
      required: true,
    },
    source: {
      type: String,
      trim: true,
      default: "landing-page",
    },
    projectType: {
      type: String,
      trim: true,
    },
    projectDetails: {
      propertyType: String,
      location: String,
      extensionType: String,
      size: Number,
      complexity: String,
      additionalFeatures: [String],
      planningServices: [String],
    },
    costEstimate: {
      total: Number,
      costPerSqm: Number,
      breakdown: {
        baseCost: Number,
        sizeMultiplier: Number,
        locationMultiplier: Number,
        propertyMultiplier: Number,
        complexityMultiplier: Number,
        adjustedCost: Number,
        featuresCost: Number,
        planningCost: Number,
        contingency: Number,
        vat: Number,
      },
    },
    status: {
      type: String,
      enum: ["new", "contacted", "qualified", "converted", "lost"],
      default: "new",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// add plugin that converts mongoose to json
leadSchema.plugin(toJSON);

export default mongoose.models.Lead || mongoose.model("Lead", leadSchema);
