/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import Image from "next/image";
import config from "@/config";
import { getSEOTags } from "@/libs/seo";
import { businessFacts } from "@/libs/businessFacts";
import ShareTools from "./ShareTools";
import styles from "./prices.module.css";

const SITE = `https://${config.domainName}`;
const UPDATED = "2026-10-30";
const UPDATED_LABEL = "30 October 2026";
const TITLE = "London Renovation Prices 2026: Extensions, Lofts, Kitchens | Better Homes";
const DESCRIPTION =
  "Every London renovation price in one place for 2026: extensions, lofts, kitchens, bathrooms, full renovations, fees and day rates, checked against Checkatrade, BCIS and more.";

export const metadata = getSEOTags({
  title: TITLE,
  description: DESCRIPTION,
  canonicalUrlRelative: "/prices",
  openGraph: {
    title: "London renovation prices 2026: the full price list",
    description:
      "What extensions, lofts, kitchens, bathrooms and full renovations really cost in London in 2026, all-in, with sources.",
    url: `${SITE}/prices`,
  },
  keywords: [
    "london renovation prices",
    "renovation costs london 2026",
    "house extension cost london",
    "loft conversion cost london",
    "building prices london",
  ],
});

const S = {
  checkatradeExt: ["Checkatrade, house extension costs (June 2026)", "https://www.checkatrade.com/blog/cost-guides/house-extension-cost/"],
  checkatradeLoft: ["Checkatrade, loft conversion costs (March 2026)", "https://www.checkatrade.com/blog/cost-guides/loft-conversion-cost/"],
  checkatradeKitchen: ["Checkatrade, new kitchen costs (March 2026)", "https://www.checkatrade.com/blog/cost-guides/new-kitchen-cost/"],
  checkatradeBespoke: ["Checkatrade, bespoke kitchen costs (October 2026)", "https://www.checkatrade.com/blog/cost-guides/bespoke-kitchen-cost/"],
  checkatradeFitting: ["Checkatrade, kitchen fitting costs (October 2026)", "https://www.checkatrade.com/blog/cost-guides/kitchen-fitting-cost/"],
  checkatradeBath: ["Checkatrade, new bathroom costs (March 2026)", "https://www.checkatrade.com/blog/cost-guides/new-bathroom-cost/"],
  checkatradeSide: ["Checkatrade, side return extension costs (September 2026)", "https://www.checkatrade.com/blog/cost-guides/side-return-extension-cost/"],
  checkatradeCellar: ["Checkatrade, cellar conversion costs (October 2026)", "https://www.checkatrade.com/blog/cost-guides/cellar-conversion-cost/"],
  checkatradeBoiler: ["Checkatrade, new boiler costs (October 2026)", "https://www.checkatrade.com/blog/cost-guides/new-boiler-cost/"],
  checkatradeUfh: ["Checkatrade, underfloor heating costs (June 2026)", "https://www.checkatrade.com/blog/cost-guides/underfloor-heating-cost/"],
  checkatradePartyWall: ["Checkatrade, party wall surveyor costs (June 2026)", "https://www.checkatrade.com/blog/cost-guides/party-wall-surveyor-cost/"],
  checkatradeArchitect: ["Checkatrade, architect fees (January 2025)", "https://www.checkatrade.com/blog/cost-guides/architect-fees/"],
  hrExt: ["Homebuilding & Renovating, extension costs (February 2026)", "https://www.homebuilding.co.uk/advice/how-much-does-an-extension-cost"],
  hrLoft: ["Homebuilding & Renovating, loft conversion costs (July 2026)", "https://www.homebuilding.co.uk/advice/loft-conversion-costs"],
  hrReno: ["Homebuilding & Renovating, house renovation costs (September 2026)", "https://www.homebuilding.co.uk/advice/house-renovation-costs"],
  hrBasement: ["Homebuilding & Renovating, basement conversion costs (January 2026)", "https://www.homebuilding.co.uk/advice/basement-conversion-costs"],
  hoa: ["HomeOwners Alliance, house extension costs (2026)", "https://hoa.org.uk/advice/guides-for-homeowners/for-owners/house-extension-costs/"],
  bcis: ["BCIS five-year forecast, via Specification Online (30 June 2026)", "https://specificationonline.co.uk/articles/2026-06-30/updated-five-year-construction-industry-forecast-revealed-by-bcis"],
  ons: ["ONS, construction output in Great Britain, August 2026 (15 October 2026)", "https://www.ons.gov.uk/businessindustryandtrade/constructionindustry/bulletins/constructionoutputingreatbritain/august2026"],
  ppApril: ["Planning Portal, fees rise 1 April 2026", "https://blog.planningportal.co.uk/2026/01/30/english-planning-application-fees-increase-on-1st-april-2026/"],
  ppDec: ["Planning Portal, fees rise 8 December 2026", "https://blog.planningportal.co.uk/2026/10/23/english-planning-application-fees-increase-on-8th-december-2026/"],
  nationwide: ["Nationwide research via The Intermediary (October 2025)", "https://theintermediary.co.uk/2025/10/loft-conversions-boost-home-value-by-up-to-24-nationwide-research-shows/"],
};

