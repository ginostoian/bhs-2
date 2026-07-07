import { NextResponse } from "next/server";
import { loadExtensionConfig } from "@/libs/extensionRates";
import { DEFAULT_EXTENSION_CONFIG } from "@/app/extension-calculator/lib/config";

// Public: returns the effective extension price book so the on-page live estimate
// reflects any admin rate overrides. Falls back to bundled defaults on error.
export async function GET() {
  try {
    const config = await loadExtensionConfig();
    return NextResponse.json(
      { config },
      { headers: { "Cache-Control": "public, max-age=300, s-maxage=300" } },
    );
  } catch (error) {
    console.error("Error loading public extension rates:", error);
    return NextResponse.json({ config: DEFAULT_EXTENSION_CONFIG }, { status: 200 });
  }
}
