export const CRM_STAGES = [
  "New Enquiry",
  "In Conversation",
  "Qualified — Awaiting Quote",
  "Proposal Sent",
  "Negotiation — Awaiting Us",
  "Won",
  "Lost",
];

export const LEGACY_STAGE_MAP = {
  Lead: "New Enquiry",
  "Never replied": "New Enquiry",
  Qualified: "Qualified — Awaiting Quote",
  Negotiations: "Negotiation — Awaiting Us",
};

export const CRM_STAGE_CONFIG = {
  "New Enquiry": {
    order: 1,
    shortLabel: "New Enquiry",
    emailMode: "lead",
    sequenceKey: "new_enquiry",
    probability: 0.1,
    slaDays: 1,
    dotClass: "bg-slate-700",
    surfaceClass: "bg-slate-50 border-slate-200",
    accentClass: "text-slate-700",
  },
  "In Conversation": {
    order: 2,
    shortLabel: "In Conversation",
    emailMode: "lead",
    sequenceKey: "in_conversation",
    probability: 0.25,
    slaDays: 3,
    dotClass: "bg-cyan-600",
    surfaceClass: "bg-cyan-50 border-cyan-200",
    accentClass: "text-cyan-800",
  },
  "Qualified — Awaiting Quote": {
    order: 3,
    shortLabel: "Awaiting Quote",
    emailMode: "admin",
    sequenceKey: "qualified_admin",
    probability: 0.4,
    slaDays: 2,
    dotClass: "bg-violet-600",
    surfaceClass: "bg-violet-50 border-violet-200",
    accentClass: "text-violet-800",
  },
  "Proposal Sent": {
    order: 4,
    shortLabel: "Proposal Sent",
    emailMode: "lead",
    sequenceKey: "proposal_sent",
    probability: 0.6,
    slaDays: 5,
    dotClass: "bg-blue-600",
    surfaceClass: "bg-blue-50 border-blue-200",
    accentClass: "text-blue-800",
  },
  "Negotiation — Awaiting Us": {
    order: 5,
    shortLabel: "Awaiting Us",
    emailMode: "admin",
    sequenceKey: "negotiation_admin",
    probability: 0.8,
    slaDays: 2,
    dotClass: "bg-amber-600",
    surfaceClass: "bg-amber-50 border-amber-200",
    accentClass: "text-amber-800",
  },
  Won: {
    order: 6,
    shortLabel: "Won",
    emailMode: "none",
    sequenceKey: null,
    probability: 1,
    slaDays: null,
    dotClass: "bg-emerald-600",
    surfaceClass: "bg-emerald-50 border-emerald-200",
    accentClass: "text-emerald-800",
  },
  Lost: {
    order: 7,
    shortLabel: "Lost",
    emailMode: "none",
    sequenceKey: null,
    probability: 0,
    slaDays: null,
    dotClass: "bg-rose-600",
    surfaceClass: "bg-rose-50 border-rose-200",
    accentClass: "text-rose-800",
  },
};

export const normalizeCRMStage = (stage) => LEGACY_STAGE_MAP[stage] || stage;

export const isCRMStage = (stage) =>
  CRM_STAGES.includes(normalizeCRMStage(stage));

export const getCRMStageConfig = (stage) =>
  CRM_STAGE_CONFIG[normalizeCRMStage(stage)] || CRM_STAGE_CONFIG["New Enquiry"];

export const getStageProbability = (stage) =>
  getCRMStageConfig(stage).probability;
