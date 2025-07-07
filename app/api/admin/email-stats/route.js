import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import { getEmailStats, clearEmailStats } from "@/libs/emailService";
import connectMongoose from "@/libs/mongoose";
import User from "@/models/User";

// Force dynamic rendering for this route
export const dynamic = "force-dynamic";

async function isAdmin(session) {
  if (!session?.user?.email) return false;
  await connectMongoose();
  const user = await User.findOne({ email: session.user.email });
  return user && user.role === "admin";
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const stats = await getEmailStats();
  return NextResponse.json(stats);
}

export async function DELETE() {
  const session = await getServerSession(authOptions);
  if (!(await isAdmin(session))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await clearEmailStats();
  return NextResponse.json({ success: true });
}
