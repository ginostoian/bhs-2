import { normalizeCRMStage } from "./crmStages.js";
export function buildOrganicReport(contacts, leads, bookings) {
  const groups = new Map();
  const leadMap = new Map(leads.map((lead) => [String(lead._id), lead]));
  const credited = new Set();
  let unknownEnquiries = 0,
    organicEnquiries = 0;
  for (const contact of contacts) {
    const attribution = contact.attribution;
    if (!attribution || ["unknown", "none"].includes(attribution.medium))
      unknownEnquiries++;
    if (attribution?.medium !== "organic") continue;
    organicEnquiries++;
    const path = attribution.firstLandingPath;
    if (!groups.has(path))
      groups.set(path, {
        path,
        enquiries: 0,
        leads: 0,
        qualifiedLeads: 0,
        quotes: 0,
        wonProjects: 0,
        wonValue: 0,
        confirmedBookings: 0,
      });
    const row = groups.get(path);
    row.enquiries++;
    const id = String(contact.leadId || "");
    const lead = leadMap.get(id);
    // Returning enquiries cannot reassign an existing lead's first acquisition.
    if (
      !lead ||
      credited.has(id) ||
      lead.attribution?.medium !== "organic" ||
      lead.attribution?.firstLandingPath !== path
    )
      continue;
    credited.add(id);
    row.leads++;
    const stages = new Set(
      [
        lead.stage,
        ...(lead.versionHistory || [])
          .filter((x) => x.field === "stage")
          .map((x) => x.newValue),
      ].map(normalizeCRMStage),
    );
    const quoted = ["Proposal Sent", "Negotiation — Awaiting Us", "Won"].some(
      (x) => stages.has(x),
    );
    if (quoted || stages.has("Qualified — Awaiting Quote"))
      row.qualifiedLeads++;
    if (quoted) row.quotes++;
    if (normalizeCRMStage(lead.stage) === "Won") {
      row.wonProjects++;
      row.wonValue += Number(lead.value || lead.estimatedValue || 0);
    }
    row.confirmedBookings += bookings.filter(
      (x) => String(x.leadId) === id,
    ).length;
  }
  return {
    acceptedEnquiries: contacts.length,
    organicEnquiries,
    directOrUnknownEnquiries: unknownEnquiries,
    organicLandingSessions: null,
    qualifiedEnquiryRate: null,
    confirmedBookings: bookings.length,
    rows: [...groups.values()],
    basis:
      "Enquiry-created cohort; CRM outcomes at report time. Won value is recorded pipeline value, not realised revenue. Sessions and conversion rate are unavailable until analytics is connected. Returning enquiries do not reassign a lead's acquisition.",
  };
}
