"use client";

import Link from "next/link";
import classes from "./WhereWeWork.module.css";

const WhereWeWork = () => {
  const locations = [
    // North East London
    { name: "Woodford", area: "North East London" },
    { name: "South Woodford", area: "North East London" },
    { name: "Chigwell", area: "North East London" },
    { name: "Loughton", area: "North East London" },
    { name: "Theydon Bois", area: "North East London" },
    { name: "Chingford", area: "North East London" },
    { name: "Walthamstow", area: "North East London" },
    { name: "Edmonton", area: "North East London" },
    { name: "Enfield", area: "North East London" },
    { name: "Wood Green", area: "North East London" },

    // East London
    { name: "Leyton", area: "East London" },
    { name: "Leytonstone", area: "East London" },
    { name: "Stratford", area: "East London" },
    { name: "Poplar", area: "East London" },
    { name: "Canary Wharf", area: "East London" },
    { name: "Rotherhithe", area: "East London" },
    { name: "Whitechapel", area: "East London" },

    // South London
    { name: "Southwark", area: "South London" },
    { name: "Lambeth", area: "South London" },
    { name: "South Bank", area: "South London" },

    // Central London
    { name: "Westminster", area: "Central London" },
    { name: "Kensington", area: "Central London" },
    { name: "Chelsea", area: "Central London" },
    { name: "Mayfair", area: "Central London" },
    { name: "Soho", area: "Central London" },
    { name: "City of London", area: "Central London" },
    { name: "Paddington", area: "Central London" },
    { name: "Notting Hill", area: "Central London" },
    { name: "Camden Town", area: "Central London" },
    { name: "Islington", area: "Central London" },
    { name: "Dalston", area: "Central London" },
    { name: "Hackney", area: "Central London" },
    { name: "Hampstead", area: "Central London" },
    { name: "Marylebone", area: "Central London" },
    { name: "Finsbury Park", area: "Central London" },
    { name: "Alexandra Park", area: "Central London" },
    { name: "Barnet", area: "Central London" },
  ];

  // Group locations by area
  const groupedLocations = locations.reduce((acc, location) => {
    if (!acc[location.area]) {
      acc[location.area] = [];
    }
    acc[location.area].push(location.name);
    return acc;
  }, {});

  return (
    <section className={classes["where-we-work"]}>
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
              Better Homes Studio proudly serves homeowners across London&apos;s
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
                      key={location}
                      href={`/contact?location=${encodeURIComponent(location)}`}
                      className={classes["location-link"]}
                    >
                      {location}
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
            "@type": "LocalBusiness",
            name: "Better Homes Studio",
            description:
              "Professional home renovation services across London including bathroom fitting, kitchen fitting, general refurbishment and extensions",
            url: "https://bhstudio.co.uk",
            telephone: "+447922391591",
            address: {
              "@type": "PostalAddress",
              addressLocality: "London",
              addressCountry: "GB",
            },
            areaServed: locations.map((location) => ({
              "@type": "City",
              name: location.name,
              addressRegion: "London",
              addressCountry: "GB",
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
                    description:
                      "Complete bathroom fitting and renovation services",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "Kitchen Renovation",
                    description:
                      "Professional kitchen fitting and renovation services",
                  },
                },
                {
                  "@type": "Offer",
                  itemOffered: {
                    "@type": "Service",
                    name: "General Renovation",
                    description:
                      "Complete home renovation and refurbishment services",
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
          }),
        }}
      />
    </section>
  );
};

export default WhereWeWork;
