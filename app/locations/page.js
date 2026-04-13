import Link from "next/link";

import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { getGroupedLocations, LONDON_LOCATIONS } from "@/libs/locations";
import classes from "./page.module.css";

const siteUrl = `https://${config.domainName}`;

export const metadata = getSEOTags({
  title: "London Areas We Serve | Better Homes",
  description:
    "Explore all London locations served by Better Homes for house extensions, loft conversions, and full home renovations.",
  canonicalUrlRelative: "/locations",
  openGraph: {
    title: "London Areas We Serve | Better Homes",
    description:
      "Dedicated service pages for London homeowners planning house extensions, loft conversions, and premium renovations.",
    url: `${siteUrl}/locations`,
  },
  keywords: [
    "London renovation company",
    "house extensions London",
    "loft conversions London",
    "full home renovation London",
  ],
});

export default function LocationsPage() {
  const groupedLocations = getGroupedLocations();
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "London Locations Served by Better Homes",
    itemListElement: LONDON_LOCATIONS.map((location, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: `${location.name}, ${location.area}`,
      url: `${siteUrl}/locations/${location.slug}`,
    })),
  };

  return (
    <main className={classes.page}>
      <section className={classes.hero}>
        <div className="container">
          <h1 className={classes.title}>London Areas We Serve</h1>
          <p className={classes.subtitle}>
            Dedicated local pages for homeowners planning high-quality house
            extensions, loft conversions, and full home renovations.
          </p>
        </div>
      </section>

      <section className={classes.content}>
        <div className="container">
          <div className={classes.grid}>
            {Object.entries(groupedLocations).map(([area, locations]) => (
              <article key={area} className={classes.card}>
                <h2 className={classes.areaTitle}>{area}</h2>
                <div className={classes.links}>
                  {locations.map((location) => (
                    <Link
                      key={location.slug}
                      href={`/locations/${location.slug}`}
                      className={classes.link}
                    >
                      {location.name}
                    </Link>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </main>
  );
}
