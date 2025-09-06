import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    // Find all quotes without publicToken that are not drafts
    const quotesWithoutToken = await Quote.find({
      publicToken: { $exists: false },
      status: { $ne: "draft" },
    });

    let fixedCount = 0;

    for (const quote of quotesWithoutToken) {
      // Trigger save to generate publicToken via middleware
      await quote.save();
      fixedCount++;
    }

    return NextResponse.json({
      success: true,
      message: `Fixed ${fixedCount} quotes`,
      fixedCount,
    });
  } catch (error) {
    console.error("Fix tokens error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
