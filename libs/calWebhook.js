import { createHmac, timingSafeEqual, createHash } from "node:crypto";
export function verifyCalSignature(body, signature, secret) {
  if (
    !secret ||
    typeof signature !== "string" ||
    !/^[a-f0-9]{64}$/i.test(signature)
  )
    return false;
  const expected = createHmac("sha256", secret).update(body).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
export function confirmedBooking(event) {
  const payload = event?.payload;
  if (
    event?.triggerEvent !== "BOOKING_CREATED" ||
    payload?.type !== "discovery"
  )
    return null;
  if (
    payload.rescheduleUid ||
    (payload.status && payload.status !== "ACCEPTED")
  )
    return null;
  if (
    typeof payload.uid !== "string" ||
    !payload.uid ||
    payload.uid.length > 200
  )
    return null;
  if (!Number.isFinite(Date.parse(payload.startTime))) return null;
  return {
    _id: createHash("sha256").update(`cal:${payload.uid}`).digest("hex"),
    startTime: new Date(payload.startTime),
  };
}
