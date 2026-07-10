const ONE_DAY = 24 * 60 * 60 * 1000;

const getLondonClock = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat("en-GB", {
    timeZone: "Europe/London",
    weekday: "short",
    hour: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  return Object.fromEntries(parts.map(({ type, value }) => [type, value]));
};

export const isUKBusinessHours = (date = new Date()) => {
  const { weekday, hour } = getLondonClock(date);
  return weekday !== "Sun" && Number(hour) >= 8 && Number(hour) < 18;
};

export const canSendMarketingEmail = (lead, now = new Date()) => {
  if (!lead?.email) return { allowed: false, reason: "missing_email" };
  if (lead.emailSuppressed || lead.unsubscribedAt) {
    return { allowed: false, reason: "suppressed" };
  }
  if (lead.marketingConsent === false) {
    return { allowed: false, reason: "consent_withdrawn" };
  }
  if (["Unsubscribed", "Suppressed"].includes(lead.lifecycleStatus)) {
    return { allowed: false, reason: "suppressed_status" };
  }
  if (
    lead.lastAutomatedEmailAt &&
    now.getTime() - new Date(lead.lastAutomatedEmailAt).getTime() < ONE_DAY
  ) {
    return { allowed: false, reason: "frequency_cap" };
  }
  if (!isUKBusinessHours(now)) {
    return { allowed: false, reason: "outside_business_hours" };
  }
  return { allowed: true };
};

export const addUnsubscribeFooter = (template, unsubscribeUrl) => {
  const footer = `<p style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e7eb;font-size:12px;color:#6b7280">You are receiving this because you enquired about a Better Homes project. <a href="${unsubscribeUrl}" style="color:#4b5563">Unsubscribe from follow-ups</a>.</p>`;
  const html = template.html?.includes("</body>")
    ? template.html.replace("</body>", `${footer}</body>`)
    : `${template.html || ""}${footer}`;
  const text = `${template.text || ""}\n\nUnsubscribe from follow-ups: ${unsubscribeUrl}`;
  return { ...template, html, text };
};
