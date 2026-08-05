import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ArrowUpRight,
  Bath,
  CookingPot,
  Flame,
  Layers3,
  PanelsTopLeft,
} from "lucide-react";

import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import classes from "./page.module.css";

const siteUrl = `https://${config.domainName}`;

export const metadata = getSEOTags({
  title: "Our Trusted Brands & Suppliers | Better Homes",
  description:
    "Explore the bathroom, kitchen, appliance, flooring, window, door and heating brands Better Homes specifies and sources for London renovations.",
  canonicalUrlRelative: "/our-partners",
  openGraph: {
    title: "Our Trusted Brands & Suppliers | Better Homes",
    description:
      "Established manufacturers and specialist suppliers selected for dependable products, considered design and reliable aftercare.",
    url: `${siteUrl}/our-partners`,
  },
  keywords: [
    "renovation suppliers London",
    "bathroom brands UK",
    "kitchen suppliers UK",
    "window and door suppliers UK",
    "Better Homes suppliers",
  ],
});

const partnerGroups = [
  {
    id: "bathrooms",
    title: "Bathrooms",
    description:
      "Sanitaryware, brassware, furniture and fittings for bathrooms made to last.",
    icon: Bath,
    tone: "blue",
    partners: [
      {
        name: "Crosswater",
        href: "https://www.crosswater.co.uk/",
        domain: "crosswater.co.uk",
      },
      {
        name: "Arezzo",
        href: "https://www.victorianplumbing.co.uk/brands/arezzo",
        domain: "victorianplumbing.co.uk",
      },
      {
        name: "Victorian Plumbing",
        href: "https://www.victorianplumbing.co.uk/",
        domain: "victorianplumbing.co.uk",
      },
      {
        name: "Drench",
        href: "https://www.drench.co.uk/",
        domain: "drench.co.uk",
      },
      {
        name: "Bathroom Mountain",
        href: "https://www.bathroommountain.co.uk/",
        domain: "bathroommountain.co.uk",
      },
      {
        name: "C.P. Hart",
        href: "https://www.cphart.co.uk/",
        domain: "cphart.co.uk",
      },
      {
        name: "Lusso",
        href: "https://www.lussostone.com/",
        domain: "lussostone.com",
      },
      {
        name: "hansgrohe",
        href: "https://www.hansgrohe.co.uk/",
        domain: "hansgrohe.co.uk",
      },
      {
        name: "GROHE",
        href: "https://www.grohe.co.uk/",
        domain: "grohe.co.uk",
      },
    ],
  },
  {
    id: "kitchens-appliances",
    title: "Kitchens & appliances",
    description:
      "Cabinetry, workspaces and dependable appliances for the busiest room in the home.",
    icon: CookingPot,
    tone: "teal",
    partners: [
      {
        name: "Howdens",
        href: "https://www.howdens.com/",
        domain: "howdens.com",
      },
      {
        name: "Benchmarx",
        href: "https://www.benchmarxkitchens.co.uk/",
        domain: "benchmarxkitchens.co.uk",
      },
      {
        name: "Wren Kitchens",
        href: "https://www.wrenkitchens.com/",
        domain: "wrenkitchens.com",
      },
      {
        name: "Wickes",
        href: "https://www.wickes.co.uk/kitchen",
        domain: "wickes.co.uk",
      },
      {
        name: "IKEA",
        href: "https://www.ikea.com/gb/en/cat/kitchens-ka001/",
        domain: "ikea.com",
      },
      {
        name: "Magnet",
        href: "https://www.magnet.co.uk/",
        domain: "magnet.co.uk",
      },
      {
        name: "AO",
        href: "https://ao.com/",
        domain: "ao.com",
      },
      {
        name: "Appliances Direct",
        href: "https://www.appliancesdirect.co.uk/",
        domain: "appliancesdirect.co.uk",
      },
      {
        name: "NEFF",
        href: "https://www.neff-home.com/uk/",
        domain: "neff-home.com",
      },
      {
        name: "Bosch",
        href: "https://www.bosch-home.co.uk/",
        domain: "bosch-home.co.uk",
      },
      {
        name: "Miele",
        href: "https://www.miele.co.uk/",
        domain: "miele.co.uk",
      },
    ],
  },
  {
    id: "tiles-flooring",
    title: "Tiles & flooring",
    description:
      "Natural stone, porcelain, timber and resilient surfaces selected room by room.",
    icon: Layers3,
    tone: "violet",
    partners: [
      {
        name: "Topps Tiles",
        href: "https://www.toppstiles.co.uk/",
        domain: "toppstiles.co.uk",
      },
      {
        name: "UK Flooring Direct",
        href: "https://www.ukflooringdirect.co.uk/",
        domain: "ukflooringdirect.co.uk",
      },
      {
        name: "Mandarin Stone",
        href: "https://www.mandarinstone.com/",
        domain: "mandarinstone.com",
      },
      {
        name: "Porcelanosa",
        href: "https://www.porcelanosa.com/uk/",
        domain: "porcelanosa.com",
      },
      {
        name: "Ca' Pietra",
        href: "https://capietra.com/",
        domain: "capietra.com",
      },
      {
        name: "Tile Mountain",
        href: "https://www.tilemountain.co.uk/",
        domain: "tilemountain.co.uk",
      },
      {
        name: "Fired Earth",
        href: "https://www.firedearth.com/",
        domain: "firedearth.com",
      },
      {
        name: "Amtico",
        href: "https://www.amtico.com/",
        domain: "amtico.com",
      },
    ],
  },
  {
    id: "windows-doors",
    title: "Windows & doors",
    description:
      "Secure, energy-conscious glazing and doors for renovations, lofts and extensions.",
    icon: PanelsTopLeft,
    tone: "cyan",
    partners: [
      {
        name: "REHAU",
        href: "https://window.rehau.com/uk-en/",
        domain: "rehau.com",
      },
      {
        name: "VELUX",
        href: "https://www.velux.co.uk/",
        domain: "velux.co.uk",
      },
      {
        name: "Origin",
        href: "https://origin-global.com/",
        domain: "origin-global.com",
      },
      {
        name: "Internorm",
        href: "https://www.internorm.com/en-gb/",
        domain: "internorm.com",
      },
      {
        name: "Solidor",
        href: "https://www.solidor.co.uk/",
        domain: "solidor.co.uk",
      },
      {
        name: "Schüco",
        href: "https://www.schueco.com/uk/",
        domain: "schueco.com",
      },
      {
        name: "Vufold",
        href: "https://www.vufold.co.uk/",
        domain: "vufold.co.uk",
      },
      {
        name: "JB Kind",
        href: "https://www.jbkind.com/",
        domain: "jbkind.com",
      },
    ],
  },
  {
    id: "heating-finishing",
    title: "Heating & finishing",
    description:
      "Comfort, colour and finishing touches that make the completed space feel considered.",
    icon: Flame,
    tone: "orange",
    partners: [
      {
        name: "Only Radiators",
        href: "https://www.onlyradiators.co.uk/",
        domain: "onlyradiators.co.uk",
      },
      {
        name: "BestHeating",
        href: "https://www.bestheating.com/",
        domain: "bestheating.com",
      },
      {
        name: "Stelrad",
        href: "https://www.stelrad.com/",
        domain: "stelrad.com",
      },
      {
        name: "Zehnder",
        href: "https://www.zehnder.co.uk/en/",
        domain: "zehnder.co.uk",
      },
      {
        name: "Towelrads",
        href: "https://towelrads.com/",
        domain: "towelrads.com",
      },
      {
        name: "Dulux",
        href: "https://www.dulux.co.uk/en",
        domain: "dulux.co.uk",
      },
      {
        name: "Farrow & Ball",
        href: "https://www.farrow-ball.com/",
        domain: "farrow-ball.com",
      },
      {
        name: "Little Greene",
        href: "https://www.littlegreene.com/",
        domain: "littlegreene.com",
      },
    ],
  },
];

