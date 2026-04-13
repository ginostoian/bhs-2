import Link from "next/link";
import classes from "./WhereWeWork.module.css";
import { getGroupedLocations, LONDON_LOCATIONS } from "@/libs/locations";
import { getLocalBusinessSchema, SITE_URL } from "@/libs/structuredData";

const WhereWeWork = () => {
  const groupedLocations = getGroupedLocations();
  const localBusinessSchema = getLocalBusinessSchema({
    description:
      "Professional home renovation services across London including bathroom fitting, kitchen fitting, general refurbishment and extensions",
    areaServed: LONDON_LOCATIONS.map((location) => ({
      "@type": "Place",
      name: location.name,
      url: `${SITE_URL}/locations/${location.slug}`,
      containedInPlace: {
        "@type": "AdministrativeArea",
        name: location.area,
        addressCountry: "GB",
      },
    })),
    serviceArea: {
      "@type": "GeoCircle",
      geoMidpoint: {
        "@type": "GeoCoordinates",
        latitude: 51.5074,
        longitude: -0.1278,
      },
      geoRadius: "25000",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Home Renovation Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Bathroom Renovation",
            description: "Complete bathroom fitting and renovation services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Kitchen Renovation",
            description: "Professional kitchen fitting and renovation services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "General Renovation",
            description: "Complete home renovation and refurbishment services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Extensions",
            description: "Complete home extension services",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Loft Conversion",
            description: "Complete loft conversion services",
          },
        },
      ],
    },
  });

  return (
    <section id="where-we-work" className={classes["where-we-work"]}>
      <div className="container">
        <div className={classes["where-we-work__header"]}>
          <h2 className={classes["where-we-work__title"]}>Where We Work</h2>
          <p className={classes["where-we-work__subtitle"]}>
            Serving London&apos;s finest areas with exceptional home renovations
          </p>
        </div>

        <div className={classes["where-we-work__content"]}>
          <div className={classes["where-we-work__description"]}>
            <p>
              Better Homes proudly serves homeowners across London&apos;s
              most prestigious and vibrant areas. From the leafy suburbs of
              North East London to the bustling heart of Central London, our
              expert team brings exceptional craftsmanship and innovative design
              to every renovation project.
            </p>
            <p>
              Whether you&apos;re looking to transform your bathroom, renovate
              your kitchen, or undertake a complete home renovation, we&apos;re
              here to bring your vision to life with our signature blend of
              quality, reliability, and attention to detail.
            </p>
          </div>

          <div className={classes["where-we-work__areas"]}>
            {Object.entries(groupedLocations).map(([area, areaLocations]) => (
              <div key={area} className={classes["area-group"]}>
                <h3 className={classes["area-group__title"]}>{area}</h3>
                <div className={classes["area-group__locations"]}>
                  {areaLocations.map((location) => (
                    <Link
                      key={location.slug}
                      href={`/locations/${location.slug}`}
                      className={classes["location-link"]}
                    >
                      {location.name}
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className={classes["where-we-work__cta"]}>
            <p className={classes["cta-text"]}>
              For the right project - contact us wherever you are
            </p>
            <Link href="/contact" className={classes["cta-button"]}>
              Get Your Free Quote
            </Link>
          </div>
        </div>
      </div>

      {/* Local Business Schema Markup for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            ...localBusinessSchema,
          }),
        }}
      />
    </section>
  );
};

export default WhereWeWork;
