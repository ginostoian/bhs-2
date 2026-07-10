import { getCRMStageConfig, normalizeCRMStage } from "./crmStages";

const DAY = 24 * 60 * 60 * 1000;

export const CRM_SEQUENCES = {
  new_enquiry: {
    recipient: "lead",
    dayOffsets: [0, 1, 3, 6, 10, 16, 24],
    emailType: "lead_nurture",
  },
  in_conversation: {
    recipient: "lead",
    dayOffsets: [2, 5, 10],
    emailType: "conversation_nurture",
  },
  proposal_sent: {
    recipient: "lead",
    dayOffsets: [1, 3, 7, 12, 18, 28],
    emailType: "proposal_followup",
  },
  cold: {
    recipient: "lead",
    dayOffsets: [30, 60, 90],
    emailType: "cold_nurture",
  },
  qualified_admin: {
    recipient: "admin",
    dayOffsets: [0, 2, 4],
    emailType: "qualified_admin_notification",
  },
  negotiation_admin: {
    recipient: "admin",
    dayOffsets: [0, 2, 4],
    emailType: "negotiation_admin_notification",
  },
};

export const getSequenceForStage = (stage) => {
  const key = getCRMStageConfig(normalizeCRMStage(stage)).sequenceKey;
  return key ? { key, ...CRM_SEQUENCES[key] } : null;
};

export const getSequenceDueDate = (sequenceKey, enteredAt, step = 0) => {
  const sequence = CRM_SEQUENCES[sequenceKey];
  const offset = sequence?.dayOffsets?.[step];
  if (offset === undefined) return null;
  return new Date(new Date(enteredAt).getTime() + offset * DAY);
};

export const isSequenceComplete = (sequenceKey, step) =>
  step >= (CRM_SEQUENCES[sequenceKey]?.dayOffsets.length || 0);

export const getSequenceStepCount = (sequenceKey) =>
  CRM_SEQUENCES[sequenceKey]?.dayOffsets.length || 0;
