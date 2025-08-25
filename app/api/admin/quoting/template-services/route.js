import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import TemplateService from "@/models/TemplateService";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const body = await request.json();

    const templateService = new TemplateService({
      ...body,
      createdBy: session.user.id,
      updatedBy: session.user.id,
    });

    await templateService.save();

    return NextResponse.json(templateService, { status: 201 });
  } catch (error) {
    console.error("Error creating template service:", error);

    // Return more detailed error information for debugging
    if (error.name === "ValidationError") {
      const validationErrors = Object.keys(error.errors).map((key) => ({
        field: key,
        message: error.errors[key].message,
        value: error.errors[key].value,
      }));

      return NextResponse.json(
        {
          error: "Validation failed",
          details: validationErrors,
          message: error.message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        error: "Failed to create template service",
        message: error.message,
        details: error.stack,
      },
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
    const pricingType = searchParams.get("pricingType");
    const isActive = searchParams.get("isActive");
    const search = searchParams.get("search");

    let query = {};
    if (category) query.category = category;
    if (pricingType) query.pricingType = pricingType;
    if (isActive !== null) query.isActive = isActive === "true";
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const templateServices = await TemplateService.find(query)
      .sort({ category: 1, name: 1 })
      .populate("createdBy", "name email")
      .populate("calculationConfig.tradesperson", "name price unit")
      .populate("calculationConfig.material", "name price unit");

    return NextResponse.json(templateServices);
  } catch (error) {
    console.error("Error fetching template services:", error);
    return NextResponse.json(
      { error: "Failed to fetch template services" },
      { status: 500 },
    );
  }
}
