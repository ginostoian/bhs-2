import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";

import { authOptions } from "@/libs/next-auth";
import connectMongoose from "@/libs/mongoose";
import Partner from "@/models/Partner";
import User from "@/models/User";
import {
  buildReferralLink,
  ensurePartnerForReferrerUser,
  getPartnerAccountStatus,
} from "@/libs/referrals";
import ReferrerDashboardClient from "./referrer/ReferrerDashboardClient";

export default async function ReferrerPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/auth/signin?role=referrer&callbackUrl=/referrer");
  }

  if (session.user.role !== "referrer") {
    redirect("/dashboard");
  }

  await connectMongoose();
  const user = await User.findById(session.user.id);

  if (!user) {
    redirect("/auth/signin?role=referrer&callbackUrl=/referrer");
  }

  const partnerRecord = await ensurePartnerForReferrerUser(user);
  const partner = await Partner.findById(partnerRecord._id).lean();

  const normalizedPartner = {
    ...partner,
    id: partner._id.toString(),
    _id: undefined,
    accountStatus: getPartnerAccountStatus(partner),
    referralLink: buildReferralLink(partner.referralCode),
    referrals: [...(partner.referrals || [])].sort(
      (a, b) => new Date(b.referredAt) - new Date(a.referredAt)
    ),
  };

  return <ReferrerDashboardClient initialPartner={normalizedPartner} />;
}
