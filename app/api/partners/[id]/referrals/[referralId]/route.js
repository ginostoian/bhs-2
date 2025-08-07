import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Partner from "@/models/Partner";

export const dynamic = "force-dynamic";

// DELETE referral (admin)
export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const { id: partnerId, referralId } = params;
    const partner = await Partner.findById(partnerId);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    partner.referrals.id(referralId)?.deleteOne();
    await partner.save();
    return NextResponse.json({ partner: partner.toJSON() });
  } catch (error) {
    console.error("Error deleting referral:", error);
    return NextResponse.json(
      { error: "Failed to delete referral" },
      { status: 500 },
    );
  }
}
