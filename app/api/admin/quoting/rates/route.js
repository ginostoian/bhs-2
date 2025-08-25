import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import RateCard from "@/models/RateCard";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const body = await request.json();

    const rateCard = new RateCard({
      ...body,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    await rateCard.save();

    return NextResponse.json(rateCard, { status: 201 });
  } catch (error) {
    console.error("Error creating rate card:", error);
    return NextResponse.json(
      { error: "Failed to create rate card" },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const category = searchParams.get("category");
    const isActive = searchParams.get("isActive");

    let query = {};
    if (type) query.type = type;
    if (category) query.category = category;
    if (isActive !== null) query.isActive = isActive === "true";

    const rateCards = await RateCard.find(query)
      .sort({ category: 1, name: 1 })
      .populate("createdBy", "name email");

    return NextResponse.json(rateCards);
  } catch (error) {
    console.error("Error fetching rate cards:", error);
    return NextResponse.json(
      { error: "Failed to fetch rate cards" },
      { status: 500 },
    );
  }
}
