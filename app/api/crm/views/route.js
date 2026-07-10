import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import CRMView from "@/models/CRMView";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const views = await CRMView.find({ owner: session.user.id }).sort({
    isDefault: -1,
    name: 1,
  });
  return NextResponse.json({ views });
}

export async function POST(request) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const body = await request.json();
  if (!body.name?.trim())
    return NextResponse.json(
      { error: "View name is required" },
      { status: 400 },
    );
  if (body.isDefault)
    await CRMView.updateMany(
      { owner: session.user.id },
      { $set: { isDefault: false } },
    );
  const view = await CRMView.findOneAndUpdate(
    { owner: session.user.id, name: body.name.trim() },
    {
      $set: { filters: body.filters || {}, isDefault: Boolean(body.isDefault) },
    },
    { upsert: true, new: true, runValidators: true },
  );
  return NextResponse.json({ success: true, view }, { status: 201 });
}
