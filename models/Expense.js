import mongoose from "mongoose";
import toJSON from "./plugins/toJSON";

/**
 * Expense Schema
 * Handles project expense tracking with file uploads and categorization
 */
const expenseSchema = mongoose.Schema(
  {
    // Reference to the project this expense belongs to
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Project",
      required: true,
      index: true,
    },
    // Name/description of the expense
    name: {
      type: String,
      trim: true,
      required: true,
    },
    // Amount in GBP
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    // Date when the expense was purchased
    purchaseDate: {
      type: Date,
      required: true,
    },
    // Type of expense (Expense or Charge)
    type: {
      type: String,
      enum: ["Expense", "Charge"],
      required: true,
    },
    // Category where this was purchased for
    category: {
      type: String,
      enum: ["Bathroom", "Kitchen", "Electric", "Tiling", "Custom"],
      required: true,
    },
    // Custom category name (if category is "Custom")
    customCategory: {
      type: String,
      trim: true,
    },
    // File uploads (receipts, invoices, etc.)
    files: [
      {
        fileId: String, // Store the file ID as string, not ObjectId
        fileName: String,
        fileUrl: String,
        filePath: String,
      },
    ],
    // Purchase link (auto-populated from file upload or manually entered)
    purchaseLink: {
      type: String,
      trim: true,
    },
    // Order for drag-and-drop functionality
    order: {
      type: Number,
      required: true,
      default: 0,
    },
    // Additional notes
    notes: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  },
);

// Add plugin that converts mongoose to json
expenseSchema.plugin(toJSON);

// Compound index for project and order to ensure proper ordering
expenseSchema.index({ project: 1, order: 1 });

// Index for project and purchase date for date-based queries
expenseSchema.index({ project: 1, purchaseDate: -1 });

// Index for project and category for category-based queries
expenseSchema.index({ project: 1, category: 1 });

// Virtual for total amount (useful for calculations)
expenseSchema.virtual("totalAmount").get(function () {
  return this.amount;
});

// Method to get category display name
expenseSchema.methods.getCategoryDisplayName = function () {
  if (this.category === "Custom" && this.customCategory) {
    return this.customCategory;
  }
  return this.category;
};

// Static method to get total expenses for a project
expenseSchema.statics.getProjectTotal = async function (projectId) {
  const result = await this.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  return result.length > 0 ? result[0].total : 0;
};

// Static method to get expenses by category for a project
expenseSchema.statics.getProjectByCategory = async function (projectId) {
  return await this.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: "$category",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        expenses: { $push: "$$ROOT" },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

// Static method to get expenses by type for a project
expenseSchema.statics.getProjectByType = async function (projectId) {
  return await this.aggregate([
    { $match: { project: new mongoose.Types.ObjectId(projectId) } },
    {
      $group: {
        _id: "$type",
        total: { $sum: "$amount" },
        count: { $sum: 1 },
        expenses: { $push: "$$ROOT" },
      },
    },
    { $sort: { total: -1 } },
  ]);
};

// Pre-save middleware to ensure order is set
expenseSchema.pre("save", async function (next) {
  if (this.isNew && this.order === 0) {
    // Get the highest order for this project
    const lastExpense = await this.constructor
      .findOne({ project: this.project })
      .sort({ order: -1 });
    this.order = lastExpense ? lastExpense.order + 1 : 1;
  }
  next();
});

const Expense =
  mongoose.models.Expense || mongoose.model("Expense", expenseSchema);

export default Expense;
