import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";

export async function POST(request) {
  try {
    const { email, formData, calculationResult } = await request.json();

    // Validate email
    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 },
      );
    }

    // Connect to database
    await connectMongo();

    // Create lead data
    const leadData = {
      email,
      source: "extension-calculator",
      projectType: "extension",
      projectDetails: {
        propertyType: formData.propertyType,
        location: formData.location,
        extensionType: formData.extensionType,
        size: formData.size,
        complexity: formData.complexity,
        additionalFeatures: formData.additionalFeatures || [],
        planningServices: formData.planningServices || [],
      },
      costEstimate: {
        total: calculationResult.total,
        costPerSqm: calculationResult.costPerSqm,
        breakdown: calculationResult.breakdown,
      },
      status: "new",
    };

    // Check if lead already exists
    const existingLead = await Lead.findOne({
      email,
      source: "extension-calculator",
    });

    if (existingLead) {
      // Update existing lead with new calculation
      existingLead.projectDetails = leadData.projectDetails;
      existingLead.costEstimate = leadData.costEstimate;
      existingLead.updatedAt = new Date();
      await existingLead.save();
    } else {
      // Create new lead
      await Lead.create(leadData);
    }

    return NextResponse.json(
      { success: true, message: "Lead captured successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error capturing lead:", error);
    return NextResponse.json(
      { error: "Failed to capture lead", details: error.message },
      { status: 500 },
    );
  }
}