const allPartners = partnerGroups.flatMap((group) => group.partners);

function getLogoUrl(domain) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
}

function PartnerLink({ partner }) {
  return (
    <a
      href={partner.href}
      target="_blank"
      rel="noopener noreferrer"
      className={classes.partner}
      aria-label={`Visit ${partner.name} (opens in a new tab)`}
    >
      <span
        className={classes.partnerLogo}
        style={{ backgroundImage: `url("${getLogoUrl(partner.domain)}")` }}
        aria-hidden="true"
      />
      <span className={classes.partnerName}>{partner.name}</span>
      <ArrowUpRight className={classes.externalIcon} aria-hidden="true" />
    </a>
  );
}

export default function OurPartnersPage() {
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Brands and suppliers used by Better Homes",
    numberOfItems: allPartners.length,
    itemListElement: allPartners.map((partner, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: partner.name,
      url: partner.href,
    })),
  };

  return (
    <main className={classes.page}>
      <section className={`${classes.hero} container`}>
        <div className={classes.heroCopy}>
          <h1 className={classes.title}>
            Trusted names.
            <span> Beautifully built.</span>
          </h1>
          <p className={classes.lead}>
            We work with established manufacturers and specialist suppliers to
            source dependable products for every room.
          </p>
          <a href="#supplier-directory" className={classes.jumpLink}>
            Explore our supplier directory
            <ArrowRight aria-hidden="true" />
          </a>
        </div>

        <div
          className={classes.heroMosaic}
          aria-label="Better Homes renovation details"
        >
          <div className={`${classes.mosaicPanel} ${classes.mosaicKitchen}`}>
            <Image
              src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-kitchen.webp"
              alt="A finished Better Homes kitchen with pale cabinetry and oak flooring"
              fill
              priority
              sizes="(max-width: 920px) 85vw, 34vw"
            />
          </div>
          <div className={`${classes.mosaicPanel} ${classes.mosaicBathroom}`}>
            <Image
              src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-bathroom-basin-oval-mirror.webp"
              alt="A finished bathroom basin, mirror and wall-mounted brassware"
              fill
              priority
              sizes="(max-width: 920px) 40vw, 17vw"
            />
          </div>
          <div className={`${classes.mosaicPanel} ${classes.mosaicDoor}`}>
            <Image
              src="/assets/portfolio/extension-daniel-n19/daniel-home-extension-outside-door.webp"
              alt="Glazed double doors installed in a London home"
              fill
              priority
              sizes="(max-width: 920px) 40vw, 17vw"
            />
          </div>
        </div>
      </section>

      <div className={`${classes.trustLine} container`}>
        <span aria-hidden="true" />
        <p>Chosen for quality, availability and aftercare.</p>
        <span aria-hidden="true" />
      </div>

      <section
        id="supplier-directory"
        className={`${classes.directory} container`}
        aria-labelledby="directory-title"
      >
        <div className={classes.directoryIntro}>
          <h2 id="directory-title">The brands behind the finish</h2>
          <p>
            Every project is specified around the home, budget and brief. These
            are many of the names we turn to when choosing the right product for
            the job.
          </p>
        </div>

        <div className={classes.groups}>
          {partnerGroups.map((group) => {
            const CategoryIcon = group.icon;

            return (
              <article
                key={group.id}
                className={`${classes.group} ${classes[group.tone]}`}
              >
                <div className={classes.groupHeading}>
                  <div className={classes.categoryIcon} aria-hidden="true">
                    <CategoryIcon />
                  </div>
                  <div>
                    <h3>{group.title}</h3>
                    <p>{group.description}</p>
                  </div>
                </div>
                <div className={classes.partnerGrid}>
                  {group.partners.map((partner) => (
                    <PartnerLink key={partner.name} partner={partner} />
                  ))}
                </div>
              </article>
            );
          })}
        </div>

        <p className={classes.disclaimer}>
          Brand names and logos remain the property of their respective owners.
          Products are selected project by project, and availability can vary.
        </p>
      </section>

      <section className={`${classes.cta} container`}>
        <div>
          <h2>Planning a renovation?</h2>
          <p>
            We&apos;ll help you choose products that suit your home, priorities
            and budget.
          </p>
        </div>
        <Link href="/contact" className={classes.ctaButton}>
          Start your project
          <ArrowRight aria-hidden="true" />
        </Link>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
    </main>
  );
}
