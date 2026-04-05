"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const REFERRAL_COOKIE_NAME = "bhs_referral_code";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 30;

function setReferralCookie(value) {
  document.cookie = `${REFERRAL_COOKIE_NAME}=${encodeURIComponent(value)}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
}

export default function ReferralTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const referralCode = searchParams.get("ref")?.trim().toLowerCase();

    if (referralCode) {
      window.localStorage.setItem(REFERRAL_COOKIE_NAME, referralCode);
      setReferralCookie(referralCode);
      return;
    }

    const savedReferralCode = window.localStorage.getItem(REFERRAL_COOKIE_NAME);
    if (savedReferralCode) {
      setReferralCookie(savedReferralCode);
    }
  }, [pathname, searchParams]);

  return null;
}
