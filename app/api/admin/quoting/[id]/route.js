import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Quote from "@/models/Quote";

export async function GET(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const { id } = params;

    // Find the quote
    const quote = await Quote.findById(id)
      .populate("createdBy", "name email")
      .populate("lastModifiedBy", "name email")
      .lean();

    if (!quote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Ensure pricing object exists for older quotes
    if (!quote.pricing) {
      quote.pricing = {
        depositRequired: false,
        depositAmount: 0,
        depositPercentage: 0,
        vatRate: 20,
      };
    }

    return NextResponse.json({
      success: true,
      quote,
    });
  } catch (error) {
    console.error("Error fetching quote:", error);
    return NextResponse.json(
      { error: "Failed to fetch quote", details: error.message },
      { status: 500 },
    );
  }
}

export async function PUT(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const { id } = params;
    const body = await request.json();

    // First, fetch the current quote to check if we need to replace draft placeholders
    const currentQuote = await Quote.findById(id);
    if (!currentQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    // Check if status is being changed from draft to a non-draft status
    const isFinalizingDraft =
      currentQuote.status === "draft" && body.status && body.status !== "draft";

    // If finalizing a draft, replace placeholder text with actual terms
    if (isFinalizingDraft) {
      // Replace draft termsAndConditions if it's still the placeholder
      if (
        currentQuote.termsAndConditions === "Draft - terms to be finalized" ||
        currentQuote.termsAndConditions?.startsWith("Draft -")
      ) {
        body.termsAndConditions =
          "Standard BH Studio terms and conditions apply. All work is guaranteed and insured. Payment terms: deposit required, then weekly payments until completion.";
      }

      // Replace draft warrantyInformation if it's still the placeholder
      if (
        currentQuote.warrantyInformation ===
          "Draft - warranty information to be finalized" ||
        currentQuote.warrantyInformation?.startsWith("Draft -")
      ) {
        body.warrantyInformation =
          "All our work comes with a comprehensive workmanship guarantee covering our work from 1 year to 10 years depending on the project type and materials used.";
      }

      // Replace draft leadTime if it's still the placeholder
      if (
        currentQuote.leadTime === "Draft - lead time to be finalized" ||
        currentQuote.leadTime?.startsWith("Draft -")
      ) {
        body.leadTime =
          "We typically require 2 weeks notice to start a project.";
      }

      // Set sentAt timestamp when quote is sent for the first time
      if (body.status === "sent" && !currentQuote.sentAt) {
        body.sentAt = new Date();
      }
    }

    // Recalculate total and clean services data if being updated
    if (body.services) {
      let total = 0;

      // Clean and validate services data
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

    // Find and update the quote
    const updatedQuote = await Quote.findByIdAndUpdate(
      id,
      { $set: body },
      { new: true, runValidators: true },
    );

    if (!updatedQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Quote updated successfully",
      quote: updatedQuote,
    });
  } catch (error) {
    console.error("Error updating quote:", error);
    return NextResponse.json(
      { error: "Failed to update quote", details: error.message },
      { status: 500 },
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    // Check authentication and admin role
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectMongo();
    const { id } = params;

    // Find and delete the quote
    const deletedQuote = await Quote.findByIdAndDelete(id);

    if (!deletedQuote) {
      return NextResponse.json({ error: "Quote not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Quote deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting quote:", error);
    return NextResponse.json(
      { error: "Failed to delete quote", details: error.message },
      { status: 500 },
    );
  }
}
