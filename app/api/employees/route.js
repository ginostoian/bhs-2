import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import User from "@/models/User";
import { requireAdmin } from "@/libs/requireAdmin";
import { notifyEmployeeCreation } from "@/libs/notificationService";

/**
 * GET /api/employees
 * List all employees (admin only)
 */
export async function GET(req) {
  try {
    await requireAdmin(req);
    await connectMongoose();
    const employees = await Employee.find({ isActive: true }).sort({ name: 1 });

    // Remove hourlyRate field from all employees if it exists
    const cleanedEmployees = employees.map((employee) => {
      const employeeObj = employee.toObject();
      if (employeeObj.hourlyRate !== undefined) {
        delete employeeObj.hourlyRate;
      }
      return employeeObj;
    });

    return NextResponse.json({ employees: cleanedEmployees });
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

    // Handle user conversion if requested
    if (body.convertUser && body.userId) {
      const user = await User.findById(body.userId);
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Update user role to employee
      user.role = "employee";
      await user.save();
    }

    // Create employee
    const employee = await Employee.create({
      name: body.name,
      email: body.email.toLowerCase(),
      image:
        body.image || body.convertUser
          ? (await User.findOne({ email: body.email.toLowerCase() }))?.image
          : undefined,
      phone: body.phone,
      position: body.position,
      skills: body.skills,
      isActive: body.isActive !== undefined ? body.isActive : true,
      dayRate: body.dayRate,
      availability: body.availability,
      notes: body.notes,
    });

    // Send notification to admins
    try {
      await notifyEmployeeCreation({
        name: employee.name,
        email: employee.email,
        position: employee.position,
      });
    } catch (notificationError) {
      console.error("Failed to send notification:", notificationError);
      // Don't fail the request if notification fails
    }

    // Remove hourlyRate field from response if it exists
    const employeeResponse = employee.toObject();
    if (employeeResponse.hourlyRate !== undefined) {
      delete employeeResponse.hourlyRate;
    }

    return NextResponse.json({ employee: employeeResponse }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to create employee" },
      { status: 500 },
    );
  }
}
