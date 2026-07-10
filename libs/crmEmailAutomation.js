import connectMongo from "./mongoose";
import EmailAutomation from "@/models/EmailAutomation";
import Lead from "@/models/Lead";
import { sendEmailWithRetry } from "./emailService";
import {
  coldNurtureEmailTemplate,
  conversationNurtureEmailTemplate,
  leadFollowupEmailTemplate,
  leadIntroEmailTemplate,
  negotiationsAdminNotificationTemplate,
  proposalFollowupEmailTemplate,
  qualifiedAdminNotificationTemplate,
} from "./crmEmailTemplates";
import { CRM_SEQUENCES } from "./crmSequences";
import { normalizeCRMStage } from "./crmStages";
import { addUnsubscribeFooter, canSendMarketingEmail } from "./crmEmailPolicy";
import { getUnsubscribeUrl } from "./crmUnsubscribe";
import config from "@/config";

const POSTPONE_MS = 60 * 60 * 1000;

const ensureModernAutomation = async (automation, stage) => {
  if (automation.sequenceKey || automation.nextActionDue) return automation;
  automation.configureForStage(stage || automation.currentStage, new Date());
  await automation.save();
  return automation;
};

export const initializeEmailAutomation = async (
  leadId,
  stage = "New Enquiry",
) => {
  await connectMongo();
  const normalizedStage = normalizeCRMStage(stage);
  const existing = await EmailAutomation.findOne({ leadId });
  if (existing) return ensureModernAutomation(existing, normalizedStage);

  const automation = new EmailAutomation({
    leadId,
    currentStage: normalizedStage,
  });
  automation.configureForStage(normalizedStage, new Date());
  await automation.save();
  return automation;
};

export const resumeEmailAutomation = async (leadId) => {
  await connectMongo();
  const automation = await EmailAutomation.findOne({ leadId });
  if (!automation) throw new Error("Email automation not found");
  automation.leadReplied = false;
  return automation.resume();
};

export const updateEmailAutomationStage = async (leadId, newStage) => {
  await connectMongo();
  let automation = await EmailAutomation.findOne({ leadId });
  if (!automation) return initializeEmailAutomation(leadId, newStage);
  return automation.updateStage(normalizeCRMStage(newStage));
};

export const pauseEmailAutomation = async (leadId, reason) => {
  await connectMongo();
  const automation = await EmailAutomation.findOne({ leadId });
  return automation ? automation.pause(reason) : null;
};

export const skipEmailAutomationStep = async (leadId) => {
  await connectMongo();
  const automation = await EmailAutomation.findOne({ leadId });
  if (!automation?.sequenceKey) throw new Error("No active sequence to skip");
  const { getSequenceDueDate, isSequenceComplete } = await import(
    "./crmSequences"
  );
  automation.sequenceStep += 1;
  automation.nextActionDue = getSequenceDueDate(
    automation.sequenceKey,
    automation.sequenceEnteredAt,
    automation.sequenceStep,
  );
  if (isSequenceComplete(automation.sequenceKey, automation.sequenceStep)) {
    automation.sequenceCompletedAt = new Date();
    automation.nextActionDue = null;
    automation.isActive = false;
    automation.pausedReason = "Sequence exhausted after skipped step";
  }
  automation.lastActivity = new Date();
  await automation.save();
  return automation;
};

const templateForStep = (sequenceKey, lead, stepNumber) => {
  switch (sequenceKey) {
    case "new_enquiry":
      return stepNumber === 1
        ? leadIntroEmailTemplate(lead)
        : leadFollowupEmailTemplate(lead, stepNumber);
    case "in_conversation":
      return conversationNurtureEmailTemplate(lead, stepNumber);
    case "proposal_sent":
      return proposalFollowupEmailTemplate(lead, stepNumber);
    case "cold":
      return coldNurtureEmailTemplate(lead, stepNumber);
    case "qualified_admin":
      return qualifiedAdminNotificationTemplate(lead, lead.assignedTo);
    case "negotiation_admin":
      return negotiationsAdminNotificationTemplate(lead, lead.assignedTo);
    default:
      throw new Error(`Unknown CRM sequence: ${sequenceKey}`);
  }
};

