import { NextResponse } from "next/server";
import KitchenRenovation from "@/models/KitchenRenovation";

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      address,
      isNewPurchase,
      propertyType,
      flatFloor,
      kitchenSize,
      kitchenSizeSqm,
      knockDownWall,
      rewiring,
      kitchenType,
      additionalRequests,
      source,
      customSource,
      hasDetailedInfo,
    } = body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !phone ||
      !address ||
      !isNewPurchase ||
      !propertyType
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // Create kitchen renovation enquiry
    const kitchenRenovation = new KitchenRenovation({
      name,
      email,
      phone,
      address,
      isNewPurchase,
      propertyType,
      flatFloor: propertyType === "Flat" ? flatFloor : undefined,
      kitchenSize: kitchenSize || kitchenSizeSqm,
      knockDownWall,
      rewiring,
      kitchenType,
      additionalRequests,
      source: customSource || source,
      hasDetailedInfo,
      submittedAt: new Date(),
    });

    await kitchenRenovation.save();

    // Send email notification (you can implement this later)
    // await sendKitchenRenovationNotification(kitchenRenovation);

    return NextResponse.json(
      { message: "Kitchen renovation enquiry submitted successfully" },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting kitchen renovation enquiry:", error);
    return NextResponse.json(
      { error: "Failed to submit enquiry" },
      { status: 500 },
    );
  }
}
