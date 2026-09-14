import { safeMarketingPath } from "./marketingAttribution.js";
// GTM owns delivery of these custom events. Do not also dispatch them to Plausible.
const emitted = new Set();
export function hasAnalyticsConsent() {
  try {
    return localStorage.getItem("cookie-consent") === "accepted";
  } catch {
    return false;
  }
}
export function trackEnquiryEvent(event, eventId, details = {}) {
  if (!hasAnalyticsConsent()) return false;
  if (
    ![
      "enquiry_start",
      "enquiry_submit_success",
      "enquiry_error",
      "booking_click",
      "phone_click",
    ].includes(event)
  )
    return false;
  const key = `${event}:${eventId}`;
  if (event !== "enquiry_error") {
    if (emitted.has(key)) return false;
    try {
      if (sessionStorage.getItem(key)) return false;
      sessionStorage.setItem(key, "1");
    } catch {}
    emitted.add(key);
  }
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    event_id: eventId,
    event_owner: "bhs-site-v1",
    ...(event.startsWith("enquiry_") ? { form_id: "project-enquiry" } : {}),
    ...(safeMarketingPath(details.page_path)
      ? { page_path: details.page_path }
      : {}),
  });
  return true;
}