export const getEmailSequencePreview = (automation) => {
  const sequence = CRM_SEQUENCES[automation?.sequenceKey];
  const lead = automation?.leadId;
  if (!sequence || !lead) return [];

  const enteredAt = automation.sequenceEnteredAt
    ? new Date(automation.sequenceEnteredAt).getTime()
    : 0;
  const attemptsByStep = new Map();
  for (const email of automation.emailHistory || []) {
    const sentAt = email.sentAt ? new Date(email.sentAt).getTime() : 0;
    if (
      email.sequenceKey !== automation.sequenceKey ||
      sentAt < enteredAt ||
      !email.sequenceStep
    ) {
      continue;
    }
    const attempts = attemptsByStep.get(email.sequenceStep) || [];
    attempts.push(email);
    attemptsByStep.set(email.sequenceStep, attempts);
  }

  return sequence.dayOffsets.map((dayOffset, index) => {
    const stepNumber = index + 1;
    const attempts = attemptsByStep.get(stepNumber) || [];
    const successfulAttempt = attempts.find((attempt) => attempt.success);
    const failedAttempt = [...attempts]
      .reverse()
      .find((attempt) => !attempt.success);
    let status = "upcoming";
    if (successfulAttempt) status = "sent";
    else if (stepNumber <= automation.sequenceStep) status = "skipped";
    else if (stepNumber === automation.sequenceStep + 1 && failedAttempt)
      status = "failed";
    else if (stepNumber === automation.sequenceStep + 1 && automation.isActive)
      status = "next";

    let template = templateForStep(automation.sequenceKey, lead, stepNumber);
    if (sequence.recipient === "lead") {
      template = addUnsubscribeFooter(template, getUnsubscribeUrl(lead));
    }

    return {
      stepNumber,
      dayOffset,
      status,
      recipient: sequence.recipient,
      subject: template.subject,
      text: template.text,
      sentAt: successfulAttempt?.sentAt || null,
      lastError: failedAttempt?.error || null,
    };
  });
};

const addEmailActivity = async (
  lead,
  automation,
  template,
  result,
  recipient,
) => {
  await lead.addActivity({
    type: "email",
    title:
      CRM_SEQUENCES[automation.sequenceKey]?.recipient === "admin"
        ? `Admin reminder: ${template.subject}`
        : `Automated email: ${template.subject}`,
    description: result.success
      ? `Sent to ${recipient}`
      : `Delivery failed: ${result.error || "Unknown error"}`,
    status: "done",
    contactMade: false,
    createdBy: null,
    metadata: {
      automated: true,
      sequenceKey: automation.sequenceKey,
      sequenceStep: automation.sequenceStep,
      success: result.success,
      providerMessageId: result.id || result.data?.id,
    },
  });
};

const completeSequence = async (automation, lead) => {
  if (!automation.isSequenceExhausted()) return;

  if (["new_enquiry", "in_conversation"].includes(automation.sequenceKey)) {
    lead.lifecycleStatus = "Cold";
    await lead.save();
    await automation.switchToColdSequence();
    return;
  }

  if (automation.sequenceKey === "proposal_sent") {
    const oldStage = lead.stage;
    lead.stage = "Lost";
    lead.probability = 0;
    lead.winLossReason = "no_decision";
    lead.winLossDate = new Date();
    lead.versionHistory.push({
      field: "stage",
      oldValue: oldStage,
      newValue: "Lost",
      changedBy: null,
      comment: "Proposal follow-up sequence exhausted",
    });
    await lead.save();
    automation.configureForStage("Lost", new Date());
    await automation.save();
    return;
  }

  if (automation.sequenceKey === "cold") {
    await automation.pause("Cold nurture sequence exhausted");
    return;
  }

  if (
    ["qualified_admin", "negotiation_admin"].includes(automation.sequenceKey)
  ) {
    await automation.pause(
      "Admin reminder cap reached; escalated to morning brief",
    );
  }
};

const processAutomation = async (automation) => {
  const lead = automation.leadId;
  if (!lead || lead.isArchived || !lead.isActive || lead.agingPaused) {
    return { skipped: true, reason: "inactive_or_paused" };
  }

  if (["Won", "Lost"].includes(normalizeCRMStage(lead.stage))) {
    await automation.pause(`Lead is ${lead.stage}`);
    return { skipped: true, reason: "closed" };
  }

  const sequence = CRM_SEQUENCES[automation.sequenceKey];
  if (!sequence) {
    await automation.pause("Unknown or missing sequence");
    return { skipped: true, reason: "missing_sequence" };
  }

  if (sequence.recipient === "lead") {
    const policy = canSendMarketingEmail(lead);
    if (!policy.allowed) {
      if (
        ["suppressed", "suppressed_status", "consent_withdrawn"].includes(
          policy.reason,
        )
      ) {
        await automation.pause(`Send blocked: ${policy.reason}`);
      } else {
        automation.nextActionDue = new Date(Date.now() + POSTPONE_MS);
        await automation.save();
      }
      return { skipped: true, reason: policy.reason };
    }
  }

  const recipient =
    sequence.recipient === "admin" ? lead.assignedTo?.email : lead.email;
  if (!recipient) {
    automation.nextActionDue = new Date(Date.now() + 24 * POSTPONE_MS);
    await automation.save();
    return { skipped: true, reason: "missing_recipient" };
  }

  const stepNumber = automation.sequenceStep + 1;
  let template = templateForStep(automation.sequenceKey, lead, stepNumber);
  const headers = {};
  if (sequence.recipient === "lead") {
    const unsubscribeUrl = getUnsubscribeUrl(lead);
    template = addUnsubscribeFooter(template, unsubscribeUrl);
    headers["List-Unsubscribe"] = `<${unsubscribeUrl}>`;
    headers["List-Unsubscribe-Post"] = "List-Unsubscribe=One-Click";
  }

  const result = await sendEmailWithRetry({
    to: recipient,
    subject: template.subject,
    html: template.html,
    text: template.text,
    bcc: config.resend.crmBcc || undefined,
    headers: Object.keys(headers).length ? headers : undefined,
    tags: [
      { name: "crm_sequence", value: automation.sequenceKey },
      { name: "crm_step", value: String(stepNumber) },
    ],
    metadata: {
      type: sequence.emailType,
      leadId: String(lead._id),
      automationId: String(automation._id),
      stage: automation.currentStage,
      sequenceKey: automation.sequenceKey,
      sequenceStep: stepNumber,
    },
  });

  await automation.recordEmailSent(
    sequence.emailType,
    template.subject,
    recipient,
    result.success,
    result.error,
    { emailResult: result, stepNumber },
  );
  await addEmailActivity(lead, automation, template, result, recipient);

  if (result.success && sequence.recipient === "lead") {
    lead.lastAutomatedEmailAt = new Date();
    await lead.save();
  }

  if (result.success) await completeSequence(automation, lead);
  return {
    success: result.success,
    recipient,
    sequenceKey: automation.sequenceKey,
    stepNumber,
  };
};

