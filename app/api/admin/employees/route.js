import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { Employee } from "@/models/index.js";

// GET /api/admin/employees - Get all employees
export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Only admins can access this endpoint
    if (session.user.role !== "admin") {
      return NextResponse.json({ error: "Access denied" }, { status: 403 });
    }

    await connectMongoose();

    const employees = await Employee.find({ isActive: true })
      .select("_id name position skills availability")
      .sort({ name: 1 });

    return NextResponse.json({ employees });
  } catch (error) {
    console.error("Error fetching employees:", error);
    return NextResponse.json(
      { error: "Failed to fetch employees" },
      { status: 500 },
    );
  }
}
