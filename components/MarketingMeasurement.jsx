"use client";
import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import {
  ATTRIBUTION_KEY,
  readTouchpoint,
  mergeAttribution,
  currentAttribution,
  safeMarketingPath,
} from "@/libs/marketingAttribution";
import {
  hasAnalyticsConsent,
  trackEnquiryEvent,
} from "@/libs/enquiryAnalytics";
import { BOOKING_URL } from "@/libs/booking";
export default function MarketingMeasurement() {
  const path = usePathname();
  const entry = useRef(null);
  const recorded = useRef(false);
  useEffect(() => {
    if (!entry.current)
      entry.current = readTouchpoint(window.location.href, document.referrer);
    function capture() {
      try {
        if (!hasAnalyticsConsent()) {
          sessionStorage.removeItem(ATTRIBUTION_KEY);
          recorded.current = false;
          return;
        }
        // Do not repeatedly treat the initial document referrer as a fresh acquisition on client navigation.
        const touchpoint = recorded.current
          ? readTouchpoint(window.location.href)
          : entry.current;
        const next = mergeAttribution(currentAttribution(), touchpoint);
        if (next) sessionStorage.setItem(ATTRIBUTION_KEY, JSON.stringify(next));
        recorded.current = true;
      } catch {}
    }
    capture();
    window.addEventListener("bhs-consent-change", capture);
    const click = (event) => {
      const anchor = event.target.closest?.("a[href]");
      if (!anchor || !safeMarketingPath(path)) return;
      const href = anchor.href;
      if (href.startsWith("tel:"))
        trackEnquiryEvent("phone_click", crypto.randomUUID(), {
          page_path: path,
        });
      else if (href.split("?")[0].replace(/\/$/, "") === BOOKING_URL)
        trackEnquiryEvent("booking_click", crypto.randomUUID(), {
          page_path: path,
        });
    };
    document.addEventListener("click", click);
    return () => {
      window.removeEventListener("bhs-consent-change", capture);
      document.removeEventListener("click", click);
    };
  }, [path]);
  return null;
}
