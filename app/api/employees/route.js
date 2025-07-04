import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/employees
 * List all employees (admin only)
 */
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const employees = await Employee.find({ isActive: true }).sort({ name: 1 });
    return NextResponse.json({ employees });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch employees" },
      { status: 401 },
    );
  }
}

/**
 * POST /api/employees
 * Create a new employee (admin only)
 */
export async function POST(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const body = await req.json();
    // Validate required fields
    if (!body.name || !body.email || !body.position) {
      return NextResponse.json(
        { error: "Name, email, and position are required" },
        { status: 400 },
      );
    }
    // Check if employee already exists
    const existing = await Employee.findOne({
      email: body.email.toLowerCase(),
    });
    if (existing) {
      return NextResponse.json(
        { error: "Employee with this email already exists" },
        { status: 409 },
      );
    }
    // Create employee
    const employee = await Employee.create({
      name: body.name,
      email: body.email.toLowerCase(),
      image: body.image,
      phone: body.phone,
      position: body.position,
      skills: body.skills,
      isActive: body.isActive !== undefined ? body.isActive : true,
      hourlyRate: body.hourlyRate,
      availability: body.availability,
      notes: body.notes,
    });
    return NextResponse.json({ employee }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create employee" },
      { status: 500 },
    );
  }
}
