/* eslint-disable react/no-unescaped-entities */
import Image from "next/image";
import Link from "next/link";
import extensionTypesEditorialMatrixImg from "/public/assets/blog/house-extension-types/extension-types-editorial-matrix.png";
import betterHomesExtensionHeroImg from "/public/assets/blog/house-extension-types/better-homes-extension-hero.png";
import sideReturnVsRearEditorialImg from "/public/assets/blog/house-extension-types/side-return-vs-rear-extension-editorial.png";
import permittedDevelopmentDecisionGuideImg from "/public/assets/blog/house-extension-types/permitted-development-decision-guide.png";
import houseExtensionCostIndexImg from "/public/assets/blog/house-extension-types/house-extension-cost-index-london-2026.png";

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

/**
 * BH Studio – /blog/house-extension-types  (rewrite in place, URL unchanged)
 * Full replacement for the April 2025 version. No redirect required.
 * Primary keyword: types of house extensions
 * Page type: informational spoke supporting /house-extension
 */

export default function TypesOfHouseExtensionsLondon() {
  return (
    <article>
      <h1 className={styles.h1}>Types of House Extensions in London: 2026 Guide</h1>

      {/* ── AI ANSWER CAPSULE ───────────────────────────────────────────── */}
      <p className={styles.p}>
        There are nine types of house extensions used on London homes: rear, side return,
        wraparound, double storey, over-structure, loft, basement, garage conversion and glazed
        extensions. In 2026, London build costs run from £1,400 per m² for a garage conversion to
        £6,500 per m² for a new basement. Your plot geometry, not your budget, usually decides
        which is possible.
      </p>

      {/* ── KEY TAKEAWAYS ───────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="key-takeaways">Key takeaways</h2>
      <p className={styles.p}>
        • Judge cost per square metre you keep, not per square metre built. A side return costs
        more per m² and takes no garden.
      </p>
      <p className={styles.p}>
        • A second storey adds 50–70% to cost and 100% to floor area, at roughly £2,800–£4,200
        per m² across both levels.
      </p>
      <p className={styles.p}>
        • Side extensions lose permitted development rights entirely in conservation areas –
        which covers much of Islington, Hackney and Haringey.
      </p>
      <p className={styles.p}>
        • Your allowance is measured against the house as it stood on 1 July 1948. A previous
        owner&apos;s addition eats into what you can build today.
      </p>
      <p className={styles.p}>
        • Fees changed on 1 April 2026: £548 for a householder application, £274 for a lawful
        development certificate, £249 for prior approval.
      </p>

      {/* ── TABLE OF CONTENTS ───────────────────────────────────────────── */}
      <h2 className={styles.h2} id="contents">Contents</h2>
      <nav aria-label="Table of contents" className={styles.tocGrid}>
        <div className={styles.tocColumn}>
          <Link className={styles.tocLink} href="#extension-types-overview">The nine types, grouped</Link>
          <Link className={styles.tocLink} href="#ground-floor-extensions">Ground-floor extensions</Link>
          <Link className={styles.tocLink} href="#building-up">Building up: storeys and lofts</Link>
          <Link className={styles.tocLink} href="#using-existing-space">Using space you already own</Link>
          <Link className={styles.tocLink} href="#glazed-extensions">Glazed extensions and garden rooms</Link>
          <Link className={styles.tocLink} href="#cost-by-type">Cost by extension type in London</Link>
        </div>
        <div className={styles.tocColumn}>
          <Link className={styles.tocLink} href="#side-return-vs-rear">Side return vs rear extension</Link>
          <Link className={styles.tocLink} href="#single-vs-double-storey">Single storey vs double storey</Link>
          <Link className={styles.tocLink} href="#which-type-suits-your-property">Which type your plot allows</Link>
          <Link className={styles.tocLink} href="#permitted-development-by-type">Permitted development by type</Link>
          <Link className={styles.tocLink} href="#party-wall-by-type">Party wall exposure by type</Link>
          <Link className={styles.tocLink} href="#combining-types">Combining types in one build</Link>
        </div>
      </nav>

      {/* ── SECTION 1 ───────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="extension-types-overview">The nine types of house extension, grouped</h2>
      <p className={styles.p}>
        Every extension does one of three things: it takes garden, it takes air, or it takes space
        you already own but cannot currently live in. Group the nine formats that way and the choice
        gets much simpler.
      </p>
      <p className={styles.p}>
        Taking garden gives you rear, side return, wraparound and glazed extensions. Taking air gives
        you double storey, over-structure and loft. Reclaiming existing space gives you garage and
        basement conversions – the group homeowners overlook, and often the cheapest floor area on the
        property. Most guides to the different types of house extensions stop at describing shapes. The
        useful question is narrower: which of the nine does your plot, your constraints and your remaining
        permitted development allowance permit? A 6m-wide Victorian terrace in E8 with a 9m garden has three
        realistic options. A 1930s semi in N10 with a garage and a hipped roof has five.
      </p>
      <figure className={styles.figure}>
        <Image
          src={extensionTypesEditorialMatrixImg}
          alt="Better Homes editorial matrix comparing nine London house extension types by typical area, budget and the main plot change."
          width={1200}
          height={1500}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The nine formats compared by space gained, typical London cost and planning route.
        </figcaption>
      </figure>

      {/* ── SECTION 2 ───────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="ground-floor-extensions">Ground-floor extensions: rear, side return and wraparound</h2>
      <p className={styles.p}>
        Ground-floor extensions are the most common house extension types in London because they deliver
        the kitchen-diner most period homes lack. They also consume garden, which in this city is a real
        cost rather than a free input.
      </p>
      <figure className={styles.figure}>
        <Image
          src={betterHomesExtensionHeroImg}
          alt="Better Homes editorial photograph of a warm contemporary rear extension on a London Victorian terrace."
          width={1200}
          height={900}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          A finished London rear extension can be beautiful, but the right format starts with the plot and the problem it needs to solve.
        </figcaption>
      </figure>

      <h3 className={styles.h3}>Rear extension</h3>
      <p className={styles.p}>
        A rear extension pushes straight out from the back wall. It is the simplest format to build: one
        footprint, one roof, usually one structural opening. Depth is where the money and the planning risk
        sit – permitted development allows 3m beyond the original rear wall on a terraced or semi-detached
        house, 4m on a detached one, with a prior approval route to 6m and 8m.
      </p>
      <p className={styles.p}>
        A BH Studio project in Clapton, E5, added 22m² at 4m depth for £84,000, including structural steel,
        a 3.6m sliding door set and full electrics, finished in 14 weeks. The garden went from 11m to 7m.
        That trade is fine on a long plot and painful on a short one.
      </p>

      <h3 className={styles.h3}>Side return and infill extension</h3>
      <p className={styles.p}>
        A side return extension fills the strip of dead ground alongside the original rear closet wing – the
        alley Victorian builders left for coal and drainage. An infill extension is the same move where the
        gap sits between two existing additions. You typically gain 1.5m to 2.2m of width and 8m² to 15m².
      </p>
      <p className={styles.p}>
        Width transforms a galley kitchen in a way depth never does, and roof glazing over the new strip pushes
        daylight into the middle of the plan, which is exactly where deep London terraces go dark. A side return
        we completed in Walthamstow, E17, gained 11m² for £52,000 and left the garden untouched.
      </p>

      <h3 className={styles.h3}>Wraparound extension</h3>
      <p className={styles.p}>
        A wraparound extension – or L-shaped extension – combines rear and side return into one continuous
        structure, producing the largest single-storey footprint available on a standard terrace at 28m² to
        40m². A wraparound in Muswell Hill, N10, ran to £126,000 for 31m². Almost all need full planning
        permission, for reasons covered below.
      </p>

      {/* ── SECTION 3 ───────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="building-up">Building up: double storey, over-structure and loft</h2>
      <p className={styles.p}>
        Building up buys floor area without spending garden, and costs less per square metre than building out
        because foundations, roof and scaffold are shared. It also disrupts more of the house and almost always
        needs planning permission.
      </p>

      <h3 className={styles.h3}>Double storey extension</h3>
      <p className={styles.p}>
        A double storey extension adds ground-floor living space and a bedroom or bathroom above in one programme.
        A 20m² footprint yields 40m² internally, which is why the rate falls to roughly £2,800–£4,200 per m² in
        London while the total lands between £120,000 and £200,000. An Islington project added 38m² across two
        floors for £148,000.
      </p>

      <h3 className={styles.h3}>Over-structure extension</h3>
      <p className={styles.p}>
        An over-structure extension builds a new room on top of something already there, usually a single-storey
        side garage on a 1930s to 1980s semi. It is the fastest route to a fourth bedroom with an en-suite. The
        catch is invisible from the street: garage foundations were rarely designed to carry a storey. Expect a
        trial pit, and budget £6,000–£12,000 for underpinning if the footing is shallow. Any builder who quotes
        an over-structure without digging first is guessing.
      </p>

      <h3 className={styles.h3}>Loft conversion</h3>
      <p className={styles.p}>
        A <Link href="/loft-conversion">loft conversion</Link> extends into the roof rather than the plot, which
        is why it survives on sites where nothing else fits. London costs run from around £60,000 for a rooflight
        conversion to £120,000 for a full mansard. If you are weighing this against building out, our{" "}
        <Link href="/blog/loft-conversion-vs-house-extension-london">loft conversion vs house extension comparison</Link>{" "}
        sets the two side by side.
      </p>

      {/* ── SECTION 4 ───────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="using-existing-space">Extensions that use space you already own</h2>
      <p className={styles.p}>
        Two formats add habitable area without adding a square metre of footprint. They are the cheapest and the
        most expensive options on this page, and both are routinely mispriced.
      </p>

      <h3 className={styles.h3}>Garage conversion</h3>
      <p className={styles.p}>
        Converting an integral or attached garage costs roughly £1,400–£2,200 per m² in London. A standard 15m²
        single garage converts for £22,000–£33,000: raised insulated floor, infill wall and window where the door
        was, upgraded roof insulation, heating, rewiring. The shell exists, so a competent team is in and out in
        four to six weeks. Check your title deeds and any estate-wide Article 4 direction first – some London
        estates protect off-street parking.
      </p>

      <h3 className={styles.h3}>Basement extension</h3>
      <p className={styles.p}>
        A <Link href="/basement-conversion">basement conversion</Link> is the most technically demanding format in
        domestic construction. Converting a dry existing cellar runs £2,800–£4,200 per m². Lowering one runs
        £4,000–£5,500. A full dig-down under an occupied house – underpinning, BS 8102 waterproofing, drainage,
        lightwells – runs £4,800–£6,500 per m² and rarely lands under £180,000. It earns its keep in prime postcodes
        where the square metre is worth more than it costs to build.
      </p>

      {/* ── SECTION 5 ───────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="glazed-extensions">Glazed extensions: orangeries, conservatories and garden rooms</h2>
      <p className={styles.p}>
        Glazed and detached structures sit at the cheap end of the market, and carry one financial detail nobody
        mentions until valuation day: a conservatory or garden room is frequently excluded from gross internal area.
        The space you paid for may not appear in the figure a lender or buyer works from.
      </p>
      <p className={styles.p}>
        An orangery – masonry piers, solid perimeter, glazed lantern – is usually treated as a proper extension and
        included, which is why we recommend it over a conservatory wherever resale matters. Budget £2,200–£3,200 per m².
        A detached garden room costs £18,000–£45,000 and generally avoids planning permission if it stays single storey,
        below 2.5m high within 2m of a boundary, and is not separate living accommodation. Use one for a studio or gym.
        Do not use one to solve a kitchen problem.
      </p>

      {/* ── SECTION 6 ───────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="cost-by-type">Cost by extension type in London (2026)</h2>
      <p className={styles.p}>
        London build costs sit 25% to 40% above the national average. The 2026 working ranges: £2,800–£4,500 per m²
        for a single storey rear extension, £3,000–£4,800 for a side return, £2,800–£4,200 for a double storey across
        both floors, £1,400–£2,200 for a garage conversion, £4,800–£6,500 for a new basement. Those are construction
        figures before VAT, fees and fit-out.
      </p>
      <figure className={styles.figure}>
        <Image
          src={houseExtensionCostIndexImg}
          alt="Better Homes London 2026 cost index comparing construction cost per square metre across six extension types."
          width={1200}
          height={1200}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          Construction-only London ranges vary materially by extension type, access, structure and specification.
        </figcaption>
      </figure>
      <p className={styles.p}>
        Add 10–15% for professional fees, 20% VAT, £1,500–£3,600 per affected neighbour for party wall matters, and
        £10,000–£30,000 if a kitchen is going into the new space. A 25m² rear extension quoted at £75,000 for the shell
        is a £110,000 project once it is a room you can cook in. Run your numbers through our{" "}
        <Link href="/extension-calculator">extension cost calculator</Link>, then read the detailed{" "}
        <Link href="/blog/single-storey-extension-cost-london">single storey extension costs</Link> breakdown before
        you set a budget.
      </p>
      <p className={styles.p}>
        One number matters more than the headline rate: cost per square metre you keep. The Clapton rear extension
        delivered 22m² at £3,800 per m² and spent 4m of garden. The Walthamstow side return delivered 11m² at £4,700
        per m² and spent none. On a short plot the more expensive format is the better buy, and no per-square-metre
        table will tell you that.
      </p>

      {/* ── SECTION 7 ───────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="side-return-vs-rear">Side return vs rear extension, and when a wraparound beats both</h2>
      <p className={styles.p}>
        Choose a side return when the problem is width, daylight in the middle of the plan, or a garden you cannot
        afford to shorten. Choose a rear extension when the ground floor already works and you simply need more of it.
        The side return vs rear extension question is really about which dimension your house is short of.
      </p>
      <p className={styles.p}>
        Most London terraces are 4.5m to 6m wide internally and 9m to 14m deep. Depth is rarely the shortage. Adding
        3m to a plan that is already 11m deep tends to produce a long, dark middle – which is why so many rear
        extensions arrive with a rooflight bolted on late in the design as a rescue. Adding 1.8m of width to a 2.4m
        galley kitchen produces a 4.2m room. That is a different house.
      </p>
      <figure className={styles.figure}>
        <Image
          src={sideReturnVsRearEditorialImg}
          alt="Better Homes comparison graphic showing when a side return or rear extension suits a London home."
          width={1200}
          height={900}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          The useful decision is not which extension is better in general, but which dimension your home is short of.
        </figcaption>
      </figure>
      <p className={styles.p}>
        A wraparound beats both where you have a side return of at least 1.2m and a garden long enough to give up 3m.
        It is also the format most likely to need full planning, most likely to require a party wall award with two
        neighbours, and most likely to be refused on daylight grounds where a terrace steps down a slope.
      </p>

      {/* ── SECTION 8 ───────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="single-vs-double-storey">Single storey vs double storey: the maths</h2>
      <p className={styles.p}>
        Adding the second storey does not double the price. Foundations, groundworks, scaffold and roof are already
        paid for, so the upper floor typically adds 50–70% to the cost of the single storey version while adding 100%
        to the floor area.
      </p>
      <p className={styles.p}>
        Run it on a 20m² footprint. A single storey rear extension at £3,500 per m² is £70,000 for 20m². The double
        storey version lands near £115,000 for 40m² – £2,875 per m². You pay 64% more and receive twice the space, and
        the upper floor is a bedroom, which is the unit London buyers price a house by.
      </p>
      <p className={styles.p}>
        Three things cancel that advantage in the single storey vs double storey decision. Planning is harder, because
        a second floor affects neighbours&apos; daylight and outlook. The build runs 20 to 26 weeks against 12 to 16,
        and you may need to move out. And the 7m rear boundary rule below removes permitted development from most
        terraced sites. Our <Link href="/blog/house-extension-value-london-guide">house extension value guide</Link>{" "}
        covers what each format returns at resale.
      </p>

      {/* ── SECTION 9 ───────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="which-type-suits-your-property">Which type your property will actually allow</h2>
      <p className={styles.p}>
        Before you shortlist a format, take five measurements. They eliminate more options than any planning
        consultation, and take twenty minutes with a tape and a title plan.
      </p>
      <p className={styles.p}>
        Measure the side return at its narrowest point – under 1.1m and the internal gain after wall thickness is not
        worth the disruption. Measure garden depth from the original rear wall, not the current one. Measure rear wall
        to rear boundary, because 7m decides whether a double storey can be permitted development. Measure the width of
        the original house, because a permitted development side extension cannot exceed half of it. Then check the roof:
        a hipped roof on a semi opens up a hip-to-gable loft; a mansard usually rules out a straightforward dormer.
      </p>
      <p className={styles.p}>
        Now read the constraints layer – conservation area, Article 4 direction, listed status, a protected tree in the
        garden, biodiversity net gain on a larger footprint. A house inside a Hackney conservation area and an identical
        terrace three streets outside it have materially different option sets, which is why our{" "}
        <Link href="/locations/hackney">Hackney renovation team</Link> starts every feasibility with the constraints map
        rather than the sketch.
      </p>

      {/* ── SECTION 10 ──────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="permitted-development-by-type">Permitted development by extension type in 2026</h2>
      <p className={styles.p}>
        Permitted development rights differ sharply by format, and the differences are where projects fail. Rear
        extensions are the most generous. Side extensions are conditional. Wraparounds are tested twice. Two-storey
        side extensions have no rights at all.
      </p>
      <figure className={styles.figure}>
        <Image
          src={permittedDevelopmentDecisionGuideImg}
          alt="Better Homes four-step permitted development decision guide for London house extensions."
          width={1200}
          height={1200}
          sizes="(max-width: 768px) 100vw, 1000px"
          className={styles.image}
        />
        <figcaption className={styles.figcaption}>
          A four-check planning screen to run before commissioning detailed drawings.
        </figcaption>
      </figure>
      <p className={styles.p}>
        A single storey rear extension qualifies at up to 3m beyond the original rear wall on a terraced or
        semi-detached house and 4m on a detached one, at a maximum height of 4m, with eaves capped at 3m where it comes
        within 2m of a boundary. The larger home extension route takes that to 6m and 8m via prior approval – £249, with
        a 42-day neighbour consultation. A single storey side extension must be no wider than half the original house and
        no more than 4m high, and on designated land, including conservation areas, side extensions are not permitted
        development at all. A wraparound is assessed as a rear enlargement and a side enlargement simultaneously, so it
        can fail even when each element passes alone. A two-storey rear extension must sit at least 7m from the rear
        boundary, which most London terraces cannot satisfy.
      </p>
      <p className={styles.p}>
        Fees moved on 1 April 2026: £548 for a householder application, £274 for a lawful development certificate for
        proposed works, and eight weeks statutory determination from validation. Buy the certificate even where no
        application is needed – it is the document your buyer&apos;s solicitor will ask for. Our{" "}
        <Link href="/blog/permitted-development-guide">permitted development guide</Link> works through the conditions in
        full, and <Link href="/blog/planning-permission-refused-london">why London extensions get refused</Link> covers
        the recovery route if a decision goes against you.
      </p>
      <p className={styles.p}>
        One trap catches people every year. Your allowance is measured against the original house – as first built, or as
        it stood on 1 July 1948. A previous owner&apos;s rear addition counts against your budget even though you did not
        build it. We have surveyed E17 terraces where a 1990s kitchen addition had already consumed the full 3m, leaving
        the current owner with no permitted development depth at all.
      </p>

      {/* ── SECTION 11 ──────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="party-wall-by-type">Party wall exposure by extension type</h2>
      <p className={styles.p}>
        Each extension type triggers a different section of the Party Wall etc. Act 1996, and the format changes both cost
        and timeline. Budget £900–£1,500 where one agreed surveyor acts, and £1,500–£3,600 per affected neighbour where
        each side appoints separately.
      </p>
      <p className={styles.p}>
        A rear extension bearing steel into the shared wall triggers a Section 3 party structure notice. A side return or
        infill extension usually builds a new flank wall on the boundary line, triggering a Section 1 line of junction
        notice – served on a neighbour who may have no interest in your project. Excavating within 3m of a neighbouring
        building and deeper than its foundations triggers Section 6, which covers most extension footings and all basement
        work. A wraparound can trigger all three, with two neighbours. Serve notice two months before your intended start:
        neighbours have 14 days to respond, and silence counts as dissent.
      </p>

      {/* ── SECTION 12 ──────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="combining-types">Combining extension types in a single build</h2>
      <p className={styles.p}>
        The best-value projects we run are rarely one format. A rear extension and a loft conversion delivered as a single
        programme share one scaffold, one party wall award, one building control application and one set of preliminaries –
        typically 8% to 12% cheaper than running them two years apart, before you count the second round of dust and skips
        you avoid. Combinations that work: rear plus loft, side return plus loft, wraparound plus loft, garage conversion
        plus over-structure above it. Combinations that need care: basement plus anything, where underpinning dictates the
        programme, and double storey plus loft, where the roof structure is doing two jobs.
      </p>
      <p className={styles.p}>
        This is where a design-and-build model earns its fee. When one team holds the design, the planning strategy, the
        structural package and the build, the sequencing decision gets made once, by the people who carry the consequences.
        Split the work between an architect who hands you a drawing and a contractor who prices it eight months later, and
        that decision gets made by whoever is on site that week. Single-point responsibility is the core of{" "}
        <Link href="/house-extension">our London house extension service</Link>.
      </p>

      {/* ── QUICK TAKEAWAYS ─────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="quick-takeaways">Quick takeaways</h2>
      <p className={styles.p}>
        • Nine formats cover almost every London project: rear, side return, wraparound, double storey, over-structure,
        loft, basement, garage conversion, glazed extension.
      </p>
      <p className={styles.p}>
        • Cost per square metre kept beats cost per square metre built on any short plot.
      </p>
      <p className={styles.p}>
        • Conservation areas remove permitted development for side extensions entirely.
      </p>
      <p className={styles.p}>
        • Wraparounds are tested as both rear and side enlargements, so they fail permitted development more often than
        their size suggests.
      </p>
      <p className={styles.p}>
        • Build a loft and an extension together and save 8–12% against doing them separately.
      </p>

      {/* ── CONCLUSION ──────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="conclusion">Choosing the right extension for your London home</h2>
      <p className={styles.p}>
        The homeowners who get this right start from the property, not the format. They measure the side return, check the
        distance to the rear boundary, find out what a previous owner already built, and read the constraints layer before
        anyone draws anything. By the time they speak to a designer, three of the nine types of house extensions have been
        eliminated on evidence rather than opinion.
      </p>
      <p className={styles.p}>
        That front-loaded work separates a project that lands on budget from one that finds a shallow garage foundation in
        week six. BH Studio has delivered more than 300 projects across Central, East and North London, carries £10M insurance
        and a ten-year workmanship guarantee, and holds design and build under one contract – so the team telling you a
        wraparound is achievable on your plot is the team that has to make it stand up. Bring your measurements and your title
        plan to a feasibility conversation and we will tell you which formats are realistic, what they cost and what the
        planning route looks like, including when the format you had in mind is the wrong one. See examples of each type in our{" "}
        <Link href="/portfolio">project portfolio</Link>, or start with{" "}
        <Link href="/blog/house-extension-guide-2025">our complete London house extension guide</Link>.
      </p>

      {/* ── ENGAGEMENT ──────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="join-the-conversation">Join the conversation</h2>
      <p className={styles.p}>
        Which type are you leaning towards – and what is stopping you? Post your plot width, garden depth and borough in the
        comments and we will tell you which formats are worth pricing. If this guide helped you rule something out, send it
        to the neighbour about to make the same decision.
      </p>

      {/* ── FAQ ─────────────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="faqs">Frequently asked questions</h2>

      <h3 className={styles.h3}>What are the most popular types of house extensions in London?</h3>
      <p className={styles.p}>
        Single storey rear extensions, side returns and wraparounds dominate, because most London stock is Victorian or
        Edwardian terraced property with a rear closet wing and a narrow side alley. Loft conversions run a close fourth,
        often built alongside a ground-floor extension.
      </p>

      <h3 className={styles.h3}>What is the cheapest type of house extension?</h3>
      <p className={styles.p}>
        A garage conversion, at roughly £1,400–£2,200 per m² in London, or £22,000–£33,000 for a standard single garage –
        the shell exists, so you pay for insulation, an infill wall, services and finishes, not foundations and a roof.
      </p>

      <h3 className={styles.h3}>Is a side return or a rear extension better for a terraced house?</h3>
      <p className={styles.p}>
        A side return is better when the ground floor is narrow, dark in the middle, or the garden is short. A rear extension
        is better when the layout works and you need more of it. With a side return wider than 1.2m and a long garden, a
        wraparound gives you both.
      </p>

      <h3 className={styles.h3}>Do I need planning permission for a wraparound extension?</h3>
      <p className={styles.p}>
        Almost always. A wraparound is assessed as a rear enlargement and a side enlargement at the same time and usually
        fails at least one test – particularly in a conservation area, where side extensions have no permitted development
        rights. Budget £548 and eight weeks for a decision.
      </p>

      <h3 className={styles.h3}>Is a double storey extension cheaper per square metre than a single storey?</h3>
      <p className={styles.p}>
        Yes. Foundations, scaffold and roof serve both floors, so the second storey adds 50–70% to cost while doubling floor
        area. Expect £2,800–£4,200 per m² across both levels in London, against £2,800–£4,500 per m² for a single storey.
      </p>

      <h3 className={styles.h3}>What is an infill extension?</h3>
      <p className={styles.p}>
        An infill extension fills the gap between existing parts of the building, most often the side return alley beside a
        rear closet wing. Construction matches a side return extension, and it usually means building a new flank wall on the
        boundary – which triggers a line of junction notice under the Party Wall etc. Act.
      </p>

      <h3 className={styles.h3}>Which type of house extension adds the most value in London?</h3>
      <p className={styles.p}>
        Formats that add a bedroom typically outperform those adding only living space, which favours double storey extensions
        and loft conversions. Open-plan kitchen extensions perform strongly where the kitchen is currently small or cut off from
        the garden. Detached garden rooms add least, being commonly excluded from gross internal area.
      </p>

      {/* ── REFERENCES ──────────────────────────────────────────────────── */}
      <h2 className={styles.h2} id="references">References</h2>
      <p className={styles.p}>
        1. GOV.UK – <a href="https://www.gov.uk/government/publications/permitted-development-rights-for-householders-technical-guidance" target="_blank" rel="noopener noreferrer">Permitted development rights for householders: technical guidance</a> – source for the 3m/4m, 6m/8m, half-width and 7m boundary conditions.
      </p>
      <p className={styles.p}>
        2. Planning Portal – <a href="https://www.planningportal.co.uk/permission/common-projects/extensions" target="_blank" rel="noopener noreferrer">House extensions: permission and rules</a> – conditions for rear and side extensions, including designated land.
      </p>
      <p className={styles.p}>
        3. GOV.UK – <a href="https://www.gov.uk/government/publications/party-wall-etc-act-1996-guidance" target="_blank" rel="noopener noreferrer">Party Wall etc. Act 1996: explanatory booklet</a> – Sections 1, 3 and 6 notices.
      </p>
      <p className={styles.p}>
        4. GOV.UK – <a href="https://www.gov.uk/building-regulations-approval" target="_blank" rel="noopener noreferrer">Building regulations approval</a> – applies to every extension type.
      </p>
      <p className={styles.p}>
        5. GOV.UK – <a href="https://www.gov.uk/government/collections/planning-applications-statistics" target="_blank" rel="noopener noreferrer">Planning application statistics</a> – householder decision volumes and determination periods.
      </p>
    </article>
  );
}

/*
SCHEMA REQUIREMENTS
-------------------
1. Article schema
   - headline: "Types of House Extensions in London: 2026 Guide"
   - author: { "@type": "Person", "name": "Gino S.", "url": "https://bhstudio.co.uk/blog/author/gino" }
   - publisher: { "@type": "Organization", "name": "Better Homes", logo: better-homes-logo.svg }
   - datePublished: [ISO 8601]  |  dateModified: [ISO 8601 – refresh on every edit]
   - image: /assets/blog/house-extension-types/better-homes-extension-hero.png
   - mainEntityOfPage: https://bhstudio.co.uk/blog/house-extension-types
   - canonical: https://bhstudio.co.uk/blog/house-extension-types (unchanged)
   - datePublished: KEEP the original 2025 date. Only dateModified changes.

2. FAQPage schema – all 7 Q&As in #faqs, verbatim.

3. BreadcrumbList – Home > Blog > Extensions > Types of House Extensions in London.

4. No redirect. URL, canonical and existing internal links stay as they are.
   On publish: update <lastmod> in the sitemap and request re-indexing in GSC so the
   rewrite is crawled quickly rather than on the old cadence.
*/
