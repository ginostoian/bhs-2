import { BOOKING_URL } from "./booking";

const escapeHtml = (value = "") =>
  String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

const projectName = (lead) =>
  lead.projectTypes?.length
    ? lead.projectTypes.join(", ")
    : lead.customProjectType || "home renovation";

const leadLayout = ({
  lead,
  subject,
  paragraphs,
  cta = "Book a discovery call",
}) => {
  const name = escapeHtml(lead.name);
  const body = paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("");
  const html = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>${escapeHtml(subject)}</title></head><body style="font-family:Arial,sans-serif;line-height:1.65;color:#172033;max-width:600px;margin:0 auto;padding:24px"><div style="padding-bottom:16px;border-bottom:1px solid #e5e7eb"><strong style="font-size:20px;color:#16386f">Better Homes</strong></div><main style="padding:20px 0"><p>Hi ${name},</p>${body}<p><a href="${BOOKING_URL}" style="display:inline-block;background:#145de8;color:#fff;padding:12px 18px;border-radius:7px;text-decoration:none;font-weight:600">${cta}</a></p><p>Kind regards,<br>Gino @ Better Homes</p></main></body></html>`;
  const text = `Hi ${lead.name},\n\n${paragraphs.map((p) => p.replace(/<[^>]*>/g, "")).join("\n\n")}\n\n${cta}: ${BOOKING_URL}\n\nKind regards,\nGino @ Better Homes`;
  return { subject, html, text };
};

export const leadIntroEmailTemplate = (lead) => {
  const project = projectName(lead);
  return leadLayout({
    lead,
    subject: `Let’s discuss your ${project}`,
    paragraphs: [
      `Thanks for getting in touch about your ${escapeHtml(project)}. We’d love to understand the scope, your priorities and the finish you have in mind.`,
      "Reply with any plans, photos or videos you already have and we’ll suggest the clearest next step.",
    ],
  });
};

const leadFollowups = [
  {
    subject: (project) => `A recent ${project} project you might like`,
    body: "We recently helped another London homeowner turn an early idea into a clear scope and realistic plan. A short discovery call is usually the quickest way to identify the best route for your project.",
  },
  {
    subject: (project) => `Planning your ${project}`,
    body: "Good renovation planning starts with scope, constraints and the finish you want—not a rushed price. We can talk through those points and show you relevant examples from our portfolio.",
  },
  {
    subject: () => "Questions about price, timing or our guarantee?",
    body: "If price, programme or the disruption of building work is holding you back, tell us. We’ll give you a straightforward answer and explain how our planning, project management and workmanship guarantee reduce the risk.",
  },
  {
    subject: () => "Still thinking about your renovation?",
    body: "Just a quick, human check-in: is this project still on your radar? Reply with a sentence or two and I’ll point you in the right direction.",
  },
  {
    subject: () => "Anything holding the project back?",
    body: "If there’s one concern stopping you from moving forward, reply and let me know. We may be able to remove the uncertainty in a quick call.",
  },
  {
    subject: () => "Should I close your enquiry?",
    body: "I don’t want to keep filling your inbox, so I’ll close this enquiry for now unless you’d still like our help. You can reply or book a time below if the project is active.",
  },
];

export const leadFollowupEmailTemplate = (lead, stepNumber) => {
  const project = projectName(lead);
  const message =
    leadFollowups[
      Math.max(0, Math.min(stepNumber - 2, leadFollowups.length - 1))
    ];
  return leadLayout({
    lead,
    subject: message.subject(project),
    paragraphs: [message.body],
  });
};

const conversationMessages = [
  "It was good to speak. Do you have the remaining details or photos we discussed? Once we have them, we can keep the project moving.",
  "A quick check-in on the next step for your project. If anything is unclear, reply here and I’ll help.",
  "I’ll pause the follow-ups after this. If the project is still moving, book a short call or reply and we’ll pick it back up.",
];

export const conversationNurtureEmailTemplate = (lead, stepNumber) =>
  leadLayout({
    lead,
    subject:
      stepNumber === 3
        ? "Shall we pause this for now?"
        : "Keeping your project moving",
    paragraphs: [conversationMessages[Math.max(0, stepNumber - 1)]],
  });

const proposalMessages = [
  "Did the quote arrive safely? I’m happy to walk you through the scope, allowances and next steps.",
  "If anything in the proposal is unclear, reply with your questions. We want you to understand exactly what is included before making a decision.",
  "If price or timing is the concern, let’s discuss it. There may be sensible ways to phase or adjust the scope without compromising the important parts.",
  "Our process, project management and workmanship guarantee are designed to make a major renovation feel controlled. I can talk you through how that works on a project like yours.",
  "Is this still on your radar? If so, let me know whether you’d like us to hold a potential slot while we resolve any questions.",
  "I’ll close this quote for now unless I hear from you. If you still want to move forward, book a call below and we’ll reopen the conversation.",
];

export const proposalFollowupEmailTemplate = (lead, stepNumber) =>
  leadLayout({
    lead,
    subject:
      stepNumber === 6
        ? `Closing your ${projectName(lead)} quote`
        : `A quick question about your ${projectName(lead)} quote`,
    paragraphs: [proposalMessages[Math.max(0, stepNumber - 1)]],
  });

const coldMessages = [
  "Your project may simply have needed more time. If it’s back on the agenda, we can restart with a short planning call.",
  "We’ve added more recent renovation work to our portfolio. If you’re reconsidering the project, I can share the examples most relevant to your home.",
  "This is our last scheduled check-in. If you want to revisit the project later, reply at any time and the team will be happy to help.",
];

export const coldNurtureEmailTemplate = (lead, stepNumber) =>
  leadLayout({
    lead,
    subject: "Is your renovation back on the agenda?",
    paragraphs: [coldMessages[Math.max(0, stepNumber - 1)]],
  });

const adminLayout = (lead, subject, message) => {
  const project = projectName(lead);
  const detail = `${lead.name} · ${project} · ${lead.phone || "No phone"} · £${Number(lead.estimatedValue || lead.value || 0).toLocaleString("en-GB")}`;
  return {
    subject,
    html: `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#172033"><h2>${escapeHtml(subject)}</h2><p>${escapeHtml(message)}</p><p><strong>${escapeHtml(detail)}</strong></p><p>Open the CRM to complete the next action.</p></div>`,
    text: `${subject}\n\n${message}\n\n${detail}\n\nOpen the CRM to complete the next action.`,
  };
};

export const qualifiedAdminNotificationTemplate = (lead) =>
  adminLayout(
    lead,
    `Quote due for ${lead.name}`,
    "This qualified lead is waiting for a quote. Please prepare or update the proposal.",
  );

export const negotiationsAdminNotificationTemplate = (lead) =>
  adminLayout(
    lead,
    `Response due for ${lead.name}`,
    "This negotiation is waiting on our revised number, answer or next step.",
  );
