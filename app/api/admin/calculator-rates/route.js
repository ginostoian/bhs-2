import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import CalculatorRates from "@/models/CalculatorRates";
import { DEFAULT_RENOVATION_CONFIG } from "@/app/renovation-calculator/lib/config";
import { getEffectiveConfig } from "@/app/renovation-calculator/lib/rates";

const CALCULATOR_TYPE = "renovation";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  if (!session || session.user.role !== "admin") {
    return null;
  }
  return session;
}

// Returns defaults, current overrides, and the merged effective config.
export async function GET() {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const doc = await CalculatorRates.findOne({ calculatorType: CALCULATOR_TYPE }).lean();
    const overrides = doc?.overrides || {};

    return NextResponse.json({
      defaults: DEFAULT_RENOVATION_CONFIG,
      overrides,
      effective: getEffectiveConfig(overrides),
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

    const body = await request.json();
    const overrides =
      body && typeof body.overrides === "object" && body.overrides !== null
        ? body.overrides
        : {};

    await connectMongo();
    const doc = await CalculatorRates.findOneAndUpdate(
      { calculatorType: CALCULATOR_TYPE },
      { $set: { overrides, updatedBy: session.user.id } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return NextResponse.json({
      success: true,
      overrides: doc.overrides,
      effective: getEffectiveConfig(doc.overrides),
      updatedAt: doc.updatedAt,
    });
  } catch (error) {
    console.error("Error saving calculator rates:", error);
    return NextResponse.json({ error: "Failed to save rates" }, { status: 500 });
  }
}
