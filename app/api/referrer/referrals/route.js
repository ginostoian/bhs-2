import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";

import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import { rateLimitMiddleware } from "@/libs/rateLimiter";
import Lead from "@/models/Lead";
import Partner from "@/models/Partner";
import User from "@/models/User";
import {
  buildReferralLink,
  ensurePartnerForReferrerUser,
  getPartnerAccountStatus,
  isPartnerAccountApproved,
  syncPartnerReferralFromLead,
} from "@/libs/referrals";

const PROJECT_TYPE_OPTIONS = [
  "General",
  "Extension",
  "Loft",
  "Bathroom",
  "Kitchen",
  "Renovation",
];

function normalizePartner(partner) {
  return {
    ...partner,
    id: partner._id.toString(),
    _id: undefined,
    accountStatus: getPartnerAccountStatus(partner),
    referralLink: buildReferralLink(partner.referralCode),
    referrals: [...(partner.referrals || [])].sort(
      (a, b) => new Date(b.referredAt || 0) - new Date(a.referredAt || 0),
    ),
  };
}

function mapProjectType(projectType) {
  switch (projectType) {
    case "Extension":
      return { projectTypes: ["Extension"] };
    case "Loft":
      return { projectTypes: ["Loft Conversion"] };
    case "Bathroom":
      return { projectTypes: ["Bathroom renovation"] };
    case "Kitchen":
      return { projectTypes: ["Kitchen renovation"] };
    case "Renovation":
      return { projectTypes: ["Home renovation"] };
    case "General":
    default:
      return {
        projectTypes: [],
        customProjectType: "General",
      };
  }
}

async function getReferrerPartner(session) {
  if (!session?.user || session.user.role !== "referrer") {
    return null;
  }

  await connectMongoose();
  const user = await User.findById(session.user.id);
  if (!user) {
    return null;
  }

  const ensuredPartner = await ensurePartnerForReferrerUser(user);
  return Partner.findById(ensuredPartner._id).lean();
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const partner = await getReferrerPartner(session);

    if (!partner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    return NextResponse.json({
      partner: normalizePartner(partner),
    });
  } catch (error) {
    console.error("Error loading referrer referrals:", error);
    return NextResponse.json(
      { error: "Failed to load referrals" },
      { status: 500 },
    );
  }
}

async function handleCreateReferral(request) {
  try {
    const session = await getServerSession(authOptions);
    const partner = await getReferrerPartner(session);

    if (!partner) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (!isPartnerAccountApproved(partner)) {
      return NextResponse.json(
        { error: "Your referrer account is pending approval." },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { name, email, postcode, phone, projectType, details } = body;

    if (
      !name?.trim() ||
      !email?.trim() ||
      !postcode?.trim() ||
      !phone?.trim() ||
      !projectType
    ) {
      return NextResponse.json(
        {
          error:
            "Name, email, postcode, phone number, and project type are required",
        },
        { status: 400 },
      );
    }

    if (!PROJECT_TYPE_OPTIONS.includes(projectType)) {
      return NextResponse.json(
        { error: "Please select a valid project type" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingLead = await Lead.findOne({ email: normalizedEmail })
      .select("_id")
      .lean();

    if (existingLead) {
      return NextResponse.json(
        {
          error: "This lead is already in talks with BHS.",
          code: "LEAD_ALREADY_EXISTS",
        },
        { status: 409 },
      );
    }

    const projectData = mapProjectType(projectType);
    const lead = new Lead({
      name: name.trim(),
      email: normalizedEmail,
      postcode: postcode.trim().toUpperCase(),
      phone: phone.trim(),
      source: "Referral",
      referredBy: partner._id,
      referralSource: "dashboard_form",
      stage: "Lead",
      ...projectData,
    });

    if (details?.trim()) {
      lead.activities.push({
        type: "note",
        title: "Referral submitted by referrer",
        description: details.trim(),
        status: "done",
        contactMade: false,
        metadata: {
          source: "referrer_dashboard",
          partnerId: partner._id.toString(),
        },
      });
    }

    await lead.save();
    await syncPartnerReferralFromLead(lead);

    try {
      const { initializeEmailAutomation } = await import(
        "@/libs/crmEmailAutomation"
      );
      await initializeEmailAutomation(lead._id, lead.stage);
    } catch (error) {
      console.error(
        "Failed to initialize email automation for referrer lead:",
        error,
      );
    }

    const refreshedPartner = await Partner.findById(partner._id).lean();

    return NextResponse.json(
      {
        success: true,
        lead: {
          ...lead.toObject(),
          id: lead._id.toString(),
        },
        partner: normalizePartner(refreshedPartner),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating referrer referral:", error);
    return NextResponse.json(
      { error: "Failed to submit referral" },
      { status: 500 },
    );
  }
}

export const POST = rateLimitMiddleware(handleCreateReferral, {
  namespace: "referrer-referrals",
  maxSubmissions: 5,
  windowMs: 60 * 60 * 1000,
  blockDurationMs: 6 * 60 * 60 * 1000,
  minIntervalMs: 45 * 1000,
});
