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

    // Create response object manually to ensure all fields are included
    const employeeResponse = {
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      phone: employee.phone,
      position: employee.position,
      skills: employee.skills,
      isActive: employee.isActive,
      availability: employee.availability,
      notes: employee.notes,
      dayRate: employee.dayRate,
      hourlyRate: employee.hourlyRate, // Temporarily include for migration
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      __v: employee.__v,
    };

    return NextResponse.json({ employee: employeeResponse });
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

    console.log("PATCH request received for employee:", id);
    console.log("Request body:", body);
    console.log("Day rate in request:", body.dayRate);

    const employee = await Employee.findById(id);
    if (!employee) {
      return NextResponse.json(
        { error: "Employee not found" },
        { status: 404 },
      );
    }

    console.log("Employee before update:", {
      name: employee.name,
      dayRate: employee.dayRate,
    });

    // Update allowed fields
    if (body.name !== undefined) employee.name = body.name;
    if (body.position !== undefined) employee.position = body.position;
    if (body.phone !== undefined) employee.phone = body.phone;
    if (body.skills !== undefined) employee.skills = body.skills;
    if (body.dayRate !== undefined) {
      console.log("Setting dayRate from", employee.dayRate, "to", body.dayRate);
      employee.dayRate = body.dayRate;
    }
    if (body.availability !== undefined)
      employee.availability = body.availability;
    if (body.notes !== undefined) employee.notes = body.notes;
    if (body.isActive !== undefined) employee.isActive = body.isActive;

    await employee.save();

    // Verify the save worked by fetching the employee again
    const savedEmployee = await Employee.findById(id);
    console.log("Employee after save:", {
      name: savedEmployee.name,
      dayRate: savedEmployee.dayRate,
      hourlyRate: savedEmployee.hourlyRate,
    });
    console.log("Full saved employee object:", savedEmployee.toObject());

    // Create response object manually to ensure all fields are included
    const employeeResponse = {
      _id: employee._id,
      name: employee.name,
      email: employee.email,
      role: employee.role,
      phone: employee.phone,
      position: employee.position,
      skills: employee.skills,
      isActive: employee.isActive,
      availability: employee.availability,
      notes: employee.notes,
      dayRate: employee.dayRate,
      hourlyRate: employee.hourlyRate, // Temporarily include for migration
      createdAt: employee.createdAt,
      updatedAt: employee.updatedAt,
      __v: employee.__v,
    };

    console.log(
      "PATCH - Final API response employee object:",
      employeeResponse,
    );
    console.log("PATCH - Day rate in response:", employeeResponse.dayRate);

    return NextResponse.json({ employee: employeeResponse });
  } catch (error) {
    console.error("Error updating employee:", error);
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
