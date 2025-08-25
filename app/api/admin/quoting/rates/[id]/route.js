import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import RateCard from "@/models/RateCard";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params;

    const rateCard = await RateCard.findById(id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    if (!rateCard) {
      return NextResponse.json(
        { error: "Rate card not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(rateCard);
  } catch (error) {
    console.error("Error fetching rate card:", error);
    return NextResponse.json(
      { error: "Failed to fetch rate card" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params;
    const body = await request.json();

    const rateCard = await RateCard.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: session.user.id,
      },
      { new: true },
    );

    if (!rateCard) {
      return NextResponse.json(
        { error: "Rate card not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(rateCard);
  } catch (error) {
    console.error("Error updating rate card:", error);
    return NextResponse.json(
      { error: "Failed to update rate card" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params;

    const rateCard = await RateCard.findByIdAndDelete(id);

    if (!rateCard) {
      return NextResponse.json(
        { error: "Rate card not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ message: "Rate card deleted successfully" });
  } catch (error) {
    console.error("Error deleting rate card:", error);
    return NextResponse.json(
      { error: "Failed to delete rate card" },
      { status: 500 },
    );
  }
}
