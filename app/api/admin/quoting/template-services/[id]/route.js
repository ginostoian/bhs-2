import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import TemplateService from "@/models/TemplateService";

export async function GET(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params;

    const templateService = await TemplateService.findById(id)
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email")
      .populate("calculationConfig.tradesperson", "name price unit category")
      .populate("calculationConfig.material", "name price unit category");

    if (!templateService) {
      return NextResponse.json(
        { error: "Template service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(templateService);
  } catch (error) {
    console.error("Error fetching template service:", error);
    return NextResponse.json(
      { error: "Failed to fetch template service" },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params;
    const body = await request.json();

    const templateService = await TemplateService.findByIdAndUpdate(
      id,
      {
        ...body,
        updatedBy: session.user.id,
      },
      { new: true },
    );

    if (!templateService) {
      return NextResponse.json(
        { error: "Template service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(templateService);
  } catch (error) {
    console.error("Error updating template service:", error);
    return NextResponse.json(
      { error: "Failed to update template service" },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();

    const { id } = params;

    const templateService = await TemplateService.findByIdAndDelete(id);

    if (!templateService) {
      return NextResponse.json(
        { error: "Template service not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      message: "Template service deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting template service:", error);
    return NextResponse.json(
      { error: "Failed to delete template service" },
      { status: 500 },
    );
  }
}
