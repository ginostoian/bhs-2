/* eslint-disable react/no-unescaped-entities */
import { businessFacts } from "@/libs/businessFacts";
import Image from "next/image";
import Link from "next/link";
import extensionCostBySizeImg from "/public/assets/blog/single-storey-extension-cost-london/extension-cost-by-size-london-2026.png";
import extensionFixedCostFloorImg from "/public/assets/blog/single-storey-extension-cost-london/extension-fixed-cost-floor-london.png";
import hackneyBreakdownImg from "/public/assets/blog/single-storey-extension-cost-london/25m2-rear-extension-cost-breakdown-hackney-e8.png";
import statutoryFeesImg from "/public/assets/blog/single-storey-extension-cost-london/london-extension-statutory-fees-2026.png";
import extensionDepthEconomicsImg from "/public/assets/blog/single-storey-extension-cost-london/extension-depth-economics-3m-vs-6m-london.png";

const styles = {
  h1: "mb-8 text-4xl font-medium leading-tight tracking-tight text-[#202925] md:text-5xl",
  h2: "mb-4 mt-10 text-2xl font-bold tracking-tight text-black lg:text-4xl",
  h3: "mb-2 mt-7 text-xl font-bold tracking-tight text-black lg:text-2xl",
  p: "mb-6 leading-relaxed text-base-content/90",
  tocGrid: "mb-10 grid gap-5 md:grid-cols-2",
  tocColumn: "overflow-hidden rounded-xl border border-base-content/10 bg-white",
  tocLink:
    "block border-b border-base-content/10 px-4 py-3 text-sm leading-relaxed text-base-content/90 transition hover:bg-[#F4F1EA] hover:text-[#4D5B4B] last:border-b-0 md:text-base",
  figure:
    "my-8 overflow-hidden rounded-2xl border border-base-content/10 bg-white p-4 shadow-sm md:p-6",
  image: "h-auto w-full rounded-xl",
  figcaption: "mt-3 text-sm leading-relaxed text-base-content/70",
};

