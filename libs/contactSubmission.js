import { createHash, randomUUID } from "node:crypto";

export const validEventId = (value) =>
  typeof value === "string" &&
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
    value,
  );
export function submissionIdentity(data, suppliedId) {
  if (suppliedId !== undefined && !validEventId(suppliedId)) {
    const error = new Error("Invalid submission ID");
    error.status = 400;
    throw error;
  }
  const submissionEventId = (suppliedId || randomUUID()).toLowerCase();
  const { ipAddress, userAgent, attribution, ...content } = data;
  return {
    // Use Mongo's always-present unique _id index; no optional index migration is needed.
    _id: createHash("sha256")
      .update(`contact:${submissionEventId}`)
      .digest("hex")
      .slice(0, 24),
    submissionEventId,
    submissionFingerprint: createHash("sha256")
      .update(JSON.stringify(content))
      .digest("hex"),
  };
}
export async function persistContact(Model, data, suppliedId) {
  const identity = submissionIdentity(data, suppliedId);
  try {
    return {
      contact: await Model.create({ ...data, ...identity }),
      duplicate: false,
    };
  } catch (error) {
    if (error.code !== 11000) throw error;
    const contact = await Model.findById(identity._id).select(
      "+submissionFingerprint",
    );
    if (
      !contact ||
      contact.submissionFingerprint !== identity.submissionFingerprint
    ) {
      const conflict = new Error(
        "This submission ID has already been used. Reload the form to send a different enquiry.",
      );
      conflict.status = 409;
      throw conflict;
    }
    return { contact, duplicate: true };
  }
}
export const acceptedSubmission = (contact) => ({
  success: true,
  accepted: true,
  eventId: contact.submissionEventId,
  contactId: contact._id.toString(),
  message: "Contact form submitted successfully",
});
