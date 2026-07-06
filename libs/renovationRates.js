import connectMongo from "@/libs/mongoose";
import CalculatorRates from "@/models/CalculatorRates";
import { getEffectiveConfig } from "@/app/renovation-calculator/lib/rates";
import { createCostEngine } from "@/app/renovation-calculator/lib/costEngine";

const CALCULATOR_TYPE = "renovation";

// Loads stored admin overrides for the renovation calculator (empty object if none).
export async function loadRenovationOverrides() {
  await connectMongo();
  const doc = await CalculatorRates.findOne({ calculatorType: CALCULATOR_TYPE }).lean();
  return doc?.overrides || {};
}

// Returns the effective (defaults + overrides) renovation config.
export async function loadRenovationConfig() {
  const overrides = await loadRenovationOverrides();
  return getEffectiveConfig(overrides);
}

// Returns a cost engine bound to the effective config.
export async function loadRenovationEngine() {
  const config = await loadRenovationConfig();
  return createCostEngine(config);
}

export { CALCULATOR_TYPE };
