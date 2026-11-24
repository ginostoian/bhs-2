import { businessFacts } from "@/libs/businessFacts";
import { areaDetails } from "@/libs/areaDetails";
import { reviews } from "@/libs/reviews";
import { RecentJobs } from "@/components/brand/RealProof";
import Link from "next/link";
import { notFound } from "next/navigation";

import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import {
  LONDON_LOCATIONS,
  getAreaContext,
  getLocationBySlug,
  getNearbyLocations,
} from "@/libs/locations";
import {
  BUSINESS_IDS,
  SITE_URL,
  getLocalBusinessSchema,
  getWebsiteReference,
} from "@/libs/structuredData";
import classes from "./page.module.css";

export const dynamicParams = false;
export const revalidate = 86400;

const siteUrl = SITE_URL;
const businessId = BUSINESS_IDS.localBusiness;

const trustHighlights = [
  {
    title: "Fully insured and compliant",
    text: "Every project is delivered with professional risk management, certified trades, and clear compliance standards.",
  },
  {
    title: "Transparent commercial structure",
    text: "Clear scope, practical allowances, and staged payments built around measurable progress on site.",
  },
  {
    title: "Premium finish discipline",
    text: "Dedicated snagging and quality control routines to protect design intent and long-term durability.",
  },
  {
    title: "Single accountable team",
    text: "From design coordination to handover, you deal with one team responsible for programme, quality, and communication.",
  },
];

// Verbatim review excerpts, chosen per area in libs/areaDetails.js.
const toTestimonial = (r) => ({ name: r.name, quote: r.quote, sourceLabel: `${r.source} review`, sourceUrl: r.url });

const socialProofPoints = [
  {title: businessFacts.expertise, text: "Explore the projects in our portfolio and discuss the scope relevant to your property."},
  {title: businessFacts.guaranteeHeadline, text: businessFacts.workmanship},
  {title: businessFacts.insuranceHeadline, text: businessFacts.insurance},
  {title: `${businessFacts.reviews.rating}/5`, text: businessFacts.reviews.summary},
];

const serviceCards = [
  {
    title: "House Extensions",
    description:
      "Rear, side-return, wraparound, and double-storey extensions that unlock better layouts, natural light, and long-term value.",
    link: "/house-extension",
  },
  {
    title: "Loft Conversions",
    description:
      "Dormer, hip-to-gable, and mansard loft conversions that create calm, high-spec living space without relocating.",
    link: "/loft-conversion",
  },
  {
    title: "Full Home Renovations",
    description:
      "End-to-end renovations including structural reconfiguration, MEP upgrades, premium joinery, and final finishing.",
    link: "/general-renovation",
  },
  {
    title: "Kitchen and Bathroom Upgrades",
    description:
      "Design-led refurbishments that improve function, aesthetics, and resale appeal with practical buildability in mind.",
    link: "/contact",
  },
];

const buildSteps = [
  {
    title: "Consultation and feasibility",
    text: "We assess your property, goals, and budget envelope, then define the most commercially sensible path to delivery.",
  },
  {
    title: "Scope, design, and approvals",
    text: "We coordinate drawings, structural input, and pre-construction planning so your project enters build phase with clarity.",
  },
  {
    title: "Build delivery and reporting",
    text: "Disciplined site management, regular updates, and proactive risk control to keep quality high and delays low.",
  },
  {
    title: "Handover and aftercare",
    text: "Detailed snagging, formal sign-off, and workmanship-backed support so your investment performs for years.",
  },
];

const pickTestimonialsForLocation = (slug) =>
  (areaDetails[slug]?.reviews ?? ["mia", "chris", "george"]).map((k) => toTestimonial(reviews[k]));

const createFaqs = (location) => {
  const borough = areaDetails[location.slug]?.borough ?? "your borough";
  return [
    {
      question: `Do I need planning permission for an extension or loft in ${location.name}?`,
      answer: `Many rear extensions and dormer lofts on houses are permitted development, but not in conservation areas, on flats or where ${borough} has an Article 4 direction. We check your address before you spend anything on drawings.`,
    },
    {
      question: `How much does a renovation cost in ${location.name}?`,
      answer:
        "On our recent London jobs, flats cost £29,000 to £71,000 + VAT, a ground floor about £34,000 + VAT and whole houses about £60,000 to £100,000. Extensions and lofts add to that. Our London prices page has the full list.",
    },
    {
      question: `Do you work with my architect in ${location.name}?`,
      answer:
        "Yes. Bring your own architect's drawings or use one we recommend. We build from them, price every item in writing and keep the design team in the loop.",
    },
    {
      question: "How quickly can you start?",
      answer:
        "Usually within a few weeks of agreeing the quote for smaller jobs. Extensions and lofts wait for drawings, building control and any party wall awards, which we help organise.",
    },
  ];
};

