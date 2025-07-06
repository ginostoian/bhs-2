import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";
import Employee from "@/models/Employee";
import User from "@/models/User";
import { requireAuth } from "@/libs/requireAdmin";

/**
 * GET /api/employee/check
 * Check if current user has a corresponding Employee record
 */
export async function GET(req) {
  try {
    await connectMongoose();

    // Get current user (must be employee)
    const session = await requireAuth(req);
    if (session.user.role !== "employee") {
      return NextResponse.json(
        { error: "Employee access required" },
        { status: 403 },
      );
    }

    // Check if Employee record exists
    const employee = await Employee.findOne({ email: session.user.email });

    if (!employee) {
      // Employee record doesn't exist, create one from User data
      const user = await User.findOne({ email: session.user.email });
      if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
      }

      // Create Employee record from User data
      const newEmployee = await Employee.create({
        name: user.name || "Employee",
        email: user.email,
        image: user.image,
        phone: user.phone,
        position: "Employee", // Default position
        skills: [],
        isActive: true,
        availability: "available",
        notes: "Auto-created from user conversion",
      });

      return NextResponse.json({
        message: "Employee record created",
        employee: newEmployee,
      });
    }

    return NextResponse.json({
      message: "Employee record exists",
      employee,
    });
  } catch (error) {
    return NextResponse.json(
      { error: error.message || "Failed to check employee record" },
      { status: 500 },
    );
  }
}
