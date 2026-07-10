import User from "@/models/User";
import {
  crmHistoryFieldValuesEqual,
  describeCRMHistoryChange,
  extractHistoryReferenceId,
} from "@/libs/crmHistory";

export const enrichCRMHistory = async (history = []) => {
  const entries = history
    .map((entry) =>
      typeof entry?.toObject === "function" ? entry.toObject() : entry,
    )
    .filter(
      (entry) =>
        entry &&
        !crmHistoryFieldValuesEqual(
          entry.field,
          entry.oldValue,
          entry.newValue,
        ),
    );
  const ownerIds = [
    ...new Set(
      entries
        .filter((entry) => entry.field === "assignedTo")
        .flatMap((entry) => [entry.oldValue, entry.newValue])
        .map(extractHistoryReferenceId)
        .filter(Boolean),
    ),
  ];
  const owners = ownerIds.length
    ? await User.find({ _id: { $in: ownerIds } })
        .select("name email")
        .lean()
    : [];
  const userNames = Object.fromEntries(
    owners.map((owner) => [String(owner._id), owner.name || owner.email]),
  );

  return entries.map((entry) => ({
    ...entry,
    ...describeCRMHistoryChange(entry, userNames),
  }));
};
