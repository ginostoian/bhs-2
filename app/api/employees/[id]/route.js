import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import { requireAdmin } from "@/libs/requireAdmin";

/**
 * GET /api/employees/[id]
 * Get employee details (admin only)
 */
export async function GET(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { id } = params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({ employee });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to fetch employee" },
      { status: 401 },
    );
  }
}

/**
 * PATCH /api/employees/[id]
 * Update employee details (admin only)
 */
export async function PATCH(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { id } = params;
    const body = await req.json();

    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    // Update allowed fields
    if (body.name !== undefined) employee.name = body.name;
    if (body.position !== undefined) employee.position = body.position;
    if (body.phone !== undefined) employee.phone = body.phone;
    if (body.skills !== undefined) employee.skills = body.skills;
    if (body.hourlyRate !== undefined) employee.hourlyRate = body.hourlyRate;
    if (body.availability !== undefined)
      employee.availability = body.availability;
    if (body.notes !== undefined) employee.notes = body.notes;
    if (body.isActive !== undefined) employee.isActive = body.isActive;

    await employee.save();

    return NextResponse.json({ employee });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to update employee" },
      { status: 500 },
    );
  }
}

/**
 * DELETE /api/employees/[id]
 * Delete employee (admin only)
 */
export async function DELETE(req, { params }) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const { id } = params;

    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    // Soft delete by setting isActive to false
    employee.isActive = false;
    await employee.save();

    return NextResponse.json({ message: "Employee deactivated successfully" });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to delete employee" },
      { status: 500 },
    );
  }
}
