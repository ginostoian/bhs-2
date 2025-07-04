import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import EmailPreference from "@/models/EmailPreference";
import User from "@/models/User";

export async function GET(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    await connectMongoose();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const prefs = await EmailPreference.getOrCreate(user._id);
    return NextResponse.json({
      enabled: prefs.enabled,
      preferences: prefs.preferences,
      lastUpdated: prefs.lastUpdated,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }
    await connectMongoose();
    const user = await User.findOne({ email: session.user.email });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const { enabled, preferences } = await req.json();
    const updated = await EmailPreference.updatePreferences(user._id, {
      enabled,
      preferences,
    });
    return NextResponse.json({
      enabled: updated.enabled,
      preferences: updated.preferences,
      lastUpdated: updated.lastUpdated,
    });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