const Src = ({ id }) => (
  <a href={S[id][1]} target="_blank" rel="noopener noreferrer">
    {S[id][0].split(",")[0]}
  </a>
);

function Table({ caption, head, rows, highlight = [] }) {
  return (
    <div className={styles.tableWrap}>
      <table className={styles.table}>
        <caption>{caption}</caption>
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} scope="col">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={highlight.includes(i) ? styles.highlight : undefined}>
              {r.map((c, j) =>
                j === 0 ? (
                  <th key={j} scope="row">
                    {c}
                  </th>
                ) : (
                  <td key={j} className={typeof c === "string" && c.startsWith("£") ? styles.num : undefined}>
                    {c}
                  </td>
                ),
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const stats = [
  ["Rear extension, 20 m²", "£101,000", "finished, all-in", "#extensions"],
  ["Side return, 10 m²", "£64,500", "finished, all-in", "#extensions"],
  ["Rear dormer loft, 25 m²", "£80,000", "all-in", "#lofts"],
  ["Mansard loft, 32 m²", "£116,000", "all-in", "#lofts"],
  ["Mid-range kitchen", "£25,500", "fitted, 12 m²", "#kitchens"],
  ["Family bathroom", "£13,900", "mid-range, 5.5 m²", "#bathrooms"],
  ["Refurbishment", "£1,330/m²", "whole house", "#renovation"],
  ["Planning fee", "£548", "householder, England", "#fees"],
];

const toc = [
  ["how-to-read", "How to read these prices"],
  ["extensions", "House extensions"],
  ["lofts", "Loft conversions"],
  ["kitchens", "Kitchens"],
  ["bathrooms", "Bathrooms"],
  ["renovation", "Whole-house renovation"],
  ["basements", "Basements and cellars"],
  ["trades", "Day rates and smaller jobs"],
  ["fees", "Professional and council fees"],
  ["national-vs-london", "National averages vs London quotes"],
  ["london-premium", "What your postcode adds"],
  ["market", "Where prices are heading"],
  ["value", "What adds value"],
  ["method", "How we put this together"],
  ["faqs", "FAQs"],
];

const faqs = [
  {
    q: "How much does a house extension cost in London in 2026?",
    a: "About £101,000 all-in for a finished 20 m² single-storey rear extension in outer London, including design, fees, party wall, a 10% contingency and VAT. A 3 m deep rear extension of 13.5 m² is about £72,500, and a 10 m² side return about £64,500.",
  },
  {
    q: "What is the cost per square metre to extend a house in London?",
    a: "About £3,370 per m² to build a finished single-storey rear extension before VAT and fees, or £5,000 to £5,400 per m² all-in. National guides quote £1,800 to £3,300 per m² before VAT, and Homebuilding & Renovating adds 25 to 35% for London.",
  },
  {
    q: "How much does a loft conversion cost in London?",
    a: "About £50,000 for a Velux loft, £80,000 for a rear dormer, £88,000 for a hip-to-gable and £116,000 for a mansard, all-in for a standard finish in outer London.",
  },
  {
    q: "How much does a new kitchen cost in London?",
    a: "About £25,500 fitted for a 12 m² mid-range kitchen such as Howdens with quartz worktops, including electrics, flooring, contingency and VAT. Flat-pack is about £17,400 and bespoke about £55,000.",
  },
  {
    q: "How much does a bathroom renovation cost in London?",
    a: "About £13,900 all-in for a 5.5 m² family bathroom with mid-range products, keeping the layout. A cloakroom is about £6,200, an en-suite £12,000 and a wet room £16,800.",
  },
  {
    q: "How much does it cost to renovate a house in London per m²?",
    a: "About £566 per m² for a cosmetic refresh, £1,330 per m² for a mid-range refurbishment with a new kitchen and bathroom, and £2,600 per m² for a full renovation with rewiring, replumbing, new heating and replastering, all-in.",
  },
  {
    q: "How much more expensive is building work in London?",
    a: "Homebuilding & Renovating puts the London and South East premium at 25 to 35% for extensions. Within London, the same loft costs about 19% more in zone 1 than in zones 5 to 6.",
  },
  {
    q: "How much does a basement cost in London?",
    a: "About £207,000 all-in for a new 30 m² basement dug under an outer London terrace, or £6,900 per m², including fees, contingency and VAT. Converting an existing cellar costs much less.",
  },
  {
    q: "Are building costs still rising in 2026?",
    a: "Yes, slowly. BCIS recorded tender prices up 3.2% in the year to the second quarter of 2026 and building costs up 3.8%. It forecasts tender prices up 15.5% over the five years to 2031.",
  },
];

export default function PricesPage() {
  const citation = `Better Homes (2026). London renovation prices 2026. ${SITE}/prices. Updated ${UPDATED_LABEL}.`;
  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": `${SITE}/prices#webpage`,
        url: `${SITE}/prices`,
        name: "London renovation prices 2026",
        description: DESCRIPTION,
        datePublished: UPDATED,
        dateModified: UPDATED,
        inLanguage: "en-GB",
        publisher: { "@id": `${SITE}/#organization` },
        primaryImageOfPage: `${SITE}/assets/prices/london-renovation-prices-2026.png`,
      },
      {
        "@type": "Dataset",
        name: "London renovation prices 2026",
        description:
          "All-in London prices for house extensions, loft conversions, kitchens, bathrooms and whole-house renovations in 2026, from the Better Homes price book, compared with published national averages.",
        url: `${SITE}/prices`,
        creator: { "@id": `${SITE}/#organization` },
        dateModified: UPDATED,
        temporalCoverage: "2026",
        spatialCoverage: { "@type": "Place", name: "London, United Kingdom" },
        isAccessibleForFree: true,
        variableMeasured: ["House extension cost", "Loft conversion cost", "Kitchen cost", "Bathroom cost", "Renovation cost per square metre", "Professional fees"],
        citation: Object.values(S).map(([name, url]) => ({ "@type": "CreativeWork", name, url })),
      },
      {
        "@type": "FAQPage",
        mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
      },
    ],
  };

  return (
    <main>
      <div className="bh-wrap">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />

      <section className={styles.hero}>
        <p className={styles.updated}>Updated {UPDATED_LABEL} · London price list</p>
        <h1 className="bh-title" style={{ maxWidth: 940, marginBottom: 16 }}>
          London renovation prices 2026
        </h1>
        <p className={styles.capsule}>
          In London in 2026, a finished 20 m² rear extension costs about £101,000
          all-in, a rear dormer loft £80,000, a mid-range fitted kitchen £25,500
          and a family bathroom £13,900. A whole-house refurbishment runs about
          £1,330 per m². These include design, fees, contingency and VAT.
        </p>
        <ShareTools citation={citation} />
        <div className={styles.stats}>
          {stats.map(([label, value, note, href]) => (
            <a key={label} className={styles.stat} href={href}>
              <p className={styles.statLabel}>{label}</p>
              <p className={styles.statValue}>{value}</p>
              <p className={styles.statNote}>{note}</p>
            </a>
          ))}
        </div>
        <nav aria-label="On this page">
          <ul className={styles.toc}>
            {toc.map(([id, label]) => (
              <li key={id}>
                <a href={`#${id}`}>{label}</a>
              </li>
            ))}
          </ul>
        </nav>
      </section>

      <section id="how-to-read" className={styles.section}>
        <h2>How to read these prices</h2>
        <p className={styles.answer}>
          <strong>
            Every London figure on this page is the full cost of the project,
            not the builder's headline.
          </strong>{" "}
          That means design, engineer, building control, planning, party wall, a
          contingency and 20% VAT, for an outer London (zone 3) home.
        </p>
        <div className={styles.prose}>
          <p>
            Most price guides quote the build alone, before VAT, for the UK as a
            whole. That's useful, but it isn't what you'll pay in Walthamstow or
            Hackney. A London rear extension that a national guide prices at
            £48,000 ends up nearer £101,000 once London rates, fees, contingency
            and VAT are in. The{" "}
            <a href="#national-vs-london">national vs London table</a> shows the
            sum line by line.
          </p>
          <p>
            The London figures come from the 2026 price book behind our{" "}
            <Link href="/tools">cost calculators</Link>, which we keep in line with
            the prices we quote. Next to them you'll see what the biggest
            national publishers say, linked so you can check them yourself.
          </p>
        </div>
        <figure className={styles.figure}>
          <Image
            src="/assets/prices/london-renovation-prices-2026.png"
            alt="London renovation prices 2026 summary: rear extension £101,000, side return £64,500, rear dormer loft £80,000, mansard loft £116,000, mid-range kitchen £25,500, family bathroom £13,900, all-in including VAT"
            width={1200}
            height={980}
          />
          <figcaption>
            The headline London prices in one chart. Free to share with a link
            back to this page.
          </figcaption>
        </figure>
      </section>

      <section id="extensions" className={styles.section}>
        <h2>House extension prices in London</h2>
        <p className={styles.answer}>
          <strong>
            A finished single-storey rear extension costs about £5,000 to £5,400
            per m² all-in in London. Smaller jobs cost more per m², because the
            fees and steelwork don't shrink with the room.
          </strong>
        </p>
        <Table
          caption="London extension prices 2026: outer London terrace, finished, large glazed doors, no kitchen, all-in including VAT"
          head={["Project", "New floor", "Typical all-in", "Likely range", "Per m²"]}
          rows={[
            ["Side return", "10 m²", "£64,500", "£59,000–£74,500", "£6,450"],
            ["Rear extension, 3 m deep", "13.5 m²", "£72,500", "£66,000–£84,000", "£5,370"],
            ["Rear extension", "20 m²", "£101,000", "£92,500–£117,000", "£5,070"],
            ["Rear extension", "30 m²", "£136,000", "£124,000–£157,000", "£4,530"],
            ["Wraparound", "25 m²", "£131,000", "£120,000–£151,000", "£5,240"],
            ["Double storey", "40 m²", "£154,000", "£141,000–£178,000", "£3,850"],
            ["Add a new mid-range kitchen", "", "+£21,000 to £22,000", "", ""],
          ]}
        />
        <Table
          caption="What national publishers say (UK, build only, before VAT)"
          head={["Source", "Single storey", "Side return", "Double storey"]}
          rows={[
            [<Src key="a" id="checkatradeExt" />, "£1,800–£3,000/m²; 20 m² average £48,000", "£1,500–£4,500/m² (Checkatrade side return guide)", "£108,000–£180,000 for 60 m²"],
            [<Src key="b" id="hrExt" />, "£2,200–£3,300/m²", "£2,800–£3,800/m²", "£2,000–£3,200/m²"],
            [<Src key="c" id="hoa" />, "£2,300–£3,400/m² in London", "", "From £1,900/m²"],
          ]}
        />
        <p className={styles.note}>
          Homebuilding & Renovating adds 25 to 35% for London and the South East
          (20 to 25% for side returns). Our build cost for a 20 m² rear extension
          works out at £3,371 per m² before VAT and fees, inside that adjusted
          range.
        </p>
        <div className={styles.links}>
          <Link href="/extension-calculator">Extension cost calculator</Link>
          <Link href="/blog/single-storey-extension-cost-london">Single-storey extension costs</Link>
          <Link href="/blog/side-return-extension-cost-london">Side return costs</Link>
          <Link href="/blog/kitchen-extension-cost-london">Kitchen extension costs</Link>
          <Link href="/house-extension">House extensions</Link>
        </div>
      </section>

      <section id="lofts" className={styles.section}>
        <h2>Loft conversion prices in London</h2>
        <p className={styles.answer}>
          <strong>
            Budget £50,000 for a Velux loft and £80,000 to £116,000 for a dormer,
            hip-to-gable or mansard, all-in.
          </strong>{" "}
          The roof you start with decides which of those you can build.
        </p>
        <Table
          caption="London loft conversion prices 2026: outer London, standard finish, no en-suite, all-in including VAT"
          head={["Loft type", "New floor", "Typical all-in", "Likely range", "Weeks on site"]}
          rows={[
            ["Velux (rooflight)", "22 m²", "£50,000", "£45,000–£58,000", "6–8"],
            ["Rear dormer", "25 m²", "£80,000", "£72,000–£93,000", "8–10"],
            ["Hip-to-gable (semi)", "30 m²", "£88,000", "£79,000–£102,000", "9–11"],
            ["L-shaped dormer", "32 m²", "£95,000", "£85,500–£110,000", "10–12"],
            ["Mansard", "32 m²", "£116,000", "£104,000–£134,000", "12–16"],
            ["Add an en-suite", "", "+£12,500", "", ""],
          ]}
        />
        <Table
          caption="What national publishers say (UK)"
          head={["Source", "Velux", "Dormer", "Hip-to-gable", "Mansard"]}
          rows={[
            [<Src key="a" id="checkatradeLoft" />, "£27,500", "£50,000", "£60,000", "£65,000"],
            [<Src key="b" id="hrLoft" />, "£30,000–£45,000", "£45,000–£75,000", "£55,000–£85,000", "£70,000–£120,000+"],
          ]}
        />
        <p className={styles.note}>
          Checkatrade's figures are for 30 m² and say London homeowners should
          expect the upper end of each range. Its own breakdown of a £50,000
          dormer includes £6,000 of steelwork and £4,750 of scaffolding.
        </p>
        <div className={styles.links}>
          <Link href="/loft-conversion-cost-calculator">Loft cost calculator</Link>
          <Link href="/blog/loft-conversion-cost-london">Loft conversion cost guide</Link>
          <Link href="/loft-conversion">Loft conversions</Link>
        </div>
      </section>

      <section id="kitchens" className={styles.section}>
        <h2>Kitchen prices in London</h2>
        <p className={styles.answer}>
          <strong>
            A fitted mid-range kitchen costs about £25,500 in London. The range
            you choose moves the price more than anything else: £17,400 for
            flat-pack, £55,000 for bespoke.
          </strong>
        </p>
        <Table
          caption="London kitchen prices 2026: 12 m² L-shaped kitchen, fitted with electrics and flooring, all-in including VAT"
          head={["Kitchen range", "Typical all-in", "Likely range"]}
          rows={[
            ["Value (IKEA and flat-pack, laminate worktops)", "£17,400", "£15,100–£20,500"],
            ["Mid-range (Howdens, Wren, Magnet, quartz)", "£25,500", "£22,000–£30,000"],
            ["Premium (German and high-end British)", "£37,000", "£32,500–£44,000"],
            ["Bespoke, hand-painted", "£55,000", "£47,500–£64,500"],
          ]}
          highlight={[1]}
        />
        <Table
          caption="What national publishers say (UK)"
          head={["Source", "Figure"]}
          rows={[
            [<Src key="a" id="checkatradeKitchen" />, "New kitchen average £10,550 (£5,250 small to £28,400 large)"],
            [<Src key="b" id="checkatradeBespoke" />, "Bespoke kitchen £20,000–£75,000, average £47,500"],
            [<Src key="c" id="checkatradeFitting" />, "Fitting an average family kitchen £2,000–£6,000; fitter £280–£360 a day"],
            [<Src key="d" id="hrReno" />, "New kitchen £10,000–£15,000; basic £8,000; high-end £25,000+"],
          ]}
        />
        <div className={styles.links}>
          <Link href="/kitchen-calculator">Kitchen cost calculator</Link>
          <Link href="/blog/kitchen-renovation-full-guide-2025">Kitchen renovation cost guide</Link>
          <Link href="/blog/bespoke-vs-howdens-vs-ikea-kitchen-london">Bespoke vs Howdens vs IKEA</Link>
        </div>
      </section>

      <section id="bathrooms" className={styles.section}>
        <h2>Bathroom prices in London</h2>
        <p className={styles.answer}>
          <strong>
            A family bathroom with mid-range products costs about £13,900
            all-in in London, keeping the layout. Labour is most of it.
          </strong>
        </p>
        <Table
          caption="London bathroom prices 2026: keeping the layout, half-height tiling, all-in including VAT"
          head={["Room", "Typical size", "Essential products", "Mid-range products", "Premium products"]}
          rows={[
            ["Cloakroom", "2.5 m²", "£5,100", "£6,200", "£8,400"],
            ["En-suite", "4 m²", "£9,100", "£12,000", "£17,700"],
            ["Family bathroom", "5.5 m²", "£10,800", "£13,900", "£20,000"],
            ["Wet room", "5 m²", "£13,200", "£16,800", "£24,000"],
          ]}
          highlight={[2]}
        />
        <Table
          caption="What national publishers say (UK)"
          head={["Source", "Figure"]}
          rows={[
            [<Src key="a" id="checkatradeBath" />, "Renovation with materials £5,500–£8,000, average £7,000; high end £14,000+"],
            [<Src key="b" id="hrReno" />, "Bathroom £5,000–£7,500; en-suite £4,000–£6,000"],
          ]}
        />
        <div className={styles.links}>
          <Link href="/tools/bathroom-cost-calculator">Bathroom cost calculator</Link>
          <Link href="/blog/bathroom-renovation-cost-2025">Bathroom renovation cost guide</Link>
          <Link href="/bathroom-renovation">Bathroom renovations</Link>
        </div>
      </section>

      <section id="renovation" className={styles.section}>
        <h2>Whole-house renovation prices in London</h2>
        <p className={styles.answer}>
          <strong>
            Renovating a London house costs about £566 per m² for a cosmetic
            refresh, £1,330 for a mid-range refurbishment and £2,600 for a full
            renovation, all-in.
          </strong>{" "}
          On a 100 m² three-bed terrace, that's £56,500 to £260,000.
        </p>
        <Table
          caption="London renovation prices 2026: 100 m² Victorian terrace, outer London, standard finish, all-in including VAT"
          head={["Level", "What's included", "Typical all-in", "Per m²"]}
          rows={[
            ["Cosmetic refresh", "Decoration and new floors", "£56,500", "£566"],
            ["Mid-range refurbishment", "New kitchen and bathroom, rewire, heating, plastering, decoration", "£133,000", "£1,330"],
            ["Full renovation", "Everything above plus replumbing and new doors throughout", "£260,000", "£2,600"],
            ["Back to brick", "Strip to the shell and rebuild inside, with damp and repairs", "£346,000", "£3,460"],
          ]}
          highlight={[1]}
        />
        <h3>Item by item: Homebuilding & Renovating's 2026 figures</h3>
        <Table
          caption="Typical UK costs for a three-bed house. For London, add 25 to 35% and check whether VAT is included."
          head={["Job", "Typical UK cost"]}
          rows={[
            ["Full renovation, three-bed semi", "£70,000–£110,000"],
            ["Rewiring", "£4,000–£6,500"],
            ["New heating system", "£5,000–£7,000"],
            ["Replastering", "£4,500–£7,000"],
            ["New windows, uPVC", "£6,000–£8,000"],
            ["New windows, aluminium or timber", "£9,000–£14,000"],
            ["New main roof", "£8,000–£12,000, plus £1,500–£3,000 scaffolding"],
            ["Flooring", "£4,000–£6,500"],
            ["Damp proofing", "£2,000–£5,000"],
            ["Painting and decorating", "£3,000–£5,000"],
          ]}
        />
        <p className={styles.note}>
          Source: <Src id="hrReno" />. With a 30% London premium and VAT, their
          full-renovation range becomes about £109,000 to £172,000, which
          brackets our £133,000 refurbishment.
        </p>
        <div className={styles.links}>
          <Link href="/renovation-calculator">Renovation cost calculator</Link>
          <Link href="/blog/home-renovation-cost-london-2026">Home renovation cost guide</Link>
          <Link href="/general-renovation">Full home renovations</Link>
        </div>
      </section>

      <section id="basements" className={styles.section}>
        <h2>Basement and cellar prices</h2>
        <p className={styles.answer}>
          <strong>
            A new basement under a London terrace costs about £207,000 all-in
            for 30 m², or £6,900 per m². Converting a cellar you already have
            costs far less: £1,000 to £2,200 per m² nationally, before VAT.
          </strong>
        </p>
        <Table
          caption="London new basement prices 2026: dug under an outer London terrace, finished, all-in including VAT"
          head={["New floor", "Typical all-in", "Likely range", "Per m²"]}
          rows={[
            ["20 m²", "£154,000", "£140,000–£180,000", "£7,680"],
            ["30 m²", "£207,000", "£188,000–£242,000", "£6,900"],
            ["40 m²", "£270,000", "£246,000–£316,000", "£6,760"],
          ]}
        />
        <Table
          caption="What national publishers say (UK, before VAT unless stated)"
          head={["Work", "Homebuilding & Renovating", "Checkatrade"]}
          rows={[
            ["Convert an existing cellar", "£1,275–£1,600/m²", "£1,000–£2,200/m², average £1,600 (plus VAT)"],
            ["Lower the floor and reinforce", "£1,650–£2,250/m²", ""],
            ["Underpin and dig a new basement", "£2,250–£4,250/m²", "£1,920–£3,680/m², average £2,800 (plus VAT)"],
            ["New basement under the garden", "£1,950–£2,500/m²", ""],
            ["Lightwell or external access", "£6,100–£10,500", ""],
            ["Typical 40 m² basement", "", "£100,000–£160,000"],
          ]}
        />
        <p className={styles.note}>
          Sources: <Src id="hrBasement" />, <Src id="checkatradeCellar" />, <Src id="checkatradeExt" />.
          Our build cost works out at about £4,200 per m² before VAT and fees,
          inside the national new-basement range once you add 25 to 35% for
          London. Basements also need party wall awards with both neighbours,
          structural design and often a construction management plan, so we
          fix every basement price after a survey;{" "}
          <Link href="/basement-conversion">see how we work</Link>.
        </p>
      </section>

      <section id="trades" className={styles.section}>
        <h2>Day rates and smaller jobs</h2>
        <p className={styles.answer}>
          <strong>
            Trades charge about £235 to £400 a day on national averages, from a
            decorator to an electrician. Expect more in London.
          </strong>
        </p>
        <Table
          caption="Day rates and typical job prices (UK averages)"
          head={["Trade or job", "Price", "Source"]}
          rows={[
            ["Electrician", "£400 a day", <Src key="a" id="hrExt" />],
            ["Plumber", "£350 a day", <Src key="b" id="hrExt" />],
            ["Tiler", "£300 a day", <Src key="c" id="hrExt" />],
            ["Decorator", "£235 a day", <Src key="d" id="hrExt" />],
            ["Kitchen fitter", "£280–£360 a day", <Src key="e" id="checkatradeFitting" />],
            ["New gas combi boiler, fitted", "£3,000 average", <Src key="f" id="checkatradeBoiler" />],
            ["Wet underfloor heating in a renovation", "£95–£110 per m²", <Src key="g" id="checkatradeUfh" />],
            ["Bathroom wall tiling", "£950–£1,250", <Src key="h" id="checkatradeBath" />],
            ["Skip hire for a kitchen strip-out", "£200–£250 a week", <Src key="i" id="checkatradeFitting" />],
          ]}
        />
        <p className={styles.note}>
          Homebuilding & Renovating quotes the day rates from Checkatrade. These
          are national averages: expect the top of each range, or above it, in
          inner London.
        </p>
      </section>

      <section id="fees" className={styles.section}>
        <h2>Professional and council fees in 2026</h2>
        <p className={styles.answer}>
          <strong>
            Fees add £6,000 to £11,000 to a typical extension or loft before VAT.
            The council's householder planning fee is £548 from 1 April 2026.
          </strong>
        </p>
        <Table
          caption="Fees for a London extension or loft, 2026"
          head={["Fee", "Typical cost", "Source"]}
          rows={[
            ["Householder planning application (England)", "£548", <Src key="a" id="ppApril" />],
            ["Lawful development certificate, proposed", "£274 (half the householder fee)", <Src key="b" id="ppApril" />],
            ["Building control, extension", "£600–£1,200", <Src key="c" id="hrExt" />],
            ["Architect, planning drawings, single storey", "£1,000–£2,500", <Src key="d" id="checkatradeArchitect" />],
            ["Architect, building regs drawings, single storey", "£3,000–£5,000", <Src key="e" id="checkatradeArchitect" />],
            ["Structural engineer", "£750–£2,500", <Src key="f" id="hrLoft" />],
            ["Party wall award, loft", "£1,575", <Src key="g" id="checkatradePartyWall" />],
            ["Party wall award, extension", "£2,025", <Src key="h" id="checkatradePartyWall" />],
            ["Party wall award, basement", "£3,375", <Src key="i" id="checkatradePartyWall" />],
          ]}
        />
        <p className={styles.note}>
          Planning fees in England rose 3.8% on 1 April 2026 and are due to rise
          again from 8 December 2026, once the legislation is approved, so that
          councils recover at least 90% of their costs (<Src id="ppDec" />). Some
          guides still quote the old £258 fee.
        </p>
      </section>

      <section id="national-vs-london" className={styles.section}>
        <h2>From a national average to a London quote</h2>
        <p className={styles.answer}>
          <strong>
            A national average and a London quote can both be right and still be
            £50,000 apart. Here's where the gap comes from.
          </strong>
        </p>
        <Table
          caption="National averages adjusted for London, compared with our London price book"
          head={["Project", "UK average (Checkatrade, before VAT)", "Plus 30% for London", "Our London build cost (before VAT and fees)", "Our London all-in"]}
          rows={[
            ["Rear extension, 20 m²", "£48,000", "£62,400", "£67,420", "£101,000"],
            ["Dormer loft, 30 m²", "£50,000", "£65,000", "£58,200", "£89,000"],
            ["Mid-range kitchen", "£10,550", "£13,700", "£19,260", "£25,500"],
            ["Family bathroom", "£7,000", "£9,100", "£10,740", "£13,900"],
          ]}
        />
        <div className={styles.prose}>
          <p>
            The first two columns are the market. The third is what we'd charge
            to build it in London before VAT, and it lands close to the national
            figure plus a London premium. The last column is what you actually
            pay, once the architect, engineer, building control, party wall
            surveyors, a 10% contingency and VAT are added.
          </p>
          <p>
            Our kitchen and bathroom figures sit higher than the adjusted
            national ones because they include things national averages leave
            out: quartz worktops, strip-out, electrics, flooring and making good.
            When you compare quotes, compare the last column.
          </p>
        </div>
      </section>

      <section id="london-premium" className={styles.section}>
        <h2>What your postcode adds</h2>
        <p className={styles.answer}>
          <strong>
            The same loft costs about 19% more in central London than at the
            edge, and about 40% more in zone 1 than in the Midlands.
          </strong>{" "}
          Access, parking and permits, and day rates all rise towards the centre.
        </p>
        <Table
          caption="The same project priced across London, all-in including VAT"
          head={["Location", "Rear dormer loft with en-suite, 25 m²", "Side return, 10 m²", "3 m kitchen extension with new kitchen"]}
          rows={[
            ["Zone 1", "£105,000", "£68,000", "£97,500"],
            ["Zone 2", "£98,000", "£66,000", ""],
            ["Zone 3", "£92,500", "£64,500", "£93,500"],
            ["Zone 4", "£90,000", "£63,000", ""],
            ["Zone 5–6", "£88,500", "£62,500", "£91,000"],
            ["The Midlands, for comparison", "£75,000", "£56,500", ""],
          ]}
        />
        <p className={styles.note}>
          A street with no parking and materials carried through the house adds
          about £4,000 to an extension in any zone.
        </p>
      </section>

      <section id="market" className={styles.section}>
        <h2>Where London building prices are heading</h2>
        <p className={styles.answer}>
          <strong>
            Up, but slowly. Tender prices rose 3.2% in the year to mid-2026, and
            BCIS expects about 15.5% over the next five years.
          </strong>
        </p>
        <Table
          caption="Building price indicators, 2026"
          head={["Indicator", "Latest figure", "Source"]}
          rows={[
            ["BCIS All-in Tender Price Index, annual change", "+3.2% (Q2 2026)", <Src key="a" id="bcis" />],
            ["BCIS General Building Cost Index, annual change", "+3.8% (Q2 2026)", <Src key="b" id="bcis" />],
            ["BCIS tender price forecast, rest of 2026", "+2.9%", <Src key="c" id="bcis" />],
            ["BCIS tender price forecast, five years to Q2 2031", "+15.5%", <Src key="d" id="bcis" />],
            ["Repair and maintenance output, three months to August 2026", "−0.3%", <Src key="e" id="ons" />],
            ["Householder planning fee", "+3.8% on 1 April 2026; rising again 8 December 2026", <Src key="f" id="ppDec" />],
          ]}
        />
        <div className={styles.prose}>
          <p>
            What this means for you: a quote you get today will probably cost 3%
            more if you wait a year. Building costs are rising faster than
            tender prices because builders are absorbing some of it while work
            is quiet. BCIS expects more of that to reach clients later. If your
            plans are ready, a quiet market is a good time to get fixed prices.
          </p>
        </div>
      </section>

      <section id="value" className={styles.section}>
        <h2>What adds value</h2>
        <p className={styles.answer}>
          <strong>
            A loft or extension that adds a double bedroom and a bathroom can add
            up to 24% to a three-bed home, according to Nationwide.
          </strong>
        </p>
        <Table
          caption="Nationwide research on value uplift (published October 2025)"
          head={["Change", "Added value"]}
          rows={[
            ["Double bedroom and bathroom on a three-bed, one-bath house", "Up to 24%"],
            ["Extra double bedroom on a two-bed house", "Up to 13%"],
            ["10% more floor space", "About 5%"],
          ]}
        />
        <p className={styles.note}>
          Source: <Src id="nationwide" />. These are upper bounds, not promises.
          On a £650,000 terrace, 5% more value for 10% more floor is about
          £32,500, so plan for the space and the layout, not the profit.{" "}
          <Link href="/blog/house-extension-value-london-guide">Our guide to what adds value</Link>{" "}
          has the detail.
        </p>
      </section>

      <section id="method" className={styles.section}>
        <h2>How we put this together</h2>
        <div className={styles.prose}>
          <p>
            The London prices come from the Better Homes 2026 price book, the
            same one behind our calculators. Each figure assumes an outer London
            (zone 3) terraced house, a standard finish, access through the house
            and the professional fees a project of that size needs. Ranges show
            a sensible low and high for the same scope, not best and worst cases.
          </p>
          <p>
            The national figures were read directly from each publisher on 30
            October 2026, with the date they show. We've kept their numbers as
            published and said where they exclude VAT. We update this page when
            our price book or a major source changes.
          </p>
          <p>
            Better Homes has built London homes for {businessFacts.experience},
            with a {businessFacts.reviews.rating} rating on Houzz. Every price here is a planning figure: your quote
            will be fixed once a survey and drawings are done.
          </p>
        </div>
        <ShareTools citation={citation} showCite />
      </section>

      <section id="faqs" className={styles.section}>
        <h2>London renovation price FAQs</h2>
        <div className={styles.faq}>
          {faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <section className={styles.section}>
        <h2>Sources</h2>
        <ol className={styles.sources}>
          {Object.values(S).map(([name, url]) => (
            <li key={url}>
              <a href={url} target="_blank" rel="noopener noreferrer">
                {name}
              </a>
            </li>
          ))}
        </ol>
      </section>

      </div>
      <section className="bh-dark">
        <div className="bh-wrap bh-section">
          <p className="bh-eyebrow">From price list to fixed price</p>
          <h2 className="bh-heading">Get the number for your home</h2>
          <p className="bh-lead">
            Run your own project through our free calculators, or send us your
            brief for an itemised quote. One construction contract, one team on
            site, and a workmanship guarantee of up to 10 years on structural
            work.
          </p>
          <div className="bh-actions">
            <Link className="bh-button" href="/contact#brief">
              Send us your brief
            </Link>
            <Link className="bh-text-link" href="/tools">
              Use the calculators
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
