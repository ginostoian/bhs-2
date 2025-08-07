import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Contractor from "@/models/Contractor";

export const dynamic = "force-dynamic";

/**
 * GET /api/contractors/[id]
 * Get a specific contractor
 */
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();
    const contractor = await Contractor.findById(params.id).lean();
    if (!contractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 },
      );
    }
    return NextResponse.json({
      contractor: {
        ...contractor,
        id: contractor._id.toString(),
        _id: undefined,
      },
    });
  } catch (error) {
    console.error("Error fetching contractor:", error);
    return NextResponse.json(
      { error: "Failed to fetch contractor" },
      { status: 500 },
    );
  }
}

/**
 * PUT /api/contractors/[id]
 * Update a contractor (admin only)
 */
export async function PUT(request, { params }) {
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

    const contractor = await Contractor.findById(params.id);
    if (!contractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 },
      );
    }

    if (name !== undefined) contractor.name = name;
    if (email !== undefined) contractor.email = email;
    if (phone !== undefined) contractor.phone = phone;
    if (address !== undefined) contractor.address = address;
    if (trades !== undefined)
      contractor.trades = Array.isArray(trades) ? trades : [];
    if (priceTier !== undefined) contractor.priceTier = priceTier;
    if (experience !== undefined) contractor.experience = experience;
    if (isActive !== undefined) contractor.isActive = Boolean(isActive);
    if (notes !== undefined) contractor.notes = notes;

    await contractor.save();

    return NextResponse.json({ contractor: contractor.toJSON() });
  } catch (error) {
    console.error("Error updating contractor:", error);
    return NextResponse.json(
      { error: "Failed to update contractor" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/contractors/[id]
 * Delete a contractor (admin only)
 */
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongoose();
    const contractor = await Contractor.findById(params.id);
    if (!contractor) {
      return NextResponse.json(
        { error: "Contractor not found" },
        { status: 404 },
      );
    }
    await Contractor.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Contractor deleted successfully" });
  } catch (error) {
    console.error("Error deleting contractor:", error);
    return NextResponse.json(
      { error: "Failed to delete contractor" },
      { status: 500 },
    );
  }
}
