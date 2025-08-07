import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Partner from "@/models/Partner";

export const dynamic = "force-dynamic";

// GET /api/partners - List with search/filters/pagination
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const occupation = searchParams.get("occupation");
    const experience = searchParams.get("experience");
    const active = searchParams.get("active");
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "12", 10);

    let query = {};
    if (occupation) query.occupation = occupation;
    if (experience) query.experience = experience;
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
          { occupation: { $regex: search, $options: "i" } },
        ],
      };
    }

    const totalCount = await Partner.countDocuments(query);
    const partners = await Partner.find(query)
      .sort({ name: 1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const normalized = partners.map((p) => ({
      ...p,
      id: p._id.toString(),
      _id: undefined,
    }));
    return NextResponse.json({ partners: normalized, totalCount });
  } catch (error) {
    console.error("Error fetching partners:", error);
    return NextResponse.json(
      { error: "Failed to fetch partners" },
      { status: 500 },
    );
  }
}

// POST /api/partners - Create partner (admin)
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
      occupation,
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

    const partner = new Partner({
      name,
      email,
      phone,
      address,
      occupation: occupation || undefined,
      experience: experience || undefined,
      isActive: isActive !== undefined ? Boolean(isActive) : undefined,
      notes,
      referrals: [],
    });

    await partner.save();
    return NextResponse.json({ partner: partner.toJSON() }, { status: 201 });
  } catch (error) {
    console.error("Error creating partner:", error);
    return NextResponse.json(
      { error: "Failed to create partner" },
      { status: 500 },
    );
  }
}
