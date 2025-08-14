import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Employee from "@/models/Employee";

export const dynamic = "force-dynamic";

export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const worker = await Employee.findById(params.id);
    if (!worker)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ worker });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 },
    );
  }
}

export async function PATCH(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const updates = await req.json();
    const worker = await Employee.findByIdAndUpdate(params.id, updates, {
      new: true,
    });
    if (!worker)
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ worker });
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
    const res = await Employee.findByIdAndDelete(params.id);
    if (!res) return NextResponse.json({ error: "Not found" }, { status: 404 });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed" },
      { status: 500 },
    );
  }
}
