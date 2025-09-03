import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import InvoiceTemplate from "@/models/InvoiceTemplate";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const body = await request.json();

    const template = new InvoiceTemplate({
      ...body,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    await template.save();

    // Populate before returning
    await template.populate("createdBy", "name email");

    return NextResponse.json({
      success: true,
      template,
      message: "Invoice template created successfully",
    });
  } catch (error) {
    console.error("Error creating invoice template:", error);
    return NextResponse.json(
      { error: "Failed to create template", details: error.message },
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
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const popular = searchParams.get("popular") === "true";
    const limit = parseInt(searchParams.get("limit")) || 50;

    let query = { isActive: true };

    if (category && category !== "all") {
      query.category = category;
    }

    if (search) {
      query.$or = [
        { serviceName: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    let sortOptions = {};
    if (popular) {
      sortOptions = { usageCount: -1, lastUsed: -1 };
    } else {
      sortOptions = { serviceName: 1 };
    }

    const templates = await InvoiceTemplate.find(query)
      .sort(sortOptions)
      .limit(limit)
      .populate("createdBy", "name email");

    // Get unique categories for filtering
    const categories = await InvoiceTemplate.distinct("category", {
      isActive: true,
    });

    return NextResponse.json({
      templates,
      categories: categories.sort(),
    });
  } catch (error) {
    console.error("Error fetching invoice templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 },
    );
  }
}
