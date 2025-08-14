import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Attendance from "@/models/Attendance";

export const dynamic = "force-dynamic";

export async function PATCH(req, { params }) {
  try {
    const session = await requireAdmin(req);
    await connectMongoose();
    const updates = await req.json();
    updates.updatedBy = session?.user?.id;
    const doc = await Attendance.findByIdAndUpdate(params.id, updates, {
      new: true,
    });
    if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ attendance: doc });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const res = await Attendance.findByIdAndDelete(params.id);
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 },
    );
  }
}

