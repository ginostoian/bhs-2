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

const IMG = "/assets/blog/side-return-extension-cost-london";

const toc = [
  ["how-much", "How much a side return costs in London"],
  ["cost-by-spec", "Side return cost by finish, with and without a kitchen"],
  ["quote-vs-all-in", "Why a £40,000 build becomes a £64,500 project"],
  ["where-the-money-goes", "Where the money goes"],
  ["per-m2", "Side return vs rear vs wraparound, per m²"],
  ["island-test", "The 4-metre island test"],
  ["cost-by-zone", "What your postcode adds"],
  ["planning", "Planning permission and permitted development"],
  ["party-wall-drains", "Party walls and the drain under your passage"],
  ["forest-gate", "A Forest Gate side return, E7"],
  ["timeline", "How long it takes"],
  ["value", "Is a side return worth it?"],
  ["saving", "Where to save, where not to"],
  ["accurate-price", "Getting a price you can trust"],
  ["faqs", "FAQs"],
];

export default function SideReturnExtensionCostLondonArticle() {
  const half = Math.ceil(toc.length / 2);
  return (
    <article>
      <div className={styles.answerCapsule}>
        <p className={styles.p}>
          A side return extension in London costs about £64,500 all-in in 2026
          for a typical 10 m² infill, finished and ready to use. A weathertight
          shell is around £52,000. With a new mid-range kitchen it's about
          £85,500. These figures include design, fees, party wall, a 10%
          contingency and VAT.
        </p>
      </div>

      <h2 className={styles.h2} id="key-takeaways">
        Key takeaways
      </h2>
      <ul className={styles.ul}>
        <li>
          <strong>Budget £64,500 for a finished 10 m² side return</strong> in
          outer London, or £85,500 with a new kitchen.
        </li>
        <li>
          <strong>The build is only 61% of the bill.</strong> Fees, party wall,
          contingency and VAT turn £39,500 of building into £64,600.
        </li>
        <li>
          <strong>Per m², it's the dearest way to extend:</strong> about £6,450
          per m² against £5,300 for a wraparound.
        </li>
        <li>
          <strong>You're paying for width, not floor.</strong> A side return
          takes a 2.8 m galley past the 4 m you need for a proper island.
        </li>
        <li>
          <strong>Check the drain first.</strong> Most London side passages have
          one, and building over it needs consent from Thames Water.
        </li>
        <li>
          <strong>Many side returns are permitted development</strong>, but not
          in conservation areas, and the eaves near your boundary can't go
          above 3 m.
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
        How much does a side return extension cost in London?
      </h2>
      <p className={styles.p}>
        <strong>
          £64,500 is the honest figure for a typical 10 m² side return in outer
          London, finished, with fees and VAT. Most land between £59,000 and
          £74,500.
        </strong>{" "}
        Add a kitchen and it climbs to about £85,500.
      </p>
      <p className={styles.p}>
        That surprises people. Side returns look small, and on paper they are:
        a strip of passage, maybe 1.8 m wide and 5.5 m long. But you still pay
        for foundations, a new wall against your neighbour, a roof, drainage, a
        steel frame to open up the house, building control, an engineer and a
        party wall surveyor. Most of those costs don't shrink because the space
        is narrow.
      </p>
      <p className={styles.p}>
        Every side return extension cost in this guide comes from the 2026
        London price book behind our{" "}
        <Link href="/extension-calculator">house extension cost calculator</Link>
        . The base case is a 10 m² side return on a Victorian terrace in outer
        London (zone 3), access through the house, large glazed doors and no
        extras unless we say so.
      </p>

      <ArticleCta
        title="Want the number for your house?"
        text="Choose side return, enter your size and postcode, and the calculator gives a low, expected and high budget with every fee listed."
        primary={{ href: "/extension-calculator", label: "Price your side return" }}
      />

      <h2 className={styles.h2} id="cost-by-spec">
        Side return extension cost by finish level
      </h2>
      <p className={styles.p}>
        <strong>
          The jump from shell to finished room is about £12,500. The kitchen is
          the next £21,000.
        </strong>{" "}
        Decide early which of these you're actually buying, because builders
        quote all three and call them all "a side return".
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>
            10 m² side return, outer London, 2026 (all-in, including VAT)
          </caption>
          <thead>
            <tr>
              <th scope="col">What you get</th>
              <th scope="col">Typical all-in</th>
              <th scope="col">Likely range</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Shell only (weathertight, your own trades finish it)</th>
              <td>£52,000</td>
              <td>£47,500–£60,000</td>
            </tr>
            <tr>
              <th scope="row">Finished room, ready to live in</th>
              <td>£64,500</td>
              <td>£59,000–£74,500</td>
            </tr>
            <tr>
              <th scope="row">Premium finish and glazing</th>
              <td>£70,500</td>
              <td>£64,000–£81,500</td>
            </tr>
            <tr>
              <th scope="row">Finished, with a new mid-range kitchen</th>
              <td>£85,500</td>
              <td>£78,000–£99,000</td>
            </tr>
            <tr>
              <th scope="row">Premium, with a new kitchen</th>
              <td>£91,500</td>
              <td>£83,500–£106,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p className={styles.p}>
        "Shell only" sounds like a saving, and sometimes it is. But you take on
        the plastering, electrics, flooring and decoration, and the risk that
        your trades blame the builder for anything that isn't straight. For
        most people, the £12,500 difference buys a lot of certainty.
      </p>
      <p className={styles.p}>
        The kitchen line uses a £16,000 allowance for units, worktops and
        appliances, plus VAT and contingency. A bespoke kitchen can double
        that. Our guide to{" "}
        <Link href="/blog/bespoke-vs-howdens-vs-ikea-kitchen-london">
          bespoke, Howdens and IKEA kitchens
        </Link>{" "}
        shows what each route costs once it's fitted in a London house.
      </p>

      <h2 className={styles.h2} id="quote-vs-all-in">
        Why a £40,000 build becomes a £64,500 project
      </h2>
      <p className={styles.p}>
        <strong>
          About 39% of a side return budget is fees, contingency and VAT.
        </strong>{" "}
        This is the part most quotes leave you to find out about later.
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>10 m² side return, finished, outer London: line by line</caption>
          <thead>
            <tr>
              <th scope="col">Item</th>
              <th scope="col">Cost</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Construction: foundations, walls, roof, drainage, glazing</th><td>£30,956</td></tr>
            <tr><th scope="row">Floors, plastering, decoration and lighting</th><td>£5,378</td></tr>
            <tr><th scope="row">Opening up the house: steels and making good</th><td>£3,200</td></tr>
            <tr><th scope="row">Measured survey</th><td>£900</td></tr>
            <tr><th scope="row">Architect design</th><td>£2,500</td></tr>
            <tr><th scope="row">Structural engineer</th><td>£1,800</td></tr>
            <tr><th scope="row">Planning application and council fee</th><td>£1,748</td></tr>
            <tr><th scope="row">Building control</th><td>£1,200</td></tr>
            <tr><th scope="row">Party wall surveyor</th><td>£2,500</td></tr>
            <tr><th scope="row">Contingency (10% of the build)</th><td>£3,953</td></tr>
            <tr><th scope="row">VAT (20%)</th><td>£10,477</td></tr>
            <tr><th scope="row">All-in total</th><td><strong>£64,612</strong></td></tr>
          </tbody>
        </table>
      </div>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/side-return-extension-quote-vs-all-in-cost.png`}
          alt="How a £39,534 side return extension build becomes a £64,612 all-in cost in London once design, engineer, planning, building control, party wall, contingency and VAT are added"
          width={1200}
          height={800}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The build is £39,534. Fees, contingency and VAT add £25,078.
        </figcaption>
      </figure>
      <p className={styles.p}>
        If one quote is £15,000 cheaper than the others, look for what's
        missing from this list. It's usually the steels, the drainage, the
        party wall or the VAT.
      </p>

      <h2 className={styles.h2} id="where-the-money-goes">
        Where the money goes on a side return
      </h2>
      <p className={styles.p}>
        <strong>
          Four things drive the price: the steelwork, the roof glazing, the
          drainage and the wall against your neighbour.
        </strong>{" "}
        Get these right on the drawings and the rest is predictable.
      </p>
      <h3 className={styles.h3}>Steel and the structural opening</h3>
      <p className={styles.p}>
        Knocking through the side wall of the back addition means the floor
        above has to be carried on steel, usually a beam with posts or a full
        goalpost frame. On a typical terrace that's two beams, each at around
        £2,500 supplied and fitted, plus the engineer's design. It's the one
        line you can't value-engineer.
      </p>
      <h3 className={styles.h3}>The roof and how much glass you want</h3>
      <p className={styles.p}>
        Side returns sit between two tall walls, so light comes from above. A
        solid roof with rooflights is the cheapest route. A long run of glazing
        along the roof costs more and looks better. In our price book, moving
        from standard windows and doors to large glazed doors and a mostly
        glazed roof adds about £4,500 on a 10 m² side return. Frameless
        structural glass costs more again.
      </p>
      <h3 className={styles.h3}>Drainage</h3>
      <p className={styles.p}>
        The side passage is where Victorian builders ran the drains, so
        there's often a manhole right where your new floor wants to go.
        Re-routing a drain and moving a manhole typically costs £1,500 to
        £4,000. More on the paperwork{" "}
        <Link href="#party-wall-drains">below</Link>.
      </p>
      <h3 className={styles.h3}>The boundary wall</h3>
      <p className={styles.p}>
        Your new side wall usually goes on or against the boundary with your
        neighbour. That brings in the Party Wall Act, deeper foundations if the
        old wall is shallow, and a careful roof detail where the two meet.
      </p>

      <h2 className={styles.h2} id="per-m2">
        Side return vs rear extension vs wraparound: cost per m²
      </h2>
      <p className={styles.p}>
        <strong>
          A side return is the most expensive way to add floor, at about
          £6,450 per m². A wraparound adds more than twice the space for about
          £5,300 per m².
        </strong>{" "}
        Fixed costs explain it: the fees, steels and drainage cost much the
        same whatever the size.
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>
            Typical 4.5 m wide London terrace, finished, outer London, all-in
          </caption>
          <thead>
            <tr>
              <th scope="col">Extension</th>
              <th scope="col">New floor</th>
              <th scope="col">All-in cost</th>
              <th scope="col">Per m² gained</th>
              <th scope="col">With a new kitchen</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Side return</th>
              <td>10 m²</td>
              <td>£64,500</td>
              <td>£6,450</td>
              <td>£85,500</td>
            </tr>
            <tr>
              <th scope="row">Rear extension (3 m deep)</th>
              <td>13.5 m²</td>
              <td>£72,500</td>
              <td>£5,370</td>
              <td>£93,500</td>
            </tr>
            <tr>
              <th scope="row">Wraparound (side and rear)</th>
              <td>23.5 m²</td>
              <td>£125,000</td>
              <td>£5,300</td>
              <td>£146,000</td>
            </tr>
          </tbody>
        </table>
      </div>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/side-return-vs-rear-vs-wraparound-cost-per-m2.png`}
          alt="Side return vs rear extension vs wraparound cost per m² in London 2026: side return £6,450, rear extension £5,370, wraparound £5,300 per square metre gained"
          width={1200}
          height={760}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The same terrace extended three ways, priced per square metre gained.
        </figcaption>
      </figure>
      <p className={styles.p}>
        So why do so many people choose the side return? Because it keeps the
        garden. A 3 m rear extension takes 13.5 m² of lawn; a side return takes
        a passage you were using for the bins. If you want to compare the
        shapes in more detail, our{" "}
        <Link href="/blog/house-extension-types">guide to house extension types</Link>{" "}
        covers each one, and our{" "}
        <Link href="/blog/single-storey-extension-cost-london">
          single-storey extension cost guide
        </Link>{" "}
        prices rear extensions in full.
      </p>

      <h2 className={styles.h2} id="island-test">
        The 4-metre island test
      </h2>
      <p className={styles.p}>
        <strong>
          The real reason to build a side return is width. It turns a 2.8 m
          galley into a room around 4.8 m wide, and an island needs about 4.1 m.
        </strong>{" "}
        That's the difference between a corridor you cook in and a kitchen
        you live in.
      </p>
      <p className={styles.p}>
        Do the sum. A run of units along one wall is 0.6 m deep. You want 1 m
        to walk and open the dishwasher. The island is 0.9 m. Another 1 m of
        space, then 0.6 m of units on the far wall. That's 4.1 m before anyone
        sits down.
      </p>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/side-return-extension-island-width.png`}
          alt="Side return extension plan showing a 2.8 metre wide galley kitchen widened to 4.8 metres, enough for a kitchen island which needs about 4.1 metres"
          width={1200}
          height={850}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          A typical back addition before and after a side return, drawn to
          scale.
        </figcaption>
      </figure>
      <p className={styles.p}>
        Most back additions in Walthamstow, Leyton and Forest Gate are 2.6 m to
        3 m wide inside. Add a 1.8 m to 2.2 m side passage and you clear the
        island with room to spare. If your passage is narrower than 1.5 m, the
        maths gets tight, and a rear extension or wraparound may be the better
        buy.
      </p>

      <h2 className={styles.h2} id="cost-by-zone">
        Side return extension cost by London zone
      </h2>
      <p className={styles.p}>
        <strong>
          Postcode matters less here than on a loft: about £5,500 between zone 1
          and zone 5.
        </strong>{" "}
        Access through the house matters more.
      </p>
      <div className={styles.tableWrap}>
        <table className="bh-table">
          <caption>10 m² side return, finished, all-in</caption>
          <thead>
            <tr>
              <th scope="col">Location</th>
              <th scope="col">All-in cost</th>
            </tr>
          </thead>
          <tbody>
            <tr><th scope="row">Zone 1 (e.g. Islington)</th><td>£68,000</td></tr>
            <tr><th scope="row">Zone 2 (e.g. Hackney E8, Stoke Newington N16)</th><td>£66,000</td></tr>
            <tr><th scope="row">Zone 3 (e.g. Walthamstow E17, Forest Gate E7)</th><td>£64,500</td></tr>
            <tr><th scope="row">Zone 4 (e.g. Woodford, Chingford E4)</th><td>£63,000</td></tr>
            <tr><th scope="row">Zone 5–6 (e.g. Loughton, Barnet)</th><td>£62,500</td></tr>
            <tr><th scope="row">For comparison: the Midlands</th><td>£56,500</td></tr>
            <tr><th scope="row">Zone 3 with difficult access</th><td>£68,500</td></tr>
          </tbody>
        </table>
      </div>
      <p className={styles.p}>
        Look at the last row. Every brick, bag and steel on a mid-terrace side
        return comes through your front door unless there's rear access, and
        no parking bay outside adds about £4,000. Tell the builder before they
        price it. Local planning notes for our core areas are on our{" "}
        <Link href="/locations/walthamstow">Walthamstow</Link>,{" "}
        <Link href="/locations/leytonstone">Leytonstone</Link> and{" "}
        <Link href="/locations/hackney">Hackney</Link> pages.
      </p>

      <h2 className={styles.h2} id="planning">
        Does a side return extension need planning permission?
      </h2>
      <p className={styles.p}>
        <strong>
          Often not, if it's single storey, no more than 4 m high, no wider than
          half the original house and outside a conservation area.
        </strong>{" "}
        The detail that catches people is the eaves.
      </p>
      <p className={styles.p}>
        Under the{" "}
        <a
          href="https://www.planningportal.co.uk/permission/common-projects/extensions/planning-permission"
          target="_blank"
          rel="noopener noreferrer"
        >
          Planning Portal's permitted development rules
        </a>
        , anything within 2 m of a boundary can't have eaves higher than 3 m.
        A side return sits right on the boundary, so the roof has to start low
        against your neighbour's wall and rise towards the house. Ask for a
        tall glass wall on the boundary and you're into a planning application.
      </p>
      <figure className={styles.figure}>
        <Image
          src={`${IMG}/side-return-extension-permitted-development-checklist.png`}
          alt="Side return extension permitted development checklist: single storey, no higher than 4 metres, eaves no higher than 3 metres within 2 metres of the boundary, no wider than half the original house, not in a conservation area"
          width={1200}
          height={1080}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Six checks before you assume your side return is permitted development.
        </figcaption>
      </figure>
      <p className={styles.p}>
        Add a rear extension to make a wraparound and the rear part has its own
        limit: 3 m from the original back wall on a terrace, or up to 6 m with
        prior approval from the council. Conservation areas and Article 4 areas
        remove these rights altogether, and they're common in Hackney,
        Islington and parts of Walthamstow. Our prices include a planning
        application because most London clients prefer certainty. Where
        permitted development applies, a lawful development certificate costs
        half the £548 householder fee.
      </p>

      <h2 className={styles.h2} id="party-wall-drains">
        Party walls and the drain under your side passage
      </h2>
      <p className={styles.p}>
        <strong>
          Almost every side return needs a party wall notice, and many need
          Thames Water's consent to build over a drain.
        </strong>{" "}
        Start both while the drawings are being finished, not when the builder
        is ready.
      </p>
      <p className={styles.p}>
        Building a new wall on the line of the boundary, or digging foundations
        within 3 m of your neighbour's, needs notice under the{" "}
        <a
          href="https://www.gov.uk/guidance/party-wall-etc-act-1996-guidance"
          target="_blank"
          rel="noopener noreferrer"
        >
          Party Wall etc. Act 1996
        </a>
        . That's one month for a new wall or excavation, two for work to an
        existing party wall. If your neighbour consents in writing, there's no
        surveyor's fee. If they don't, budget about £2,500, which you pay.
      </p>
      <p className={styles.p}>
        Drains are the quieter problem. If the pipe in your passage is shared
        with next door, it's usually a public sewer, and you'll need a{" "}
        <a
          href="https://www.thameswater.co.uk/developers/larger-scale-developments/sewers-and-wastewater/build-over-or-near-a-sewer"
          target="_blank"
          rel="noopener noreferrer"
        >
          build-over agreement from Thames Water
        </a>{" "}
        before you build on it. A CCTV drain survey costs a few hundred pounds
        and tells you exactly what's there before you commit to a design.
      </p>

      <h2 className={styles.h2} id="forest-gate">
        A side return in Forest Gate, E7
      </h2>
      <p className={styles.p}>
        <strong>
          One of our recent side returns, on a terrace in Forest Gate, shows
          what the width buys.
        </strong>{" "}
        The family wanted the kitchen, the dining table and the garden to work
        as one room.
      </p>
      <figure className={styles.figure}>
        <Image
          src="/assets/portfolio/extension-ava-e7/side-return-extension-6.webp"
          alt="Side return kitchen extension in Forest Gate E7 with roof glazing along the side, an island sink and a dining table by the garden doors"
          width={1200}
          height={800}
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Forest Gate, E7: glazing along the side of the roof, an island sink
          facing the room and the dining table by the garden doors.
        </figcaption>
      </figure>
      <p className={styles.p}>
        The extra width made room for an island with the sink, so whoever's
        washing up faces into the room instead of a wall. Tall units and
        appliances run along the old party wall. Glazing along the side of the
        roof pulls light into the middle of the house, where a back addition
        is usually darkest. Access down the side was tight, so deliveries and
        the steel installation were planned around it from day one. You can see{" "}
        <Link href="/portfolio/ava-e7">the full Forest Gate project</Link> in our
        portfolio.
      </p>

      <h2 className={styles.h2} id="timeline">
        How long does a side return extension take?
      </h2>
      <p className={styles.p}>
        <strong>
          Eight to 14 weeks on site, after six to 16 weeks of design and
          approvals.
        </strong>{" "}
        A planning application adds about eight weeks for the council's
        decision.
      </p>
      <p className={styles.p}>
        Expect to lose your kitchen for most of the build. The new structure
        goes up first, behind a temporary wall, and the old side wall only
        comes out once the new roof is on. That means you're usually without
        a working kitchen for six to eight weeks, not the whole job. Set up a
        microwave and kettle in another room, and plan for it, especially with
        children.
      </p>

      <h2 className={styles.h2} id="value">
        Is a side return extension worth it?
      </h2>
      <p className={styles.p}>
        <strong>
          Rarely on floor area alone. Usually, on how the house works.
        </strong>{" "}
        Nationwide's research suggests a 10% increase in floor space adds about
        5% to a home's value.
      </p>
      <p className={styles.p}>
        Put that against a real house. A 10 m² side return on a 90 m² terrace
        adds about 11% floor space, so roughly 5.5% in value. On a £650,000
        house in E17, that's about £36,000, against a £64,500 build. On those
        numbers alone, it doesn't pay back.
      </p>
      <p className={styles.p}>
        But floor area isn't what buyers see. They see a kitchen with an
        island, light in the middle of the house and a table by the garden.
        Agents price that layout above the same house with a galley, and it's
        why side returns keep selling. If you want the full picture, our{" "}
        <Link href="/blog/house-extension-value-london-guide">
          guide to what adds value in London
        </Link>{" "}
        compares extensions, lofts and renovations.
      </p>

      <h2 className={styles.h2} id="saving">
        Where to save on a side return, and where not to
      </h2>
      <p className={styles.p}>
        <strong>
          Save on finishes you can change later. Spend on structure, glazing
          and drainage, which you can't.
        </strong>
      </p>
      <ul className={styles.ul}>
        <li>
          <strong>Do the drain survey first.</strong> It costs a few hundred
          pounds and stops a redesign later.
        </li>
        <li>
          <strong>Talk to your neighbour before the notice arrives.</strong>{" "}
          Written consent saves about £2,500.
        </li>
        <li>
          <strong>Choose rooflights over a full glass roof</strong> if budget
          is tight. You keep most of the light for less.
        </li>
        <li>
          <strong>Keep the sink where the drain is.</strong> Moving wet
          services across the room adds pipework and floor build-up.
        </li>
        <li>
          <strong>Don't cut the steel or the insulation.</strong> They're
          inside the walls for the life of the house.
        </li>
      </ul>

      <h2 className={styles.h2} id="accurate-price">
        How to get a side return price you can trust
      </h2>
      <p className={styles.p}>
        <strong>
          Get three itemised quotes for the same drawings and compare the
          all-in totals line by line.
        </strong>{" "}
        Ask each builder whether the steels, drainage, glazing and VAT are
        included, and who runs the site day to day.
      </p>
      <p className={styles.p}>
        With Better Homes you get one construction contract and one team on
        site. Bring your own architect or choose an independent one we
        recommend, and we coordinate the engineer, building control, Thames
        Water and the party wall surveyors. Structural work carries a
        workmanship guarantee of up to 10 years. See how we work on our{" "}
        <Link href="/house-extension">house extensions in London</Link> page.
      </p>

      <h2 className={styles.h2} id="quick-takeaways">
        Quick takeaways
      </h2>
      <ul className={styles.ul}>
        <li>A finished 10 m² side return costs about £64,500 all-in in London.</li>
        <li>Shell only is about £52,000; with a new kitchen, about £85,500.</li>
        <li>Fees, contingency and VAT are about 39% of the total.</li>
        <li>Per m², a side return costs more than a rear extension or wraparound.</li>
        <li>You're buying width: enough for an island, which needs about 4.1 m.</li>
        <li>Check the drain and talk to your neighbour before you design.</li>
      </ul>

      <h2 className={styles.h2} id="setting-your-budget">
        Setting your side return budget
      </h2>
      <p className={styles.p}>
        Start with £64,500 for a finished 10 m² side return in outer London.
        Add £21,000 if the kitchen is new. Add £4,000 if materials have to come
        through the house with no parking outside. Then keep the 10%
        contingency aside and don't spend it on upgrades before the steel is
        in.
      </p>
      <p className={styles.p}>
        Next, test the idea against your house. Measure the back addition and
        the passage. If the two together come to more than 4.1 m, you'll get
        the island and the kitchen you're picturing. If they don't, price a
        wraparound too: it costs more in total but less per square metre, and
        it may be the better answer.
      </p>
      <p className={styles.p}>
        When you're ready to turn a budget into a fixed price, we'll survey the
        house, check the drains and the boundary, and give you an itemised
        quote. One construction contract covers the build, and we coordinate
        your architect and every approval. Start with the{" "}
        <Link href="/extension-calculator">extension calculator</Link>, or{" "}
        <Link href="/contact?service=Side%20return%20extension#brief">
          send us your brief
        </Link>{" "}
        and we'll tell you honestly what your side return will take.
      </p>
      <p className={styles.p}>
        <strong>Over to you:</strong> is your passage wide enough for the
        kitchen you want? Send us the measurements and your postcode, and
        we'll tell you.
      </p>

      <h2 className={styles.h2} id="faqs">
        Side return extension FAQs
      </h2>
      <h3 className={styles.h3}>How much does a side return extension cost in London in 2026?</h3>
      <p className={styles.p}>
        About £64,500 all-in for a finished 10 m² side return in outer London,
        including fees, party wall, a 10% contingency and VAT. Shell only is
        about £52,000, and with a new kitchen about £85,500.
      </p>
      <h3 className={styles.h3}>How much does a side return cost per m²?</h3>
      <p className={styles.p}>
        About £6,450 per m² all-in for a finished 10 m² side return in London.
        That's higher than a rear extension at about £5,370 per m², because the
        fixed costs are spread over less floor.
      </p>
      <h3 className={styles.h3}>Is a side return cheaper than a rear extension?</h3>
      <p className={styles.p}>
        In total, yes: about £64,500 against £72,500 for a 3 m deep rear
        extension. Per square metre gained, no. A side return keeps your
        garden, which is often why people choose it.
      </p>
      <h3 className={styles.h3}>Do I need planning permission for a side return extension?</h3>
      <p className={styles.p}>
        Not always. Single-storey side returns up to 4 m high, no wider than
        half the original house and with eaves under 3 m near the boundary are
        usually permitted development, unless you're in a conservation area or
        Article 4 area.
      </p>
      <h3 className={styles.h3}>What is the most expensive part of a side return extension?</h3>
      <p className={styles.p}>
        The structure: foundations, the new boundary wall, the roof and the
        steel that opens up the house. Together they make up about 61% of the
        all-in cost.
      </p>
      <h3 className={styles.h3}>Is a 3 metre extension worth it?</h3>
      <p className={styles.p}>
        Usually, if it gives you a better layout. A 3 m rear extension on a
        terrace adds about 13.5 m² and is often permitted development. It
        costs about £72,500 finished in outer London.
      </p>
      <h3 className={styles.h3}>How long does a side return extension take?</h3>
      <p className={styles.p}>
        Eight to 14 weeks on site, plus six to 16 weeks for design and
        approvals beforehand. You'll usually be without a kitchen for six to
        eight weeks of that.
      </p>

      <h2 className={styles.h2} id="references">
        References
      </h2>
      <ul className={styles.ul}>
        <li>
          <a
            href="https://www.planningportal.co.uk/permission/common-projects/extensions/planning-permission"
            target="_blank"
            rel="noopener noreferrer"
          >
            Planning Portal: extensions, planning permission and permitted
            development
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
            href="https://www.gov.uk/guidance/party-wall-etc-act-1996-guidance"
            target="_blank"
            rel="noopener noreferrer"
          >
            GOV.UK: Party Wall etc. Act 1996 guidance
          </a>
        </li>
        <li>
          <a
            href="https://www.thameswater.co.uk/developers/larger-scale-developments/sewers-and-wastewater/build-over-or-near-a-sewer"
            target="_blank"
            rel="noopener noreferrer"
          >
            Thames Water: building over or near a sewer
          </a>
        </li>
        <li>
          <a
            href="https://theintermediary.co.uk/2025/10/loft-conversions-boost-home-value-by-up-to-24-nationwide-research-shows/"
            target="_blank"
            rel="noopener noreferrer"
          >
            The Intermediary: Nationwide research on home improvements and
            value
          </a>
        </li>
      </ul>
    </article>
  );
}
