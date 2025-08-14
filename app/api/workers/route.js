import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import { requireAdmin } from "@/libs/requireAdmin";
import Employee from "@/models/Employee";

export const dynamic = "force-dynamic";

// GET /api/workers?query=&type=&active=
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query")?.trim();
    const type = searchParams.get("type");
    const active = searchParams.get("active");

    const filter = {};
    if (active === "true") filter.isActive = true;
    if (active === "false") filter.isActive = false;

    let mongoQuery = Employee.find(filter).sort({ name: 1 }).limit(50);
    if (query) {
      mongoQuery = Employee.find({
        ...filter,
        $or: [
          { name: new RegExp(query, "i") },
          { email: new RegExp(query, "i") },
          { phone: new RegExp(query, "i") },
          { position: new RegExp(query, "i") },
        ],
      })
        .sort({ name: 1 })
        .limit(50);
    }

    const employees = await mongoQuery.exec();
    const workers = employees.map((e) => ({
      _id: e._id,
      name: e.name,
      email: e.email,
      phone: e.phone,
      position: e.position,
      type: "employee",
      isActive: e.isActive,
    }));
    return NextResponse.json({ workers });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch workers" },
      { status: 500 },
    );
  }
}

// POST /api/workers (create employee for attendance system)
export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();

    const body = await req.json();
    const { name, email, phone, position, trade, dayRate, notes } = body;

    if (!name?.trim()) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    // Create employee record
    const employee = await Employee.create({
      name: name.trim(),
      email: email?.trim() || undefined,
      phone: phone?.trim() || undefined,
      position: position?.trim() || "Worker",
      skills: trade ? [trade.trim()] : [],
      dayRate: dayRate ? Number(dayRate) : undefined,
      notes: notes?.trim() || undefined,
      isActive: true,
      availability: "available",
    });

    // Return in worker format for consistency with frontend
    const worker = {
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      position: employee.position,
      type: "employee",
      isActive: employee.isActive,
    };

    return NextResponse.json({ worker }, { status: 201 });
  } catch (error) {
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Employee with this email already exists" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error.message || "Failed to create employee" },
      { status: 500 },
    );
  }
}
