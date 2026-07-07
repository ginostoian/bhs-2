import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import CalculatorRates from "@/models/CalculatorRates";
import { DEFAULT_RENOVATION_CONFIG } from "@/app/renovation-calculator/lib/config";
import { DEFAULT_EXTENSION_CONFIG } from "@/app/extension-calculator/lib/config";
import { deepMerge } from "@/app/renovation-calculator/lib/rates";

// Registry of editable calculator price books, keyed by calculatorType.
const DEFAULTS_BY_TYPE = {
  renovation: DEFAULT_RENOVATION_CONFIG,
  extension: DEFAULT_EXTENSION_CONFIG,
};

function resolveType(request) {
  const type = new URL(request.url).searchParams.get("type") || "renovation";
  return DEFAULTS_BY_TYPE[type] ? type : "renovation";
}

function effectiveConfig(type, overrides) {
  const defaults = DEFAULTS_BY_TYPE[type];
  if (!overrides || typeof overrides !== "object" || Array.isArray(overrides)) {
    return defaults;
  }
  return deepMerge(defaults, overrides);
}

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") return null;
  return session;
}

// Returns defaults, current overrides, and the merged effective config for a calculator type.
export async function GET(request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const type = resolveType(request);
    await connectMongo();
    const doc = await CalculatorRates.findOne({ calculatorType: type }).lean();
    const overrides = doc?.overrides || {};

    return NextResponse.json({
      calculatorType: type,
      defaults: DEFAULTS_BY_TYPE[type],
      overrides,
      effective: effectiveConfig(type, overrides),
      updatedAt: doc?.updatedAt || null,
    });
  } catch (error) {
    console.error("Error loading calculator rates:", error);
    return NextResponse.json({ error: "Failed to load rates" }, { status: 500 });
  }
}

// Saves a full overrides object (partial price book). Pass {} to reset to defaults.
export async function PUT(request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const type = resolveType(request);
    const body = await request.json();
    const overrides =
      body && typeof body.overrides === "object" && body.overrides !== null
        ? body.overrides
        : {};

    await connectMongo();
    const doc = await CalculatorRates.findOneAndUpdate(
      { calculatorType: type },
      { $set: { overrides, updatedBy: session.user.id } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return NextResponse.json({
      success: true,
      calculatorType: type,
      overrides: doc.overrides,
      effective: effectiveConfig(type, doc.overrides),
      updatedAt: doc.updatedAt,
    });
  } catch (error) {
    console.error("Error saving calculator rates:", error);
    return NextResponse.json({ error: "Failed to save rates" }, { status: 500 });
  }
}
