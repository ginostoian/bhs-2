import crypto from "crypto";

const getSecret = () => {
  const secret =
    process.env.UNSUBSCRIBE_SECRET ||
    process.env.CRON_SECRET ||
    process.env.NEXTAUTH_SECRET;
  if (!secret) throw new Error("UNSUBSCRIBE_SECRET is required for CRM emails");
  return secret;
};

export const createUnsubscribeToken = (leadId, email) =>
  crypto
    .createHmac("sha256", getSecret())
    .update(`${leadId}:${String(email).trim().toLowerCase()}`)
    .digest("hex");

export const verifyUnsubscribeToken = (leadId, email, token) => {
  if (!token) return false;
  const expected = createUnsubscribeToken(leadId, email);
  const suppliedBuffer = Buffer.from(String(token));
  const expectedBuffer = Buffer.from(expected);
  return (
    suppliedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(suppliedBuffer, expectedBuffer)
  );
};

export const getUnsubscribeUrl = (lead) => {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "https://bhstudio.co.uk";
  const leadId = String(lead.id || lead._id);
  const token = createUnsubscribeToken(leadId, lead.email);
  return `${baseUrl.replace(/\/$/, "")}/api/crm/unsubscribe?lead=${encodeURIComponent(leadId)}&token=${token}`;
};
