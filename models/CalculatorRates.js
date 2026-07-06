import mongoose from "mongoose";

/**
 * Stores admin overrides for a calculator's price book.
 * One document per calculatorType. `overrides` is a partial object that is deep-merged
 * over the code defaults at runtime, so any field left out keeps its shipped value.
 */
const calculatorRatesSchema = new mongoose.Schema(
  {
    calculatorType: {
      type: String,
      required: true,
      unique: true,
      index: true,
      default: "renovation",
    },
    overrides: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true },
);

export default mongoose.models.CalculatorRates ||
  mongoose.model("CalculatorRates", calculatorRatesSchema);
