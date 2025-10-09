import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";

export async function POST(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const body = await request.json();

    // Generate unique quote number
    const year = new Date().getFullYear();
    const existingQuotes = await Quote.find({
      quoteNumber: { $regex: `^${year}` },
    })
      .sort({ quoteNumber: -1 })
      .limit(1);

    let quoteNumber;
    if (existingQuotes.length > 0) {
      const lastNumber = parseInt(existingQuotes[0].quoteNumber);
      quoteNumber = (lastNumber + 1).toString();
    } else {
      quoteNumber = `${year}0001`;
    }

    // Clean and validate services data if provided
    if (body.services) {
      let total = 0;

      body.services = body.services.map((service) => {
        if (service.type === "category" && service.items) {
          // Clean items data
          const cleanedItems = service.items.map((item) => {
            const quantity = parseFloat(item.quantity) || 0;
            const unitPrice = parseFloat(item.unitPrice) || 0;
            const itemTotal = Math.round(quantity * unitPrice * 100) / 100;

            total += itemTotal;

            return {
              name: item.name || "",
              description: item.description || "",
              quantity: quantity,
              unit: item.unit || "",
              unitPrice: unitPrice,
              total: itemTotal,
              notes: item.notes || "",
              // Include optional fields if they exist
              ...(item.customerUnitPrice !== undefined && {
                customerUnitPrice: parseFloat(item.customerUnitPrice) || 0,
              }),
              ...(item.customerTotal !== undefined && {
                customerTotal: parseFloat(item.customerTotal) || 0,
              }),
            };
          });

          const categoryTotal = cleanedItems.reduce(
            (sum, item) => sum + item.total,
            0,
          );

          return {
            ...service,
            items: cleanedItems,
            categoryTotal: Math.round(categoryTotal * 100) / 100,
          };
        }
        return service;
      });

      body.total = Math.round(total * 100) / 100;
    }

    // Create new quote
    const quoteData = {
      ...body,
      quoteNumber,
      createdBy: session.user.id,
      lastModifiedBy: session.user.id,
      status: "draft",
    };

    const quote = await Quote.create(quoteData);

    return NextResponse.json({
      success: true,
      quote: quote.toJSON(),
      message: "Quote created successfully",
    });
  } catch (error) {
    console.error("Error creating quote:", error);
    return NextResponse.json(
      { error: "Failed to create quote", details: error.message },
      { status: 500 },
    );
  }
}

export async function GET(request) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 10;
    const status = searchParams.get("status");
    const projectType = searchParams.get("projectType");

    // Build query
    const query = {};
    if (status && status !== "all") query.status = status;
    if (projectType && projectType !== "all") query.projectType = projectType;

    // Get quotes with pagination
    const skip = (page - 1) * limit;
    const quotes = await Quote.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate("createdBy", "name email")
      .lean();

    // Debug: Log the quotes being returned
    console.log(
      "API: Returning quotes with statuses:",
      quotes.map((q) => ({ id: q._id, status: q.status, title: q.title })),
    );

    // Get total count
    const total = await Quote.countDocuments(query);

    return NextResponse.json({
      success: true,
      quotes,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching quotes:", error);
    return NextResponse.json(
      { error: "Failed to fetch quotes", details: error.message },
      { status: 500 },
    );
  }
}
