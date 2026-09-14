import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import BookingConfirmation from "@/models/BookingConfirmation";
import { verifyCalSignature, confirmedBooking } from "@/libs/calWebhook";
export const runtime = "nodejs";
export async function POST(request) {
  const secret = process.env.CAL_WEBHOOK_SECRET;
  if (!secret)
    return NextResponse.json(
      { error: "Webhook not configured" },
      { status: 503 },
    );
  const body = await request.text();
  if (
    !verifyCalSignature(
      body,
      request.headers.get("x-cal-signature-256"),
      secret,
    )
  )
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  let event;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const booking = confirmedBooking(event);
  if (!booking) return NextResponse.json({ ignored: true });
  try {
    await connectMongo();
    const email = event.payload.attendees?.[0]?.email;
    const lead =
      typeof email === "string"
        ? await Lead.findOne({ email: email.trim().toLowerCase() }).select(
            "_id",
          )
        : null;
    const result = await BookingConfirmation.updateOne(
      { _id: booking._id },
      { $setOnInsert: { ...booking, leadId: lead?._id || null } },
      { upsert: true },
    );
    // This is a confirmed-booking ledger; never infer a booking from a click.
    return NextResponse.json({
      accepted: true,
      duplicate: !result.upsertedCount,
    });
  } catch (error) {
    if (error.code === 11000)
      return NextResponse.json({ accepted: true, duplicate: true });
    console.error("Booking confirmation persistence failed", error.name);
    return NextResponse.json({ error: "Persistence failed" }, { status: 500 });
  }
}
