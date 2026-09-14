import { publicMarketingPaths } from "./publicMarketingPaths.js";
export const ATTRIBUTION_KEY = "bhs_marketing_attribution_v1";
export const safeMarketingPath = (path) =>
  publicMarketingPaths.has(path) ? path : null;
const sources = new Set([
  "google",
  "bing",
  "duckduckgo",
  "yahoo",
  "facebook",
  "instagram",
  "houzz",
  "newsletter",
  "external",
  "direct",
  "unknown",
]);
const media = new Set([
  "organic",
  "cpc",
  "paid_social",
  "social",
  "email",
  "referral",
  "none",
  "unknown",
]);
// Add only reviewed campaign slugs here. Unrecognised/free-text campaign values are dropped.
export const approvedCampaigns = new Set();
export function readTouchpoint(href, referrer = "") {
  const url = new URL(href);
  const path = safeMarketingPath(url.pathname);
  if (!path) return null;
  let source = "direct",
    medium = "none";
  const campaignSource = url.searchParams.get("utm_source");
  if (campaignSource) {
    source = sources.has(campaignSource) ? campaignSource : "unknown";
    const value = url.searchParams.get("utm_medium");
    medium = media.has(value) ? value : "unknown";
    if (source === "unknown") medium = "unknown";
  } else if (referrer) {
    try {
      const host = new URL(referrer).hostname.replace(/^www\./, "");
      if (
        ![url.hostname.replace(/^www\./, ""), "bhstudio.co.uk"].includes(host)
      ) {
        source = /(^|\.)google\.(com|co\.uk)$/.test(host)
          ? "google"
          : /(^|\.)bing\.com$/.test(host)
            ? "bing"
            : /(^|\.)duckduckgo\.com$/.test(host)
              ? "duckduckgo"
              : /(^|\.)search\.yahoo\.com$/.test(host)
                ? "yahoo"
                : "external";
        medium = source === "external" ? "referral" : "organic";
      }
    } catch {
      source = "unknown";
      medium = "unknown";
    }
  }
  const campaign = url.searchParams.get("utm_campaign");
  return {
    path,
    source,
    medium,
    ...(approvedCampaigns.has(campaign) ? { campaign } : {}),
  };
}
export function mergeAttribution(
  previous,
  touchpoint,
  now = new Date().toISOString(),
) {
  if (!touchpoint) return previous;
  const meaningful = !["none", "unknown"].includes(touchpoint.medium);
  if (previous && !meaningful) return previous;
  return {
    consent: "accepted",
    firstLandingPath: previous?.firstLandingPath || touchpoint.path,
    landingPath: touchpoint.path,
    source: touchpoint.source,
    medium: touchpoint.medium,
    capturedAt: now,
    ...(touchpoint.campaign ? { campaign: touchpoint.campaign } : {}),
  };
}
export function sanitizeAttribution(value) {
  if (
    !value ||
    value.consent !== "accepted" ||
    !safeMarketingPath(value.firstLandingPath) ||
    !safeMarketingPath(value.landingPath)
  )
    return undefined;
  if (!sources.has(value.source) || !media.has(value.medium)) return undefined;
  const time = Date.parse(value.capturedAt);
  if (
    !Number.isFinite(time) ||
    time > Date.now() + 300000 ||
    time < Date.now() - 30 * 86400000
  )
    return undefined;
  return {
    consent: "accepted",
    firstLandingPath: value.firstLandingPath,
    landingPath: value.landingPath,
    source: value.source,
    medium: value.medium,
    capturedAt: new Date(time).toISOString(),
    ...(approvedCampaigns.has(value.campaign)
      ? { campaign: value.campaign }
      : {}),
  };
}
export function currentAttribution() {
  try {
    if (localStorage.getItem("cookie-consent") !== "accepted") return undefined;
    return sanitizeAttribution(
      JSON.parse(sessionStorage.getItem(ATTRIBUTION_KEY)),
    );
  } catch {
    return undefined;
  }
}
