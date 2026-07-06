import { NextResponse } from "next/server";
import { loadRenovationConfig } from "@/libs/renovationRates";
import { DEFAULT_RENOVATION_CONFIG } from "@/app/renovation-calculator/lib/config";

// Public: returns the effective renovation price book so the on-page live estimate
// reflects any admin rate overrides. Falls back to bundled defaults on error.
export async function GET() {
  try {
    const config = await loadRenovationConfig();
    return NextResponse.json(
      { config },
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } },
    );
  } catch (error) {
    console.error("Error loading public renovation rates:", error);
    return NextResponse.json({ config: DEFAULT_RENOVATION_CONFIG }, { status: 200 });
  }
}
