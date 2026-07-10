import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongo from "@/libs/mongoose";
import CRMView from "@/models/CRMView";

export async function DELETE(_request, { params }) {
  const session = await getServerSession(authOptions);
  if (session?.user?.role !== "admin")
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await connectMongo();
  const view = await CRMView.findOneAndDelete({
    _id: params.id,
    owner: session.user.id,
  });
  if (!view)
    return NextResponse.json({ error: "View not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
