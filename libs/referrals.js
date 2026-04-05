import crypto from "crypto";

import config from "@/config";
import Partner from "@/models/Partner";

const REFERRAL_STATUSES = {
  Negotiations: "negotiations",
  Won: "won",
  Lost: "lost",
};

function slugifyCodeSeed(value = "") {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 24);
}

export function mapLeadStageToReferralStatus(stage) {
  return REFERRAL_STATUSES[stage] || "contacted";
}

export function buildReferralLink(referralCode) {
  return `https://${config.domainName}/contact?ref=${encodeURIComponent(referralCode)}`;
}

export function getPartnerAccountStatus(partner) {
  return partner?.accountStatus || "active";
}

export function isPartnerAccountApproved(partner) {
  return partner?.isActive !== false && getPartnerAccountStatus(partner) === "active";
}

export async function generateUniqueReferralCode(seed) {
  const base = slugifyCodeSeed(seed) || "referrer";

  for (let attempt = 0; attempt < 10; attempt += 1) {
    const suffix =
      attempt === 0
        ? ""
        : `-${crypto.randomBytes(2).toString("hex").toLowerCase()}`;
    const candidate = `${base}${suffix}`;
    const existingPartner = await Partner.findOne({ referralCode: candidate })
      .select("_id")
      .lean();

    if (!existingPartner) {
      return candidate;
    }
  }

  return `referrer-${crypto.randomBytes(4).toString("hex").toLowerCase()}`;
}

export async function ensurePartnerForReferrerUser(user, options = {}) {
  if (!user?._id) {
    throw new Error("A user is required to create a partner record");
  }

  const {
    matchExistingByEmail = false,
    accountStatus,
    isActive,
  } = options;

  let partner = await Partner.findOne({ user: user._id });

  if (!partner && matchExistingByEmail && user.email) {
    partner = await Partner.findOne({
      email: user.email.toLowerCase(),
      user: null,
    });
  }

  if (!partner) {
    partner = new Partner({
      user: user._id,
      name: user.name || user.email,
      email: user.email,
      phone: user.phone,
      address: user.address,
      occupation: "Referrer",
      accountStatus:
        accountStatus || (user.role === "referrer" ? "pending" : "active"),
      isActive: isActive !== undefined ? Boolean(isActive) : true,
      referrals: [],
    });
  }

  if (!partner.user) {
    partner.user = user._id;
  }

  if (user.name && partner.name !== user.name) {
    partner.name = user.name;
  }

  if (user.email && partner.email !== user.email.toLowerCase()) {
    partner.email = user.email.toLowerCase();
  }

  if (user.phone && !partner.phone) {
    partner.phone = user.phone;
  }

  if (user.address && !partner.address) {
    partner.address = user.address;
  }

  if (accountStatus && partner.accountStatus !== accountStatus) {
    partner.accountStatus = accountStatus;
  }

  if (isActive !== undefined) {
    partner.isActive = Boolean(isActive);
  }

  if (!partner.referralCode) {
    partner.referralCode = await generateUniqueReferralCode(
      user.name || user.email || "referrer"
    );
  }

  await partner.save();
  return partner;
}

export async function findPartnerByReferralCode(referralCode) {
  if (!referralCode) {
    return null;
  }

  return Partner.findOne({
    referralCode: referralCode.trim().toLowerCase(),
    isActive: { $ne: false },
    $or: [{ accountStatus: "active" }, { accountStatus: null }],
  });
}

export async function syncPartnerReferralFromLead(lead, options = {}) {
  if (!lead?._id) {
    return null;
  }

  const previousPartnerId = options.previousPartnerId
    ? options.previousPartnerId.toString()
    : null;
  const currentPartnerId = lead.referredBy ? lead.referredBy.toString() : null;

  if (previousPartnerId && previousPartnerId !== currentPartnerId) {
    const previousPartner = await Partner.findById(previousPartnerId);
    if (previousPartner) {
      previousPartner.referrals = (previousPartner.referrals || []).filter(
        (referral) => referral.lead?.toString() !== lead._id.toString()
      );
      await previousPartner.save();
    }
  }

  if (!lead.referredBy) {
    return null;
  }

  const partner = await Partner.findById(lead.referredBy);
  if (!partner) {
    return null;
  }

  const referralPayload = {
    lead: lead._id,
    customerName: lead.name,
    email: lead.email,
    phone: lead.phone,
    postcode: lead.postcode,
    address: lead.address,
    projectValue: Number(lead.value || 0),
    projectTypes: lead.fullProjectTypes || lead.projectTypes || [],
    status: mapLeadStageToReferralStatus(lead.stage),
    stage: lead.stage,
    referralSource: lead.referralSource || "other",
    referredAt: lead.createdAt || new Date(),
    updatedAt: new Date(),
  };

  const existingReferral = partner.referrals.find(
    (referral) => referral.lead?.toString() === lead._id.toString()
  );

  if (existingReferral) {
    Object.assign(existingReferral, referralPayload);
  } else {
    partner.referrals.push(referralPayload);
  }

  await partner.save();
  return partner;
}
