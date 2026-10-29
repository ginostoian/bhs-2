import { NextResponse } from "next/server";
import { DEFAULT_CONFIGS, loadCalculatorConfig } from "@/libs/calculators/rates";

// Public: the effective price book for a calculator, so live estimates reflect admin edits.
export async function GET(_request, { params }) {
  const config = await loadCalculatorConfig(params.type);
  if (!config) return NextResponse.json({ error: "Unknown calculator" }, { status: 404 });
  return NextResponse.json(
    { config: config || DEFAULT_CONFIGS[params.type] },
    { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } },
  );
}
