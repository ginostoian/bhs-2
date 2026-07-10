import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import { verifyUnsubscribeToken } from "@/libs/crmUnsubscribe";
import Lead from "@/models/Lead";
import EmailAutomation from "@/models/EmailAutomation";

const renderPage = (title, message, status = 200) =>
  new NextResponse(
    `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${title}</title></head><body style="font-family:Arial,sans-serif;max-width:560px;margin:80px auto;padding:24px;color:#172033"><h1>${title}</h1><p>${message}</p></body></html>`,
    { status, headers: { "content-type": "text/html; charset=utf-8" } },
  );

const unsubscribe = async (request) => {
  await connectMongo();
  const { searchParams } = new URL(request.url);
  const leadId = searchParams.get("lead");
  const token = searchParams.get("token");
  if (!leadId || !token)
    return renderPage(
      "Invalid link",
      "This unsubscribe link is incomplete.",
      400,
    );

  const lead = await Lead.findById(leadId);
  if (!lead || !verifyUnsubscribeToken(leadId, lead.email, token)) {
    return renderPage(
      "Invalid link",
      "This unsubscribe link is invalid or has expired.",
      400,
    );
  }

  lead.unsubscribedAt = lead.unsubscribedAt || new Date();
  lead.emailSuppressed = true;
  lead.emailSuppressionReason = "unsubscribe";
  lead.lifecycleStatus = "Unsubscribed";
  lead.marketingConsent = false;
  await lead.save();
  await EmailAutomation.findOneAndUpdate(
    { leadId: lead._id },
    {
      $set: {
        isActive: false,
        pausedAt: new Date(),
        pausedReason: "Lead unsubscribed",
        nextActionDue: null,
      },
    },
  );

  return renderPage(
    "You’re unsubscribed",
    "You will no longer receive automated Better Homes follow-up emails.",
  );
};

export const GET = unsubscribe;
export const POST = unsubscribe;
