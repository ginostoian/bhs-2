import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Lead from "@/models/Lead";
import Partner from "@/models/Partner";
import {
  buildReferralLink,
  syncPartnerReferralFromLead,
} from "@/libs/referrals";

export const dynamic = "force-dynamic";

// POST add referral (admin)
export async function POST(request, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectMongoose();
    const { customerName, email, phone, address, projectValue, notes } =
      await request.json();
    if (!customerName || !email) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }
    const partner = await Partner.findById(params.id);
    if (!partner) {
      return NextResponse.json({ error: "Partner not found" }, { status: 404 });
    }
    const existingLead = await Lead.findOne({ email: email.trim().toLowerCase() });
    if (existingLead && !existingLead.isArchived) {
      return NextResponse.json(
        { error: "A lead with this email already exists" },
        { status: 409 }
      );
    }

    const lead =
      existingLead ||
      new Lead({
        name: customerName.trim(),
        email: email.trim().toLowerCase(),
      });

    const previousPartnerId = lead.referredBy?.toString() || null;

    lead.name = customerName.trim();
    lead.email = email.trim().toLowerCase();
    lead.phone = phone?.trim() || lead.phone;
    lead.address = address?.trim() || lead.address;
    lead.value = Number(projectValue || 0);
    lead.source = "Referral";
    lead.referredBy = partner._id;
    lead.referralSource = "admin_manual";
    lead.stage = lead.stage || "Lead";
    lead.isActive = true;
    lead.isArchived = false;
    lead.archivedAt = null;
    lead.archivedBy = null;

    if (notes?.trim()) {
      lead.activities.push({
        type: "note",
        title: "Referral added from admin partner record",
        description: notes.trim(),
        status: "done",
        contactMade: false,
        metadata: {
          source: "admin_partner_database",
          partnerId: partner._id.toString(),
        },
      });
    }

    await lead.save();
    await syncPartnerReferralFromLead(lead, { previousPartnerId });

    if (!existingLead) {
      try {
        const { initializeEmailAutomation } = await import(
          "@/libs/crmEmailAutomation"
        );
        await initializeEmailAutomation(lead._id, lead.stage);
      } catch (error) {
        console.error(
          "Failed to initialize email automation for admin-created referral:",
          error
        );
      }
    }

    const refreshedPartner = await Partner.findById(params.id)
      .populate("user", "name email role")
      .lean();

    return NextResponse.json(
      {
        partner: {
          ...refreshedPartner,
          id: refreshedPartner._id.toString(),
          _id: undefined,
          referralLink: refreshedPartner.referralCode
            ? buildReferralLink(refreshedPartner.referralCode)
            : null,
        },
      },
      { status: existingLead ? 200 : 201 }
    );
  } catch (error) {
    console.error("Error adding referral:", error);
    return NextResponse.json(
      { error: "Failed to add referral" },
      { status: 500 },
    );
  }
}
