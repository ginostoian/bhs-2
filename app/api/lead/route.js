import { NextResponse } from "next/server";
import connectMongo from "@/libs/mongoose";
import Lead from "@/models/Lead";
import { notifyAdminFormSubmission } from "@/libs/notificationService";

// This route is used to store the leads that are generated from the landing page.
// The API call is initiated by <ButtonLead /> component
// Duplicate emails just return 200 OK
export async function POST(req) {
  await connectMongo();

  const body = await req.json();

  if (!body.email) {
    return NextResponse.json({ error: "Email is required" }, { status: 400 });
  }

  try {
    const lead = await Lead.findOne({ email: body.email });

    if (!lead) {
      const createdLead = await Lead.create({ email: body.email });

      try {
        await notifyAdminFormSubmission({
          title: "New Lead Captured",
          message: `${createdLead.email} was captured from the landing page form.`,
          metadata: {
            formType: "lead-capture",
            leadId: createdLead._id.toString(),
            email: createdLead.email,
          },
        });
      } catch (notificationError) {
        console.error(
          "Failed to create internal notification for landing page lead:",
          notificationError,
        );
      }

      // Here you can add your own logic
      // For instance, sending a welcome email (use the sendEmail helper function from /libs/resend)
    }

    return NextResponse.json({});
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
