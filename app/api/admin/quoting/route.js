import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";
import {
  applyDefaultTerms,
  generateQuoteNumber,
  normalizeServices,
  pickEditableFields,
} from "@/libs/quoteService";

const requireAdmin = async () => {
  const session = await getServerSession(authOptions);
  return session?.user?.role === "admin" ? session : null;
};

// POST - Create a new draft quote
export async function POST(request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const body = pickEditableFields(await request.json());
    const { services, total } = normalizeServices(body.services || []);

    const quote = new Quote({
      ...body,
      title: body.title?.trim() || "Untitled quote",
      projectType: body.projectType || "custom",
      client: {
        ...body.client,
        name: body.client?.name?.trim() || "New client",
      },
      services,
      total,
      validUntil:
        body.validUntil || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      quoteNumber: await generateQuoteNumber(Quote),
      createdBy: session.user.id,
      lastModifiedBy: session.user.id,
      // New quotes always start as drafts; sending is a separate action
      status: "draft",
    });
    applyDefaultTerms(quote);
    await quote.save();

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

// GET - List quotes (paginated, filterable, searchable)
export async function GET(request) {
  try {
    const session = await requireAdmin();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { searchParams } = new URL(request.url);
    const page = Math.max(parseInt(searchParams.get("page")) || 1, 1);
    const limit = Math.min(parseInt(searchParams.get("limit")) || 10, 100);
    const status = searchParams.get("status");
    const projectType = searchParams.get("projectType");
    const q = searchParams.get("q")?.trim();
    const sort =
      searchParams.get("sort") === "updated"
        ? { updatedAt: -1 }
        : { createdAt: -1 };

    const query = {};
    if (status && status !== "all") query.status = status;
    if (projectType && projectType !== "all") query.projectType = projectType;
    if (q) {
      const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = { $regex: escaped, $options: "i" };
      query.$or = [
        { title: regex },
        { quoteNumber: regex },
        { "client.name": regex },
        { "client.email": regex },
        { projectAddress: regex },
      ];
    }

    const skip = (page - 1) * limit;
    const [quotes, total] = await Promise.all([
      Quote.find(query)
        .sort(sort)
        .skip(skip)
        .limit(limit)
        .populate("createdBy", "name email")
        .lean(),
      Quote.countDocuments(query),
    ]);

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
