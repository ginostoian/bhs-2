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

const socialProofTestimonials = [
  {
    name: "Louise Thorogood",
    quote:
      "I could not recommend them more highly. The whole process was streamlined and efficient, with a detailed quote and a very high standard of work.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1802745/better-homes-studio-review",
  },
  {
    name: "George G",
    quote:
      "After comparing loft conversion companies in North East London, we chose Better Homes. The team delivered our hip-to-gable loft in 9 weeks exactly as promised.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/2013769/better-homes-studio-review",
  },
  {
    name: "Shyra Muthusamy",
    quote:
      "The quality of workmanship is extremely high and they translated loose ideas into reality with excellent attention to detail.",
    sourceLabel: "Houzz Review",
    sourceUrl: "https://www.houzz.co.uk/viewReview/1863607/better-homes-studio-review",
  },
  {
    name: "Jack Robertson",
    quote:
      "Better Homes did a fantastic job with our full renovation in Chingford. Project management and craftsmanship were excellent throughout.",
    sourceLabel: "Client Testimonial",
    sourceUrl: "/#testimonials",
  },
  {
    name: "Alice Buchanan",
    quote:
      "We had our kitchen redone and could not be happier. The team delivered on time and to a high standard from start to finish.",
    sourceLabel: "Client Testimonial",
    sourceUrl: "/#testimonials",
  },
];

const socialProofPoints = [
  {
    title: "500+ satisfied homeowners",
    text: "A proven record of successful London renovation projects across kitchens, lofts, extensions, and full-home refurbishments.",
  },
  {
    title: "Up to 10 years workmanship guarantee",
    text: "Long-term protection and clear aftercare standards on qualifying works for added peace of mind.",
  },
  {
    title: "Insurance cover up to £10M",
    text: "Comprehensive project insurance and professional risk controls for high-value properties.",
  },
  {
    title: "Best of Houzz service recognition",
    text: "Consistent client feedback quality reflected in industry-recognised customer service awards.",
  },
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

const stableHash = (value) =>
  [...value].reduce((acc, char) => acc + char.charCodeAt(0), 0);

const pickTestimonialsForLocation = (slug, count = 3) => {
  if (socialProofTestimonials.length === 0) return [];
  const start = stableHash(slug) % socialProofTestimonials.length;

  return Array.from({ length: count }, (_, index) => {
    const pointer = (start + index) % socialProofTestimonials.length;
    return socialProofTestimonials[pointer];
  });
};

const createFaqs = (location) => [
  {
    question: `Do you handle premium house extensions in ${location.name}?`,
    answer:
      "Yes. We deliver design-led extensions with clear cost control, robust programme management, and high-end finishes tailored to each property.",
  },
  {
    question: `Can you manage loft conversions in ${location.name} from start to finish?`,
    answer:
      "Yes. We coordinate the full journey, including planning support, structural works, build execution, and final handover.",
  },
  {
    question: `Are your projects suitable for high-value homes in ${location.name}?`,
    answer:
      "Absolutely. Our process is built for homeowners who require strong communication, discreet site management, and premium quality outcomes.",
  },
  {
    question: `How do you protect quality during a full home renovation in ${location.name}?`,
    answer:
      "Quality is protected through front-loaded planning, staged inspections, and a rigorous snagging protocol before sign-off.",
  },
];

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

  const pageTitle = `House Extensions, Loft Conversions & Renovations in ${location.name} | Better Homes`;
  const pageDescription = `Professional house extensions, loft conversions, and full home renovations in ${location.name}. Trusted by London homeowners for premium delivery, transparent project management, and high-quality finishes.`;
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
            House Extensions, Loft Conversions and Full Renovations in{" "}
            {location.name}
          </h1>
          <p className={classes.subtitle}>
            Better Homes supports homeowners in {location.name} with
            high-quality design and build delivery. We focus on one thing:
            creating beautiful, practical homes through well-managed projects
            that protect both your time and your investment.
          </p>
          <p className={classes.subtitle}>
            {getAreaContext(location.area)}
          </p>

          <div className={classes.ctaRow}>
            <Link href={contactUrl} className={classes.primaryCta}>
              Book a Consultation in {location.name}
            </Link>
            <Link href="/portfolio" className={classes.secondaryCta}>
              View Recent London Projects
            </Link>
          </div>
        </div>
      </section>

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
            Social Proof for Homeowners in {location.name}
          </h2>
          <p className={classes.sectionIntro}>
            Homeowners in {location.name} typically choose us for one reason:
            predictable delivery with a high-quality finish. These proof points
            and client comments reflect how we operate in practice.
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
