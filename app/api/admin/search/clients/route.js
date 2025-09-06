import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";
import Lead from "@/models/Lead";

export async function GET(request) {
  try {
    // Check admin authentication (same as invoicing system)
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (!query || query.length < 2) {
      return NextResponse.json([]);
    }

    // Use same regex format as invoicing system
    const searchRegex = { $regex: query, $options: "i" };
    const results = [];

    // Search Users
    try {
      const users = await User.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { address: searchRegex },
        ],
      })
        .select("name email phone address postcode")
        .limit(limit)
        .lean();

      users.forEach((user) => {
        results.push({
          id: user._id.toString(),
          type: "user",
          source: "Registered User",
          name: user.name || "",
          email: user.email || "",
          phone: user.phone || "",
          address: user.address || "",
          postcode: user.postcode || "",
        });
      });
    } catch (userError) {
      console.warn("Error searching users:", userError);
    }

    // Search Leads
    try {
      const leads = await Lead.find({
        $or: [
          { name: searchRegex },
          { email: searchRegex },
          { phone: searchRegex },
          { address: searchRegex },
        ],
      })
        .select("name email phone address postcode")
        .limit(limit)
        .lean();

      leads.forEach((lead) => {
        results.push({
          id: lead._id.toString(),
          type: "lead",
          source: "CRM Lead",
          name: lead.name || "",
          email: lead.email || "",
          phone: lead.phone || "",
          address: lead.address || "",
          postcode: lead.postcode || "",
        });
      });
    } catch (leadError) {
      console.warn("Error searching leads:", leadError);
    }

    // Sort results by relevance (exact matches first, then partial matches)
    results.sort((a, b) => {
      const aExactMatch =
        a.name.toLowerCase().includes(query.toLowerCase()) ||
        a.email.toLowerCase().includes(query.toLowerCase());
      const bExactMatch =
        b.name.toLowerCase().includes(query.toLowerCase()) ||
        b.email.toLowerCase().includes(query.toLowerCase());

      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;
      return a.name.localeCompare(b.name);
    });

    return NextResponse.json(results.slice(0, 10));
  } catch (error) {
    console.error("Search clients error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
