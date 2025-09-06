import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import User from "@/models/User";

export async function GET(request) {
  try {
    await connectMongo();

    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email") || "gino@celli.co.uk";

    // Find user by email
    const user = await User.findOne({ email }).lean();

    if (!user) {
      return NextResponse.json({
        found: false,
        email,
        message: "No user found with this email",
      });
    }

    return NextResponse.json({
      found: true,
      email,
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        phone: user.phone,
        address: user.address,
        postcode: user.postcode,
        role: user.role,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("User check error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
