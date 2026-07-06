import connectMongo from "@/libs/mongoose";
import CalculatorRates from "@/models/CalculatorRates";
import { getEffectiveConfig } from "@/app/extension-calculator/lib/rates";
import { createCostEngine } from "@/app/extension-calculator/lib/costEngine";

const CALCULATOR_TYPE = "extension";

// Loads stored admin overrides for the extension calculator (empty object if none).
export async function loadExtensionOverrides() {
  await connectMongo();
  const doc = await CalculatorRates.findOne({ calculatorType: CALCULATOR_TYPE }).lean();
  return doc?.overrides || {};
}

// Returns the effective (defaults + overrides) extension config.
export async function loadExtensionConfig() {
  const overrides = await loadExtensionOverrides();
  return getEffectiveConfig(overrides);
}

// Returns a cost engine bound to the effective config.
export async function loadExtensionEngine() {
  const config = await loadExtensionConfig();
  return createCostEngine(config);
}

export { CALCULATOR_TYPE };
