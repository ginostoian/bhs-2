/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import ArticleCta from "../components/ArticleCta";

const styles = {
  h2: "mb-4 mt-10 text-2xl font-bold tracking-tight text-black lg:text-4xl",
  h3: "mb-2 mt-7 text-xl font-bold tracking-tight text-black lg:text-2xl",
  p: "mb-6 leading-relaxed text-base-content/90",
  ul: "mb-6 list-disc space-y-2 pl-6 leading-relaxed text-base-content/90",
  answerCapsule:
    "mb-8 rounded-2xl border border-[#4D5B4B]/20 bg-[#F4F1EA] p-6 shadow-sm md:p-7",
  tocGrid: "mb-10 grid gap-5 md:grid-cols-2",
  tocColumn: "overflow-hidden rounded-xl border border-base-content/10 bg-white",
  tocLink:
    "block border-b border-base-content/10 px-4 py-3 text-sm leading-relaxed text-base-content/90 transition hover:bg-[#F4F1EA] hover:text-[#4D5B4B] last:border-b-0 md:text-base",
  figure:
    "my-8 overflow-hidden rounded-2xl border border-base-content/10 bg-white p-4 shadow-sm md:p-6",
  image: "h-auto w-full rounded-xl",
  figcaption: "mt-3 text-sm leading-relaxed text-base-content/70",
  tableWrap: "my-8 overflow-x-auto",
};

const IMG = "/assets/blog/loft-conversion-cost-london";

const toc = [
  ["how-much", "How much a loft conversion costs in London"],
  ["cost-by-type", "Loft conversion cost by type"],
  ["quote-vs-all-in", "Why a £51,000 quote becomes an £80,000 loft"],
  ["fees", "Professional and council fees in 2026"],
  ["cost-by-zone", "What your postcode adds"],
  ["house-type", "Which loft suits your house"],
  ["per-m2", "Loft conversion cost per m²"],
  ["price-drivers", "What pushes the price up"],
  ["30k", "Can you do a loft conversion for £30k?"],
  ["planning", "Planning permission and the 10-year rule"],
  ["timeline", "How long a loft conversion takes"],
  ["value", "Does a loft conversion add value?"],
  ["saving", "How to bring the cost down"],
  ["accurate-price", "How to get a price you can rely on"],
  ["faqs", "FAQs"],
];