export default function SingleStoreyExtensionCostLondon() {
  return (
    <article>
      {/* ============================== H1 ============================== */}
      <h1 className={styles.h1}>
        Single Storey Extension Cost London: 2026 Price Guide
      </h1>

      {/* ======================= AI ANSWER CAPSULE ====================== */}
      <p className={styles.p}>
        A single storey extension in London costs £2,500 to £4,600 per square
        metre to build in 2026, or £3,000 to £5,000 per square metre on a fully
        architect-designed scheme. A 20 to 30 square metre rear extension lands
        between £80,000 and £135,000 all-in, including VAT, professional fees
        and statutory charges, before any kitchen fit-out.
      </p>

      {/* ========================= KEY TAKEAWAYS ======================== */}
      <h2 className={styles.h2} id="key-takeaways">
        Key takeaways
      </h2>

      <p className={styles.p}>
        Build cost runs £2,500 to £4,600 per square metre, excluding VAT. That
        £2,100 spread is specification, not postcode.
      </p>
      <p className={styles.p}>
        Roughly £24,000 to £40,000 of every project is fixed cost that barely
        moves with size – which is why small extensions cost more per square
        metre than large ones.
      </p>
      <p className={styles.p}>
        A 20 square metre extension costs £80,000 to £104,000 all-in; a 30
        square metre one £105,000 to £135,000 – half again the floor area for
        under a third more money.
      </p>
      <p className={styles.p}>
        2026 statutory fees are £548 for a householder application from 1 April,
        £249 for prior approval, plus a £91.02 Planning Portal service charge.
      </p>
      <p className={styles.p}>
        Every metre of depth beyond the first three costs £1,600 to £2,200 per
        square metre – under half the blended rate.
      </p>
      <p className={styles.p}>
        Kitchen fit-out sits outside every build figure here. Add £15,000 to
        £60,000.
      </p>

      {/* ====================== TABLE OF CONTENTS ======================= */}
      <h2 className={styles.h2} id="contents">
        What this guide covers
      </h2>

      <nav aria-label="Table of contents" className={styles.tocGrid}>
        <div className={styles.tocColumn}>
          <Link className={styles.tocLink} href="#cost-2026">The 2026 headline numbers</Link>
          <Link className={styles.tocLink} href="#cost-per-m2">Extension cost per m² London</Link>
          <Link className={styles.tocLink} href="#cost-by-size">Rear extension cost by size</Link>
          <Link className={styles.tocLink} href="#fixed-cost-floor">The fixed cost floor</Link>
          <Link className={styles.tocLink} href="#line-by-line">A 25m² extension in E8, line by line</Link>
        </div>
        <div className={styles.tocColumn}>
          <Link className={styles.tocLink} href="#fees-2026">Professional and statutory fees</Link>
          <Link className={styles.tocLink} href="#kitchen-extension">Kitchen extension cost</Link>
          <Link className={styles.tocLink} href="#depth-economics">Three metres or six?</Link>
          <Link className={styles.tocLink} href="#unbudgeted">Costs nobody budgets for</Link>
          <Link className={styles.tocLink} href="#faqs">Frequently asked questions</Link>
        </div>
      </nav>

      {/* =========================== SECTION 1 ========================== */}
      <h2 className={styles.h2} id="cost-2026">
        Single storey extension cost London 2026: the headline numbers
      </h2>

      <p className={styles.p}>
        Build cost runs £2,500 to £4,600 per square metre in 2026, excluding VAT
        and fees. On a fully architect-designed scheme, £3,000 to £5,000 is the
        realistic band. All-in, a 20 to 30 square metre rear extension costs
        £80,000 to £135,000.
      </p>
      <p className={styles.p}>
        The all-in figure is the one that matters and the one most quotes hide.
        It carries the 20 per cent VAT on every domestic extension, design and
        structural engineering fees, the planning or prior approval charge,
        building control, the party wall process, and the making-good work to
        the rooms your extension opens into. Strip that out and you arrive at
        the £2,500 headline that fills page one of Google.
      </p>
      <p className={styles.p}>
        Inner London runs 15 to 30 per cent above outer London for identical
        specification – logistics, not labour snobbery. Scaffold licences,
        parking bay suspensions, restricted hours, and terraces where every
        brick travels through the hallway. Our{" "}
        <Link href="/blog/house-extension-guide-2025">
          complete London house extension guide
        </Link>{" "}
        covers all five extension types; this page goes deep on one.
      </p>

      {/* =========================== SECTION 2 ========================== */}
      <h2 className={styles.h2} id="cost-per-m2">
        Extension cost per m2 London: what each specification tier buys
      </h2>

      <p className={styles.p}>
        Specification drives the spread, not location. Standard sits at £2,500
        to £3,100 per square metre. Mid-range – what most London homeowners
        actually choose – runs £3,100 to £3,900. High specification runs £3,900
        to £4,600 and beyond.
      </p>

      <h3 className={styles.h3}>Standard: £2,500 to £3,100 per m²</h3>
      <p className={styles.p}>
        Cavity blockwork with a rendered or brick outer skin, EPDM warm flat
        roof, two rooflights, basic aluminium French doors, radiators off the
        existing system, plastered walls, board flooring. Sound, compliant,
        unremarkable.
      </p>

      <h3 className={styles.h3}>Mid-range: £3,100 to £3,900 per m²</h3>
      <p className={styles.p}>
        Matching stock brick, thermally broken aluminium sliding doors across a
        3 to 4 metre opening, a roof lantern, underfloor heating on liquid
        screed, better joinery and floors. This is where most of our{" "}
        <Link href="/locations/hackney">Hackney</Link> and{" "}
        <Link href="/locations/walthamstow">Walthamstow</Link> projects land.
      </p>

      <h3 className={styles.h3}>High specification: £3,900 to £4,600+ per m²</h3>
      <p className={styles.p}>
        Crittall-style steel glazing, structural glass, bespoke joinery, stone
        or large-format porcelain, MVHR, lighting design. A 4 metre Crittall
        screen costs around £18,000 where an aluminium equivalent costs £8,000 –
        one decision, £10,000, on a footprint that has not moved a centimetre.
      </p>

      {/* =========================== SECTION 3 ========================== */}
      <h2 className={styles.h2} id="cost-by-size">
        Rear extension cost London by size: 15m² to 35m²
      </h2>

      <p className={styles.p}>
        Total cost rises with size; the rate per square metre falls sharply.
        These are all-in mid-range figures, including VAT, professional fees,
        statutory charges and party wall, excluding kitchen fit-out.
      </p>
      <p className={styles.p}>
        15 m² – a modest side return or shallow rear: £62,000 to £82,000, or
        £4,130 to £5,470 per m².
      </p>
      <p className={styles.p}>
        20 m² – three metres deep on a typical terrace: £80,000 to £104,000, or
        £4,000 to £5,200 per m². This is the 20m2 extension cost band most
        London homeowners are searching for.
      </p>
      <p className={styles.p}>
        25 m² – 3.5 to 4 metres deep, full width: £92,000 to £118,000, or £3,680
        to £4,720 per m².
      </p>
      <p className={styles.p}>
        30 m² – a deep rear extension: £105,000 to £135,000, or £3,500 to £4,500
        per m².
      </p>
      <p className={styles.p}>
        35 m²: £118,000 to £152,000, or £3,371 to £4,343 per m². Test these
        against your own footprint with our{" "}
        <Link href="/extension-calculator">extension cost calculator</Link>.
      </p>
      <p className={styles.p}>
        Read the two ends together. Doubling floor area from 15 to 30 square
        metres adds around 65 per cent to the bill, not 100 per cent. The reason
        is the next section.
      </p>
      <figure className={styles.figure}>
        <Image
          src={extensionCostBySizeImg}
          alt="Bar chart showing single storey extension cost in London 2026 by size, from £62,000 for 15 square metres to £152,000 for 35 square metres, with cost per square metre falling as size increases."
          width={1200}
          height={900}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          All-in London extension cost rises with size, but the per-square-metre rate falls as fixed costs are spread further.
        </figcaption>
      </figure>

      {/* =========================== SECTION 4 ========================== */}
      <h2 className={styles.h2} id="fixed-cost-floor">
        The fixed cost floor: why small extensions cost more per square metre
      </h2>

      <p className={styles.p}>
        Between £24,000 and £40,000 of any single storey extension is fixed cost
        that barely changes whether you build 15 square metres or 35. Spread it
        over a small footprint and the per-square-metre rate inflates. Spread it
        over a large one and it dilutes. No competitor cost guide explains this,
        and it is exactly why published rates appear to contradict each other.
      </p>
      <p className={styles.p}>
        Design and structural engineering, £6,000 to £12,000: an engineer sizes
        one beam whether the room behind it is 15 square metres or 35.
      </p>
      <p className={styles.p}>
        Site set-up, welfare, skips, scaffold and protection, £4,500 to £8,000.
        Structural steel, padstones and installation, £3,500 to £7,000 – the
        opening between old house and new room is the same width regardless of
        depth.
      </p>
      <p className={styles.p}>
        Glazing to the garden elevation, £6,000 to £14,000: a 3.6 metre sliding
        door costs the same whether it sits three or six metres from the
        original rear wall. Party wall and statutory fees, £3,100 to £6,400.
      </p>
      <p className={styles.p}>
        The consequence is simple. Once you have committed to that fixed
        £30,000, extra depth is the cheapest floor area you will buy in London.
      </p>
      <figure className={styles.figure}>
        <Image
          src={extensionFixedCostFloorImg}
          alt="Infographic explaining the fixed cost floor of a London single storey extension, showing £24,000 to £40,000 of design, glazing, site set-up, structural steel and party wall costs."
          width={1200}
          height={1000}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The fixed cost floor is why a larger footprint can deliver a lower blended rate without making the project cheap.
        </figcaption>
      </figure>

      {/* =========================== SECTION 5 ========================== */}
      <h2 className={styles.h2} id="line-by-line">
        Line by line: a 25m² rear extension in E8
      </h2>

      <p className={styles.p}>
        A Victorian mid-terrace in Hackney, E8. Three metres deep across the
        full 8.3 metre width, warm flat roof, two rooflights, 3.6 metre sliding
        doors, underfloor heating. Total all-in £96,400 excluding the kitchen;
        construction alone £72,000 excluding VAT, or £2,880 per square metre.
      </p>
      <p className={styles.p}>
        Demolition, enabling works and site set-up £4,900. Foundations,
        groundworks and a drainage diversion around an unrecorded Victorian run
        £13,100. Brick and block shell with full-fill cavity insulation £12,800.
        Structural steel, padstones and installation £5,400.
      </p>
      <p className={styles.p}>
        EPDM warm flat roof with two 1,200 × 800 rooflights £8,700. Thermally
        broken aluminium sliding doors £7,900. First and second fix electrics
        and plumbing £6,600. Liquid screed, underfloor heating, plastering,
        decoration and flooring £8,400. Making good to the existing kitchen and
        hallway £4,200.
      </p>
      <p className={styles.p}>
        On top of the £72,000: VAT £14,400, design and structural engineering
        £7,300, statutory fees, building control and party wall £2,700.
      </p>
      <p className={styles.p}>
        Note the two lines most quotes omit – groundworks inflated by a drain
        nobody knew about, and £4,200 of making good. Together, 24 per cent of
        the construction figure.
      </p>
      <figure className={styles.figure}>
        <Image
          src={hackneyBreakdownImg}
          alt="Detailed cost breakdown of a £96,400 twenty-five square metre rear extension on a Victorian terrace in Hackney E8, showing nine construction line items totalling £72,000 plus VAT, design fees and statutory costs."
          width={1200}
          height={1100}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          A postcode-specific E8 breakdown showing where the money went, including the drainage diversion and making-good lines often omitted from early quotes.
        </figcaption>
      </figure>

      {/* =========================== SECTION 6 ========================== */}
      <h2 className={styles.h2} id="fees-2026">
        Professional and statutory fees in London, 2026
      </h2>

      <p className={styles.p}>
        Statutory fees rose on 1 April 2026 and change again on 8 December 2026.
        Most cost guides still quote 2024 figures.
      </p>

      <h3 className={styles.h3}>Planning and building control</h3>
      <p className={styles.p}>
        Householder planning application: £548 from 1 April 2026, up from £528.
        Prior approval under the Larger Home Extension Scheme, Part 1 Class A:
        £249. Lawful Development Certificate for proposed works: half the
        householder fee, around £274. The Planning Portal adds £91.02 including
        VAT on top of any of these.
      </p>
      <p className={styles.p}>
        Building control full plans and inspections: £1,100 to £1,900 across
        most London boroughs, above the £800 to £1,500 quoted nationally.
        Mandatory whether or not you need planning permission. If your
        application is refused, our guide to{" "}
        <Link href="/blog/planning-permission-refused-london">
          planning permission refusals in London
        </Link>{" "}
        sets out the appeal and resubmission routes.
      </p>

      <h3 className={styles.h3}>Party wall surveyor cost in London</h3>
      <p className={styles.p}>
        Roughly 95 per cent of London extensions trigger the Party Wall etc. Act
        1996, because almost every extension excavates within three metres of a
        neighbour's foundations. A single agreed surveyor costs £900 to £1,500.
        Where both sides appoint separately, budget £2,000 to £3,600 per
        neighbour – so £4,000 to £7,200 on a mid-terrace where both neighbours
        dissent. Serve notice early: fourteen days of silence counts as dissent.
      </p>
      <figure className={styles.figure}>
        <Image
          src={statutoryFeesImg}
          alt="Card grid of 2026 London house extension statutory fees showing £548 householder planning application, £249 prior approval, £274 lawful development certificate, £91.02 Planning Portal charge, £1,100 to £1,900 building control and £900 to £1,500 party wall surveyor costs."
          width={1200}
          height={850}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The 2026 paperwork costs worth allowing for before a London extension starts on site.
        </figcaption>
      </figure>

      {/* =========================== SECTION 7 ========================== */}
      <h2 className={styles.h2} id="kitchen-extension">
        Kitchen extension cost: what the fit-out adds
      </h2>

      <p className={styles.p}>
        Every figure above excludes the kitchen. Kitchen extension cost in
        London is the build cost plus £15,000 to £60,000, and that range is wide
        because cabinetry is the most elastic purchase in the project.
      </p>
      <p className={styles.p}>
        £15,000 to £22,000 buys a trade-supplied kitchen with compact-laminate
        worktops and mid-tier integrated appliances. £25,000 to £40,000 buys
        quartz, better carcasses and appliances people recognise. Above £45,000
        you are into German or Italian cabinetry.
      </p>
      <p className={styles.p}>
        The economic case is strongest here. An open-plan kitchen extension adds
        10 to 15 per cent to a London property's value against 5 to 10 per cent
        for a rear extension without one. On a £700,000 terrace that is £35,000
        of extra value for perhaps £28,000 of kitchen. Our{" "}
        <Link href="/blog/house-extension-value-london-guide">
          extension value guide
        </Link>{" "}
        breaks the uplift down by borough.
      </p>

      {/* =========================== SECTION 8 ========================== */}
      <h2 className={styles.h2} id="depth-economics">
        Three metres or six? The depth economics most guides skip
      </h2>

      <p className={styles.p}>
        A single storey rear extension is permitted development up to 3 metres
        beyond the original rear wall on a terraced or semi-detached house, or 4
        metres detached. The Larger Home Extension Scheme takes that to 6 and 8
        metres through prior approval. Nobody publishes what the extra depth
        costs.
      </p>
      <p className={styles.p}>
        Once foundations are being dug, steels ordered, the roof edge formed and
        the doors bought, each additional square metre costs roughly £1,600 to
        £2,200 – the marginal rate, not the £3,500 to £5,000 blended rate.
      </p>
      <p className={styles.p}>
        On a 4.5 metre wide terrace, going from 3 to 6 metres adds 13.5 square
        metres. At the marginal rate that is £21,600 to £29,700, about £1,900
        per square metre – under half what the first three metres cost. Add £249
        for prior approval and £91.02 to the Planning Portal.
      </p>
      <p className={styles.p}>
        The real price is time and risk. Neighbours get 21 days to comment; the
        council has 42 days to determine. On a dense London street, an objection
        on daylight grounds gives a case officer ample reason to refuse. And
        conservation areas and Article 4 land are excluded from the scheme
        entirely – which rules out much of Islington before you start.
      </p>
      <figure className={styles.figure}>
        <Image
          src={extensionDepthEconomicsImg}
          alt="Diagram comparing the cost of a three metre versus six metre deep rear extension in London, showing the first three metres cost £3,500 to £5,000 per square metre while metres four to six cost £1,600 to £2,200 per square metre at the marginal rate."
          width={1200}
          height={950}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Extra depth is often the lowest-cost floor area, but the planning and neighbour timetable changes with it.
        </figcaption>
      </figure>

      {/* =========================== SECTION 9 ========================== */}
      <h2 className={styles.h2} id="unbudgeted">
        The costs almost nobody budgets for
      </h2>

      <p className={styles.p}>
        Between £8,000 and £18,000 of a typical London extension sits outside
        the builder's construction quote. This is what turns a £96,000 project
        into a £110,000 one.
      </p>
      <p className={styles.p}>
        Floor level reconciliation, £2,000 to £5,000: new screed almost never
        matches an old Victorian floor. Boiler and consumer unit, £3,300 to
        £5,400: underfloor heating plus a dozen new circuits regularly exceeds
        what a fifteen-year-old system can carry.
      </p>
      <p className={styles.p}>
        Drainage, £1,800 to £4,500: Victorian runs rarely sit where drawings
        assume, and building over a shared run needs a Thames Water agreement.
        Garden reinstatement, £1,500 to £4,000, once a three-tonne excavator has
        crossed it.
      </p>

      <h3 className={styles.h3}>Inflation between quote and start date</h3>
      <p className={styles.p}>
        BCIS recorded general building costs up 3.8 per cent in the year to Q2
        2026, with fabricated structural steel up 8.2 per cent. A London
        extension typically has three to six months between quotation and first
        spade. Allow 1.5 to 2 per cent for the gap, or contract on a fixed
        price. Hold a further 10 to 15 per cent contingency: on a Victorian
        terrace, opening up reveals crumbling brickwork or undersized footings
        often enough that treating contingency as optional is a decision, not an
        oversight. If cash flow is the constraint, our{" "}
        <Link href="/blog/how-to-finance-house-extension-renovation-london-2026">
          extension finance guide
        </Link>{" "}
        compares the borrowing routes.
      </p>

      {/* ======================= QUICK TAKEAWAYS ======================== */}
      <h2 className={styles.h2} id="quick-takeaways">
        Quick takeaways
      </h2>

      <p className={styles.p}>
        1. £2,500 to £4,600 per square metre to build; £80,000 to £135,000
        all-in for 20 to 30 square metres.
      </p>
      <p className={styles.p}>
        2. £24,000 to £40,000 of every project is fixed cost. Small extensions
        carry it badly.
      </p>
      <p className={styles.p}>
        3. Extra depth is the cheapest floor area available – £1,600 to £2,200
        per square metre at the margin.
      </p>
      <p className={styles.p}>
        4. 2026 fees: £548 householder application, £249 prior approval, £91.02
        Planning Portal, £1,100 to £1,900 building control.
      </p>
      <p className={styles.p}>
        5. Party wall runs £900 to £1,500 for an agreed surveyor, up to £7,200
        where both neighbours dissent.
      </p>
      <p className={styles.p}>
        6. Kitchen fit-out adds £15,000 to £60,000 and lifts value uplift from 5
        to 10 per cent to 10 to 15 per cent.
      </p>

      {/* ========================== CONCLUSION ========================== */}
      <h2 className={styles.h2} id="conclusion">
        Getting your extension budget right first time
      </h2>

      <p className={styles.p}>
        Homeowners who finish on budget are rarely those who found the cheapest
        builder. They are the ones who understood the shape of the cost first:
        that the fixed £30,000 rewards building bigger, that VAT is £14,400 and
        not a rounding error, and that a quote without a stated foundation depth
        assumption is a guess wearing a suit.
      </p>
      <p className={styles.p}>
        Use this page as a test. Hand your contractor the E8 breakdown and ask
        where their scheme differs. Ask whether VAT is in or out, who serves the
        party wall notices, and what happens if foundations go 300mm deeper than
        assumed. A good builder answers line by line. A poor one talks about
        quality and changes the subject.
      </p>
      <p className={styles.p}>{businessFacts.architect} {businessFacts.workmanship} {businessFacts.insurance}</p>
      <p className={styles.p}>
        If you know roughly what you want to build,{" "}
        <Link href="/house-extension">get a fixed extension quote</Link> and we
        will price your actual footprint rather than a national average. Or book
        a free consultation and we will tell you honestly what your budget will
        and will not buy.
      </p>

      {/* ========================== ENGAGEMENT =========================== */}
      <h2 className={styles.h2} id="engagement">
        Over to you
      </h2>

      <p className={styles.p}>
        Which number surprised you most – the VAT, the party wall bill, or the
        making-good nobody mentioned at quote stage? Tell us in the comments,
        and pass this to the neighbour about to have the same conversation.
      </p>

      {/* ============================= FAQs ============================= */}
      <h2 className={styles.h2} id="faqs">
        Frequently asked questions
      </h2>

      <h3 className={styles.h3}>
        How much does a 20m2 extension cost in London in 2026?
      </h3>
      <p className={styles.p}>
        £80,000 to £104,000 all-in at mid-range specification, including VAT,
        professional fees, statutory charges and party wall. Construction alone
        is £50,000 to £78,000 excluding VAT. Add £15,000 to £60,000 for a new
        kitchen.
      </p>

      <h3 className={styles.h3}>
        What is the rear extension cost per m2 in London?
      </h3>
      <p className={styles.p}>
        £2,500 to £4,600 per square metre for construction excluding VAT, or
        £3,000 to £5,000 architect-designed. All-in rates run from £3,371 per
        square metre at 35 square metres up to £5,470 at 15, because smaller
        extensions carry the fixed costs less efficiently.
      </p>

      <h3 className={styles.h3}>
        Do I need planning permission for a single storey rear extension in
        London?
      </h3>
      <p className={styles.p}>
        Usually not. Up to 3 metres deep on a terraced or semi-detached house,
        or 4 metres detached, is permitted development – subject to a 3 metre
        eaves height near the boundary, matching materials and the 50 per cent
        curtilage limit. Beyond that you need prior approval at £249.
        Conservation areas and Article 4 land are excluded.
      </p>

      <h3 className={styles.h3}>
        How much does a kitchen extension cost in London?
      </h3>
      <p className={styles.p}>
        Take the build cost for your footprint and add £15,000 to £60,000. A 25
        square metre rear extension with a mid-market kitchen totals £115,000 to
        £145,000 all-in. Open-plan kitchen extensions return 10 to 15 per cent
        of property value – the strongest uplift of any single storey project.
      </p>

      <h3 className={styles.h3}>
        How long does a single storey extension take to build?
      </h3>
      <p className={styles.p}>
        Twelve to sixteen weeks on site. The full project runs six to nine
        months including design, planning or prior approval, building
        regulations and the party wall process. Prior approval alone adds up to
        42 days for determination.
      </p>

      <h3 className={styles.h3}>Is VAT payable on a house extension in London?</h3>
      <p className={styles.p}>
        Yes. Work to an existing dwelling is standard-rated at 20 per cent on
        both labour and materials, with no exemption for extensions. On a
        £72,000 construction figure, VAT is £14,400. Check whether a quote is
        inclusive or exclusive before comparing it with another.
      </p>

      {/* ========================== REFERENCES =========================== */}
      <h2 className={styles.h2} id="references">
        References
      </h2>

      <p className={styles.p}>
        1.{" "}
        <a
          href="https://www.gov.uk/government/publications/permitted-development-rights-for-householders-technical-guidance"
          target="_blank"
          rel="noopener noreferrer"
        >
          UK Government – Permitted Development Rights for Householders:
          Technical Guidance
        </a>
      </p>
      <p className={styles.p}>
        2.{" "}
        <a
          href="https://www.planningportal.co.uk/planning/planning-applications/find-out-more/fees"
          target="_blank"
          rel="noopener noreferrer"
        >
          Planning Portal – Planning Application Fees, England
        </a>
      </p>
      <p className={styles.p}>
        3.{" "}
        <a
          href="https://www.bcis.co.uk/news/bcis-construction-industry-forecast/"
          target="_blank"
          rel="noopener noreferrer"
        >
          BCIS – Construction Industry Forecast, Q2 2026
        </a>
      </p>
      <p className={styles.p}>
        4.{" "}
        <a
          href="https://www.gov.uk/party-walls-building-works"
          target="_blank"
          rel="noopener noreferrer"
        >
          UK Government – Party Walls and Building Work
        </a>
      </p>
      <p className={styles.p}>
        5.{" "}
        <a
          href="https://www.gov.uk/guidance/buildings-and-construction-vat-notice-708"
          target="_blank"
          rel="noopener noreferrer"
        >
          HMRC – VAT Notice 708: Buildings and Construction
        </a>
      </p>
    </article>
  );
}

/*
=========================================================================
SCHEMA REQUIREMENTS
=========================================================================

Article schema
  headline       Single Storey Extension Cost London: 2026 Price Guide
  author         { Person, "Gino S.", /blog/author/gino }
  publisher      { Organization, "BH Studio", /assets/logo/bh-logo.svg }
  datePublished  [ISO 8601 publish date]
  dateModified   [update on every edit - Perplexity weights freshness]
  mainEntityOfPage
                 /blog/single-storey-extension-cost-london
  image          /blog/images/single-storey-extension-cost-london/
                 single-storey-extension-cost-london-2026.png

FAQPage schema
  Mark up all 6 Q&As in #faqs verbatim as Question / acceptedAnswer pairs.

BreadcrumbList
  Home > Articles > Extensions > Single Storey Extension Cost London

Meta
  Title (51)   Single Storey Extension Cost London 2026 | BH Studio
  Desc  (154)  Single storey extension cost London 2026: GBP2,500-4,600/m2
               build, 80k-135k all-in for 20-30m2. Real project breakdown,
               2026 fees, party wall costs.
  Canonical    https://bhstudio.co.uk/blog/single-storey-extension-cost-london
*/
