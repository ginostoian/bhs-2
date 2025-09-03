import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import User from "@/models/User";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";
    const limit = parseInt(searchParams.get("limit")) || 10;

    if (!query || query.length < 2) {
      return NextResponse.json({ clients: [] });
    }

    const searchRegex = { $regex: query, $options: "i" };

    // Search leads
    const leads = await Lead.find({
      isActive: true,
      isArchived: false,
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { address: searchRegex },
      ],
    })
      .select("name email phone address stage")
      .limit(limit)
      .lean();

    // Search users
    const users = await User.find({
      $or: [
        { name: searchRegex },
        { email: searchRegex },
        { phone: searchRegex },
        { address: searchRegex },
      ],
    })
      .select("name email phone address projectStatus")
      .limit(limit)
      .lean();

    // Format results
    const leadResults = leads.map((lead) => ({
      id: lead._id,
      type: "lead",
      name: lead.name,
      email: lead.email,
      phone: lead.phone || "",
      address: lead.address || "",
      status: lead.stage,
      source: "CRM Lead",
    }));

    const userResults = users.map((user) => ({
      id: user._id,
      type: "user",
      name: user.name,
      email: user.email,
      phone: user.phone || "",
      address: user.address || "",
      status: user.projectStatus,
      source: "User Account",
    }));

    // Combine and limit results
    const allResults = [...leadResults, ...userResults];

    // Sort by relevance (exact matches first, then partial matches)
    const sortedResults = allResults.sort((a, b) => {
      const aExactMatch =
        a.name?.toLowerCase() === query.toLowerCase() ||
        a.email?.toLowerCase() === query.toLowerCase();
      const bExactMatch =
        b.name?.toLowerCase() === query.toLowerCase() ||
        b.email?.toLowerCase() === query.toLowerCase();

      if (aExactMatch && !bExactMatch) return -1;
      if (!aExactMatch && bExactMatch) return 1;

      // Then sort by name
      return (a.name || "").localeCompare(b.name || "");
    });

    return NextResponse.json({
      clients: sortedResults.slice(0, limit),
    });
  } catch (error) {
    console.error("Error searching clients:", error);
    return NextResponse.json(
      { error: "Failed to search clients" },
      { status: 500 },
    );
  }
}
