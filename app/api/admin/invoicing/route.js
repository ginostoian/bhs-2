import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Invoice from "@/models/Invoice";

// Import referenced models to ensure they're registered
import "@/models/User";
import "@/models/Lead";

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

    console.log("Connecting to MongoDB...");
    await connectMongo();
    console.log("MongoDB connected successfully");

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const sortBy = searchParams.get("sortBy") || "createdAt";
    const sortOrder = searchParams.get("sortOrder") || "desc";

    console.log("Query parameters:", {
      status,
      search,
      page,
      limit,
      sortBy,
      sortOrder,
    });

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

    console.log("MongoDB query:", JSON.stringify(query));

    // Execute query with pagination
    const skip = (page - 1) * limit;
    const sortOptions = {};
    sortOptions[sortBy] = sortOrder === "asc" ? 1 : -1;

    console.log("Executing Invoice.find with pagination...");

    // First, try to get invoices without populate to isolate the issue
    let invoices;
    try {
      invoices = await Invoice.find(query)
        .sort(sortOptions)
        .skip(skip)
        .limit(limit)
        .lean(); // Use lean() for better performance and to avoid potential model issues

      console.log(`Found ${invoices.length} invoices (lean query)`);

      // Now try to populate each field separately to identify which one is failing
      if (invoices.length > 0) {
        console.log("Attempting to populate fields...");
        try {
          invoices = await Invoice.find(query)
            .populate("linkedUser", "name email")
            .populate("linkedLead", "name email")
            .populate("createdBy", "name email")
            .populate("lastModifiedBy", "name email")
            .sort(sortOptions)
            .skip(skip)
            .limit(limit);
          console.log("Populate operations successful");
        } catch (populateError) {
          console.error("Error during populate operations:", populateError);
          // Fall back to lean query without populate
          console.log("Falling back to lean query without populate");
          invoices = await Invoice.find(query)
            .sort(sortOptions)
            .skip(skip)
            .limit(limit)
            .lean();
        }
      }
    } catch (queryError) {
      console.error("Error during Invoice.find:", queryError);
      throw queryError;
    }

    console.log("Getting total count...");
    const total = await Invoice.countDocuments(query);
    console.log(`Total invoices: ${total}`);

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
    console.error("Error stack:", error.stack);
    return NextResponse.json(
      {
        error: "Failed to fetch invoices",
        details: error.message,
        stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
      },
      { status: 500 },
    );
  }
}
