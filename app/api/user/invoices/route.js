import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Invoice from "@/models/Invoice";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Get user's invoices (only non-draft ones)
    const invoices = await Invoice.find({
      linkedUser: session.user.id,
      status: { $ne: "draft" }, // Only show sent and paid invoices to users
    })
      .sort({ createdAt: -1 })
      .select("-publicToken") // Don't expose the public token in this API
      .lean();

    return NextResponse.json({
      invoices,
    });
  } catch (error) {
    console.error("Error fetching user invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}
