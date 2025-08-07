import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Partner from "@/models/Partner";

export const dynamic = "force-dynamic";

// GET one
export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const partner = await Partner.findById(params.id).lean();
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    return NextResponse.json({
      partner: { ...partner, id: partner._id.toString(), _id: undefined },
    });
  } catch (error) {
    console.error("Error fetching partner:", error);
    return NextResponse.json(
      { error: "Failed to fetch partner" },
      { status: 500 },
    );
  }
}

// PUT update (admin)
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
      occupation,
      experience,
      isActive,
      notes,
      referrals,
    } = body;
    const partner = await Partner.findById(params.id);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    if (name !== undefined) partner.name = name;
    if (email !== undefined) partner.email = email;
    if (phone !== undefined) partner.phone = phone;
    if (address !== undefined) partner.address = address;
    if (occupation !== undefined) partner.occupation = occupation;
    if (experience !== undefined) partner.experience = experience;
    if (isActive !== undefined) partner.isActive = Boolean(isActive);
    if (notes !== undefined) partner.notes = notes;
    if (referrals !== undefined && Array.isArray(referrals))
      partner.referrals = referrals;
    await partner.save();
    return NextResponse.json({ partner: partner.toJSON() });
  } catch (error) {
    console.error("Error updating partner:", error);
    return NextResponse.json(
      { error: "Failed to update partner" },
      { status: 500 },
    );
  }
}

// DELETE (admin)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const partner = await Partner.findById(params.id);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    await Partner.findByIdAndDelete(params.id);
    return NextResponse.json({ message: "Partner deleted successfully" });
  } catch (error) {
    console.error("Error deleting partner:", error);
    return NextResponse.json(
      { error: "Failed to delete partner" },
      { status: 500 },
    );
  }
}
