import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import Contact from "@/models/Contact";
import Lead from "@/models/Lead";
import BookingConfirmation from "@/models/BookingConfirmation";
import { buildOrganicReport } from "@/libs/organicReport";
export async function GET(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const raw = Number(new URL(request.url).searchParams.get("dateRange")) || 30;
  const days = Math.min(730, Math.max(1, raw));
  const start = new Date(Date.now() - days * 86400000);
  try {
    await connectMongo();
    const [contacts, bookings] = await Promise.all([
      Contact.find({ createdAt: { $gte: start }, topic: "New Project" })
        .select("attribution leadId createdAt")
        .sort({ createdAt: 1 })
        .lean(),
      BookingConfirmation.find({ createdAt: { $gte: start } })
        .select("leadId")
        .lean(),
    ]);
    const ids = [
      ...new Set(contacts.filter((c) => c.leadId).map((c) => String(c.leadId))),
    ];
    const leads = await Lead.find({ _id: { $in: ids } })
      .select("attribution stage versionHistory value estimatedValue")
      .lean();
    return NextResponse.json(buildOrganicReport(contacts, leads, bookings));
  } catch {
    return NextResponse.json(
      { error: "Attribution report unavailable" },
      { status: 500 },
    );
  }
}
