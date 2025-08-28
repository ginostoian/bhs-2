import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import QuoteTemplate from "@/models/QuoteTemplate";

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const body = await request.json();
    console.log("Creating template with data:", body);

    // Log the current model schema for debugging
    console.log(
      "Current QuoteTemplate schema fields:",
      Object.keys(QuoteTemplate.schema.obj),
    );
    console.log(
      "ProjectType enum values:",
      QuoteTemplate.schema.obj.projectType?.enum,
    );

    const template = new QuoteTemplate({
      ...body,
      createdBy: session.user.id,
      lastModifiedBy: session.user.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    console.log("Template object before save:", template);

    await template.save();
    console.log("Template saved successfully:", template._id);

    return NextResponse.json(template, { status: 201 });
  } catch (error) {
    console.error("Error creating template:", error);
    if (error.errors) {
      console.error("Validation errors:", error.errors);
    }
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
    const projectType = searchParams.get("projectType");

    let query = {};
    if (projectType) {
      query.projectType = projectType;
    }

    const templates = await QuoteTemplate.find(query)
      .sort({ createdAt: -1 })
      .populate("createdBy", "name email");

    return NextResponse.json(templates);
  } catch (error) {
    console.error("Error fetching templates:", error);
    return NextResponse.json(
      { error: "Failed to fetch templates" },
      { status: 500 },
    );
  }
}
