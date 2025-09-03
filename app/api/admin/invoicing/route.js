import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Invoice from "@/models/Invoice";

export async function POST(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const body = await request.json();

    // Create new invoice
    const invoiceData = {
      ...body,
      createdBy: session.user.id,
      lastModifiedBy: session.user.id,
      status: body.status || "draft",
    };

    const invoice = await Invoice.create(invoiceData);

    return NextResponse.json({
      success: true,
      invoice: invoice.toJSON(),
      message: "Invoice created successfully",
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    return NextResponse.json(
      { error: "Failed to create invoice", details: error.message },
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
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    // Build query
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { invoiceNumber: { $regex: search, $options: "i" } },
        { title: { $regex: search, $options: "i" } },
        { "client.name": { $regex: search, $options: "i" } },
        { "client.email": { $regex: search, $options: "i" } },
      ];
    }

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    const invoices = await Invoice.find(query)
      .populate("linkedUser", "name email")
      .populate("linkedLead", "name email")
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .sort(sortOptions)
      .skip(skip)
      .limit(limit);

    const total = await Invoice.countDocuments(query);

    return NextResponse.json({
      invoices,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching invoices:", error);
    return NextResponse.json(
      { error: "Failed to fetch invoices" },
      { status: 500 },
    );
  }
}
