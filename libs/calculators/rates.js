import connectMongo from "@/libs/mongoose";
import CalculatorRates from "@/models/CalculatorRates";
import { CALCULATORS } from "./registry";
import { deepMerge } from "./common";

// Default price book for each admin-editable calculator type.
export const DEFAULT_CONFIGS = Object.fromEntries(
  Object.values(CALCULATORS)
    .filter((c) => c.rateType)
    .map((c) => [c.rateType, c.defaultConfig]),
);

// Effective price book = shipped defaults with any admin overrides merged on top.
export async function loadCalculatorConfig(type) {
  const defaults = DEFAULT_CONFIGS[type];
  if (!defaults) return null;
  try {
    await connectMongo();
    const doc = await CalculatorRates.findOne({ calculatorType: type }).lean();
    return doc?.overrides ? deepMerge(defaults, doc.overrides) : defaults;
  } catch (error) {
    console.error(`Calculator rates unavailable for ${type}:`, error.message);
    return defaults;
  }
}