export function generateStaticParams() {
  return LONDON_LOCATIONS.map((location) => ({
    slug: location.slug,
  }));
}

const buildLocationSchema = (location, faqItems) => {
  const pageUrl = `${siteUrl}/locations/${location.slug}`;

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        ...getLocalBusinessSchema({
        areaServed: [
          {
            "@type": "Place",
            name: location.name,
          },
          {
            "@type": "AdministrativeArea",
            name: location.area,
            addressCountry: "GB",
          },
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: `Home Renovation Services in ${location.name}`,
          itemListElement: [
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `House Extensions in ${location.name}`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Loft Conversions in ${location.name}`,
              },
            },
            {
              "@type": "Offer",
              itemOffered: {
                "@type": "Service",
                name: `Full Home Renovations in ${location.name}`,
              },
            },
          ],
        },
        }),
      },
      {
        "@type": "WebPage",
        "@id": `${pageUrl}#webpage`,
        url: pageUrl,
        name: `House Extensions, Loft Conversions & Renovations in ${location.name}`,
        isPartOf: getWebsiteReference(),
        about: {
          "@id": businessId,
        },
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#house-extensions`,
        serviceType: `House Extensions in ${location.name}`,
        provider: { "@id": businessId },
        areaServed: { "@type": "Place", name: location.name },
        url: pageUrl,
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#loft-conversions`,
        serviceType: `Loft Conversions in ${location.name}`,
        provider: { "@id": businessId },
        areaServed: { "@type": "Place", name: location.name },
        url: pageUrl,
      },
      {
        "@type": "Service",
        "@id": `${pageUrl}#full-home-renovations`,
        serviceType: `Full Home Renovations in ${location.name}`,
        provider: { "@id": businessId },
        areaServed: { "@type": "Place", name: location.name },
        url: pageUrl,
      },
      {
        "@type": "FAQPage",
        "@id": `${pageUrl}#faq`,
        mainEntity: faqItems.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: {
            "@type": "Answer",
            text: faq.answer,
          },
        })),
      },
      {
        "@type": "BreadcrumbList",
        "@id": `${pageUrl}#breadcrumbs`,
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: siteUrl,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Locations",
            item: `${siteUrl}/locations`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: location.name,
            item: pageUrl,
          },
        ],
      },
    ],
  };
};

export function generateMetadata({ params }) {
  const location = getLocationBySlug(params.slug);

  if (!location) {
    return getSEOTags({
      title: "Location Not Found | Better Homes",
      canonicalUrlRelative: "/locations",
      extraTags: {
        robots: {
          index: false,
          follow: false,
        },
      },
    });
  }

  const pageTitle = `Builders in ${location.name} | Extensions, Lofts & Renovations | Better Homes`;
  const pageDescription = `Extensions, loft conversions and renovations in ${location.name}, with real local jobs and prices. 12+ years in London, 5.0 on Houzz, MyBuilder and Google.`;
  const pageUrl = `${siteUrl}/locations/${location.slug}`;

  return getSEOTags({
    title: pageTitle,
    description: pageDescription,
    canonicalUrlRelative: `/locations/${location.slug}`,
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: pageUrl,
    },
    keywords: [
      `${location.name} house extensions`,
      `${location.name} loft conversions`,
      `${location.name} full home renovation`,
      `${location.area} renovation company`,
      "premium renovation london",
    ],
  });
}

