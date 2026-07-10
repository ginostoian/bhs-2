import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";
import EmailAutomation from "@/models/EmailAutomation";
import { handleLeadReply } from "@/libs/crmEmailAutomation";

const extractEmail = (value) => {
  const raw = Array.isArray(value) ? value[0] : value;
  const match = String(raw || "").match(/<?([^<>\s]+@[^<>\s]+)>?/);
  return (match?.[1] || "").toLowerCase().trim();
};

const withoutAlias = (email) => {
  const [local, domain] = email.split("@");
  return domain ? `${local.split("+")[0]}@${domain}` : email;
};

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
    const fromEmail = extractEmail(from);
    const candidates = [...new Set([fromEmail, withoutAlias(fromEmail)])];
    let lead = await Lead.findOne({
      email: { $in: candidates },
      isActive: true,
      isArchived: false,
    });

    // Replies from a secondary address can still be matched to a Resend
    // Message-ID stored on the originating automation.
    if (!lead) {
      const inReplyTo = headers?.["in-reply-to"] || headers?.["In-Reply-To"];
      if (inReplyTo) {
        const threadedAutomation = await EmailAutomation.findOne({
          "emailHistory.providerMessageId": String(inReplyTo).replace(
            /[<>]/g,
            "",
          ),
        });
        if (threadedAutomation)
          lead = await Lead.findById(threadedAutomation.leadId);
      }
    }

    if (!lead) {
      console.log(`❌ No active lead found for email: ${from}`);
      return NextResponse.json({ message: "No active lead found" });
    }

    console.log(`✅ Found lead: ${lead.name} (${lead.email})`);

    // Check if this lead has an active email automation
    const automation = await EmailAutomation.findOne({ leadId: lead._id });

    if (!automation) {
      console.log(`❌ No active email automation found for lead: ${lead.name}`);
      return NextResponse.json({ message: "No active automation found" });
    }

    console.log(`✅ Found active automation for lead: ${lead.name}`);

    // Handle the lead reply
    const result = await handleLeadReply(
      lead._id,
      fromEmail,
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
