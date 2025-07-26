import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";
import EmailAutomation from "@/models/EmailAutomation";
import { handleLeadReply } from "@/libs/crmEmailAutomation";

/**
 * Resend Inbound Email Webhook
 * Handles incoming emails and detects when leads reply to automated emails
 */
export async function POST(req) {
  try {
    console.log("📧 Inbound email webhook received");

    // Connect to MongoDB
    await connectMongoose();

    // Parse the webhook payload
    const body = await req.json();
    console.log("📧 Webhook payload:", JSON.stringify(body, null, 2));

    // Extract email details from Resend webhook
    const { from, to, subject, text, html, headers, attachments, created_at } =
      body;

    // Validate required fields
    if (!from || !to || !subject) {
      console.log("❌ Missing required email fields");
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    console.log(
      `📧 Processing email from: ${from} to: ${to} subject: ${subject}`,
    );

    // Check if this is a reply to one of our automated emails
    // Look for leads with this email address
    const lead = await Lead.findOne({
      email: from.toLowerCase().trim(),
      isActive: true,
      isArchived: false,
    });

    if (!lead) {
      console.log(`❌ No active lead found for email: ${from}`);
      return NextResponse.json({ message: "No active lead found" });
    }

    console.log(`✅ Found lead: ${lead.name} (${lead.email})`);

    // Check if this lead has an active email automation
    const automation = await EmailAutomation.findOne({
      leadId: lead._id,
      isActive: true,
    });

    if (!automation) {
      console.log(`❌ No active email automation found for lead: ${lead.name}`);
      return NextResponse.json({ message: "No active automation found" });
    }

    console.log(`✅ Found active automation for lead: ${lead.name}`);

    // Handle the lead reply
    const result = await handleLeadReply(
      lead._id,
      from,
      subject,
      text || html,
      automation,
    );

    console.log(`✅ Lead reply processed:`, result);

    return NextResponse.json({
      success: true,
      message: "Lead reply processed successfully",
      leadId: lead._id,
      leadName: lead.name,
      result,
    });
  } catch (error) {
    console.error("❌ Error processing inbound email webhook:", error);
    return NextResponse.json(
      { error: "Failed to process inbound email" },
      { status: 500 },
    );
  }
}
