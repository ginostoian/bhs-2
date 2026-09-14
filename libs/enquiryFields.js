export const enquiryServices = [
  "Extension",
  "Loft conversion",
  "Whole-home renovation",
  "Kitchen renovation",
  "Bathroom renovation",
  "Basement conversion",
  "Not sure yet",
];
export const enquiryStages = [
  "Not sure yet",
  "Early idea",
  "Buying or just bought",
  "Drawings in progress",
  "Drawings and approvals in place",
];
export const enquiryBudgets = [
  "Not sure yet",
  "Under £25,000",
  "£25,000 to £75,000",
  "£75,000 to £150,000",
  "£150,000 to £300,000",
  "Over £300,000",
];
export function sanitizeQualification(value) {
  if (!value || typeof value !== "object") return undefined;
  return {
    service: enquiryServices.includes(value.service)
      ? value.service
      : "Not sure yet",
    stage: enquiryStages.includes(value.stage) ? value.stage : "Not sure yet",
    budget: enquiryBudgets.includes(value.budget)
      ? value.budget
      : "Not sure yet",
  };
}