export default function LocationPage({ params }) {
  const location = getLocationBySlug(params.slug);
  if (!location) notFound();

  const nearbyLocations = getNearbyLocations(location.slug);
  const selectedTestimonials = pickTestimonialsForLocation(location.slug);
  const faqItems = createFaqs(location);
  const locationSchema = buildLocationSchema(location, faqItems);
  const contactUrl = `/contact?location=${encodeURIComponent(location.name)}`;

  return (
    <main className={classes.page}>
      <section className={classes.hero}>
        <div className="container">
          <nav className={classes.breadcrumb} aria-label="Breadcrumb">
            <Link href="/">Home</Link>
            <span>/</span>
            <Link href="/locations">Locations</Link>
            <span>/</span>
            <span>{location.name}</span>
          </nav>

          <h1 className={classes.title}>
            Builders in {location.name}: extensions, lofts and renovations
          </h1>
          <p className={classes.subtitle}>
            {areaDetails[location.slug]?.intro ?? getAreaContext(location.area)}
          </p>
          <p className={classes.subtitle}>
            Bring your own architect or use one we recommend. You get a
            written, line-by-line price and a project lead who updates you
            every week.
          </p>

          <div className={classes.ctaRow}>
            <Link href={contactUrl} className={classes.primaryCta}>
              Discuss your project in {location.name}
            </Link>
            <Link href="/portfolio" className={classes.secondaryCta}>
              View Recent London Projects
            </Link>
          </div>
        </div>
      </section>

      <RecentJobs
        postcodes={areaDetails[location.slug]?.postcodes ?? []}
        title={`Our jobs in and around ${location.name}`}
      />
      <section className={classes.section}>
        <div className="container">
          <h2 className={classes.sectionTitle}>Why Homeowners Choose Us</h2>
          <div className={classes.trustGrid}>
            {trustHighlights.map((item) => (
              <article key={item.title} className={classes.infoCard}>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={classes.section}>
        <div className="container">
          <h2 className={classes.sectionTitle}>
            What our clients say
          </h2>
          <p className={classes.sectionIntro}>
            In our clients&apos; own words, from Houzz, MyBuilder and Google, where
            we hold a 5.0 rating.
          </p>
          <div className={classes.proofGrid}>
            {socialProofPoints.map((point) => (
              <article key={point.title} className={classes.proofCard}>
                <h3>{point.title}</h3>
                <p>{point.text}</p>
              </article>
            ))}
          </div>
          <div className={classes.testimonialGrid}>
            {selectedTestimonials.map((testimonial) => {
              const isExternal = testimonial.sourceUrl.startsWith("http");
              const reviewUrl = testimonial.sourceUrl;

              return (
                <article key={testimonial.name} className={classes.quoteCard}>
                  <p className={classes.quoteText}>&ldquo;{testimonial.quote}&rdquo;</p>
                  <div className={classes.quoteMeta}>
                    <strong>{testimonial.name}</strong>
                    <a
                      href={reviewUrl}
                      target={isExternal ? "_blank" : undefined}
                      rel={isExternal ? "noopener noreferrer" : undefined}
                    >
                      {testimonial.sourceLabel}
                    </a>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className={classes.section}>
        <div className="container">
          <h2 className={classes.sectionTitle}>
            Core Services in {location.name}
          </h2>
          <p className={classes.sectionIntro}>
            Most enquiries in {location.name} are centred around space creation
            and whole-home improvements. Our core delivery model is built for
            house extensions, loft conversions, and complete renovations with
            design, build, and handover under one accountable team.
          </p>
          <div className={classes.serviceGrid}>
            {serviceCards.map((service) => (
              <article key={service.title} className={classes.serviceCard}>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <Link href={service.link}>Learn more</Link>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={classes.section}>
        <div className="container">
          <h2 className={classes.sectionTitle}>
            How We Deliver Projects in {location.name}
          </h2>
          <div className={classes.stepsGrid}>
            {buildSteps.map((step, index) => (
              <article key={step.title} className={classes.stepCard}>
                <div className={classes.stepNumber}>0{index + 1}</div>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className={classes.section}>
        <div className="container">
          <h2 className={classes.sectionTitle}>
            Common Questions from {location.name} Homeowners
          </h2>
          <div className={classes.faqList}>
            {faqItems.map((faq) => (
              <details key={faq.question} className={classes.faqItem}>
                <summary>{faq.question}</summary>
                <p>{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className={classes.section}>
        <div className="container">
          <div className={classes.bottomCta}>
            <h2>Planning a Project in {location.name}?</h2>
            <p>
              Speak with our team about your extension, loft conversion, or
              full renovation. We&apos;ll help you shape the right scope and
              delivery plan before work begins.
            </p>
            <Link href={contactUrl} className={classes.primaryCta}>
              Start Your Project Consultation
            </Link>
          </div>
        </div>
      </section>

      {nearbyLocations.length > 0 && (
        <section className={classes.section}>
          <div className="container">
            <h2 className={classes.sectionTitle}>
              Nearby Areas We Also Serve
            </h2>
            <div className={classes.nearbyGrid}>
              {nearbyLocations.map((nearbyLocation) => (
                <Link
                  key={nearbyLocation.slug}
                  href={`/locations/${nearbyLocation.slug}`}
                  className={classes.nearbyLink}
                >
                  {nearbyLocation.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(locationSchema) }}
      />
    </main>
  );
}