export default function LoftConversionCostLondonArticle() {
  const half = Math.ceil(toc.length / 2);
  return (
    <article>
      <div className={styles.answerCapsule}>
        <p className={styles.p}>
          A loft conversion in London costs £50,000 to £116,000 all-in in 2026
          for a standard finish in outer London. A Velux loft is around £50,000,
          a rear dormer £80,000, a hip-to-gable £88,000, an L-shaped dormer
          £95,000 and a mansard £116,000. These figures include design, fees,
          party wall, a 10% contingency and VAT.
        </p>
      </div>

      <h2 className={styles.h2} id="key-takeaways">
        Key takeaways
      </h2>
      <ul className={styles.ul}>
        <li>
          <strong>A rear dormer is the London default:</strong> about £80,000
          all-in for 25 m², or £92,500 with an en-suite.
        </li>
        <li>
          <strong>Builders quote the build, not the project.</strong> A
          £51,000 dormer quote ex VAT typically becomes £80,000 once drawings,
          engineer, building control, party wall, contingency and VAT are added.
        </li>
        <li>
          <strong>Postcode matters:</strong> the same dormer and en-suite costs
          about £88,500 in zone 5–6 and £105,000 in zone 1.
        </li>
        <li>
          <strong>Your house decides the type.</strong> Victorian terraces
          with a back addition suit an L-shaped dormer; 1930s semis suit
          hip-to-gable.
        </li>
        <li>
          <strong>Most lofts on houses are permitted development</strong>, but
          not in conservation areas, and never on flats.
        </li>
        <li>
          <strong>Each extra m² of dormer adds about £1,840</strong> all-in,
          because the stairs, steels and scaffold cost the same whatever the
          size.
        </li>
        <li>
          <strong>Value:</strong> Nationwide found a double bedroom and
          bathroom can add up to 24% to a three-bed home.
        </li>
      </ul>

      <h2 className={styles.h2} id="contents">
        What this guide covers
      </h2>
      <div className={styles.tocGrid}>
        {[toc.slice(0, half), toc.slice(half)].map((col, i) => (
          <div key={i} className={styles.tocColumn}>
            {col.map(([id, label]) => (
              <Link key={id} className={styles.tocLink} href={`#${id}`}>
                {label}
              </Link>
            ))}
          </div>
        ))}
      </div>

      <h2 className={styles.h2} id="how-much">
        How much does a loft conversion cost in London in 2026?
      </h2>
      <p className={styles.p}>
        <strong>
          Budget £50,000 for a small Velux loft and £80,000 to £116,000 for a
          dormer, hip-to-gable or mansard, all-in. Add about £12,500 for an
          en-suite.
        </strong>{" "}
        The table below is the number to take to the bank, not the number a
        builder writes on page one of a quote.
      </p>
      <p className={styles.p}>
        Every loft conversion cost in this guide comes from our own 2026 London price book, the same
        one behind our{" "}
        <Link href="/loft-conversion-cost-calculator">
          loft conversion cost calculator
        </Link>
        . The base case is a terraced house in outer London (zone 3), standard
        finish, two party wall neighbours and no en-suite. The range runs from
        an essential finish at the low end to a premium finish with an en-suite
        at the top.
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>
            Loft conversion cost in London by type, 2026 (all-in, including VAT)
          </caption>
          <thead>
            <tr>
              <th scope="col">Loft type</th>
              <th scope="col">Typical new floor</th>
              <th scope="col">Typical all-in cost</th>
              <th scope="col">Realistic range</th>
              <th scope="col">Weeks on site</th>
              <th scope="col">Planning</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Velux (rooflight)</th>
              <td>22 m²</td>
              <td>£50,000</td>
              <td>£42,500–£79,500</td>
              <td>6–8</td>
              <td>Usually permitted development</td>
            </tr>
            <tr>
              <th scope="row">Rear dormer</th>
              <td>25 m²</td>
              <td>£80,000</td>
              <td>£67,000–£120,000</td>
              <td>8–10</td>
              <td>Usually permitted development</td>
            </tr>
            <tr>
              <th scope="row">Hip-to-gable</th>
              <td>30 m²</td>
              <td>£88,000</td>
              <td>£73,500–£131,000</td>
              <td>9–11</td>
              <td>Usually permitted development</td>
            </tr>
            <tr>
              <th scope="row">L-shaped dormer</th>
              <td>32 m²</td>
              <td>£95,000</td>
              <td>£79,500–£140,000</td>
              <td>10–12</td>
              <td>Usually permitted development</td>
            </tr>
            <tr>
              <th scope="row">Mansard</th>
              <td>32 m²</td>
              <td>£116,000</td>
              <td>£96,500–£168,000</td>
              <td>12–16</td>
              <td>Planning permission</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={styles.p}>
        Published guides often show a lower loft conversion cost for London,
        such as £45,000 for a dormer. Most of them are build-only, ex VAT, with fees left for you to
        discover. The next sections show exactly where the difference goes.
      </p>

      <ArticleCta
        title="Want the number for your loft?"
        text="Pick your loft type, size, postcode and finish. The calculator shows a low, expected and high budget, with every fee listed."
        primary={{
          href: "/loft-conversion-cost-calculator",
          label: "Price your loft conversion",
        }}
      />

      <h2 className={styles.h2} id="cost-by-type">
        Loft conversion cost in London by type
      </h2>
      <p className={styles.p}>
        <strong>
          The roof shape you start with, and how much of it you change, sets
          the price.
        </strong>{" "}
        A Velux loft keeps the roof as it is. A mansard rebuilds it. Everything
        else sits between the two.
      </p>

      <h3 className={styles.h3} id="velux">
        Velux loft conversion cost: about £50,000
      </h3>
      <p className={styles.p}>
        Rooflights go into the existing slope and the roof shape stays the same.
        It is the cheapest route, at roughly £28,500 build cost ex VAT for 22 m²,
        and the quickest at six to eight weeks. The catch is space. Without a
        dormer you only gain floor area where the slope is high enough to stand,
        so it only works in steep Victorian and Edwardian roofs with at least
        2.2 m from the top of the ceiling joists to the ridge.
      </p>

      <h3 className={styles.h3} id="rear-dormer">
        Rear dormer loft conversion cost: about £80,000
      </h3>
      <p className={styles.p}>
        A flat-roofed box built off the rear slope, with full-height walls at
        the back. This is the dormer loft conversion most London terraces get:
        it turns a cramped roof into a double bedroom, usually with room for a
        shower room. Expect £51,000 build cost ex VAT for 25 m², and £92,500
        all-in with an en-suite.
      </p>

      <h3 className={styles.h3} id="hip-to-gable">
        Hip-to-gable loft conversion cost: about £88,000
      </h3>
      <p className={styles.p}>
        The sloping side of a hipped roof is built up into a vertical gable
        wall, usually with a rear dormer as well. It is the standard loft for
        1930s semis and end-of-terrace houses in places like Chingford, South
        Woodford and Loughton. The extra brickwork and roof structure add about
        £8,000 over a plain dormer, but you gain the stair space a hipped roof
        never gives you.
      </p>

      <h3 className={styles.h3} id="l-shaped">
        L-shaped dormer cost: about £95,000
      </h3>
      <p className={styles.p}>
        Two dormers joined in an L: one over the main roof, one over the back
        addition. On a Victorian terrace in Walthamstow, Leyton or Stoke
        Newington this usually gives two bedrooms, or one large bedroom with an
        en-suite. It costs more than a rear dormer, but each square metre is
        cheaper, because you buy the stairs and scaffold once and spread them
        over 32 m².
      </p>

      <h3 className={styles.h3} id="mansard">
        Mansard loft conversion cost in London: about £116,000
      </h3>
      <p className={styles.p}>
        The roof is rebuilt with a 72-degree rear slope and a flat top, and the
        new walls are usually clad in slate or zinc. It gives the most usable
        space and is often the only option councils accept in conservation
        areas, which is why mansards are common in Islington, Camden and parts
        of Hackney. Allow 12 to 16 weeks on site and full planning permission.
        Premium mansards with an en-suite reach £150,000 to £168,000.
      </p>

      <h2 className={styles.h2} id="quote-vs-all-in">
        Why a £51,000 quote becomes an £80,000 loft
      </h2>
      <p className={styles.p}>
        <strong>
          The build price is about two-thirds of what you'll actually pay.
        </strong>{" "}
        The rest is design, fees, party wall surveyors, contingency and VAT.
        None of these are optional, and few cost guides add them up for you.
      </p>
      <p className={styles.p}>
        Here is the real arithmetic for a 25 m² rear dormer on a terraced house
        in outer London, standard finish, with two attached neighbours.
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>Rear dormer, 25 m², outer London: build quote to all-in cost</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Build: structure, roof and shell</th>
              <td>£35,600</td>
            </tr>
            <tr>
              <th scope="row">Build: insulation, plastering, electrics and finishes</th>
              <td>£15,643</td>
            </tr>
            <tr>
              <th scope="row">Measured survey and architectural drawings</th>
              <td>£4,450</td>
            </tr>
            <tr>
              <th scope="row">Structural engineer</th>
              <td>£1,300</td>
            </tr>
            <tr>
              <th scope="row">Building control</th>
              <td>£1,300</td>
            </tr>
            <tr>
              <th scope="row">Lawful development certificate</th>
              <td>£300</td>
            </tr>
            <tr>
              <th scope="row">Party wall surveyors (2 neighbours)</th>
              <td>£3,000</td>
            </tr>
            <tr>
              <th scope="row">Contingency (10% of the build)</th>
              <td>£5,124</td>
            </tr>
            <tr>
              <th scope="row">VAT (20%)</th>
              <td>£13,343</td>
            </tr>
            <tr>
              <th scope="row">All-in total</th>
              <td>
                <strong>£80,060</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/loft-conversion-quote-vs-all-in-cost.png`}
          alt="How a £51,243 rear dormer build quote becomes an £80,060 all-in loft conversion cost in London once drawings, engineer, building control, party wall, contingency and VAT are added"
          width={1200}
          height={800}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Build cost is £51,243. Everything else adds £28,817.
        </figcaption>
      </figure>
      <p className={styles.p}>
        Compare quotes on the all-in figure, not the headline. A low build price
        with drawings, building control and the staircase listed as
        "provisional" often ends up costing more than a higher, complete one.
      </p>

      <h2 className={styles.h2} id="fees">
        Professional and council fees for a loft in 2026
      </h2>
      <p className={styles.p}>
        <strong>
          Allow £6,000 to £11,000 for fees before VAT, depending on drawings and
          how many neighbours you share walls with.
        </strong>{" "}
        Council planning fees in England rose 3.8% on 1 April 2026.
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>Loft conversion fees in London, 2026</caption>
          <thead>
            <tr>
              <th scope="col">Fee</th>
              <th scope="col">Typical cost</th>
              <th scope="col">When you need it</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Measured survey and drawings</th>
              <td>£3,500–£5,500</td>
              <td>Always</td>
            </tr>
            <tr>
              <th scope="row">Structural engineer</th>
              <td>£1,000–£2,000</td>
              <td>Always (steels and new floor)</td>
            </tr>
            <tr>
              <th scope="row">Building control</th>
              <td>£1,000–£1,600</td>
              <td>Always</td>
            </tr>
            <tr>
              <th scope="row">Householder planning application</th>
              <td>£548 council fee</td>
              <td>Mansards, conservation areas, Article 4 areas</td>
            </tr>
            <tr>
              <th scope="row">Lawful development certificate</th>
              <td>£274 council fee</td>
              <td>Recommended for permitted development lofts</td>
            </tr>
            <tr>
              <th scope="row">Party wall surveyor</th>
              <td>£1,000–£1,500 per neighbour</td>
              <td>Attached houses, unless neighbours consent</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={styles.p}>
        The lawful development certificate is half the householder fee. It
        isn't legally required, but buyers' solicitors will ask for it when you
        sell, and it costs less than any argument with the council. Party wall
        costs fall to zero if your neighbours consent in writing to the notice.
        Explain the work face to face before the notice arrives and many will.
      </p>

      <h2 className={styles.h2} id="cost-by-zone">
        Loft conversion cost by London zone
      </h2>
      <p className={styles.p}>
        <strong>
          The same loft costs about 19% more in central London than at the edge
          of the city.
        </strong>{" "}
        Access, parking and permits for scaffolding and skips, and labour
        rates, all rise towards the centre.
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>
            Rear dormer with en-suite, 25 m², standard finish, all-in
          </caption>
          <thead>
            <tr>
              <th scope="col">Location</th>
              <th scope="col">All-in cost</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Zone 1 (e.g. Islington, Kensington)</th>
              <td>£105,000</td>
            </tr>
            <tr>
              <th scope="row">Zone 2 (e.g. Hackney, Stoke Newington)</th>
              <td>£98,000</td>
            </tr>
            <tr>
              <th scope="row">Zone 3 (e.g. Walthamstow, Leytonstone)</th>
              <td>£92,500</td>
            </tr>
            <tr>
              <th scope="row">Zone 4 (e.g. Woodford, Chingford)</th>
              <td>£90,000</td>
            </tr>
            <tr>
              <th scope="row">Zone 5–6 (e.g. Loughton, Barnet)</th>
              <td>£88,500</td>
            </tr>
            <tr>
              <th scope="row">For comparison: the Midlands</th>
              <td>£75,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/loft-conversion-cost-by-london-zone.png`}
          alt="Rear dormer loft conversion with en-suite cost by London zone in 2026, from £105,000 in zone 1 to £88,500 in zone 5 to 6, compared with £75,000 in the Midlands"
          width={1200}
          height={780}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The same 25 m² dormer with an en-suite, priced across London.
        </figcaption>
      </figure>
      <p className={styles.p}>
        A street with no parking bays, a narrow front garden or a CPZ adds cost
        in any zone, because materials have to be carried further and permits
        last for the whole programme. Mention it when you ask for a price; a
        good builder will ask you about it anyway. Local guidance for our core
        areas is on our{" "}
        <Link href="/locations/walthamstow">Walthamstow</Link>,{" "}
        <Link href="/locations/leytonstone">Leytonstone</Link> and{" "}
        <Link href="/locations/hackney">Hackney</Link> pages.
      </p>

      <h2 className={styles.h2} id="house-type">
        Which loft conversion suits your house?
      </h2>
      <p className={styles.p}>
        <strong>
          Start from the house, not the brochure.
        </strong>{" "}
        Roof shape, the number of attached neighbours and whether you're in a
        conservation area decide which loft is possible and roughly what it
        costs.
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>Typical loft options by London house type</caption>
          <thead>
            <tr>
              <th scope="col">Your house</th>
              <th scope="col">Usual best option</th>
              <th scope="col">Typical all-in</th>
              <th scope="col">Watch out for</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Victorian terrace with back addition</th>
              <td>L-shaped dormer</td>
              <td>£95,000–£107,000</td>
              <td>Two party walls; chimney breasts</td>
            </tr>
            <tr>
              <th scope="row">Edwardian or Victorian terrace, no back addition</th>
              <td>Rear dormer</td>
              <td>£80,000–£92,500</td>
              <td>Two party walls</td>
            </tr>
            <tr>
              <th scope="row">1930s semi or end of terrace (hipped roof)</th>
              <td>Hip-to-gable with rear dormer</td>
              <td>£88,000–£100,000</td>
              <td>Gable must match the neighbour's roof</td>
            </tr>
            <tr>
              <th scope="row">Terrace in a conservation area</th>
              <td>Mansard or Velux</td>
              <td>£50,000–£128,000</td>
              <td>Full planning; front rooflights may be refused</td>
            </tr>
            <tr>
              <th scope="row">Bungalow</th>
              <td>Velux or rear dormer</td>
              <td>£47,500–£91,000</td>
              <td>Stair position; low head height</td>
            </tr>
            <tr>
              <th scope="row">Top-floor flat</th>
              <td>Dormer or mansard</td>
              <td>Priced case by case</td>
              <td>Always needs planning and the freeholder's consent</td>
            </tr>
          </tbody>
        </table>
      </div>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/loft-type-by-london-house-type.png`}
          alt="Which loft conversion suits your London house: Victorian terrace L-shaped dormer, Edwardian terrace rear dormer, 1930s semi hip-to-gable, conservation area mansard"
          width={1200}
          height={950}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          A quick guide to the loft most London houses can take.
        </figcaption>
      </figure>
      <p className={styles.p}>
        If you're still deciding between going up or out, our{" "}
        <Link href="/blog/loft-conversion-vs-house-extension-london">
          loft conversion vs house extension guide
        </Link>{" "}
        compares the cost per m² and the disruption of each.
      </p>

      <h2 className={styles.h2} id="per-m2">
        Loft conversion cost per m² in London
      </h2>
      <p className={styles.p}>
        <strong>
          All-in, a London loft costs about £2,300 to £3,600 per m² of new
          floor. Build-only, ex VAT, it is £1,300 to £2,450 per m².
        </strong>{" "}
        Check which of the two figures a quote or guide is using.
      </p>
      <p className={styles.p}>
        Per m² figures mislead in one way: small lofts look cheap and large
        ones look expensive, when the opposite is true per square metre gained.
        The staircase, scaffold, steels and opening up the roof cost roughly
        £16,500 on a dormer before you build a single square metre. After that,
        each extra m² of dormer adds about £1,840 all-in. Going from 25 m² to
        30 m² adds around £9,200, not the £16,000 a flat per m² rate would
        suggest.
      </p>
      <p className={styles.p}>
        Measure only floor with at least 1.5 m of headroom when you compare.
        Floor under the eaves is useful for storage but adds little to how the
        room feels, and some quotes count it to make the rate look lower.
      </p>

      <h2 className={styles.h2} id="price-drivers">
        What pushes the price up in London
      </h2>
      <p className={styles.p}>
        <strong>
          Head height, chimneys and access cause most of the surprises.
        </strong>{" "}
        Your contingency exists for these, so know them before you sign.
      </p>
      <h3 className={styles.h3}>Head height under 2.2 m</h3>
      <p className={styles.p}>
        Measure from the top of a ceiling joist to the underside of the ridge.
        Under 2.2 m, you either lower the ceilings of the rooms below or raise
        the roof. Lowering ceilings typically adds £8,000 to £15,000 and means
        redecorating the bedrooms underneath.
      </p>
      <h3 className={styles.h3}>Chimney breasts</h3>
      <p className={styles.p}>
        Removing a chimney breast in the loft needs steel or gallows brackets,
        an engineer's design and usually a party wall notice. Allow £1,500 to
        £3,000 per breast.
      </p>
      <h3 className={styles.h3}>The staircase</h3>
      <p className={styles.p}>
        Building regulations allow reduced headroom on loft stairs, 1.9 m at
        the centre and 1.8 m at the side, but the stair still needs a landing
        and a route. If it has to take part of a bedroom or the bathroom, the
        knock-on joinery and plumbing are extra.
      </p>
      <h3 className={styles.h3}>Fire safety</h3>
      <p className={styles.p}>
        A new top floor needs a protected escape route: fire doors to every
        habitable room off the stair and mains-wired, interlinked smoke alarms.
        Our prices include this; check that every quote you get does too.
      </p>
      <h3 className={styles.h3}>Water tanks and boilers</h3>
      <p className={styles.p}>
        Old cold-water tanks in the loft usually go, and many homes switch to a
        combi or unvented cylinder at the same time. That's money well spent,
        but budget for it separately.
      </p>

      <h2 className={styles.h2} id="30k">
        Can you do a loft conversion for £30,000?
      </h2>
      <p className={styles.p}>
        <strong>
          Not in London, once fees and VAT are included.
        </strong>{" "}
        £30,000 covers roughly the build cost of a 22 m² Velux loft ex VAT, but
        a finished, signed-off room with drawings, building control, party wall
        and VAT is about £50,000.
      </p>
      <p className={styles.p}>
        Quotes around £30,000 for a full dormer usually leave out the stairs,
        the steels, the fire doors or the VAT. Some aren't from builders at
        all, but from firms that hand the work on to a subcontractor. If the
        budget is fixed at £30,000, it is better to plan a smaller Velux room
        now and keep the layout ready for a dormer later than to start a dormer
        you can't finish.
      </p>

      <h2 className={styles.h2} id="planning">
        Planning permission, permitted development and the 10-year rule
      </h2>
      <p className={styles.p}>
        <strong>
          Most Velux, dormer and hip-to-gable lofts on houses are permitted
          development, so they don't need planning permission.
        </strong>{" "}
        Mansards, flats and anything in a conservation area do.
      </p>
      <p className={styles.p}>
        Under the{" "}
        <a
          href="https://www.planningportal.co.uk/permission/common-projects/loft-conversion"
          target="_blank"
          rel="noopener noreferrer"
        >
          Planning Portal's permitted development rules
        </a>
        , the new roof space must stay within 40 m³ for a terraced house and 50
        m³ for other houses. It can't go higher than the existing roof or
        extend the front slope facing the road. Side windows must be obscure
        glazed. Materials should look similar to the existing roof. Previous
        roof extensions count against the allowance, and some boroughs remove
        permitted development rights with Article 4 directions.
      </p>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/loft-conversion-permitted-development-checklist.png`}
          alt="Loft conversion permitted development checklist for London houses: 40 cubic metres for terraces, 50 cubic metres for other houses, no higher than the ridge, no front dormer, not in a conservation area"
          width={1200}
          height={1080}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Six checks before you assume your loft is permitted development.
        </figcaption>
      </figure>
      <p className={styles.p}>
        The "10-year rule" people search for is about enforcement. Since 25
        April 2024, councils in England can take action against unauthorised
        building work for up to 10 years after it was finished, instead of four.
        In practice, a loft built without the right consent can come back to
        haunt you at sale for a decade. Our{" "}
        <Link href="/blog/planning-permission-loft-conversion-london">
          planning permission guide for London lofts
        </Link>{" "}
        covers borough rules in detail.
      </p>

      <h2 className={styles.h2} id="timeline">
        How long a loft conversion takes
      </h2>
      <p className={styles.p}>
        <strong>
          Six to 16 weeks on site, after six to 12 weeks of design and
          approvals.
        </strong>{" "}
        Mansards with planning need another eight to 13 weeks for the council
        decision.
      </p>
      <p className={styles.p}>
        Most of the work happens from scaffolding and through the roof, so you
        can usually stay at home. The disruptive weeks are when the stair goes
        in and the new floor opens into the house below. Party wall notices
        need to be served at least two months before work on a shared wall, so
        serve them while the drawings are being finished, not after.
      </p>

      <h2 className={styles.h2} id="value">
        Does a loft conversion add value in London?
      </h2>
      <p className={styles.p}>
        <strong>
          Usually, yes, when it adds a proper double bedroom with a bathroom.
        </strong>{" "}
        Nationwide's 2025 research found that adding a double bedroom and a
        bathroom can add up to 24% to a three-bedroom, one-bathroom home.
      </p>
      <p className={styles.p}>
        Treat that as an upper bound, not a promise. On a £650,000 terrace, 24%
        would be £156,000, against a £92,500 dormer with an en-suite. The gap
        narrows fast if the room has a poor stair, no bathroom or a low ceiling.
        The loft that adds value is a bedroom estate agents can photograph
        standing up. Our{" "}
        <Link href="/blog/house-extension-value-london-guide">
          guide to what adds value in London
        </Link>{" "}
        compares lofts with extensions.
      </p>

      <h2 className={styles.h2} id="saving">
        How to bring the cost down without cutting corners
      </h2>
      <p className={styles.p}>
        <strong>
          The big savings come from decisions made before you get a quote.
        </strong>{" "}
        Once you're on site, change is the most expensive thing you can buy.
      </p>
      <ul className={styles.ul}>
        <li>
          <strong>Fix the layout before you get quotes.</strong> A bathroom
          position that moves after the steels are ordered can cost £2,000 or
          more.
        </li>
        <li>
          <strong>Talk to your neighbours early.</strong> Written consent to the
          party wall notice can save £1,000 to £3,000 in surveyor fees.
        </li>
        <li>
          <strong>Choose standard window sizes.</strong> Made-to-measure
          rooflights and glazing add cost and lead time.
        </li>
        <li>
          <strong>Spend on the stair, save on the finishes.</strong> Taps,
          tiles and lights can be upgraded later; a badly placed staircase
          can't.
        </li>
        <li>
          <strong>Do the boiler or cylinder at the same time.</strong> It costs
          less than coming back to it later.
        </li>
      </ul>

      <h2 className={styles.h2} id="accurate-price">
        How to get a loft conversion price you can rely on
      </h2>
      <p className={styles.p}>
        <strong>
          Get at least three itemised quotes for the same drawings, and compare
          the all-in totals.
        </strong>{" "}
        Ask every builder the same five questions.
      </p>
      <ul className={styles.ul}>
        <li>Is VAT included, and is this a fixed price or an estimate?</li>
        <li>Which fees are inside the price and which are mine?</li>
        <li>Are the stairs, steels, fire doors and making good included?</li>
        <li>Who manages the site day to day, and how often will I hear from you?</li>
        <li>What guarantee and insurance come with the work?</li>
      </ul>
      <p className={styles.p}>
        At Better Homes you have one construction contract and one team on site.
        Bring your own architect or choose an independent one we recommend; we
        coordinate the engineer, building control and party wall surveyors, so
        you don't have to manage the hand-offs. Lofts come with a workmanship
        guarantee of up to 10 years on structural work. See how we work on our{" "}
        <Link href="/loft-conversion">loft conversions in London</Link> page.
      </p>

      <h2 className={styles.h2} id="quick-takeaways">
        Quick takeaways
      </h2>
      <ul className={styles.ul}>
        <li>
          London lofts cost £50,000 (Velux) to £116,000 (mansard) all-in, with
          a rear dormer at about £80,000.
        </li>
        <li>An en-suite adds about £12,500 all-in.</li>
        <li>
          Fees, contingency and VAT add around £29,000 to a £51,000 build
          quote.
        </li>
        <li>Central London costs about 19% more than the outer zones.</li>
        <li>
          Permitted development covers most lofts on houses; mansards, flats
          and conservation areas need planning.
        </li>
        <li>
          Allow six to 16 weeks on site, after six to 12 weeks of design and
          approvals.
        </li>
      </ul>

      <h2 className={styles.h2} id="setting-your-budget">
        Setting your loft budget
      </h2>
      <p className={styles.p}>
        A loft is the cheapest way to add a bedroom in London without losing
        garden, but only if you budget for the whole project from the start.
        Take the all-in figure for your loft type from the table above. Adjust
        it for your zone, add £12,500 if you want an en-suite, and hold back
        10% for the things nobody can see until the roof is open.
      </p>
      <p className={styles.p}>
        Then test it against your house. A Victorian terrace with a back
        addition is almost always better value as an L-shaped dormer than a
        rear dormer, because the extra room costs far less than the first one.
        A 1930s semi needs the gable before the dormer is worth doing. And a
        conservation-area terrace should be costed as a mansard from day one,
        so planning doesn't take you by surprise.
      </p>
      <p className={styles.p}>
        When you're ready to turn a budget into a fixed price, we can survey
        the roof, check the head height and give you an itemised quote. One
        construction contract covers the build, and we coordinate your
        architect, engineer and party wall surveyors. Start with the{" "}
        <Link href="/loft-conversion-cost-calculator">loft calculator</Link>,
        or <Link href="/contact?service=Loft%20conversion#brief">send us your brief</Link>{" "}
        and we'll tell you honestly what your loft will take.
      </p>
      <p className={styles.p}>
        <strong>Over to you:</strong> what's the one thing you'd want to know
        about your loft before you commit? Send us your question with your
        postcode and we'll answer it.
      </p>

      <h2 className={styles.h2} id="faqs">
        Loft conversion cost FAQs
      </h2>
      <h3 className={styles.h3}>
        What is the average cost of a loft conversion in London in 2026?
      </h3>
      <p className={styles.p}>
        About £80,000 all-in for a typical 25 m² rear dormer in outer London,
        including fees, party wall, a 10% contingency and VAT. Velux lofts
        start around £50,000 and mansards average £116,000.
      </p>
      <h3 className={styles.h3}>How much does a dormer loft conversion cost?</h3>
      <p className={styles.p}>
        A rear dormer costs about £80,000 all-in in London, or £92,500 with an
        en-suite. An L-shaped dormer on a Victorian terrace is about £95,000.
      </p>
      <h3 className={styles.h3}>
        How much does a mansard loft conversion cost in London?
      </h3>
      <p className={styles.p}>
        Around £116,000 all-in for 32 m² in outer London, rising to £150,000
        or more in central London or with a premium finish and en-suite. It
        needs full planning permission.
      </p>
      <h3 className={styles.h3}>
        How much does a hip-to-gable loft conversion cost?
      </h3>
      <p className={styles.p}>
        About £88,000 all-in for a 30 m² hip-to-gable with rear dormer on a
        semi-detached house in outer London, or £100,000 with an en-suite.
      </p>
      <h3 className={styles.h3}>What is the most expensive part of a loft conversion?</h3>
      <p className={styles.p}>
        The structure: steels, new floor joists, the dormer or rebuilt roof and
        the staircase. Together they make up around 45% of the all-in cost.
      </p>
      <h3 className={styles.h3}>Do I need planning permission for a loft conversion in London?</h3>
      <p className={styles.p}>
        Usually not for Velux, dormer or hip-to-gable lofts on houses within
        permitted development limits. You do for mansards, flats, conservation
        areas and Article 4 areas.
      </p>
      <h3 className={styles.h3}>What is the 10-year rule for loft conversions?</h3>
      <p className={styles.p}>
        Since April 2024, councils in England can enforce against unauthorised
        building work for 10 years after completion, up from four. Getting the
        right approval or a lawful development certificate avoids the risk.
      </p>

      <h2 className={styles.h2} id="references">
        References
      </h2>
      <ul className={styles.ul}>
        <li>
          <a
            href="https://www.planningportal.co.uk/permission/common-projects/loft-conversion"
            target="_blank"
            rel="noopener noreferrer"
          >
            Planning Portal: loft conversion planning and permitted development
          </a>
        </li>
        <li>
          <a
            href="https://www.gov.uk/government/publications/permitted-development-rights-for-householders-technical-guidance"
            target="_blank"
            rel="noopener noreferrer"
          >
            GOV.UK: permitted development rights for householders, technical
            guidance
          </a>
        </li>
        <li>
          <a
            href="https://blog.planningportal.co.uk/2026/01/30/english-planning-application-fees-increase-on-1st-april-2026/"
            target="_blank"
            rel="noopener noreferrer"
          >
            Planning Portal: English planning application fees increase on 1
            April 2026
          </a>
        </li>
        <li>
          <a
            href="https://www.gov.uk/guidance/party-wall-etc-act-1996-guidance"
            target="_blank"
            rel="noopener noreferrer"
          >
            GOV.UK: Party Wall etc. Act 1996 guidance
          </a>
        </li>
        <li>
          <a
            href="https://theintermediary.co.uk/2025/10/loft-conversions-boost-home-value-by-up-to-24-nationwide-research-shows/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Intermediary: loft conversions boost home value by up to 24%,
            Nationwide research
          </a>
        </li>
      </ul>
    </article>
  );
}
