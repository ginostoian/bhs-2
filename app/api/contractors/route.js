import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Contractor from "@/models/Contractor";

export const dynamic = "force-dynamic";

/**
 * GET /api/contractors
 * List contractors with optional filtering, search, and pagination
 */
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const trade = searchParams.get("trade");
    const priceTier = searchParams.get("priceTier");
    const experience = searchParams.get("experience");
    const active = searchParams.get("active");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    let query = {};

    if (trade) {
      query.trades = trade;
    }
    if (priceTier) {
      query.priceTier = priceTier;
    }
    if (experience) {
      query.experience = experience;
    }
    if (active !== null) {
      if (active === "true" || active === "false") {
        query.isActive = active === "true";
      }
    }

    if (search) {
      query = {
        ...query,
        $or: [
          { name: { $regex: search, $options: "i" } },
          { email: { $regex: search, $options: "i" } },
          { phone: { $regex: search, $options: "i" } },
          { address: { $regex: search, $options: "i" } },
          { trades: { $in: [new RegExp(search, "i")] } },
        ],
      };
    }

    const totalCount = await Contractor.countDocuments(query);
    const contractors = await Contractor.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Normalize id field for client-side usage
    const normalized = contractors.map((c) => ({
      ...c,
      id: c._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json({ contractors: normalized, totalCount });
  } catch (error) {
    console.error("Error fetching contractors:", error);
    return NextResponse.json(
      { error: "Failed to fetch contractors" },
      { status: 500 },
    );
  }
}

/**
 * POST /api/contractors
 * Create a new contractor (admin only)
 */
export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      trades,
      priceTier,
      experience,
      isActive,
      notes,
    } = body;

    if (!name) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const contractor = new Contractor({
      name,
      email,
      phone,
      address,
      trades: Array.isArray(trades) ? trades : [],
      priceTier: priceTier || undefined,
      experience: experience || undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      notes,
    });

    await contractor.save();

    return NextResponse.json(
      { contractor: contractor.toJSON() },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating contractor:", error);
    return NextResponse.json(
      { error: "Failed to create contractor" },
      { status: 500 },
    );
  }
}
