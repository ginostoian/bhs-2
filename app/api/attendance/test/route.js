import { NextResponse } from "next/server";
import connectMongoose from "@/libs/mongoose";

export const dynamic = "force-dynamic";

// GET /api/attendance/test - Simple test endpoint
export async function GET() {
  try {
    // Test 1: Check if we can connect to MongoDB
    let mongoStatus = "unknown";
    try {
      await connectMongoose();
      mongoStatus = "connected";
    } catch (error) {
      mongoStatus = `failed: ${error.message}`;
    }

    // Test 2: Check environment variables (don't expose sensitive ones)
    const envCheck = {
      NODE_ENV: process.env.NODE_ENV,
      MONGODB_URI: process.env.MONGODB_URI ? "set" : "missing",
      NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "set" : "missing",
      NEXTAUTH_URL: process.env.NEXTAUTH_URL,
      GOOGLE_ID: process.env.GOOGLE_ID ? "set" : "missing",
      GOOGLE_SECRET: process.env.GOOGLE_SECRET ? "set" : "missing",
    };

    // Test 3: Check if we can import the Attendance model
    let modelStatus = "unknown";
    try {
      const Attendance = (await import("@/models/Attendance")).default;
      modelStatus = "loaded";
    } catch (error) {
      modelStatus = `failed: ${error.message}`;
    }

    return NextResponse.json({
      status: "ok",
      timestamp: new Date().toISOString(),
      tests: {
        mongo: mongoStatus,
        model: modelStatus,
        environment: envCheck,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        status: "error",
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}
