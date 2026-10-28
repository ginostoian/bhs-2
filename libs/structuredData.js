import { businessFacts } from "@/libs/businessFacts";
import config from "@/config";

export const SITE_URL = `https://${config.domainName}`;
export const BUSINESS_NAME = businessFacts.name;

export const BUSINESS_IDS = {
  organization: `${SITE_URL}/#organization`,
  localBusiness: `${SITE_URL}/#localbusiness`,
  website: `${SITE_URL}/#website`,
};

export const BUSINESS_SAME_AS = [
  "https://www.instagram.com/better.homes.studio",
  "https://www.facebook.com/bhomes.studio",
  businessFacts.reviews.url,
  "https://g.page/r/CaGIVAg_unOVEBM/",
  "https://www.mybuilder.com/profile/view/celli/feedback",
];

export const BUSINESS_EXPERTISE = [
  "House extensions",
  "Side return extensions",
  "Wraparound extensions",
  "Loft conversions",
  "Basement conversions",
  "Whole-home renovations",
  "Kitchen renovations",
  "Bathroom renovations",
];

export const getOrganizationReference = () => ({
  "@id": BUSINESS_IDS.organization,
});

export const getLocalBusinessReference = () => ({
  "@id": BUSINESS_IDS.localBusiness,
});

export const getWebsiteReference = () => ({
  "@id": BUSINESS_IDS.website,
});

export const getOrganizationSchema = () => ({
  "@type": "Organization",
  "@id": BUSINESS_IDS.organization,
  name: BUSINESS_NAME,
  url: SITE_URL,
  logo: `${SITE_URL}/icon.png`,
  description:
    "London builders delivering house extensions, loft conversions and whole-home renovations, with workmanship guarantees of up to 10 years.",
  sameAs: BUSINESS_SAME_AS,
  telephone: "+447922391591",
  award: "Best of Houzz 2023",
  knowsAbout: BUSINESS_EXPERTISE,
});

export const getWebsiteSchema = () => ({
  "@type": "WebSite",
  "@id": BUSINESS_IDS.website,
  url: `${SITE_URL}/`,
  name: BUSINESS_NAME,
  publisher: getOrganizationReference(),
});

export const getLocalBusinessSchema = (overrides = {}) => ({
  "@type": ["HomeAndConstructionBusiness", "GeneralContractor", "LocalBusiness"],
  "@id": BUSINESS_IDS.localBusiness,
  name: BUSINESS_NAME,
  url: SITE_URL,
  telephone: "+447922391591",
  priceRange: "£££",
  image: `${SITE_URL}/opengraph-image.png`,
  sameAs: BUSINESS_SAME_AS,
  knowsAbout: BUSINESS_EXPERTISE,
  address: {
    "@type": "PostalAddress",
    addressLocality: "London",
    addressCountry: "GB",
  },
  parentOrganization: getOrganizationReference(),
  ...overrides,
});

export const getRootSchema = () => ({
  "@context": "https://schema.org",
  "@graph": [getOrganizationSchema(), getWebsiteSchema(), getLocalBusinessSchema({ areaServed: { "@type": "City", name: "London" } })],
});
