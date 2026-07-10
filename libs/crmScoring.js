import { normalizeCRMStage } from "./crmStages";

const SOURCE_POINTS = {
  Recommendation: 24,
  Referral: 22,
  Google: 18,
  "Google Ads": 14,
  Houzz: 13,
  MyBuilder: 11,
  "Meta Ads": 9,
  Other: 8,
};
const BUDGET_POINTS = { "£": 5, "££": 12, "£££": 19, "££££": 25 };
const STAGE_POINTS = {
  "New Enquiry": 5,
  "In Conversation": 18,
  "Qualified — Awaiting Quote": 25,
  "Proposal Sent": 28,
  "Negotiation — Awaiting Us": 30,
  Won: 35,
  Lost: 0,
};

export const calculateLeadScore = (lead, automation) => {
  if (normalizeCRMStage(lead.stage) === "Lost") return 0;
  const engagement = Math.min(
    22,
    (automation?.openCount || 0) * 2 +
      (automation?.clickCount || 0) * 8 +
      (automation?.leadReplied ? 12 : 0),
  );
  const completeness =
    [
      lead.phone,
      lead.address,
      lead.projectTypes?.length,
      lead.estimatedValue || lead.value,
    ].filter(Boolean).length * 2;
  return Math.min(
    100,
    (SOURCE_POINTS[lead.source] || 6) +
      (BUDGET_POINTS[lead.budget] || 5) +
      (STAGE_POINTS[normalizeCRMStage(lead.stage)] || 0) +
      engagement +
      completeness,
  );
};
