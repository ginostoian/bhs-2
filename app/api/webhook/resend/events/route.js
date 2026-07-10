import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import LeadTask from "@/models/LeadTask";
import Notification from "@/models/Notification";
import EmailAutomation from "@/models/EmailAutomation";

const getRecipient = (data) => {
  const recipient = data?.email || data?.to;
  return (Array.isArray(recipient) ? recipient[0] : recipient)
    ?.toLowerCase()
    .trim();
};

const addEventActivity = (
  lead,
  title,
  description,
  metadata,
  contactMade = false,
) =>
  lead.addActivity({
    type: "email",
    title,
    description,
    status: "done",
    contactMade,
    createdBy: null,
    metadata: { ...metadata, automated: true },
  });

const suppressLead = async (lead, automation, reason, title) => {
  lead.emailSuppressed = true;
  lead.emailSuppressionReason = reason;
  lead.lifecycleStatus = "Suppressed";
  await lead.save();
  await automation.pause(reason);
  await addEventActivity(lead, title, reason, { emailType: reason });
};

const handleClick = async (lead, automation, url) => {
  automation.clickCount += 1;
  automation.lastClickedAt = new Date();
  automation.lastClickedUrl = url;
  automation.isActive = false;
  automation.pausedAt = new Date();
  automation.pausedReason = url?.includes("cal.com")
    ? "Lead clicked booking link"
    : "Lead clicked primary CTA";
  automation.nextActionDue = null;
  await automation.save();

  await addEventActivity(
    lead,
    url?.includes("cal.com")
      ? "Booking link clicked"
      : "Automated email link clicked",
    `Lead clicked ${url || "a tracked link"}`,
    {
      emailType: "automated_email_clicked",
      stage: automation.currentStage,
      url,
    },
    true,
  );

  const task = await LeadTask.findOneAndUpdate(
    {
      leadId: lead._id,
      title: "Hot lead — reach out after CTA click",
      status: { $ne: "completed" },
    },
    {
      $setOnInsert: {
        leadId: lead._id,
        title: "Hot lead — reach out after CTA click",
        description: `The lead clicked ${url || "an automated email CTA"}. Contact them while intent is high.`,
        status: "pending",
        priority: "urgent",
        dueDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
        assignedTo: lead.assignedTo || undefined,
        createdBy: null,
      },
    },
    { upsert: true, new: true },
  );

  if (lead.assignedTo) {
    await Notification.createNotification({
      recipient: lead.assignedTo,
      recipientType: "admin",
      type: "crm_hot_lead",
      title: `Hot lead: ${lead.name}`,
      message: "The lead clicked the primary email CTA. Follow up now.",
      relatedId: lead._id,
      relatedModel: "Lead",
      priority: "urgent",
      metadata: { leadId: lead._id, taskId: task._id, url },
    });
  }
};

export async function POST(request) {
  try {
    await connectMongo();
    const body = await request.json();
    const { type, data = {} } = body;
    const email = getRecipient(data);
    if (!type || !email)
      return NextResponse.json({ error: "Invalid event" }, { status: 400 });

    const lead = await Lead.findOne({
      email,
      isActive: true,
      isArchived: false,
    });
    if (!lead) return NextResponse.json({ message: "No active lead found" });
    const automation = await EmailAutomation.findOne({ leadId: lead._id });
    if (!automation)
      return NextResponse.json({ message: "No automation found" });

    if (type === "email.opened") {
      automation.openCount += 1;
      automation.lastOpenedAt = new Date();
      await automation.save();
      await addEventActivity(
        lead,
        "Automated email opened",
        "Lead opened an automated email",
        {
          emailType: "automated_email_opened",
          stage: automation.currentStage,
        },
      );
    } else if (type === "email.clicked") {
      await handleClick(lead, automation, data.url);
    } else if (type === "email.bounced") {
      await suppressLead(
        lead,
        automation,
        `Email bounced: ${data.reason || "unknown"}`,
        "Email bounced",
      );
    } else if (type === "email.complained") {
      await suppressLead(
        lead,
        automation,
        "Email complaint",
        "Email marked as spam",
      );
    } else if (type === "email.failed") {
      await addEventActivity(
        lead,
        "Email delivery failed",
        data.reason || "Delivery failed",
        {
          emailType: "email_failed",
          reason: data.reason,
        },
      );
    } else {
      return NextResponse.json({ message: "Event type not handled" });
    }

    return NextResponse.json({ success: true, type, leadId: lead._id });
  } catch (error) {
    console.error("Resend event webhook failed", error);
    return NextResponse.json(
      { error: "Failed to process email event" },
      { status: 500 },
    );
  }
}