export const processDueEmails = async () => {
  await connectMongo();
  const automations = await EmailAutomation.findDueEmails();
  const results = [];

  for (const automation of automations) {
    try {
      results.push({
        leadId: automation.leadId?._id,
        leadName: automation.leadId?.name,
        ...(await processAutomation(automation)),
      });
    } catch (error) {
      console.error("CRM automation failed", {
        automationId: automation._id,
        leadId: automation.leadId?._id,
        error: error.message,
      });
      results.push({ leadId: automation.leadId?._id, error: error.message });
    }
  }

  return {
    processed: results.filter((result) => !result.skipped).length,
    results,
  };
};

export const handleLeadReply = async (
  leadId,
  fromEmail,
  subject,
  content,
  providedAutomation,
) => {
  await connectMongo();
  const [lead, automation] = await Promise.all([
    Lead.findById(leadId),
    providedAutomation || EmailAutomation.findOne({ leadId }),
  ]);
  if (!lead || !automation)
    return { success: false, error: "Lead or automation not found" };

  automation.leadReplied = true;
  automation.lastReplyDate = new Date();
  automation.replySubject = subject;
  automation.replyContent = content;
  automation.isActive = false;
  automation.pausedAt = new Date();
  automation.pausedReason = "Lead replied to automated email";
  automation.nextActionDue = null;
  await automation.save();

  if (normalizeCRMStage(lead.stage) === "New Enquiry") {
    const oldStage = lead.stage;
    lead.stage = "In Conversation";
    lead.probability = 0.25;
    lead.versionHistory.push({
      field: "stage",
      oldValue: oldStage,
      newValue: "In Conversation",
      changedBy: null,
      comment: "Lead replied to automated email",
    });
  }
  lead.lifecycleStatus = "Active";
  await lead.addActivity({
    type: "email",
    title: "Lead replied",
    description: `Subject: ${subject}\n\n${String(content || "").slice(0, 1000)}`,
    status: "done",
    contactMade: true,
    createdBy: null,
    metadata: { emailType: "lead_reply", fromEmail, automated: true },
  });

  return {
    success: true,
    leadId: lead._id,
    automationPaused: true,
    agingReset: true,
  };
};

export const getEmailAutomationStats = async () => {
  await connectMongo();
  const [totalAutomations, activeAutomations, stageStats, emailStats] =
    await Promise.all([
      EmailAutomation.countDocuments(),
      EmailAutomation.countDocuments({ isActive: true }),
      EmailAutomation.aggregate([
        {
          $group: {
            _id: "$currentStage",
            count: { $sum: 1 },
            active: { $sum: { $cond: ["$isActive", 1, 0] } },
          },
        },
      ]),
      EmailAutomation.aggregate([
        { $unwind: "$emailHistory" },
        {
          $group: {
            _id: "$emailHistory.emailType",
            count: { $sum: 1 },
            success: { $sum: { $cond: ["$emailHistory.success", 1, 0] } },
          },
        },
      ]),
    ]);
  return {
    totalAutomations,
    activeAutomations,
    pausedAutomations: totalAutomations - activeAutomations,
    stageStats,
    emailStats,
  };
};

export const getLeadAutomationDetails = async (leadId) => {
  await connectMongo();
  return EmailAutomation.findOne({ leadId }).populate("leadId");
};
