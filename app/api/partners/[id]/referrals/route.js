import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Partner from "@/models/Partner";

export const dynamic = "force-dynamic";

// POST add referral (admin)
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const { customerName, projectValue } = await request.json();
    if (!customerName || projectValue === undefined) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const partner = await Partner.findById(params.id);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    partner.referrals.push({
      customerName,
      projectValue: parseFloat(projectValue),
    });
    await partner.save();
    return NextResponse.json({ partner: partner.toJSON() }, { status: 201 });
  } catch (error) {
    console.error("Error adding referral:", error);
    return NextResponse.json(
      { error: "Failed to add referral" },
      { status: 500 },
    );
  }
}
